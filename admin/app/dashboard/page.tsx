"use client";

import { useRouter } from "next/navigation";
import {
  Upload,
  LogOut,
  Menu,
  X,
  Layout,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear the token from cookies
    document.cookie = "token=; Max-Age=0; path=/; Secure; SameSite=Strict";
    // Optionally, remove from localStorage (if you had set anything there)
    localStorage.removeItem("admin");
    // Redirect to the login page
    router.push("/admin-login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Layout size={18} />,
    },
    {
      name: "Upload CSV",
      path: "/upload-csv",
      icon: <Upload size={18} />,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-white rounded-md w-8 h-8 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">A</span>
              </div>
            </div>
            <div className="hidden md:block ml-4">
              <div className="text-xl font-semibold text-white">
                Admin Dashboard
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-4 flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    item.path === "/upload-csv"
                      ? "bg-blue-800 text-white"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-900"
                >
                  <User size={18} className="mr-1.5" />
                  <span className="mr-1">Admin</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => router.push("/profile")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-blue-800 p-2 rounded-md text-blue-100 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  item.path === "/upload-csv"
                    ? "bg-blue-900 text-white"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-blue-700 hover:text-red-200"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
