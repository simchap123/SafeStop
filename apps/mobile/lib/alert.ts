import { Alert, Platform } from "react-native";

type AlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

/**
 * Cross-platform alert that works on both native and web.
 * On native: uses React Native's Alert.alert
 * On web: uses window.confirm for two-button alerts, window.alert for single
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  // Web fallback
  if (!buttons || buttons.length === 0) {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }

  if (buttons.length === 1) {
    window.alert(message ? `${title}\n\n${message}` : title);
    buttons[0].onPress?.();
    return;
  }

  // Two+ buttons: use confirm dialog
  // The last non-cancel button is the action, cancel is the dismiss
  const cancelBtn = buttons.find((b) => b.style === "cancel");
  const actionBtn = buttons.find((b) => b.style !== "cancel") || buttons[buttons.length - 1];

  const confirmed = window.confirm(
    message ? `${title}\n\n${message}` : title
  );

  if (confirmed) {
    actionBtn.onPress?.();
  } else {
    cancelBtn?.onPress?.();
  }
}
