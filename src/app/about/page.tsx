"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/components/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/icons";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function About() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  const navigationService = useNavigation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }
  const handleBack = () => {
    navigationService.navigateTo("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <Card className="bg-background border-none shadow-none max-w-4xl mx-auto">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl md:text-4xl font-bold text-center">Pegriam, o Bardo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex justify-center">
                <Image
                  src="/images/pegriam/pegriam-avatar.png"
                  alt="Avatar Pegriam"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>

              <article className="text-base md:text-lg space-y-4">
                <p>
                  Olá! Sou Pegriam, o bardo viajante de múltiplas realidades. Em cada uma delas, assumo uma forma diferente:
                  homem, mulher, gato ou até mesmo criaturas além da sua imaginação.
                </p>
                <p>
                  Minha missão? Contar histórias fantásticas para crianças de todas as idades, incentivando a leitura e
                  criando memórias inesquecíveis em família.
                </p>
              </article>

              <div className="flex justify-center">
                <Image
                  src="/images/michael/michael.jpeg"
                  alt="Michael Lourenco"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
              </div>

              <article className="text-base md:text-lg space-y-4">
                <h2 className="text-2xl text-center font-bold">Michael Lourenço</h2>
                <p>
                  Como criador deste projeto, desenvolvo todas as suas facetas. As histórias são geradas com o auxílio de
                  inteligência artificial, proporcionando uma experiência única a cada vez.
                </p>
                <p>
                  Estou constantemente explorando e aprimorando as capacidades de Pegriam. Espero que você aprecie tudo o que
                  ele tem a oferecer!
                </p>
              </article>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
    
  );
}
