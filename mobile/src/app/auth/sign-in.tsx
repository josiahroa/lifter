import { useState } from "react";
import { View, Text } from "react-native";

import SignInWithApple from "@/components/auth/sign-in-with-apple";
import SignInWithGoogle from "@/components/auth/sign-in-with-google";
import SignInWithOTP from "@/components/auth/sign-in-with-otp";
import Alert from "@/components/ui/alert";
import { SignInError } from "@/lib/auth";
import { type Theme, createThemedStyles } from "@/lib/styles";

export default function SignInScreen() {
  const styles = useStyles();

  const [error, setError] = useState<SignInError | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Log In</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Alert
            title={error.message}
            description={error.description}
            type="error"
          />
        </View>
      )}

      <SignInWithOTP onError={setError} />

      <View style={styles.orSeparator}>
        <View style={styles.orSeparatorLine} />
        <Text style={styles.orSeparatorText}>or</Text>
        <View style={styles.orSeparatorLine} />
      </View>

      <View style={styles.socialLoginButtons}>
        <SignInWithGoogle />
        <SignInWithApple />
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      flex: 1,
      padding: theme.spacing.md,
      paddingTop: theme.spacing.xxl,
    },
    errorContainer: {
      marginBottom: theme.spacing.md,
    },
    headerContainer: {
      marginBottom: theme.spacing.md,
    },
    header: {
      color: theme.colors.text.primary,
      fontSize: theme.fonts.size.xl,
      fontWeight: "bold",
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
  };
});
