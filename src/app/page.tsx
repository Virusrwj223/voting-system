"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsVisible(false), 3000);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black">
      {isVisible && <div className="exhaust-smoke"></div>}

      <h1 className="text-white text-4xl font-bold fade-in">
        Welcome to the Voting System
      </h1>

      <style jsx>{`
        .exhaust-smoke {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(
            circle,
            rgba(0, 150, 255, 0.8),
            rgba(0, 150, 255, 0.1)
          );
          animation: exhaust 3s ease-out forwards;
          border-radius: 50%;
          filter: blur(20px);
        }

        @keyframes exhaust {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.6);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-50px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }

        .fade-in {
          opacity: 0;
          animation: fadeIn 2s ease-in 2s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
