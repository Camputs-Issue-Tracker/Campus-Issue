import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowIcon: false, // Remove tab icons
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => null,
          headerShown: false, // Hide the header/title for Home
        }}
      />
      <Tabs.Screen
        name="yourpost"
        options={{
          tabBarIcon: () => null,
          headerShown: false, // Hide the header/title for Your Post
          tabBarLabel: "Your Post",
        }}
      />
      <Tabs.Screen
        name="allqueries"
        options={{
          tabBarIcon: () => null,
          headerShown: false,
          tabBarLabel: "All Queries",
        }}
      />
      {/* Add other tab screens here */}
    </Tabs>
  );
}
