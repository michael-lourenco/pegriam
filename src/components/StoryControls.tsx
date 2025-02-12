import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image"

interface StoryControlsProps {
  handleSaveClick: () => void;
}

export const StoryControls: React.FC<StoryControlsProps> = ({
  handleSaveClick,
}) => (
  <>
  <div className="flex justify-center items-center max-w-full overflow-hidden">

    <Button
      className="bg-chart-2 hover:bg-lime-600 text-primary"
      onClick={handleSaveClick}
    >
      <Image
        src="/images/label-items/bounty-unselected.png"
        alt="Gems"
        width={24}
        height={24}
        className="mx-2 flex-shrink-0"
      />
    </Button>
  </div>
  </>
);
