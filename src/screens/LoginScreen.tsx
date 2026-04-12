import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export default function LoginScreen(): React.JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      handleAuthSuccess(response.authentication?.accessToken);
    } else if (response?.type === "error") {
      console.error("Auth error:", response.error);
      setIsLoading(false);
    }
  }, [response]);

  const handleAuthSuccess = async (accessToken?: string | null) => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      // todo: fix this once all screens are done
      // const userInfoResponse = await fetch(
      //   "https://www.googleapis.com/userinfo/v2/me",
      //   {
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   },
      // );
      // const userInfo = await userInfoResponse.json();
      // console.log("User info:", userInfo);
      router.push("/step2");
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // todo add auth once rest screen is done
      // await promptAsync();
      router.push("/step2");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1322" />

      <View style={styles.backgroundGradient} pointerEvents="none" />
      <View style={styles.backgroundBlur} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
          </View>

          <Text style={styles.title}>CardIQ</Text>
        </View>

        <View style={styles.taglineSection}>
          <Text style={styles.tagline}>Spend smart. Earn more.</Text>
          <Text style={styles.description}>
            The premium vault for your financial intelligence and credit
            optimization.
          </Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.googleButton,
            (isLoading || !request) && styles.googleButtonDisabled,
          ]}
          onPress={handleGoogleSignIn}
          disabled={isLoading || !request}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>
            {isLoading ? "Signing in..." : "Get started with Google"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.securityBadge}>
          🔒 Secure 256-bit AES Encryption
        </Text>
      </View>

      <View style={styles.bottomGradient} pointerEvents="none" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1322",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    opacity: 0.15,
  },
  backgroundBlur: {
    position: "absolute",
    top: height * 0.25,
    left: width / 2 - 300,
    width: 600,
    height: 600,
    backgroundColor: "#c3c0ff",
    opacity: 0.05,
    borderRadius: 300,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#2f3445",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  shieldIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#e2e8f0",
    letterSpacing: -1,
  },
  taglineSection: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#c7c4d8",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
  },
  actionSection: {
    position: "absolute",
    bottom: 64,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  securityBadge: {
    marginTop: 32,
    fontSize: 10,
    color: "#c7c4d8",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
    opacity: 0.6,
  },
  bottomGradient: {
    position: "absolute",
    bottom: -128,
    left: 0,
    right: 0,
    height: 500,
    opacity: 0.2,
  },
});
