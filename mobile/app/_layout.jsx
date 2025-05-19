import { Stack } from "expo-router";
import { UserProvider } from "./context/UserContext"; 
export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="(tabs)" options={{ title: "Campus Issue Resolver" }} />
      </Stack>
    </UserProvider>
  );
}
