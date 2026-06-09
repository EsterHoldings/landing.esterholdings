<template>
  <UiContainer>
    <div class="career">
      <UiTextH3 class="career_title">{{ t('landing.pages.company.career.title') }}</UiTextH3>


        <div class="flex justify-between items-start gap-4">
          <PanelDefault class="w-[50%] p-5">
            <UiTextH5 class="career_subtitle !text-[var(--landing-accent)] mb-5">{{ t('landing.pages.company.career.subtitle') }}</UiTextH5>

            <ul class="career_list">
              <li
                  v-for="(position, index) in positions"
                  :key="index">
                {{ position }}
              </li>
            </ul>
          </PanelDefault>

          <PanelDefault class="w-[50%] p-5">
            <UiTextH5>{{ t('landing.pages.company.career.cta') }}</UiTextH5>

            <div>
              <UiButtonDefault state="info" class="mt-5">{{ t('landing.pages.company.career.button') }}</UiButtonDefault>
            </div>
          </PanelDefault>
        </div>

    </div>
  </UiContainer>
</template>

<script setup lang="ts">
  import { definePageMeta } from '~/.nuxt/imports';
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';
  import UiContainer from '~/components/ui/UiContainer.vue';
  import UiTextH3 from '~/components/ui/UiTextH3.vue';
  import UiTextH5 from '~/components/ui/UiTextH5.vue';
  import UiButtonDefault from '~/components/ui/UiButtonDefault.vue';
  import PanelDefault from "~/components/block/panels/PanelDefault.vue";

  definePageMeta({
    layout: 'main',
    alias: '/career',
  });

  const { t, tm } = useI18n();

  const positions = computed(() => {
    const list = tm('landing.pages.company.career.positions') as any[];
    return Array.isArray(list) ? list.map((_, index) => t(`landing.pages.company.career.positions[${index}]`)) : [];
  });
</script>

<style lang="scss" scoped>
  .career {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &_title {
      color: var(--landing-text-primary);
      text-align: center;
    }

    &_subtitle {
      color: var(--landing-text-primary);
    }

    &_list {
      color: var(--landing-text-primary);
      padding-left: 10px;
      li {
        margin-bottom: 15px;
        font-weight: 700;
      }
    }

    h5 {
      color: var(--landing-text-primary);
    }
  }
</style>
