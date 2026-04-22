/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Terminal, 
  Search, 
  Loader2, 
  ChevronRight, 
  FileText, 
  Sparkles,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { generateReadme } from "@/src/services/geminiService";
import { MarkdownPreview } from "@/src/components/MarkdownPreview";

interface RepoData {
  name: string;
  full_name: string;
  description: string;
  topics: string[];
  default_branch: string;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<RepoData | null>(null);

  const fetchRepoData = async (githubUrl: string) => {
    setError(null);
    setLoading(true);
    setReadme(null);
    
    try {
      // Parse URL
      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) throw new Error("Invalid GitHub URL. Please use https://github.com/owner/repo format.");
      
      const [_, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");
      
      setStatus(`Fetching repository info for ${owner}/${cleanRepo}...`);
      const repoRes = await fetch(`/api/github/repos/${owner}/${cleanRepo}`);
      if (!repoRes.ok) throw new Error("Repository not found or API limit exceeded.");
      const repoData: RepoData = await repoRes.json();
      setRepoInfo(repoData);

      setStatus("Fetching file structure...");
      const treeRes = await fetch(`/api/github/repos/${owner}/${cleanRepo}/git/trees/${repoData.default_branch}?recursive=1`);
      const treeData = await treeRes.json();
      const files = treeData.tree
        .filter((item: any) => item.type === "blob")
        .map((item: any) => item.path);
      
      const fileTreeString = files.join("\n");

      // Select key files to read for context
      const priorityFiles = [
        "package.json",
        "requirements.txt",
        "go.mod",
        "cargo.toml",
        "index.js",
        "index.ts",
        "App.tsx",
        "main.py",
        "src/main.ts",
        "docker-compose.yml"
      ];
      
      const keyFilesToFetch = files
        .filter((path: string) => 
          priorityFiles.some(f => path.endsWith(f)) || path.split("/").length === 1
        )
        .slice(0, 5); // Limit to top 5 key files for token safety

      setStatus(`Analyzing ${keyFilesToFetch.length} key files...`);
      const keyFilesContents: Record<string, string> = {};
      
      for (const filePath of keyFilesToFetch) {
        const fileRes = await fetch(`/api/github/repos/${owner}/${cleanRepo}/contents/${filePath}`);
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          const decoded = atob(fileData.content.replace(/\n/g, ""));
          keyFilesContents[filePath] = decoded.slice(0, 3000); // Sample first 3k chars
        }
      }

      setStatus("Polishing AI generation...");
      const generated = await generateReadme({
        name: repoData.name,
        description: repoData.description,
        fileTree: fileTreeString.slice(0, 2000), // Safety truncation
        keyFiles: keyFilesContents,
        topics: repoData.topics
      });

      setReadme(generated);
      setStatus("Done!");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReadme(null);
    setRepoInfo(null);
    setUrl("");
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-accent-purple selection:text-white">
      {/* Sidebar Branding */}
      <div className="w-24 bg-black border-r border-white/20 flex flex-col justify-between items-center py-10 shrink-0">
        <div className="text-[10px] font-black tracking-[0.2em] uppercase vertical-text opacity-30">EST. 2026</div>
        <div className="text-3xl font-black italic select-none">R.</div>
        <div className="text-[10px] font-black tracking-[0.2em] uppercase vertical-text opacity-30 italic">AUTO-FACTORY</div>
      </div>

      <div className="flex-1 flex flex-col p-12 overflow-x-hidden">
        {/* Header Block */}
        <header className="flex justify-between items-start mb-16">
          <div className="space-y-1">
            <p className="text-[10px] font-black tracking-widest uppercase opacity-50">AI Documentation Engine</p>
            <h1 className="text-5xl font-black tracking-tighter uppercase">README.ai</h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase opacity-30 mb-1">Processor</p>
            <p className="text-xl font-mono font-bold italic tracking-tighter overflow-hidden">
              <span className="text-accent-purple">G3</span>-FLASH
            </p>
          </div>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {!readme ? (
              <motion.div
                key="input-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-12 gap-16 h-full items-center"
              >
                {/* Input Section */}
                <div className="col-span-12 lg:col-span-6 flex flex-col space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-massive">
                      Link<br />Your<br /><span className="text-accent-purple tracking-normal">Repo</span>
                    </h2>
                    <p className="text-xl opacity-60 max-w-sm font-medium leading-tight">
                      Transform raw architectural patterns into a professional narrative in seconds.
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => { e.preventDefault(); if(url) fetchRepoData(url); }}
                    className="space-y-8"
                  >
                    <div className="group relative">
                      <label className="absolute -top-3 left-6 bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-white/20">
                        Github Repository Path
                      </label>
                      <div className="flex border-thick group-focus-within:border-accent-purple transition-colors bg-white/5">
                        <div className="flex items-center justify-center px-6 border-r border-white/20">
                          <Github size={24} className="opacity-30 group-focus-within:opacity-100" />
                        </div>
                        <input
                          type="text"
                          placeholder="owner / repository"
                          className="flex-1 bg-transparent p-8 text-xl font-bold font-mono focus:outline-none placeholder:opacity-20 uppercase tracking-tighter"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      disabled={loading || !url}
                      className={cn(
                        "w-full group flex items-center justify-center gap-6 p-8 bg-white text-black font-black text-2xl uppercase tracking-tighter transition-all",
                        (loading || !url) ? "opacity-30 grayscale cursor-not-allowed" : "hover:bg-accent-purple hover:text-white active:scale-[0.98]"
                      )}
                    >
                      <span>{loading ? status : "GENERATE README.MD"}</span>
                      {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <ChevronRight size={24} />
                      )}
                    </button>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 border-4 border-red-500 bg-red-500/10 text-red-500 flex items-center gap-4"
                      >
                        <AlertCircle className="shrink-0" size={20} />
                        <span className="font-mono text-xs font-black uppercase tracking-widest">{error}</span>
                      </motion.div>
                    )}
                  </form>
                </div>

                {/* Aesthetic Visual Side */}
                <div className="hidden lg:flex col-span-6 flex-col items-end opacity-20 pointer-events-none select-none">
                  <div className="text-[200px] font-black leading-none italic tracking-tighter">DATA</div>
                  <div className="text-[200px] font-black leading-none tracking-tighter mt-[-40px]">0101</div>
                  <div className="text-[100px] font-black italic tracking-[0.5em] mt-8">DOCS_V1</div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="output-view"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-8 border-white pb-10">
                  <div className="space-y-6">
                    <button 
                      onClick={handleReset}
                      className="group flex items-center gap-3 px-4 py-2 border-2 border-white/20 hover:border-white transition-colors"
                    >
                      <ArrowLeft size={16} /> 
                      <span className="font-mono text-xs font-black uppercase tracking-widest mt-0.5">Reset Engine</span>
                    </button>
                    <div className="flex items-baseline gap-6">
                      <h2 className="text-7xl font-black uppercase tracking-tighter shrink-0">{repoInfo?.name}</h2>
                      <span className="font-mono text-[10px] uppercase font-black tracking-widest opacity-30 italic truncate">
                        // BUILD_IDENTIFIED: SUCCESS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-12 xl:col-span-9">
                    <MarkdownPreview content={readme} />
                  </div>
                  <div className="col-span-12 xl:col-span-3 space-y-12">
                    <div className="bg-accent-purple p-8 rounded-sm space-y-8 shadow-[12px_12px_0px_#FFFFFF]">
                      <div className="font-mono text-[10px] uppercase font-black tracking-widest flex items-center gap-3">
                         <FileText size={14} /> Intelligence Meta
                      </div>
                      <div className="space-y-6">
                        <div>
                          <p className="font-mono text-[9px] uppercase font-bold opacity-60 mb-1 leading-none">Repo Reference</p>
                          <p className="font-sans text-lg font-black uppercase leading-[1]">{repoInfo?.full_name}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase font-bold opacity-60 mb-2 leading-none">Tags Extracted</p>
                          <div className="flex flex-wrap gap-2">
                            {repoInfo?.topics.map(t => (
                              <span key={t} className="px-3 py-1 bg-black/20 text-[10px] uppercase font-black tracking-tighter italic">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 border-thick space-y-6">
                      <h3 className="font-mono text-xs font-black uppercase tracking-[0.2em] italic">System Notice</h3>
                      <p className="font-sans text-xs leading-relaxed opacity-60 font-medium">
                        DOCUMENTATION GENERATED USING TOP-TIER ARCHITECTURAL ANALYSIS. 
                        CONSISTENCY IS VALIDATED AGAINST PRIMARY ENTRY POINTS.
                        VERIFY INSTALLATION VECTORS BEFORE COMMIT.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="flex gap-12">
            <div>
              <p className="text-[9px] font-black uppercase opacity-30 mb-2">Capabilities</p>
              <p className="text-xs font-black tracking-widest uppercase">NODE / PY / GO / RS</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase opacity-30 mb-2">Engine Integrity</p>
              <p className="text-xs font-black tracking-widest uppercase text-green-500">100% Nominal</p>
            </div>
          </div>
          <div className="text-[10px] font-mono opacity-20 uppercase tracking-[0.3em] italic">
            // SESSION_ID: AIS-2026-XQ //
          </div>
        </footer>
      </div>
    </div>
  );
}

