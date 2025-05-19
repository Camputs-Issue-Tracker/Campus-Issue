import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

const YourPost = () => {
  const { posts } = useUser();

  if (!posts.length) {
    return (
      <View style={styles.center}>
        <Text>No posts yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {posts.map((post, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.meta}>By: {post.usn} | {post.dateTime}</Text>
          <Text style={styles.desc}>{post.description}</Text>
          {post.imageUri ? (
            <Image source={{ uri: post.imageUri }} style={styles.image} />
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
};

export default YourPost;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  meta: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
