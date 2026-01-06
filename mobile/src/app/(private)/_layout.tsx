import { Stack } from "expo-router";

export default function PrivateLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
