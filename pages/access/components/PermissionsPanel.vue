<template>
  <PanelDefault title="# Permissions">
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
        :columns="permissionsColumns"
        :data="permissionsData"
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

const permissionsColumns = reactive([
  {title: "Title", key: "title"},
  {title: "IsActive", key: "is_active"},
]);
const permissionsData = reactive([
  {
    title: "Can Craete User",
    is_active: "true"
  },
  {
    title: "Can Read User",
    is_active: "true"
  },
  {
    title: "Can Update User",
    is_active: "true"
  },
  {
    title: "Can Delete User",
    is_active: "false"
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
  }
}
</style>