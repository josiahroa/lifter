import { useState } from "react";
import { View, Text } from "react-native";

import SignInWithApple from "@/components/auth/sign-in-with-apple";
import SignInWithGoogle from "@/components/auth/sign-in-with-google";
import SignInWithOTP from "@/components/auth/sign-in-with-otp";
import KeyboardAvoidingLayout from "@/components/layouts/keyboard-avoiding-layout";
import { SignInGlobalError } from "@/lib/auth";
import { type Theme, createThemedStyles } from "@/lib/styles";

export default function SignInScreen() {
  const styles = useStyles();

  const [globalError, setGlobalError] = useState<SignInGlobalError | null>(
    null
  );

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

      <SignInWithOTP onGlobalError={setGlobalError} />

      <View style={styles.orSeparator}>
        <View style={styles.orSeparatorLine} />
        <Text style={styles.orSeparatorText}>or</Text>
        <View style={styles.orSeparatorLine} />
      </View>

      <View style={styles.socialLoginButtons}>
        <SignInWithGoogle />
        <SignInWithApple />
      </View>
    </KeyboardAvoidingLayout>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      flex: 1,
      marginTop: 200,
    },
    header: {
      color: theme.colors.text.primary,
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
    orSeparatorText: {
      color: theme.colors.text.primary,
      fontSize: theme.fonts.size.sm,
    },
    orSeparatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.subtle,
    },
    socialLoginButtons: {
      gap: theme.spacing.sm,
    },
    errorContainer: {
      marginVertical: theme.spacing.md,
      backgroundColor: theme.colors.status.error,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.spacing.sm,
    },
    errorText: {
      color: theme.colors.text.inverse,
      fontWeight: "bold",
      fontSize: 12,
      marginVertical: theme.spacing.md,
    },
  };
});
