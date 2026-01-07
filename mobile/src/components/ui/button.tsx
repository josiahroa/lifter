import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { createThemedStyles, Theme } from "@/lib/styles";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.button} {...props}>
      {children}
    </TouchableOpacity>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: theme.spacing.sm,
      width: "100%",
      height: theme.spacing.xxl,
    },
  };
});
