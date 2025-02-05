"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsVisible(false), 3000);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black">
      {/* Exhaust Smoke Effect */}
      {isVisible && <div className="exhaust-smoke"></div>}

      {/* Welcome Text */}
      <h1 className="text-white text-4xl font-bold fade-in">
        Welcome to the Voting System
      </h1>

      <style jsx>{`
        .exhaust-smoke {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%;
          height: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 150, 255, 0.7),
            rgba(0, 150, 255, 0.1)
          );
          animation: exhaust 3s ease-out forwards;
          border-radius: 50%;
          filter: blur(50px);
        }

        @keyframes exhaust {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -60%) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -70%) scale(1.8);
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
