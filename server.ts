import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy to GitHub API to avoid CORS and handle potential token needs
  app.get("/api/github/*", async (req, res) => {
    try {
      const githubPath = req.params[0];
      const query = new URLSearchParams(req.query as any).toString();
      const url = `https://api.github.com/${githubPath}${query ? `?${query}` : ""}`;

      const headers: Record<string, string> = {
        "User-Agent": "README-AI-Generator",
        "Accept": "application/vnd.github.v3+json",
      };

      // Optional: Add GITHUB_TOKEN if provided in env
      if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json(errorData);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("GitHub Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch from GitHub" });
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server Start Error:", err);
});
