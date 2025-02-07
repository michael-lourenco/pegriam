"use client"

import React from 'react';
import Lottie from 'lottie-react';
import loadingDefaultAnimation from "../../public/images/animations/loader_book.json"

const LoadingDefault: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-24 h-24">
        <Lottie
          animationData={loadingDefaultAnimation}
          loop={true}
        />
      </div>
    </div>
  );
};

export { LoadingDefault }