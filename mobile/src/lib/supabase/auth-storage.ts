import * as SecureStore from "expo-secure-store";
import { SupportedStorage } from "@supabase/supabase-js";

export class ExpoSecureStoreAdapter implements SupportedStorage {
  constructor(private readonly secureStore: typeof SecureStore = SecureStore) {}

  async getItem(key: string): Promise<string | null> {
    return this.secureStore.getItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    return this.secureStore.setItemAsync(key, value);
  }

  async removeItem(key: string): Promise<void> {
    return this.secureStore.deleteItemAsync(key);
  }
}
