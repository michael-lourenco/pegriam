"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGemini } from "@/hooks/useGemini";
import { UserInfo } from "@/components/UserInfo";
import { Story, StoryData } from "@/components/story/Story";
import { updateStory, updateUserCredits, dbFirestore } from "@/services/firebase/FirebaseService";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { StoryInfo } from "@/components/StoryInfo";
import { StoryControls } from "@/components/StoryControls";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { StoryGeneratorModal } from '@/components/StoryGeneratorModal'
import { TemplateSelector } from '@/components/TemplateSelector'
import { Template } from '@/types/template';
export default function StoryPage() {
  const [selectedStory, setSelectedStory] = useState<StoryData | null>(null);
  const [generateContent, setGenerateContent] = useState<boolean>(false);
  const [localContent, setLocalContent] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>(`
  Crie uma história curta e envolvente, com no máximo 2000 caracteres, perfeita para um pai ou mãe ler para seu filho antes de dormir. A história deve ser mágica, aconchegante e transmitir uma mensagem positiva sobre [tema específico].

Retorne o texto formatado em HTML com a seguinte estrutura e classes Tailwind:

<article class="space-y-6">
    <h2 class="text-2xl font-bold text-primary text-center">[Título da História]</h2>
    
    <div class="space-y-4">
        <!-- Introdução -->
        <p class="text-lg text-foreground">[Texto introdutório]</p>

        <!-- Diálogos -->
        <p class="text-lg text-primary pl-4 border-l-2 border-primary">[Diálogos dos personagens]</p>

        <!-- Descrições -->
        <p class="text-lg text-foreground">[Descrições de cenário ou ações]</p>

        <!-- Momentos especiais -->
        <p class="text-lg text-accent font-medium">[Momentos mágicos ou importantes]</p>

        <!-- Final -->
        <p class="text-lg text-primary font-medium">[Conclusão da história]</p>
    </div>

    <!-- Moral ou mensagem -->
    <div class="mt-6 p-4 bg-card rounded-lg border border-border">
        <p class="text-lg text-primary italic">[Moral ou mensagem da história]</p>
    </div>
</article>

A história deve conter:
1. Um título cativante
2. Uma introdução que estabeleça o cenário
3. Um protagonista carismático
4. Um desafio ou conflito leve
5. Elementos mágicos ou fantásticos
6. Um final feliz e reconfortante
7. Uma moral ou lição sutilmente apresentada
8. Retorne o HTML diretamente, sem formatação adicional. O conteúdo deve começar imediatamente com <article> e terminar com </article>.
`)

const handlePrompt = (template: Template) => {
  // Aqui você pode manipular o template para criar o prompt
  const promptText = `
    Crie uma história curta e envolvente, com no máximo ${template.storyLength == "curta" ? "2000" : template.storyLength == "média" ? "3000" : template.storyLength == "longa" ? "4000" : "2000"} caracteres, perfeita para um pai ou mãe ler para seu filho antes de dormir. A história deve ser aconchegante e transmitir uma mensagem positiva sobre ${template.themes.join(", ")}.

Retorne o texto formatado em HTML com a seguinte estrutura e classes Tailwind:

<article class="space-y-6">
    <h2 class="text-2xl font-bold text-primary text-center">[Título da História]</h2>
    
    <div class="space-y-4">
        <!-- Introdução -->
        <p class="text-lg text-foreground">[Texto introdutório]</p>

        <!-- Diálogos -->
        <p class="text-lg text-primary pl-4 border-l-2 border-primary">[Diálogos dos personagens]</p>

        <!-- Descrições -->
        <p class="text-lg text-foreground">[Descrições de cenário ou ações]</p>

        <!-- Momentos especiais -->
        <p class="text-lg text-accent font-medium">[Momentos mágicos ou importantes]</p>

        <!-- Final -->
        <p class="text-lg text-primary font-medium">[Conclusão da história]</p>
    </div>

    <!-- Moral ou mensagem -->
    <div class="mt-6 p-4 bg-card rounded-lg border border-border">
        <p class="text-lg text-primary italic">[Moral ou mensagem da história]</p>
    </div>
</article>

A história deve conter:
1. Um título cativante
2. Uma introdução que estabeleça o cenário
3. Um protagonista carismático
4. Um desafio ou conflito leve
5. Um final feliz e reconfortante
6. Uma moral ou lição sutilmente apresentada
7. Retorne o HTML diretamente, sem formatação adicional. O conteúdo deve começar imediatamente com <article> e terminar com </article>.
  `
  setPrompt(promptText)
}


  function extractTitle(htmlString:string): string {
    // Regex para encontrar o conteúdo entre as tags h2, considerando múltiplas linhas
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/;
    
    // Procura pelo match no htmlString
    const match = htmlString.match(h2Regex);
    
    // Retorna o conteúdo encontrado (removendo espaços extras) ou string vazia se não encontrar
    return match ? match[1].trim() : '';
  }

  const { user, loading, status, handleLogin, handleLogout } = useAuth();


  const { response, title } = useGemini(prompt, generateContent);


  const endRead = useCallback(() => {
    queueMicrotask(async () => {
      if (!user) return;
      const title = response ? extractTitle(response) : "Sem titulo";
      const now = new Date();
      if (user.credits.value > 0) {
        await updateStory(user.email, { date: now, prompt: prompt, title: title, story: response || "Sem resposta" }, dbFirestore);
        await updateUserCredits(user.email, -1, dbFirestore);
      }
    });
  }, [prompt, response, user]);

  const handleSaveClick = useCallback(() => {
    console.log('TAMANHO DA RESPOSTA ', response?.length)
    if(response && response.length > 300) {
      endRead();
    }
  }, [endRead]);

  const handleGenerateStory = useCallback(() => {
    setLocalContent(false);
    setGenerateContent(true);
  }, [generateContent]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Carregando...</p></div>;
  }

  return (
    <>
      {user ? (
        <div className="flex flex-col min-h-screen bg-background text-primary">
          <main className="flex-grow flex flex-col items-center justify-start pt-4">
            <div className="max-w-4xl mx-auto relative">
              <UserInfo user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
              {user.credits.value > 0 ? (
                !localContent && !selectedStory && (
                  <>
                    <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden p-4">
                      <StoryGeneratorModal user = {user} />
                      <TemplateSelector user = {user} onTemplateSelect={handlePrompt}/>
                      <Button variant="outline" className="border-chart-2 text-chart-2 hover:bg-chart-2 hover:text-primary" onClick={handleGenerateStory}>me conte uma história</Button>
                    </div>
                    <StoryInfo prompt={prompt} response={response} title={title} user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
                    <StoryControls handleSaveClick={handleSaveClick} />
                  </>
                )
              ) : (
                <></>
              )}

              {user.credits.value <= 0 ? (
                <>
                  <div className="flex flex-col text-primary mb-4 p-4 bg-baclkground rounded-lg">
                    <div className="grid grid-cols-[1fr,auto] items-center gap-2">
                      <Button
                        onClick={() =>
                          updateUserCredits(user.email, 1, dbFirestore)
                        }
                        variant="default"
                      >
                        Insira créditos para ler novas estórias
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <> </>
              )}

              {selectedStory && (
                <>
                  <StoryInfo prompt="local" response={selectedStory.story} title={selectedStory.title} user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
                  <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden p-4">
                    <Button variant="outline" className="border-chart-2 text-chart-2 hover:bg-chart-2 hover:text-primary" onClick={() => { 
                      setLocalContent(false)
                      setSelectedStory(null)}
                    }>nova história</Button>
                  </div>
                </>
              )}

              <Card className="bg-background border-none shadow-none">
                <CardContent className="border-none shadow-none">
                  {status === "loading" ? (
                    <p>Loading...</p>
                  ) : (
                    <Story storyData={user?.story?.map(story => ({ ...story, id: story.id, date: story.date instanceof Date ? story.date.toISOString() : story.date })) || null} onRowClick={setSelectedStory} />
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      ) : (
        <>
        <div className="flex flex-col text-primary mb-4 p-4 bg-baclkground rounded-lg">
          <div className="grid grid-cols-[1fr,auto] items-center gap-2">
            <Button onClick={handleLogin} variant="default">Sign in with Google</Button>
          </div>
        </div>
        <Footer />
      </>
      )}
    </>
  );
}
