import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import {
  ChartBarIcon,
  HomeIcon,
  SettingsIcon,
  LucideIcon,
} from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TabTriggerSlotProps } from "expo-router/ui";

import { useTheme } from "@/components/providers/theme-provider";
import { createThemedStyles, Theme } from "@/lib/styles";

const ANIMATION_DURATION = 200;

type TabButtonProps = TabTriggerSlotProps & {
  icon: LucideIcon;
};

function TabButton({ icon: Icon, isFocused, ...props }: TabButtonProps) {
  const styles = useStyles();
  const { theme } = useTheme();

  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFocused, progress]);

  const focusedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const unfocusedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  return (
    <Pressable {...props} style={styles.tabButton}>
      {/* Unfocused icon */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.iconContainer, unfocusedStyle]}
      >
        <Icon color={theme.colors.text.subtle} size={24} strokeWidth={1.5} />
      </Animated.View>

      {/* Focused icon */}
      <Animated.View style={[styles.iconContainer, focusedStyle]}>
        <Icon color={theme.colors.text.primary} size={24} strokeWidth={1.5} />
      </Animated.View>
    </Pressable>
  );
}

export default function TabLayout() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.container}>
      <TabSlot />
      <TabList style={[styles.tabList, { paddingBottom: insets.bottom }]}>
        <TabTrigger name="index" href="/" asChild>
          <TabButton icon={HomeIcon} />
        </TabTrigger>
        <TabTrigger name="statistics" href="/stats" asChild>
          <TabButton icon={ChartBarIcon} />
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" asChild>
          <TabButton icon={SettingsIcon} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      flex: 1,
    },
    tabList: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      width: 50,
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
  };
});
