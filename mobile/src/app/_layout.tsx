import "react-native-reanimated";
import "../../global.css";
import {
  // focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  ActivityIndicator,
  // AppState,
  // AppStateStatus,
  // Platform,
  View,
} from "react-native";

import RootLayout from "@/components/layouts/root-layout";
import { AuthProvider, useAuth } from "@/components/providers/auth-provider";
import { ThemeProvider, useTheme } from "@/components/providers/theme-provider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch((e) => {
  console.warn("Failed to prevent auto-hide for splash screen", e);
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

// function onAppStateChange(status: AppStateStatus) {
//   if (Platform.OS !== "web") {
//     focusManager.setFocused(status === "active");
//   }
// }

// useEffect(() => {
//   const subscription = AppState.addEventListener("change", onAppStateChange);

//   return () => subscription.remove();
// }, []);

function RootNavigator() {
  const { session, isLoading } = useAuth();
  const { theme } = useTheme();

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
    <RootLayout>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 100,
          contentStyle: {
            backgroundColor: theme.colors.background.app,
          },
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(private)" />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="auth/sign-in" />
        </Stack.Protected>
      </Stack>
    </RootLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
