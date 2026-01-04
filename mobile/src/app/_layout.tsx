import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../../global.css";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "../components/providers/auth-provider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch((e) => {
  console.warn("Failed to prevent auto-hide for splash screen", e);
});

function RootNavigator() {
  const { session, isLoading } = useAuth();
  console.log("Loading session: ", isLoading);

  SplashScreen.hideAsync().catch((e) => {
    console.warn("Fallback failed to hide splash screen", e);
  });

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch((e) => {
        console.warn("Failed to hide splash screen", e);
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 100,
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(private)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="auth/sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function AppLayout() {
  // const system = useSystem();

  // const db = useMemo(() => {
  //   return system.powersync;
  // }, []);

  return (
    <AuthProvider>
      {/* <PowerSyncContext.Provider value={db}> */}
      <RootNavigator />
      {/* </PowerSyncContext.Provider> */}
    </AuthProvider>
  );
}
