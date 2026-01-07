import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { z } from "zod";

import { useTheme } from "@/components/providers/theme-provider";
import Input from "@/components/ui/input";
import { auth, OTPChannel, OTPPurpose } from "@/lib/auth";
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
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>
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

      <TouchableOpacity
        style={[styles.continueButton, !canSubmit && { opacity: 0.5 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={!canSubmit}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.resendCodeContainer}>
        <Text>
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
              isResendDisabled && { color: theme.colors.disabled },
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
      fontSize: theme.fonts.size.lg,
    },
    headerContainer: {
      marginBottom: theme.spacing.xl,
    },
    headerText: {
      fontSize: theme.fonts.size.xl,
      fontWeight: "bold",
    },
    subHeaderContainer: {
      marginTop: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    subHeaderText: {
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
    codeInput: {
      fontSize: theme.fonts.size.lg,
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderRadius: 8,
      padding: theme.spacing.sm,
    },
    continueButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: theme.spacing.sm,
      width: "100%",
      height: theme.spacing.xxl,
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonText: {
      color: theme.colors.text.inverse,
    },
    resendCodeContainer: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    resendCodeText: {
      fontSize: theme.fonts.size.sm,
      color: theme.colors.text.primary,
    },
  });
});
