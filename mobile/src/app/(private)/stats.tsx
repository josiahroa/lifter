import { Text, View } from "react-native";

import ContentLayout from "@/components/layouts/content-layout";
import { createThemedStyles, Theme } from "@/lib/styles";

export default function Tab() {
  const styles = useStyles();

  return (
    <ContentLayout>
      <View style={styles.header}>
        <Text style={styles.headerText}>Statistics</Text>
      </View>
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
    text: {
      color: theme.colors.text.primary,
    },
  };
});
