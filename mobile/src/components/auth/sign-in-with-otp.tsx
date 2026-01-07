import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

import { useTheme } from "@/components/providers/theme-provider";
import Input from "@/components/ui/input";
import { auth, OTPChannel, OTPPurpose, SignInGlobalError } from "@/lib/auth";
import { type Theme, createThemedStyles } from "@/lib/styles";

interface SignInWithOTPFormValues {
  identifier: string;
}

interface SignInWithOTPProps {
  onGlobalError: (error: SignInGlobalError) => void;
}

const emailSchema = z.email("Please enter a valid email");

export default function SignInWithOTP({ onGlobalError }: SignInWithOTPProps) {
  const { theme } = useTheme();
  const styles = useStyles();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<SignInWithOTPFormValues>({
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: SignInWithOTPFormValues) => {
    try {
      const identifier = data.identifier.trim();
      const response = await auth.startOTPChallenge(
        identifier,
        OTPChannel.EMAIL,
        OTPPurpose.SIGN_IN
      );

      if (!response) {
        console.warn("Failed to start OTP challenge");
        return;
      }

      router.push({
        pathname: "/auth/confirm-otp",
        params: {
          channel: OTPChannel.EMAIL,
          identifier: data.identifier,
          challengeId: response.challengeId,
        },
      });
    } catch (error) {
      console.error("Failed to sign in with email", error);
      if (isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          onGlobalError(
            new SignInGlobalError(
              "A network error occurred, please try again later."
            )
          );
          return;
        }
      }
      onGlobalError(
        new SignInGlobalError(
          "An unexpected error occurred, please try again later."
        )
      );
    }
  };

  const InputError = ({ message }: { message: string }) => {
    return <Text style={{ color: "black" }}>{message}</Text>;
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="identifier"
        rules={{
          validate: (value) => {
            const result = emailSchema.safeParse(value.trim());
            return result.success ? true : result.error.issues[0]?.message;
          },
        }}
        render={({ field }) => (
          <Input
            placeholder="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            autoCorrect={false}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholderTextColor={theme.colors.text.secondary}
          />
        )}
      />
      {errors.identifier && (
        <InputError message={errors.identifier.message ?? ""} />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      width: "100%",
      gap: theme.spacing.md,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: theme.spacing.sm,
      width: "100%",
      height: theme.spacing.xxl,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
  };
});
