<template>
  <section class="account-types__wrapper">
    <UiContainer>
      <UiTextH3 class="account-types__title">{{ t('landing.sections.accounts__title') }} </UiTextH3>

      <div class="cards-scroll-wrapper">
        <div class="cards-scroll-container">
          <TheCard
            v-for="card in accountCards"
            :key="card.type"
            :type="card.type"
            :title="card.title"
            :subtitle="card.subtitle"
            :description="card.description"
            :features="card.features"
            :button-text="card.buttonText"
            :is-recommended="card.isRecommended" />
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import UiTextH3 from '~/components/ui/UiTextH3.vue';
  import UiContainer from '~/components/ui/UiContainer.vue';
  import TheCard from '~/components/block/TheCard.vue';

  const { t } = useI18n();

  const accountCards = [
    {
      type: 'demo' as const,
      title: 'Demo',
      subtitle: 'account',
      description: 'Risk-free trading with virtual funds, perfect for beginners to explore markets.',
      features: ['Leverage up to 1:500', 'Spreads from 0.0 pips', 'No deposit required'],
      buttonText: 'Try Demo Now',
      isRecommended: true,
    },
    {
      type: 'standard' as const,
      title: 'Standard',
      subtitle: 'account',
      description: 'Easy access to spot markets with low fees and — ideal for beginners and active traders.',
      features: ['Leverage up to 1:500', 'Spreads from 1.2 pips', 'First deposit of $50'],
      buttonText: 'Open Standard Account',
      isRecommended: false,
    },
    {
      type: 'pro' as const,
      title: 'Pro',
      subtitle: 'account',
      description: 'Experience tight spreads, higher leverage, and full control over every trade.',
      features: ['Leverage up to 1:500', 'Spreads from 0.0 pips', 'First deposit of $1000'],
      buttonText: 'Trade Like a Pro',
      isRecommended: false,
    },
    {
      type: 'tandem' as const,
      title: 'Tandem',
      subtitle: 'account',
      description: 'Pair with a partner, mentor, or co-trader and grow together with synchronized strategies.',
      features: ['Leverage up to 1:200', 'Shared account access', 'Real-time trade mirroring'],
      buttonText: 'Trade Together',
      isRecommended: false,
    },
    {
      type: 'islamic' as const,
      title: 'Islamic',
      subtitle: 'account',
      description: 'Swap-free. Shariah-compliant. Trade without interest, with full platform access.',
      features: ['Leverage up to 1:500', 'No swap / interest fees', 'Access to all trading instruments'],
      buttonText: 'Open Islamic Account',
      isRecommended: false,
    },
  ];
</script>

<style lang="scss" scoped>
  .account-types {
    &__wrapper {
      padding: 40px 0;
    }

    &__title {
      color: var(--ui-text-main);
      text-align: center;
      margin-bottom: 70px;
    }
  }

  .cards-scroll-wrapper {
    padding: 20px 0;
    overflow: hidden;
  }

  .cards-scroll-container {
    display: flex;
    align-items: center;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 20px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 0px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }

  @media (max-width: 767px) {
    .account-types {
      &__title {
        font-size: 24px;
        margin-bottom: 40px;
      }
    }

    .cards-scroll-wrapper {
      padding: 10px 0;
    }

    .cards-scroll-container {
      gap: 12px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }
</style>
