import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { auth } from "@/src/lib/auth";

interface SignInWithEmailOTPPayload {
  email: string;
}

export default function SignInWithEmailOTP() {
  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<SignInWithEmailOTPPayload>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SignInWithEmailOTPPayload) => {
    try {
      const response = await auth.requestOTPCode("email", data.email);
      if (!response.success) {
        console.warn("Failed to request email verification code");
        return;
      }

      router.push({
        pathname: "/auth/confirm-email-otp",
        params: { email: data.email },
      });
    } catch (error) {
      console.error("Failed to sign in with email", error);
    }
  };

  const email = watch("email");
  const canSubmit = !!email && !isSubmitting;

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, ...field } }) => (
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={!canSubmit}>
        <Text>Send Code</Text>
      </TouchableOpacity>
    </View>
  );
}
