import { View } from "react-native";

import { createThemedStyles, Theme } from "@/lib/styles";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  const styles = useStyles();

  return <View style={styles.container}>{children}</View>;
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.lg,
    },
  };
});
