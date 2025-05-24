/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  important: true,
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: "media",
  safelist: [
    // Background colors
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-gray-500",
    "bg-white",
    "bg-gray-50",
    "bg-gray-100",
    "bg-blue-500",
    "bg-blue-600",
    "bg-red-600",
    "bg-green-600",
    "hover:bg-red-600",
    "hover:bg-green-600",
    "hover:bg-blue-600",
    "hover:bg-blue-700",
    "hover:bg-gray-200",
    "bg-background",
    "bg-foreground",

    // Text colors
    "text-white",
    "text-gray-800",
    "text-gray-600",
    "text-gray-500",
    "text-gray-700",
    "text-red-700",
    "text-foreground",
    "text-blue-600",
    "text-blue-700",

    // Borders
    "border-gray-200",
    "border-gray-300",
    "border-red-400",
    "border-4",
    "border-t-transparent",

    // Shadows
    "shadow-lg",
    "shadow-xl",
    "shadow-md",

    // Border radius
    "rounded-lg",
    "rounded-xl",
    "rounded-full",

    // Transitions
    "transition-colors",
    "transition-shadow",
    "transition-all",

    // Layout
    "flex",
    "grid",
    "gap-2",
    "gap-3",
    "gap-4",
    "gap-6",
    "p-4",
    "p-6",
    "px-4",
    "py-2",
    "px-6",
    "py-3",
    "px-3",
    "py-1",
    "mb-2",
    "mb-4",
    "pt-4",
    "min-h-screen",
    "h-[calc(100vh-64px)]",
    "w-full",
    "h-48",
    "w-12",
    "h-12",

    // Display
    "block",
    "inline",
    "inline-block",
    "hidden",
    "visible",

    // Position
    "relative",
    "absolute",
    "justify-between",
    "justify-center",
    "items-center",
    "items-start",

    // Z-index
    "z-10",

    // Opacity
    "opacity-0",
    "opacity-100",

    // Font
    "font-medium",
    "font-semibold",
    "font-bold",
    "text-sm",
    "text-xl",
    "text-2xl",

    // Effects
    "antialiased",
    "whitespace-pre-wrap",
    "object-cover",

    // Grid
    "grid-cols-1",
    "grid-cols-2",
    "md:grid-cols-2",
  ],
};
