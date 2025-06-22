"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface AlertBarProps {
  type?: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number; // in ms
}

const alertStyles = {
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const AlertBar: React.FC<AlertBarProps> = ({
  type = "info",
  message,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 border rounded-lg shadow-lg ${alertStyles[type]}`}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button onClick={() => setVisible(false)} className="text-xl">
          <IoClose />
        </button>
      </div>
    </motion.div>
  );
};

export default AlertBar;
