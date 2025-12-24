import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { auth } from "@/src/lib/auth-client";

export interface ConfirmEmailOTPPayload {
  code: string;
}

export default function ConfirmEmailOTP() {
  const { email } = useLocalSearchParams();

  const [resendRemainingTime, setResendRemainingTime] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<ConfirmEmailOTPPayload>({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: ConfirmEmailOTPPayload) => {
    try {
      const session = await auth.signIn("emailOTP", {
        email: email as string,
        code: data.code,
      });

      if (!session) {
        console.warn("Failed to confirm email");
        return;
      }

      router.replace("/(private)/home");
    } catch (error) {
      console.error("Failed to confirm email", error);
    }
  };

  const resendCode = async () => {
    try {
      if (resendRemainingTime > 0) return;

      const response = await auth.requestEmailVerificationCode(email as string);
      if (!response.success) {
        console.warn("Failed to request email verification code");
        return;
      }

      setResendRemainingTime(59);
    } catch (error) {
      console.error("Failed to resend code", error);
    }
  };

  useEffect(() => {
    if (resendRemainingTime <= 0) return;

    const interval = setInterval(() => {
      setResendRemainingTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendRemainingTime]);

  const code = watch("code");
  const canSubmit = !!code && !isSubmitting;
  const isResendDisabled = resendRemainingTime > 0;
  const resendLabel = isResendDisabled
    ? `Resend in 00:${String(resendRemainingTime % 60).padStart(2, "0")}`
    : "Resend verification email";

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Verify your email</Text>
      <Text>Please enter the 6 digit code sent to</Text>
      <Text>{typeof email === "string" ? email : ""}</Text>
      <Text>Didn't receive the email?</Text>

      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, ...field } }) => (
          <TextInput
            placeholder="6-digit code"
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="number-pad"
          />
        )}
      />

      <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={!canSubmit}>
        <Text>Confirm email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resendCode} disabled={isResendDisabled}>
        <Text>{resendLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/auth/sign-in")}>
        <Text>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
