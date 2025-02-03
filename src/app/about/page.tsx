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
          <Card className="bg-background border-none shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl font-bold text-center">
                Pegriam, o Bardo
              </CardTitle>
            </CardHeader>
            <CardContent>

            <div className="flex flex-col justify-center items-center">
                <Image 
                  src="/images/pegriam/pegriam-avatar.png" 
                  alt="Avatar Pegriam" 
                  width={300} 
                  height={300} 
                  className="mt-4"
                />
              </div>

              <p className="text-lg mb-8">
                Bem-vindo ao meu mundo. Sou Pegriam, o bardo. Como já viajei por inúmeras realidades, posso contar de histórias de emocionantes para as crianças de todos os níveis. Esta experiência incentiva as crianças a se tornarem leitores apaixonados, criando memórias inesquecíveis com suas famílias.
              </p>
              

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
    
  );
}
