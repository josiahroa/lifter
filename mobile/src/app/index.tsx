import { Redirect } from "expo-router";

import { useAuth } from "../components/providers/auth-provider";

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(private)/home" />;
  }

  return <Redirect href="/auth/sign-in" />;
}
