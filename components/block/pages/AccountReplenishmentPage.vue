<template>
  <UiContainer>
    <main
      ref="pageRef"
      class="replenishment-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <section class="replenishment-hero">
        <div class="replenishment-hero__content">
          <span class="section-kicker">{{ copy.hero.eyebrow }}</span>
          <h1>{{ copy.hero.title }}</h1>
          <p>{{ copy.hero.text }}</p>

          <ul class="replenishment-hero__badges">
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

        <div class="replenishment-hero__media">
          <img
            :src="assetPath('hero.png')"
            :alt="copy.hero.imageAlt"
            width="842"
            height="559"
            loading="eager" />
        </div>
      </section>

      <section
        class="replenishment-benefits"
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

      <section class="replenishment-methods">
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

      <section class="replenishment-flow">
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

      <section class="replenishment-details">
        <div class="section-head">
          <span class="section-kicker">{{ copy.details.eyebrow }}</span>
          <h2>{{ copy.details.title }}</h2>
          <a
            class="replenishment-button"
            :href="depositHref">
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

  type ReplenishmentCopy = {
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

  const ASSET_BASE = "/static/account-replenishment/";

  const assetPath = (name: string): string => `${ASSET_BASE}${name}`;

  const pageRef = ref<HTMLElement | null>(null);
  const { locale } = useI18n();
  const { cabinetLink } = useCabinetLink();

  useHead({
    bodyAttrs: {
      class: "account-replenishment-route",
    },
  });

  const localizedCopy: Record<string, ReplenishmentCopy> = {
    en: {
      hero: {
        eyebrow: "Trading conditions",
        title: "Account replenishment",
        text: "Fund a trading account from the cabinet through supported crypto rails. The old rule remains: Ester does not charge a broker deposit commission, while blockchain network fees can apply.",
        imageAlt: "Ester account replenishment crypto payment interface",
        badges: [
          { icon: "porcent.svg", text: "0% broker deposit commission" },
          { icon: "crypto.svg", text: "4 crypto methods" },
          { icon: "web.svg", text: "Status in the cabinet" },
        ],
      },
      benefitsLabel: "Account replenishment benefits",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Broker commission",
          text: "Deposits are accepted without an Ester broker commission; network fees depend on the selected chain.",
        },
        {
          icon: "usd-circle.svg",
          title: "Minimum amount",
          text: "The standard minimum is shown in the cabinet; USDC can start from 3 USD in the current deposit form.",
        },
        {
          icon: "shield-trust.svg",
          title: "Quick verification",
          text: "Profile data and compliance status can affect whether finance review is required before crediting.",
        },
      ],
      methods: {
        eyebrow: "Available payment methods",
        title: "Use only the crypto methods that exist in the cabinet",
        text: "The payment page generates the exact invoice, amount and network instructions. Do not send funds through a different network.",
        labels: {
          network: "Network",
          asset: "Asset",
          crediting: "Crediting",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "After blockchain confirmation and invoice review",
            note: "Use only a TRC20 wallet and the address generated in the cabinet.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "After blockchain confirmation and invoice review",
            note: "ERC20 transfers must be sent only to the Ethereum address from the invoice.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Network shown in the invoice",
            crediting: "After blockchain confirmation and invoice review",
            note: "Follow the payment page exactly; the active USDC network is defined by the cabinet.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "After Bitcoin confirmations and invoice review",
            note: "Send BTC only to the generated Bitcoin address.",
          },
        ],
      },
      flow: {
        eyebrow: "Deposit flow",
        title: "From empty balance to credited funds",
        text: "The deposit is created by the client in the cabinet; the blockchain transfer is then matched with the invoice and the trading balance.",
        steps: [
          {
            title: "Create or log in to the cabinet",
            text: "Open the client cabinet, choose the trading account and make sure profile data is correct.",
          },
          {
            title: "Choose a crypto method",
            text: "Select USDT TRC-20, USDT ERC-20, USDC or BTC and enter the amount in USD.",
          },
          {
            title: "Open the generated invoice",
            text: "The cabinet creates a payment page with the exact wallet address, network and amount instructions.",
          },
          {
            title: "Send the transfer",
            text: "Transfer funds from your wallet and keep the transaction hash until the deposit is credited.",
          },
          {
            title: "Wait for crediting",
            text: "After network confirmation and finance checks, the deposit status updates in the cabinet.",
          },
        ],
      },
      details: {
        eyebrow: "Important details",
        title: "Check these points before sending crypto",
        actionText: "Open deposit in cabinet",
        items: [
          "A transfer sent through the wrong network can be delayed or lost.",
          "Blockchain fees are paid inside the selected network and are not controlled by Ester.",
          "Finance review can be required depending on account status, amount or compliance checks.",
          "Keep the transaction hash and payment confirmation until the balance is updated.",
        ],
      },
    },
    uk: {
      hero: {
        eyebrow: "Умови торгівлі",
        title: "Поповнення рахунку",
        text: "Поповнюйте торговий рахунок з кабінету через підтримувані криптовалютні методи. Базове правило збережено: Ester не бере брокерську комісію за депозит, але комісія блокчейн-мережі можлива.",
        imageAlt: "Інтерфейс криптовалютного поповнення рахунку Ester",
        badges: [
          { icon: "porcent.svg", text: "0% брокерської комісії" },
          { icon: "crypto.svg", text: "4 криптометоди" },
          { icon: "web.svg", text: "Статус у кабінеті" },
        ],
      },
      benefitsLabel: "Переваги поповнення рахунку",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Комісія брокера",
          text: "Поповнення приймаються без брокерської комісії Ester; мережеві комісії залежать від обраного блокчейну.",
        },
        {
          icon: "usd-circle.svg",
          title: "Мінімальна сума",
          text: "Стандартний мінімум показується в кабінеті; для USDC у поточній формі він може стартувати від 3 USD.",
        },
        {
          icon: "shield-trust.svg",
          title: "Швидка верифікація",
          text: "Дані профілю та комплаєнс-статус можуть впливати на потребу у фінансовій перевірці перед зарахуванням.",
        },
      ],
      methods: {
        eyebrow: "Доступні методи оплати",
        title: "Використовуйте тільки ті криптометоди, які є в кабінеті",
        text: "Платіжна сторінка створює точний invoice, суму та інструкції щодо мережі. Не надсилайте кошти через іншу мережу.",
        labels: {
          network: "Мережа",
          asset: "Актив",
          crediting: "Зарахування",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Після підтвердження в мережі та перевірки invoice",
            note: "Використовуйте тільки TRC20-гаманець і адресу, створену в кабінеті.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Після підтвердження в мережі та перевірки invoice",
            note: "ERC20-перекази потрібно надсилати тільки на Ethereum-адресу з invoice.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Мережа з invoice",
            crediting: "Після підтвердження в мережі та перевірки invoice",
            note: "Дотримуйтеся інструкцій платіжної сторінки; активну мережу USDC визначає кабінет.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Після Bitcoin-підтверджень і перевірки invoice",
            note: "Надсилайте BTC тільки на згенеровану Bitcoin-адресу.",
          },
        ],
      },
      flow: {
        eyebrow: "Флоу поповнення",
        title: "Від порожнього балансу до зарахування коштів",
        text: "Депозит створюється клієнтом у кабінеті, після чого блокчейн-переказ зіставляється з invoice і торговим балансом.",
        steps: [
          {
            title: "Створіть або відкрийте кабінет",
            text: "Увійдіть у клієнтський кабінет, оберіть торговий рахунок і перевірте дані профілю.",
          },
          {
            title: "Оберіть криптометод",
            text: "Виберіть USDT TRC-20, USDT ERC-20, USDC або BTC і введіть суму в USD.",
          },
          {
            title: "Відкрийте створений invoice",
            text: "Кабінет створює платіжну сторінку з точною адресою, мережею та інструкціями щодо суми.",
          },
          {
            title: "Надішліть переказ",
            text: "Переказуйте кошти зі свого гаманця та збережіть transaction hash до зарахування.",
          },
          {
            title: "Дочекайтеся зарахування",
            text: "Після підтвердження мережі та фінансових перевірок статус депозиту оновиться в кабінеті.",
          },
        ],
      },
      details: {
        eyebrow: "Важливі деталі",
        title: "Перевірте ці пункти перед криптопереказом",
        actionText: "Відкрити депозит у кабінеті",
        items: [
          "Переказ через неправильну мережу може бути затриманий або втрачений.",
          "Комісії блокчейн-мережі сплачуються всередині обраної мережі та не контролюються Ester.",
          "Фінансова перевірка може знадобитися залежно від статусу рахунку, суми або комплаєнсу.",
          "Зберігайте transaction hash і підтвердження платежу до оновлення балансу.",
        ],
      },
    },
    ru: {
      hero: {
        eyebrow: "Условия торговли",
        title: "Пополнение счёта",
        text: "Пополняйте торговый счёт из кабинета через поддерживаемые криптовалютные методы. Базовое правило сохранено: Ester не берёт брокерскую комиссию за депозит, но комиссия блокчейн-сети возможна.",
        imageAlt: "Интерфейс криптовалютного пополнения счёта Ester",
        badges: [
          { icon: "porcent.svg", text: "0% брокерской комиссии" },
          { icon: "crypto.svg", text: "4 криптометода" },
          { icon: "web.svg", text: "Статус в кабинете" },
        ],
      },
      benefitsLabel: "Преимущества пополнения счёта",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Комиссия брокера",
          text: "Пополнения принимаются без брокерской комиссии Ester; сетевые комиссии зависят от выбранного блокчейна.",
        },
        {
          icon: "usd-circle.svg",
          title: "Минимальная сумма",
          text: "Стандартный минимум показывается в кабинете; для USDC в текущей форме он может начинаться от 3 USD.",
        },
        {
          icon: "shield-trust.svg",
          title: "Быстрая верификация",
          text: "Данные профиля и комплаенс-статус могут влиять на необходимость финансовой проверки перед зачислением.",
        },
      ],
      methods: {
        eyebrow: "Доступные методы оплаты",
        title: "Используйте только те криптометоды, которые есть в кабинете",
        text: "Платёжная страница создаёт точный invoice, сумму и инструкции по сети. Не отправляйте средства через другую сеть.",
        labels: {
          network: "Сеть",
          asset: "Актив",
          crediting: "Зачисление",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "После подтверждения в сети и проверки invoice",
            note: "Используйте только TRC20-кошелёк и адрес, созданный в кабинете.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "После подтверждения в сети и проверки invoice",
            note: "ERC20-переводы нужно отправлять только на Ethereum-адрес из invoice.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Сеть из invoice",
            crediting: "После подтверждения в сети и проверки invoice",
            note: "Следуйте инструкциям платёжной страницы; активную сеть USDC определяет кабинет.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "После Bitcoin-подтверждений и проверки invoice",
            note: "Отправляйте BTC только на сгенерированный Bitcoin-адрес.",
          },
        ],
      },
      flow: {
        eyebrow: "Флоу пополнения",
        title: "От пустого баланса до зачисления средств",
        text: "Депозит создаётся клиентом в кабинете, после чего блокчейн-перевод сопоставляется с invoice и торговым балансом.",
        steps: [
          {
            title: "Создайте или откройте кабинет",
            text: "Войдите в клиентский кабинет, выберите торговый счёт и проверьте данные профиля.",
          },
          {
            title: "Выберите криптометод",
            text: "Выберите USDT TRC-20, USDT ERC-20, USDC или BTC и введите сумму в USD.",
          },
          {
            title: "Откройте созданный invoice",
            text: "Кабинет создаёт платёжную страницу с точным адресом, сетью и инструкциями по сумме.",
          },
          {
            title: "Отправьте перевод",
            text: "Переведите средства со своего кошелька и сохраните transaction hash до зачисления.",
          },
          {
            title: "Дождитесь зачисления",
            text: "После подтверждения сети и финансовых проверок статус депозита обновится в кабинете.",
          },
        ],
      },
      details: {
        eyebrow: "Важные детали",
        title: "Проверьте эти пункты перед криптопереводом",
        actionText: "Открыть депозит в кабинете",
        items: [
          "Перевод через неправильную сеть может быть задержан или потерян.",
          "Комиссии блокчейн-сети оплачиваются внутри выбранной сети и не контролируются Ester.",
          "Финансовая проверка может понадобиться в зависимости от статуса счёта, суммы или комплаенса.",
          "Храните transaction hash и подтверждение платежа до обновления баланса.",
        ],
      },
    },
    de: {
      hero: {
        eyebrow: "Handelsbedingungen",
        title: "Kontoaufladung",
        text: "Finanzieren Sie Ihr Handelskonto aus dem Kabinett über unterstützte Krypto-Methoden. Die Grundregel bleibt: Ester berechnet keine Brokerkommission für Einzahlungen, Netzwerkgebühren der Blockchain können jedoch anfallen.",
        imageAlt: "Krypto-Zahlungsoberfläche zur Kontoaufladung bei Ester",
        badges: [
          { icon: "porcent.svg", text: "0% Brokerkommission" },
          { icon: "crypto.svg", text: "4 Krypto-Methoden" },
          { icon: "web.svg", text: "Status im Kabinett" },
        ],
      },
      benefitsLabel: "Vorteile der Kontoaufladung",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Brokerkommission",
          text: "Einzahlungen werden ohne Ester-Brokerkommission akzeptiert; Netzwerkgebühren hängen von der gewählten Chain ab.",
        },
        {
          icon: "usd-circle.svg",
          title: "Mindestbetrag",
          text: "Der Standard-Mindestbetrag wird im Kabinett angezeigt; USDC kann im aktuellen Einzahlungsformular ab 3 USD starten.",
        },
        {
          icon: "shield-trust.svg",
          title: "Schnelle Verifizierung",
          text: "Profildaten und Compliance-Status können beeinflussen, ob vor der Gutschrift eine Finanzprüfung erforderlich ist.",
        },
      ],
      methods: {
        eyebrow: "Verfügbare Zahlungsmethoden",
        title: "Nutzen Sie nur die Krypto-Methoden, die im Kabinett verfügbar sind",
        text: "Die Zahlungsseite erstellt die genaue Rechnung, den Betrag und die Netzwerkanweisungen. Senden Sie keine Gelder über ein anderes Netzwerk.",
        labels: {
          network: "Netzwerk",
          asset: "Asset",
          crediting: "Gutschrift",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Nach Blockchain-Bestätigung und Rechnungsprüfung",
            note: "Verwenden Sie nur eine TRC20-Wallet und die im Kabinett generierte Adresse.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Nach Blockchain-Bestätigung und Rechnungsprüfung",
            note: "ERC20-Transfers dürfen nur an die Ethereum-Adresse aus der Rechnung gesendet werden.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Netzwerk aus der Rechnung",
            crediting: "Nach Blockchain-Bestätigung und Rechnungsprüfung",
            note: "Folgen Sie exakt der Zahlungsseite; das aktive USDC-Netzwerk wird vom Kabinett festgelegt.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Nach Bitcoin-Bestätigungen und Rechnungsprüfung",
            note: "Senden Sie BTC nur an die generierte Bitcoin-Adresse.",
          },
        ],
      },
      flow: {
        eyebrow: "Einzahlungsablauf",
        title: "Vom leeren Kontostand zur Gutschrift",
        text: "Die Einzahlung wird vom Kunden im Kabinett erstellt; danach wird der Blockchain-Transfer mit Rechnung und Handelsbalance abgeglichen.",
        steps: [
          {
            title: "Kabinett erstellen oder einloggen",
            text: "Öffnen Sie das Kundenkabinett, wählen Sie das Handelskonto und prüfen Sie Ihre Profildaten.",
          },
          {
            title: "Krypto-Methode wählen",
            text: "Wählen Sie USDT TRC-20, USDT ERC-20, USDC oder BTC und geben Sie den Betrag in USD ein.",
          },
          {
            title: "Generierte Rechnung öffnen",
            text: "Das Kabinett erstellt eine Zahlungsseite mit genauer Wallet-Adresse, Netzwerk und Betragsanweisungen.",
          },
          {
            title: "Transfer senden",
            text: "Überweisen Sie Gelder aus Ihrer Wallet und bewahren Sie den Transaction Hash bis zur Gutschrift auf.",
          },
          {
            title: "Gutschrift abwarten",
            text: "Nach Netzwerkbestätigung und Finanzprüfung wird der Einzahlungsstatus im Kabinett aktualisiert.",
          },
        ],
      },
      details: {
        eyebrow: "Wichtige Details",
        title: "Prüfen Sie diese Punkte vor dem Krypto-Transfer",
        actionText: "Einzahlung im Kabinett öffnen",
        items: [
          "Ein Transfer über das falsche Netzwerk kann verzögert werden oder verloren gehen.",
          "Blockchain-Gebühren werden im gewählten Netzwerk bezahlt und nicht von Ester kontrolliert.",
          "Eine Finanzprüfung kann je nach Kontostatus, Betrag oder Compliance-Prüfungen erforderlich sein.",
          "Bewahren Sie Transaction Hash und Zahlungsbestätigung auf, bis die Balance aktualisiert ist.",
        ],
      },
    },
    es: {
      hero: {
        eyebrow: "Condiciones de trading",
        title: "Recarga de cuenta",
        text: "Financia una cuenta de trading desde el gabinete mediante métodos cripto compatibles. La regla se mantiene: Ester no cobra comisión de bróker por depósito, aunque pueden aplicarse comisiones de la red blockchain.",
        imageAlt: "Interfaz de pago cripto para recargar una cuenta Ester",
        badges: [
          { icon: "porcent.svg", text: "0% de comisión de bróker" },
          { icon: "crypto.svg", text: "4 métodos cripto" },
          { icon: "web.svg", text: "Estado en el gabinete" },
        ],
      },
      benefitsLabel: "Ventajas de recargar la cuenta",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Comisión de bróker",
          text: "Los depósitos se aceptan sin comisión de bróker de Ester; las comisiones de red dependen de la cadena seleccionada.",
        },
        {
          icon: "usd-circle.svg",
          title: "Importe mínimo",
          text: "El mínimo estándar se muestra en el gabinete; USDC puede comenzar desde 3 USD en el formulario actual.",
        },
        {
          icon: "shield-trust.svg",
          title: "Verificación rápida",
          text: "Los datos del perfil y el estado de cumplimiento pueden afectar si se requiere revisión financiera antes del abono.",
        },
      ],
      methods: {
        eyebrow: "Métodos de pago disponibles",
        title: "Usa solo los métodos cripto que existen en el gabinete",
        text: "La página de pago genera la factura exacta, el importe y las instrucciones de red. No envíes fondos por una red diferente.",
        labels: {
          network: "Red",
          asset: "Activo",
          crediting: "Abono",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Tras confirmación blockchain y revisión de la factura",
            note: "Usa solo una wallet TRC20 y la dirección generada en el gabinete.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Tras confirmación blockchain y revisión de la factura",
            note: "Las transferencias ERC20 deben enviarse solo a la dirección Ethereum de la factura.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Red indicada en la factura",
            crediting: "Tras confirmación blockchain y revisión de la factura",
            note: "Sigue exactamente la página de pago; la red activa de USDC la define el gabinete.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Tras confirmaciones de Bitcoin y revisión de la factura",
            note: "Envía BTC solo a la dirección Bitcoin generada.",
          },
        ],
      },
      flow: {
        eyebrow: "Flujo de depósito",
        title: "Del balance vacío a fondos acreditados",
        text: "El depósito lo crea el cliente en el gabinete; después la transferencia blockchain se compara con la factura y el balance de trading.",
        steps: [
          {
            title: "Crea o inicia sesión en el gabinete",
            text: "Abre el gabinete del cliente, elige la cuenta de trading y comprueba que los datos del perfil sean correctos.",
          },
          {
            title: "Elige un método cripto",
            text: "Selecciona USDT TRC-20, USDT ERC-20, USDC o BTC e introduce el importe en USD.",
          },
          {
            title: "Abre la factura generada",
            text: "El gabinete crea una página de pago con la dirección wallet exacta, red e instrucciones del importe.",
          },
          {
            title: "Envía la transferencia",
            text: "Transfiere fondos desde tu wallet y guarda el hash de transacción hasta que se acredite el depósito.",
          },
          {
            title: "Espera el abono",
            text: "Tras la confirmación de red y las comprobaciones financieras, el estado del depósito se actualiza en el gabinete.",
          },
        ],
      },
      details: {
        eyebrow: "Detalles importantes",
        title: "Comprueba estos puntos antes de enviar cripto",
        actionText: "Abrir depósito en el gabinete",
        items: [
          "Una transferencia enviada por la red incorrecta puede retrasarse o perderse.",
          "Las comisiones blockchain se pagan dentro de la red seleccionada y Ester no las controla.",
          "Puede requerirse revisión financiera según el estado de la cuenta, el importe o controles de cumplimiento.",
          "Conserva el hash de transacción y la confirmación de pago hasta que se actualice el balance.",
        ],
      },
    },
    fr: {
      hero: {
        eyebrow: "Conditions de trading",
        title: "Rechargement du compte",
        text: "Alimentez un compte de trading depuis le cabinet avec les méthodes crypto prises en charge. La règle reste la même : Ester ne facture pas de commission de dépôt, mais des frais de réseau blockchain peuvent s'appliquer.",
        imageAlt: "Interface de paiement crypto pour recharger un compte Ester",
        badges: [
          { icon: "porcent.svg", text: "0% de commission broker" },
          { icon: "crypto.svg", text: "4 méthodes crypto" },
          { icon: "web.svg", text: "Statut dans le cabinet" },
        ],
      },
      benefitsLabel: "Avantages du rechargement du compte",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Commission broker",
          text: "Les dépôts sont acceptés sans commission broker Ester ; les frais réseau dépendent de la blockchain choisie.",
        },
        {
          icon: "usd-circle.svg",
          title: "Montant minimum",
          text: "Le minimum standard est affiché dans le cabinet ; l'USDC peut commencer à partir de 3 USD dans le formulaire actuel.",
        },
        {
          icon: "shield-trust.svg",
          title: "Vérification rapide",
          text: "Les données de profil et le statut de conformité peuvent déterminer si une revue financière est requise avant le crédit.",
        },
      ],
      methods: {
        eyebrow: "Méthodes de paiement disponibles",
        title: "Utilisez uniquement les méthodes crypto présentes dans le cabinet",
        text: "La page de paiement génère la facture exacte, le montant et les instructions réseau. N'envoyez pas de fonds via un autre réseau.",
        labels: {
          network: "Réseau",
          asset: "Actif",
          crediting: "Crédit",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Après confirmation blockchain et revue de la facture",
            note: "Utilisez uniquement un wallet TRC20 et l'adresse générée dans le cabinet.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Après confirmation blockchain et revue de la facture",
            note: "Les transferts ERC20 doivent être envoyés uniquement à l'adresse Ethereum de la facture.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Réseau indiqué sur la facture",
            crediting: "Après confirmation blockchain et revue de la facture",
            note: "Suivez exactement la page de paiement ; le réseau USDC actif est défini par le cabinet.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Après confirmations Bitcoin et revue de la facture",
            note: "Envoyez le BTC uniquement à l'adresse Bitcoin générée.",
          },
        ],
      },
      flow: {
        eyebrow: "Parcours de dépôt",
        title: "Du solde vide aux fonds crédités",
        text: "Le dépôt est créé par le client dans le cabinet ; le transfert blockchain est ensuite rapproché de la facture et du solde de trading.",
        steps: [
          {
            title: "Créer ou ouvrir le cabinet",
            text: "Ouvrez le cabinet client, choisissez le compte de trading et vérifiez les données du profil.",
          },
          {
            title: "Choisir une méthode crypto",
            text: "Sélectionnez USDT TRC-20, USDT ERC-20, USDC ou BTC et saisissez le montant en USD.",
          },
          {
            title: "Ouvrir la facture générée",
            text: "Le cabinet crée une page de paiement avec l'adresse wallet exacte, le réseau et les instructions de montant.",
          },
          {
            title: "Envoyer le transfert",
            text: "Transférez les fonds depuis votre wallet et gardez le hash de transaction jusqu'au crédit.",
          },
          {
            title: "Attendre le crédit",
            text: "Après confirmation réseau et contrôles financiers, le statut du dépôt se met à jour dans le cabinet.",
          },
        ],
      },
      details: {
        eyebrow: "Détails importants",
        title: "Vérifiez ces points avant d'envoyer des cryptos",
        actionText: "Ouvrir le dépôt dans le cabinet",
        items: [
          "Un transfert envoyé via le mauvais réseau peut être retardé ou perdu.",
          "Les frais blockchain sont payés dans le réseau sélectionné et ne sont pas contrôlés par Ester.",
          "Une revue financière peut être requise selon le statut du compte, le montant ou les contrôles de conformité.",
          "Conservez le hash de transaction et la confirmation de paiement jusqu'à la mise à jour du solde.",
        ],
      },
    },
    it: {
      hero: {
        eyebrow: "Condizioni di trading",
        title: "Ricarica account",
        text: "Finanzia un conto di trading dal cabinet tramite metodi crypto supportati. La regola resta valida: Ester non addebita commissioni broker sul deposito, mentre possono applicarsi commissioni della rete blockchain.",
        imageAlt: "Interfaccia di pagamento crypto per ricaricare un account Ester",
        badges: [
          { icon: "porcent.svg", text: "0% commissione broker" },
          { icon: "crypto.svg", text: "4 metodi crypto" },
          { icon: "web.svg", text: "Stato nel cabinet" },
        ],
      },
      benefitsLabel: "Vantaggi della ricarica account",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Commissione broker",
          text: "I depositi sono accettati senza commissione broker Ester; le fee di rete dipendono dalla chain selezionata.",
        },
        {
          icon: "usd-circle.svg",
          title: "Importo minimo",
          text: "Il minimo standard è mostrato nel cabinet; USDC può partire da 3 USD nel modulo di deposito attuale.",
        },
        {
          icon: "shield-trust.svg",
          title: "Verifica rapida",
          text: "I dati del profilo e lo stato di compliance possono influire sulla necessità di revisione finanziaria prima dell'accredito.",
        },
      ],
      methods: {
        eyebrow: "Metodi di pagamento disponibili",
        title: "Usa solo i metodi crypto presenti nel cabinet",
        text: "La pagina di pagamento genera invoice, importo e istruzioni di rete esatti. Non inviare fondi tramite una rete diversa.",
        labels: {
          network: "Rete",
          asset: "Asset",
          crediting: "Accredito",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Dopo conferma blockchain e revisione invoice",
            note: "Usa solo un wallet TRC20 e l'indirizzo generato nel cabinet.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Dopo conferma blockchain e revisione invoice",
            note: "I trasferimenti ERC20 devono essere inviati solo all'indirizzo Ethereum dell'invoice.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Rete indicata nell'invoice",
            crediting: "Dopo conferma blockchain e revisione invoice",
            note: "Segui esattamente la pagina di pagamento; la rete USDC attiva è definita dal cabinet.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Dopo conferme Bitcoin e revisione invoice",
            note: "Invia BTC solo all'indirizzo Bitcoin generato.",
          },
        ],
      },
      flow: {
        eyebrow: "Flusso deposito",
        title: "Dal saldo vuoto ai fondi accreditati",
        text: "Il deposito viene creato dal cliente nel cabinet; il trasferimento blockchain viene poi associato all'invoice e al saldo di trading.",
        steps: [
          {
            title: "Crea o accedi al cabinet",
            text: "Apri il cabinet cliente, scegli il conto di trading e verifica che i dati del profilo siano corretti.",
          },
          {
            title: "Scegli un metodo crypto",
            text: "Seleziona USDT TRC-20, USDT ERC-20, USDC o BTC e inserisci l'importo in USD.",
          },
          {
            title: "Apri l'invoice generata",
            text: "Il cabinet crea una pagina di pagamento con indirizzo wallet, rete e istruzioni sull'importo esatti.",
          },
          {
            title: "Invia il trasferimento",
            text: "Trasferisci i fondi dal tuo wallet e conserva il transaction hash fino all'accredito del deposito.",
          },
          {
            title: "Attendi l'accredito",
            text: "Dopo la conferma di rete e i controlli finanziari, lo stato del deposito si aggiorna nel cabinet.",
          },
        ],
      },
      details: {
        eyebrow: "Dettagli importanti",
        title: "Controlla questi punti prima di inviare crypto",
        actionText: "Apri deposito nel cabinet",
        items: [
          "Un trasferimento inviato tramite la rete sbagliata può essere ritardato o perso.",
          "Le commissioni blockchain sono pagate nella rete selezionata e non sono controllate da Ester.",
          "La revisione finanziaria può essere richiesta in base a stato account, importo o controlli di compliance.",
          "Conserva transaction hash e conferma di pagamento fino all'aggiornamento del saldo.",
        ],
      },
    },
    pt: {
      hero: {
        eyebrow: "Condições de negociação",
        title: "Recarga de conta",
        text: "Financie uma conta de negociação pelo gabinete usando métodos cripto compatíveis. A regra permanece: a Ester não cobra comissão de corretagem por depósito, mas taxas da rede blockchain podem ser aplicadas.",
        imageAlt: "Interface de pagamento cripto para recarga de conta Ester",
        badges: [
          { icon: "porcent.svg", text: "0% de comissão da corretora" },
          { icon: "crypto.svg", text: "4 métodos cripto" },
          { icon: "web.svg", text: "Status no gabinete" },
        ],
      },
      benefitsLabel: "Vantagens da recarga de conta",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Comissão da corretora",
          text: "Depósitos são aceitos sem comissão de corretagem da Ester; taxas de rede dependem da chain selecionada.",
        },
        {
          icon: "usd-circle.svg",
          title: "Valor mínimo",
          text: "O mínimo padrão é exibido no gabinete; USDC pode começar em 3 USD no formulário atual de depósito.",
        },
        {
          icon: "shield-trust.svg",
          title: "Verificação rápida",
          text: "Dados do perfil e status de conformidade podem afetar se a revisão financeira é necessária antes do crédito.",
        },
      ],
      methods: {
        eyebrow: "Métodos de pagamento disponíveis",
        title: "Use apenas os métodos cripto que existem no gabinete",
        text: "A página de pagamento gera a fatura exata, valor e instruções de rede. Não envie fundos por uma rede diferente.",
        labels: {
          network: "Rede",
          asset: "Ativo",
          crediting: "Crédito",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Após confirmação blockchain e revisão da fatura",
            note: "Use apenas uma carteira TRC20 e o endereço gerado no gabinete.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Após confirmação blockchain e revisão da fatura",
            note: "Transferências ERC20 devem ser enviadas apenas para o endereço Ethereum da fatura.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Rede mostrada na fatura",
            crediting: "Após confirmação blockchain e revisão da fatura",
            note: "Siga exatamente a página de pagamento; a rede USDC ativa é definida pelo gabinete.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Após confirmações Bitcoin e revisão da fatura",
            note: "Envie BTC apenas para o endereço Bitcoin gerado.",
          },
        ],
      },
      flow: {
        eyebrow: "Fluxo de depósito",
        title: "Do saldo vazio aos fundos creditados",
        text: "O depósito é criado pelo cliente no gabinete; a transferência blockchain é então conciliada com a fatura e o saldo de negociação.",
        steps: [
          {
            title: "Crie ou entre no gabinete",
            text: "Abra o gabinete do cliente, escolha a conta de negociação e confirme se os dados do perfil estão corretos.",
          },
          {
            title: "Escolha um método cripto",
            text: "Selecione USDT TRC-20, USDT ERC-20, USDC ou BTC e informe o valor em USD.",
          },
          {
            title: "Abra a fatura gerada",
            text: "O gabinete cria uma página de pagamento com endereço de carteira, rede e instruções de valor exatos.",
          },
          {
            title: "Envie a transferência",
            text: "Transfira fundos da sua carteira e guarde o hash da transação até o depósito ser creditado.",
          },
          {
            title: "Aguarde o crédito",
            text: "Após confirmação da rede e verificações financeiras, o status do depósito é atualizado no gabinete.",
          },
        ],
      },
      details: {
        eyebrow: "Detalhes importantes",
        title: "Verifique estes pontos antes de enviar cripto",
        actionText: "Abrir depósito no gabinete",
        items: [
          "Uma transferência enviada pela rede errada pode atrasar ou ser perdida.",
          "Taxas blockchain são pagas dentro da rede selecionada e não são controladas pela Ester.",
          "Revisão financeira pode ser exigida conforme status da conta, valor ou verificações de conformidade.",
          "Guarde o hash da transação e a confirmação de pagamento até a atualização do saldo.",
        ],
      },
    },
    tr: {
      hero: {
        eyebrow: "İşlem koşulları",
        title: "Hesap yükleme",
        text: "Desteklenen kripto yöntemleriyle kabinet üzerinden işlem hesabınıza para yatırın. Temel kural değişmez: Ester depozito için broker komisyonu almaz, ancak blockchain ağ ücretleri uygulanabilir.",
        imageAlt: "Ester hesap yükleme kripto ödeme arayüzü",
        badges: [
          { icon: "porcent.svg", text: "%0 broker depozito komisyonu" },
          { icon: "crypto.svg", text: "4 kripto yöntemi" },
          { icon: "web.svg", text: "Kabinet durumu" },
        ],
      },
      benefitsLabel: "Hesap yükleme avantajları",
      benefits: [
        {
          icon: "percentage.svg",
          title: "Broker komisyonu",
          text: "Depozitolar Ester broker komisyonu olmadan kabul edilir; ağ ücretleri seçilen zincire bağlıdır.",
        },
        {
          icon: "usd-circle.svg",
          title: "Minimum tutar",
          text: "Standart minimum kabinet içinde gösterilir; mevcut depozito formunda USDC 3 USD'den başlayabilir.",
        },
        {
          icon: "shield-trust.svg",
          title: "Hızlı doğrulama",
          text: "Profil verileri ve uyumluluk durumu, kredi öncesinde finans incelemesi gerekip gerekmediğini etkileyebilir.",
        },
      ],
      methods: {
        eyebrow: "Kullanılabilir ödeme yöntemleri",
        title: "Yalnızca kabinet içinde bulunan kripto yöntemlerini kullanın",
        text: "Ödeme sayfası kesin faturayı, tutarı ve ağ talimatlarını üretir. Fonları farklı bir ağ üzerinden göndermeyin.",
        labels: {
          network: "Ağ",
          asset: "Varlık",
          crediting: "Kredilendirme",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Blockchain onayı ve fatura incelemesinden sonra",
            note: "Yalnızca TRC20 cüzdanı ve kabinet içinde oluşturulan adresi kullanın.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Blockchain onayı ve fatura incelemesinden sonra",
            note: "ERC20 transferleri yalnızca faturadaki Ethereum adresine gönderilmelidir.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Faturada gösterilen ağ",
            crediting: "Blockchain onayı ve fatura incelemesinden sonra",
            note: "Ödeme sayfasını aynen izleyin; aktif USDC ağı kabinet tarafından belirlenir.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Bitcoin onayları ve fatura incelemesinden sonra",
            note: "BTC'yi yalnızca oluşturulan Bitcoin adresine gönderin.",
          },
        ],
      },
      flow: {
        eyebrow: "Depozito akışı",
        title: "Boş bakiyeden kredilendirilen fonlara",
        text: "Depozito müşteri tarafından kabinet içinde oluşturulur; ardından blockchain transferi fatura ve işlem bakiyesiyle eşleştirilir.",
        steps: [
          {
            title: "Kabinet oluşturun veya giriş yapın",
            text: "Müşteri kabinetini açın, işlem hesabını seçin ve profil verilerinin doğru olduğundan emin olun.",
          },
          {
            title: "Kripto yöntemi seçin",
            text: "USDT TRC-20, USDT ERC-20, USDC veya BTC seçin ve tutarı USD olarak girin.",
          },
          {
            title: "Oluşturulan faturayı açın",
            text: "Kabinet, kesin cüzdan adresi, ağ ve tutar talimatlarını içeren bir ödeme sayfası oluşturur.",
          },
          {
            title: "Transferi gönderin",
            text: "Fonları cüzdanınızdan aktarın ve depozito kredilendirilene kadar transaction hash'i saklayın.",
          },
          {
            title: "Kredilendirmeyi bekleyin",
            text: "Ağ onayı ve finans kontrollerinden sonra depozito durumu kabinet içinde güncellenir.",
          },
        ],
      },
      details: {
        eyebrow: "Önemli detaylar",
        title: "Kripto göndermeden önce bu noktaları kontrol edin",
        actionText: "Kabinet içinde depozito aç",
        items: [
          "Yanlış ağ üzerinden gönderilen transfer gecikebilir veya kaybolabilir.",
          "Blockchain ücretleri seçilen ağ içinde ödenir ve Ester tarafından kontrol edilmez.",
          "Hesap durumu, tutar veya uyumluluk kontrollerine bağlı olarak finans incelemesi gerekebilir.",
          "Bakiye güncellenene kadar transaction hash ve ödeme onayını saklayın.",
        ],
      },
    },
    he: {
      hero: {
        eyebrow: "תנאי מסחר",
        title: "טעינת חשבון",
        text: "ממן חשבון מסחר מתוך הקבינט דרך שיטות קריפטו נתמכות. הכלל נשאר: Ester אינה גובה עמלת ברוקר על הפקדה, אך עשויות לחול עמלות רשת blockchain.",
        imageAlt: "ממשק תשלום קריפטו לטעינת חשבון Ester",
        badges: [
          { icon: "porcent.svg", text: "0% עמלת ברוקר על הפקדה" },
          { icon: "crypto.svg", text: "4 שיטות קריפטו" },
          { icon: "web.svg", text: "סטטוס בקבינט" },
        ],
      },
      benefitsLabel: "יתרונות טעינת החשבון",
      benefits: [
        {
          icon: "percentage.svg",
          title: "עמלת ברוקר",
          text: "הפקדות מתקבלות ללא עמלת ברוקר של Ester; עמלות הרשת תלויות בשרשרת שנבחרה.",
        },
        {
          icon: "usd-circle.svg",
          title: "סכום מינימום",
          text: "המינימום הסטנדרטי מוצג בקבינט; USDC יכול להתחיל מ-3 USD בטופס ההפקדה הנוכחי.",
        },
        {
          icon: "shield-trust.svg",
          title: "אימות מהיר",
          text: "נתוני פרופיל וסטטוס תאימות יכולים להשפיע אם נדרשת בדיקה פיננסית לפני הזיכוי.",
        },
      ],
      methods: {
        eyebrow: "שיטות תשלום זמינות",
        title: "השתמש רק בשיטות הקריפטו שקיימות בקבינט",
        text: "דף התשלום יוצר את החשבונית המדויקת, הסכום והוראות הרשת. אל תשלח כספים דרך רשת אחרת.",
        labels: {
          network: "רשת",
          asset: "נכס",
          crediting: "זיכוי",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "לאחר אישור blockchain ובדיקת החשבונית",
            note: "השתמש רק בארנק TRC20 ובכתובת שנוצרה בקבינט.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "לאחר אישור blockchain ובדיקת החשבונית",
            note: "העברות ERC20 חייבות להישלח רק לכתובת Ethereum מהחשבונית.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "הרשת שמוצגת בחשבונית",
            crediting: "לאחר אישור blockchain ובדיקת החשבונית",
            note: "פעל בדיוק לפי דף התשלום; רשת USDC הפעילה מוגדרת על ידי הקבינט.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "לאחר אישורי Bitcoin ובדיקת החשבונית",
            note: "שלח BTC רק לכתובת Bitcoin שנוצרה.",
          },
        ],
      },
      flow: {
        eyebrow: "תהליך הפקדה",
        title: "מיתרה ריקה לכספים מזוכים",
        text: "ההפקדה נוצרת על ידי הלקוח בקבינט; לאחר מכן העברת ה-blockchain מותאמת לחשבונית וליתרת המסחר.",
        steps: [
          {
            title: "צור או התחבר לקבינט",
            text: "פתח את קבינט הלקוח, בחר את חשבון המסחר וודא שנתוני הפרופיל נכונים.",
          },
          {
            title: "בחר שיטת קריפטו",
            text: "בחר USDT TRC-20, USDT ERC-20, USDC או BTC והזן את הסכום ב-USD.",
          },
          {
            title: "פתח את החשבונית שנוצרה",
            text: "הקבינט יוצר דף תשלום עם כתובת ארנק מדויקת, רשת והוראות סכום.",
          },
          {
            title: "שלח את ההעברה",
            text: "העבר כספים מהארנק שלך ושמור את transaction hash עד שההפקדה תזוכה.",
          },
          {
            title: "המתן לזיכוי",
            text: "לאחר אישור רשת ובדיקות פיננסיות, סטטוס ההפקדה יתעדכן בקבינט.",
          },
        ],
      },
      details: {
        eyebrow: "פרטים חשובים",
        title: "בדוק נקודות אלו לפני שליחת קריפטו",
        actionText: "פתח הפקדה בקבינט",
        items: [
          "העברה שנשלחה דרך הרשת הלא נכונה עלולה להתעכב או ללכת לאיבוד.",
          "עמלות blockchain משולמות בתוך הרשת שנבחרה ואינן נשלטות על ידי Ester.",
          "בדיקה פיננסית עשויה להידרש בהתאם לסטטוס החשבון, הסכום או בדיקות התאימות.",
          "שמור את transaction hash ואישור התשלום עד שהיתרה תתעדכן.",
        ],
      },
    },
    hi: {
      hero: {
        eyebrow: "व्यापार की शर्तें",
        title: "खाता जमा",
        text: "समर्थित क्रिप्टो तरीकों से कैबिनेट के भीतर ट्रेडिंग खाते में धन जमा करें। नियम वही है: Ester जमा पर ब्रोकर कमीशन नहीं लेता, लेकिन blockchain नेटवर्क शुल्क लागू हो सकते हैं।",
        imageAlt: "Ester खाता जमा क्रिप्टो भुगतान इंटरफेस",
        badges: [
          { icon: "porcent.svg", text: "0% ब्रोकर जमा कमीशन" },
          { icon: "crypto.svg", text: "4 क्रिप्टो तरीके" },
          { icon: "web.svg", text: "कैबिनेट में स्थिति" },
        ],
      },
      benefitsLabel: "खाता जमा के लाभ",
      benefits: [
        {
          icon: "percentage.svg",
          title: "ब्रोकर कमीशन",
          text: "Ester ब्रोकर कमीशन के बिना जमा स्वीकार करता है; नेटवर्क शुल्क चुनी गई chain पर निर्भर करते हैं।",
        },
        {
          icon: "usd-circle.svg",
          title: "न्यूनतम राशि",
          text: "मानक न्यूनतम कैबिनेट में दिखाया जाता है; वर्तमान जमा फॉर्म में USDC 3 USD से शुरू हो सकता है।",
        },
        {
          icon: "shield-trust.svg",
          title: "त्वरित सत्यापन",
          text: "प्रोफाइल डेटा और compliance स्थिति यह प्रभावित कर सकती है कि क्रेडिट से पहले वित्तीय समीक्षा चाहिए या नहीं।",
        },
      ],
      methods: {
        eyebrow: "उपलब्ध भुगतान तरीके",
        title: "केवल वही क्रिप्टो तरीके उपयोग करें जो कैबिनेट में मौजूद हैं",
        text: "भुगतान पेज सटीक invoice, राशि और नेटवर्क निर्देश बनाता है। किसी अलग नेटवर्क से धन न भेजें।",
        labels: {
          network: "नेटवर्क",
          asset: "एसेट",
          crediting: "क्रेडिटिंग",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Blockchain पुष्टि और invoice समीक्षा के बाद",
            note: "केवल TRC20 wallet और कैबिनेट में बनी हुई address का उपयोग करें।",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Blockchain पुष्टि और invoice समीक्षा के बाद",
            note: "ERC20 transfer केवल invoice वाली Ethereum address पर भेजें।",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Invoice में दिखाया गया नेटवर्क",
            crediting: "Blockchain पुष्टि और invoice समीक्षा के बाद",
            note: "Payment page के निर्देश ठीक से पालन करें; active USDC network cabinet तय करता है।",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Bitcoin confirmations और invoice review के बाद",
            note: "BTC केवल generated Bitcoin address पर भेजें।",
          },
        ],
      },
      flow: {
        eyebrow: "जमा प्रक्रिया",
        title: "खाली बैलेंस से जमा हुए funds तक",
        text: "Deposit client द्वारा cabinet में बनाया जाता है; फिर blockchain transfer invoice और trading balance से match किया जाता है।",
        steps: [
          {
            title: "Cabinet बनाएं या login करें",
            text: "Client cabinet खोलें, trading account चुनें और profile data सही है यह जांचें।",
          },
          {
            title: "Crypto method चुनें",
            text: "USDT TRC-20, USDT ERC-20, USDC या BTC चुनें और amount USD में दर्ज करें।",
          },
          {
            title: "Generated invoice खोलें",
            text: "Cabinet exact wallet address, network और amount instructions वाला payment page बनाता है।",
          },
          {
            title: "Transfer भेजें",
            text: "अपने wallet से funds transfer करें और deposit credited होने तक transaction hash रखें।",
          },
          {
            title: "Crediting का इंतजार करें",
            text: "Network confirmation और finance checks के बाद deposit status cabinet में update हो जाता है।",
          },
        ],
      },
      details: {
        eyebrow: "महत्वपूर्ण विवरण",
        title: "Crypto भेजने से पहले ये बिंदु जांचें",
        actionText: "Cabinet में deposit खोलें",
        items: [
          "गलत network से भेजा गया transfer delay हो सकता है या खो सकता है।",
          "Blockchain fees चुने गए network के भीतर paid होती हैं और Ester उन्हें control नहीं करता।",
          "Account status, amount या compliance checks के आधार पर finance review required हो सकता है।",
          "Balance update होने तक transaction hash और payment confirmation रखें।",
        ],
      },
    },
    ja: {
      hero: {
        eyebrow: "取引条件",
        title: "口座入金",
        text: "対応している暗号資産ルートを使い、キャビネットから取引口座に資金を入金できます。Ester は入金に対するブローカー手数料を請求しませんが、blockchain ネットワーク手数料が発生する場合があります。",
        imageAlt: "Ester 口座入金の暗号資産決済インターフェース",
        badges: [
          { icon: "porcent.svg", text: "ブローカー入金手数料 0%" },
          { icon: "crypto.svg", text: "4つの暗号資産方法" },
          { icon: "web.svg", text: "キャビネット内ステータス" },
        ],
      },
      benefitsLabel: "口座入金のメリット",
      benefits: [
        {
          icon: "percentage.svg",
          title: "ブローカー手数料",
          text: "Ester のブローカー手数料なしで入金できます。ネットワーク手数料は選択したチェーンによって異なります。",
        },
        {
          icon: "usd-circle.svg",
          title: "最低金額",
          text: "標準の最低金額はキャビネットに表示されます。現在の入金フォームでは USDC は 3 USD から開始できます。",
        },
        {
          icon: "shield-trust.svg",
          title: "迅速な確認",
          text: "プロフィール情報とコンプライアンス状況により、入金反映前の財務確認が必要になる場合があります。",
        },
      ],
      methods: {
        eyebrow: "利用可能な支払い方法",
        title: "キャビネットに表示される暗号資産方法のみ使用してください",
        text: "支払いページは正確な invoice、金額、ネットワーク指示を生成します。別のネットワークで送金しないでください。",
        labels: {
          network: "ネットワーク",
          asset: "資産",
          crediting: "反映",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Blockchain 確認と invoice レビュー後",
            note: "TRC20 ウォレットとキャビネットで生成されたアドレスのみ使用してください。",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Blockchain 確認と invoice レビュー後",
            note: "ERC20 送金は invoice の Ethereum アドレスにのみ送ってください。",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Invoice に表示されるネットワーク",
            crediting: "Blockchain 確認と invoice レビュー後",
            note: "支払いページに正確に従ってください。有効な USDC ネットワークはキャビネットが指定します。",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Bitcoin 確認と invoice レビュー後",
            note: "BTC は生成された Bitcoin アドレスにのみ送金してください。",
          },
        ],
      },
      flow: {
        eyebrow: "入金フロー",
        title: "空の残高から資金反映まで",
        text: "入金はクライアントがキャビネットで作成し、その後 blockchain 送金が invoice と取引残高に照合されます。",
        steps: [
          {
            title: "キャビネットを作成またはログイン",
            text: "クライアントキャビネットを開き、取引口座を選択し、プロフィール情報が正しいか確認します。",
          },
          {
            title: "暗号資産方法を選択",
            text: "USDT TRC-20、USDT ERC-20、USDC、BTC のいずれかを選び、USD 金額を入力します。",
          },
          {
            title: "生成された invoice を開く",
            text: "キャビネットは正確なウォレットアドレス、ネットワーク、金額指示を含む支払いページを作成します。",
          },
          {
            title: "送金する",
            text: "ウォレットから資金を送金し、入金が反映されるまで transaction hash を保存します。",
          },
          {
            title: "反映を待つ",
            text: "ネットワーク確認と財務チェック後、入金ステータスがキャビネットで更新されます。",
          },
        ],
      },
      details: {
        eyebrow: "重要な詳細",
        title: "暗号資産を送る前に確認してください",
        actionText: "キャビネットで入金を開く",
        items: [
          "誤ったネットワークで送金すると、遅延または消失する可能性があります。",
          "Blockchain 手数料は選択したネットワーク内で支払われ、Ester は管理しません。",
          "口座状況、金額、コンプライアンスチェックにより財務確認が必要になる場合があります。",
          "残高が更新されるまで transaction hash と支払い確認を保存してください。",
        ],
      },
    },
    ko: {
      hero: {
        eyebrow: "거래 조건",
        title: "계좌 입금",
        text: "지원되는 암호화폐 방식을 통해 캐비닛에서 거래 계좌에 자금을 입금하세요. 기본 규칙은 동일합니다. Ester는 입금 브로커 수수료를 부과하지 않지만, blockchain 네트워크 수수료는 발생할 수 있습니다.",
        imageAlt: "Ester 계좌 입금 암호화폐 결제 인터페이스",
        badges: [
          { icon: "porcent.svg", text: "브로커 입금 수수료 0%" },
          { icon: "crypto.svg", text: "4가지 암호화폐 방식" },
          { icon: "web.svg", text: "캐비닛 내 상태" },
        ],
      },
      benefitsLabel: "계좌 입금 장점",
      benefits: [
        {
          icon: "percentage.svg",
          title: "브로커 수수료",
          text: "입금은 Ester 브로커 수수료 없이 처리됩니다. 네트워크 수수료는 선택한 체인에 따라 달라집니다.",
        },
        {
          icon: "usd-circle.svg",
          title: "최소 금액",
          text: "표준 최소 금액은 캐비닛에 표시됩니다. 현재 입금 양식에서 USDC는 3 USD부터 시작할 수 있습니다.",
        },
        {
          icon: "shield-trust.svg",
          title: "빠른 확인",
          text: "프로필 데이터와 컴플라이언스 상태에 따라 입금 반영 전 금융 검토가 필요할 수 있습니다.",
        },
      ],
      methods: {
        eyebrow: "사용 가능한 결제 방법",
        title: "캐비닛에 있는 암호화폐 방법만 사용하세요",
        text: "결제 페이지는 정확한 invoice, 금액 및 네트워크 지침을 생성합니다. 다른 네트워크로 자금을 보내지 마세요.",
        labels: {
          network: "네트워크",
          asset: "자산",
          crediting: "입금 반영",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Blockchain 확인 및 invoice 검토 후",
            note: "TRC20 지갑과 캐비닛에서 생성된 주소만 사용하세요.",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Blockchain 확인 및 invoice 검토 후",
            note: "ERC20 전송은 invoice의 Ethereum 주소로만 보내야 합니다.",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Invoice에 표시된 네트워크",
            crediting: "Blockchain 확인 및 invoice 검토 후",
            note: "결제 페이지를 정확히 따르세요. 활성 USDC 네트워크는 캐비닛이 지정합니다.",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Bitcoin 확인 및 invoice 검토 후",
            note: "BTC는 생성된 Bitcoin 주소로만 보내세요.",
          },
        ],
      },
      flow: {
        eyebrow: "입금 흐름",
        title: "빈 잔액에서 입금 반영까지",
        text: "입금은 고객이 캐비닛에서 생성하며, 이후 blockchain 전송이 invoice 및 거래 잔액과 매칭됩니다.",
        steps: [
          {
            title: "캐비닛 생성 또는 로그인",
            text: "고객 캐비닛을 열고 거래 계좌를 선택한 뒤 프로필 데이터가 올바른지 확인하세요.",
          },
          {
            title: "암호화폐 방식 선택",
            text: "USDT TRC-20, USDT ERC-20, USDC 또는 BTC를 선택하고 USD 금액을 입력하세요.",
          },
          {
            title: "생성된 invoice 열기",
            text: "캐비닛은 정확한 지갑 주소, 네트워크 및 금액 지침이 포함된 결제 페이지를 생성합니다.",
          },
          {
            title: "전송 보내기",
            text: "지갑에서 자금을 전송하고 입금이 반영될 때까지 transaction hash를 보관하세요.",
          },
          {
            title: "입금 반영 대기",
            text: "네트워크 확인 및 금융 점검 후 입금 상태가 캐비닛에서 업데이트됩니다.",
          },
        ],
      },
      details: {
        eyebrow: "중요 세부사항",
        title: "암호화폐 전송 전에 이 항목을 확인하세요",
        actionText: "캐비닛에서 입금 열기",
        items: [
          "잘못된 네트워크로 보낸 전송은 지연되거나 손실될 수 있습니다.",
          "Blockchain 수수료는 선택한 네트워크 내부에서 지불되며 Ester가 통제하지 않습니다.",
          "계좌 상태, 금액 또는 컴플라이언스 점검에 따라 금융 검토가 필요할 수 있습니다.",
          "잔액이 업데이트될 때까지 transaction hash와 결제 확인을 보관하세요.",
        ],
      },
    },
    zh: {
      hero: {
        eyebrow: "交易条件",
        title: "账户充值",
        text: "通过柜台支持的加密货币方式为交易账户入金。基本规则不变：Ester 不收取入金经纪商佣金，但可能产生 blockchain 网络费用。",
        imageAlt: "Ester 账户充值加密支付界面",
        badges: [
          { icon: "porcent.svg", text: "0% 经纪商入金佣金" },
          { icon: "crypto.svg", text: "4 种加密方式" },
          { icon: "web.svg", text: "柜台内状态" },
        ],
      },
      benefitsLabel: "账户充值优势",
      benefits: [
        {
          icon: "percentage.svg",
          title: "经纪商佣金",
          text: "入金不收取 Ester 经纪商佣金；网络费用取决于所选链。",
        },
        {
          icon: "usd-circle.svg",
          title: "最低金额",
          text: "标准最低金额会显示在柜台中；当前入金表单中 USDC 可从 3 USD 开始。",
        },
        {
          icon: "shield-trust.svg",
          title: "快速验证",
          text: "个人资料和合规状态可能影响入金前是否需要财务审核。",
        },
      ],
      methods: {
        eyebrow: "可用付款方式",
        title: "只使用柜台中存在的加密方式",
        text: "付款页面会生成准确的 invoice、金额和网络说明。不要通过其他网络发送资金。",
        labels: {
          network: "网络",
          asset: "资产",
          crediting: "入账",
        },
        items: [
          {
            name: "USDT TRC-20",
            asset: "USDT",
            network: "TRON / TRC20",
            crediting: "Blockchain 确认并审核 invoice 后",
            note: "仅使用 TRC20 钱包和柜台生成的地址。",
          },
          {
            name: "USDT ERC-20",
            asset: "USDT",
            network: "Ethereum / ERC20",
            crediting: "Blockchain 确认并审核 invoice 后",
            note: "ERC20 转账只能发送到 invoice 中的 Ethereum 地址。",
          },
          {
            name: "USDC",
            asset: "USDC",
            network: "Invoice 中显示的网络",
            crediting: "Blockchain 确认并审核 invoice 后",
            note: "严格按照付款页面操作；有效的 USDC 网络由柜台确定。",
          },
          {
            name: "BTC",
            asset: "BTC",
            network: "Bitcoin",
            crediting: "Bitcoin 确认并审核 invoice 后",
            note: "BTC 只能发送到生成的 Bitcoin 地址。",
          },
        ],
      },
      flow: {
        eyebrow: "入金流程",
        title: "从空余额到资金入账",
        text: "入金由客户在柜台中创建；随后 blockchain 转账会与 invoice 和交易余额进行匹配。",
        steps: [
          {
            title: "创建或登录柜台",
            text: "打开客户柜台，选择交易账户，并确认个人资料正确。",
          },
          {
            title: "选择加密方式",
            text: "选择 USDT TRC-20、USDT ERC-20、USDC 或 BTC，并输入 USD 金额。",
          },
          {
            title: "打开生成的 invoice",
            text: "柜台会创建包含准确钱包地址、网络和金额说明的付款页面。",
          },
          {
            title: "发送转账",
            text: "从您的钱包转账，并保留 transaction hash 直到入金到账。",
          },
          {
            title: "等待入账",
            text: "网络确认和财务检查后，入金状态会在柜台中更新。",
          },
        ],
      },
      details: {
        eyebrow: "重要细节",
        title: "发送加密货币前请检查这些要点",
        actionText: "在柜台打开入金",
        items: [
          "通过错误网络发送的转账可能会延迟或丢失。",
          "Blockchain 费用在所选网络内支付，Ester 无法控制。",
          "根据账户状态、金额或合规检查，可能需要财务审核。",
          "请保留 transaction hash 和付款确认，直到余额更新。",
        ],
      },
    },
  };

  localizedCopy.ua = localizedCopy.uk;

  const copy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const depositHref = computed(() => cabinetLink("/payments/create"));

  const updatePointerOffset = (x = 0, y = 0) => {
    pageRef.value?.style.setProperty("--replenishment-orb-x", `${x}px`);
    pageRef.value?.style.setProperty("--replenishment-orb-y", `${y}px`);
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
  :global(body.account-replenishment-route .page-content),
  :global(body.account-replenishment-route .page--inner) {
    background-color: #fff;
  }

  .replenishment-page {
    --replenishment-orb-x: 0px;
    --replenishment-orb-y: 0px;
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

  .replenishment-hero {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: minmax(360px, 0.72fr) minmax(520px, 1.28fr);
    align-items: center;
    gap: clamp(24px, 3vw, 60px);
    min-height: min(620px, calc(100svh - 132px));
    padding: clamp(24px, 3vw, 38px) 0 clamp(36px, 5vw, 76px);

    &__content {
      position: relative;
      z-index: 2;
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
      min-width: 0;
      margin-left: clamp(-60px, -3vw, -20px);

      img {
        display: block;
        width: min(100%, 842px);
        height: auto;
        mix-blend-mode: multiply;
        object-fit: contain;
      }
    }
  }

  .replenishment-benefits {
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

  .replenishment-methods,
  .replenishment-flow,
  .replenishment-details {
    display: grid;
    gap: 30px;
  }

  .replenishment-methods,
  .replenishment-flow {
    position: relative;
    isolation: isolate;
  }

  .replenishment-methods::before,
  .replenishment-flow::before {
    content: "";
    position: absolute;
    z-index: -1;
    pointer-events: none;
  }

  .replenishment-methods::before {
    top: -92px;
    right: -120px;
    width: min(44vw, 520px);
    height: min(36vw, 430px);
    background: radial-gradient(circle, rgba(255, 132, 51, 0.14) 0%, rgba(255, 132, 51, 0.07) 32%, transparent 72%);
    filter: blur(10px);
  }

  .replenishment-flow::before {
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
      transform: translate(var(--replenishment-orb-x), var(--replenishment-orb-y));
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
      transform: translate(var(--replenishment-orb-x), var(--replenishment-orb-y));
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

  .replenishment-details {
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

  .replenishment-button {
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

  :global(:root[data-theme="dark"] .replenishment-hero h1),
  :global(:root[data-theme="dark"] .replenishment-benefits h2),
  :global(:root[data-theme="dark"] .section-head h2),
  :global(:root[data-theme="dark"] .method-card dt),
  :global(:root[data-theme="dark"] .method-card dd),
  :global(:root[data-theme="dark"] .flow-steps h3),
  :global(:root[data-theme="dark"] .replenishment-details p) {
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
    .replenishment-hero {
      grid-template-columns: minmax(320px, 0.84fr) minmax(420px, 1.16fr);
    }

    .flow-steps li {
      &:nth-child(n) {
        margin-left: 0;
      }
    }
  }

  @media (max-width: 991px) {
    .replenishment-page {
      gap: 62px;
    }

    .replenishment-hero {
      grid-template-columns: 1fr;
      min-height: 0;

      &__media {
        order: -1;
        margin-left: 0;
      }
    }

    .replenishment-benefits,
    .method-grid,
    .replenishment-details,
    .replenishment-details ul {
      grid-template-columns: 1fr;
    }

    .replenishment-benefits article {
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

    .replenishment-hero {
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

    .replenishment-button {
      width: 100%;
      min-width: 0;
    }
  }
</style>
