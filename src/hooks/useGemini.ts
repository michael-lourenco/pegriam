import { useState, useEffect } from "react";
import { GeminiService } from "@/services/gemini/GeminiService";

function extractTitle(htmlString:string): string {
  // Regex para encontrar o conteúdo entre as tags h2, considerando múltiplas linhas
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/;
  
  // Procura pelo match no htmlString
  const match = htmlString.match(h2Regex);
  
  // Retorna o conteúdo encontrado (removendo espaços extras) ou string vazia se não encontrar
  return match ? match[1].trim() : '';
}

export function useGemini(prompt: string, generateContent?: boolean) {
  const [response, setResponse] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (prompt && generateContent == true) {
        try {
          console.log("PROMPT PARA GEMINI"  , prompt);
          const intermediateResponse = "Lembrando a história...";
          setResponse(intermediateResponse);
          const promptData = await GeminiService(prompt);
          const title = extractTitle(promptData);
          setTitle(title);
          setResponse(promptData);
        } catch (error) {
          console.error("Erro ao chamar o GeminiService:", error);
          setResponse(null);
        }
      }
    };

    fetchData();
  }, [prompt, generateContent]);

  return { response, title };
}
