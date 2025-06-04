<template>
  <div class="user-documents__wrapper">
    <div class="user-documents__left">
      <PanelDefault class="user-documents-uploader">
        <UiTextH5 class="user-documents-uploader__title">Uploaded documents</UiTextH5>
        <div class="user-documents-uploader__documents">
          <div class="user-documents-uploader__document">
            <div class="user-documents-uploader__document__image">
              <UiIconImage />
            </div>
            <div class="user-documents-uploader__document__content">
              <div class="user-documents-uploader__document__content-left">
                <div class="user-documents-uploader__document__content-left__doc-name">
                  Document name
                </div>
                <div class="user-documents-uploader__document__content-left__status">
                  Status: in progress
                </div>
              </div>
              <div class="user-documents-uploader__document__content-right">
                <span class="user-documents-uploader__document__content-right__time">
                  <UiIconTime />5 hour ago
                </span>
                <span>...</span>
              </div>
            </div>
          </div>
          <div class="user-documents-uploader__document">
            <div class="user-documents-uploader__document__image">
              <UiIconImage />
            </div>
            <div class="user-documents-uploader__document__content">
              <div class="user-documents-uploader__document__content-left">
                <div class="user-documents-uploader__document__content-left__doc-name">
                  Document name
                </div>
                <div class="user-documents-uploader__document__content-left__status">
                  Status: in progress
                </div>
              </div>
              <div class="user-documents-uploader__document__content-right">
                <span class="user-documents-uploader__document__content-right__time">
                  <UiIconTime />1 day ago
                </span>
                <span>...</span>
              </div>
            </div>
          </div>
        </div>
      </PanelDefault>
    </div>
    <div class="user-documents__right">
      <PanelDefault class="user-documents__right__panel">
        <UiTextH5 class="user-documents__right__panel__title">
          Upload new documents
        </UiTextH5>
        <UiDragAndDrop
            @files="handleFilesSelected"
            v-if="selectedFiles.length === 0"
        />
        <div
            class="user-documents__right__panel__upload-document-info"
            v-if="selectedFiles.length === 0"
        >
          Ви можете завантажити скани або фотографії документів загальним розміром до 20 МБ.
          Підтримувані формати файлів: PNG, JPG, JPEG, PDF.
        </div>
        <div
            v-for="(file, index) in selectedFiles"
            :key="file.name + `-${index}`"
            class="user-documents__right__panel__selected-file"
        >
          <div class="user-documents__right__panel__selected-file__wrapper">
            <UiIconDelete
                type="button"
                class="btn-delete"
                @click="removeFile(index)"
            />
            <div class="user-documents__right__panel__selected-file__wrapper__preview">
              <UiImage :src="getPreviewUrl(file)" />
            </div>
            <div class="user-documents__right__panel__selected-file__wrapper__content">
              <UiFormControl :label="file.name">
                <UiInput
                    v-model="docNumbers[index]"
                    placeholder="Номер документа"
                    maxlength="100"
                />
              </UiFormControl>
              <div
                  v-if="docNumbers[index].length > 100"
                  class="validation-error"
              >
                Поле не може містити більше ніж 100 символів.
              </div>
              <div v-if="isUploading" class="upload-progress">
                Завантаження: {{ uploadProgress[index] }}%
              </div>
            </div>
          </div>
        </div>
        <UiFormControl
            label="Comment"
            class="user-documents__right__panel__comment"
        >
          <UiTextarea v-model="comment" placeholder="Ваш коментар..." />
        </UiFormControl>
        <UiButtonDefault
            state="info--outline"
            :disabled="isUploading || selectedFiles.length === 0"
            @click="uploadFiles"
        >
          {{ isUploading ? "Uploading..." : "Upload and send to verification" }}
        </UiButtonDefault>
      </PanelDefault>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeUnmount } from "vue";
import useApi from "~/composables/useApi";
import PanelDefault from "~/components/block/panels/PanelDefault.vue";
import UiIconImage from "~/components/ui/UiIconImage.vue";
import UiTextH5 from "~/components/ui/UiTextH5.vue";
import UiDragAndDrop from "~/components/ui/UiDragAndDrop.vue";
import UiTextarea from "~/components/ui/UiTextarea.vue";
import UiFormControl from "~/components/ui/UiFormControl.vue";
import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
import UiIconTime from "~/components/ui/UiIconTime.vue";
import UiInput from "~/components/ui/UiInput.vue";
import UiImage from "~/components/ui/UiImage.vue";
import UiIconDelete from "~/components/ui/UiIconDelete.vue";
import axios from "axios";
import { useToast } from "vue-toastification";

interface FileWithPreview extends File {
  _previewUrl?: string;
}

const selectedFiles = reactive<FileWithPreview[]>([]);
const docNumbers = reactive<string[]>([]);
const uploadProgress = reactive<number[]>([]);
const comment = ref("");
const isUploading = ref(false);
const toast = useToast();
const apiClient = new useApi(true);

function isValidFormat(file: File): boolean {
  const allowed = ["image/png", "image/jpeg", "application/pdf"];
  return allowed.includes(file.type);
}

function getPreviewUrl(file: FileWithPreview): string {
  if (file._previewUrl) {
    return file._previewUrl;
  }
  const url = URL.createObjectURL(file);
  file._previewUrl = url;
  return url;
}

function handleFilesSelected(files: File[] | undefined) {
  if (!files || !Array.isArray(files)) {
    return;
  }
  const invalid = files.filter((f) => !isValidFormat(f)).map((f) => f.name);
  if (invalid.length > 0) {
    toast.error(
        `Неприпустимий формат файлу(ів): ${invalid.join(", ")}. Дозволені формати: PNG, JPG, JPEG, PDF.`
    );
  }
  const validFiles = files.filter((f) => isValidFormat(f));
  selectedFiles.forEach((f) => {
    if (f._previewUrl) {
      URL.revokeObjectURL(f._previewUrl);
      delete f._previewUrl;
    }
  });
  selectedFiles.splice(0, selectedFiles.length);
  validFiles.forEach((f) => {
    selectedFiles.push(f as FileWithPreview);
  });
  docNumbers.splice(0, docNumbers.length);
  uploadProgress.splice(0, uploadProgress.length);
  for (let i = 0; i < validFiles.length; i++) {
    docNumbers.push("");
    uploadProgress.push(0);
  }
}

function removeFile(index: number) {
  const file = selectedFiles[index];
  if (file && file._previewUrl) {
    URL.revokeObjectURL(file._previewUrl);
  }
  selectedFiles.splice(index, 1);
  docNumbers.splice(index, 1);
  uploadProgress.splice(index, 1);
}

onBeforeUnmount(() => {
  selectedFiles.forEach((f) => {
    if (f._previewUrl) {
      URL.revokeObjectURL(f._previewUrl);
      delete f._previewUrl;
    }
  });
});

async function uploadFiles() {
  if (selectedFiles.length === 0) {
    toast.warning("Спочатку виберіть принаймні один файл.");
    return;
  }
  isUploading.value = true;

  // Собираем массив для отправки на бэкенд
  const documentsPayload: {
    name: string;
    path: string;
    document_data: { number: string };
  }[] = [];

  // Сначала загружаем файлы на S3 и собираем payload
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const docNumber = docNumbers[i] || "";
    try {
      const presignResp = await apiClient.post("client/s3/presign", {
        filename: file.name,
        contentType: file.type,
        path: "documents",
      });
      const { url, key } = presignResp.data as { url: string; key: string };
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress(event) {
          uploadProgress[i] = Math.round((event.loaded / (event.total || 1)) * 100);
        },
      });
      documentsPayload.push({
        name: file.name,
        path: key,
        document_data: { number: docNumber },
      });
    } catch (err) {
      console.error(`Не вдалося завантажити файл ${file.name}:`, err);
      toast.error(`Не вдалося завантажити файл "${file.name}". Продовжую інші…`);
      continue;
    }
  }

  // Отправляем один запрос с массивом documents
  try {
    await apiClient.post("/client/user/documents", {
      documents: documentsPayload,
      comment: comment.value || "",
    });
    toast.success("Усі документи успішно відправлені на збереження.");
  } catch (err) {
    console.error("Помилка при збереженні документів у базу:", err);
    toast.error("Не вдалося зберегти документи. Спробуйте пізніше.");
  }

  // Очищаем локальные данные и превью
  selectedFiles.forEach((f) => {
    if (f._previewUrl) {
      URL.revokeObjectURL(f._previewUrl);
      delete f._previewUrl;
    }
  });
  selectedFiles.splice(0, selectedFiles.length);
  docNumbers.splice(0, docNumbers.length);
  uploadProgress.splice(0, uploadProgress.length);
  comment.value = "";
  isUploading.value = false;
}
</script>

<style lang="scss" scoped>
.user-documents {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  &__left {
    width: 50%;
    & > div {
      padding: 20px;
    }
  }

  &__right {
    width: 50%;
    & > div {
      padding: 20px;
    }

    &__panel {
      padding: 20px;
      height: 100%;
      width: 100%;
      color: var(--ui-text-main);

      &__title {
        margin-bottom: 20px;
      }

      &__comment {
        margin-top: 20px;
        margin-bottom: 20px;
      }

      &__upload-document-info {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 13px;
        color: var(--color-warning);
      }

      &__selected-file {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px;
        border: 1px dashed var(--ui-text-main);
        border-radius: 8px;

        &__wrapper {
          position: relative;
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 20px;
          justify-content: space-between;
        }

        &__wrapper__preview {
          width: 100px;
          height: 100px;
          border: 1px solid var(--color-stroke-ui-dark);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        &__wrapper__content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .validation-error {
          color: var(--color-danger);
          font-size: 12px;
          margin-top: 2px;
        }

        .upload-progress {
          font-size: 13px;
          color: var(--ui-text-main);
          margin-top: 5px;
        }
      }
    }
  }
}

.btn-delete {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border: 1px solid var(--color-stroke-ui-dark);
  background-color: var(--ui-background);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;

  &:before {
    content: "×";
    color: #000;
  }

  &:hover {
    background: #ef4444;
    color: #fff;
  }
}

.user-documents-uploader {
  color: var(--ui-text-main);

  &__title {
    margin-bottom: 20px;
  }

  &__document {
    height: 100px;
    width: 100%;
    display: flex;
    gap: 20px;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    &__image {
      height: 100%;
      width: 100px;
      border: 1px dashed var(--ui-text-main);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__content {
      width: 100%;
      height: 100%;
      display: flex;

      &-left {
        width: 100%;
        position: relative;

        &__doc-name {
          margin-bottom: 10px;
        }

        &__status {
          color: var(--color-warning);
        }
      }

      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;

        &__time {
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          white-space: pre;

          svg {
            height: 20px;
            width: 20px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
