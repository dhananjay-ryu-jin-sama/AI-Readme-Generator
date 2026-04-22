import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateReadme(repoContext: {
  name: string;
  description: string;
  fileTree: string;
  keyFiles: Record<string, string>;
  topics: string[];
}) {
  const prompt = `
You are an expert technical writer and developer advocate. Your task is to generate a fantastic, professional, and comprehensive README.md file for the following GitHub repository.

REPOSITORY CONTEXT:
- Name: ${repoContext.name}
- Description: ${repoContext.description || "No description provided."}
- Topics: ${repoContext.topics.join(", ") || "None"}

FILE STRUCTURE:
${repoContext.fileTree}

KEY FILE CONTENTS:
${Object.entries(repoContext.keyFiles)
  .map(([path, content]) => `--- FILE: ${path} ---\n${content}`)
  .join("\n\n")}

REQUIREMENTS:
1. Use professional, clear, and engaging language.
2. Include a clear Title and Description.
3. Feature a "Key Features" section.
4. Provide clear "Getting Started" or "Installation" instructions based on the files provided (e.g., detect if it's npm, python, go, etc.).
5. Include "Usage" examples if possible.
6. Add "Project Structure" overview.
7. Include "Contributing" and "License" sections (if license not found, suggest standard MIT or similar).
8. Use high-quality Markdown formatting (badges, emojis where appropriate but keep it professional, clean headers).
9. Make sure to explain WHAT the project does, WHY it exists, and HOW to use it.

Output ONLY the raw markdown content for the README.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate README. Please try again.");
  }
}
