import { useMemo } from "react";
import { StyleSheet } from "react-native";

import type { Theme } from "@/lib/styles";

import { useTheme } from "@/components/providers/theme-provider";

/**
 * Creates a hook that returns a themed styles object.
 * @example
 * ```tsx
 * const useStyles = createThemedStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *   },
 * }));
 *
 * function MyComponent() {
 *   const styles = useStyles();
 *   return <View style={styles.container} />;
 * }
 * ```
 */
export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T
) {
  return function useStyles() {
    const { theme } = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
