<template>
  <UiContainer>
    <section class="partnership-maintenance">
      <div class="partnership-maintenance__content">
        <span class="partnership-maintenance__eyebrow">{{ copy.eyebrow }}</span>
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.text }}</p>

        <div class="partnership-maintenance__status">
          <span
            v-for="item in copy.status"
            :key="item">
            {{ item }}
          </span>
        </div>
      </div>

      <ul class="partnership-maintenance__notes">
        <li
          v-for="item in copy.notes"
          :key="item.title">
          <span>{{ item.index }}</span>
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";

  type MaintenanceCopy = {
    eyebrow: string;
    title: string;
    text: string;
    status: string[];
    notes: Array<{
      index: string;
      title: string;
      text: string;
    }>;
  };

  const localizedCopy: Record<string, MaintenanceCopy> = {
    en: {
      eyebrow: "Partnership",
      title: "The partnership section is temporarily closed",
      text: "We are updating the IB infrastructure and revising the partner tools. Sorry, this section is closed while the work is in progress.",
      status: ["Infrastructure update", "IB tools revision", "Access paused"],
      notes: [
        {
          index: "1",
          title: "IB registration is paused",
          text: "New partner applications are not accepted until the updated flow is ready.",
        },
        {
          index: "2",
          title: "Income mechanics are being updated",
          text: "The referral model and partner analytics are being prepared for the next release.",
        },
        {
          index: "3",
          title: "The section will return later",
          text: "Once the infrastructure update is complete, access will be restored with current terms.",
        },
      ],
    },
    uk: {
      eyebrow: "Партнерство",
      title: "Розділ партнерства тимчасово закритий",
      text: "Ми оновлюємо IB-інфраструктуру та переглядаємо партнерські інструменти. Перепрошуємо, розділ закритий на час робіт.",
      status: ["Оновлення інфраструктури", "Перегляд IB-інструментів", "Доступ призупинено"],
      notes: [
        {
          index: "1",
          title: "Реєстрацію IB призупинено",
          text: "Нові партнерські заявки не приймаються, доки оновлений процес не буде готовий.",
        },
        {
          index: "2",
          title: "Механіка доходу оновлюється",
          text: "Реферальна модель і партнерська аналітика готуються до наступного релізу.",
        },
        {
          index: "3",
          title: "Розділ повернеться пізніше",
          text: "Після завершення оновлення інфраструктури доступ буде відновлено з актуальними умовами.",
        },
      ],
    },
    ru: {
      eyebrow: "Партнёрство",
      title: "Раздел партнёрства временно закрыт",
      text: "Мы обновляем IB-инфраструктуру и пересматриваем партнёрские инструменты. Извините, раздел закрыт на время работ.",
      status: ["Обновление инфраструктуры", "Пересмотр IB-инструментов", "Доступ приостановлен"],
      notes: [
        {
          index: "1",
          title: "Регистрация IB приостановлена",
          text: "Новые партнёрские заявки не принимаются, пока обновлённый процесс не будет готов.",
        },
        {
          index: "2",
          title: "Механика дохода обновляется",
          text: "Реферальная модель и партнёрская аналитика готовятся к следующему релизу.",
        },
        {
          index: "3",
          title: "Раздел вернётся позже",
          text: "После завершения обновления инфраструктуры доступ будет восстановлен с актуальными условиями.",
        },
      ],
    },
  };

  const { locale } = useI18n();

  const copy = computed(() => localizedCopy[locale.value] ?? localizedCopy.en);
</script>

<style scoped lang="scss">
  .partnership-maintenance {
    width: 100%;
    min-height: calc(100vh - 390px);
    padding: clamp(80px, 10vw, 150px) 0 clamp(76px, 9vw, 130px);
    color: var(--landing-text-primary);
  }

  .partnership-maintenance__content {
    max-width: 850px;
  }

  .partnership-maintenance__eyebrow {
    display: inline-flex;
    margin-bottom: 18px;
    color: var(--landing-accent);
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
  }

  h1 {
    max-width: 780px;
    margin: 0;
    color: var(--landing-text-primary);
    font-size: clamp(38px, 6vw, 76px);
    font-weight: 500;
    line-height: 0.98;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: var(--landing-text-secondary);
    font-size: 18px;
    line-height: 1.55;
  }

  .partnership-maintenance__content > p {
    max-width: 670px;
    margin-top: 26px;
  }

  .partnership-maintenance__status {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 32px;

    span {
      display: inline-flex;
      align-items: center;
      min-height: 40px;
      padding: 0 18px;
      border: 1px solid var(--landing-border-strong);
      border-radius: 999px;
      background: var(--landing-surface-glass);
      color: var(--landing-text-primary);
      font-size: 14px;
      font-weight: 700;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
  }

  .partnership-maintenance__notes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(22px, 3vw, 42px);
    max-width: 1180px;
    margin: clamp(72px, 8vw, 110px) 0 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: 72px 1fr;
      gap: 22px;
      align-items: start;
      min-width: 0;
    }

    span {
      display: grid;
      place-items: center;
      width: 72px;
      height: 72px;
      border: 1px solid var(--landing-border-strong);
      border-radius: 18px;
      background: color-mix(in srgb, var(--landing-surface-glass) 78%, transparent);
      color: var(--landing-accent);
      font-size: 34px;
      font-weight: 600;
      line-height: 1;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    h2 {
      margin: 0 0 12px;
      color: var(--landing-accent);
      font-size: clamp(22px, 2.4vw, 32px);
      font-weight: 500;
      line-height: 1.1;
    }
  }

  @media (max-width: 991px) {
    .partnership-maintenance__notes {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .partnership-maintenance {
      padding-top: 58px;
    }

    .partnership-maintenance__notes li {
      grid-template-columns: 56px 1fr;
      gap: 16px;
    }

    .partnership-maintenance__notes span {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      font-size: 26px;
    }
  }
</style>
