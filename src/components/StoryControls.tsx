import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface StoryControlsProps {
  handleSaveClick: () => void;
}

export const StoryControls: React.FC<StoryControlsProps> = ({ handleSaveClick }) => {
  const [imageSrc, setImageSrc] = useState("/images/label-items/bounty_stroke.png");
  const [clicked, setClicked] = useState(false);

  const handleMouseEnter = () => {
    if (!clicked) setImageSrc("/images/label-items/bounty.png");
  };

  const handleMouseLeave = () => {
    if (!clicked) setImageSrc("/images/label-items/bounty_stroke.png");
  };

  const handleTouchStart = () => {
    if (!clicked) setImageSrc("/images/label-items/bounty.png");
  };

  const handleTouchEnd = () => {
    if (!clicked) setImageSrc("/images/label-items/bounty_stroke.png");
  };

  const handleClick = () => {
    setImageSrc("/images/label-items/bounty.png");
    setClicked(true);
    handleSaveClick();
  };

  return (
    <div className="flex justify-center items-center mt-4 p-4 max-w-full">
      <Button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={imageSrc}
          alt="Gems"
          width={24}
          height={24}
          className="mx-2 flex-shrink-0"
        />
      </Button>
    </div>
  );
};
