"use client";

import React from "react";
import { Unplug } from "lucide-react";

function Index() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-black text-white font-sans">
      <div className="relative mb-8">
        {/* Email Icon */}
        <div className="flex justify-center items-center bg-black w-[100px] h-[100px] rounded-full border-2 border-white">
          <Unplug className="text-white w-10 h-10" />
        </div>
      </div>

      {/* Text */}
      <p className="text-lg font-medium text-center">
        <strong>Invalid URL.</strong>
        <br /> Please contact administrator to reset your voting access.
      </p>
    </div>
  );
}

export default Index;
