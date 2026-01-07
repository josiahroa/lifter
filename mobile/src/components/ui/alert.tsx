import {
  InfoIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react-native";
import { View, Text } from "react-native";

import { useTheme } from "@/components/providers/theme-provider";
import { createThemedStyles } from "@/lib/styles";
import { type Theme } from "@/lib/styles";

interface AlertProps {
  title: string;
  type?: "info" | "warning" | "error" | "success";
  description?: string;
}

export default function Alert({
  title,
  description,
  type = "info",
}: AlertProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  const getContentColor = (type: AlertProps["type"]) => {
    switch (type) {
      case "info":
        return theme.colors.status.info;
      case "success":
        return theme.colors.status.info;
      case "warning":
        return theme.colors.status.warning;
      case "error":
        return theme.colors.status.error;
    }
    return theme.colors.text.primary;
  };

  const renderIcon = (type: AlertProps["type"]) => {
    const ICON_SIZE = 18;
    switch (type) {
      case "info":
        return <InfoIcon color={getContentColor(type)} size={ICON_SIZE} />;
      case "success":
        return (
          <CheckCircleIcon color={getContentColor(type)} size={ICON_SIZE} />
        );
      case "warning":
        return (
          <AlertCircleIcon color={getContentColor(type)} size={ICON_SIZE} />
        );
      case "error":
        return (
          <AlertCircleIcon color={getContentColor(type)} size={ICON_SIZE} />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon(type)}</View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: getContentColor(type) }]}>
          {title}
        </Text>
        {description && (
          <View style={styles.descriptionContainer}>
            <Text
              style={[styles.description, { color: getContentColor(type) }]}
            >
              {description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.background.surface,
      padding: theme.spacing.md,
      borderRadius: theme.spacing.sm,
      width: "100%",
    },
    iconContainer: {
      width: 24,
      height: 24,
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.spacing.sm,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fonts.size.sm,
      fontWeight: theme.fonts.weights.semibold,
    },
    descriptionContainer: {
      marginTop: theme.spacing.sm,
    },
    description: {
      fontSize: theme.fonts.size.sm,
    },
  };
});
