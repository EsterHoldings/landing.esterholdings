<template>
  <div class="clients-panel__content" :class="viewMode">
    <div
      v-for="item in props.data"
      :key="item.id"
      class="client-card card-with-action"
      :class="viewMode === 'full' ? 'client-card--full' : ''"
    >
      <button
        class="action-btn"
        aria-label="Open client"
        @click="handleOpenClientPage(item.id)"
      >
        <UiIconUser />
      </button>

      <div class="client-card__body" :class="viewMode === 'full' ? 'client-card__body--row' : ''">
        <div class="client-card__user">
          <UiTextSmall class="text-[var(--ui-text-secondary)]">
            {{ t("admin.accounts.components.accounts-panel.columns.name") }}
          </UiTextSmall>
          <div class="client-card__user-row">
            <div class="user-photo" @click="handleOpenClientPage(item.id)">
              <UiImageCircle
                :twoChars="getTwoCharsByFullName(item.first_name, item.last_name)"
                :src="item.photo_url"
              />
            </div>
            <div class="client-card__user-text">
              <div class="truncate font-semibold">
                {{ item.first_name }} {{ item.last_name }}
              </div>
              <div class="client-card__user-id">{{ item.id }}</div>
            </div>
          </div>
        </div>

        <div>
          <UiTextSmall class="text-[var(--ui-text-secondary)]">
            {{ t("admin.accounts.components.accounts-panel.columns.email") }}
          </UiTextSmall>
          <div class="truncate">{{ item.email || "-" }}</div>
        </div>

        <div>
          <UiTextSmall class="text-[var(--ui-text-secondary)]">
            {{ t("admin.accounts.components.accounts-panel.columns.phone") }}
          </UiTextSmall>
          <div class="truncate">{{ item.phone || "-" }}</div>
        </div>

        <div>
          <UiTextSmall class="text-[var(--ui-text-secondary)]">
            {{ t("admin.clients.columns.birthdate", "Birthdate") }}
          </UiTextSmall>
          <div class="truncate">{{ item.birthdate || "-" }}</div>
        </div>

        <div>
          <UiTextSmall class="text-[var(--ui-text-secondary)]">
            {{ t("admin.accounts.components.accounts-panel.columns.created_at") }}
          </UiTextSmall>
          <div class="client-card__meta">{{ formatDate(item.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import UiImageCircle from "~/components/ui/UiImageCircle.vue";
import UiIconUser from "~/components/ui/UiIconUser.vue";
import UiTextSmall from "~/components/ui/UiTextSmall.vue";

const emit = defineEmits(['click'])
const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  viewMode: {
    type: String,
    default: "cards"
  }
});

const {t} = useI18n({useScope: "global"});
const handleOpenClientPage = (id: string) => emit('click', id);

const getTwoCharsByFullName = (firstName: string, lastName: string): string => {
  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName.charAt(0);
  return `${firstInitial}${lastInitial}`;
}

const formatDate = (date: string) => {
  if (!date) return "-";
  const d = new Date(date);
  return isNaN(d.getTime()) ? date : d.toLocaleString();
};
</script>

<style scoped lang="scss">
.clients-panel__content {
  color: var(--ui-text-main);

  &.cards {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
  }

  &.full {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .clients-panel__content.cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .clients-panel__content.cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.client-card {
  position: relative;
  background: var(--ui-background-panel);
  border-bottom: 1px solid var(--color-stroke-ui-light);
  border-radius: 10px;
  padding: 10px 14px;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.client-card--full {
  padding: 8px 40px 8px 14px;
}

.client-card:hover {
  opacity: 0.6;
}

.client-card__body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  color: var(--ui-text-main);
}

.client-card__body > div {
  flex: 1 1 140px;
  min-width: 140px;
}

.client-card__body--row {
  flex-wrap: nowrap;
  gap: 6px 12px;
  align-items: flex-start;
}

.client-card__user {
  min-width: 180px;
}

.client-card__user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.client-card__user-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.client-card__user-id {
  font-size: 12px;
  color: var(--ui-primary-main);
}

.client-card__meta {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1024px) {
  .client-card__body--row {
    flex-wrap: wrap;
  }
}

.card-with-action {
  padding-right: 36px;
}

.card-with-action .action-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 8px;
  color: var(--ui-text-secondary);
  background: transparent;
  border: none;
  transition: color 0.2s ease, transform 0.15s ease;
}

.card-with-action .action-btn:hover {
  color: var(--ui-text-main);
  transform: translateY(-1px);
}
</style>
