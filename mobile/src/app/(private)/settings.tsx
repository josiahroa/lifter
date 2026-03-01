import { Text, View } from "react-native";

import ContentLayout from "@/components/layouts/content-layout";
import Button from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { createThemedStyles, Theme, palette } from "@/lib/styles";

export default function Tab() {
  const styles = useStyles();

  const handleLogout = async () => {
    await auth.logout();
  };

  return (
    <ContentLayout>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <Button
        size="medium"
        variant="destructive"
        rounded="small"
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Button>
    </ContentLayout>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    header: {
      marginBottom: theme.spacing.md,
    },
    headerText: {
      color: theme.colors.text.primary,
      fontSize: theme.fonts.size.xl,
      fontWeight: theme.fonts.weights.medium,
    },
    logoutButtonText: {
      color: palette.neutral[100],
    },
  };
});
