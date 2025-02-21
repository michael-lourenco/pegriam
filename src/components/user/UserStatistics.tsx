import React, { useEffect, useState } from "react";
import { UserData } from "@/services/auth/NextAuthenticationService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Coins, GamepadIcon, StarsIcon, BookA } from "lucide-react";
import Image from "next/image"

interface UserStatisticsProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserStatistics: React.FC<UserStatisticsProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const localStorageUser = localStorage.getItem("user") != null ? localStorage.getItem("user"): {};
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      try {
        const cleanPhotoUrl = user.photoURL.split("=")[0];
        setAvatarUrl(`${cleanPhotoUrl}=s150`);
      } catch (error) {
        console.error("Erro ao formatar a URL da imagem:", error);
        setAvatarUrl(null);
      }
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  const images ={
    bling: "/images/label-items/bling.png",
    bounty: "/images/label-items/bounty.png",
    coin: "/images/label-items/coin.png",
    gem: "/images/label-items/gem.png",
  }
  const StatCard = ({ title, value, image, color }: { title: string; value: number; image: any; color: string }) => (
    <Card className="bg-background border-none hover:bg-background transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-primary">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Image
            src={image}
            alt="Play"
            width={24}
            height={24}
            className=""
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-primary">{value}</div>
          <div className="text-xs text-primary">
            {title === "Best Score" && "Personal Record"}
            {title === "Coins" && "Available Balance"}
            {title === "Total Games" && "Games Played"}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="p-6 bg-background rounded-xl shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* User Profile */}
            <Card className="md:col-span-1 bg-background border-none">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage
                      src={avatarUrl || "/api/placeholder/150/150"}
                      alt="User avatar" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-background">
                      {user?.displayName?.charAt(0) || 'MP'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 right-0 bg-chart-2 w-4 h-4 rounded-full border-2 border-background"></div>
                </div>
                <CardTitle className="mt-4 text-primary text-xl">
                  {user?.displayName}
                </CardTitle>
                <p className="text-sm text-primary">Perfil</p>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Estrelas"
                value={user?.credits?.value ?? 0}
                image={images.bling}
                color=""
              />
              <StatCard
                title="Moedas"
                value={user?.currency?.value ?? 0}
                image={images.coin}
                color=""
              />
              <StatCard
                title="Favoritas"
                value={user?.story?.length ?? 0}
                image={images.bounty}
                color=""
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserStatistics;