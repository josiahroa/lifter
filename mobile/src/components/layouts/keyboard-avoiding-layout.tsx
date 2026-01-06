import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";

interface KeyboardAvoidingLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  offset?: number;
}

export default function KeyboardAvoidingLayout({
  children,
  style,
  offset = 0.5,
}: KeyboardAvoidingLayoutProps) {
  const keyboard = useAnimatedKeyboard();

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboard.height.value * offset }],
    };
  });

  return (
    <Animated.View style={[style, contentStyle]}>{children}</Animated.View>
  );
}
