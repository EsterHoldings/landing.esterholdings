import { defineStore } from "pinia";
import { ref } from "vue";

const normalizeCount = (value: unknown): number => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
};

export const CLIENT_WITHDRAWAL_NOTIFICATION_TYPES = ["payments.withdrawal.status-updated"];
export const CLIENT_SUPPORT_NOTIFICATION_TYPES = ["support.message"];

export const useNotificationsStore = defineStore("notifications", () => {
  const unreadCount = ref(0);
  const unreadWithdrawalNotificationsCount = ref(0);
  const unreadSupportNotificationsCount = ref(0);

  const applySummary = (payload?: any) => {
    unreadCount.value = normalizeCount(payload?.unread_count);
    unreadWithdrawalNotificationsCount.value = normalizeCount(payload?.unread_withdrawal_notifications_count);
    unreadSupportNotificationsCount.value = normalizeCount(payload?.unread_support_notifications_count);
  };

  const incrementForNotification = (type: string) => {
    unreadCount.value += 1;

    if (CLIENT_WITHDRAWAL_NOTIFICATION_TYPES.includes(String(type ?? "").trim())) {
      unreadWithdrawalNotificationsCount.value += 1;
    }

    if (CLIENT_SUPPORT_NOTIFICATION_TYPES.includes(String(type ?? "").trim())) {
      unreadSupportNotificationsCount.value += 1;
    }
  };

  const decrementForNotification = (type: string) => {
    unreadCount.value = Math.max(0, unreadCount.value - 1);

    if (CLIENT_WITHDRAWAL_NOTIFICATION_TYPES.includes(String(type ?? "").trim())) {
      unreadWithdrawalNotificationsCount.value = Math.max(0, unreadWithdrawalNotificationsCount.value - 1);
    }

    if (CLIENT_SUPPORT_NOTIFICATION_TYPES.includes(String(type ?? "").trim())) {
      unreadSupportNotificationsCount.value = Math.max(0, unreadSupportNotificationsCount.value - 1);
    }
  };

  const reset = () => {
    unreadCount.value = 0;
    unreadWithdrawalNotificationsCount.value = 0;
    unreadSupportNotificationsCount.value = 0;
  };

  return {
    applySummary,
    decrementForNotification,
    incrementForNotification,
    reset,
    unreadCount,
    unreadSupportNotificationsCount,
    unreadWithdrawalNotificationsCount,
  };
});

export default useNotificationsStore;
