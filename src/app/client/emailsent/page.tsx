"use client";

import React from "react";
// import { motion } from "framer-motion";
// import { Mail } from "lucide-react";
import RocketLaunch from "./rocketlaunch";

function Index() {
  return (
    <RocketLaunch></RocketLaunch>
    // <div className="flex flex-col justify-center items-center w-screen h-screen bg-black text-white font-sans">
    //   {/* Rotating Animation */}
    //   <div className="relative mb-8">
    //     {/* Stars */}
    //     <div className="absolute top-[-15%] left-[40%] text-white">
    //       <motion.div
    //         className="text-lg"
    //         animate={{ opacity: [0.3, 1, 0.3] }}
    //         transition={{ duration: 1.5, repeat: Infinity }}
    //       >
    //         ✦
    //       </motion.div>
    //     </div>
    //     <div className="absolute top-[80%] left-[20%] text-white">
    //       <motion.div
    //         className="text-lg"
    //         animate={{ opacity: [0.3, 1, 0.3] }}
    //         transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
    //       >
    //         ✦
    //       </motion.div>
    //     </div>
    //     <div className="absolute top-[80%] left-[60%] text-white">
    //       <motion.div
    //         className="text-lg"
    //         animate={{ opacity: [0.3, 1, 0.3] }}
    //         transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
    //       >
    //         ✦
    //       </motion.div>
    //     </div>

    //     {/* Email Icon */}
    //     <div className="flex justify-center items-center bg-black w-[100px] h-[100px] rounded-full border-2 border-white">
    //       <Mail className="text-white w-10 h-10" />
    //     </div>
    //   </div>

    //   {/* Text */}
    //   <p className="text-lg font-medium text-center">
    //     <strong>Voting Link</strong> is on its way. <br /> Please check your
    //     Inbox. You may need to refresh Inbox. <br />
    //     Voting link expires in <strong>1 minute</strong>.
    //   </p>
    // </div>
  );
}

export default Index;
