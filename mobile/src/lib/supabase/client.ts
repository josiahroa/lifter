import { ExpoSecureStoreAdapter } from "./auth-storage";
import { createClient } from "@supabase/supabase-js";

export const client = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      storage: new ExpoSecureStoreAdapter(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
