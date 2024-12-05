<template>
  <PanelDefault title="# Users">
    <template #title-extra>
      <div>+</div>
    </template>
    <div class="panel-search">
      <UiInput
          class="panel-search__input"
          placeholder="Search"
          :borderNone="true"
          :paddingNone="true"
      >
        <template #icon-left>
          <UiIconSearch/>
        </template>
      </UiInput>
    </div>
    <TableDefault
        :columns="usersColumns"
        :data="usersData"
    />
    <PaginationDefault/>
  </PanelDefault>
</template>

<script lang="ts" setup>
import PanelDefault from "~/components/block/panels/PanelDefault.vue";
import UiFormControl from "~/components/ui/UiFormControl.vue";
import UiInput from "~/components/ui/UiInput.vue";
import TableDefault from "~/components/block/tables/TableDefault.vue";
import PaginationDefault from "~/components/block/paginations/PaginationDefault.vue";
import {reactive} from "vue";
import UiIconSearch from "~/components/ui/UiIconSearch.vue";

const usersColumns = reactive([
  {title: "Title", key: "title"},
  {title: "Roles", key: "roles"},
  {title: "IsActive", key: "is_active"},
]);
const usersData = reactive([
  {
    id: "dd9ed549-9ecb-4f2b-8eb1-f40c1a75e117",
    title: "David Cook",
    roles: ['Owner', 'Admin'],
    is_active: "+"
  },
  {
    id: "7e26482c-6fa2-4ac4-b726-60423d521680",
    title: "Stepan Soroka",
    roles: ['Admin'],
    is_active: "-"
  },
  {
    id: "25f775db-3736-49b1-877a-e59056ee342d",
    title: "Ivan Petrov",
    roles: ['Manager'],
    is_active: "-"
  },
  {
    id: "09441d74-6113-4915-898d-dbc74677c243",
    title: "Rodion Maksymenko",
    permissions: ['Developer', 'Admin'],
    is_active: "+"
  },
]);
</script>

<style lang="scss" scoped>
.panel-search {
  border: none;
  border-radius: 0;
  border-top: 1px solid var(--color-secondary);
  margin-bottom: 0;

  &__input {
    border: none;

    &.input {
      padding: 0 !important;
    }
  }
}
</style>