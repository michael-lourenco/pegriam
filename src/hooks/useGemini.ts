import { useState, useEffect } from "react";
import { GeminiService } from "@/services/gemini/GeminiService";

function extractTitle(htmlString: string): string {
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/;
  const match = htmlString.match(h2Regex);
  return match ? match[1].trim() : '';
}

export function useGemini(prompt: string, generateContent: boolean) {
  const [response, setResponse] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prompt || !generateContent) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setResponse("Deixe-me ver... a história era assim...");

      try {
        const promptData = await GeminiService(prompt, { signal });
        if (!signal.aborted) {
          setTitle(extractTitle(promptData));
          setResponse(promptData);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Erro ao chamar o GeminiService:", error);
          setError("Erro ao buscar a história. Tente novamente.");
          setResponse(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort(); // Cancelar requisição se o efeito for desmontado
  }, [prompt, generateContent]);

  return { response, setResponse, title, loading, error };
}
