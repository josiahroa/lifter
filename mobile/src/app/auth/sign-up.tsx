import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

import { auth } from "../../lib/auth-client";

export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<SignUpPayload>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpPayload) => {
    try {
      const session = await auth.signUpWithEmail(data.email, data.password);

      if (!session) {
        console.warn("Email verification required");
        router.replace({
          pathname: "/auth/verify-email",
          params: { email: data.email },
        });
        return;
      }
    } catch (error) {
      console.error("Failed to sign up with email", error);
    }
  };

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const isPasswordMatch = password === confirmPassword;

  const canSubmit =
    isPasswordMatch &&
    !!email &&
    !!password &&
    !!confirmPassword &&
    !isSubmitting;

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Sign Up Screen</Text>
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
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, ...field } }) => (
          <TextInput
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, ...field } }) => (
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            value={field.value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={!canSubmit}
        className={`bg-blue-500 p-2 rounded-md ${
          !canSubmit ? "opacity-50" : ""
        }`}
      >
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <Text>Already have an account?</Text>
      <TouchableOpacity onPress={() => router.replace("/auth/sign-in")}>
        <Text>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
