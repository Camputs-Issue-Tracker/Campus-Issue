import { Stack } from "expo-router";
import UserProvider from "./context/UserContext";

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
}
