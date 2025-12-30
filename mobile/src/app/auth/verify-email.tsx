import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

import { auth } from "@/src/lib/auth-client";

export interface VerifyEmailPayload {
  token: string;
}

export default function VerifyEmail() {
  const { email } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<VerifyEmailPayload>({
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: VerifyEmailPayload) => {
    try {
      await auth.confirmEmail(email as string, data.token);
      router.replace("/(private)/home");
    } catch (error) {
      console.error("Failed to confirm email", error);
    }
  };

  const token = watch("token");

  const canSubmit = !!token && !isSubmitting;

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Check your inbox</Text>
      <Text>We sent a verification email to your inbox</Text>
      <Text>Didn't receive the email?</Text>

      <TouchableOpacity>
        <Text>Resend verification email</Text>
      </TouchableOpacity>

      <Controller
        control={control}
        name="token"
        render={({ field: { onChange, onBlur, ...field } }) => (
          <TextInput
            placeholder="Token"
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={!canSubmit}>
        <Text>Verify email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/auth/sign-in")}>
        <Text>Go to sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
