import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

if (!API_KEY) {
  console.error("Erro: API Key não definida. Configure no arquivo .env.");
  process.exit(1);
} 

async function GeminiService(prompt: string, options: { signal?: AbortSignal } = {}): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Verifica se a requisição foi cancelada antes de prosseguir
    if (options.signal?.aborted) {
      throw new Error("Requisição cancelada");
    }

    const result = await model.generateContent(prompt);
    if (options.signal?.aborted) {
      throw new Error("Requisição cancelada");
    }

    return result.response?.text() || "";
  }  catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao chamar a API:", error.message);
      return error.message;
    } else {
      console.error("Erro desconhecido:", error);
      return "Ocorreu um erro inesperado.";
    }
  }
}

export { GeminiService };
