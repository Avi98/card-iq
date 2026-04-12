import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PermissionStatus } from "expo-modules-core";
import { requestPermissionsAsync } from "expo-sms-reader";
import { startSmsPoll, stopSmsPoll } from "../services/SmsPollingService";
import type { SmsMessage } from "expo-sms-reader";

const { width, height } = Dimensions.get("window");

interface PermissionCardProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function PermissionCard({
  icon,
  iconColor,
  bgColor,
  title,
  description,
  checked,
  onToggle,
}: PermissionCardProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.permissionCard}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function PermissionsScreen(): React.JSX.Element {
  const router = useRouter();
  const [smsChecked, setSmsChecked] = React.useState(false);
  const [gmailChecked, setGmailChecked] = React.useState(false);

  // Stop polling if the user navigates away without continuing.
  React.useEffect(() => {
    return () => stopSmsPoll();
  }, []);

  const handleSmsToggle = async () => {
    debugger;
    if (smsChecked) {
      // Already granted — toggling off is informational only; we don't revoke.
      setSmsChecked(false);
      stopSmsPoll();
      return;
    }

    if (Platform.OS !== "android") {
      setSmsChecked(true);
      return;
    }

    try {
      const result = await requestPermissionsAsync();
      if (result.status === PermissionStatus.GRANTED) {
        setSmsChecked(true);
        startSmsPoll(handleIncomingSms);
      }
    } catch (e) {
      console.error("SMS permission request failed:", e);
    }
  };

  const handleIncomingSms = (msgs: SmsMessage[]) => {
    // TODO: forward to card-detection logic in a later step.
    console.log("New SMS messages:", msgs);
  };

  const handleAllowAndContinue = async () => {
    debugger;
    if (!smsChecked && Platform.OS === "android") {
      try {
        const result = await requestPermissionsAsync();
        if (result.status === PermissionStatus.GRANTED) {
          setSmsChecked(true);
          startSmsPoll(handleIncomingSms);
        }
      } catch (e) {
        console.error("SMS permission request failed:", e);
      }
    }
    // router.push("/step3");
  };

  const handleSkip = () => {
    stopSmsPoll();
    router.push("/step3");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1322" />

      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      <View style={styles.content}>
        <View style={styles.cardVisualization}>
          <View style={styles.cardContainer}>
            <View style={styles.creditCard}>
              <View style={styles.cardChip} />
              <View style={styles.cardLine} />
              <View style={styles.cardCircle} />
              <View style={[styles.scanningLine, { top: "20%" }]} />
            </View>
            <View style={styles.glassOverlay} />
          </View>
        </View>

        <View style={styles.permissionsList}>
          <PermissionCard
            icon="💬"
            iconColor="#c3c0ff"
            bgColor="rgba(79, 70, 229, 0.1)"
            title="SMS access"
            description="We read bank SMS to detect your cards. No personal messages."
            checked={smsChecked}
            onToggle={handleSmsToggle}
          />
          <PermissionCard
            icon="📧"
            iconColor="#ffb955"
            bgColor="rgba(133, 86, 0, 0.1)"
            title="Gmail access"
            description="We scan bank emails only. Secure end-to-end processing."
            checked={gmailChecked}
            onToggle={() => setGmailChecked((v) => !v)}
          />
        </View>

        <View style={styles.trustIndicator}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.trustText}>
            Military grade 256-bit encryption
          </Text>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleAllowAndContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Allow & continue</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.6}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1322",
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.1,
    left: -width * 0.1,
    width: width * 0.4,
    height: height * 0.4,
    backgroundColor: "#4f46e5",
    opacity: 0.1,
    borderRadius: 999,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -height * 0.1,
    right: -width * 0.1,
    width: width * 0.4,
    height: height * 0.4,
    backgroundColor: "#855600",
    opacity: 0.05,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 140,
  },
  cardVisualization: {
    marginBottom: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: 288,
    height: 176,
    borderRadius: 16,
    backgroundColor: "rgba(47, 52, 69, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  creditCard: {
    width: 240,
    height: 144,
    borderRadius: 12,
    backgroundColor: "#25293a",
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardChip: {
    width: 40,
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(79, 70, 229, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.3)",
  },
  cardLine: {
    width: 128,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(199, 196, 216, 0.1)",
    alignSelf: "flex-start",
  },
  cardCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(65, 70, 88, 0.2)",
    alignSelf: "flex-end",
  },
  scanningLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#c3c0ff",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  permissionsList: {
    width: "100%",
    maxWidth: 448,
    gap: 16,
  },
  permissionCard: {
    flexDirection: "row",
    backgroundColor: "#1a1f2f",
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dee1f7",
    marginBottom: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#464555",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  checkmark: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: 14,
    color: "#c7c4d8",
    lineHeight: 20,
  },
  trustIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    opacity: 0.6,
  },
  lockIcon: {
    fontSize: 14,
  },
  trustText: {
    fontSize: 10,
    color: "#c7c4d8",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "700",
  },
  ctaSection: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    maxWidth: 448,
    width: "100%",
    alignSelf: "center",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dad7ff",
  },
  arrowIcon: {
    fontSize: 18,
    color: "#dad7ff",
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 16,
  },
  skipButtonText: {
    fontSize: 12,
    color: "#c7c4d8",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
