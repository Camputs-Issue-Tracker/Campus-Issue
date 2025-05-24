"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  priority: string;
  category: string;
  analysis: string;
  studentUsn: string;
  createdAt: string;
  isApproved: boolean;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [selectedPriority, posts]);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await fetch("/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch posts: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error("Invalid response format: posts array is missing");
      }

      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch posts"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (selectedPriority === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.priority?.toLowerCase() === selectedPriority.toLowerCase()
        )
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleLogout = () => {
    // Clear any admin session/tokens here
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Priority:
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No posts found</div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getPriorityColor(
                      post.priority
                    )}`}
                  >
                    {post.priority?.toUpperCase() || "UNKNOWN"}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={post.imageUrl}
                      alt="Post attachment"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span>Posted by: {post.studentUsn}</span>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Category:{" "}
                      </span>
                      <span className="text-sm text-gray-600">
                        {post.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Analysis:{" "}
                      </span>
                      <span className="text-sm text-gray-600">
                        {post.analysis}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
