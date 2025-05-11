"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API endpoint to clear server-side session if needed
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear the token from cookies with proper settings
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict";

      // Clear any client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, still try to clear local data and redirect
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict";
      router.push("/admin-login");
    }
  };

  return (
    <nav className="bg-blue-700 p-4 text-white flex justify-between items-center">
      <div className="text-lg font-semibold">Admin Dashboard</div>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/upload-csv")}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload CSV
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
