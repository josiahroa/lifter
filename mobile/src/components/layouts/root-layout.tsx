import { Keyboard, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type Theme, createThemedStyles } from "@/lib/styles";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {children}
      </Pressable>
    </SafeAreaView>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background.app,
    },
    content: {
      flex: 1,
    },
  });
});
