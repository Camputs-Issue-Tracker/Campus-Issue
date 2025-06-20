"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, Filter, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";

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
  status: string;
}

interface DashboardStats {
  totalStudents: number;
  totalPosts: number;
  totalApprovedPosts: number;
  totalPendingPosts: number;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalPosts: 0,
    totalApprovedPosts: 0,
    totalPendingPosts: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [selectedPriority, selectedStatus, posts]);

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

      if (!data.success) {
        throw new Error("Failed to fetch posts");
      }

      setPosts(data.posts);
      setStats(data.stats);
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
    let filtered = posts;

    if (selectedPriority !== "all") {
      filtered = filtered.filter(
        (post) =>
          post.priority?.toLowerCase() === selectedPriority.toLowerCase()
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (post) => post.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredPosts(filtered);
  };

  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post status");
      }

      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                status: newStatus,
                isApproved: newStatus === "approved",
              }
            : post
        )
      );

      // Refresh posts to update stats
      fetchPosts();
    } catch (error) {
      console.error("Error updating post status:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update post status"
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-[calc(100vh-64px)]"
        >
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPosts}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalStudents}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Posts</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.totalPosts}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Approved Posts
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.totalApprovedPosts}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Pending Posts
            </h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.totalPendingPosts}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter size={16} />
                Filter by Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter size={16} />
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
              No posts found
            </div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getPriorityColor(
                        post.priority
                      )}`}
                    >
                      {post.priority?.toUpperCase() || "UNKNOWN"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {post.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={post.imageUrl}
                      alt="Post attachment"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Posted by: {post.studentUsn}</span>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(post.id, "approved")}
                      className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                        post.status === "approved"
                          ? "bg-green-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(post.id, "rejected")}
                      className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                        post.status === "rejected"
                          ? "bg-red-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <XCircle size={18} />
                      Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
