<template>
  <div class="accounts__edit">
    <div
      v-if="props.title"
      class="accounts__edit__top">
      <UiTextH4>{{ props.title }}</UiTextH4>
    </div>

    <div
      class="accounts__edit__content"
      :class="{ 'without-top': !props.title }">
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
          Выберите платежную систему, чтобы заполнить реквизиты для выплат.
        </div>

        <UiFormControl
          label="Скриншоты реквизитов"
          :errors="documentsError ? [documentsError] : []">
          <div class="payment-documents">
            <div class="payment-documents__dropzone">
              <UiDragAndDrop
                class="payment-documents__drag"
                @files="handleFilesSelected" />
            </div>

            <div class="payment-documents__hint">
              Можно оставить уже прикрепленные документы и догрузить новые. Новые файлы отправятся в S3 при сохранении формы.
            </div>

            <div
              v-if="selectedFiles.length > 0"
              class="payment-documents__summary">
              <span v-if="existingSelectedFiles.length > 0">
                Уже прикреплено: {{ existingSelectedFiles.length }}
              </span>
              <span v-if="newSelectedFiles.length > 0">
                Новые файлы: {{ newSelectedFiles.length }}
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
                    v-if="resolveSelectedFilePreviewMeta(selectedFile).type === 'image' && resolveSelectedFilePreviewMeta(selectedFile).src"
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
                      {{ selectedFile.source === "existing" ? "Уже прикреплён" : "Новый файл" }}
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
                  :aria-label="selectedFile.source === 'existing' ? 'Убрать уже прикреплённый файл' : 'Убрать новый файл'"
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
  const fallbackPaymentField: PaymentSystemField = {
    key: "recipientAddress",
    label: "Recipient Address",
    placeholder: "Введите реквизиты для выплат",
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

  const paymentMethodLabel = computed(() => {
    const key = "cabinet.payments.details.createNew.paymentMethod";
    const translated = t(key);
    return translated === key ? "Платежный метод" : translated;
  });

  const submitButtonLabel = computed(() =>
    props.mode === "edit" ? "Сохранить изменения" : t("cabinet.accounts.accounts-form.actions.submit")
  );

  const existingSelectedFiles = computed(() => selectedFiles.value.filter(file => file.source === "existing"));
  const newSelectedFiles = computed(() => selectedFiles.value.filter(file => file.source === "new"));

  const humanizeFieldKey = (key: string): string => {
    const formatted = key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim();

    return formatted ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : "Field";
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
          const placeholder = String(value.placeholder ?? "Введите значение");
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
          const placeholder = String(value.placeholder ?? "Введите значение");
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
    const normalized = String(value || "").split("?")[0].split("#")[0].trim().toLowerCase();
    const segments = normalized.split(".");

    return segments.length > 1 ? segments.pop() || "" : "";
  };

  const resolvePreviewMeta = (
    mimeType: string,
    previewUrl: string,
    path: string,
    name: string
  ): { type: "image" | "pdf" | "text" | "file"; src: string; label: string } => {
    const normalizedMimeType = String(mimeType || "").trim().toLowerCase();
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
      name: String(item.name ?? "Document"),
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
        displayName: String(document.name ?? "Document"),
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
      props.paymentDetail.payment_system_id ?? props.paymentDetail.paymentSystemId ?? props.paymentDetail.payment_system?.id ?? ""
    );
    selectedPaymentSystem.value = paymentSystems.find(system => system.id === formData.paymentSystemId) ?? null;
    initializePaymentFields(extractEditablePaymentData(props.paymentDetail.data));
    hydrateSelectedFiles(Array.isArray(props.paymentDetail.documents) ? props.paymentDetail.documents : []);
  };

  const handleFilesSelected = (files: File[] = []) => {
    if (!Array.isArray(files) || files.length === 0) {
      return;
    }

    const uploadableFiles = files.filter(file => {
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        toast.error(`Файл ${file.name} имеет недопустимый формат.`);
        return false;
      }

      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        toast.error(`Файл ${file.name} превышает 5 МБ.`);
        return false;
      }

      return true;
    });

    const buildFileSignature = (file: File): string => `${file.name}:${file.size}:${file.lastModified}`;
    const alreadyAdded = new Set(
      selectedFiles.value
        .filter(item => item.file instanceof File)
        .map(item => buildFileSignature(item.file as File))
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
      return "Файл слишком большой.";
    }

    const message = String(anyError?.response?.data?.message ?? anyError?.message ?? "").trim();
    return message || "Не удалось загрузить файл в S3.";
  };

  const resolveUploadStatusLabel = (selectedFile: SelectedUploadFile): string => {
    if (selectedFile.source === "existing") {
      return "Сохранён";
    }

    if (selectedFile.uploadStatus === "uploading") {
      return "Загрузка...";
    }

    if (selectedFile.uploadStatus === "uploaded") {
      return "Загружено";
    }

    if (selectedFile.uploadStatus === "failed") {
      return "Ошибка загрузки";
    }

    return "Готов к загрузке";
  };

  const resolveUploadStatusCaption = (selectedFile: SelectedUploadFile): string => {
    if (selectedFile.source === "existing") {
      return "Этот документ уже сохранён и останется прикреплённым, если вы его не удалите.";
    }

    if (selectedFile.uploadStatus === "uploading") {
      return "Файл сейчас загружается в Amazon S3.";
    }

    if (selectedFile.uploadStatus === "uploaded") {
      return "Файл уже загружен и будет сохранён вместе с реквизитом.";
    }

    if (selectedFile.uploadStatus === "failed") {
      return "Загрузка не завершилась. Исправьте ошибку или уберите файл.";
    }

    return "Файл выбран и будет загружен после нажатия на сохранение.";
  };

  const uploadSingleDocument = async (selectedFile: SelectedUploadFile): Promise<Record<string, any>> => {
    if (selectedFile.uploadedDocument) {
      selectedFile.uploadStatus = "uploaded";
      selectedFile.uploadProgress = 100;
      return selectedFile.uploadedDocument;
    }

    if (!selectedFile.file) {
      throw new Error("Не удалось получить файл для загрузки.");
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
        throw new Error("Не удалось получить ссылку для загрузки.");
      }

      await axios.put(url, selectedFile.file, {
        headers: { "Content-Type": selectedFile.file.type },
        onUploadProgress(event) {
          const total = Number(event.total ?? selectedFile.file.size ?? 0);
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
        fieldErrors[field.key] = "Поле обязательно для заполнения";
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
      throw new Error(`Не удалось загрузить ${failedUploads} файл(ов).`);
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
        documentsError.value = "Добавьте минимум один скриншот реквизитов для верификации.";
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

        toast.success(
          response.data.message ||
            (props.mode === "edit"
              ? "Платёжные реквизиты обновлены и повторно отправлены на проверку."
              : "Платёжные реквизиты созданы успешно.")
        );
        closeModal();
        useEventBus.emit("loadDataForPaymentDetails");
      } catch (errorResponse: any) {
        const errorMessage = errorResponse?.response?.data?.message || "Не удалось сохранить платежные реквизиты.";
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
      min-height: 50px;
      padding-left: 40px;
      padding-right: 20px;
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
        padding: 40px;

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

  .payment-documents__dropzone {
    position: relative;
    min-height: 120px;
  }

  .payment-documents__drag {
    position: absolute;
    inset: 0;
  }

  .payment-documents__hint {
    color: var(--ui-text-secondary);
    font-size: 12px;
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

  @media (max-width: 768px) {
    .accounts__edit {
      &__top {
        padding-left: 20px;
        padding-right: 20px;
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
