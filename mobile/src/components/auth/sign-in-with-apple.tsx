import { useMemo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import { useTheme } from "@/components/providers/theme-provider";

export default function SignInWithApple() {
  const { theme } = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        width: "100%",
        gap: theme.spacing.md,
      },
      button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        padding: theme.spacing.sm,
        width: "100%",
        height: theme.spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
      },
      buttonText: {
        color: theme.colors.text.inverse,
      },
    });
  }, [theme]);

  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign In With Apple</Text>
    </TouchableOpacity>
  );
}
