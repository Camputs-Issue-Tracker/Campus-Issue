"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/admin-login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-lg">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/upload-students"
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isActive("/upload-students")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Upload size={18} />
            Upload Students
          </Link>
        </nav>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
      >
        <LogOut size={20} />
        Logout
      </motion.button>
    </div>
  );
}
