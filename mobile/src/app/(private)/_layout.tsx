import { Stack } from "expo-router";

export default function PrivateLayout() {
  // useEffect(() => {
  //   (async () => {
  //     await system.init();
  //   })();
  // }, []);

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
