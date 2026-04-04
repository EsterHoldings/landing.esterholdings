<template>
  <div class="accounts__edit">
    <div
      v-if="modalTitle"
      class="accounts__edit__top">
      <UiTextH4>{{ modalTitle }}</UiTextH4>
    </div>

    <div
      class="accounts__edit__content"
      :class="{ 'without-top': !modalTitle }">
      <div class="accounts__edit__content__fields">
        <UiFormControl
          :label="t('cabinet.payments.details.createNew.name')"
          :errors="validatorPaymentDetailForm?.errorsFormData?.name?.errors">
          <UiInput
            :placeholder="t('cabinet.payments.details.createNew.namePlaceholder')"
            :value="formData.name"
            :isDirty="validatorPaymentDetailForm?.errorsFormData?.name?.isDirty"
            :isInvalid="validatorPaymentDetailForm?.errorsFormData?.name?.errors?.length > 0"
            @blur="validatorPaymentDetailForm?.doValidateField('name', $event.target.value)"
            @input="validatorPaymentDetailForm?.doValidateField('name', $event)" />
        </UiFormControl>

        <UiFormControl
          :label="paymentMethodLabel"
          :errors="validatorPaymentDetailForm?.errorsFormData?.paymentSystemId?.errors">
          <UiSelect
            :without-no-select="true"
            :data="paymentTypes"
            :value="formData.paymentSystemId"
            :isDirty="validatorPaymentDetailForm?.errorsFormData?.paymentSystemId?.isDirty"
            :isInvalid="validatorPaymentDetailForm?.errorsFormData?.paymentSystemId?.errors?.length > 0"
            @change="handleChangeSelectPaymentType"
            @blur="validatorPaymentDetailForm?.doValidateField('paymentSystemId', $event)" />
        </UiFormControl>

        <div v-if="selectedPaymentFields.length > 0">
          <UiFormControl
            v-for="field in selectedPaymentFields"
            :key="field.key"
            :label="field.label"
            :errors="fieldErrors[field.key] ? [fieldErrors[field.key]] : []">
            <UiInput
              :placeholder="field.placeholder"
              :value="formData.data[field.key] || ''"
              @input="handleInputPaymentField(field.key, $event)" />
          </UiFormControl>
        </div>
        <div
          v-else
          class="accounts__edit__description">
          {{ paymentMethodSelectionHint }}
        </div>

        <UiFormControl
          :label="documentsLabel"
          :errors="documentsError ? [documentsError] : []">
          <div class="payment-documents">
            <Transition name="payment-documents-fade">
              <div
                v-if="isDocumentsEnabled"
                class="payment-documents__warning">
                <div class="payment-documents__warning-title">
                  {{ documentsWarningTitle }}
                </div>
                <div class="payment-documents__warning-text">
                  {{ documentsWarningText }}
                </div>
              </div>
            </Transition>

            <div
              class="payment-documents__dropzone"
              :class="{ 'is-disabled': !isDocumentsEnabled }">
              <UiDragAndDrop
                class="payment-documents__drag"
                :title-text="documentsDropTitle"
                :separator-text="documentsDropSeparator"
                :action-text="documentsDropAction"
                :hint-text="documentsDropHint"
                :disabled-hint-text="documentsDisabledHint"
                :disabled="!isDocumentsEnabled"
                @files="handleFilesSelected" />
            </div>

            <div class="payment-documents__hint">
              {{ documentsHintText }}
            </div>

            <div
              v-if="selectedFiles.length > 0"
              class="payment-documents__summary">
              <span v-if="existingSelectedFiles.length > 0">
                {{
                  interpolateText("cabinet.payments.details.createNew.documents.summaryExisting", "Attached: {count}", {
                    count: existingSelectedFiles.length,
                  })
                }}
              </span>
              <span v-if="newSelectedFiles.length > 0">
                {{
                  interpolateText("cabinet.payments.details.createNew.documents.summaryNew", "New files: {count}", {
                    count: newSelectedFiles.length,
                  })
                }}
              </span>
            </div>

            <div
              v-if="selectedFiles.length > 0"
              class="payment-documents__list">
              <div
                v-for="(selectedFile, index) in selectedFiles"
                :key="selectedFile.uniqueKey"
                class="payment-documents__item">
                <div class="payment-documents__preview">
                  <UiImage
                    v-if="
                      resolveSelectedFilePreviewMeta(selectedFile).type === 'image' &&
                      resolveSelectedFilePreviewMeta(selectedFile).src
                    "
                    :src="resolveSelectedFilePreviewMeta(selectedFile).src"
                    fitContain
                    fitPosition="center" />
                  <div
                    v-else
                    class="payment-documents__preview-file">
                    {{ resolveSelectedFilePreviewMeta(selectedFile).label }}
                  </div>
                </div>

                <div class="payment-documents__meta">
                  <div class="payment-documents__meta-top">
                    <div class="payment-documents__name">{{ selectedFile.displayName }}</div>
                    <span
                      class="payment-documents__origin"
                      :class="`is-${selectedFile.source}`">
                      {{ selectedFile.source === "existing" ? documentsOriginExisting : documentsOriginNew }}
                    </span>
                  </div>
                  <div class="payment-documents__size">{{ formatFileSize(selectedFile.size) }}</div>
                  <div
                    class="payment-documents__status"
                    :class="`is-${selectedFile.uploadStatus}`">
                    <UiIconSpinnerDefault
                      v-if="selectedFile.uploadStatus === 'uploading'"
                      class="payment-documents__status-spinner" />
                    <span>{{ resolveUploadStatusLabel(selectedFile) }}</span>
                  </div>
                  <div class="payment-documents__status-caption">
                    {{ resolveUploadStatusCaption(selectedFile) }}
                  </div>
                  <div
                    v-if="selectedFile.source === 'new'"
                    class="payment-documents__progress">
                    <div class="payment-documents__progress-track">
                      <div
                        class="payment-documents__progress-fill"
                        :style="{ width: `${Math.max(0, Math.min(100, selectedFile.uploadProgress))}%` }"></div>
                    </div>
                    <div class="payment-documents__progress-value">
                      {{ Math.max(0, Math.min(100, selectedFile.uploadProgress)) }}%
                    </div>
                  </div>
                  <div
                    v-if="selectedFile.uploadError"
                    class="payment-documents__error">
                    {{ selectedFile.uploadError }}
                  </div>
                </div>

                <button
                  type="button"
                  class="payment-documents__remove"
                  :aria-label="selectedFile.source === 'existing' ? removeExistingFileLabel : removeNewFileLabel"
                  :disabled="selectedFile.uploadStatus === 'uploading'"
                  @click="removeSelectedFile(index)">
                  <UiIconTrash class="payment-documents__remove-icon" />
                </button>
              </div>
            </div>
          </div>
        </UiFormControl>

        <div class="accounts__edit__actions">
          <UiButtonDefault
            class="accounts__edit__save-btn"
            state="info"
            :disabled="isLoading"
            @click="handleSubmitForm">
            <span v-if="!isLoading">{{ submitButtonLabel }}</span>
            <UiIconSpinnerDefault v-if="isLoading" />
          </UiButtonDefault>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import axios from "axios";
  import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, type PropType } from "vue";
  import { useI18n } from "vue-i18n";
  import { useToast } from "vue-toastification";

  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
  import UiDragAndDrop from "~/components/ui/UiDragAndDrop.vue";
  import UiFormControl from "~/components/ui/UiFormControl.vue";
  import UiIconSpinnerDefault from "~/components/ui/UiIconSpinnerDefault.vue";
  import UiIconTrash from "~/components/ui/UiIconTrash.vue";
  import UiImage from "~/components/ui/UiImage.vue";
  import UiInput from "~/components/ui/UiInput.vue";
  import UiSelect from "~/components/ui/UiSelect.vue";
  import UiTextH4 from "~/components/ui/UiTextH4.vue";

  import useApi from "~/composables/useApi";
  import useAppCore from "~/composables/useAppCore";
  import useEventBus from "~/composables/useEventBus";
  import { extractApiErrorMessage, resolveApiMessage } from "~/composables/useApiMessages";
  import { formData } from "~/pages/payments/details/composables";
  import {
    resetValidationUPaymentDetailForm,
    validatePaymentDetailForm,
    validatorPaymentDetailForm,
  } from "~/pages/payments/details/composables/validation";

  type PaymentTypeOption = {
    id: string;
    value: string;
    text: string;
  };

  type PaymentSystemField = {
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    defaultValue: string;
  };

  type PaymentSystem = {
    id: string;
    name: string;
    fields: PaymentSystemField[];
  };

  type SelectedUploadFile = {
    source: "new" | "existing";
    uniqueKey: string;
    file: File | null;
    previewUrl: string;
    uploadStatus: "idle" | "uploading" | "uploaded" | "failed";
    uploadProgress: number;
    uploadError: string | null;
    uploadedDocument: Record<string, any> | null;
    displayName: string;
    size: number;
    mimeType: string;
  };

  const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_DOCUMENT_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];

  const isLoading = ref(false);
  const documentsError = ref("");
  const selectedFiles = ref<SelectedUploadFile[]>([]);
  const fieldErrors = reactive<Record<string, string>>({});

  const { t } = useI18n({ useScope: "global" });
  const props = defineProps({
    title: {
      type: String,
      default: "",
    },
    mode: {
      type: String as PropType<"create" | "edit">,
      default: "create",
    },
    paymentDetail: {
      type: Object as PropType<Record<string, any> | null>,
      default: null,
    },
  });

  const app = useAppCore();
  const toast = useToast();
  const apiClient = new useApi(true);
  const { closeModal } = inject("modalControl") as { closeModal: Function };

  const paymentTypes = reactive<PaymentTypeOption[]>([]);
  const paymentSystems = reactive<PaymentSystem[]>([]);
  const selectedPaymentSystem = ref<PaymentSystem | null>(null);

  const resolveText = (key: string, fallback: string): string => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const interpolateText = (key: string, fallback: string, values: Record<string, string | number>): string => {
    const base = resolveText(key, fallback);

    return Object.entries(values).reduce((result, [token, value]) => {
      return result.split(`{${token}}`).join(String(value));
    }, base);
  };

  const fallbackPaymentField: PaymentSystemField = {
    key: "recipientAddress",
    label: resolveText("cabinet.payments.details.createNew.recipientAddressLabel", "Recipient address"),
    placeholder: resolveText("cabinet.payments.details.createNew.recipientAddressPlaceholder", "Enter payout details"),
    required: true,
    defaultValue: "",
  };

  const selectedPaymentFields = computed(() => {
    const current = selectedPaymentSystem.value;
    if (!current) {
      return [];
    }

    return current.fields.length > 0 ? current.fields : [fallbackPaymentField];
  });

  const isDocumentsEnabled = computed(() => Boolean(String(formData.paymentSystemId ?? "").trim()));
  const modalTitle = computed(
    () =>
      props.title ||
      (props.mode === "edit"
        ? resolveText("cabinet.payments.details.createNew.editTitle", "Edit payment detail")
        : resolveText("cabinet.payments.details.createNew.title", "Create new payment detail"))
  );
  const paymentMethodLabel = computed(() =>
    resolveText("cabinet.payments.details.createNew.paymentMethod", "Payment method")
  );
  const submitButtonLabel = computed(() =>
    props.mode === "edit"
      ? resolveText("cabinet.payments.details.createNew.submitUpdate", "Save changes")
      : resolveText("cabinet.payments.details.createNew.submitCreate", "Save payment detail")
  );
  const paymentMethodSelectionHint = computed(() =>
    resolveText(
      "cabinet.payments.details.createNew.selectMethodHint",
      "Choose a payment method first, then fill in the payout details."
    )
  );
  const documentsLabel = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.label", "Payment proof screenshots")
  );
  const documentsWarningTitle = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.warningTitle", "What we need in the screenshots")
  );
  const documentsWarningText = computed(() =>
    resolveText(
      "cabinet.payments.details.createNew.documents.warningText",
      "Upload screenshots from your payment account where we can clearly see the email address, the wallet or account number, and the QR code."
    )
  );
  const documentsDropTitle = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.dropTitle", "Drag and drop")
  );
  const documentsDropAction = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.dropAction", "click to upload")
  );
  const documentsDropSeparator = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.dropSeparator", "or")
  );
  const documentsDropHint = computed(() =>
    resolveText(
      "cabinet.payments.details.createNew.documents.dropHint",
      "PNG, JPG, WEBP or PDF. Maximum file size is 5 MB."
    )
  );
  const documentsDisabledHint = computed(() =>
    resolveText(
      "cabinet.payments.details.createNew.documents.disabledHint",
      "Choose a payment method to unlock document upload."
    )
  );
  const documentsHintText = computed(() =>
    isDocumentsEnabled.value
      ? resolveText(
          "cabinet.payments.details.createNew.documents.hint",
          "You can keep attached documents and add new ones. New files will be uploaded to S3 when you save the form."
        )
      : resolveText(
          "cabinet.payments.details.createNew.documents.initialHint",
          "Document upload will become available after you choose a payment method."
        )
  );
  const documentsOriginExisting = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.originExisting", "Attached")
  );
  const documentsOriginNew = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.originNew", "New file")
  );
  const removeExistingFileLabel = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.removeExisting", "Remove attached file")
  );
  const removeNewFileLabel = computed(() =>
    resolveText("cabinet.payments.details.createNew.documents.removeNew", "Remove new file")
  );

  const existingSelectedFiles = computed(() => selectedFiles.value.filter(file => file.source === "existing"));
  const newSelectedFiles = computed(() => selectedFiles.value.filter(file => file.source === "new"));

  const humanizeFieldKey = (key: string): string => {
    const formatted = key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim();

    return formatted
      ? formatted.charAt(0).toUpperCase() + formatted.slice(1)
      : resolveText("cabinet.payments.details.createNew.fieldFallback", "Field");
  };

  const normalizePaymentSystemFields = (rawPdfc: unknown): PaymentSystemField[] => {
    if (!rawPdfc) {
      return [];
    }

    if (Array.isArray(rawPdfc)) {
      return rawPdfc
        .map((item, index) => {
          if (typeof item !== "object" || item === null) {
            return null;
          }

          const value = item as Record<string, any>;
          const key = String(value.key ?? value.id ?? `field_${index + 1}`);
          const label = String(value.label ?? humanizeFieldKey(key));
          const placeholder = String(
            value.placeholder ?? resolveText("cabinet.payments.details.createNew.fieldPlaceholder", "Enter value")
          );
          const defaultValue = String(value.value ?? "");
          const required = value.required !== false;

          return { key, label, placeholder, defaultValue, required };
        })
        .filter((field): field is PaymentSystemField => Boolean(field));
    }

    if (typeof rawPdfc === "object") {
      return Object.entries(rawPdfc as Record<string, any>)
        .map(([key, item]) => {
          const value = typeof item === "object" && item !== null ? item : {};
          const label = String(value.label ?? humanizeFieldKey(key));
          const placeholder = String(
            value.placeholder ?? resolveText("cabinet.payments.details.createNew.fieldPlaceholder", "Enter value")
          );
          const defaultValue = String(value.value ?? "");
          const required = value.required !== false;

          return {
            key,
            label,
            placeholder,
            defaultValue,
            required,
          };
        })
        .filter(field => field.key.length > 0);
    }

    return [];
  };

  const clearFieldErrors = () => {
    Object.keys(fieldErrors).forEach(key => {
      delete fieldErrors[key];
    });
  };

  const initializePaymentFields = (initialValues: Record<string, string> = {}) => {
    const nextData: Record<string, string> = {};

    selectedPaymentFields.value.forEach(field => {
      nextData[field.key] = String(initialValues[field.key] ?? field.defaultValue ?? "");
    });

    Object.entries(initialValues).forEach(([key, value]) => {
      if (!(key in nextData)) {
        nextData[key] = String(value ?? "");
      }
    });

    formData.data = nextData;
    clearFieldErrors();
  };

  const handleInputPaymentField = (key: string, value: string) => {
    formData.data[key] = value;
    if (fieldErrors[key]) {
      delete fieldErrors[key];
    }
  };

  const handleChangeSelectPaymentType = (val: string) => {
    validatorPaymentDetailForm.doValidateField("paymentSystemId", val);
    formData.paymentSystemId = val;
    selectedPaymentSystem.value = paymentSystems.find(x => x.id === String(val)) ?? null;
    documentsError.value = "";
    initializePaymentFields();
  };

  const getPaymentTypes = async () => {
    const response = await app.paymentSystems.get();
    paymentTypes.splice(
      0,
      paymentTypes.length,
      ...response.data.map(({ id, name }) => ({
        id: String(id),
        value: String(id),
        text: String(name),
      }))
    );

    paymentSystems.splice(
      0,
      paymentSystems.length,
      ...response.data.map(({ id, name, pdfc }) => ({
        id: String(id),
        name: String(name),
        fields: normalizePaymentSystemFields(pdfc),
      }))
    );
  };

  const textExtensions = ["txt", "text", "md", "csv", "json", "xml", "log"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"];

  const extractFileExtension = (value: string): string => {
    const normalized = String(value || "")
      .split("?")[0]
      .split("#")[0]
      .trim()
      .toLowerCase();
    const segments = normalized.split(".");

    return segments.length > 1 ? segments.pop() || "" : "";
  };

  const resolvePreviewMeta = (
    mimeType: string,
    previewUrl: string,
    path: string,
    name: string
  ): { type: "image" | "pdf" | "text" | "file"; src: string; label: string } => {
    const normalizedMimeType = String(mimeType || "")
      .trim()
      .toLowerCase();
    let type: "image" | "pdf" | "text" | "file" = "file";

    if (normalizedMimeType.startsWith("image/")) {
      type = "image";
    } else if (normalizedMimeType.includes("pdf")) {
      type = "pdf";
    } else if (
      normalizedMimeType.startsWith("text/") ||
      normalizedMimeType.includes("json") ||
      normalizedMimeType.includes("xml")
    ) {
      type = "text";
    } else {
      const extension = extractFileExtension(previewUrl || path || name);
      if (imageExtensions.includes(extension)) {
        type = "image";
      } else if (extension === "pdf") {
        type = "pdf";
      } else if (textExtensions.includes(extension)) {
        type = "text";
      }
    }

    return {
      type,
      src: type === "image" ? previewUrl || path : "",
      label: type === "pdf" ? "PDF" : type === "text" ? "TXT" : type === "file" ? "FILE" : "IMG",
    };
  };

  const resolveSelectedFilePreviewMeta = (selectedFile: SelectedUploadFile) =>
    resolvePreviewMeta(
      selectedFile.mimeType,
      selectedFile.previewUrl,
      String(selectedFile.uploadedDocument?.path ?? ""),
      selectedFile.displayName
    );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const cleanupSelectedFiles = () => {
    selectedFiles.value.forEach(item => {
      if (item.source === "new" && item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });

    selectedFiles.value = [];
  };

  const normalizeExistingDocument = (item: any): Record<string, any> | null => {
    if (!item || typeof item !== "object") {
      return null;
    }

    const path = String(item.path ?? "").trim();
    if (!path) {
      return null;
    }

    return {
      name: String(
        item.name ?? resolveText("cabinet.payments.details.createNew.documents.documentFallback", "Document")
      ),
      path,
      mime_type: String(item.mime_type ?? item.mimeType ?? ""),
      size: Number(item.size ?? 0),
      uploaded_at: item.uploaded_at ?? item.uploadedAt ?? null,
      preview_url: String(item.preview_url ?? item.previewUrl ?? path),
    };
  };

  const hydrateSelectedFiles = (documents: any[] = []) => {
    cleanupSelectedFiles();

    selectedFiles.value = documents
      .map(normalizeExistingDocument)
      .filter((item): item is Record<string, any> => Boolean(item))
      .map((document, index) => ({
        source: "existing" as const,
        uniqueKey: `existing:${document.path}:${index}`,
        file: null,
        previewUrl: String(document.preview_url ?? document.path ?? ""),
        uploadStatus: "uploaded" as const,
        uploadProgress: 100,
        uploadError: null,
        uploadedDocument: {
          name: document.name,
          path: document.path,
          mime_type: document.mime_type,
          size: document.size,
          uploaded_at: document.uploaded_at,
        },
        displayName: String(
          document.name ?? resolveText("cabinet.payments.details.createNew.documents.documentFallback", "Document")
        ),
        size: Number(document.size ?? 0),
        mimeType: String(document.mime_type ?? ""),
      }));
  };

  const extractEditablePaymentData = (rawData: unknown): Record<string, string> => {
    if (!rawData || typeof rawData !== "object") {
      return {};
    }

    const paymentData = rawData as Record<string, any>;
    const scopedFields = paymentData.fields;
    const source =
      scopedFields && typeof scopedFields === "object" && !Array.isArray(scopedFields)
        ? (scopedFields as Record<string, any>)
        : paymentData;

    return Object.entries(source).reduce<Record<string, string>>((carry, [key, value]) => {
      if (key === "legacy" || key === "fields") {
        return carry;
      }

      if (value === null || value === undefined) {
        carry[key] = "";
        return carry;
      }

      if (typeof value === "object") {
        return carry;
      }

      carry[key] = String(value);
      return carry;
    }, {});
  };

  const applyEditPayload = () => {
    if (!props.paymentDetail) {
      return;
    }

    formData.name = String(props.paymentDetail.name ?? "");
    formData.paymentSystemId = String(
      props.paymentDetail.payment_system_id ??
        props.paymentDetail.paymentSystemId ??
        props.paymentDetail.payment_system?.id ??
        ""
    );
    selectedPaymentSystem.value = paymentSystems.find(system => system.id === formData.paymentSystemId) ?? null;
    initializePaymentFields(extractEditablePaymentData(props.paymentDetail.data));
    hydrateSelectedFiles(Array.isArray(props.paymentDetail.documents) ? props.paymentDetail.documents : []);
  };

  const handleFilesSelected = (files: File[] = []) => {
    if (!isDocumentsEnabled.value || !Array.isArray(files) || files.length === 0) {
      return;
    }

    const uploadableFiles = files.filter(file => {
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        toast.error(
          interpolateText(
            "cabinet.payments.details.createNew.documents.invalidFormat",
            "File {name} has an unsupported format.",
            { name: file.name }
          )
        );
        return false;
      }

      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        toast.error(
          interpolateText("cabinet.payments.details.createNew.documents.tooLarge", "File {name} exceeds 5 MB.", {
            name: file.name,
          })
        );
        return false;
      }

      return true;
    });

    const buildFileSignature = (file: File): string => `${file.name}:${file.size}:${file.lastModified}`;
    const alreadyAdded = new Set(
      selectedFiles.value.filter(item => item.file instanceof File).map(item => buildFileSignature(item.file as File))
    );

    uploadableFiles.forEach(file => {
      const uniq = buildFileSignature(file);
      if (alreadyAdded.has(uniq)) {
        return;
      }

      selectedFiles.value.push({
        source: "new",
        uniqueKey: `new:${uniq}`,
        file,
        previewUrl: URL.createObjectURL(file),
        uploadStatus: "idle",
        uploadProgress: 0,
        uploadError: null,
        uploadedDocument: null,
        displayName: file.name,
        size: file.size,
        mimeType: file.type,
      });
      alreadyAdded.add(uniq);
    });

    if (selectedFiles.value.length > 0) {
      documentsError.value = "";
    }
  };

  const removeSelectedFile = (index: number) => {
    const file = selectedFiles.value[index];
    if (!file) {
      return;
    }

    if (file.source === "new" && file.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(file.previewUrl);
    }
    selectedFiles.value.splice(index, 1);
  };

  const resolveUploadErrorMessage = (error: unknown): string => {
    const anyError = error as any;
    const status = Number(anyError?.response?.status ?? 0);
    if (status === 413) {
      return resolveText("cabinet.payments.details.createNew.documents.serverTooLarge", "File is too large.");
    }

    return (
      extractApiErrorMessage(
        error,
        resolveText("cabinet.payments.details.createNew.documents.uploadFailed", "Failed to upload the file to S3.")
      ) ?? resolveText("cabinet.payments.details.createNew.documents.uploadFailed", "Failed to upload the file to S3.")
    );
  };

  const resolveUploadStatusLabel = (selectedFile: SelectedUploadFile): string => {
    if (selectedFile.source === "existing") {
      return resolveText("cabinet.payments.details.createNew.documents.statusExisting", "Saved");
    }

    if (selectedFile.uploadStatus === "uploading") {
      return resolveText("cabinet.payments.details.createNew.documents.statusUploading", "Uploading...");
    }

    if (selectedFile.uploadStatus === "uploaded") {
      return resolveText("cabinet.payments.details.createNew.documents.statusUploaded", "Uploaded");
    }

    if (selectedFile.uploadStatus === "failed") {
      return resolveText("cabinet.payments.details.createNew.documents.statusFailed", "Upload error");
    }

    return resolveText("cabinet.payments.details.createNew.documents.statusIdle", "Ready to upload");
  };

  const resolveUploadStatusCaption = (selectedFile: SelectedUploadFile): string => {
    if (selectedFile.source === "existing") {
      return resolveText(
        "cabinet.payments.details.createNew.documents.captionExisting",
        "This document is already saved and will remain attached until you remove it."
      );
    }

    if (selectedFile.uploadStatus === "uploading") {
      return resolveText(
        "cabinet.payments.details.createNew.documents.captionUploading",
        "The file is being uploaded to Amazon S3 right now."
      );
    }

    if (selectedFile.uploadStatus === "uploaded") {
      return resolveText(
        "cabinet.payments.details.createNew.documents.captionUploaded",
        "The file has been uploaded and will be saved together with this payment detail."
      );
    }

    if (selectedFile.uploadStatus === "failed") {
      return resolveText(
        "cabinet.payments.details.createNew.documents.captionFailed",
        "Upload was not completed. Fix the error or remove the file."
      );
    }

    return resolveText(
      "cabinet.payments.details.createNew.documents.captionIdle",
      "The file has been selected and will be uploaded after you save the form."
    );
  };

  const uploadSingleDocument = async (selectedFile: SelectedUploadFile): Promise<Record<string, any>> => {
    if (selectedFile.uploadedDocument) {
      selectedFile.uploadStatus = "uploaded";
      selectedFile.uploadProgress = 100;
      return selectedFile.uploadedDocument;
    }

    if (!selectedFile.file) {
      throw new Error(
        resolveText("cabinet.payments.details.createNew.documents.fileMissing", "Unable to access the file for upload.")
      );
    }

    selectedFile.uploadStatus = "uploading";
    selectedFile.uploadProgress = 0;
    selectedFile.uploadError = null;

    try {
      const presignResponse = await apiClient.post("client/s3/presign", {
        filename: selectedFile.file.name,
        contentType: selectedFile.file.type,
        path: "payment-details",
      });

      const payload = presignResponse?.data?.data ?? presignResponse?.data ?? null;
      const url = String(payload?.url ?? "").trim();
      const key = String(payload?.key ?? "").trim();

      if (!url || !key) {
        throw new Error(
          resolveText("cabinet.payments.details.createNew.documents.presignFailed", "Failed to get an upload link.")
        );
      }

      await axios.put(url, selectedFile.file, {
        headers: { "Content-Type": selectedFile.file.type },
        onUploadProgress(event) {
          const total = Number(event.total ?? selectedFile.file?.size ?? 0);
          const loaded = Number(event.loaded ?? 0);
          selectedFile.uploadProgress = total > 0 ? Math.round((loaded / total) * 100) : 0;
        },
      });

      selectedFile.uploadedDocument = {
        name: selectedFile.file.name,
        path: key,
        mime_type: selectedFile.file.type,
        size: selectedFile.file.size,
        uploaded_at: new Date().toISOString(),
      };
      selectedFile.uploadStatus = "uploaded";
      selectedFile.uploadProgress = 100;

      return selectedFile.uploadedDocument;
    } catch (error) {
      selectedFile.uploadStatus = "failed";
      selectedFile.uploadProgress = 0;
      selectedFile.uploadError = resolveUploadErrorMessage(error);
      throw error;
    }
  };

  const validatePaymentFields = (): boolean => {
    clearFieldErrors();

    let isValid = true;

    selectedPaymentFields.value.forEach(field => {
      const value = String(formData.data[field.key] || "").trim();
      if (field.required && !value) {
        fieldErrors[field.key] = resolveText(
          "cabinet.payments.details.createNew.validationRequired",
          "This field is required."
        );
        isValid = false;
      }
    });

    return isValid;
  };

  const uploadPaymentDetailDocuments = async () => {
    const uploadedDocuments: Array<Record<string, any>> = [];
    let failedUploads = 0;

    for (const selectedFile of selectedFiles.value) {
      try {
        const uploadedDocument = await uploadSingleDocument(selectedFile);
        uploadedDocuments.push(uploadedDocument);
      } catch {
        failedUploads++;
      }
    }

    if (failedUploads > 0) {
      throw new Error(
        interpolateText(
          "cabinet.payments.details.createNew.documents.uploadBatchFailed",
          "Failed to upload {count} file(s).",
          { count: failedUploads }
        )
      );
    }

    return uploadedDocuments;
  };

  const handleSubmitForm = async () => {
    validatePaymentDetailForm(async () => {
      const isPaymentFieldsValid = validatePaymentFields();
      if (!isPaymentFieldsValid) {
        return;
      }

      if (selectedFiles.value.length === 0) {
        documentsError.value = resolveText(
          "cabinet.payments.details.createNew.documents.required",
          "Add at least one payment account screenshot for verification."
        );
        return;
      }

      try {
        isLoading.value = true;
        documentsError.value = "";

        const uploadedDocuments = await uploadPaymentDetailDocuments();

        const payload = {
          paymentSystemId: formData.paymentSystemId,
          name: formData.name,
          data: formData.data,
          documents: uploadedDocuments,
        };

        const response =
          props.mode === "edit" && props.paymentDetail?.id
            ? await app.paymentDetails.put(props.paymentDetail.id, payload)
            : await app.paymentDetails.post(payload);

        const fallbackSuccess =
          props.mode === "edit"
            ? resolveText(
                "cabinet.payments.details.createNew.updatedSuccess",
                "Payment details were updated and sent for verification again."
              )
            : resolveText("cabinet.payments.details.createNew.createdSuccess", "Payment details created successfully.");

        toast.success(resolveApiMessage(response?.data?.message, fallbackSuccess) ?? fallbackSuccess);
        closeModal();
        useEventBus.emit("loadDataForPaymentDetails");
      } catch (errorResponse: any) {
        const fallbackError = resolveText(
          "cabinet.payments.details.createNew.saveError",
          "Failed to save payment details."
        );
        const errorMessage = extractApiErrorMessage(errorResponse, fallbackError) ?? fallbackError;
        documentsError.value = errorMessage;
        toast.error(errorMessage);
      } finally {
        isLoading.value = false;
      }
    });
  };

  onMounted(async () => {
    resetValidationUPaymentDetailForm();
    cleanupSelectedFiles();
    selectedPaymentSystem.value = null;
    documentsError.value = "";
    clearFieldErrors();

    await getPaymentTypes();
    if (props.mode === "edit") {
      applyEditPayload();
    }
  });

  onBeforeUnmount(() => {
    cleanupSelectedFiles();
  });
</script>

<style lang="scss" scoped>
  .accounts__edit {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;

    &__top {
      min-height: 0;
      padding: 0 72px 14px 24px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid var(--color-stroke-ui-dark);
    }

    &__content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      &.without-top {
        border-top: none;
      }

      &__fields {
        padding: 28px 24px 32px;

        .ui-form-control {
          margin-bottom: 20px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    &__description {
      margin-bottom: 16px;
      color: var(--ui-text-secondary);
      font-size: 13px;
      line-height: 1.45;
    }

    &__actions {
      margin-top: 12px;
      padding-bottom: max(8px, calc(env(safe-area-inset-bottom, 0px) + 6px));
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    &__save-btn {
      min-height: 40px;
    }
  }

  .payment-documents {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .payment-documents__warning {
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--ui-primary-main) 22%, transparent);
    background: color-mix(in srgb, var(--ui-primary-main) 10%, var(--ui-background-panel));
    padding: 14px 16px;
  }

  .payment-documents__warning-title {
    color: var(--ui-text-main);
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .payment-documents__warning-text {
    color: var(--ui-text-secondary);
    font-size: 12px;
    line-height: 1.5;
  }

  .payment-documents__dropzone {
    position: relative;
    min-height: 120px;
    border-radius: 14px;
    transition:
      opacity 0.25s ease,
      filter 0.25s ease,
      transform 0.25s ease;
  }

  .payment-documents__dropzone.is-disabled {
    opacity: 0.72;
    filter: saturate(0.85);
  }

  .payment-documents__drag {
    position: absolute;
    inset: 0;
  }

  .payment-documents__hint {
    color: var(--ui-text-secondary);
    font-size: 12px;
    line-height: 1.45;
  }

  .payment-documents__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    color: var(--ui-text-secondary);
    font-size: 12px;
    font-weight: 500;
  }

  .payment-documents__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .payment-documents__item {
    min-height: 62px;
    display: grid;
    grid-template-columns: 62px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 10px;
    border: 1px solid var(--color-stroke-ui-light);
    background: var(--ui-background-panel);
  }

  .payment-documents__preview {
    width: 62px;
    height: 62px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-stroke-ui-light);
    background: var(--ui-background);
  }

  .payment-documents__preview-file {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-text-main);
    font-size: 12px;
    font-weight: 700;
  }

  .payment-documents__meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .payment-documents__meta-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .payment-documents__name {
    color: var(--ui-text-main);
    font-size: 13px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-documents__origin {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    border: 1px solid var(--color-stroke-ui-light);
  }

  .payment-documents__origin.is-existing {
    color: var(--color-success);
    background: color-mix(in srgb, var(--color-success) 10%, transparent);
  }

  .payment-documents__origin.is-new {
    color: var(--ui-primary-main);
    background: color-mix(in srgb, var(--ui-primary-main) 12%, transparent);
  }

  .payment-documents__size {
    color: var(--ui-text-secondary);
    font-size: 12px;
  }

  .payment-documents__status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--ui-text-secondary);
  }

  .payment-documents__status.is-uploading {
    color: var(--ui-primary-main);
  }

  .payment-documents__status.is-uploaded {
    color: var(--color-success);
  }

  .payment-documents__status.is-failed {
    color: var(--color-danger);
  }

  .payment-documents__status-caption {
    color: var(--ui-text-secondary);
    font-size: 11px;
    line-height: 1.35;
  }

  .payment-documents__status-spinner {
    width: 14px;
    height: 14px;
  }

  .payment-documents__progress {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
  }

  .payment-documents__progress-track {
    height: 6px;
    border-radius: 999px;
    overflow: hidden;
    background: color-mix(in srgb, var(--ui-primary-main) 12%, transparent);
  }

  .payment-documents__progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--ui-primary-main), color-mix(in srgb, var(--ui-primary-main) 70%, white));
    transition: width 0.2s ease;
  }

  .payment-documents__progress-value {
    color: var(--ui-text-secondary);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .payment-documents__error {
    color: var(--color-danger);
    font-size: 12px;
    line-height: 1.35;
  }

  .payment-documents__remove {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid var(--color-stroke-ui-light);
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-sticker-danger);
    transition: background-color 0.2s ease;
  }

  .payment-documents__remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .payment-documents__remove:hover {
    background: color-mix(in srgb, var(--ui-sticker-danger) 14%, transparent);
  }

  .payment-documents__remove-icon {
    width: 14px;
    height: 14px;
  }

  .payment-documents-fade-enter-active,
  .payment-documents-fade-leave-active {
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  }

  .payment-documents-fade-enter-from,
  .payment-documents-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  @media (max-width: 768px) {
    .accounts__edit {
      &__top {
        padding: 0 64px 12px 20px;
      }

      &__content {
        &__fields {
          padding: 20px;
        }
      }

      &__actions {
        margin-top: 12px;
      }

      &__save-btn {
        width: 100%;
      }
    }

    .payment-documents__item {
      grid-template-columns: 54px 1fr auto;
      min-height: 54px;
    }

    .payment-documents__preview {
      width: 54px;
      height: 54px;
    }
  }
</style>
