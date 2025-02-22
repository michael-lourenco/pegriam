import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserData } from "@/application/entities/User";
import { Heart } from "lucide-react";

interface UserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, handleLogin }) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const handleDonation = () => {
    window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank");
  };

  return (
    <>
      {(user || localStorageUser) ? (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-sm">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <div className="flex items-center text-lg font-semibold truncate">
              <Button asChild variant="default" className="p-1">
                <Link href="/profile">
                  <Image
                    src="/images/profile-images/2.png"
                    alt="Profile"
                    width={36}
                    height={36}
                    className=""
                  />
                </Link>
              </Button>
              <Image
                src="/images/label-items/bounty.png"
                alt="Gems"
                width={24}
                height={24}
                className="mx-2 flex-shrink-0"
              />
              <span className="text-primary">{user?.story?.length ?? 0}</span>
              <Image
                src="/images/label-items/bling.png"
                alt="Blings"
                width={24}
                height={24}
                className="mx-2 flex-shrink-0"
              />
              <span className="text-primary">{user?.currency?.value ?? 0}</span>
              <Image
                src="/images/label-items/coin.png"
                alt="Coins"
                width={24}
                height={24}
                className="mx-2 flex-shrink-0"
              />
              <span className="text-primary">{user?.credits?.value ?? 0}</span>
            </div>
            <Button
              onClick={handleDonation}
              variant="outline"
              className="border-chart-4 text-chart-4 hover:bg-chart-4 hover:text-slate-900 flex items-center gap-2 whitespace-nowrap"
              size="sm"
            >
              <Heart className="w-4 h-4" />
              Apoiar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg">
          <div className="grid grid-cols-[1fr,auto] items-center gap-2">
            <Button onClick={handleLogin} variant="default">
              Entrar com Google
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
