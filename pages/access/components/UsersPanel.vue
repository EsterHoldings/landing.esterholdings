<template>
  <PanelDefault title="# Users">
    <template #title-extra>
      <div>+</div>
    </template>
    <UsersPanelSearch
        @input="handleInputSearch"
        :isLoading="isLoadingSearch"
        :value="searchFilter"
    />
    <TableDefault
        :columns="usersColumns"
        :data="usersData"
        :isLoading="isLoading"
        :rowsPerPage="5"
    />
    <PaginationDefault
        :isLoading="isLoading"
        :perPage="perPage"
        :page="page"
        :totalRows="totalRows"
        @perPageChange="handleChangePerPage"
        @pageChange="handleChangePage"
    />
  </PanelDefault>
</template>

<script lang="ts" setup>
import {inject, onMounted, reactive, ref} from "vue";
import {debounce} from "~/utils/helper/debounce";
import TableDefault from "~/components/block/tables/TableDefault.vue";
import PanelDefault from "~/components/block/panels/PanelDefault.vue";
import PaginationDefault from "~/components/block/paginations/PaginationDefault.vue";
import UsersPanelSearch from "~/pages/access/components/UsersPanelSearch.vue";

import useAppCore from "~/composables/useAppCore";
import useEventBus from "~/composables/useEventBus";
import UiIconEdit from "~/components/ui/UiIconEdit.vue";
import UiIconDelete from "~/components/ui/UiIconDelete.vue";
import UiTextParagraph from "~/components/ui/UiTextParagraph.vue";
import RolesPanelEdit from "~/pages/access/components/RolesPanelEdit.vue";
import UsersPanelEdit from "~/pages/access/components/UsersPanelEdit.vue";

const appCore = useAppCore();

const isLoading = ref(false);
const isLoadingSearch = ref(false);
const perPage = ref(5);
const page = ref(1);
const totalRows = ref(0);
const searchFields = ref(["id", "first_name", "phone", "country"]);
const searchFilter = ref("");

const { openModal } = inject("modalControl") as { openModal: Function };

const usersColumns = reactive([
  {title: "Id", key: "id"},
  {title: "FirstName", key: "first_name"},
  {title: "Phone", key: "phone"},
  {title: "Country", key: "country"},
  {title: "CreatedAt", key: "created_at"},
  {title: "Options", key: "options"},
]);

const usersData = reactive([]);

const loadData = async (isFilterQuery = false) => {
  const params = {
    page: isFilterQuery ? 1 : page.value,
    perPage: perPage.value,
    searchFilter: searchFilter.value,
    searchFields: searchFields.value,
  };

  const response = await appCore.users.get(params);

  totalRows.value = response.data.data.total;

  let responseUsersData = response.data.data.data;
  responseUsersData.forEach((user:any) => {
    user.id = [
      {
        is: UiTextParagraph,
        props: {},
        events: { click: () => console.log(user.id) },
        slot: user.id
      }
    ];
    user.first_name = [
      {
        is: UiTextParagraph,
        props: {},
        events: { click: () => console.log(user.id) },
        slot: user.first_name
      }
    ];
    user.phone = [
      {
        is: UiTextParagraph,
        props: {},
        events: { click: () => console.log(user.id) },
        slot: user.phone
      }
    ];

    user.options = [
      {
        isIcon: true,
        is: UiIconEdit,
        props: {},
        events: { click: () => handleOpenClientPage(user.id) },
      },
    ];
  });

  isLoading.value = false;
  usersData.splice(0, usersData.length, ...responseUsersData);
};

const handleOpenClientPage = (id:string) => {
  openModal(UsersPanelEdit, { title: "Edit User Roles", id });
}

const handleChangePerPage = async (value: number) => {
  page.value = 1;
  perPage.value = value;
  await loadData();
};

const handleChangePage = async (value: number) => {
  page.value = value;
  await loadData();
};

const handleInputSearch = debounce(async (event: any) => {
  try {
    isLoadingSearch.value = true;
    searchFilter.value = event.target.value;
    await loadData(true);
  } finally {
    isLoadingSearch.value = false;
  }
}, 300);

onMounted(async () => {
  isLoading.value = true;
  await loadData();
  useEventBus.on('loadDataForUsers', loadData)
});
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