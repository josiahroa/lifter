import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { z } from "zod";

import { useTheme } from "@/components/providers/theme-provider";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { auth, OTPChannel, OTPPurpose, SignInError } from "@/lib/auth";
import { type Theme, createThemedStyles } from "@/lib/styles";

interface SignInWithOTPFormValues {
  identifier: string;
}

interface SignInWithOTPProps {
  onError: (error: SignInError) => void;
}

const emailSchema = z.email("Please enter a valid email");

export default function SignInWithOTP({ onError }: SignInWithOTPProps) {
  const styles = useStyles();
  const { theme } = useTheme();

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
          console.warn("Check that the server is running.");
        }
      }

      onError(
        new SignInError(
          "An unexpected error occurred.",
          "Please try again later."
        )
      );
    }
  };

  const InputError = ({ message }: { message: string }) => {
    return <Text style={styles.inputError}>{message}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
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
      </View>

      <View style={styles.buttonContainer}>
        <Button
          size="large"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Button>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return {
    container: {
      width: "100%",
      gap: theme.spacing.md,
    },
    inputContainer: {
      gap: theme.spacing.sm,
    },
    buttonContainer: {
      width: "100%",
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
    inputError: {
      color: theme.colors.status.error,
      fontSize: theme.fonts.size.sm,
      fontWeight: theme.fonts.weights.regular,
    },
  };
});
