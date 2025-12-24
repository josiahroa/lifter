import { View, Text } from "react-native";
import SignInWithGoogle from "@/src/components/auth/sign-in-with-google";
import SignInWithApple from "@/src/components/auth/sign-in-with-apple";
import SignInWithEmailOTP from "@/src/components/auth/sign-in-with-email-otp";

export default function SignIn() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Sign In Screen</Text>
      <SignInWithGoogle />
      <SignInWithApple />
      <Text>Or</Text>
      <Text>Receive a code by email</Text>
      <SignInWithEmailOTP />
    </View>
  );
}
