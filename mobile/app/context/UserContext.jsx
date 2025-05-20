import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";

// Create the context
const UserContext = createContext();

// Create the provider component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Create the hook
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Export everything
export { UserProvider, useUser };
export default UserProvider;
