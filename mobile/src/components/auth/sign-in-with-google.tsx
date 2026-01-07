import { Text, TouchableOpacity } from "react-native";

import { type Theme, createThemedStyles } from "@/lib/styles";

export default function SignInWithGoogle() {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign In With Google</Text>
    </TouchableOpacity>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
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
  };
});
