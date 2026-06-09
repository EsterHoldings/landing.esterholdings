export type StaticPageSection = {
  title: string;
  text?: string;
  items?: string[];
};

export type StaticPageContent = {
  eyebrow: string;
  lead: string;
  highlights: string[];
  sections: StaticPageSection[];
};

type StaticPageKey =
  | "forTrader"
  | "forInvestor"
  | "platform"
  | "tradingConditions"
  | "accountReplenishment"
  | "withdrawalFunds"
  | "tradingHub"
  | "tandemTrading"
  | "generateIncome";

type LocaleContent = Partial<Record<StaticPageKey, StaticPageContent>>;

const en: LocaleContent = {
  forTrader: {
    eyebrow: "Trading workflow",
    lead: "A practical overview for active traders who need fast onboarding, clear account settings and stable access to the platform.",
    highlights: ["Multi-asset access", "Fast verification flow", "Support for live trading"],
    sections: [
      {
        title: "Start with the right account",
        text: "Choose an account type that matches your trading volume, execution expectations and preferred platform setup.",
      },
      {
        title: "Prepare before funding",
        items: ["Complete verification", "Review trading conditions", "Set up MT4 on desktop or mobile"],
      },
      {
        title: "Trade with control",
        text: "Monitor margin, risk and order execution from one workspace while keeping support within reach when questions appear.",
      },
    ],
  },
  forInvestor: {
    eyebrow: "Investment access",
    lead: "A concise route for clients who want market exposure with clear account structure, transparent funding and predictable support.",
    highlights: ["Account guidance", "Funding transparency", "Long-term market access"],
    sections: [
      {
        title: "Understand the account setup",
        text: "Compare available account formats and select the structure that fits your funding plan and investment horizon.",
      },
      {
        title: "Keep operations simple",
        items: ["Verify your profile", "Fund through supported methods", "Track balances and requests in the cabinet"],
      },
      {
        title: "Work with support",
        text: "If you need help with documents, payments or platform access, support can guide the process from the cabinet.",
      },
    ],
  },
  platform: {
    eyebrow: "Trading technology",
    lead: "The platform area connects account access, market instruments and trading tools in one predictable workflow.",
    highlights: ["MT4 access", "Desktop and mobile use", "Market watch and orders"],
    sections: [
      {
        title: "One familiar environment",
        text: "Use MetaTrader tools for charting, market observation and order management across supported instruments.",
      },
      {
        title: "Built for daily work",
        items: ["Desktop terminal", "Mobile app", "Trading history", "Order and position control"],
      },
      {
        title: "Connected to the cabinet",
        text: "Manage profile, funding, withdrawals and support requests from the cabinet while keeping the trading terminal focused on execution.",
      },
    ],
  },
  tradingConditions: {
    eyebrow: "Execution terms",
    lead: "Core trading conditions are structured around transparent instruments, account types and operational rules.",
    highlights: ["Clear account terms", "Instrument coverage", "Risk-aware trading"],
    sections: [
      {
        title: "Before opening trades",
        text: "Review spreads, margin requirements, execution details and session availability for each instrument category.",
      },
      {
        title: "Account-dependent settings",
        items: ["Minimum deposit may vary by account type", "Trading costs depend on market and account conditions", "Leverage and margin rules must be checked before trading"],
      },
      {
        title: "Operational clarity",
        text: "Trading conditions should be reviewed together with the client agreement and non-trading operation rules.",
      },
    ],
  },
  accountReplenishment: {
    eyebrow: "Funding",
    lead: "Account replenishment is handled through supported payment methods with verification and operational checks where required.",
    highlights: ["Supported methods", "Verification checks", "Cabinet request tracking"],
    sections: [
      {
        title: "Before a deposit",
        items: ["Make sure your profile data is correct", "Use a payment method available for your region", "Keep payment confirmation until funds are credited"],
      },
      {
        title: "Processing",
        text: "Some deposits may require manual review depending on payment method, account status or compliance requirements.",
      },
      {
        title: "Where to track it",
        text: "Deposit status and support messages are available in the client cabinet.",
      },
    ],
  },
  withdrawalFunds: {
    eyebrow: "Withdrawals",
    lead: "Withdrawal requests are reviewed through the cabinet so the finance team can process them with the required checks.",
    highlights: ["Manual approval", "Finance review", "Request history"],
    sections: [
      {
        title: "Submit from the cabinet",
        text: "Create a withdrawal request with correct details and make sure your verification status allows finance operations.",
      },
      {
        title: "What can affect timing",
        items: ["Incorrect payment details", "Additional verification requests", "Payment provider processing time"],
      },
      {
        title: "Support",
        text: "If a request needs clarification, the finance or support team will contact you through the cabinet or email.",
      },
    ],
  },
  tradingHub: {
    eyebrow: "Trader resources",
    lead: "Trader's HUB brings together market context, platform access and practical materials for daily trading decisions.",
    highlights: ["Market updates", "Educational materials", "Platform guidance"],
    sections: [
      {
        title: "Market context",
        text: "Use news, economic events and analytical materials to understand the background behind market movement.",
      },
      {
        title: "Practical workflow",
        items: ["Check the calendar", "Review market news", "Prepare watchlists", "Manage risk before entry"],
      },
      {
        title: "For regular use",
        text: "The HUB is designed as a starting point for traders who want to keep platform, markets and support close together.",
      },
    ],
  },
  tandemTrading: {
    eyebrow: "Managed cooperation",
    lead: "Tandem trading is presented as a cooperation format where account operation, expectations and risk boundaries must be clearly agreed.",
    highlights: ["Cooperation format", "Transparent terms", "Risk boundaries"],
    sections: [
      {
        title: "What to clarify first",
        items: ["Account ownership", "Risk limits", "Reporting format", "Operational permissions"],
      },
      {
        title: "Client control",
        text: "Any cooperation model should keep the client informed about account status, trading activity and related risks.",
      },
      {
        title: "Important note",
        text: "Trading always involves risk. Review all conditions before choosing this format.",
      },
    ],
  },
  generateIncome: {
    eyebrow: "Partner revenue",
    lead: "IB income is built around client acquisition, transparent attribution and partner activity that follows the program rules.",
    highlights: ["Referral tracking", "Partner cabinet", "Program rules"],
    sections: [
      {
        title: "How attribution works",
        text: "Clients who register through a valid partner link or code can be attached to the partner structure according to the program rules.",
      },
      {
        title: "What partners should focus on",
        items: ["Quality traffic", "Clear communication", "No misleading promotion", "Long-term client support"],
      },
      {
        title: "Income logic",
        text: "Reward rules depend on the active partner program terms and can vary by client activity, level or agreement.",
      },
    ],
  },
};

const uk: LocaleContent = {
  forTrader: {
    eyebrow: "Торговий процес",
    lead: "Практичний огляд для активних трейдерів, яким потрібні швидкий старт, зрозумілі налаштування рахунку та стабільний доступ до платформи.",
    highlights: ["Доступ до різних класів активів", "Швидка верифікація", "Підтримка для реальної торгівлі"],
    sections: [
      { title: "Почніть з правильного рахунку", text: "Оберіть тип рахунку, який відповідає вашому обсягу торгівлі, очікуванням щодо виконання та формату роботи." },
      { title: "Підготуйтеся до поповнення", items: ["Пройдіть верифікацію", "Перегляньте торгові умови", "Налаштуйте MT4 на десктопі або мобільному"] },
      { title: "Торгуйте з контролем", text: "Стежте за маржею, ризиком і виконанням ордерів в одному робочому процесі." },
    ],
  },
  forInvestor: {
    eyebrow: "Інвестиційний доступ",
    lead: "Зрозумілий шлях для клієнтів, які хочуть отримати доступ до ринків із прозорим рахунком, поповненням і підтримкою.",
    highlights: ["Підбір рахунку", "Прозоре фінансування", "Доступ до ринків"],
    sections: [
      { title: "Розберіться зі структурою рахунку", text: "Порівняйте доступні формати рахунків і оберіть той, що відповідає вашому плану." },
      { title: "Тримайте операції простими", items: ["Підтвердіть профіль", "Поповнюйте рахунок доступними методами", "Відстежуйте заявки в кабінеті"] },
      { title: "Працюйте з підтримкою", text: "Питання щодо документів, платежів або доступу до платформи можна вирішувати через кабінет." },
    ],
  },
  platform: {
    eyebrow: "Торгова технологія",
    lead: "Платформа об'єднує доступ до рахунку, ринкові інструменти та торгові можливості в одному зрозумілому процесі.",
    highlights: ["Доступ до MT4", "Десктоп і мобільний формат", "Графіки та ордери"],
    sections: [
      { title: "Знайоме середовище", text: "Використовуйте інструменти MetaTrader для графіків, ринкового огляду та керування ордерами." },
      { title: "Для щоденної роботи", items: ["Десктопний термінал", "Мобільний застосунок", "Історія торгівлі", "Контроль позицій"] },
      { title: "Зв'язок з кабінетом", text: "Профіль, поповнення, виведення і підтримка керуються з кабінету, а термінал залишається для торгівлі." },
    ],
  },
  tradingConditions: {
    eyebrow: "Умови виконання",
    lead: "Торгові умови побудовані навколо прозорих інструментів, типів рахунків і операційних правил.",
    highlights: ["Зрозумілі умови", "Покриття інструментів", "Контроль ризику"],
    sections: [
      { title: "Перед відкриттям угод", text: "Перегляньте спреди, маржинальні вимоги, особливості виконання та доступність торгових сесій." },
      { title: "Налаштування залежать від рахунку", items: ["Мінімальний депозит може відрізнятися", "Витрати залежать від ринку і рахунку", "Плече та маржа потребують перевірки"] },
      { title: "Операційна ясність", text: "Умови варто розглядати разом із клієнтською угодою та правилами неторгових операцій." },
    ],
  },
  accountReplenishment: {
    eyebrow: "Поповнення",
    lead: "Поповнення рахунку проходить через підтримувані методи оплати з перевірками, якщо вони потрібні.",
    highlights: ["Підтримувані методи", "Перевірки", "Статус у кабінеті"],
    sections: [
      { title: "Перед депозитом", items: ["Перевірте дані профілю", "Використовуйте доступний для вашого регіону метод", "Збережіть підтвердження платежу"] },
      { title: "Обробка", text: "Деякі депозити можуть потребувати ручної перевірки залежно від методу, статусу рахунку або комплаєнсу." },
      { title: "Де відстежувати", text: "Статус депозиту та повідомлення підтримки доступні в кабінеті клієнта." },
    ],
  },
  withdrawalFunds: {
    eyebrow: "Виведення коштів",
    lead: "Заявки на виведення перевіряються через кабінет, щоб фінансова команда могла обробити їх коректно.",
    highlights: ["Ручне погодження", "Фінансова перевірка", "Історія заявок"],
    sections: [
      { title: "Створіть заявку в кабінеті", text: "Вкажіть коректні реквізити та переконайтеся, що статус верифікації дозволяє фінансові операції." },
      { title: "Що впливає на строки", items: ["Некоректні реквізити", "Додаткова перевірка", "Строки платіжного провайдера"] },
      { title: "Підтримка", text: "Якщо потрібне уточнення, команда зв'яжеться з вами через кабінет або email." },
    ],
  },
  tradingHub: {
    eyebrow: "Ресурси трейдера",
    lead: "Trader's HUB об'єднує ринковий контекст, платформу та практичні матеріали для щоденних рішень.",
    highlights: ["Оновлення ринку", "Навчальні матеріали", "Підказки щодо платформи"],
    sections: [
      { title: "Ринковий контекст", text: "Використовуйте новини, економічні події й аналітичні матеріали, щоб краще розуміти рух ринку." },
      { title: "Практичний процес", items: ["Перевірте календар", "Огляньте ринкові новини", "Підготуйте watchlist", "Контролюйте ризик"] },
      { title: "Для регулярної роботи", text: "HUB створений як стартова точка для трейдера, де поруч ринки, платформа і підтримка." },
    ],
  },
  tandemTrading: {
    eyebrow: "Формат співпраці",
    lead: "Tandem trading описує формат співпраці, де умови, очікування та межі ризику мають бути зрозумілими заздалегідь.",
    highlights: ["Формат співпраці", "Прозорі умови", "Межі ризику"],
    sections: [
      { title: "Що уточнити спочатку", items: ["Право власності на рахунок", "Ліміти ризику", "Формат звітності", "Операційні дозволи"] },
      { title: "Контроль клієнта", text: "Клієнт має розуміти стан рахунку, торгову активність і пов'язані ризики." },
      { title: "Важливо", text: "Торгівля завжди пов'язана з ризиком. Перегляньте всі умови перед вибором такого формату." },
    ],
  },
  generateIncome: {
    eyebrow: "Партнерський дохід",
    lead: "Дохід IB будується навколо залучення клієнтів, прозорої атрибуції та активності за правилами програми.",
    highlights: ["Реферальне відстеження", "Партнерський кабінет", "Правила програми"],
    sections: [
      { title: "Як працює атрибуція", text: "Клієнти, що реєструються через валідне партнерське посилання або код, можуть бути прив'язані до партнерської структури." },
      { title: "Фокус партнера", items: ["Якісний трафік", "Чесна комунікація", "Без оманливої реклами", "Довгострокова підтримка клієнта"] },
      { title: "Логіка доходу", text: "Винагорода залежить від актуальних умов партнерської програми та може відрізнятися за активністю або рівнем." },
    ],
  },
};

const ru: LocaleContent = {
  forTrader: {
    eyebrow: "Торговый процесс",
    lead: "Практичный обзор для активных трейдеров, которым нужен быстрый старт, понятные настройки счета и стабильный доступ к платформе.",
    highlights: ["Доступ к разным классам активов", "Быстрая верификация", "Поддержка реальной торговли"],
    sections: [
      { title: "Начните с правильного счета", text: "Выберите тип счета под ваш объем торговли, ожидания по исполнению и формат работы." },
      { title: "Подготовьтесь к пополнению", items: ["Пройдите верификацию", "Проверьте торговые условия", "Настройте MT4 на десктопе или мобильном"] },
      { title: "Торгуйте с контролем", text: "Следите за маржей, риском и исполнением ордеров в одном рабочем процессе." },
    ],
  },
  forInvestor: {
    eyebrow: "Инвестиционный доступ",
    lead: "Понятный маршрут для клиентов, которым нужен доступ к рынкам с прозрачной структурой счета, пополнением и поддержкой.",
    highlights: ["Подбор счета", "Прозрачное финансирование", "Доступ к рынкам"],
    sections: [
      { title: "Разберитесь со структурой счета", text: "Сравните доступные форматы счетов и выберите тот, который соответствует вашему плану." },
      { title: "Держите операции простыми", items: ["Подтвердите профиль", "Пополняйте счет доступными методами", "Отслеживайте заявки в кабинете"] },
      { title: "Работайте с поддержкой", text: "Вопросы по документам, платежам или доступу к платформе можно решать через кабинет." },
    ],
  },
  platform: {
    eyebrow: "Торговая технология",
    lead: "Платформа объединяет доступ к счету, рыночные инструменты и торговые возможности в одном понятном процессе.",
    highlights: ["Доступ к MT4", "Десктоп и мобильный формат", "Графики и ордера"],
    sections: [
      { title: "Знакомая среда", text: "Используйте инструменты MetaTrader для графиков, рыночного обзора и управления ордерами." },
      { title: "Для ежедневной работы", items: ["Десктопный терминал", "Мобильное приложение", "История торговли", "Контроль позиций"] },
      { title: "Связь с кабинетом", text: "Профиль, пополнение, вывод и поддержка управляются из кабинета, а терминал остается для торговли." },
    ],
  },
  tradingConditions: {
    eyebrow: "Условия исполнения",
    lead: "Торговые условия построены вокруг прозрачных инструментов, типов счетов и операционных правил.",
    highlights: ["Понятные условия", "Покрытие инструментов", "Контроль риска"],
    sections: [
      { title: "Перед открытием сделок", text: "Проверьте спреды, маржинальные требования, особенности исполнения и доступность торговых сессий." },
      { title: "Настройки зависят от счета", items: ["Минимальный депозит может отличаться", "Издержки зависят от рынка и счета", "Плечо и маржу нужно проверять заранее"] },
      { title: "Операционная ясность", text: "Условия стоит рассматривать вместе с клиентским соглашением и правилами неторговых операций." },
    ],
  },
  accountReplenishment: {
    eyebrow: "Пополнение",
    lead: "Пополнение счета проходит через поддерживаемые методы оплаты с проверками, если они требуются.",
    highlights: ["Поддерживаемые методы", "Проверки", "Статус в кабинете"],
    sections: [
      { title: "Перед депозитом", items: ["Проверьте данные профиля", "Используйте доступный для вашего региона метод", "Сохраните подтверждение платежа"] },
      { title: "Обработка", text: "Некоторые депозиты могут требовать ручной проверки в зависимости от метода, статуса счета или комплаенса." },
      { title: "Где отслеживать", text: "Статус депозита и сообщения поддержки доступны в кабинете клиента." },
    ],
  },
  withdrawalFunds: {
    eyebrow: "Вывод средств",
    lead: "Заявки на вывод проверяются через кабинет, чтобы финансовая команда могла обработать их корректно.",
    highlights: ["Ручное подтверждение", "Финансовая проверка", "История заявок"],
    sections: [
      { title: "Создайте заявку в кабинете", text: "Укажите корректные реквизиты и убедитесь, что статус верификации позволяет финансовые операции." },
      { title: "Что влияет на сроки", items: ["Некорректные реквизиты", "Дополнительная проверка", "Сроки платежного провайдера"] },
      { title: "Поддержка", text: "Если нужно уточнение, команда свяжется с вами через кабинет или email." },
    ],
  },
  tradingHub: {
    eyebrow: "Ресурсы трейдера",
    lead: "Trader's HUB объединяет рыночный контекст, платформу и практичные материалы для ежедневных решений.",
    highlights: ["Обновления рынка", "Обучающие материалы", "Подсказки по платформе"],
    sections: [
      { title: "Рыночный контекст", text: "Используйте новости, экономические события и аналитические материалы, чтобы лучше понимать движение рынка." },
      { title: "Практичный процесс", items: ["Проверьте календарь", "Посмотрите рыночные новости", "Подготовьте watchlist", "Контролируйте риск"] },
      { title: "Для регулярной работы", text: "HUB создан как стартовая точка для трейдера, где рядом рынки, платформа и поддержка." },
    ],
  },
  tandemTrading: {
    eyebrow: "Формат сотрудничества",
    lead: "Tandem trading описывает формат сотрудничества, где условия, ожидания и границы риска должны быть понятны заранее.",
    highlights: ["Формат сотрудничества", "Прозрачные условия", "Границы риска"],
    sections: [
      { title: "Что уточнить сначала", items: ["Право собственности на счет", "Лимиты риска", "Формат отчетности", "Операционные разрешения"] },
      { title: "Контроль клиента", text: "Клиент должен понимать состояние счета, торговую активность и связанные риски." },
      { title: "Важно", text: "Торговля всегда связана с риском. Проверьте все условия перед выбором такого формата." },
    ],
  },
  generateIncome: {
    eyebrow: "Партнерский доход",
    lead: "Доход IB строится вокруг привлечения клиентов, прозрачной атрибуции и активности по правилам программы.",
    highlights: ["Реферальное отслеживание", "Партнерский кабинет", "Правила программы"],
    sections: [
      { title: "Как работает атрибуция", text: "Клиенты, которые регистрируются через валидную партнерскую ссылку или код, могут быть привязаны к партнерской структуре." },
      { title: "Фокус партнера", items: ["Качественный трафик", "Честная коммуникация", "Без вводящей в заблуждение рекламы", "Долгосрочная поддержка клиента"] },
      { title: "Логика дохода", text: "Вознаграждение зависит от актуальных условий партнерской программы и может отличаться по активности или уровню." },
    ],
  },
};

const contentByLocale: Record<string, LocaleContent> = {
  en,
  uk,
  ru,
};

export const getStaticPageContent = (key: StaticPageKey, locale: string): StaticPageContent => {
  return contentByLocale[locale]?.[key] ?? en[key]!;
};
