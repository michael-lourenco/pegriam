"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Importação dinâmica do Lottie, garantindo que seja carregado apenas no client-side
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function LoadingDefault() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/animations/loader_book.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Erro ao carregar JSON:", err));
  }, []);

  if (!animationData) return <p>Carregando...</p>;

  return (
    <div className="w-40 h-40">
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
}
