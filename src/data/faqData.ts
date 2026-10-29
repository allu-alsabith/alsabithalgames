import { FaqItem } from '../types';

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'download',
    question: 'What is a "Pre-installed / Portable" PC game?',
    answer: 'A pre-installed (portable) PC game is already unpacked and ready to run immediately after extraction. You do not have to run lengthy setup installers, mount ISOs, or manually copy cracks into folders. All updates, DLCs, and required crack emulators are already integrated. Simply extract the archive with NanaZip or WinRAR and run the main game .exe file as Administrator.',
  },
  {
    id: 'faq-2',
    category: 'antivirus',
    question: 'Why does Windows Defender flag steam_api64.dll or crack files?',
    answer: 'This is known in the security industry as a "False Positive". Antivirus programs (like Microsoft Defender, Malwarebytes, or Norton) automatically flag modified Steam emulator DLLs (such as steam_api.dll, steam_api64.dll, Goldberg, or OnlineFix64.dll) as "HackTool", "Crack", or "Riskware" because they bypass Steam DRM to let the game run without an active purchase. Every game on alsabithalgames is manually tested and verified safe on a clean system before being uploaded. To prevent Windows Defender from quarantining these files, we advise adding the game extraction folder to your Antivirus Exclusions list.',
  },
  {
    id: 'faq-3',
    category: 'download',
    question: 'How do I download faster from Buzzheavier, Gofile, or 1fichier?',
    answer: 'We strongly recommend using a download manager such as Free Download Manager (FDM) or Internet Download Manager (IDM). Download managers establish multiple simultaneous connections (multi-threading), resume interrupted downloads automatically, and bypass browser single-connection speed limits to achieve your full internet bandwidth.',
  },
  {
    id: 'faq-4',
    category: 'troubleshooting',
    question: 'The game crashes or says "MSVCP140.dll / VCRUNTIME140.dll missing" or "DirectX error"?',
    answer: 'This error occurs when your Windows installation is missing essential gaming runtime libraries. To fix this permanently: 1) Download and install the "Visual C++ Redistributable All-in-One" package (from 2005 through 2022, both x86 and x64); 2) Run the DirectX End-User Runtime Web Installer from Microsoft; 3) Update your graphics card drivers to the latest version (NVIDIA GeForce, AMD Adrenalin, or Intel Arc).',
  },
  {
    id: 'faq-5',
    category: 'troubleshooting',
    question: 'How do I change the game language?',
    answer: 'Most portable games store configuration settings in a file named "steam_emu.ini", "steam_settings.ini", or "OnlineFix.ini" located in the root game directory or inside the folder where the main executable resides. Open this .ini file with Notepad, find the line "Language=english", change it to your preferred language (e.g. "Language=spanish", "french", "german", "russian", "schinese"), and save the file.',
  },
  {
    id: 'faq-6',
    category: 'troubleshooting',
    question: 'Where are game save files stored?',
    answer: 'Depending on the Steam emulator used: 1) Goldberg / FLT: "%APPDATA%\\Goldberg SteamEmu Saves\\" or "%APPDATA%\\Roaming\\Steam\\CODEX\\<AppID>\\"; 2) Default Windows User: "%LOCALAPPDATA%\\<GameName>\\Saved\\SaveGames\\" or "%USERPROFILE%\\Documents\\<GameName>\\"; 3) Inside the game directory under "Save" or "UserData".',
  },
  {
    id: 'faq-7',
    category: 'multiplayer',
    question: 'How does Online-Fix multiplayer work for cracked games?',
    answer: 'Games marked with the "Online Fix" badge allow you to play multiplayer over Steam. They utilize a custom overlay that tricks Steam into believing you are running a free game like "Spacewar" (AppID 480). To play: 1) Launch your real Steam client and log into a secondary / burner account; 2) Launch the game via the designated launcher or executable; 3) Press Shift+Tab in-game to access the Steam overlay and invite your friends who have the exact same game version installed.',
  },
  {
    id: 'faq-8',
    category: 'general',
    question: 'Is an account required to download games on alsabithalgames?',
    answer: 'No! All game downloads are 100% free and do not require creating an account or providing an email. Creating a free account on alsabithalgames is only needed if you want to submit requests on the "Request Games" page, vote on community requests, leave comments, and bookmark games to your personal library.',
  },
  {
    id: 'faq-9',
    category: 'general',
    question: 'How does the "Request Games" system work?',
    answer: 'Users can submit any PC game available on Steam by pasting its Steam store URL. Once a game reaches 20 community upvotes, it is automatically queued for review. Our team verifies the game files, ensures crack stability and clean scan logs, and publishes the portable release to our fast mirrors—usually within 24 hours of approval.',
  },
];
