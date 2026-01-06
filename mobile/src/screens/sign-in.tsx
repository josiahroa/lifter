import { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import SignInWithApple from "@/components/auth/sign-in-with-apple";
import SignInWithEmailOTP from "@/components/auth/sign-in-with-email-otp";
import SignInWithGoogle from "@/components/auth/sign-in-with-google";
import KeyboardAvoidingLayout from "@/components/layouts/keyboard-avoiding-layout";
import { useTheme } from "@/components/providers/theme-provider";
import { SignInGlobalError } from "@/lib/auth";

export default function SignInScreen() {
  const { theme } = useTheme();

  const [globalError, setGlobalError] = useState<SignInGlobalError | null>(
    null
  );

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        marginTop: 200,
      },
      header: {
        color: theme.colors.foreground,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
      },
      orSeparator: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: theme.spacing.lg,
        gap: theme.spacing.md,
      },
      orSeparatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border.secondary,
      },
      socialLoginButtons: {
        gap: theme.spacing.sm,
      },
      errorContainer: {
        marginVertical: theme.spacing.md,
        backgroundColor: "red",
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.spacing.sm,
      },
      errorText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        marginVertical: theme.spacing.md,
      },
    });
  }, [theme]);

  const GlobalError = ({ error }: { error: SignInGlobalError | null }) => {
    return (
      <View style={[styles.errorContainer, { opacity: globalError ? 1 : 0 }]}>
        <Text style={styles.errorText}>{error?.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingLayout style={styles.container} offset={0.5}>
      <GlobalError error={globalError} />
      <Text style={styles.header}>Log In</Text>

      <SignInWithEmailOTP onGlobalError={setGlobalError} />

      <View style={styles.orSeparator}>
        <View style={styles.orSeparatorLine} />
        <Text>or</Text>
        <View style={styles.orSeparatorLine} />
      </View>

      <View style={styles.socialLoginButtons}>
        <SignInWithGoogle />
        <SignInWithApple />
      </View>
    </KeyboardAvoidingLayout>
  );
}
