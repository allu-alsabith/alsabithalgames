import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { GAMES_DATA } from "./src/data/gamesData";
import { createZipBuffer, generatePortableGamePayload, generateTorrentBuffer } from "./server/downloadHelper";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Direct Download Endpoint (alsabithalgames direct portable download)
  app.get("/api/download/:gameId", (req, res) => {
    try {
      const { gameId } = req.params;
      const node = (req.query.node as string) || "Frankfurt NVMe Core";

      const lookupId = gameId.toLowerCase();
      const game = GAMES_DATA.find(
        (g) =>
          g.id.toLowerCase() === lookupId ||
          g.slug.toLowerCase() === lookupId ||
          g.steamAppId.toString() === lookupId ||
          g.id.toLowerCase().includes(lookupId) ||
          g.slug.toLowerCase().includes(lookupId)
      );
      if (!game) {
        return res.status(404).send("Game not found in alsabithalgames library.");
      }

      const files = generatePortableGamePayload(game, node);
      const zipBuffer = createZipBuffer(files);

      const cleanVersion = (game.version || '1.0').replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${game.slug || game.id}_v${cleanVersion}_PreInstalled_FullGame_alsabithalgames.zip`;

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", zipBuffer.length.toString());
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("X-Direct-Provider", "alsabithalgames-Direct-CDN");
      res.setHeader("X-Node", node);
      res.setHeader("X-Clean-Verified", "0/72-Microsoft-Defender");

      return res.send(zipBuffer);
    } catch (err) {
      console.error("Direct download error:", err);
      return res.status(500).send("Error generating direct portable download package.");
    }
  });

  // Authentic Bencoded .torrent file download (alsabithalgames Torrent Support)
  app.get("/api/torrent/:gameId", (req, res) => {
    try {
      const { gameId } = req.params;
      const lookupId = gameId.toLowerCase();
      const game = GAMES_DATA.find(
        (g) =>
          g.id.toLowerCase() === lookupId ||
          g.slug.toLowerCase() === lookupId ||
          g.steamAppId.toString() === lookupId ||
          g.id.toLowerCase().includes(lookupId) ||
          g.slug.toLowerCase().includes(lookupId)
      );
      if (!game) {
        return res.status(404).send("Game not found in alsabithalgames library.");
      }

      const torrentBuffer = generateTorrentBuffer(game);
      const filename = `${game.slug || game.id}_v${(game.version || '1.0').replace(/[^a-zA-Z0-9.]/g, '_')}_alsabithalgames.torrent`;

      res.setHeader("Content-Type", "application/x-bittorrent");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", torrentBuffer.length.toString());
      res.setHeader("Cache-Control", "no-cache");
      return res.send(torrentBuffer);
    } catch (err) {
      console.error("Torrent generation error:", err);
      return res.status(500).send("Error generating torrent file.");
    }
  });

  // Direct CDN Link metadata & IDM curl snippet
  app.get("/api/download/direct-link/:gameId", (req, res) => {
    const { gameId } = req.params;
    const lookupId = gameId.toLowerCase();
    const game = GAMES_DATA.find(
      (g) =>
        g.id.toLowerCase() === lookupId ||
        g.slug.toLowerCase() === lookupId ||
        g.steamAppId.toString() === lookupId ||
        g.id.toLowerCase().includes(lookupId) ||
        g.slug.toLowerCase().includes(lookupId)
    );
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const directDownloadUrl = `${baseUrl}/api/download/${game.id}`;

    return res.json({
      gameId: game.id,
      gameTitle: game.title,
      slug: game.slug,
      version: game.version,
      fileSize: game.size,
      directUrl: directDownloadUrl,
      idmCommand: `aria2c -x 16 -s 16 -k 1M -o "${game.slug}_Portable_alsabithalgames.zip" "${directDownloadUrl}"`,
      curlCommand: `curl -L -O "${directDownloadUrl}"`,
      sha256Hash: game.sha256Hash,
      cleanStatus: game.cleanStatus,
      nodes: [
        {
          id: "frankfurt",
          name: "Frankfurt NVMe Core",
          country: "Germany",
          flag: "🇩🇪",
          bandwidth: "10 Gbps Unmetered",
          status: "optimal",
          latencyMs: 14,
          url: `${directDownloadUrl}?node=Frankfurt+NVMe+Core`,
        },
        {
          id: "virginia",
          name: "Virginia Edge CDN",
          country: "United States",
          flag: "🇺🇸",
          bandwidth: "10 Gbps Unmetered",
          status: "optimal",
          latencyMs: 22,
          url: `${directDownloadUrl}?node=Virginia+Edge+CDN`,
        },
        {
          id: "singapore",
          name: "Singapore APAC Hub",
          country: "Singapore",
          flag: "🇸🇬",
          bandwidth: "10 Gbps Unmetered",
          status: "optimal",
          latencyMs: 38,
          url: `${directDownloadUrl}?node=Singapore+APAC+Hub`,
        },
      ],
    });
  });

  // Multi-turn Chat Endpoint with Gemini
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured on the server. Please add your key in AI Studio Settings > Secrets.",
        });
      }

      const { messages, gameContext, mode = "smart" } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Invalid or empty messages array." });
      }

      // Select model based on requested mode with automatic fallback if a model experiences quota limits
      const preferredModels =
        mode === "fast"
          ? ["gemini-3.1-flash-lite", "gemini-3.5-flash"]
          : mode === "complex"
          ? ["gemini-3.1-pro-preview", "gemini-3.5-flash", "gemini-3.1-flash-lite"]
          : ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash"];

      let systemInstruction = `You are the official alsabithalgames AI Gaming & Technical Support Assistant on alsabithalgames.net.
alsabithalgames is a safe, community-supported PC game vault offering pre-installed, portable PC games with fast direct mirrors (Buzzheavier, Gofile, 1fichier, MegaDB) and verified torrents.

Your core roles and specialties:
1. Game Intelligence & Guidance:
   - Explain story background, mechanics, controls, difficulty options, secret unlockables, and DLC features.
   - Clarify game versions, updates, and hotfixes.
2. PC System Compatibility & Performance:
   - Evaluate user hardware (CPU, GPU, RAM, VRAM, Windows OS version, SSD space).
   - Compare with game minimum/recommended system requirements.
   - Give realistic expected FPS (e.g. 1080p 60fps vs 1440p) and graphic settings recommendations (Low / Medium / High / Ultra).
   - Advise on DLSS / FSR / XeSS upscaling and frame generation tweaks.
3. Technical Troubleshooting & Fixes:
   - Antivirus False Positives: Clearly explain that modified Steam emulator DLLs (steam_api64.dll, Goldberg, OnlineFix64.dll, Empress/CODEX) are flagged by Windows Defender as "HackTool:Win32/Crack" or "Trojan:Win32/GameHack" purely because they bypass DRM licensing checks. Reassure the user that alsabithalgames files are clean, and explain step-by-step how to add an exclusion folder in Windows Security (Virus & threat protection settings -> Exclusions -> Add an exclusion -> Folder).
   - Missing DLL Errors: Advise installing the Visual C++ Redistributable All-In-One (2005-2022) and DirectX End-User Runtimes (June 2010), both found in the game's _Redist folder or available from official Microsoft mirrors.
   - ISDone.dll / Unarc.dll errors: Explain that this is an archive decompressor memory error. Fixes include: increasing Windows Virtual Memory / Paging File (set custom size to 16384 MB - 32768 MB), temporarily turning off real-time antivirus scan during extraction, extracting to a short path (e.g. C:\\Games), or checking archive MD5/SHA.
   - Game doesn't launch / Black screen: Suggest running the game .exe as Administrator, running in Windows 8 compatibility mode, or adding -dx11 to shortcut arguments.
4. Online-Fix & Multiplayer Assistance:
   - Guide users through LAN or Online-Fix Steam co-op steps (e.g. keeping Steam client running in the background, joining the same server/region, sending invites through Steam Shift+Tab overlay).
5. Smart Recommendations & Mods:
   - Suggest similar titles based on genre (Racing like NFS, Action RPG like Elden Ring, Shooters, etc.).
   - Explain how to install safe mods, FPS unlockers, or ultrawide patches.

Formatting Guidelines:
- Use clean Markdown with headers, bold text, bullet points, and code snippets where helpful.
- Be friendly, clear, and reassuring. Keep answers actionable without unhelpful filler.`;

      if (gameContext) {
        systemInstruction += `\n\nACTIVE GAME IN CONTEXT:
- Title: ${gameContext.title || "Unknown"}
- Version: ${gameContext.version || "Latest"}
- Developer: ${gameContext.developer || "N/A"} | Publisher: ${gameContext.publisher || "N/A"}
- Genres: ${Array.isArray(gameContext.genres) ? gameContext.genres.join(", ") : "N/A"}
- Download Size: ${gameContext.size || "N/A"}
- Online-Fix Multiplayer: ${gameContext.hasOnlineFix ? "Yes (" + (gameContext.onlineFixNote || "Co-op / LAN included") + ")" : "Singleplayer"}
- Minimum Requirements: OS: ${gameContext.requirements?.minimum?.os || "Windows 10 64-bit"}, CPU: ${gameContext.requirements?.minimum?.processor || "N/A"}, RAM: ${gameContext.requirements?.minimum?.memory || "N/A"}, GPU: ${gameContext.requirements?.minimum?.graphics || "N/A"}, Storage: ${gameContext.requirements?.minimum?.storage || "N/A"}
- Recommended Requirements: OS: ${gameContext.requirements?.recommended?.os || "Windows 10/11 64-bit"}, CPU: ${gameContext.requirements?.recommended?.processor || "N/A"}, RAM: ${gameContext.requirements?.recommended?.memory || "N/A"}, GPU: ${gameContext.requirements?.recommended?.graphics || "N/A"}, Storage: ${gameContext.requirements?.recommended?.storage || "N/A"}
- Included DLCs: ${Array.isArray(gameContext.includedDLCs) ? gameContext.includedDLCs.join(", ") : "All DLCs included"}
- Key Features: ${Array.isArray(gameContext.features) ? gameContext.features.join("; ") : "N/A"}`;
      }

      // Convert messages to Gemini contents format
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.content || "" }],
      }));

      const ai = getAiClient();
      let responseText = "";
      let modelUsed = "";
      let lastError: any = null;

      // Try preferred models in sequence in case of quota or model unavailability
      for (const candidateModel of preferredModels) {
        try {
          const response = await ai.models.generateContent({
            model: candidateModel,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response.text) {
            responseText = response.text;
            modelUsed = candidateModel;
            break;
          }
        } catch (candidateErr: any) {
          console.warn(`Model ${candidateModel} failed: ${candidateErr?.message || candidateErr}`);
          lastError = candidateErr;
          // Continue to next fallback model in list
        }
      }

      if (!responseText) {
        throw lastError || new Error("Failed to generate response from Gemini API.");
      }

      return res.json({
        reply: responseText,
        modelUsed,
      });
    } catch (err: unknown) {
      console.error("Gemini Chat API Error:", err);
      const message = err instanceof Error ? err.message : "Internal Server Error during AI generation.";
      return res.status(500).json({ error: message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`alsabithalgames Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
