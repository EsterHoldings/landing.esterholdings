<template>
  <UiContainer>
    <main
      ref="pageRef"
      class="withdrawal-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <section class="withdrawal-hero">
        <div class="withdrawal-hero__content">
          <span class="section-kicker">{{ copy.hero.eyebrow }}</span>
          <h1>{{ copy.hero.title }}</h1>
          <p>{{ copy.hero.text }}</p>

          <ul class="withdrawal-hero__badges">
            <li
              v-for="item in copy.hero.badges"
              :key="item.text">
              <img
                :src="assetPath(item.icon)"
                alt=""
                aria-hidden="true"
                loading="lazy" />
              <span>{{ item.text }}</span>
            </li>
          </ul>
        </div>

        <div class="withdrawal-hero__media">
          <div
            class="withdrawal-visual"
            role="img"
            :aria-label="copy.hero.imageAlt">
            <svg
              class="withdrawal-visual__routes"
              viewBox="0 0 690 610"
              aria-hidden="true">
              <defs>
                <marker
                  id="withdrawal-visual-arrow"
                  markerUnits="userSpaceOnUse"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="5"
                  orient="auto">
                  <path
                    d="M0 0 L10 5 L0 10 Z"
                    fill="#dbe3f7" />
                </marker>
              </defs>
              <path
                class="withdrawal-visual__route withdrawal-visual__route--left"
                d="M160 84 H226 Q250 84 250 108 V230 Q250 254 226 254 H156 Q132 254 132 278 V384 Q132 408 156 408 H228"
                pathLength="1" />
              <path
                class="withdrawal-visual__route withdrawal-visual__route--bottom"
                d="M262 485 H444 Q468 485 468 461 V404"
                pathLength="1" />
              <path
                class="withdrawal-visual__route withdrawal-visual__route--right"
                d="M515 215 H573 Q597 215 597 239 V420 Q597 444 573 444 H507"
                pathLength="1" />
              <path
                class="withdrawal-visual__arrow-route withdrawal-visual__arrow-route--top"
                d="M405 221 C458 188 497 168 542 154"
                pathLength="1" />
              <path
                class="withdrawal-visual__arrow-route withdrawal-visual__arrow-route--middle"
                d="M405 300 C456 300 503 300 548 302"
                pathLength="1" />
              <path
                class="withdrawal-visual__arrow-route withdrawal-visual__arrow-route--bottom"
                d="M405 379 C456 408 499 431 540 454"
                pathLength="1" />
            </svg>

            <span
              class="withdrawal-visual__haze withdrawal-visual__haze--blue"
              aria-hidden="true" />
            <span
              class="withdrawal-visual__haze withdrawal-visual__haze--orange"
              aria-hidden="true" />

            <span
              class="withdrawal-visual__request-card"
              aria-hidden="true">
              <span class="withdrawal-visual__request-avatar">
                <span />
              </span>
              <span class="withdrawal-visual__request-rows">
                <span>
                  <i />
                  <b />
                </span>
                <span>
                  <i />
                  <b />
                </span>
                <span>
                  <i />
                  <b />
                </span>
              </span>
              <span class="withdrawal-visual__request-check" />
            </span>

            <span
              class="withdrawal-visual__shield-object"
              aria-hidden="true">
              <svg viewBox="0 0 126 144">
                <path
                  class="withdrawal-visual__shield-glass"
                  d="M63 9 111 30v38c0 35-20 57-48 68-28-11-48-33-48-68V30L63 9Z" />
                <path
                  class="withdrawal-visual__shield-edge"
                  d="M63 18 101 35v32c0 28-15 46-38 56-23-10-38-28-38-56V35L63 18Z" />
                <path
                  class="withdrawal-visual__shield-check"
                  d="m39 73 19 20 36-45" />
              </svg>
            </span>

            <span
              class="withdrawal-visual__card withdrawal-visual__card--document"
              aria-hidden="true">
              <svg viewBox="0 0 76 88">
                <path d="M15 8h32l14 15v57H15z" />
                <path d="M47 8v17h14M26 37h21M26 51h17" />
                <path d="m39 67 8 8 15-19" />
              </svg>
            </span>

            <span
              class="withdrawal-visual__card withdrawal-visual__card--clock"
              aria-hidden="true">
              <svg viewBox="0 0 92 92">
                <path d="M13 67h38M13 52h27M13 37h19" />
                <path d="M45 12a34 34 0 1 1-19 62" />
                <path d="M45 27v22l15 9" />
              </svg>
            </span>

            <span
              class="withdrawal-visual__card withdrawal-visual__card--bank"
              aria-hidden="true">
              <svg viewBox="0 0 92 82">
                <path d="M12 30 46 10l34 20H12Z" />
                <path d="M20 34v28M35 34v28M50 34v28M65 34v28M12 66h68" />
              </svg>
            </span>

            <span
              class="withdrawal-visual__card withdrawal-visual__card--payment"
              aria-hidden="true">
              <svg viewBox="0 0 104 68">
                <path d="M9 15h86v45H9z" />
                <path d="M9 28h86M23 43h20" />
                <circle
                  cx="70"
                  cy="47"
                  r="8" />
                <circle
                  cx="82"
                  cy="47"
                  r="8" />
              </svg>
            </span>

            <span
              class="withdrawal-visual__card withdrawal-visual__card--profile"
              aria-hidden="true">
              <svg viewBox="0 0 78 84">
                <circle
                  cx="39"
                  cy="26"
                  r="15" />
                <path d="M12 75c4-19 16-29 27-29s23 10 27 29" />
              </svg>
            </span>

            <img
              class="withdrawal-visual__wallet"
              :src="assetPath('wallet-raster.png')"
              alt=""
              aria-hidden="true"
              width="252"
              height="228"
              loading="eager" />
            <span
              class="withdrawal-visual__wallet-shadow"
              aria-hidden="true" />

            <span
              class="withdrawal-visual__coin withdrawal-visual__coin--usdt"
              aria-hidden="true">
              <span>T</span>
            </span>
            <span
              class="withdrawal-visual__coin withdrawal-visual__coin--btc"
              aria-hidden="true">
              <span>₿</span>
            </span>
            <span
              class="withdrawal-visual__coin withdrawal-visual__coin--eth"
              aria-hidden="true">
              <span>◆</span>
            </span>
          </div>
        </div>
      </section>

      <section
        class="withdrawal-benefits"
        :aria-label="copy.benefitsLabel">
        <article
          v-for="item in copy.benefits"
          :key="item.title">
          <img
            :src="assetPath(item.icon)"
            alt=""
            aria-hidden="true"
            loading="lazy" />
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </article>
      </section>

      <section class="withdrawal-methods">
        <div class="section-head">
          <span class="section-kicker">{{ copy.methods.eyebrow }}</span>
          <h2>{{ copy.methods.title }}</h2>
          <p>{{ copy.methods.text }}</p>
        </div>

        <div class="method-grid">
          <article
            v-for="method in copy.methods.items"
            :key="method.name"
            class="method-card">
            <span class="method-card__ghost">{{ method.asset }}</span>
            <div class="method-card__title">
              <h3>{{ method.name }}</h3>
              <span
                class="method-card__title-orbs"
                aria-hidden="true">
                <span class="method-card__title-orb method-card__title-orb--solid" />
                <span class="method-card__title-orb method-card__title-orb--glow" />
              </span>
            </div>

            <dl>
              <div>
                <dt>
                  <img
                    :src="assetPath('network-analytic.svg')"
                    alt=""
                    aria-hidden="true"
                    loading="lazy" />
                  {{ copy.methods.labels.network }}:
                </dt>
                <dd>{{ method.network }}</dd>
              </div>
              <div>
                <dt>
                  <img
                    :src="assetPath('coin.svg')"
                    alt=""
                    aria-hidden="true"
                    loading="lazy" />
                  {{ copy.methods.labels.asset }}:
                </dt>
                <dd>{{ method.asset }}</dd>
              </div>
              <div class="method-card__wide">
                <dt>
                  <img
                    :src="assetPath('payment-security.svg')"
                    alt=""
                    aria-hidden="true"
                    loading="lazy" />
                  {{ copy.methods.labels.crediting }}:
                </dt>
                <dd>{{ method.crediting }}</dd>
              </div>
            </dl>

            <p>{{ method.note }}</p>
          </article>
        </div>
      </section>

      <section class="withdrawal-flow">
        <div class="section-head">
          <span class="section-kicker">{{ copy.flow.eyebrow }}</span>
          <h2>{{ copy.flow.title }}</h2>
          <p>{{ copy.flow.text }}</p>
        </div>

        <ol class="flow-steps">
          <li
            v-for="(step, index) in copy.flow.steps"
            :key="step.title">
            <div class="flow-step-number">
              <span class="flow-step-number__orb flow-step-number__orb--solid" />
              <span class="flow-step-number__orb flow-step-number__orb--glow" />
              <span>{{ index + 1 }}</span>
            </div>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="withdrawal-details">
        <div class="section-head">
          <span class="section-kicker">{{ copy.details.eyebrow }}</span>
          <h2>{{ copy.details.title }}</h2>
          <a
            class="withdrawal-button"
            :href="withdrawalHref">
            {{ copy.details.actionText }}
            <span aria-hidden="true"></span>
          </a>
        </div>

        <ul>
          <li
            v-for="item in copy.details.items"
            :key="item">
            <span aria-hidden="true"></span>
            <p>{{ item }}</p>
          </li>
        </ul>
      </section>
    </main>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useHead } from "nuxt/app";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import useCabinetLink from "~/composables/useCabinetLink";

  type IconTextItem = {
    icon: string;
    text: string;
  };

  type BenefitItem = IconTextItem & {
    title: string;
  };

  type PaymentMethod = {
    name: string;
    asset: string;
    network: string;
    crediting: string;
    note: string;
  };

  type WithdrawalCopy = {
    hero: {
      eyebrow: string;
      title: string;
      text: string;
      imageAlt: string;
      badges: IconTextItem[];
    };
    benefitsLabel: string;
    benefits: BenefitItem[];
    methods: {
      eyebrow: string;
      title: string;
      text: string;
      labels: {
        network: string;
        asset: string;
        crediting: string;
      };
      items: PaymentMethod[];
    };
    flow: {
      eyebrow: string;
      title: string;
      text: string;
      steps: Array<{
        title: string;
        text: string;
      }>;
    };
    details: {
      eyebrow: string;
      title: string;
      actionText: string;
      items: string[];
    };
  };

  const ASSET_BASE = "/static/withdrawal-of-funds/";

  const assetPath = (name: string): string => `${ASSET_BASE}${name}`;

  const pageRef = ref<HTMLElement | null>(null);
  const { locale } = useI18n();
  const { cabinetLink } = useCabinetLink();

  useHead({
    bodyAttrs: {
      class: "withdrawal-of-funds-route",
    },
  });

  const localizedCopy: Record<string, WithdrawalCopy> = {};

  type WithdrawalStrings = {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
    heroImageAlt: string;
    heroBadges: string[];
    benefitsLabel: string;
    benefits: Array<{
      title: string;
      text: string;
    }>;
    methodsEyebrow: string;
    methodsTitle: string;
    methodsText: string;
    labels: {
      network: string;
      asset: string;
      crediting: string;
    };
    methodNetworks: string[];
    methodTransfer: string;
    methodNotes: string[];
    flowEyebrow: string;
    flowTitle: string;
    flowText: string;
    steps: Array<{
      title: string;
      text: string;
    }>;
    detailsEyebrow: string;
    detailsTitle: string;
    detailsActionText: string;
    detailsItems: string[];
  };

  const withdrawalMethodBase = [
    { name: "USDT TRC-20", asset: "USDT" },
    { name: "USDT ERC-20", asset: "USDT" },
    { name: "USDC", asset: "USDC" },
    { name: "BTC", asset: "BTC" },
  ];

  const createWithdrawalCopy = (strings: WithdrawalStrings): WithdrawalCopy => ({
    hero: {
      eyebrow: strings.heroEyebrow,
      title: strings.heroTitle,
      text: strings.heroText,
      imageAlt: strings.heroImageAlt,
      badges: [
        { icon: "payment-security.svg", text: strings.heroBadges[0] },
        { icon: "crypto.svg", text: strings.heroBadges[1] },
        { icon: "web.svg", text: strings.heroBadges[2] },
      ],
    },
    benefitsLabel: strings.benefitsLabel,
    benefits: strings.benefits.map((item, index) => ({
      ...item,
      icon: ["shield-trust.svg", "usd-circle.svg", "payment-security.svg"][index],
    })),
    methods: {
      eyebrow: strings.methodsEyebrow,
      title: strings.methodsTitle,
      text: strings.methodsText,
      labels: strings.labels,
      items: withdrawalMethodBase.map((method, index) => ({
        ...method,
        network: strings.methodNetworks[index],
        crediting: strings.methodTransfer,
        note: strings.methodNotes[index],
      })),
    },
    flow: {
      eyebrow: strings.flowEyebrow,
      title: strings.flowTitle,
      text: strings.flowText,
      steps: strings.steps,
    },
    details: {
      eyebrow: strings.detailsEyebrow,
      title: strings.detailsTitle,
      actionText: strings.detailsActionText,
      items: strings.detailsItems,
    },
  });

  const withdrawalStrings: Record<string, WithdrawalStrings> = {
    en: {
      heroEyebrow: "Trading conditions",
      heroTitle: "Withdrawal of funds",
      heroText:
        "Withdrawals are requested from the cabinet and reviewed by finance before a crypto transfer is sent. Use the same four supported crypto rails for withdrawal details.",
      heroImageAlt: "Ester withdrawal request and crypto transfer interface",
      heroBadges: ["Manual finance approval", "4 crypto methods", "From minutes to 3 banking days"],
      benefitsLabel: "Withdrawal benefits",
      benefits: [
        {
          title: "Approval first",
          text: "A withdrawal request is checked before funds are sent; this protects balances and keeps finance operations controlled.",
        },
        {
          title: "Crypto transfer",
          text: "The receiving wallet must support the exact asset and network selected in the cabinet.",
        },
        {
          title: "Processing time",
          text: "After review, processing can take from a few minutes to 3 banking days depending on checks and network state.",
        },
      ],
      methodsEyebrow: "Available withdrawal methods",
      methodsTitle: "Withdraw through the same supported crypto rails",
      methodsText:
        "The cabinet collects wallet details and shows the exact payment method. Use only wallets that support the selected network.",
      labels: { network: "Network", asset: "Asset", crediting: "Transfer" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Network shown in the cabinet", "Bitcoin"],
      methodTransfer: "After finance approval",
      methodNotes: [
        "Enter only a wallet that accepts USDT on TRC20.",
        "Enter only an Ethereum wallet that accepts ERC20 USDT.",
        "Use the USDC network shown in the withdrawal form.",
        "Enter only a valid Bitcoin wallet address.",
      ],
      flowEyebrow: "Withdrawal flow",
      flowTitle: "From request to outgoing transfer",
      flowText:
        "The finance team reviews the request, checks details and then processes the payout through the selected crypto method.",
      steps: [
        {
          title: "Open the cabinet",
          text: "Log in and check that verification status allows finance operations.",
        },
        {
          title: "Create a withdrawal request",
          text: "Choose the trading account, amount and one of the available crypto methods.",
        },
        {
          title: "Enter wallet details",
          text: "Add the address for the exact network and review all details before submitting.",
        },
        {
          title: "Wait for finance approval",
          text: "The team checks account status, request details and possible additional verification needs.",
        },
        {
          title: "Receive the transfer",
          text: "After approval the payout is sent, and final arrival depends on blockchain confirmations.",
        },
      ],
      detailsEyebrow: "Important details",
      detailsTitle: "What can affect withdrawal processing",
      detailsActionText: "Open withdrawals in cabinet",
      detailsItems: [
        "Incorrect wallet or network details can delay the payout or make it unrecoverable.",
        "Additional verification can be requested before finance approval.",
        "The cabinet shows the active payment method, limits and request status.",
        "Blockchain load can affect the final time until funds appear in the receiving wallet.",
      ],
    },
    uk: {
      heroEyebrow: "Умови торгівлі",
      heroTitle: "Виведення коштів",
      heroText:
        "Виведення створюється в кабінеті та проходить фінансову перевірку перед криптопереказом. Для виведення використовуйте ті самі чотири підтримувані криптометоди.",
      heroImageAlt: "Інтерфейс заявки на виведення та криптопереказу Ester",
      heroBadges: ["Ручне погодження фінансів", "4 криптометоди", "Від хвилин до 3 банківських днів"],
      benefitsLabel: "Переваги виведення коштів",
      benefits: [
        {
          title: "Спочатку погодження",
          text: "Заявка перевіряється до відправки коштів; це захищає баланс і тримає фінансові операції під контролем.",
        },
        {
          title: "Криптопереказ",
          text: "Гаманець отримувача має підтримувати точний актив і мережу, вибрані в кабінеті.",
        },
        {
          title: "Строк обробки",
          text: "Після перевірки обробка може займати від кількох хвилин до 3 банківських днів.",
        },
      ],
      methodsEyebrow: "Доступні методи виведення",
      methodsTitle: "Виводьте через ті самі підтримувані криптометоди",
      methodsText:
        "Кабінет збирає реквізити гаманця та показує точний метод. Використовуйте лише гаманці, що підтримують вибрану мережу.",
      labels: { network: "Мережа", asset: "Актив", crediting: "Переказ" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Мережа з кабінету", "Bitcoin"],
      methodTransfer: "Після погодження фінансів",
      methodNotes: [
        "Вказуйте тільки гаманець, що приймає USDT у TRC20.",
        "Вказуйте тільки Ethereum-гаманець, що приймає ERC20 USDT.",
        "Використовуйте мережу USDC, яку показує форма виведення.",
        "Вказуйте лише валідну Bitcoin-адресу.",
      ],
      flowEyebrow: "Флоу виведення",
      flowTitle: "Від заявки до вихідного переказу",
      flowText:
        "Фінансова команда перевіряє заявку, реквізити й після цього обробляє виплату через вибраний криптометод.",
      steps: [
        {
          title: "Відкрийте кабінет",
          text: "Увійдіть і перевірте, що статус верифікації дозволяє фінансові операції.",
        },
        {
          title: "Створіть заявку на виведення",
          text: "Оберіть торговий рахунок, суму та один із доступних криптометодів.",
        },
        {
          title: "Вкажіть реквізити гаманця",
          text: "Додайте адресу для точної мережі та перевірте всі деталі перед відправкою.",
        },
        {
          title: "Дочекайтеся погодження фінансів",
          text: "Команда перевіряє статус рахунку, деталі заявки та можливу потребу в додатковій верифікації.",
        },
        {
          title: "Отримайте переказ",
          text: "Після погодження виплата відправляється, а фінальне надходження залежить від підтверджень мережі.",
        },
      ],
      detailsEyebrow: "Важливі деталі",
      detailsTitle: "Що може вплинути на обробку виведення",
      detailsActionText: "Відкрити виведення в кабінеті",
      detailsItems: [
        "Некоректний гаманець або мережа можуть затримати виплату або зробити її невідновлюваною.",
        "Перед погодженням фінансів може знадобитися додаткова верифікація.",
        "Кабінет показує активний метод, ліміти та статус заявки.",
        "Завантаження блокчейну може впливати на час надходження коштів на гаманець.",
      ],
    },
    ru: {
      heroEyebrow: "Условия торговли",
      heroTitle: "Вывод средств",
      heroText:
        "Вывод создается в кабинете и проходит финансовую проверку перед криптопереводом. Для вывода используйте те же четыре поддерживаемые криптометода.",
      heroImageAlt: "Интерфейс заявки на вывод и криптоперевода Ester",
      heroBadges: ["Ручное согласование финансов", "4 криптометода", "От минут до 3 банковских дней"],
      benefitsLabel: "Преимущества вывода средств",
      benefits: [
        {
          title: "Сначала согласование",
          text: "Заявка проверяется до отправки средств; это защищает баланс и держит финансовые операции под контролем.",
        },
        {
          title: "Криптоперевод",
          text: "Кошелек получателя должен поддерживать точный актив и сеть, выбранные в кабинете.",
        },
        {
          title: "Срок обработки",
          text: "После проверки обработка может занимать от нескольких минут до 3 банковских дней.",
        },
      ],
      methodsEyebrow: "Доступные методы вывода",
      methodsTitle: "Выводите через те же поддерживаемые криптометоды",
      methodsText:
        "Кабинет собирает реквизиты кошелька и показывает точный метод. Используйте только кошельки, поддерживающие выбранную сеть.",
      labels: { network: "Сеть", asset: "Актив", crediting: "Перевод" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Сеть из кабинета", "Bitcoin"],
      methodTransfer: "После согласования финансов",
      methodNotes: [
        "Указывайте только кошелек, который принимает USDT в TRC20.",
        "Указывайте только Ethereum-кошелек, который принимает ERC20 USDT.",
        "Используйте сеть USDC, которую показывает форма вывода.",
        "Указывайте только валидный Bitcoin-адрес.",
      ],
      flowEyebrow: "Флоу вывода",
      flowTitle: "От заявки до исходящего перевода",
      flowText:
        "Финансовая команда проверяет заявку, реквизиты и после этого обрабатывает выплату через выбранный криптометод.",
      steps: [
        {
          title: "Откройте кабинет",
          text: "Войдите и проверьте, что статус верификации позволяет финансовые операции.",
        },
        {
          title: "Создайте заявку на вывод",
          text: "Выберите торговый счет, сумму и один из доступных криптометодов.",
        },
        {
          title: "Укажите реквизиты кошелька",
          text: "Добавьте адрес для точной сети и проверьте все детали перед отправкой.",
        },
        {
          title: "Дождитесь согласования финансов",
          text: "Команда проверяет статус счета, детали заявки и возможную необходимость дополнительной верификации.",
        },
        {
          title: "Получите перевод",
          text: "После согласования выплата отправляется, а финальное поступление зависит от подтверждений сети.",
        },
      ],
      detailsEyebrow: "Важные детали",
      detailsTitle: "Что может повлиять на обработку вывода",
      detailsActionText: "Открыть вывод в кабинете",
      detailsItems: [
        "Некорректный кошелек или сеть могут задержать выплату или сделать ее невосстановимой.",
        "Перед согласованием финансов может понадобиться дополнительная верификация.",
        "Кабинет показывает активный метод, лимиты и статус заявки.",
        "Загрузка блокчейна может влиять на время поступления средств на кошелек.",
      ],
    },
    de: {
      heroEyebrow: "Handelsbedingungen",
      heroTitle: "Auszahlung von Geldern",
      heroText:
        "Auszahlungen werden im Kundenbereich beantragt und vor dem Kryptotransfer vom Finanzteam geprüft. Nutzen Sie dieselben vier unterstützten Krypto-Zahlungswege.",
      heroImageAlt: "Ester Oberfläche für Auszahlungsanfrage und Kryptotransfer",
      heroBadges: ["Manuelle Finanzfreigabe", "4 Kryptomethoden", "Von Minuten bis zu 3 Banktagen"],
      benefitsLabel: "Vorteile der Auszahlung",
      benefits: [
        {
          title: "Freigabe zuerst",
          text: "Die Anfrage wird vor dem Versand geprüft; das schützt Salden und hält Finanzvorgänge kontrolliert.",
        },
        {
          title: "Krypto-Transfer",
          text: "Die Empfangswallet muss exakt den im Kundenbereich gewählten Vermögenswert und das Netzwerk unterstützen.",
        },
        {
          title: "Bearbeitungszeit",
          text: "Nach der Prüfung kann die Bearbeitung je nach Checks und Netzwerklage wenige Minuten bis 3 Banktage dauern.",
        },
      ],
      methodsEyebrow: "Verfügbare Auszahlungsmethoden",
      methodsTitle: "Zahlen Sie über dieselben unterstützten Krypto-Zahlungswege aus",
      methodsText:
        "Der Kundenbereich erfasst die Wallet-Daten und zeigt die genaue Methode. Verwenden Sie nur Wallets, die das gewählte Netzwerk unterstützen.",
      labels: { network: "Netzwerk", asset: "Asset", crediting: "Transfer" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Im Kundenbereich angezeigtes Netzwerk", "Bitcoin"],
      methodTransfer: "Nach Finanzfreigabe",
      methodNotes: [
        "Geben Sie nur eine Wallet an, die USDT auf TRC20 akzeptiert.",
        "Geben Sie nur eine Ethereum-Wallet an, die ERC20 USDT akzeptiert.",
        "Verwenden Sie das USDC-Netzwerk, das im Auszahlungsformular angezeigt wird.",
        "Geben Sie nur eine gültige Bitcoin-Wallet-Adresse an.",
      ],
      flowEyebrow: "Auszahlungsablauf",
      flowTitle: "Von der Anfrage zur ausgehenden Überweisung",
      flowText:
        "Das Finanzteam prüft die Anfrage und Details und verarbeitet danach die Auszahlung über die gewählte Kryptomethode.",
      steps: [
        {
          title: "Kundenbereich öffnen",
          text: "Melden Sie sich an und prüfen Sie, ob Ihr Verifizierungsstatus Finanzvorgänge erlaubt.",
        },
        {
          title: "Auszahlungsanfrage erstellen",
          text: "Wählen Sie Handelskonto, Betrag und eine der verfügbaren Kryptomethoden.",
        },
        {
          title: "Wallet-Daten eingeben",
          text: "Fügen Sie die Adresse für das genaue Netzwerk hinzu und prüfen Sie alle Details vor dem Absenden.",
        },
        {
          title: "Auf Finanzfreigabe warten",
          text: "Das Team prüft Kontostatus, Anfragedetails und mögliche zusätzliche Verifizierungsanforderungen.",
        },
        {
          title: "Transfer erhalten",
          text: "Nach der Freigabe wird die Auszahlung gesendet; der endgültige Eingang hängt von Blockchain-Bestätigungen ab.",
        },
      ],
      detailsEyebrow: "Wichtige Details",
      detailsTitle: "Was die Auszahlung beeinflussen kann",
      detailsActionText: "Auszahlungen im Kundenbereich öffnen",
      detailsItems: [
        "Falsche Wallet- oder Netzwerkdaten können die Auszahlung verzögern oder unwiederbringlich machen.",
        "Vor der Finanzfreigabe kann eine zusätzliche Verifizierung angefordert werden.",
        "Der Kundenbereich zeigt aktive Methode, Limits und Status der Anfrage.",
        "Blockchain-Auslastung kann beeinflussen, wann Gelder in der Empfangswallet erscheinen.",
      ],
    },
    es: {
      heroEyebrow: "Condiciones de trading",
      heroTitle: "Retiro de fondos",
      heroText:
        "Los retiros se solicitan desde el gabinete y finanzas los revisa antes de enviar la transferencia cripto. Use los mismos cuatro métodos cripto admitidos.",
      heroImageAlt: "Interfaz de solicitud de retiro y transferencia cripto de Ester",
      heroBadges: ["Aprobación manual de finanzas", "4 métodos cripto", "De minutos a 3 días bancarios"],
      benefitsLabel: "Ventajas del retiro",
      benefits: [
        {
          title: "Aprobación primero",
          text: "La solicitud se revisa antes de enviar fondos; esto protege los saldos y mantiene controladas las operaciones financieras.",
        },
        {
          title: "Transferencia cripto",
          text: "La wallet receptora debe admitir exactamente el activo y la red seleccionados en el gabinete.",
        },
        {
          title: "Tiempo de proceso",
          text: "Tras la revisión, el proceso puede tardar desde unos minutos hasta 3 días bancarios según las comprobaciones y la red.",
        },
      ],
      methodsEyebrow: "Métodos de retiro disponibles",
      methodsTitle: "Retire mediante los mismos métodos cripto admitidos",
      methodsText:
        "El gabinete recopila los datos de la wallet y muestra el método exacto. Use solo wallets compatibles con la red seleccionada.",
      labels: { network: "Red", asset: "Activo", crediting: "Transferencia" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Red mostrada en el gabinete", "Bitcoin"],
      methodTransfer: "Tras aprobación de finanzas",
      methodNotes: [
        "Ingrese solo una wallet que acepte USDT en TRC20.",
        "Ingrese solo una wallet Ethereum que acepte ERC20 USDT.",
        "Use la red USDC mostrada en el formulario de retiro.",
        "Ingrese solo una dirección Bitcoin válida.",
      ],
      flowEyebrow: "Flujo de retiro",
      flowTitle: "De la solicitud a la transferencia saliente",
      flowText:
        "El equipo financiero revisa la solicitud, comprueba los detalles y luego procesa el pago mediante el método cripto elegido.",
      steps: [
        {
          title: "Abra el gabinete",
          text: "Inicie sesión y compruebe que el estado de verificación permite operaciones financieras.",
        },
        {
          title: "Cree una solicitud de retiro",
          text: "Elija la cuenta de trading, el importe y uno de los métodos cripto disponibles.",
        },
        {
          title: "Introduzca datos de wallet",
          text: "Añada la dirección para la red exacta y revise todos los detalles antes de enviar.",
        },
        {
          title: "Espere aprobación financiera",
          text: "El equipo revisa el estado de cuenta, los detalles de la solicitud y posibles verificaciones adicionales.",
        },
        {
          title: "Reciba la transferencia",
          text: "Tras la aprobación se envía el pago; la llegada final depende de las confirmaciones blockchain.",
        },
      ],
      detailsEyebrow: "Detalles importantes",
      detailsTitle: "Qué puede afectar el procesamiento del retiro",
      detailsActionText: "Abrir retiros en el gabinete",
      detailsItems: [
        "Una wallet o red incorrecta puede retrasar el pago o hacerlo irrecuperable.",
        "Puede solicitarse verificación adicional antes de la aprobación financiera.",
        "El gabinete muestra el método activo, los límites y el estado de la solicitud.",
        "La carga de la blockchain puede afectar el tiempo final de llegada a la wallet receptora.",
      ],
    },
    fr: {
      heroEyebrow: "Conditions de trading",
      heroTitle: "Retrait de fonds",
      heroText:
        "Les retraits sont demandés depuis l'espace client et vérifiés par la finance avant l'envoi du transfert crypto. Utilisez les quatre rails crypto pris en charge.",
      heroImageAlt: "Interface Ester de demande de retrait et de transfert crypto",
      heroBadges: ["Validation manuelle finance", "4 méthodes crypto", "De quelques minutes à 3 jours bancaires"],
      benefitsLabel: "Avantages du retrait",
      benefits: [
        {
          title: "Validation d'abord",
          text: "La demande est vérifiée avant l'envoi des fonds afin de protéger les soldes et contrôler les opérations financières.",
        },
        {
          title: "Transfert crypto",
          text: "Le wallet de réception doit prendre en charge l'actif et le réseau exacts sélectionnés dans l'espace client.",
        },
        {
          title: "Délai de traitement",
          text: "Après vérification, le traitement peut prendre de quelques minutes à 3 jours bancaires selon les contrôles et le réseau.",
        },
      ],
      methodsEyebrow: "Méthodes de retrait disponibles",
      methodsTitle: "Retirez via les mêmes rails crypto pris en charge",
      methodsText:
        "L'espace client collecte les détails du wallet et affiche la méthode exacte. Utilisez uniquement des wallets compatibles avec le réseau choisi.",
      labels: { network: "Réseau", asset: "Actif", crediting: "Transfert" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Réseau indiqué dans l'espace client", "Bitcoin"],
      methodTransfer: "Après validation finance",
      methodNotes: [
        "Indiquez uniquement un wallet acceptant l'USDT sur TRC20.",
        "Indiquez uniquement un wallet Ethereum acceptant l'ERC20 USDT.",
        "Utilisez le réseau USDC indiqué dans le formulaire de retrait.",
        "Indiquez uniquement une adresse Bitcoin valide.",
      ],
      flowEyebrow: "Flux de retrait",
      flowTitle: "De la demande au transfert sortant",
      flowText:
        "L'équipe finance vérifie la demande et les détails, puis traite le paiement via la méthode crypto sélectionnée.",
      steps: [
        {
          title: "Ouvrir l'espace client",
          text: "Connectez-vous et vérifiez que votre statut permet les opérations financières.",
        },
        {
          title: "Créer une demande de retrait",
          text: "Choisissez le compte de trading, le montant et l'une des méthodes crypto disponibles.",
        },
        {
          title: "Saisir les détails du wallet",
          text: "Ajoutez l'adresse du réseau exact et vérifiez tous les détails avant l'envoi.",
        },
        {
          title: "Attendre la validation finance",
          text: "L'équipe vérifie le statut du compte, les détails de la demande et les besoins éventuels de vérification.",
        },
        {
          title: "Recevoir le transfert",
          text: "Après validation, le paiement est envoyé; l'arrivée finale dépend des confirmations blockchain.",
        },
      ],
      detailsEyebrow: "Détails importants",
      detailsTitle: "Ce qui peut affecter le traitement du retrait",
      detailsActionText: "Ouvrir les retraits dans l'espace client",
      detailsItems: [
        "Un wallet ou réseau incorrect peut retarder le paiement ou le rendre irrécupérable.",
        "Une vérification supplémentaire peut être demandée avant la validation finance.",
        "L'espace client affiche la méthode active, les limites et le statut de la demande.",
        "La charge de la blockchain peut affecter le délai d'arrivée des fonds.",
      ],
    },
    it: {
      heroEyebrow: "Condizioni di trading",
      heroTitle: "Prelievo di fondi",
      heroText:
        "I prelievi vengono richiesti dall'area personale e controllati dalla finanza prima dell'invio del trasferimento crypto. Usa gli stessi quattro canali crypto supportati.",
      heroImageAlt: "Interfaccia Ester per richiesta di prelievo e trasferimento crypto",
      heroBadges: ["Approvazione manuale finance", "4 metodi crypto", "Da minuti a 3 giorni bancari"],
      benefitsLabel: "Vantaggi del prelievo",
      benefits: [
        {
          title: "Prima approvazione",
          text: "La richiesta viene controllata prima dell'invio dei fondi; questo protegge i saldi e mantiene controllate le operazioni finanziarie.",
        },
        {
          title: "Trasferimento crypto",
          text: "Il wallet ricevente deve supportare esattamente asset e rete selezionati nell'area personale.",
        },
        {
          title: "Tempo di elaborazione",
          text: "Dopo la revisione, l'elaborazione può richiedere da pochi minuti a 3 giorni bancari in base a controlli e rete.",
        },
      ],
      methodsEyebrow: "Metodi di prelievo disponibili",
      methodsTitle: "Preleva tramite gli stessi canali crypto supportati",
      methodsText:
        "L'area personale raccoglie i dati del wallet e mostra il metodo esatto. Usa solo wallet compatibili con la rete selezionata.",
      labels: { network: "Rete", asset: "Asset", crediting: "Trasferimento" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Rete mostrata nell'area personale", "Bitcoin"],
      methodTransfer: "Dopo approvazione finance",
      methodNotes: [
        "Inserisci solo un wallet che accetta USDT su TRC20.",
        "Inserisci solo un wallet Ethereum che accetta ERC20 USDT.",
        "Usa la rete USDC mostrata nel modulo di prelievo.",
        "Inserisci solo un indirizzo Bitcoin valido.",
      ],
      flowEyebrow: "Flusso di prelievo",
      flowTitle: "Dalla richiesta al trasferimento in uscita",
      flowText:
        "Il team finance controlla la richiesta, verifica i dettagli e poi processa il pagamento con il metodo crypto scelto.",
      steps: [
        {
          title: "Apri l'area personale",
          text: "Accedi e verifica che lo stato di verifica consenta operazioni finanziarie.",
        },
        {
          title: "Crea una richiesta di prelievo",
          text: "Scegli il conto di trading, l'importo e uno dei metodi crypto disponibili.",
        },
        {
          title: "Inserisci i dettagli del wallet",
          text: "Aggiungi l'indirizzo per la rete esatta e controlla tutti i dettagli prima dell'invio.",
        },
        {
          title: "Attendi l'approvazione finance",
          text: "Il team controlla stato del conto, dettagli della richiesta ed eventuali verifiche aggiuntive.",
        },
        {
          title: "Ricevi il trasferimento",
          text: "Dopo l'approvazione il pagamento viene inviato; l'arrivo finale dipende dalle conferme blockchain.",
        },
      ],
      detailsEyebrow: "Dettagli importanti",
      detailsTitle: "Cosa può influire sull'elaborazione del prelievo",
      detailsActionText: "Apri i prelievi nell'area personale",
      detailsItems: [
        "Wallet o rete errati possono ritardare il pagamento o renderlo irrecuperabile.",
        "Prima dell'approvazione finance può essere richiesta una verifica aggiuntiva.",
        "L'area personale mostra metodo attivo, limiti e stato della richiesta.",
        "Il carico della blockchain può influire sul tempo di arrivo dei fondi.",
      ],
    },
    pt: {
      heroEyebrow: "Condições de negociação",
      heroTitle: "Retirada de fundos",
      heroText:
        "As retiradas são solicitadas no gabinete e revisadas pelo financeiro antes do envio da transferência cripto. Use os mesmos quatro métodos cripto suportados.",
      heroImageAlt: "Interface Ester de solicitação de retirada e transferência cripto",
      heroBadges: ["Aprovação manual do financeiro", "4 métodos cripto", "De minutos a 3 dias bancários"],
      benefitsLabel: "Benefícios da retirada",
      benefits: [
        {
          title: "Aprovação primeiro",
          text: "A solicitação é verificada antes do envio dos fundos; isso protege saldos e mantém as operações financeiras controladas.",
        },
        {
          title: "Transferência cripto",
          text: "A carteira de destino deve aceitar exatamente o ativo e a rede selecionados no gabinete.",
        },
        {
          title: "Tempo de processamento",
          text: "Após a revisão, o processamento pode levar de alguns minutos a 3 dias bancários conforme verificações e rede.",
        },
      ],
      methodsEyebrow: "Métodos de retirada disponíveis",
      methodsTitle: "Retire pelos mesmos métodos cripto suportados",
      methodsText:
        "O gabinete coleta os dados da carteira e mostra o método exato. Use apenas carteiras compatíveis com a rede selecionada.",
      labels: { network: "Rede", asset: "Ativo", crediting: "Transferência" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Rede mostrada no gabinete", "Bitcoin"],
      methodTransfer: "Após aprovação financeira",
      methodNotes: [
        "Informe apenas uma carteira que aceite USDT em TRC20.",
        "Informe apenas uma carteira Ethereum que aceite ERC20 USDT.",
        "Use a rede USDC mostrada no formulário de retirada.",
        "Informe apenas um endereço Bitcoin válido.",
      ],
      flowEyebrow: "Fluxo de retirada",
      flowTitle: "Da solicitação à transferência enviada",
      flowText:
        "A equipe financeira revisa a solicitação, verifica os detalhes e processa o pagamento pelo método cripto escolhido.",
      steps: [
        {
          title: "Abra o gabinete",
          text: "Entre e verifique se o status de verificação permite operações financeiras.",
        },
        {
          title: "Crie uma solicitação de retirada",
          text: "Escolha a conta de negociação, o valor e um dos métodos cripto disponíveis.",
        },
        {
          title: "Informe os dados da carteira",
          text: "Adicione o endereço da rede exata e revise todos os detalhes antes de enviar.",
        },
        {
          title: "Aguarde aprovação financeira",
          text: "A equipe verifica status da conta, detalhes da solicitação e possíveis verificações adicionais.",
        },
        {
          title: "Receba a transferência",
          text: "Após a aprovação, o pagamento é enviado; a chegada final depende das confirmações blockchain.",
        },
      ],
      detailsEyebrow: "Detalhes importantes",
      detailsTitle: "O que pode afetar o processamento da retirada",
      detailsActionText: "Abrir retiradas no gabinete",
      detailsItems: [
        "Carteira ou rede incorreta pode atrasar o pagamento ou torná-lo irrecuperável.",
        "Verificação adicional pode ser solicitada antes da aprovação financeira.",
        "O gabinete mostra método ativo, limites e status da solicitação.",
        "A carga da blockchain pode afetar o tempo final até os fundos chegarem.",
      ],
    },
    tr: {
      heroEyebrow: "İşlem koşulları",
      heroTitle: "Para çekme",
      heroText:
        "Para çekme talepleri kabinden oluşturulur ve kripto transfer gönderilmeden önce finans ekibi tarafından incelenir. Aynı dört desteklenen kripto yöntemini kullanın.",
      heroImageAlt: "Ester para çekme talebi ve kripto transfer arayüzü",
      heroBadges: ["Manuel finans onayı", "4 kripto yöntemi", "Dakikalardan 3 banka gününe kadar"],
      benefitsLabel: "Para çekme avantajları",
      benefits: [
        {
          title: "Önce onay",
          text: "Talep, fonlar gönderilmeden önce kontrol edilir; bu bakiyeleri korur ve finans işlemlerini kontrollü tutar.",
        },
        {
          title: "Kripto transfer",
          text: "Alıcı cüzdan, kabinde seçilen tam varlığı ve ağı desteklemelidir.",
        },
        {
          title: "İşlem süresi",
          text: "İncelemeden sonra işlem, kontrollere ve ağ durumuna bağlı olarak birkaç dakikadan 3 banka gününe kadar sürebilir.",
        },
      ],
      methodsEyebrow: "Kullanılabilir para çekme yöntemleri",
      methodsTitle: "Aynı desteklenen kripto kanallarıyla para çekin",
      methodsText:
        "Kabin cüzdan bilgilerini toplar ve tam yöntemi gösterir. Yalnızca seçilen ağı destekleyen cüzdanları kullanın.",
      labels: { network: "Ağ", asset: "Varlık", crediting: "Transfer" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "Kabinde gösterilen ağ", "Bitcoin"],
      methodTransfer: "Finans onayından sonra",
      methodNotes: [
        "Yalnızca TRC20 üzerinde USDT kabul eden bir cüzdan girin.",
        "Yalnızca ERC20 USDT kabul eden bir Ethereum cüzdanı girin.",
        "Para çekme formunda gösterilen USDC ağını kullanın.",
        "Yalnızca geçerli bir Bitcoin cüzdan adresi girin.",
      ],
      flowEyebrow: "Para çekme akışı",
      flowTitle: "Talepten giden transfere",
      flowText: "Finans ekibi talebi ve ayrıntıları inceler, ardından ödemeyi seçilen kripto yöntemiyle işler.",
      steps: [
        {
          title: "Kabini açın",
          text: "Giriş yapın ve doğrulama durumunun finans işlemlerine izin verdiğini kontrol edin.",
        },
        {
          title: "Para çekme talebi oluşturun",
          text: "İşlem hesabını, tutarı ve mevcut kripto yöntemlerinden birini seçin.",
        },
        {
          title: "Cüzdan bilgilerini girin",
          text: "Tam ağ için adresi ekleyin ve göndermeden önce tüm ayrıntıları kontrol edin.",
        },
        {
          title: "Finans onayını bekleyin",
          text: "Ekip hesap durumunu, talep ayrıntılarını ve olası ek doğrulama ihtiyacını kontrol eder.",
        },
        {
          title: "Transferi alın",
          text: "Onaydan sonra ödeme gönderilir; nihai varış blockchain onaylarına bağlıdır.",
        },
      ],
      detailsEyebrow: "Önemli ayrıntılar",
      detailsTitle: "Para çekme işlemini neler etkileyebilir",
      detailsActionText: "Kabinde para çekmeyi aç",
      detailsItems: [
        "Yanlış cüzdan veya ağ bilgileri ödemeyi geciktirebilir ya da geri alınamaz hale getirebilir.",
        "Finans onayından önce ek doğrulama istenebilir.",
        "Kabin aktif yöntemi, limitleri ve talep durumunu gösterir.",
        "Blockchain yoğunluğu fonların alıcı cüzdanda görünme süresini etkileyebilir.",
      ],
    },
    he: {
      heroEyebrow: "תנאי מסחר",
      heroTitle: "משיכת כספים",
      heroText:
        "משיכות נפתחות באזור האישי ונבדקות על ידי צוות הכספים לפני שליחת העברת הקריפטו. השתמשו באותן ארבע שיטות קריפטו נתמכות.",
      heroImageAlt: "ממשק Ester לבקשת משיכה והעברת קריפטו",
      heroBadges: ["אישור ידני של צוות הכספים", "4 שיטות קריפטו", "מדקות עד 3 ימי בנק"],
      benefitsLabel: "יתרונות משיכת כספים",
      benefits: [
        {
          title: "אישור תחילה",
          text: "הבקשה נבדקת לפני שליחת הכספים; כך היתרות מוגנות והפעולות הפיננסיות נשארות מבוקרות.",
        },
        {
          title: "העברת קריפטו",
          text: "ארנק היעד חייב לתמוך בדיוק בנכס וברשת שנבחרו באזור האישי.",
        },
        {
          title: "זמן עיבוד",
          text: "לאחר הבדיקה, העיבוד יכול להימשך מכמה דקות ועד 3 ימי בנק בהתאם לבדיקות ולמצב הרשת.",
        },
      ],
      methodsEyebrow: "שיטות משיכה זמינות",
      methodsTitle: "משכו דרך אותן רשתות קריפטו נתמכות",
      methodsText: "האזור האישי אוסף את פרטי הארנק ומציג את השיטה המדויקת. השתמשו רק בארנקים שתומכים ברשת שנבחרה.",
      labels: { network: "רשת", asset: "נכס", crediting: "העברה" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "הרשת שמוצגת באזור האישי", "Bitcoin"],
      methodTransfer: "לאחר אישור הכספים",
      methodNotes: [
        "הזינו רק ארנק שמקבל USDT ברשת TRC20.",
        "הזינו רק ארנק Ethereum שמקבל ERC20 USDT.",
        "השתמשו ברשת USDC שמוצגת בטופס המשיכה.",
        "הזינו רק כתובת Bitcoin תקינה.",
      ],
      flowEyebrow: "תהליך משיכה",
      flowTitle: "מהבקשה להעברה יוצאת",
      flowText: "צוות הכספים בודק את הבקשה והפרטים, ולאחר מכן מעבד את התשלום דרך שיטת הקריפטו שנבחרה.",
      steps: [
        {
          title: "פתחו את האזור האישי",
          text: "התחברו ובדקו שסטטוס האימות מאפשר פעולות פיננסיות.",
        },
        {
          title: "צרו בקשת משיכה",
          text: "בחרו חשבון מסחר, סכום ואחת משיטות הקריפטו הזמינות.",
        },
        {
          title: "הזינו פרטי ארנק",
          text: "הוסיפו את הכתובת עבור הרשת המדויקת ובדקו את כל הפרטים לפני השליחה.",
        },
        {
          title: "המתינו לאישור כספים",
          text: "הצוות בודק את סטטוס החשבון, פרטי הבקשה וצורך אפשרי באימות נוסף.",
        },
        {
          title: "קבלו את ההעברה",
          text: "לאחר האישור התשלום נשלח, וההגעה הסופית תלויה באישורי הבלוקצ'יין.",
        },
      ],
      detailsEyebrow: "פרטים חשובים",
      detailsTitle: "מה יכול להשפיע על עיבוד המשיכה",
      detailsActionText: "פתחו משיכות באזור האישי",
      detailsItems: [
        "ארנק או רשת שגויים עלולים לעכב את התשלום או להפוך אותו לבלתי ניתן לשחזור.",
        "ייתכן שתידרש בדיקה נוספת לפני אישור הכספים.",
        "האזור האישי מציג את השיטה הפעילה, המגבלות וסטטוס הבקשה.",
        "עומס בבלוקצ'יין יכול להשפיע על זמן הופעת הכספים בארנק המקבל.",
      ],
    },
    hi: {
      heroEyebrow: "ट्रेडिंग शर्तें",
      heroTitle: "फंड निकासी",
      heroText:
        "निकासी अनुरोध कैबिनेट से बनाए जाते हैं और क्रिप्टो ट्रांसफर भेजने से पहले finance टीम उन्हें जांचती है। वही चार समर्थित क्रिप्टो तरीके इस्तेमाल करें।",
      heroImageAlt: "Ester निकासी अनुरोध और क्रिप्टो ट्रांसफर इंटरफेस",
      heroBadges: ["Finance की मैनुअल मंजूरी", "4 क्रिप्टो तरीके", "मिनटों से 3 बैंकिंग दिनों तक"],
      benefitsLabel: "निकासी के लाभ",
      benefits: [
        {
          title: "पहले मंजूरी",
          text: "फंड भेजने से पहले अनुरोध जांचा जाता है; इससे बैलेंस सुरक्षित रहता है और finance operations नियंत्रित रहते हैं।",
        },
        {
          title: "क्रिप्टो ट्रांसफर",
          text: "प्राप्तकर्ता wallet को कैबिनेट में चुने गए exact asset और network का समर्थन करना चाहिए।",
        },
        {
          title: "प्रोसेसिंग समय",
          text: "जांच के बाद प्रोसेसिंग checks और network state के अनुसार कुछ मिनटों से 3 banking days तक लग सकती है।",
        },
      ],
      methodsEyebrow: "उपलब्ध निकासी तरीके",
      methodsTitle: "उसी समर्थित क्रिप्टो rails से निकासी करें",
      methodsText:
        "कैबिनेट wallet details लेता है और exact payment method दिखाता है। केवल चुने गए network को support करने वाले wallets इस्तेमाल करें।",
      labels: { network: "Network", asset: "Asset", crediting: "Transfer" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "कैबिनेट में दिखाया गया network", "Bitcoin"],
      methodTransfer: "Finance approval के बाद",
      methodNotes: [
        "केवल ऐसा wallet दर्ज करें जो TRC20 पर USDT स्वीकार करता हो।",
        "केवल ऐसा Ethereum wallet दर्ज करें जो ERC20 USDT स्वीकार करता हो।",
        "Withdrawal form में दिखाया गया USDC network इस्तेमाल करें।",
        "केवल valid Bitcoin wallet address दर्ज करें।",
      ],
      flowEyebrow: "निकासी flow",
      flowTitle: "अनुरोध से outgoing transfer तक",
      flowText:
        "Finance team अनुरोध और details की जांच करती है और फिर चुने गए crypto method से payout process करती है।",
      steps: [
        {
          title: "कैबिनेट खोलें",
          text: "Log in करें और जांचें कि verification status finance operations की अनुमति देता है।",
        },
        {
          title: "निकासी अनुरोध बनाएं",
          text: "Trading account, amount और उपलब्ध crypto methods में से एक चुनें।",
        },
        {
          title: "Wallet details दर्ज करें",
          text: "Exact network के लिए address जोड़ें और submit करने से पहले सभी details जांचें।",
        },
        {
          title: "Finance approval का इंतज़ार करें",
          text: "Team account status, request details और possible additional verification needs जांचती है।",
        },
        {
          title: "Transfer प्राप्त करें",
          text: "Approval के बाद payout भेजा जाता है, और final arrival blockchain confirmations पर निर्भर करती है।",
        },
      ],
      detailsEyebrow: "महत्वपूर्ण विवरण",
      detailsTitle: "निकासी processing को क्या प्रभावित कर सकता है",
      detailsActionText: "कैबिनेट में withdrawals खोलें",
      detailsItems: [
        "गलत wallet या network details payout को delay कर सकती हैं या उसे unrecoverable बना सकती हैं।",
        "Finance approval से पहले additional verification मांगी जा सकती है।",
        "कैबिनेट active payment method, limits और request status दिखाता है।",
        "Blockchain load receiving wallet में funds आने के final time को प्रभावित कर सकता है।",
      ],
    },
    ja: {
      heroEyebrow: "取引条件",
      heroTitle: "資金の出金",
      heroText:
        "出金はキャビネットから申請され、暗号資産送金の前に財務チームが確認します。出金詳細には同じ4つの対応暗号資産ルートを使用します。",
      heroImageAlt: "Esterの出金申請と暗号資産送金インターフェース",
      heroBadges: ["財務チームによる手動承認", "4つの暗号資産方法", "数分から3銀行営業日"],
      benefitsLabel: "出金の利点",
      benefits: [
        {
          title: "まず承認",
          text: "資金送付前に申請が確認されるため、残高を保護し、金融処理を管理できます。",
        },
        {
          title: "暗号資産送金",
          text: "受取ウォレットは、キャビネットで選択した正確な資産とネットワークに対応している必要があります。",
        },
        {
          title: "処理時間",
          text: "確認後、チェック内容とネットワーク状況により、数分から3銀行営業日かかる場合があります。",
        },
      ],
      methodsEyebrow: "利用可能な出金方法",
      methodsTitle: "同じ対応暗号資産ルートで出金",
      methodsText:
        "キャビネットでウォレット情報を入力し、正確な方法を確認します。選択したネットワークに対応するウォレットのみ使用してください。",
      labels: { network: "ネットワーク", asset: "資産", crediting: "送金" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "キャビネットに表示されるネットワーク", "Bitcoin"],
      methodTransfer: "財務承認後",
      methodNotes: [
        "TRC20でUSDTを受け取れるウォレットのみ入力してください。",
        "ERC20 USDTを受け取れるEthereumウォレットのみ入力してください。",
        "出金フォームに表示されるUSDCネットワークを使用してください。",
        "有効なBitcoinウォレットアドレスのみ入力してください。",
      ],
      flowEyebrow: "出金フロー",
      flowTitle: "申請から送金完了まで",
      flowText: "財務チームが申請と詳細を確認し、その後、選択された暗号資産方法で支払いを処理します。",
      steps: [
        {
          title: "キャビネットを開く",
          text: "ログインし、認証ステータスが金融操作を許可しているか確認します。",
        },
        {
          title: "出金申請を作成",
          text: "取引口座、金額、利用可能な暗号資産方法を選択します。",
        },
        {
          title: "ウォレット情報を入力",
          text: "正確なネットワークのアドレスを追加し、送信前にすべての詳細を確認します。",
        },
        {
          title: "財務承認を待つ",
          text: "チームが口座ステータス、申請内容、追加確認の必要性を確認します。",
        },
        {
          title: "送金を受け取る",
          text: "承認後に支払いが送信され、最終着金はブロックチェーン承認に依存します。",
        },
      ],
      detailsEyebrow: "重要な詳細",
      detailsTitle: "出金処理に影響する要因",
      detailsActionText: "キャビネットで出金を開く",
      detailsItems: [
        "誤ったウォレットまたはネットワーク情報は、支払いの遅延や復旧不能の原因になります。",
        "財務承認前に追加確認が求められる場合があります。",
        "キャビネットには有効な方法、限度額、申請ステータスが表示されます。",
        "ブロックチェーンの混雑は、受取ウォレットへの反映時間に影響する場合があります。",
      ],
    },
    ko: {
      heroEyebrow: "거래 조건",
      heroTitle: "자금 출금",
      heroText:
        "출금은 캐비닛에서 요청되며, 암호화폐 전송 전에 재무팀이 검토합니다. 동일한 네 가지 지원 암호화폐 경로를 사용하세요.",
      heroImageAlt: "Ester 출금 요청 및 암호화폐 전송 인터페이스",
      heroBadges: ["재무팀 수동 승인", "4가지 암호화폐 방법", "몇 분부터 영업일 3일까지"],
      benefitsLabel: "출금 장점",
      benefits: [
        {
          title: "승인 우선",
          text: "자금 전송 전에 요청을 확인하여 잔고를 보호하고 금융 작업을 통제합니다.",
        },
        {
          title: "암호화폐 전송",
          text: "수신 지갑은 캐비닛에서 선택한 정확한 자산과 네트워크를 지원해야 합니다.",
        },
        {
          title: "처리 시간",
          text: "검토 후 처리 시간은 확인 절차와 네트워크 상태에 따라 몇 분에서 영업일 3일까지 걸릴 수 있습니다.",
        },
      ],
      methodsEyebrow: "사용 가능한 출금 방법",
      methodsTitle: "동일한 지원 암호화폐 경로로 출금",
      methodsText:
        "캐비닛은 지갑 정보를 수집하고 정확한 방법을 표시합니다. 선택한 네트워크를 지원하는 지갑만 사용하세요.",
      labels: { network: "네트워크", asset: "자산", crediting: "전송" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "캐비닛에 표시된 네트워크", "Bitcoin"],
      methodTransfer: "재무 승인 후",
      methodNotes: [
        "TRC20에서 USDT를 받을 수 있는 지갑만 입력하세요.",
        "ERC20 USDT를 받을 수 있는 Ethereum 지갑만 입력하세요.",
        "출금 양식에 표시된 USDC 네트워크를 사용하세요.",
        "유효한 Bitcoin 지갑 주소만 입력하세요.",
      ],
      flowEyebrow: "출금 흐름",
      flowTitle: "요청에서 송금까지",
      flowText: "재무팀이 요청과 세부 정보를 검토한 뒤 선택한 암호화폐 방법으로 지급을 처리합니다.",
      steps: [
        {
          title: "캐비닛 열기",
          text: "로그인하고 인증 상태가 금융 작업을 허용하는지 확인하세요.",
        },
        {
          title: "출금 요청 생성",
          text: "거래 계좌, 금액, 사용 가능한 암호화폐 방법 중 하나를 선택하세요.",
        },
        {
          title: "지갑 정보 입력",
          text: "정확한 네트워크의 주소를 추가하고 제출 전에 모든 세부 정보를 확인하세요.",
        },
        {
          title: "재무 승인 대기",
          text: "팀은 계좌 상태, 요청 세부 정보 및 추가 인증 필요 여부를 확인합니다.",
        },
        {
          title: "전송 받기",
          text: "승인 후 지급이 전송되며 최종 도착은 블록체인 확인에 따라 달라집니다.",
        },
      ],
      detailsEyebrow: "중요 세부 정보",
      detailsTitle: "출금 처리에 영향을 줄 수 있는 요소",
      detailsActionText: "캐비닛에서 출금 열기",
      detailsItems: [
        "잘못된 지갑 또는 네트워크 정보는 지급을 지연시키거나 복구 불가능하게 만들 수 있습니다.",
        "재무 승인 전에 추가 인증이 요청될 수 있습니다.",
        "캐비닛은 활성 결제 방법, 한도 및 요청 상태를 표시합니다.",
        "블록체인 부하는 수신 지갑에 자금이 표시되는 최종 시간에 영향을 줄 수 있습니다.",
      ],
    },
    zh: {
      heroEyebrow: "交易条件",
      heroTitle: "资金提现",
      heroText: "提现需在客户后台提交，并由财务团队审核后再发送加密转账。提现详情请使用同样四种受支持的加密通道。",
      heroImageAlt: "Ester 提现申请和加密转账界面",
      heroBadges: ["财务人工审核", "4 种加密方式", "数分钟至 3 个银行工作日"],
      benefitsLabel: "提现优势",
      benefits: [
        {
          title: "先审核",
          text: "资金发送前会先审核申请；这有助于保护余额并保持财务操作可控。",
        },
        {
          title: "加密转账",
          text: "收款钱包必须支持客户后台所选的准确资产和网络。",
        },
        {
          title: "处理时间",
          text: "审核后，处理时间可能从几分钟到 3 个银行工作日不等，取决于检查和网络状态。",
        },
      ],
      methodsEyebrow: "可用提现方式",
      methodsTitle: "通过同样受支持的加密通道提现",
      methodsText: "客户后台会收集钱包详情并显示准确的方式。请仅使用支持所选网络的钱包。",
      labels: { network: "网络", asset: "资产", crediting: "转账" },
      methodNetworks: ["TRON / TRC20", "Ethereum / ERC20", "客户后台显示的网络", "Bitcoin"],
      methodTransfer: "财务审核后",
      methodNotes: [
        "请仅输入支持 TRC20 USDT 的钱包。",
        "请仅输入支持 ERC20 USDT 的 Ethereum 钱包。",
        "请使用提现表单中显示的 USDC 网络。",
        "请仅输入有效的 Bitcoin 钱包地址。",
      ],
      flowEyebrow: "提现流程",
      flowTitle: "从申请到转出",
      flowText: "财务团队会审核申请和详情，然后通过所选加密方式处理付款。",
      steps: [
        {
          title: "打开客户后台",
          text: "登录并确认验证状态允许进行财务操作。",
        },
        {
          title: "创建提现申请",
          text: "选择交易账户、金额以及一种可用的加密方式。",
        },
        {
          title: "输入钱包详情",
          text: "添加准确网络的地址，并在提交前检查所有详情。",
        },
        {
          title: "等待财务审核",
          text: "团队会检查账户状态、申请详情以及是否需要额外验证。",
        },
        {
          title: "接收转账",
          text: "审核后会发送付款，最终到账取决于区块链确认。",
        },
      ],
      detailsEyebrow: "重要详情",
      detailsTitle: "可能影响提现处理的因素",
      detailsActionText: "在客户后台打开提现",
      detailsItems: [
        "错误的钱包或网络详情可能导致付款延迟或无法找回。",
        "财务审核前可能需要额外验证。",
        "客户后台会显示当前方法、限额和申请状态。",
        "区块链负载可能影响资金显示在收款钱包中的最终时间。",
      ],
    },
  };

  Object.entries(withdrawalStrings).forEach(([language, strings]) => {
    localizedCopy[language] = createWithdrawalCopy(strings);
  });

  localizedCopy.ua = localizedCopy.uk;

  const copy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const withdrawalHref = computed(() => cabinetLink("/payments"));

  const updatePointerOffset = (x = 0, y = 0) => {
    pageRef.value?.style.setProperty("--withdrawal-orb-x", `${x}px`);
    pageRef.value?.style.setProperty("--withdrawal-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = pageRef.value;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;

    updatePointerOffset(x, y);
  };

  const resetPointer = () => {
    updatePointerOffset();
  };
</script>

<style scoped lang="scss">
  :global(body.withdrawal-of-funds-route .page-content),
  :global(body.withdrawal-of-funds-route .page--inner) {
    background-color: #fff;
  }

  .withdrawal-page {
    --withdrawal-orb-x: 0px;
    --withdrawal-orb-y: 0px;
    display: flex;
    flex-direction: column;
    gap: clamp(82px, 7vw, 116px);
    color: var(--landing-text-primary);
    font-family: "DM Sans", "Inter", "Muli", sans-serif;
  }

  .section-kicker {
    display: inline-flex;
    color: var(--landing-accent);
    font-size: 18px;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
  }

  .withdrawal-hero {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: minmax(520px, 1.15fr) minmax(360px, 0.85fr);
    align-items: center;
    gap: clamp(24px, 3vw, 60px);
    min-height: min(560px, calc(100svh - 132px));
    padding: clamp(12px, 2vw, 28px) 0 clamp(30px, 4vw, 62px);

    &__content {
      position: relative;
      z-index: 2;
      grid-column: 2;
      grid-row: 1;
      max-width: 555px;
    }

    h1 {
      max-width: 555px;
      margin: 28px 0 0;
      color: #000;
      font-size: clamp(54px, 5.8vw, 82px);
      font-weight: 400;
      line-height: 0.98;
    }

    p {
      max-width: 440px;
      margin: 34px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.28;
    }

    &__badges {
      display: grid;
      gap: 18px;
      margin: 36px 0 0;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        color: var(--landing-text-primary);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.1;
      }

      img {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
    }

    &__media {
      position: relative;
      z-index: 1;
      grid-column: 1;
      grid-row: 1;
      justify-self: center;
      min-width: 0;
      margin-left: 0;
    }
  }

  .withdrawal-visual {
    position: relative;
    width: clamp(520px, 43vw, 690px);
    max-width: 100%;
    aspect-ratio: 690 / 610;
    isolation: isolate;

    &::before {
      content: "";
      position: absolute;
      inset: 5% 2% 4% 0;
      z-index: -2;
      background:
        radial-gradient(
          ellipse at 44% 51%,
          rgba(255, 255, 255, 0.94) 0 36%,
          rgba(255, 255, 255, 0.62) 47%,
          transparent 70%
        ),
        radial-gradient(ellipse at 28% 58%, rgba(0, 81, 255, 0.12) 0, rgba(0, 81, 255, 0.06) 34%, transparent 66%),
        radial-gradient(ellipse at 68% 44%, rgba(255, 136, 71, 0.1) 0, rgba(255, 136, 71, 0.04) 34%, transparent 62%);
      filter: blur(5px);
      opacity: 0.9;
      pointer-events: none;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 9% 4% 6%;
      z-index: -1;
      background:
        linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.96) 0 10%,
          transparent 31% 70%,
          rgba(255, 255, 255, 0.96) 91% 100%
        ),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0, transparent 20% 76%, rgba(255, 255, 255, 0.98) 100%);
      mask-image: radial-gradient(ellipse at center, #000 0 56%, rgba(0, 0, 0, 0.62) 72%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse at center, #000 0 56%, rgba(0, 0, 0, 0.62) 72%, transparent 100%);
      pointer-events: none;
    }

    &__routes {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    &__route,
    &__arrow-route {
      fill: none;
      vector-effect: non-scaling-stroke;
    }

    &__route {
      stroke: rgba(114, 126, 154, 0.28);
      stroke-width: 3;
      stroke-dasharray: 0.035 0.025;
      stroke-linecap: round;
    }

    &__arrow-route {
      stroke: rgba(197, 207, 232, 0.72);
      stroke-width: 17;
      stroke-linecap: round;
      marker-end: url("#withdrawal-visual-arrow");
      filter: drop-shadow(0 12px 16px rgba(66, 93, 150, 0.08));
      opacity: 0.74;
    }

    &__arrow-route--middle {
      stroke-width: 16;
    }

    &__arrow-route--bottom {
      stroke-width: 15;
    }

    &__haze {
      position: absolute;
      z-index: 1;
      border-radius: 999px;
      pointer-events: none;
      filter: blur(20px);
      opacity: 0.42;
      animation: withdrawalVisualFloat 8s ease-in-out infinite;
    }

    &__haze--blue {
      left: 19%;
      top: 43%;
      width: 30%;
      height: 25%;
      background: rgba(0, 81, 255, 0.14);
    }

    &__haze--orange {
      right: 16%;
      top: 39%;
      width: 24%;
      height: 20%;
      background: rgba(255, 129, 61, 0.12);
      animation-delay: -2.5s;
    }

    &__card {
      position: absolute;
      z-index: 2;
      display: grid;
      place-items: center;
      border: 1px solid rgba(231, 236, 248, 0.8);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(247, 250, 255, 0.58)), rgba(255, 255, 255, 0.65);
      box-shadow:
        0 24px 48px rgba(28, 52, 98, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      color: rgba(0, 81, 255, 0.3);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transform: perspective(720px) rotateY(-12deg) rotateX(3deg) rotateZ(var(--withdrawal-card-rotate, 0deg));
      transform-origin: center;
      animation: withdrawalVisualFloat 9s ease-in-out infinite;

      svg {
        width: 62%;
        height: 62%;
        overflow: visible;
        fill: none;
        stroke: currentColor;
        stroke-width: 7;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    &__request-card {
      position: absolute;
      top: 5.6%;
      left: 6.8%;
      z-index: 3;
      width: 31.6%;
      height: 31.2%;
      border: 1px solid rgba(231, 236, 248, 0.94);
      border-radius: 22px;
      background:
        radial-gradient(circle at 48% 14%, rgba(218, 235, 255, 0.32) 0, transparent 31%),
        linear-gradient(146deg, rgba(255, 255, 255, 0.92), rgba(248, 251, 255, 0.66)), rgba(255, 255, 255, 0.62);
      box-shadow:
        0 24px 58px rgba(27, 54, 102, 0.1),
        0 0 38px rgba(138, 164, 228, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.96),
        inset 15px 14px 32px rgba(255, 255, 255, 0.46),
        inset -18px -22px 34px rgba(221, 229, 245, 0.22);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transform: perspective(780px) rotateY(-14deg) rotateX(3deg) rotateZ(-0.7deg);
      transform-origin: center;
      opacity: 0.93;
      animation:
        withdrawalRequestFloat 8.5s ease-in-out infinite,
        withdrawalRequestGlow 5.8s ease-in-out infinite;
    }

    &__request-avatar {
      position: absolute;
      top: 12%;
      left: 50%;
      width: 31%;
      aspect-ratio: 1;
      border-radius: 50%;
      background:
        radial-gradient(circle at 34% 26%, rgba(255, 255, 255, 0.88) 0 12%, transparent 13%),
        linear-gradient(145deg, rgba(215, 244, 255, 0.92), rgba(151, 162, 232, 0.82));
      box-shadow:
        0 14px 28px rgba(69, 87, 166, 0.22),
        inset 0 5px 10px rgba(255, 255, 255, 0.76),
        inset 0 -9px 14px rgba(77, 91, 177, 0.22);
      translate: -50% 0;
      animation: withdrawalRequestAvatarPulse 4.8s ease-in-out infinite;

      span {
        position: absolute;
        inset: 22%;
        color: rgba(255, 255, 255, 0.94);
      }

      span::before,
      span::after {
        content: "";
        position: absolute;
        left: 50%;
        background: currentColor;
        translate: -50% 0;
      }

      span::before {
        top: 0;
        width: 32%;
        aspect-ratio: 1;
        border-radius: 50%;
      }

      span::after {
        bottom: 2%;
        width: 70%;
        height: 36%;
        border-radius: 999px 999px 42% 42%;
      }
    }

    &__request-rows {
      position: absolute;
      left: 14%;
      right: 12%;
      bottom: 17%;
      display: grid;
      gap: 11%;

      span {
        display: grid;
        grid-template-columns: 16% 1fr;
        align-items: center;
        gap: 10%;
      }

      i,
      b {
        display: block;
        opacity: 0.62;
        transform-origin: left center;
        animation: withdrawalRequestLineDraw 4.8s ease-in-out infinite;
      }

      i {
        aspect-ratio: 1;
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(179, 193, 230, 0.8), rgba(135, 151, 204, 0.48));
        box-shadow: 0 5px 9px rgba(65, 88, 143, 0.08);
      }

      b {
        height: clamp(8px, 1vw, 11px);
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(157, 173, 219, 0.6), rgba(205, 214, 232, 0.44));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.64);
      }

      span:nth-child(2) i,
      span:nth-child(2) b {
        animation-delay: 0.18s;
      }

      span:nth-child(3) i,
      span:nth-child(3) b {
        animation-delay: 0.36s;
      }

      span:nth-child(3) b {
        width: 68%;
      }
    }

    &__request-check {
      position: absolute;
      right: 10%;
      bottom: 13%;
      width: 22%;
      height: 18%;
      transform: rotate(-5deg);
      animation: withdrawalRequestCheckPulse 4.8s ease-in-out infinite;
    }

    &__request-check::before {
      content: "";
      position: absolute;
      left: 4%;
      top: 30%;
      width: 86%;
      height: 52%;
      border-right: 9px solid rgba(125, 151, 228, 0.82);
      border-bottom: 9px solid rgba(125, 151, 228, 0.82);
      border-radius: 4px;
      filter: drop-shadow(0 7px 8px rgba(74, 91, 166, 0.18));
      transform: rotate(42deg) scale(0.72);
    }

    &__shield-object {
      position: absolute;
      top: 44.2%;
      left: 7.2%;
      z-index: 3;
      width: 22.4%;
      aspect-ratio: 126 / 144;
      color: rgba(112, 141, 219, 0.86);
      transform: perspective(720px) rotateY(-12deg) rotateX(4deg) rotateZ(0.6deg);
      transform-origin: center;
      filter: drop-shadow(0 20px 24px rgba(63, 79, 145, 0.14));
      animation:
        withdrawalShieldFloat 8.8s ease-in-out infinite,
        withdrawalShieldGlow 5.6s ease-in-out infinite;

      svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }
    }

    &__shield-glass {
      fill: rgba(255, 255, 255, 0.34);
      stroke: rgba(155, 174, 224, 0.34);
      stroke-width: 5;
      filter: drop-shadow(0 9px 12px rgba(68, 83, 147, 0.1));
    }

    &__shield-edge {
      fill: rgba(255, 255, 255, 0.2);
      stroke: currentColor;
      stroke-width: 7;
      stroke-linejoin: round;
      stroke-dasharray: 410;
      stroke-dashoffset: 410;
      filter: drop-shadow(0 6px 7px rgba(93, 111, 184, 0.1));
      animation: withdrawalShieldDraw 5.6s ease-in-out infinite;
    }

    &__shield-check {
      fill: none;
      stroke: rgba(91, 122, 210, 0.92);
      stroke-width: 14;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 110;
      stroke-dashoffset: 110;
      filter: drop-shadow(0 10px 9px rgba(75, 92, 165, 0.2));
      animation: withdrawalShieldCheckDraw 5.6s ease-in-out infinite;
    }

    &__card--document {
      top: 73%;
      left: 30%;
      width: 17.5%;
      height: 17.5%;
      color: rgba(0, 81, 255, 0.2);
      opacity: 0.72;
      --withdrawal-card-rotate: -1.5deg;
      animation-delay: -5.1s;
    }

    &__card--clock {
      top: 74%;
      left: 52%;
      width: 18%;
      height: 17.5%;
      color: rgba(0, 81, 255, 0.3);
      opacity: 0.78;
      --withdrawal-card-rotate: 1deg;
      animation-delay: -2.2s;
    }

    &__card--bank {
      top: 19%;
      right: 9%;
      width: 18%;
      height: 18%;
      color: rgba(0, 81, 255, 0.2);
      opacity: 0.78;
      --withdrawal-card-rotate: 1.2deg;
      animation-delay: -4s;
    }

    &__card--payment {
      top: 44%;
      right: 5%;
      width: 21%;
      height: 14.5%;
      color: rgba(0, 81, 255, 0.2);
      opacity: 0.76;
      --withdrawal-card-rotate: -1deg;
      animation-delay: -6s;
    }

    &__card--profile {
      top: 67%;
      right: 8%;
      width: 17%;
      height: 18%;
      color: rgba(0, 81, 255, 0.16);
      opacity: 0.73;
      --withdrawal-card-rotate: 1.4deg;
      animation-delay: -2.8s;
    }

    &__wallet {
      position: absolute;
      left: 28.8%;
      top: 27.8%;
      z-index: 5;
      display: block;
      width: 39%;
      height: auto;
      transform: perspective(560px) rotateY(-8deg) rotateX(2deg) rotateZ(0.4deg);
      transform-origin: center;
      filter: drop-shadow(0 30px 24px rgba(22, 53, 118, 0.2));
      animation: withdrawalWalletFloat 7.5s ease-in-out infinite;
    }

    &__wallet-shadow {
      position: absolute;
      left: 35%;
      top: 67%;
      z-index: 4;
      width: 28%;
      height: 9%;
      border-radius: 999px;
      background:
        radial-gradient(ellipse at 60% 52%, rgba(36, 54, 86, 0.18) 0, rgba(63, 84, 121, 0.1) 38%, transparent 72%),
        radial-gradient(ellipse at 42% 44%, rgba(0, 81, 255, 0.08) 0, transparent 64%);
      filter: blur(12px);
      transform: rotate(-2deg);
      pointer-events: none;
      animation: withdrawalWalletShadowFloat 7.5s ease-in-out infinite;
    }

    &__coin {
      position: absolute;
      z-index: 6;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #fff;
      font-weight: 900;
      line-height: 1;
      transform: perspective(560px) rotateY(-15deg) rotateX(4deg);
      transform-origin: center;
      box-shadow:
        0 10px 24px rgba(30, 56, 114, 0.18),
        inset 0 3px 6px rgba(255, 255, 255, 0.58),
        inset 0 -7px 10px rgba(0, 0, 0, 0.18);
      animation: withdrawalCoinFloat 6.8s ease-in-out infinite;

      &::before {
        content: "";
        position: absolute;
        inset: 9%;
        border-radius: inherit;
        border: 1px solid rgba(255, 255, 255, 0.46);
      }

      &::after {
        content: "";
        position: absolute;
        inset: 13% 16% 55% 22%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.44);
        filter: blur(2px);
      }

      span {
        position: relative;
        z-index: 1;
        transform: translateY(1px);
      }
    }

    &__coin--usdt {
      top: 27%;
      left: 60%;
      width: 9.5%;
      aspect-ratio: 1;
      background:
        radial-gradient(circle at 31% 26%, #dbfff2 0 9%, transparent 10%),
        linear-gradient(145deg, #66ccb4, #21a98d 48%, #117468);
      font-size: clamp(22px, 2.4vw, 36px);
    }

    &__coin--btc {
      top: 43%;
      left: 65%;
      width: 9%;
      aspect-ratio: 1;
      background:
        radial-gradient(circle at 30% 24%, #fff3d9 0 9%, transparent 10%),
        linear-gradient(145deg, #ffb260, #f07824 52%, #bc5219);
      font-size: clamp(20px, 2.3vw, 34px);
      animation-delay: -2s;
    }

    &__coin--eth {
      top: 58%;
      left: 62%;
      width: 8.5%;
      aspect-ratio: 1;
      background:
        radial-gradient(circle at 32% 24%, #f5f1ff 0 9%, transparent 10%),
        linear-gradient(145deg, #9b9acd, #6f6caa 50%, #555182);
      font-size: clamp(15px, 1.8vw, 27px);
      animation-delay: -4s;
    }
  }

  @keyframes withdrawalVisualFloat {
    0%,
    100% {
      translate: 0 0;
    }

    50% {
      translate: 0 -8px;
    }
  }

  @keyframes withdrawalRequestFloat {
    0%,
    100% {
      translate: 0 0;
    }

    50% {
      translate: 0 -7px;
    }
  }

  @keyframes withdrawalRequestGlow {
    0%,
    100% {
      box-shadow:
        0 24px 58px rgba(27, 54, 102, 0.1),
        0 0 38px rgba(138, 164, 228, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.96),
        inset 15px 14px 32px rgba(255, 255, 255, 0.46),
        inset -18px -22px 34px rgba(221, 229, 245, 0.22);
    }

    50% {
      box-shadow:
        0 28px 64px rgba(27, 54, 102, 0.13),
        0 0 34px rgba(105, 139, 223, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.98),
        inset 15px 14px 32px rgba(255, 255, 255, 0.54),
        inset -18px -22px 34px rgba(221, 229, 245, 0.26);
    }
  }

  @keyframes withdrawalRequestAvatarPulse {
    0%,
    100% {
      opacity: 0.68;
      scale: 0.96;
    }

    46%,
    74% {
      opacity: 0.96;
      scale: 1;
    }
  }

  @keyframes withdrawalRequestLineDraw {
    0%,
    13% {
      opacity: 0.22;
      scale: 0.22 1;
    }

    42%,
    78% {
      opacity: 0.62;
      scale: 1 1;
    }

    100% {
      opacity: 0.42;
      scale: 0.92 1;
    }
  }

  @keyframes withdrawalRequestCheckPulse {
    0%,
    22% {
      opacity: 0;
      scale: 0.72;
    }

    45%,
    78% {
      opacity: 1;
      scale: 1;
    }

    100% {
      opacity: 0.62;
      scale: 0.92;
    }
  }

  @keyframes withdrawalShieldFloat {
    0%,
    100% {
      translate: 0 0;
    }

    50% {
      translate: 0 -6px;
    }
  }

  @keyframes withdrawalShieldGlow {
    0%,
    100% {
      filter: drop-shadow(0 20px 24px rgba(63, 79, 145, 0.14));
      opacity: 0.82;
    }

    52% {
      filter: drop-shadow(0 22px 28px rgba(63, 79, 145, 0.18)) drop-shadow(0 0 16px rgba(111, 140, 220, 0.16));
      opacity: 0.96;
    }
  }

  @keyframes withdrawalShieldDraw {
    0%,
    18% {
      stroke-dashoffset: 410;
      opacity: 0.34;
    }

    48%,
    82% {
      stroke-dashoffset: 0;
      opacity: 0.82;
    }

    100% {
      stroke-dashoffset: 0;
      opacity: 0.58;
    }
  }

  @keyframes withdrawalShieldCheckDraw {
    0%,
    30% {
      stroke-dashoffset: 110;
      opacity: 0.24;
    }

    52%,
    84% {
      stroke-dashoffset: 0;
      opacity: 0.92;
    }

    100% {
      stroke-dashoffset: 0;
      opacity: 0.62;
    }
  }

  @keyframes withdrawalWalletFloat {
    0%,
    100% {
      translate: 0 0;
    }

    50% {
      translate: 0 -7px;
    }
  }

  @keyframes withdrawalWalletShadowFloat {
    0%,
    100% {
      opacity: 0.95;
      translate: 0 0;
      scale: 1;
    }

    50% {
      opacity: 0.74;
      translate: 0 -2px;
      scale: 0.96;
    }
  }

  @keyframes withdrawalCoinFloat {
    0%,
    100% {
      rotate: 0deg;
      translate: 0 0;
    }

    50% {
      rotate: 5deg;
      translate: 0 -9px;
    }
  }

  .withdrawal-benefits {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(38px, 5vw, 72px);

    article {
      position: relative;
      min-height: 176px;
      padding-right: clamp(22px, 3vw, 46px);

      &:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: color-mix(in srgb, var(--landing-line) 54%, transparent);
      }
    }

    img {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    h2 {
      margin: 32px 0 0;
      color: var(--landing-text-primary);
      font-size: clamp(30px, 3vw, 42px);
      font-weight: 300;
      line-height: 1;
      text-transform: uppercase;
    }

    p {
      max-width: 360px;
      margin: 12px 0 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.18;
    }
  }

  .section-head {
    h2 {
      max-width: 670px;
      margin: 14px 0 0;
      color: var(--landing-text-primary);
      font-size: clamp(32px, 3.5vw, 42px);
      font-weight: 500;
      line-height: 1;
    }

    p {
      max-width: 680px;
      margin: 18px 0 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.32;
    }
  }

  .withdrawal-methods,
  .withdrawal-flow,
  .withdrawal-details {
    display: grid;
    gap: 30px;
  }

  .withdrawal-methods,
  .withdrawal-flow {
    position: relative;
    isolation: isolate;
  }

  .withdrawal-methods::before,
  .withdrawal-flow::before {
    content: "";
    position: absolute;
    z-index: -1;
    pointer-events: none;
  }

  .withdrawal-methods::before {
    top: -92px;
    right: -120px;
    width: min(44vw, 520px);
    height: min(36vw, 430px);
    background: radial-gradient(circle, rgba(255, 132, 51, 0.14) 0%, rgba(255, 132, 51, 0.07) 32%, transparent 72%);
    filter: blur(10px);
  }

  .withdrawal-flow::before {
    left: 50%;
    top: 168px;
    width: min(74vw, 980px);
    height: 620px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 81, 255, 0.12) 0%,
      rgba(0, 81, 255, 0.07) 38%,
      transparent 72%
    );
    filter: blur(8px);
    transform: translateX(-50%);
  }

  .method-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .method-card {
    position: relative;
    min-height: 190px;
    overflow: hidden;
    border: 6px solid #fff;
    border-radius: 16px;
    background:
      linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.9) 42%,
        rgba(243, 243, 243, 0.96) 100%
      ),
      linear-gradient(145deg, #ffffff 0%, #f7f7f7 54%, #ececec 100%);
    padding: 28px 30px 22px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.98),
      inset 28px 30px 72px rgba(255, 255, 255, 0.86),
      inset -38px -42px 86px rgba(210, 210, 210, 0.38),
      0 1px 0 rgba(255, 255, 255, 0.88);

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 10px;
    }

    &::before {
      border: 1px solid rgba(255, 255, 255, 0.92);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.62),
        inset 0 -22px 38px rgba(208, 208, 208, 0.16);
    }

    &::after {
      background:
        radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0) 38%),
        linear-gradient(145deg, rgba(255, 255, 255, 0) 42%, rgba(230, 230, 230, 0.18) 100%);
    }

    &__ghost {
      position: absolute;
      top: 12px;
      right: 26px;
      z-index: 1;
      color: rgba(0, 0, 0, 0.032);
      font-size: clamp(76px, 8.4vw, 118px);
      font-weight: 800;
      line-height: 1;
      pointer-events: none;
    }

    &__title {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      min-height: 64px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.52)),
        linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(238, 238, 238, 0.28));
      padding: 0 54px 0 22px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        inset -18px -18px 36px rgba(225, 225, 225, 0.32),
        0 18px 38px rgba(0, 0, 0, 0.035);
      backdrop-filter: blur(18px) saturate(130%);
      -webkit-backdrop-filter: blur(18px) saturate(130%);

      h3 {
        margin: 0;
        color: var(--landing-accent);
        font-size: clamp(24px, 2vw, 32px);
        font-weight: 800;
        line-height: 1;
      }
    }

    &__title-orbs {
      position: absolute;
      top: 50%;
      right: -18px;
      width: 38px;
      height: 48px;
      transform: translateY(-50%);
    }

    &__title-orb {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      transform: translate(var(--withdrawal-orb-x), var(--withdrawal-orb-y));
      transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }

    &__title-orb--solid {
      right: 0;
      bottom: 4px;
      width: 24px;
      height: 42px;
      background: linear-gradient(145deg, #0051ff 0%, #1b63ff 100%);
      box-shadow: 0 10px 22px rgba(0, 81, 255, 0.2);
    }

    &__title-orb--glow {
      top: 0;
      right: 12px;
      width: 25px;
      height: 25px;
      background: radial-gradient(circle, rgba(138, 178, 255, 0.98) 0%, rgba(40, 108, 255, 0.66) 48%, transparent 74%);
      filter: blur(3px);
    }

    dl {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 22px;
      margin: 22px 0 0;
    }

    dl div {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;

      &:first-child {
        padding-right: 22px;
        border-right: 1px solid color-mix(in srgb, var(--landing-line) 42%, transparent);
      }
    }

    &__wide {
      grid-column: 1 / -1;
    }

    dt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      color: var(--landing-text-primary);
      font-size: 16px;
      font-weight: 800;
      line-height: 1;

      img {
        width: 24px;
        height: 24px;
      }
    }

    dd {
      min-width: 0;
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.1;
    }

    > p {
      position: relative;
      z-index: 2;
      margin: 16px 0 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.22;
    }
  }

  .flow-steps {
    display: grid;
    gap: 18px;
    width: min(100%, 1080px);
    margin: 0 auto;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      display: grid;
      grid-template-columns: 66px minmax(0, 1fr);
      gap: 20px;
      align-items: center;
      width: min(640px, 100%);
      min-height: 88px;
      overflow: hidden;
      border: 6px solid #fff;
      border-radius: 16px;
      background:
        linear-gradient(
          145deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(255, 255, 255, 0.9) 48%,
          rgba(244, 244, 244, 0.98) 100%
        ),
        linear-gradient(145deg, #ffffff 0%, #fafafa 52%, #eeeeee 100%);
      padding: 14px 22px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.96),
        inset 24px 24px 58px rgba(255, 255, 255, 0.84),
        inset -28px -30px 66px rgba(214, 214, 214, 0.3),
        0 1px 0 rgba(255, 255, 255, 0.82);

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        border: 1px solid rgba(255, 255, 255, 0.92);
        border-radius: 10px;
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.58),
          inset 0 -18px 34px rgba(210, 210, 210, 0.14);
        pointer-events: none;
      }

      &:nth-child(2) {
        margin-left: clamp(0px, 10vw, 150px);
      }

      &:nth-child(3) {
        margin-left: clamp(0px, 20vw, 300px);
      }

      &:nth-child(4) {
        margin-left: clamp(0px, 30vw, 450px);
      }

      &:nth-child(5) {
        margin-left: clamp(0px, 40vw, 600px);
      }
    }

    h3 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.1;
    }

    p {
      margin: 6px 0 0;
      color: var(--landing-text-secondary);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.18;
    }
  }

  .flow-step-number {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 12px;
    isolation: isolate;

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
    }

    &::before {
      z-index: 1;
      border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 58%, transparent);
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--landing-surface-elevated) 27%, transparent),
        color-mix(in srgb, var(--landing-surface-elevated) 17%, transparent)
      );
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 28%, transparent),
        inset 0 -16px 24px color-mix(in srgb, var(--landing-accent) 8%, transparent);
    }

    &::after {
      z-index: 2;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.01)),
        linear-gradient(145deg, transparent, color-mix(in srgb, var(--landing-accent) 4%, transparent));
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 22%, transparent),
        inset 0 -16px 24px color-mix(in srgb, var(--landing-accent) 7%, transparent);
    }

    &__orb {
      position: absolute;
      z-index: 0;
      border-radius: 999px;
      pointer-events: none;
      transform: translate(var(--withdrawal-orb-x), var(--withdrawal-orb-y));
      transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }

    &__orb--solid {
      top: -8px;
      right: -8px;
      width: 28px;
      height: 28px;
      background: linear-gradient(145deg, #1b63ff 0%, #4d86ff 100%);
    }

    &__orb--glow {
      top: 8px;
      right: 4px;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(142, 181, 255, 0.95) 0%, rgba(60, 122, 255, 0.62) 44%, transparent 72%);
      filter: blur(3px);
    }

    span {
      position: relative;
      z-index: 3;
      color: var(--landing-accent);
      font-size: 28px;
      font-weight: 500;
      line-height: 1;
    }
  }

  .withdrawal-details {
    grid-template-columns: minmax(260px, 0.78fr) minmax(0, 1.22fr);
    align-items: start;

    .section-head h2 {
      max-width: 430px;
    }

    ul {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 32px 54px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
      grid-template-columns: 20px minmax(0, 1fr);
      gap: 14px;
      align-items: start;
    }

    li > span {
      position: relative;
      width: 20px;
      height: 20px;
      border: 2px solid var(--landing-accent);
      border-radius: 50%;

      &::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 6px;
        width: 5px;
        height: 8px;
        border-right: 2px solid var(--landing-accent);
        border-bottom: 2px solid var(--landing-accent);
        transform: rotate(45deg);
      }
    }

    p {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.18;
    }
  }

  .withdrawal-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 26px;
    min-width: 268px;
    min-height: 64px;
    margin-top: 32px;
    border: 2px solid var(--landing-accent);
    border-radius: 12px;
    background: var(--landing-accent);
    color: #fff;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
    text-decoration: none;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;

    span {
      width: 56px;
      height: 1.5px;
      background: currentColor;
      position: relative;

      &::before,
      &::after {
        content: "";
        position: absolute;
        right: 0;
        width: 9px;
        height: 1.5px;
        background: currentColor;
        transform-origin: right center;
      }

      &::before {
        transform: rotate(38deg);
      }

      &::after {
        transform: rotate(-38deg);
      }
    }

    &:hover {
      border-color: var(--landing-accent-hover);
      background: var(--landing-accent-hover);
      transform: translateY(-1px);
    }
  }

  :global(:root[data-theme="dark"] .withdrawal-hero h1),
  :global(:root[data-theme="dark"] .withdrawal-benefits h2),
  :global(:root[data-theme="dark"] .section-head h2),
  :global(:root[data-theme="dark"] .method-card dt),
  :global(:root[data-theme="dark"] .method-card dd),
  :global(:root[data-theme="dark"] .flow-steps h3),
  :global(:root[data-theme="dark"] .withdrawal-details p) {
    color: var(--landing-text-primary);
  }

  :global(:root[data-theme="dark"] .method-card),
  :global(:root[data-theme="dark"] .flow-steps li) {
    border-color: rgba(255, 255, 255, 0.08);
    background: linear-gradient(145deg, rgba(18, 34, 70, 0.88), rgba(6, 20, 52, 0.76));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset -20px -22px 50px rgba(0, 0, 0, 0.16);
  }

  :global(:root[data-theme="dark"] .method-card::before),
  :global(:root[data-theme="dark"] .flow-steps li::before) {
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  }

  :global(:root[data-theme="dark"] .method-card::after) {
    background:
      radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 38%),
      linear-gradient(145deg, rgba(255, 255, 255, 0) 42%, rgba(0, 0, 0, 0.1) 100%);
  }

  :global(:root[data-theme="dark"] .method-card__ghost) {
    color: rgba(255, 255, 255, 0.04);
  }

  @media (max-width: 1199px) {
    .withdrawal-hero {
      grid-template-columns: minmax(420px, 1.08fr) minmax(320px, 0.92fr);
    }

    .flow-steps li {
      &:nth-child(n) {
        margin-left: 0;
      }
    }
  }

  @media (max-width: 991px) {
    .withdrawal-page {
      gap: 62px;
    }

    .withdrawal-hero {
      grid-template-columns: 1fr;
      min-height: 0;

      &__content,
      &__media {
        grid-column: auto;
        grid-row: auto;
      }

      &__media {
        order: -1;
        margin-left: 0;
      }

      &__content {
        max-width: 100%;
      }
    }

    .withdrawal-visual {
      width: min(100%, 660px);
      margin: 0 auto;
    }

    .withdrawal-benefits,
    .method-grid,
    .withdrawal-details,
    .withdrawal-details ul {
      grid-template-columns: 1fr;
    }

    .withdrawal-benefits article {
      min-height: 0;
      padding: 0 0 32px;
      border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 54%, transparent);

      &::after {
        display: none;
      }
    }
  }

  @media (max-width: 575px) {
    .section-kicker {
      font-size: 13px;
    }

    .withdrawal-hero {
      h1 {
        margin-top: 18px;
        font-size: 46px;
      }

      p {
        margin-top: 22px;
      }
    }

    .method-card {
      padding: 22px 18px 18px;

      dl {
        grid-template-columns: 1fr;
      }

      dl div:first-child {
        border-right: 0;
        padding-right: 0;
      }
    }

    .flow-steps li {
      grid-template-columns: 1fr;
    }

    .withdrawal-button {
      width: 100%;
      min-width: 0;
    }
  }
</style>
