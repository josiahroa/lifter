import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { z } from "zod";

import { useTheme } from "@/components/providers/theme-provider";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { auth, OTPChannel, OTPPurpose, SignInError } from "@/lib/auth";
import { type Theme, createThemedStyles } from "@/lib/styles";

export interface ConfirmOTPFormValues {
  code: string;
}

const otpCodeSchema = z.string().length(6);

export default function ConfirmOTP() {
  const styles = useStyles();
  const { theme } = useTheme();
  const { channel, challengeId, identifier } = useLocalSearchParams<{
    channel: OTPChannel;
    challengeId: string;
    identifier: string;
  }>();

  const [resendRemainingTime, setResendRemainingTime] = useState(0);
  const [error, setError] = useState<SignInError | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<ConfirmOTPFormValues>({
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ConfirmOTPFormValues) => {
    try {
      const session = await auth.loginWithOTP({
        channel,
        purpose: OTPPurpose.SIGN_IN,
        challengeId,
        identifier,
        code: data.code,
      });

      if (!session) {
        console.warn("Failed to confirm OTP");
        return;
      }

      router.replace("/(private)/home");
    } catch (error) {
      console.error("Failed to confirm OTP", error);
      setError(
        new SignInError(
          "An unexpected error occurred.",
          "Please try again later."
        )
      );
    }
  };

  const resendCode = async () => {
    try {
      if (resendRemainingTime > 0) return;

      const response = await auth.startOTPChallenge(
        identifier,
        channel,
        OTPPurpose.SIGN_IN
      );

      if (!response) {
        console.warn("Failed to request OTP verification code");
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

  const canSubmit = isValid && !isSubmitting;
  const isResendDisabled = resendRemainingTime > 0;

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <View>
          <TouchableOpacity onPress={() => router.replace("/auth/sign-in")}>
            <Text style={styles.menuText}>←</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Verify your {channel as string}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Alert
              title={error.message}
              description={error.description}
              type="error"
            />
          </View>
        )}

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subText}>
            We sent a 6-digit one time passcode to
          </Text>
          <Text style={styles.identifierText}>{identifier}</Text>
        </View>
      </View>

      <View style={styles.codeInputContainer}>
        <Controller
          control={control}
          name="code"
          rules={{
            validate: (value) => {
              const result = otpCodeSchema.safeParse(value);
              return result.success ? true : result.error.issues[0]?.message;
            },
          }}
          render={({ field: { onChange, onBlur, ...field } }) => (
            <Input
              placeholder="6-digit code"
              value={field.value}
              onChangeText={(text) => {
                // Keep it numeric and capped at 6 chars for a smoother UX.
                const sanitized = text.replace(/\D/g, "").slice(0, 6);
                onChange(sanitized);
              }}
              onBlur={onBlur}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor={theme.colors.text.secondary}
            />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          size="large"
          onPress={handleSubmit(onSubmit)}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Button>
      </View>

      <View style={styles.resendCodeContainer}>
        <Text style={styles.subText}>
          {`Didn't receive the code? ${
            resendRemainingTime > 0
              ? `(00:${String(resendRemainingTime).padStart(2, "0")})`
              : ""
          }`}
        </Text>
        <TouchableOpacity onPress={resendCode} disabled={isResendDisabled}>
          <Text
            style={[
              styles.resendCodeText,
              isResendDisabled && { color: theme.colors.text.disabled },
            ]}
          >
            Resend one time passcode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    menuContainer: {
      paddingVertical: theme.spacing.lg,
    },
    menuText: {
      color: theme.colors.text.primary,
      fontSize: theme.fonts.size.lg,
    },
    headerContainer: {
      marginBottom: theme.spacing.xl,
    },
    headerText: {
      color: theme.colors.text.primary,
      fontSize: theme.fonts.size.xl,
      fontWeight: "bold",
    },
    subHeaderContainer: {
      marginTop: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    subText: {
      fontSize: theme.fonts.size.sm,
      color: theme.colors.text.secondary,
    },
    identifierText: {
      fontSize: theme.fonts.size.sm,
      color: theme.colors.text.primary,
    },
    codeInputContainer: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    buttonContainer: {
      width: "100%",
    },
    buttonText: {
      color: theme.colors.text.inverse,
    },
    resendCodeContainer: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    resendCodeText: {
      fontSize: theme.fonts.size.sm,
      color: theme.colors.action.link,
    },
    errorContainer: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
  });
});
