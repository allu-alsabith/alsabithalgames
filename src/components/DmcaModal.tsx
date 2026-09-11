import React, { useState } from 'react';
import { X, FileText, ShieldAlert, Check, Mail, Send } from 'lucide-react';

interface DmcaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DmcaModal: React.FC<DmcaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [workDescription, setWorkDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">DMCA Copyright Policy</h2>
              <p className="text-xs text-slate-400">Digital Millennium Copyright Act Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            alsabithal Games respects the intellectual property of others and complies with the <strong>Digital Millennium Copyright Act (17 U.S.C. § 512)</strong>. It is our policy to respond expeditiously to clear notices of alleged copyright infringement.
          </p>
          <p>
            alsabithal Games operates as an informational directory and search index. We do not host copyrighted game binaries on our primary web servers; download links point to third-party cloud file hosts (Buzzheavier, Gofile, 1fichier, MegaDB).
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
              Required Information for DMCA Notice:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-300">
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material or URL on alsabithal Games that is claimed to be infringing.</li>
              <li>Your contact information (full name, company, email address, physical address).</li>
              <li>A statement of good faith belief that the disputed use is not authorized by the copyright owner.</li>
              <li>A statement made under penalty of perjury that the information is accurate and you are authorized to act on behalf of the owner.</li>
              <li>An electronic or physical signature of the authorized agent.</li>
            </ul>
          </div>

          <p className="text-slate-400 text-[11px]">
            Send all official DMCA requests directly to our designated agent at:{' '}
            <a href="mailto:amhereitsmeal@gmail.com" className="text-emerald-400 hover:underline font-mono font-bold">
              amhereitsmeal@gmail.com
            </a>
            . Valid notices are processed and links removed within 24–48 hours.
          </p>
        </div>

        {/* Quick Takedown Form */}
        <div className="pt-2 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Submit Takedown Request Online
          </h3>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Notice Received</p>
                <p className="text-[11px] text-emerald-400/80">
                  Your DMCA request has been logged and transmitted to amhereitsmeal@gmail.com. Our compliance team will review and process the requested removal within 24 hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Copyright Owner / Entity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bandai Namco Entertainment"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="amhereitsmeal@gmail.com"
                    defaultValue="amhereitsmeal@gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Infringing Game Page URL or Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elden Ring or Game URL"
                  value={infringingUrl}
                  onChange={(e) => setInfringingUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Statement of Ownership & Good Faith</label>
                <textarea
                  rows={2}
                  required
                  placeholder="I declare under penalty of perjury that I am authorized to act on behalf of the copyright holder..."
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Takedown
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
