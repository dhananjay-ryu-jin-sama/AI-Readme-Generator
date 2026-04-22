# README.ai 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blue?logo=googlegemini)](https://ai.google.dev/)

**README.ai** is a professional, AI-powered documentation tool designed to transform the way developers document their code. Leveraging the power of Google's Gemini AI, this application analyzes your project structure and core logic to generate comprehensive, high-quality `README.md` files in seconds.

## 🌟 Key Features

-   **Intelligent Project Analysis:** Automatically understands project context from file structures and code snippets.
-   **Gemini AI Integration:** Utilizes state-of-the-art Large Language Models to generate human-like, professional technical writing.
-   **Real-time Markdown Preview:** View your generated documentation instantly with a built-in Markdown renderer.
-   **Developer-Centric UI:** Built with React and TypeScript for a smooth, responsive, and type-safe user experience.
-   **Environment Ready:** Pre-configured for Google AI Studio deployments with seamless API key management.

## 🛠️ Tech Stack

-   **Frontend:** React 18, TypeScript, Vite
-   **Styling:** Tailwind CSS (via `src/index.css`)
-   **AI Engine:** Google Gemini API
-   **Backend/Server:** Node.js with TypeScript (`server.ts`)
-   **Tooling:** ESLint, PostCSS, Autoprefixer

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
-   An API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/AI-Readme-Generator.git
    cd AI-Readme-Generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file and add your credentials:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and provide your keys:
    ```env
    GEMINI_API_KEY="your_actual_gemini_api_key_here"
    APP_URL="http://localhost:5173"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 📖 Usage

1.  **Launch the App:** Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).
2.  **Input Project Details:** Provide your repository structure or key file contents into the generator interface.
3.  **Generate:** Click the "Generate README" button to initiate the Gemini AI analysis.
4.  **Preview & Edit:** Use the **Markdown Preview** component to review the generated output.
5.  **Export:** Copy the raw Markdown and paste it into your project's `README.md`.

## 📁 Project Structure

```text
├── src/
│   ├── components/       # UI Components (MarkdownPreview, etc.)
│   ├── services/         # Gemini API integration logic
│   ├── lib/              # Utility functions and helpers
│   ├── App.tsx           # Main application logic
│   └── main.tsx          # Application entry point
├── server.ts             # Server-side logic/API handling
├── metadata.json         # AI Studio app configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. (If not present, this project defaults to standard MIT guidelines).

---

Built with ❤️ by the AI-Readme-Generator Team. Reach out via GitHub Issues for support or feature requests!
