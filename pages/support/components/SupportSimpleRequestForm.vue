<template>
  <PanelDefault class="support-simple rounded-2xl border border-[var(--color-stroke-ui-dark)] p-5 md:p-6">
    <div class="support-simple__header mb-5">
      <UiTextH4 class="truncate">{{ t("support.simple.title") }}</UiTextH4>
      <UiTextSmall class="support-simple__subtitle">{{ t("support.simple.subtitle") }}</UiTextSmall>
    </div>

    <div class="support-simple__grid">
      <UiFormControl
        :label="t('support.simple.replyEmailLabel')"
        :errors="replyEmailError ? [replyEmailError] : []">
        <UiInput
          :value="replyEmail"
          type="email"
          :placeholder="t('support.simple.replyEmailPlaceholder')"
          @input="replyEmail = String($event || '')"
          @blur="validateReplyEmail()" />
      </UiFormControl>

      <UiFormControl
        :label="t('support.simple.subjectLabel')"
        :errors="subjectError ? [subjectError] : []">
        <UiInput
          :value="subject"
          :placeholder="t('support.simple.subjectPlaceholder')"
          @input="subject = String($event || '')"
          @blur="validateSubject()" />
      </UiFormControl>

      <UiFormControl
        :label="t('support.simple.messageLabel')"
        :errors="messageError ? [messageError] : []">
        <div class="support-simple__editor">
          <div class="support-simple__toolbar">
            <button
              type="button"
              class="support-simple__tool"
              :title="t('support.simple.tools.bold')"
              @click="applyEditorCommand('bold')">
              B
            </button>
            <button
              type="button"
              class="support-simple__tool support-simple__tool--italic"
              :title="t('support.simple.tools.italic')"
              @click="applyEditorCommand('italic')">
              I
            </button>
            <button
              type="button"
              class="support-simple__tool support-simple__tool--underline"
              :title="t('support.simple.tools.underline')"
              @click="applyEditorCommand('underline')">
              U
            </button>
            <button
              type="button"
              class="support-simple__tool"
              :title="t('support.simple.tools.list')"
              @click="applyEditorCommand('insertUnorderedList')">
              •
            </button>
            <button
              type="button"
              class="support-simple__tool"
              :title="t('support.simple.tools.link')"
              @click="insertLink()">
              ⛓
            </button>
            <button
              type="button"
              class="support-simple__tool"
              :title="t('support.simple.tools.clear')"
              @click="applyEditorCommand('removeFormat')">
              ⌫
            </button>
          </div>
          <div
            ref="editorRef"
            class="support-simple__editor-input"
            contenteditable="true"
            :data-placeholder="t('support.simple.messagePlaceholder')"
            @input="handleEditorInput"
            @blur="validateMessage()"></div>
        </div>
      </UiFormControl>

      <UiFormControl :label="t('support.simple.attachmentsLabel')">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          multiple
          @change="handleSelectFiles" />
        <div class="support-simple__attachments">
          <UiButtonDefault
            state="info--small"
            type="button"
            :disabled="isSubmitting || hasPendingUploads"
            @click="openFileDialog">
            {{ t("support.simple.addFiles") }}
          </UiButtonDefault>
          <UiTextSmall class="support-simple__hint">{{ t("support.simple.maxSizeHint") }}</UiTextSmall>
        </div>

        <ul
          v-if="selectedFiles.length"
          class="support-simple__files">
          <li
            v-for="(file, index) in selectedFiles"
            :key="file.id"
            class="support-simple__file-item">
            <div class="support-simple__file-content">
              <div class="support-simple__file-head">
                <span class="truncate">{{ shortFileName(file.name) }} ({{ formatFileSize(file.size) }})</span>
                <span
                  class="support-simple__file-status"
                  :class="{
                    'is-uploading': file.uploadStatus === 'uploading',
                    'is-uploaded': file.uploadStatus === 'uploaded',
                    'is-failed': file.uploadStatus === 'failed',
                  }">
                  {{ resolveUploadStatusLabel(file) }}
                </span>
              </div>

              <div
                v-if="file.uploadStatus === 'uploading'"
                class="support-simple__file-progress-track">
                <div
                  class="support-simple__file-progress-fill"
                  :style="{ width: `${Math.max(0, Math.min(100, file.uploadProgress))}%` }"></div>
              </div>
            </div>

            <div class="support-simple__file-actions">
              <button
                v-if="file.uploadStatus === 'failed'"
                type="button"
                class="support-simple__file-retry"
                :title="t('support.simple.retryUpload')"
                @click="retryFileUpload(file.id)">
                ↻
              </button>
              <button
                type="button"
                class="support-simple__file-remove"
                :aria-label="t('support.simple.removeFileAria')"
                @click="removeFile(index)">
                ×
              </button>
            </div>
          </li>
        </ul>
      </UiFormControl>
    </div>

    <div class="support-simple__actions">
      <UiButtonDefault
        state="info"
        class="support-simple__submit"
        :disabled="isSubmitting"
        @click="handleSubmit">
        <span v-if="!isSubmitting">{{ t("support.simple.submit") }}</span>
        <UiIconSpinnerDefault
          v-else
          class="h-4 w-4" />
      </UiButtonDefault>
    </div>
  </PanelDefault>
</template>

<script setup lang="ts">
  import axios, { AxiosProgressEvent } from "axios";
  import { computed, nextTick, onMounted, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useToast } from "vue-toastification";

  import PanelDefault from "~/components/block/panels/PanelDefault.vue";
  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
  import UiFormControl from "~/components/ui/UiFormControl.vue";
  import UiIconSpinnerDefault from "~/components/ui/UiIconSpinnerDefault.vue";
  import UiInput from "~/components/ui/UiInput.vue";
  import UiTextH4 from "~/components/ui/UiTextH4.vue";
  import UiTextSmall from "~/components/ui/UiTextSmall.vue";
  import useAppCore from "~/composables/useAppCore";

  type SupportAttachmentKind = "image" | "video" | "file";
  type SupportAttachmentDisplay = "media" | "file";
  type SupportAttachmentStatus = "queued" | "uploading" | "uploaded" | "failed";

  interface SupportAttachment {
    id: string;
    file: File;
    name: string;
    mimeType: string;
    size: number;
    kind: SupportAttachmentKind;
    displayAs: SupportAttachmentDisplay;
    uploadStatus: SupportAttachmentStatus;
    uploadProgress: number;
    uploadedKey: string | null;
    uploadError: string | null;
  }

  const MAX_FILES_COUNT = 10;
  const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024;
  const UPLOAD_TIMEOUT_MS = 6 * 60 * 1000;

  const props = withDefaults(
    defineProps<{
      defaultEmail?: string;
    }>(),
    {
      defaultEmail: "",
    }
  );

  const emit = defineEmits<{
    (event: "submitted"): void;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const toast = useToast();
  const appCore = useAppCore();

  const editorRef = ref<HTMLDivElement | null>(null);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const isSubmitting = ref(false);

  const replyEmail = ref("");
  const subject = ref("");
  const messageHtml = ref("");
  const selectedFiles = ref<SupportAttachment[]>([]);

  const replyEmailError = ref("");
  const subjectError = ref("");
  const messageError = ref("");

  const hasPendingUploads = computed(() =>
    selectedFiles.value.some(file => file.uploadStatus === "queued" || file.uploadStatus === "uploading")
  );
  const hasFailedUploads = computed(() => selectedFiles.value.some(file => file.uploadStatus === "failed"));
  const uploadedFiles = computed(() =>
    selectedFiles.value.filter(file => file.uploadStatus === "uploaded" && file.uploadedKey)
  );

  const openFileDialog = () => {
    if (isSubmitting.value || hasPendingUploads.value) {
      return;
    }

    fileInputRef.value?.click();
  };

  const validateReplyEmail = (): boolean => {
    const value = replyEmail.value.trim();
    if (!value) {
      replyEmailError.value = t("support.simple.validation.replyEmailRequired");
      return false;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValidEmail) {
      replyEmailError.value = t("support.simple.validation.replyEmailInvalid");
      return false;
    }

    replyEmailError.value = "";
    return true;
  };

  const validateSubject = (): boolean => {
    const value = subject.value.trim();
    if (!value) {
      subjectError.value = t("support.simple.validation.subjectRequired");
      return false;
    }

    if (value.length > 200) {
      subjectError.value = t("support.simple.validation.subjectMax");
      return false;
    }

    subjectError.value = "";
    return true;
  };

  const validateMessage = (): boolean => {
    const plain = stripHtml(messageHtml.value);
    if (!plain && selectedFiles.value.length === 0) {
      messageError.value = t("support.simple.validation.messageRequired");
      return false;
    }

    messageError.value = "";
    return true;
  };

  const handleEditorInput = () => {
    messageHtml.value = editorRef.value?.innerHTML ?? "";
    if (messageError.value) {
      validateMessage();
    }
  };

  const applyEditorCommand = (command: string) => {
    editorRef.value?.focus();
    document.execCommand(command, false);
    handleEditorInput();
  };

  const insertLink = () => {
    const link = window.prompt(t("support.simple.linkPrompt"), "https://");
    if (!link) return;
    editorRef.value?.focus();
    document.execCommand("createLink", false, link.trim());
    handleEditorInput();
  };

  const resolveAttachmentKind = (mimeType: string): SupportAttachmentKind => {
    const normalized = mimeType.trim().toLowerCase();
    if (normalized.startsWith("image/")) return "image";
    if (normalized.startsWith("video/")) return "video";
    return "file";
  };

  const createPendingAttachment = (file: File): SupportAttachment => {
    const mimeType = (file.type || "application/octet-stream").trim();
    const kind = resolveAttachmentKind(mimeType);
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      file,
      name: file.name,
      mimeType,
      size: file.size,
      kind,
      displayAs: kind === "file" ? "file" : "media",
      uploadStatus: "queued",
      uploadProgress: 0,
      uploadedKey: null,
      uploadError: null,
    };
  };

  const updateFileState = (id: string, patch: Partial<SupportAttachment>) => {
    const target = selectedFiles.value.find(file => file.id === id);
    if (!target) return;
    Object.assign(target, patch);
  };

  const resolveUploadErrorMessage = (error: unknown): string => {
    const fallback = t("support.simple.uploadFailed");
    if (!error || typeof error !== "object") {
      return fallback;
    }

    const anyError = error as any;
    const status = Number(anyError?.response?.status ?? 0);
    if (status === 413) {
      return t("support.simple.validation.fileTooLarge");
    }

    const message = String(anyError?.response?.data?.message ?? anyError?.message ?? "").trim();
    return message || fallback;
  };

  const requestSupportAttachmentPresign = async (file: SupportAttachment): Promise<{ url: string; key: string }> => {
    const response = await appCore.tickets.presignSupportAttachment({
      filename: file.name,
      content_type: file.mimeType || "application/octet-stream",
      size: file.size,
    });

    const payload = response?.data?.data ?? response?.data ?? null;
    const url = String(payload?.url ?? "").trim();
    const key = String(payload?.key ?? "").trim();
    if (!url || !key) {
      throw new Error(t("support.simple.presignFailed"));
    }

    return { url, key };
  };

  const uploadFileById = async (id: string) => {
    const target = selectedFiles.value.find(file => file.id === id);
    if (!target) return;
    if (target.uploadStatus === "uploaded" && target.uploadedKey) return;

    updateFileState(id, {
      uploadStatus: "uploading",
      uploadProgress: 0,
      uploadError: null,
      uploadedKey: null,
    });

    try {
      const presign = await requestSupportAttachmentPresign(target);
      await axios.put(presign.url, target.file, {
        headers: {
          "Content-Type": target.mimeType || "application/octet-stream",
        },
        timeout: UPLOAD_TIMEOUT_MS,
        onUploadProgress: (event: AxiosProgressEvent) => {
          const total = Number(event.total ?? target.size ?? 0);
          const loaded = Number(event.loaded ?? 0);
          const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
          updateFileState(id, {
            uploadStatus: "uploading",
            uploadProgress: Math.max(0, Math.min(100, progress)),
          });
        },
      });

      updateFileState(id, {
        uploadStatus: "uploaded",
        uploadProgress: 100,
        uploadedKey: presign.key,
        uploadError: null,
      });
    } catch (error) {
      const message = resolveUploadErrorMessage(error);
      updateFileState(id, {
        uploadStatus: "failed",
        uploadProgress: 0,
        uploadedKey: null,
        uploadError: message,
      });
      toast.error(`${target.name}: ${message}`);
    }
  };

  const uploadFilesSequentially = async (ids: string[]) => {
    for (const id of ids) {
      await uploadFileById(id);
    }
  };

  const handleSelectFiles = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files ?? []);
    if (!files.length) return;

    const signatures = new Set(selectedFiles.value.map(file => `${file.name}:${file.size}:${file.file.lastModified}`));
    const addedAttachments: SupportAttachment[] = [];

    for (const file of files) {
      if (selectedFiles.value.length + addedAttachments.length >= MAX_FILES_COUNT) {
        toast.warning(t("support.simple.validation.maxFiles", { max: MAX_FILES_COUNT }));
        break;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.warning(`${t("support.simple.validation.fileTooLarge")} ${file.name}`);
        continue;
      }

      const signature = `${file.name}:${file.size}:${file.lastModified}`;
      if (signatures.has(signature)) {
        continue;
      }

      const prepared = createPendingAttachment(file);
      addedAttachments.push(prepared);
      signatures.add(signature);
    }

    if (addedAttachments.length > 0) {
      selectedFiles.value = selectedFiles.value.concat(addedAttachments);
      void uploadFilesSequentially(addedAttachments.map(file => file.id));
    }

    target.value = "";
    if (messageError.value) {
      validateMessage();
    }
  };

  const retryFileUpload = async (id: string) => {
    if (isSubmitting.value) return;
    await uploadFileById(id);
  };

  const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1);
    if (messageError.value) {
      validateMessage();
    }
  };

  const isFormValid = (): boolean => {
    const emailValid = validateReplyEmail();
    const subjectValid = validateSubject();
    const messageValid = validateMessage();
    return emailValid && subjectValid && messageValid;
  };

  const handleSubmit = async () => {
    if (isSubmitting.value) return;
    if (hasPendingUploads.value) {
      toast.warning(t("support.simple.validation.waitUploads"));
      return;
    }
    if (hasFailedUploads.value) {
      toast.error(t("support.simple.validation.failedUploads"));
      return;
    }
    if (!isFormValid()) return;

    const uploadedAttachments = uploadedFiles.value
      .filter(file => Boolean(file.uploadedKey))
      .map(file => ({
        key: String(file.uploadedKey),
        name: file.name,
        mime_type: file.mimeType,
        size: file.size,
        kind: file.kind,
        display_as: file.displayAs,
      }));

    isSubmitting.value = true;
    try {
      await appCore.tickets.post({
        channel: "email",
        reply_email: replyEmail.value.trim(),
        subject: subject.value.trim(),
        message: messageHtml.value.trim(),
        uploaded_attachments: uploadedAttachments,
      });

      toast.success(t("support.simple.createdSuccess"));

      subject.value = "";
      messageHtml.value = "";
      selectedFiles.value = [];
      if (editorRef.value) {
        editorRef.value.innerHTML = "";
      }

      emit("submitted");
    } catch (errorResponse) {
      console.error("support simple submit failed", errorResponse);
      toast.error(t("support.simple.submitFailed"));
    } finally {
      isSubmitting.value = false;
    }
  };

  const resolveUploadStatusLabel = (file: SupportAttachment): string => {
    if (file.uploadStatus === "uploaded") return t("support.simple.uploaded");
    if (file.uploadStatus === "failed") return t("support.simple.uploadFailed");
    if (file.uploadStatus === "uploading") {
      return `${t("support.simple.uploading")} ${Math.max(0, Math.min(100, file.uploadProgress))}%`;
    }

    return t("support.simple.uploadQueued");
  };

  const stripHtml = (value: string): string =>
    value
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const shortFileName = (value: string): string => {
    const text = value.trim();
    if (text.length <= 42) return text;
    return `${text.slice(0, 20)}...${text.slice(-18)}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  onMounted(async () => {
    replyEmail.value = (props.defaultEmail || "").trim();
    await nextTick();
    if (editorRef.value) {
      editorRef.value.innerHTML = "";
    }
  });
</script>

<style scoped>
  .support-simple {
    background: var(--ui-background-panel);
  }

  .support-simple__subtitle {
    display: block;
    margin-top: 6px;
    color: var(--ui-text-secondary);
  }

  .support-simple__grid {
    display: grid;
    gap: 16px;
  }

  .support-simple__editor {
    border: 1px solid var(--color-stroke-ui-dark);
    border-radius: 12px;
    background: var(--ui-background);
    overflow: hidden;
  }

  .support-simple__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border-bottom: 1px solid var(--color-stroke-ui-dark);
    background: var(--color-stroke-ui-light);
  }

  .support-simple__tool {
    min-width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid var(--color-stroke-ui-dark);
    color: var(--ui-text-main);
    background: transparent;
    cursor: pointer;
    font-weight: 700;
  }

  .support-simple__tool--italic {
    font-style: italic;
  }

  .support-simple__tool--underline {
    text-decoration: underline;
  }

  .support-simple__tool:hover {
    background: var(--color-stroke-ui-dark);
  }

  .support-simple__editor-input {
    min-height: 180px;
    padding: 12px;
    color: var(--ui-text-main);
    outline: none;
    white-space: pre-wrap;
  }

  .support-simple__editor-input:empty::before {
    content: attr(data-placeholder);
    color: var(--ui-text-secondary);
    pointer-events: none;
  }

  .support-simple__attachments {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .support-simple__hint {
    color: var(--ui-text-secondary);
  }

  .support-simple__files {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .support-simple__file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid var(--color-stroke-ui-dark);
    border-radius: 10px;
    padding: 8px 10px;
    background: var(--ui-background);
  }

  .support-simple__file-content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .support-simple__file-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .support-simple__file-status {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--ui-text-secondary);
  }

  .support-simple__file-status.is-uploading {
    color: var(--ui-primary-main);
  }

  .support-simple__file-status.is-uploaded {
    color: var(--ui-sticker-success);
  }

  .support-simple__file-status.is-failed {
    color: var(--ui-sticker-danger);
  }

  .support-simple__file-progress-track {
    width: 100%;
    height: 4px;
    border-radius: 999px;
    background: var(--color-stroke-ui-dark);
    overflow: hidden;
  }

  .support-simple__file-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--ui-primary-main);
    transition: width 0.2s linear;
  }

  .support-simple__file-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .support-simple__file-retry {
    border: 0;
    background: transparent;
    color: var(--ui-primary-main);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
  }

  .support-simple__file-remove {
    border: 0;
    background: transparent;
    color: var(--ui-text-secondary);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }

  .support-simple__actions {
    margin-top: 18px;
    display: flex;
    justify-content: flex-end;
  }

  .support-simple__submit {
    min-width: 220px;
  }

  @media (max-width: 767px) {
    .support-simple {
      padding: 16px;
    }

    .support-simple__editor-input {
      min-height: 140px;
    }

    .support-simple__actions {
      justify-content: stretch;
    }

    .support-simple__submit {
      width: 100%;
      min-width: 0;
    }
  }
</style>
