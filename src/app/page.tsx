'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, HelpCircle, Heart } from "lucide-react";
import { Icon } from "@/components/icons";
import { LeaderboardByOwnerAndDate } from "@/components/leaderboard/Leaderboard";
import { UserInfo } from "@/components/UserInfo";
import { useNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  const navigationService = useNavigation();
  const { user, loading, status, handleLogin, handleLogout } = useAuth();
  
  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
        {/* User Info Section */}
        {status !== "loading" && (
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
        )}

        {/* Main Game Section */}
        <Card className="bg-background border-none shadow-none">
          <CardHeader className="space-y-2">
            <CardTitle className="text-4xl font-bold text-center">
              Pegriam
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Play Button - Featured */}
            <div className="flex flex-col justify-center items-center">
              <Image 
                src="/images/pegriam/pegriam-avatar.png" 
                alt="Avatar Pegriam" 
                width={200} 
                height={200} 
                className="mt-4"
              />
              
              <Button
                onClick={handleNavigation("/story")}
                className="bg-chart-2 hover:bg-lime-600 text-primary mt-4"
                size="lg"
              >
                Entrar no mundo mágico
              </Button>
            </div>


            {/* Secondary Actions */}
            <div className="space-y-4">
              {/* How to Play */}
              <Button
                onClick={handleNavigation("/about")}
                variant="ghost"
                className="w-full group transition-all duration-300 hover:bg-background"
              >
                <HelpCircle className="w-5 h-5 mr-2 text-primary group-hover:text-chart-2" />
                <span className="text-primary group-hover:text-chart-2">Quem é Pegriam?</span>
              </Button>

              {/* Support Button */}
              <Button
                onClick={() => window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank")}
                variant="outline"
                className="w-full border-chart-4/50 text-purple-400 hover:bg-chart-4/10 hover:border-purple-400 group transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2 text-chart-4 group-hover:text-purple-400" />
                <span>Apoiar o Projeto</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Section */}
        {/* <div className="mt-4">
          <LeaderboardByOwnerAndDate />
        </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}