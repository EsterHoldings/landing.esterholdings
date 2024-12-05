<template>
  <PanelDefault title="# Roles">

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
        :columns="rolesColumns"
        :data="rolesData"
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
import {onMounted, reactive} from "vue";
import UiIconSearch from "~/components/ui/UiIconSearch.vue";
import axios from "axios";
import { format } from "date-fns";

const rolesColumns = ref([
  {title: "Name", key: "name"},
  {title: "Permissions", key: "permissions"},
  {title: "", key: "options"},
]);
const rolesData = ref([]);

onMounted(async () => {
  const response = await axios.get('http://localhost:8000/api/roles');
  rolesData.value = response.data.data;

  console.log(response.data.data);

  rolesData.value.forEach(role => {
    role.permissions = role.permissions.map(permission => permission.name);
    role.options = "+ - -";
  });
})
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