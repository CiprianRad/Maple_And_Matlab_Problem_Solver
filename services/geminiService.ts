
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, ProblemInput } from "../types";

export const generateMathSolutions = async (input: ProblemInput): Promise<GeneratedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are an expert in computational mathematics, Maple, MATLAB, and LaTeX.
    Your task is to solve two mathematical problems provided by the user: one in Maple and one in MATLAB.
    
    CRITICAL RULES:
    1. KEEP CODE SIMPLE: Use basic, readable functions. Avoid complex optimizations or "best practices" that obscure the simple logic.
    2. MAPLE OUTPUT: Provide the code as it would appear in a .mw file (textual script).
    3. MATLAB OUTPUT: Provide a clean .m script.
    4. RICH LATEX DOCUMENTATION (.tex):
       - Preamble: Include packages like amsmath, amssymb, graphicx, listings, tikz, and pgfplots.
       - Title/Author/Date: Professional header.
       - Abstract: A brief summary of the two problems.
       - Problem Statement: Detailed descriptions for both problems.
       - Mathematical Methodology: 
         * This section must be PURELY MATHEMATICAL.
         * Explain the theoretical context, formulas, and analytical steps.
         * If the problem requires approximations, describe the mathematical basis for these approximations (e.g., Taylor series, Riemann sums, numerical differentiation theory) in depth.
         * DO NOT mention Maple, MATLAB, or any software in this section.
       - Computational Implementation:
         * A dedicated section for Maple and one for MATLAB.
         * STEP-BY-STEP BREAKDOWN: For each software, walk through the generated script chronologically, step by step.
         * Explain what is happening at each discrete stage of the script:
            a) Initialization and parameter/variable definition.
            b) Mathematical function or model setup (how the equations were defined in the language).
            c) The execution of the core solver or calculation (e.g., explaining exactly what 'dsolve', 'int', 'ode45', or 'fsolve' is doing in this context).
            d) Post-processing, formatting, or result extraction.
         * DISCUSS THE ACTUAL CODE: Explicitly reference specific lines, variables, or blocks from the provided .mw and .m files. Explain how the syntax of each function call maps directly to the theoretical steps described in the methodology.
         * Provide clear running instructions for the .mw and .m files.
       - Visualizations: Include LaTeX code using 'tikz' or 'pgfplots' to create actual graphs representing the mathematical functions or numerical results.
       - Examples: Provide 2-3 similar example problems or variations to demonstrate the concepts further.
       - Conclusion: Summarize the findings and the implementation success.

    The response must be in valid JSON format matching the schema provided.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      Generate solutions and documentation for the following:
      Maple Problem: ${input.maplePrompt}
      MATLAB Problem: ${input.matlabPrompt}
    `,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mapleCode: { 
            type: Type.STRING, 
            description: "The simple Maple script content." 
          },
          matlabCode: { 
            type: Type.STRING, 
            description: "The simple MATLAB script content." 
          },
          latexContent: { 
            type: Type.STRING, 
            description: "The full, rich LaTeX documentation content with strict separation of theory and implementation, featuring a chronological step-by-step walkthrough of the code and TikZ graphs." 
          }
        },
        required: ["mapleCode", "matlabCode", "latexContent"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(response.text.trim()) as GeneratedContent;
};
