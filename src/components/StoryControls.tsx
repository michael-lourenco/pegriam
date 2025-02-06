import React from "react";
import { Button } from "@/components/ui/button";

interface StoryControlsProps {
  handleSaveClick: () => void;
}

export const StoryControls: React.FC<StoryControlsProps> = ({
  handleSaveClick,
}) => (
  <>
  <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden p-4">

    <Button
      className="bg-chart-2 hover:bg-lime-600 text-primary"
      onClick={handleSaveClick}
    >
      Guardar na Biblioteca
    </Button>
  </div>
  </>
);
