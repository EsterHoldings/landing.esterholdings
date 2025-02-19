<template>
  <div class="roles-panel__edit">
    <div
        class="roles-panel__edit__top"
        v-if="props.title"
    >
      <UiTextH2>{{ props.title }}</UiTextH2>
    </div>

    <div
        class="roles-panel__edit__content"
        :class="{'without-top': !props.title}"
    >
      <div class="roles-panel__edit__content__fields">

        <UiFormControl label="Name">
          <UiInput
              placeholder="..."
              :disabled="true"
              :value="formData.name"
          />
        </UiFormControl>

        <UiFormControl label="Roles" :errors="validatorUserForm?.errorsFormData?.roles?.errors">
          <UiMultiSelect
              placeholder="Choose roles"
              :data="rolesData"
              :selected="formData.roles"
              :isDirty="validatorUserForm?.errorsFormData?.roles?.isDirty"
              :isInvalid="validatorUserForm?.errorsFormData?.roles?.errors?.length > 0"
              @update="handleUpdateMultiSelectRoles"
              @remove="handleRemoveMultiSelectRoles"
              @open="handleOpenMultiSelectRoles"
              @close="handleCloseMultiSelectRoles"
          />
        </UiFormControl>
      </div>
    </div>
  </div>

  <div class="roles-panel__edit__bottom">
    <UiButtonDefault
        class="roles-panel__edit__bottom__save-btn"
        state="secondary"
        @click="handleSubmitForm"
    >Create new & Save</UiButtonDefault>
  </div>
</template>

<script lang="ts" setup>
import { reactive, inject, onMounted } from "vue";
import UiFormControl from "~/components/ui/UiFormControl.vue";
import UiInput from "~/components/ui/UiInput.vue";
import UiMultiSelect from "~/components/ui/UiMultiSelect.vue";
import UiTextH2 from "~/components/ui/UiTextH2.vue";
import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
import {validatorUserForm} from "~/pages/access/composables/UsersPanelEdit/validation";
import {formData} from "~/pages/access/composables/UsersPanelEdit";
import useAppCore from "~/composables/useAppCore";
import useEventBus from "~/composables/useEventBus";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    required: true,
  }
})

let rolesData = reactive([]);

const app = useAppCore();

const { closeModal } = inject("modalControl") as { closeModal: Function };

const getUser = async () => {
  const response = await app.users.getById(props.id);
  const selectedRoles = response.data.data.roles;


  formData.id = response.data.data.id;
  formData.name = response.data.data.name;
  formData.roles = selectedRoles.map(role => role.id);
}

const getRoles = async () => {
  const response = await app.roles.get({perPage: 20});
  rolesData = response.data.data.data;
};


const validateThisField = () => {
  validatorUserForm?.doValidateField('roles', formData.roles);
};

const handleUpdateMultiSelectRoles = (selectedId: string) => {
  const index = formData.roles.indexOf(selectedId);
  if (index !== -1) {
    formData.roles.splice(index, 1);
  } else {
    formData.roles.push(selectedId);
  }
  validateThisField();
};

const handleRemoveMultiSelectRoles = (id: string) => {
  const index = formData.roles.indexOf(id);
  if (index !== -1) formData.roles.splice(index, 1);
  validateThisField();
};

const handleOpenMultiSelectRoles = () => {
  if (validatorUserForm?.errorsFormData?.roles)
    validatorUserForm.errorsFormData.roles.isDirty = true;
}
const handleCloseMultiSelectPermissions = () => validateThisField();

const handleSubmitForm = async () => {

  try {
    await app.roles.patch(props.id, formData);
    closeModal();
    useEventBus.emit("loadDataForRoles");
  } catch (errorResponse) {
    console.log('handleSubmitForm -> errorResponse', errorResponse);
  }
}

onMounted(async () => {
  await getRoles();
  await getUser();
})
</script>

<style lang="scss" scoped>
.roles-panel__edit {
  &__top {
    height: 50px;

    padding-left: 40px;
    padding-right: 20px;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    border-bottom: 1px solid gainsboro;
  }

  &__content {
    height: calc(100vh - 120px);

    &.without-top {
      height: calc(100vh - 50px);
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

  &__bottom {
    height: 70px;

    padding-left: 40px;
    padding-right: 40px;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    border-top: 1px solid gainsboro;

    .btn {
      height: 40px;
    }
  }
}
</style>
