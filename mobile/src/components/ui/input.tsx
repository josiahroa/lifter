import { TextInput, TextInputProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/components/providers/theme-provider";
import { createThemedStyles } from "@/lib/styles";
import { Theme } from "@/lib/styles/theme";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Input({ ...textProps }: TextInputProps) {
  const { theme } = useTheme();

  const styles = useStyles();

  const focus = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [theme.colors.border.secondary, theme.colors.border.primary]
    ),
  }));

  return (
    <AnimatedTextInput
      {...textProps}
      style={[styles.input, animatedStyle]}
      onFocus={(e) => {
        focus.value = withTiming(1, { duration: 200 });
        textProps.onFocus?.(e);
      }}
      onBlur={(e) => {
        focus.value = withTiming(0, { duration: 200 });
        textProps.onBlur?.(e);
      }}
    />
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    input: {
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderRadius: 8,
      padding: theme.spacing.sm,
      width: "100%",
      height: theme.spacing.xxl,
    },
  };
});
