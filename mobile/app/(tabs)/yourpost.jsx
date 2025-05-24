import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";
import Header from "../components/Header";

const API_URL = "https://admin-dash-ecru.vercel.app";

const YourPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const fetchPosts = async () => {
    if (!user?.usn) {
      Alert.alert("Error", "User not logged in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching posts for USN:", user.usn);
      const response = await fetch(`${API_URL}/api/posts?usn=${user.usn}`);
      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${responseText}`);
      }
      const data = JSON.parse(responseText);
      setPosts(data.posts || []);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post.id !== postId));
      Alert.alert("Success", "Post deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete post");
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}
      <Text style={styles.postDate}>
        Posted on: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user?.usn) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your posts</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Your Posts" />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default YourPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  postContent: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
