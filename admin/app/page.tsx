"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      {/* Top blue accent bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600 z-10" />

      {/* Main content */}
      <div className="w-full max-w-md mx-auto text-center">
        {/* Title */}
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Student Issue Resolution Portal
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-600 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Administrative access for university staff
        </motion.p>

        {/* Login button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/admin-login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
          >
            Administrator Login
          </Link>
        </motion.div>

        {/* Helper links */}
        <motion.div
          className="flex justify-between mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-800 transition duration-200"
          >
            Forgot Password?
          </Link>
          <Link
            href="/admin-request"
            className="text-blue-600 hover:text-blue-800 transition duration-200"
          >
            Request Access
          </Link>
        </motion.div>

        {/* Info text */}
        <motion.div
          className="mt-12 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <p>This portal is exclusively for university staff.</p>
        </motion.div>
      </div>
    </div>
  );
}
