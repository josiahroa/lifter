import { View, Text } from "react-native";
// import { StyleSheet } from "react-native";
// import * as AppleAuthentication from "expo-apple-authentication";

export default function SignInWithApple() {
  return (
    <View>
      <Text>Sign In With Apple Not Implemented</Text>
    </View>
  );
  //   return (
  //     <AppleAuthentication.AppleAuthenticationButton
  //       buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
  //       buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
  //       cornerRadius={5}
  //       style={styles.button}
  //       onPress={async () => {
  //         try {
  //           const credential = await AppleAuthentication.signInAsync({
  //             requestedScopes: [
  //               AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //               AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //             ],
  //           });
  //           console.log(credential);
  //           // signed in
  //         } catch (e: unknown) {
  //           if ((e as { code: string }).code === "ERR_REQUEST_CANCELED") {
  //             // handle that the user canceled the sign-in flow
  //           } else {
  //             // handle other errors
  //           }
  //         }
  //       }}
  //     />
  //   );
}

// const styles = StyleSheet.create({
//   button: {
//     width: 200,
//     height: 44,
//   },
// });
