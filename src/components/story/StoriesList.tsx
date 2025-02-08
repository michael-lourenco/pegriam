"use client";
import React, { useState, useCallback } from "react";
import { UserData } from "@/application/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Stories, StoryData } from "@/components/story/Stories";
interface StoriesListProps {
  user: UserData | null;
  status: "authenticated" | "loading" | "unauthenticated";
}

export const StoriesList: React.FC<StoriesListProps> = ({
  user,
  status
}) => {
    const [selectedStory, setSelectedStory] = useState<StoryData | null>(null);
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const handleDonation = () => {
    window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank");
  };


  return (
    <>
      {user ? (
        <Card className="bg-background border-none shadow-none">
          <CardContent className="border-none shadow-none">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : (
              <Stories storiesData={user?.story?.map(story => ({ ...story, id: story.id, date: story.date instanceof Date ? story.date.toISOString() : story.date })) || null} onRowClick={setSelectedStory} />
            )}
          </CardContent>
        </Card>

      ) : (
        <></>
      )}
    </>
  );
};
