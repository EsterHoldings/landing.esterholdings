import { getCurrentInstance } from "vue";

export function useModalControl() {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error("useModalControl must be called within a setup function.");
    }

    const { openModal } = instance.appContext.config.globalProperties.$modalControl as { openModal: Function };

    if (!openModal) {
        throw new Error("modalControl is not provided");
    }

    return { openModal };
}