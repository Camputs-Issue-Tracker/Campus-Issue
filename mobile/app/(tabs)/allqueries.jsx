import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://admin-dash-ecru.vercel.app";

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [filteredQueries, setFilteredQueries] = useState([]);

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    filterQueries();
  }, [selectedPriority, queries]);

  const fetchQueries = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch queries");
      }
      const data = await response.json();
      setQueries(data.posts || []);
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterQueries = () => {
    if (selectedPriority === "all") {
      setFilteredQueries(queries);
    } else {
      setFilteredQueries(
        queries.filter((query) => query.priority === selectedPriority)
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "#ef4444";
      case "high":
        return "#f97316";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  const renderQuery = ({ item }) => (
    <View style={styles.queryContainer}>
      <View style={styles.queryHeader}>
        <Text style={styles.queryTitle}>{item.title}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>
            {item.priority?.toUpperCase() || "UNKNOWN"}
          </Text>
        </View>
      </View>
      <Text style={styles.queryContent}>{item.content}</Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.queryImage} />
      )}
      <View style={styles.queryFooter}>
        <Text style={styles.queryDate}>
          Posted by: {item.studentUsn} on{" "}
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="All Queries" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="All Queries" />
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Priority:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPriority}
            onValueChange={(value) => setSelectedPriority(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Priorities" value="all" />
            <Picker.Item label="Urgent" value="urgent" />
            <Picker.Item label="High" value="high" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Low" value="low" />
          </Picker>
        </View>
      </View>
      <FlatList
        data={filteredQueries}
        renderItem={renderQuery}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
  },
  listContainer: {
    padding: 16,
  },
  queryContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  queryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  queryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  queryContent: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 12,
  },
  queryImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  queryFooter: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  queryDate: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default AllQueries;
