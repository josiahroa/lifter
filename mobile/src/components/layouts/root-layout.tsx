import { useMemo } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../providers/theme-provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { theme } = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: theme.colors.background,
      },
      content: {
        flex: 1,
      },
    });
  }, [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {children}
      </Pressable>
    </SafeAreaView>
  );
}
