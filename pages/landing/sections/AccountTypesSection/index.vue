<template>
  <section class="py-10 md:py-16">
    <div class="w-full max-w-[1400px] mx-auto">
      <UiTextH3
          class="text-[var(--ui-text-main)] text-center mb-10 md:mb-[70px]"
      >
        {{ t('landing.sections.accounts__title') }}
      </UiTextH3>

      <div class="relative">
        <div class="px-10 sm:px-6">
          <div class="px-10">
            <div
                ref="scrollRef"
                class="flex items-center gap-3 sm:gap-4 md:gap-6
                   overflow-x-auto pb-5 sm:pb-6
                   snap-x snap-mandatory scroll-smooth
                   hide-scrollbar
                   touch-pan-y overscroll-x-contain"
                tabindex="0"
                aria-label="Account cards horizontal scroll"
                @wheel="onWheel"
            >
              <TheCard
                  :class="{
                    'ml-10': index === 0,
                    'mr-10': index === accountCards.length - 1,
                  }"
                  v-for="(card, index) in accountCards"
                  :key="index"
                  :type="card.type"
                  :title="card.title"
                  :subtitle="card.subtitle"
                  :description="card.description"
                  :features="card.features"
                  :button-text="card.buttonText"
                  :is-recommended="card.isRecommended"
                  class="snap-start shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {computed, ref, onMounted, onBeforeUnmount} from 'vue'
import UiTextH3 from '~/components/ui/UiTextH3.vue'
import UiContainer from '~/components/ui/UiContainer.vue'
import TheCard from '~/components/block/TheCard.vue'

// <!--      [mask-image:linear-gradient(to_right,_transparent_0,_#000_32px,_#000_calc(100%_-_32px),_transparent_100%)]-->
// <!--      [-webkit-mask-image:linear-gradient(to_right,_transparent_0,_#000_32px,_#000_calc(100%_-_32px),_transparent_100%)]"-->

const {t, tm} = useI18n()

const accountCards = computed(() => {
  const options = tm('landing.sections.accounts__options') as any[]
  return Array.isArray(options)
      ? options.map((option: any, index: number) => ({
        type: t(`landing.sections.accounts__options[${index}].type`) as
            | 'demo'
            | 'standard'
            | 'pro'
            | 'tandem'
            | 'islamic',
        title: t(`landing.sections.accounts__options[${index}].title`),
        subtitle: t(`landing.sections.accounts__options[${index}].subtitle`),
        description: t(
            `landing.sections.accounts__options[${index}].description`,
        ),
        features: (tm(
            `landing.sections.accounts__options[${index}].features`,
        ) as any[]).map((_, fIndex) =>
            t(
                `landing.sections.accounts__options[${index}].features[${fIndex}]`,
            ),
        ),
        buttonText: t(
            `landing.sections.accounts__options[${index}].buttonText`,
        ),
        isRecommended: Boolean(option.isRecommended),
      }))
      : []
})

const scrollRef = ref<HTMLElement | null>(null)

function onWheel(e: WheelEvent) {
  const el = e.currentTarget as HTMLElement
  const mainlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX)
  if (!mainlyVertical) return

  const maxScrollLeft = el.scrollWidth - el.clientWidth
  const atStart = el.scrollLeft <= 0
  const atEnd = el.scrollLeft >= maxScrollLeft

  if ((e.deltaY < 0 && !atStart) || (e.deltaY > 0 && !atEnd)) {
    e.preventDefault()
    el.scrollLeft += e.deltaY
  }
}

onMounted(() => {
  const el = scrollRef.value
  if (!el) return
  el.addEventListener('wheel', onWheel as EventListener, {passive: false})
})

onBeforeUnmount(() => {
  const el = scrollRef.value
  if (!el) return
  el.removeEventListener('wheel', onWheel as EventListener)
})
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  height: 0;
  width: 0;
}
</style>
