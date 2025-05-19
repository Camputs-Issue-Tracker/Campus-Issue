import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usn, setUsn] = useState("");
  const [posts, setPosts] = useState([]);

  const globalSaveUsn = (value) => setUsn(value);

  const addPost = (post) => setPosts((prev) => [post, ...prev]);

  return (
    <UserContext.Provider value={{ usn, globalSaveUsn, posts, addPost }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}