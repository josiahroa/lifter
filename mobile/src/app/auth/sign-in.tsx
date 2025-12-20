import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { auth } from "@/src/lib/auth";

export interface SignInPayload {
  email: string;
  password: string;
}

export default function SignIn() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<SignInPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInPayload) => {
    try {
      await auth.signIn("email", {
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Failed to sign in with email", error);
    }
  };

  const email = watch("email");
  const password = watch("password");

  const canSubmit = !!email && !!password && !isSubmitting;

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Sign In Screen</Text>
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
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={!canSubmit}
        className={`bg-blue-500 p-2 rounded-md ${
          !canSubmit ? "opacity-50" : ""
        }`}
      >
        <Text>Sign In with Email</Text>
      </TouchableOpacity>
      <Text>Don't have an account?</Text>
      <TouchableOpacity onPress={() => router.replace("/auth/sign-up")}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
