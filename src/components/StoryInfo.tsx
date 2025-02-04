import React, { useState, useEffect } from "react";
import { UserData } from "@/application/entities/User";
import { Icon } from "./icons";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoryInfoProps {
  prompt: string | null;
  response: string | null | HTMLElement | HTMLCollection;
  title: string | null;
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const StoryInfo: React.FC<StoryInfoProps> = ({
  prompt,
  response,
  title,
  handleLogin,
  handleLogout,
  user,
}) => {
  const [safeResponse, setSafeResponse] = useState<string>(
    "Clique no botão 'Conte uma história' para eu buscar uma nas minhas lembranças."
  );

  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  useEffect(() => {
    if (response) {
      if (typeof response === "string") {
        setSafeResponse(response);
      } else if (response instanceof HTMLElement) {
        setSafeResponse(response.innerHTML);
      } else if (response instanceof HTMLCollection) {
        setSafeResponse(Array.from(response).map((el) => el.outerHTML).join(""));
      } else {
        setSafeResponse(String(response));
      }
    }
  }, [response]);

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <Card className="mb-4 bg-background">
          <CardContent className="p-6">
            {/* <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              {title}
            </h2> */}
            <ScrollArea className="h-[60vh] rounded-md border border-border">
              <div
                dangerouslySetInnerHTML={{
                  __html: safeResponse,
                }}
                className="p-6 space-y-4"
              />
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg text-center">
          <p>Envie uma pergunta para obter uma resposta.</p>
        </div>
      )}
    </>
  );
};