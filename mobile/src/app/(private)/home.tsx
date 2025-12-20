import { auth } from "@/src/lib/auth";
import { View, Text, TouchableOpacity } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home</Text>
      <TouchableOpacity onPress={() => auth.logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
