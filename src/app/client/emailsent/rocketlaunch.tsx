"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const RocketLaunch = () => {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 25 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="flex justify-center items-center bg-black w-[100px] h-[100px] rounded-full border-2 border-white"
      >
        <Mail className="text-white w-10 h-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0, y: 130 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: 130 }}
        transition={{
          delay: 3,
          duration: 1.5,
          ease: "easeOut",
        }}
        className="absolute top-[25%] w-40 h-40 bg-purple-500 rounded-full blur-3xl"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 2, y: -5 }}
        transition={{ delay: 0.3, duration: 5, ease: "backIn" }}
        className="mt-12 text-center"
      >
        <p className="text-lg font-medium">
          <strong>Voting Link Incoming.</strong>
          <br />
          Please check Inbox. You may need to refresh Inbox. <br />
          Voting link expires in <strong>1 minute</strong>.
        </p>
      </motion.div>
    </div>
  );
};

export default RocketLaunch;
