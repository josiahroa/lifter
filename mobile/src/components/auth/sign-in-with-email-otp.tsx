import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useMemo } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/components/providers/theme-provider";
import { auth, OTPChannel, OTPPurpose, SignInGlobalError } from "@/lib/auth";

interface SignInWithEmailOTPPayload {
  email: string;
}

interface SignInWithEmailOTPProps {
  onGlobalError: (error: SignInGlobalError) => void;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function SignInWithEmailOTP({
  onGlobalError,
}: SignInWithEmailOTPProps) {
  const { theme } = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
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
    });
  }, [theme]);

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<SignInWithEmailOTPPayload>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SignInWithEmailOTPPayload) => {
    try {
      const response = await auth.startOTPChallenge(
        data.email,
        OTPChannel.EMAIL,
        OTPPurpose.SIGN_IN
      );
      if (!response) {
        console.warn("Failed to start OTP challenge");
        return;
      }
      router.push({
        pathname: "/auth/confirm-email-otp",
        params: { challengeId: response.challengeId, email: data.email },
      });
    } catch (error) {
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

  const email = watch("email");
  const canSubmit = !!email && !isSubmitting;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => <EmailInput field={field} />}
      />
      {errors.email && <InputError message={errors.email.message ?? ""} />}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const EmailInput = ({
  field,
}: {
  field: ControllerRenderProps<SignInWithEmailOTPPayload, "email">;
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        input: {
          color: theme.colors.text.primary,
          borderWidth: 1,
          borderRadius: 8,
          padding: theme.spacing.sm,
          width: "100%",
          height: theme.spacing.xxl,
        },
      }),
    [theme]
  );

  const focus = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [theme.colors.border.secondary, theme.colors.border.primary]
    ),
  }));

  return (
    <AnimatedTextInput
      placeholder="Email"
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect={false}
      value={field.value}
      onChangeText={field.onChange}
      onFocus={() => {
        focus.value = withTiming(1, { duration: 200 });
      }}
      onBlur={() => {
        focus.value = withTiming(0, { duration: 200 });
        field.onBlur();
      }}
      style={[styles.input, animatedStyle]}
      placeholderTextColor={theme.colors.text.secondary}
    />
  );
};
