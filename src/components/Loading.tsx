"use client"

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from "../../public/images/animations/book_animation.json"

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-24 h-24">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
        />
      </div>
    </div>
  );
};

export { Loading }