import { View, Text } from "react-native";

import SignInWithEmailOTP from "@/components/auth/sign-in-with-email-otp";

export default function SignIn() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text>Sign In Screen</Text>
      <Text>Receive a code by email</Text>
      <SignInWithEmailOTP />
    </View>
  );
}
