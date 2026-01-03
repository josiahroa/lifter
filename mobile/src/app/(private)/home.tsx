import { View, Text, TouchableOpacity } from "react-native";

import { auth } from "@/src/lib/auth";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home</Text>
      <TouchableOpacity onPress={async () => await auth.logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
