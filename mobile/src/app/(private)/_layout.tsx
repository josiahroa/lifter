import { Stack } from "expo-router";
import { useEffect } from "react";
import { system } from "@/src/lib/powersync/system";

export default function PrivateLayout() {
  useEffect(() => {
    (async () => {
      await system.init();
    })();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
