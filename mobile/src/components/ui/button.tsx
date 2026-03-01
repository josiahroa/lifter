import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/components/providers/theme-provider";
import { Theme } from "@/lib/styles";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant =
  | "primary"
  | "destructive"
  | "ghost"
  | "inverse"
  | "success";
type ButtonRounded = "small" | "large" | "circle";

interface ButtonProps extends TouchableOpacityProps {
  size: ButtonSize;
  variant?: ButtonVariant;
  rounded?: ButtonRounded;
  children: React.ReactNode;
}

const ROUNDED_VALUES: Record<Exclude<ButtonRounded, "circle">, number> = {
  small: 8,
  large: 16,
};

const SIZE_HEIGHT_MAP: Record<ButtonSize, keyof Theme["heights"]> = {
  small: "sm",
  medium: "md",
  large: "lg",
};

function getBackgroundColor(
  theme: Theme,
  variant: ButtonVariant,
  disabled?: boolean | null
): string {
  if (disabled) {
    return variant === "ghost" ? "transparent" : theme.colors.action.disabled;
  }

  switch (variant) {
    case "primary":
      return theme.colors.action.primary;
    case "destructive":
      return theme.colors.action.destructive;
    case "ghost":
      return "transparent";
    case "inverse":
      return theme.colors.action.inverse;
    case "success":
      return theme.colors.action.success;
  }
}

export default function Button({
  size,
  variant = "primary",
  rounded = "small",
  disabled,
  style,
  children,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const height = theme.heights[SIZE_HEIGHT_MAP[size]];
  const isCircle = rounded === "circle";

  const buttonStyle: ViewStyle = {
    height,
    width: isCircle ? height : "100%",
    borderRadius: isCircle ? height / 2 : ROUNDED_VALUES[rounded],
    backgroundColor: getBackgroundColor(theme, variant, disabled),
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
