<template>
  <UiContainer>
    <section
      ref="pageRef"
      class="funding-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <header class="funding-hero">
        <span class="funding-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p>{{ pageCopy.intro }}</p>

        <div class="funding-hero__meta">
          <span
            v-for="item in pageCopy.meta"
            :key="item">
            {{ item }}
          </span>
        </div>
      </header>

      <section class="funding-summary">
        <article
          v-for="item in pageCopy.summary"
          :key="item.title"
          class="funding-summary__item">
          <span
            class="funding-icon"
            :data-symbol="item.symbol" />
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.text }}</p>
          </div>
        </article>
      </section>

      <section class="funding-methods">
        <div class="funding-section-intro">
          <span>{{ pageCopy.methodsEyebrow }}</span>
          <h2>{{ pageCopy.methodsTitle }}</h2>
          <p>{{ pageCopy.methodsText }}</p>
        </div>

        <div class="funding-methods__grid">
          <article
            v-for="method in pageCopy.methods"
            :key="method.name"
            class="funding-method">
            <span
              class="funding-method__icon"
              :data-symbol="method.symbol" />
            <div class="funding-method__body">
              <h3>{{ method.name }}</h3>
              <dl>
                <div>
                  <dt>{{ pageCopy.labels.network }}</dt>
                  <dd>{{ method.network }}</dd>
                </div>
                <div>
                  <dt>{{ pageCopy.labels.asset }}</dt>
                  <dd>{{ method.asset }}</dd>
                </div>
                <div>
                  <dt>{{ pageCopy.labels.timing }}</dt>
                  <dd>{{ method.timing }}</dd>
                </div>
              </dl>
              <p>{{ method.note }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="funding-flow">
        <div class="funding-section-intro">
          <span>{{ pageCopy.flowEyebrow }}</span>
          <h2>{{ pageCopy.flowTitle }}</h2>
          <p>{{ pageCopy.flowText }}</p>
        </div>

        <ol class="funding-flow__steps">
          <li
            v-for="(step, index) in pageCopy.steps"
            :key="step.title">
            <span
              class="funding-step-number"
              :class="`funding-step-number--${index + 1}`">
              <span class="funding-step-number__orb funding-step-number__orb--solid" />
              <span class="funding-step-number__orb funding-step-number__orb--glow" />
              <span class="funding-step-number__value">{{ index + 1 }}</span>
            </span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="funding-rules">
        <div class="funding-section-intro">
          <span>{{ pageCopy.rulesEyebrow }}</span>
          <h2>{{ pageCopy.rulesTitle }}</h2>
        </div>

        <ul>
          <li
            v-for="rule in pageCopy.rules"
            :key="rule">
            <span class="funding-rules__check" />
            <span>{{ rule }}</span>
          </li>
        </ul>
      </section>

      <a
        class="funding-action"
        :href="actionHref">
        {{ pageCopy.actionText }}
        <span>→</span>
      </a>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import useCabinetLink from "~/composables/useCabinetLink";

  type FundingMode = "deposit" | "withdrawal";

  type FundingMethod = {
    name: string;
    symbol: string;
    network: string;
    asset: string;
    timing: string;
    note: string;
  };

  type FundingCopy = {
    eyebrow: string;
    intro: string;
    meta: string[];
    summary: Array<{
      symbol: string;
      title: string;
      text: string;
    }>;
    methodsEyebrow: string;
    methodsTitle: string;
    methodsText: string;
    flowEyebrow: string;
    flowTitle: string;
    flowText: string;
    rulesEyebrow: string;
    rulesTitle: string;
    actionText: string;
    labels: {
      network: string;
      asset: string;
      timing: string;
    };
    methods: FundingMethod[];
    steps: Array<{
      title: string;
      text: string;
    }>;
    rules: string[];
  };

  const props = defineProps<{
    mode: FundingMode;
  }>();

  const { t, locale } = useI18n();
  const { cabinetLink } = useCabinetLink();
  const pageRef = ref<HTMLElement | null>(null);

  const copy: Record<FundingMode, Record<string, FundingCopy>> = {
    deposit: {
      en: {
        eyebrow: "Trading conditions",
        intro:
          "Fund a trading account from the cabinet through supported crypto rails. The old rule remains: Ester does not charge a broker deposit commission, while blockchain network fees can apply.",
        meta: ["0% broker deposit commission", "4 crypto methods", "Status in the cabinet"],
        summary: [
          {
            symbol: "0%",
            title: "Broker commission",
            text: "Deposits are accepted without an Ester broker commission; network fees depend on the selected chain.",
          },
          {
            symbol: "$",
            title: "Minimum amount",
            text: "The standard minimum is shown in the cabinet; USDC can start from 3 USD in the current deposit form.",
          },
          {
            symbol: "ID",
            title: "Verification",
            text: "Profile data and compliance status can affect whether finance review is required before crediting.",
          },
        ],
        methodsEyebrow: "Available payment methods",
        methodsTitle: "Use only the crypto methods that exist in the cabinet",
        methodsText:
          "The payment page generates the exact invoice, amount and network instructions. Do not send funds through a different network.",
        flowEyebrow: "Deposit flow",
        flowTitle: "From empty balance to credited funds",
        flowText:
          "The deposit is created by the client in the cabinet; the blockchain transfer is then matched with the invoice and the trading balance.",
        rulesEyebrow: "Important details",
        rulesTitle: "Check these points before sending crypto",
        actionText: "Open deposit in cabinet",
        labels: {
          network: "Network",
          asset: "Asset",
          timing: "Crediting",
        },
        methods: [
          {
            name: "USDT TRC-20",
            symbol: "USDT",
            network: "TRON / TRC20",
            asset: "USDT",
            timing: "After blockchain confirmation and invoice review",
            note: "Use only a TRC20 wallet and the address generated in the cabinet.",
          },
          {
            name: "USDT ERC-20",
            symbol: "USDT",
            network: "Ethereum / ERC20",
            asset: "USDT",
            timing: "After blockchain confirmation and invoice review",
            note: "ERC20 transfers must be sent only to the Ethereum address from the invoice.",
          },
          {
            name: "USDC",
            symbol: "USDC",
            network: "Network shown in the invoice",
            asset: "USDC",
            timing: "After blockchain confirmation and invoice review",
            note: "Follow the payment page exactly; the active USDC network is defined by the cabinet.",
          },
          {
            name: "BTC",
            symbol: "BTC",
            network: "Bitcoin",
            asset: "BTC",
            timing: "After Bitcoin confirmations and invoice review",
            note: "Send BTC only to the generated Bitcoin address.",
          },
        ],
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
        rules: [
          "A transfer sent through the wrong network can be delayed or lost.",
          "Blockchain fees are paid inside the selected network and are not controlled by Ester.",
          "Finance review can be required depending on account status, amount or compliance checks.",
          "Keep the transaction hash and payment confirmation until the balance is updated.",
        ],
      },
      uk: {
        eyebrow: "Умови торгівлі",
        intro:
          "Поповнюйте торговий рахунок з кабінету через підтримувані криптовалютні методи. Базове правило збережено: Ester не бере брокерську комісію за депозит, але комісія блокчейн-мережі можлива.",
        meta: ["0% брокерської комісії", "4 криптометоди", "Статус у кабінеті"],
        summary: [
          {
            symbol: "0%",
            title: "Комісія брокера",
            text: "Поповнення приймаються без брокерської комісії Ester; мережеві комісії залежать від обраного блокчейну.",
          },
          {
            symbol: "$",
            title: "Мінімальна сума",
            text: "Стандартний мінімум показується в кабінеті; для USDC у поточній формі він може стартувати від 3 USD.",
          },
          {
            symbol: "ID",
            title: "Верифікація",
            text: "Дані профілю та комплаєнс-статус можуть впливати на потребу у фінансовій перевірці.",
          },
        ],
        methodsEyebrow: "Доступні методи",
        methodsTitle: "Використовуйте тільки ті криптометоди, які є в кабінеті",
        methodsText:
          "Платіжна сторінка створює точний invoice, суму та інструкції щодо мережі. Не надсилайте кошти через іншу мережу.",
        flowEyebrow: "Флоу поповнення",
        flowTitle: "Від нульового балансу до зарахування коштів",
        flowText:
          "Депозит створюється клієнтом у кабінеті, після чого блокчейн-переказ зіставляється з invoice і торговим балансом.",
        rulesEyebrow: "Важливі деталі",
        rulesTitle: "Перевірте ці пункти перед криптопереказом",
        actionText: "Відкрити депозит у кабінеті",
        labels: {
          network: "Мережа",
          asset: "Актив",
          timing: "Зарахування",
        },
        methods: [
          {
            name: "USDT TRC-20",
            symbol: "USDT",
            network: "TRON / TRC20",
            asset: "USDT",
            timing: "Після підтвердження в мережі та перевірки invoice",
            note: "Використовуйте тільки TRC20-гаманець і адресу, створену в кабінеті.",
          },
          {
            name: "USDT ERC-20",
            symbol: "USDT",
            network: "Ethereum / ERC20",
            asset: "USDT",
            timing: "Після підтвердження в мережі та перевірки invoice",
            note: "ERC20-перекази потрібно надсилати тільки на Ethereum-адресу з invoice.",
          },
          {
            name: "USDC",
            symbol: "USDC",
            network: "Мережа з invoice",
            asset: "USDC",
            timing: "Після підтвердження в мережі та перевірки invoice",
            note: "Дотримуйтеся інструкцій платіжної сторінки; активну мережу USDC визначає кабінет.",
          },
          {
            name: "BTC",
            symbol: "BTC",
            network: "Bitcoin",
            asset: "BTC",
            timing: "Після Bitcoin-підтверджень і перевірки invoice",
            note: "Надсилайте BTC тільки на згенеровану Bitcoin-адресу.",
          },
        ],
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
        rules: [
          "Переказ через неправильну мережу може бути затриманий або втрачений.",
          "Комісії блокчейн-мережі сплачуються всередині обраної мережі та не контролюються Ester.",
          "Фінансова перевірка може знадобитися залежно від статусу рахунку, суми або комплаєнсу.",
          "Зберігайте transaction hash і підтвердження платежу до оновлення балансу.",
        ],
      },
      ru: {
        eyebrow: "Условия торговли",
        intro:
          "Пополняйте торговый счет из кабинета через поддерживаемые криптовалютные методы. Базовое правило сохранено: Ester не берет брокерскую комиссию за депозит, но комиссия блокчейн-сети возможна.",
        meta: ["0% брокерской комиссии", "4 криптометода", "Статус в кабинете"],
        summary: [
          {
            symbol: "0%",
            title: "Комиссия брокера",
            text: "Пополнения принимаются без брокерской комиссии Ester; сетевые комиссии зависят от выбранного блокчейна.",
          },
          {
            symbol: "$",
            title: "Минимальная сумма",
            text: "Стандартный минимум показывается в кабинете; для USDC в текущей форме он может начинаться от 3 USD.",
          },
          {
            symbol: "ID",
            title: "Верификация",
            text: "Данные профиля и комплаенс-статус могут влиять на необходимость финансовой проверки.",
          },
        ],
        methodsEyebrow: "Доступные методы",
        methodsTitle: "Используйте только те криптометоды, которые есть в кабинете",
        methodsText:
          "Платежная страница создает точный invoice, сумму и инструкции по сети. Не отправляйте средства через другую сеть.",
        flowEyebrow: "Флоу пополнения",
        flowTitle: "От нулевого баланса до зачисления средств",
        flowText:
          "Депозит создается клиентом в кабинете, после чего блокчейн-перевод сопоставляется с invoice и торговым балансом.",
        rulesEyebrow: "Важные детали",
        rulesTitle: "Проверьте эти пункты перед криптопереводом",
        actionText: "Открыть депозит в кабинете",
        labels: {
          network: "Сеть",
          asset: "Актив",
          timing: "Зачисление",
        },
        methods: [
          {
            name: "USDT TRC-20",
            symbol: "USDT",
            network: "TRON / TRC20",
            asset: "USDT",
            timing: "После подтверждения в сети и проверки invoice",
            note: "Используйте только TRC20-кошелек и адрес, созданный в кабинете.",
          },
          {
            name: "USDT ERC-20",
            symbol: "USDT",
            network: "Ethereum / ERC20",
            asset: "USDT",
            timing: "После подтверждения в сети и проверки invoice",
            note: "ERC20-переводы нужно отправлять только на Ethereum-адрес из invoice.",
          },
          {
            name: "USDC",
            symbol: "USDC",
            network: "Сеть из invoice",
            asset: "USDC",
            timing: "После подтверждения в сети и проверки invoice",
            note: "Следуйте инструкциям платежной страницы; активную сеть USDC определяет кабинет.",
          },
          {
            name: "BTC",
            symbol: "BTC",
            network: "Bitcoin",
            asset: "BTC",
            timing: "После Bitcoin-подтверждений и проверки invoice",
            note: "Отправляйте BTC только на сгенерированный Bitcoin-адрес.",
          },
        ],
        steps: [
          {
            title: "Создайте или откройте кабинет",
            text: "Войдите в клиентский кабинет, выберите торговый счет и проверьте данные профиля.",
          },
          {
            title: "Выберите криптометод",
            text: "Выберите USDT TRC-20, USDT ERC-20, USDC или BTC и введите сумму в USD.",
          },
          {
            title: "Откройте созданный invoice",
            text: "Кабинет создает платежную страницу с точным адресом, сетью и инструкциями по сумме.",
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
        rules: [
          "Перевод через неправильную сеть может быть задержан или потерян.",
          "Комиссии блокчейн-сети оплачиваются внутри выбранной сети и не контролируются Ester.",
          "Финансовая проверка может понадобиться в зависимости от статуса счета, суммы или комплаенса.",
          "Храните transaction hash и подтверждение платежа до обновления баланса.",
        ],
      },
    },
    withdrawal: {
      en: {
        eyebrow: "Trading conditions",
        intro:
          "Withdrawals are requested from the cabinet and reviewed by finance before a crypto transfer is sent. Use the same four supported crypto rails for withdrawal details.",
        meta: ["Manual finance approval", "4 crypto methods", "From minutes to 3 banking days"],
        summary: [
          {
            symbol: "OK",
            title: "Approval first",
            text: "A withdrawal request is checked before funds are sent; this protects balances and keeps finance operations controlled.",
          },
          {
            symbol: "TX",
            title: "Crypto transfer",
            text: "The receiving wallet must support the exact asset and network selected in the cabinet.",
          },
          {
            symbol: "3D",
            title: "Processing time",
            text: "After review, processing can take from a few minutes to 3 banking days depending on checks and network state.",
          },
        ],
        methodsEyebrow: "Available withdrawal methods",
        methodsTitle: "Withdraw through the same supported crypto rails",
        methodsText:
          "The cabinet collects wallet details and shows the exact payment method. Use only wallets that support the selected network.",
        flowEyebrow: "Withdrawal flow",
        flowTitle: "From request to outgoing transfer",
        flowText:
          "The finance team reviews the request, checks details and then processes the payout through the selected crypto method.",
        rulesEyebrow: "Important details",
        rulesTitle: "What can affect withdrawal processing",
        actionText: "Open withdrawals in cabinet",
        labels: {
          network: "Network",
          asset: "Asset",
          timing: "Transfer",
        },
        methods: [
          {
            name: "USDT TRC-20",
            symbol: "USDT",
            network: "TRON / TRC20",
            asset: "USDT",
            timing: "After finance approval",
            note: "Enter only a wallet that accepts USDT on TRC20.",
          },
          {
            name: "USDT ERC-20",
            symbol: "USDT",
            network: "Ethereum / ERC20",
            asset: "USDT",
            timing: "After finance approval",
            note: "Enter only an Ethereum wallet that accepts ERC20 USDT.",
          },
          {
            name: "USDC",
            symbol: "USDC",
            network: "Network shown in the cabinet",
            asset: "USDC",
            timing: "After finance approval",
            note: "Use the USDC network shown in the withdrawal form.",
          },
          {
            name: "BTC",
            symbol: "BTC",
            network: "Bitcoin",
            asset: "BTC",
            timing: "After finance approval",
            note: "Enter only a valid Bitcoin wallet address.",
          },
        ],
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
        rules: [
          "Incorrect wallet or network details can delay the payout or make it unrecoverable.",
          "Additional verification can be requested before finance approval.",
          "The cabinet shows the active payment method, limits and request status.",
          "Blockchain load can affect the final time until funds appear in the receiving wallet.",
        ],
      },
      uk: {
        eyebrow: "Умови торгівлі",
        intro:
          "Виведення створюється в кабінеті та проходить фінансову перевірку перед криптопереказом. Для виведення використовуйте ті самі чотири підтримувані криптометоди.",
        meta: ["Ручне погодження фінансів", "4 криптометоди", "Від хвилин до 3 банківських днів"],
        summary: [
          {
            symbol: "OK",
            title: "Спочатку погодження",
            text: "Заявка перевіряється до відправки коштів; це захищає баланс і тримає фінансові операції під контролем.",
          },
          {
            symbol: "TX",
            title: "Криптопереказ",
            text: "Гаманець отримувача має підтримувати точний актив і мережу, вибрані в кабінеті.",
          },
          {
            symbol: "3D",
            title: "Строк обробки",
            text: "Після перевірки обробка може займати від кількох хвилин до 3 банківських днів.",
          },
        ],
        methodsEyebrow: "Доступні методи виведення",
        methodsTitle: "Виводьте через ті самі підтримувані криптометоди",
        methodsText:
          "Кабінет збирає реквізити гаманця та показує точний метод. Використовуйте лише гаманці, що підтримують вибрану мережу.",
        flowEyebrow: "Флоу виведення",
        flowTitle: "Від заявки до вихідного переказу",
        flowText:
          "Фінансова команда перевіряє заявку, реквізити й після цього обробляє виплату через вибраний криптометод.",
        rulesEyebrow: "Важливі деталі",
        rulesTitle: "Що може вплинути на обробку виведення",
        actionText: "Відкрити виведення в кабінеті",
        labels: {
          network: "Мережа",
          asset: "Актив",
          timing: "Переказ",
        },
        methods: [
          {
            name: "USDT TRC-20",
            symbol: "USDT",
            network: "TRON / TRC20",
            asset: "USDT",
            timing: "Після погодження фінансів",
            note: "Вказуйте тільки гаманець, що приймає USDT у TRC20.",
          },
          {
            name: "USDT ERC-20",
            symbol: "USDT",
            network: "Ethereum / ERC20",
            asset: "USDT",
            timing: "Після погодження фінансів",
            note: "Вказуйте тільки Ethereum-гаманець, що приймає ERC20 USDT.",
          },
          {
            name: "USDC",
            symbol: "USDC",
            network: "Мережа з кабінету",
            asset: "USDC",
            timing: "Після погодження фінансів",
            note: "Використовуйте мережу USDC, яку показує форма виведення.",
          },
          {
            name: "BTC",
            symbol: "BTC",
            network: "Bitcoin",
            asset: "BTC",
            timing: "Після погодження фінансів",
            note: "Вказуйте лише валідну Bitcoin-адресу.",
          },
        ],
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
        rules: [
          "Некоректний гаманець або мережа можуть затримати виплату або зробити її невідновлюваною.",
          "Перед погодженням фінансів може знадобитися додаткова верифікація.",
          "Кабінет показує активний метод, ліміти та статус заявки.",
          "Завантаження блокчейну може впливати на час надходження коштів на гаманець.",
        ],
      },
      ru: {
        eyebrow: "Условия торговли",
        intro:
          "Вывод создается в кабинете и проходит финансовую проверку перед криптопереводом. Для вывода используйте те же четыре поддерживаемые криптометода.",
        meta: ["Ручное согласование финансов", "4 криптометода", "От минут до 3 банковских дней"],
        summary: [
          {
            symbol: "OK",
            title: "Сначала согласование",
            text: "Заявка проверяется до отправки средств; это защищает баланс и держит финансовые операции под контролем.",
          },
          {
            symbol: "TX",
            title: "Криптоперевод",
            text: "Кошелек получателя должен поддерживать точный актив и сеть, выбранные в кабинете.",
          },
          {
            symbol: "3D",
            title: "Срок обработки",
            text: "После проверки обработка может занимать от нескольких минут до 3 банковских дней.",
          },
        ],
        methodsEyebrow: "Доступные методы вывода",
        methodsTitle: "Выводите через те же поддерживаемые криптометоды",
        methodsText:
          "Кабинет собирает реквизиты кошелька и показывает точный метод. Используйте только кошельки, поддерживающие выбранную сеть.",
        flowEyebrow: "Флоу вывода",
        flowTitle: "От заявки до исходящего перевода",
        flowText:
          "Финансовая команда проверяет заявку, реквизиты и после этого обрабатывает выплату через выбранный криптометод.",
        rulesEyebrow: "Важные детали",
        rulesTitle: "Что может повлиять на обработку вывода",
        actionText: "Открыть вывод в кабинете",
        labels: {
          network: "Сеть",
          asset: "Актив",
          timing: "Перевод",
        },
        methods: [
          {
            name: "USDT TRC-20",
            symbol: "USDT",
            network: "TRON / TRC20",
            asset: "USDT",
            timing: "После согласования финансов",
            note: "Указывайте только кошелек, который принимает USDT в TRC20.",
          },
          {
            name: "USDT ERC-20",
            symbol: "USDT",
            network: "Ethereum / ERC20",
            asset: "USDT",
            timing: "После согласования финансов",
            note: "Указывайте только Ethereum-кошелек, который принимает ERC20 USDT.",
          },
          {
            name: "USDC",
            symbol: "USDC",
            network: "Сеть из кабинета",
            asset: "USDC",
            timing: "После согласования финансов",
            note: "Используйте сеть USDC, которую показывает форма вывода.",
          },
          {
            name: "BTC",
            symbol: "BTC",
            network: "Bitcoin",
            asset: "BTC",
            timing: "После согласования финансов",
            note: "Указывайте только валидный Bitcoin-адрес.",
          },
        ],
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
        rules: [
          "Некорректный кошелек или сеть могут задержать выплату или сделать ее невосстановимой.",
          "Перед согласованием финансов может понадобиться дополнительная верификация.",
          "Кабинет показывает активный метод, лимиты и статус заявки.",
          "Загрузка блокчейна может влиять на время поступления средств на кошелек.",
        ],
      },
    },
  };

  const title = computed(() =>
    props.mode === "deposit"
      ? t("landing.pages.trading.account_replenishment_title")
      : t("landing.pages.trading.withdrawal_funds_title")
  );

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return copy[props.mode][language] ?? copy[props.mode].en;
  });

  const actionHref = computed(() => cabinetLink(props.mode === "deposit" ? "/payments/create" : "/payments"));

  const updatePointerOffset = (x = 0, y = 0) => {
    pageRef.value?.style.setProperty("--funding-orb-x", `${x}px`);
    pageRef.value?.style.setProperty("--funding-orb-y", `${y}px`);
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
  .funding-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    --funding-orb-x: 0px;
    --funding-orb-y: 0px;
    color: var(--landing-text-primary);
  }

  .funding-hero {
    max-width: 1040px;
    margin: 0 auto;
    text-align: center;

    &__eyebrow {
      display: inline-flex;
      margin-bottom: 14px;
      color: var(--landing-accent);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(44px, 6vw, 78px);
      font-weight: 500;
      line-height: 0.98;
    }

    p {
      max-width: 840px;
      margin: 20px auto 0;
      color: var(--landing-text-secondary);
      font-size: clamp(17px, 1.4vw, 20px);
      font-weight: 600;
      line-height: 1.55;
    }

    &__meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px 18px;
      margin-top: 28px;

      span {
        display: inline-flex;
        align-items: center;
        color: var(--landing-text-secondary);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.2;

        &::before {
          content: "";
          width: 6px;
          height: 6px;
          margin-right: 10px;
          border-radius: 50%;
          background: var(--landing-accent);
        }
      }
    }
  }

  .funding-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(22px, 3vw, 42px);
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(38px, 4vw, 58px);

    &__item {
      display: grid;
      grid-template-columns: 62px minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }

    h2 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: clamp(20px, 2vw, 28px);
      font-weight: 800;
      line-height: 1.15;
    }

    p {
      margin: 10px 0 0;
      color: var(--landing-text-secondary);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .funding-icon,
  .funding-method__icon {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 42%, transparent);
    border-radius: 16px;
    background: color-mix(in srgb, var(--landing-surface-elevated) 22%, transparent);
    color: var(--landing-accent);
    font-size: 15px;
    font-weight: 900;
    line-height: 1;

    &::before {
      content: attr(data-symbol);
      position: relative;
      z-index: 1;
    }
  }

  .funding-section-intro {
    span {
      color: var(--landing-accent);
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
    }

    h2 {
      max-width: 780px;
      margin: 12px 0 0;
      color: var(--landing-text-strong);
      font-size: clamp(28px, 3vw, 42px);
      font-weight: 500;
      line-height: 1.08;
    }

    p {
      max-width: 820px;
      margin: 16px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.55;
    }
  }

  .funding-methods,
  .funding-flow,
  .funding-rules {
    display: grid;
    grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
    gap: clamp(34px, 5vw, 70px);
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(38px, 4vw, 58px);
  }

  .funding-methods__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 28px;
  }

  .funding-method {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-bottom: 22px;

    h3 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 20px;
      font-weight: 900;
      line-height: 1.15;
    }

    dl {
      display: grid;
      gap: 10px;
      margin: 16px 0 0;
    }

    dl div {
      display: grid;
      grid-template-columns: minmax(92px, 0.42fr) minmax(0, 1fr);
      gap: 14px;
      align-items: baseline;
    }

    dt {
      color: var(--landing-text-secondary);
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.35;
    }

    p {
      margin: 16px 0 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 600;
      line-height: 1.5;
    }

    &__icon {
      width: 58px;
      height: 58px;
      font-size: 13px;
    }
  }

  .funding-flow__steps {
    display: grid;
    gap: 15px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 16px;
      align-items: start;
      border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
      padding-bottom: 18px;

      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }

    h3 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.25;
    }

    p {
      margin: 7px 0 0;
      color: var(--landing-text-secondary);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .funding-step-number {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 66px;
    border: 0;
    border-radius: 18px;
    overflow: visible;
    isolation: isolate;
    background: transparent;
    box-shadow: none;

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
      backdrop-filter: blur(16px) saturate(145%);
      -webkit-backdrop-filter: blur(16px) saturate(145%);
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
      pointer-events: none;
      border-radius: 999px;
      transform: translate(var(--funding-orb-x), var(--funding-orb-y));
      transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }

    &__orb--solid {
      z-index: 0;
      width: 31px;
      height: 31px;
      top: -8px;
      right: -10px;
      background: linear-gradient(145deg, #1b63ff 0%, #4d86ff 100%);
    }

    &__orb--glow {
      z-index: 0;
      width: 22px;
      height: 22px;
      top: 8px;
      right: 5px;
      background: radial-gradient(circle, rgba(142, 181, 255, 0.95) 0%, rgba(60, 122, 255, 0.62) 44%, transparent 72%);
      filter: blur(3px);
    }

    &__value {
      position: relative;
      z-index: 3;
      color: var(--landing-accent);
      font-size: 32px;
      font-weight: 500;
      line-height: 1;
    }
  }

  :global(:root[data-theme="dark"] .funding-step-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
  }

  .funding-rules {
    align-items: start;

    ul {
      display: grid;
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      gap: 14px;
      align-items: start;
      color: var(--landing-text-primary);
      font-size: 16px;
      font-weight: 700;
      line-height: 1.45;
    }

    &__check {
      position: relative;
      width: 22px;
      height: 22px;
      margin-top: 1px;
      border: 1px solid color-mix(in srgb, var(--landing-accent) 72%, var(--landing-line));
      border-radius: 50%;
      background: color-mix(in srgb, var(--landing-accent) 13%, transparent);

      &::after {
        content: "";
        position: absolute;
        top: 5px;
        left: 7px;
        width: 6px;
        height: 10px;
        border-right: 2px solid var(--landing-accent);
        border-bottom: 2px solid var(--landing-accent);
        transform: rotate(45deg);
      }
    }
  }

  .funding-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    align-self: flex-start;
    min-width: 250px;
    min-height: 64px;
    border-radius: 18px;
    background: var(--landing-accent);
    color: white;
    padding: 0 28px;
    font-size: 18px;
    font-weight: 900;
    line-height: 1.2;
    text-decoration: none;

    span {
      font-size: 30px;
      line-height: 1;
      transition: transform 0.2s ease;
    }

    &:hover span {
      transform: translateX(4px);
    }
  }

  @media (max-width: 1100px) {
    .funding-summary,
    .funding-methods__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 991px) {
    .funding-page {
      gap: 32px;
    }

    .funding-methods,
    .funding-flow,
    .funding-rules {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 575px) {
    .funding-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .funding-summary__item,
    .funding-method,
    .funding-method dl div,
    .funding-flow__steps li {
      grid-template-columns: 1fr;
    }

    .funding-action {
      width: 100%;
    }
  }
</style>
