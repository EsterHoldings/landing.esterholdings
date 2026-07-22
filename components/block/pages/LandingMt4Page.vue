<template>
  <UiContainer>
    <main class="mt4-page">
      <section class="mt4-hero">
        <div
          class="mt4-hero__glows"
          aria-hidden="true">
          <span class="mt4-hero__glow mt4-hero__glow--blue-1"></span>
          <span class="mt4-hero__glow mt4-hero__glow--blue-2"></span>
          <span class="mt4-hero__glow mt4-hero__glow--orange-1"></span>
          <span class="mt4-hero__glow mt4-hero__glow--orange-2"></span>
        </div>

        <div class="mt4-hero__media">
          <img
            :src="themedAssetPath('mt4-devices.png', 'mt4-devices-dark.png')"
            :alt="copy.heroImageAlt"
            width="1012"
            height="787"
            loading="eager" />
        </div>

        <div class="mt4-hero__content">
          <h1>
            <span>{{ copy.heroTitleAccent }}</span>
            {{ copy.heroTitleRest }}
          </h1>
          <p>{{ copy.heroText }}</p>

          <ul class="mt4-hero__features">
            <li
              v-for="item in heroFeatures"
              :key="item.text">
              <span
                class="mt4-hero__feature-icon"
                :style="{ '--mt4-feature-icon': `url(${assetPath(item.icon)})` }"
                aria-hidden="true"></span>
              <span>{{ item.text }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section
        class="terminal-grid"
        :aria-label="copy.terminalSectionLabel">
        <article class="terminal-card terminal-card--desktop">
          <span class="terminal-card__label">{{ copy.desktop.label }}</span>
          <div class="terminal-card__copy">
            <h2>{{ copy.desktop.title }}</h2>
            <p>{{ copy.desktop.text }}</p>
            <div class="terminal-card__actions">
              <a
                class="mt4-button"
                :href="downloadLinks.windows"
                target="_blank"
                rel="noopener noreferrer">
                {{ copy.desktop.button }}
              </a>
              <a
                class="mt4-button mt4-button--secondary"
                :href="downloadLinks.mac"
                target="_blank"
                rel="noopener noreferrer">
                {{ copy.desktop.secondaryButton }}
              </a>
            </div>
          </div>
          <img
            class="terminal-card__image terminal-card__image--desktop"
            :src="themedAssetPath('desktop-terminal.png', 'desktop-terminal-dark.png')"
            :alt="copy.desktop.imageAlt"
            width="470"
            height="313"
            loading="lazy" />
        </article>

        <article class="terminal-card terminal-card--mobile">
          <span class="terminal-card__label">{{ copy.mobile.label }}</span>
          <div class="terminal-card__copy">
            <h2>{{ copy.mobile.title }}</h2>
            <p>{{ copy.mobile.text }}</p>
            <div class="terminal-card__actions">
              <a
                class="mt4-button"
                :href="downloadLinks.ios"
                target="_blank"
                rel="noopener noreferrer">
                {{ copy.mobile.iosButton }}
              </a>
              <a
                class="mt4-button mt4-button--secondary"
                :href="downloadLinks.android"
                target="_blank"
                rel="noopener noreferrer">
                {{ copy.mobile.androidButton }}
              </a>
            </div>
          </div>
          <img
            class="terminal-card__image terminal-card__image--phone"
            :src="themedAssetPath('mobile-terminal.png', 'mobile-terminal-dark.png')"
            :alt="copy.mobile.imageAlt"
            width="231"
            height="317"
            loading="lazy" />
        </article>
      </section>

      <section class="about-section">
        <div class="about-section__head">
          <div>
            <span class="section-kicker">{{ copy.about.kicker }}</span>
            <h2>{{ copy.about.title }}</h2>
            <strong>{{ copy.about.lead }}</strong>
          </div>
          <p>{{ copy.about.text }}</p>
        </div>

        <div class="about-grid">
          <article
            v-for="item in aboutFeatures"
            :key="item.text"
            class="about-card">
            <span class="about-card__icon">
              <img
                :src="assetPath(item.icon)"
                alt=""
                aria-hidden="true"
                loading="lazy" />
            </span>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </section>

      <section class="mac-section">
        <span class="section-kicker">{{ copy.mac.kicker }}</span>
        <h2>{{ copy.mac.title }}</h2>
        <p>{{ copy.mac.text }}</p>

        <ol class="mac-steps">
          <li
            v-for="(step, index) in copy.mac.steps"
            :key="step">
            <div
              class="mac-step-icon"
              :class="`mac-step-icon--${index + 1}`">
              <span class="mac-step-icon__orb mac-step-icon__orb--solid" />
              <span class="mac-step-icon__orb mac-step-icon__orb--glow" />
              <span class="mac-step-icon__number">{{ index + 1 }}</span>
            </div>
            <p>{{ step }}</p>
          </li>
        </ol>

        <a
          class="mt4-button mt4-button--large"
          :href="downloadLinks.mac"
          target="_blank"
          rel="noopener noreferrer">
          {{ copy.mac.button }}
          <span aria-hidden="true"></span>
        </a>
      </section>

      <section class="requirements-banner">
        <img
          :src="assetPath('system-requirements.png')"
          :alt="copy.requirements.imageAlt"
          width="1167"
          height="211"
          loading="lazy" />
        <div class="requirements-banner__content">
          <span>{{ copy.requirements.title }}</span>
          <p>{{ copy.requirements.text }}</p>
          <a
            class="mt4-button mt4-button--dark"
            :href="downloadLinks.windows"
            target="_blank"
            rel="noopener noreferrer">
            {{ copy.requirements.button }}
          </a>
        </div>
      </section>
    </main>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useHead } from "nuxt/app";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import { useThemeStore } from "~/stores/themeStore";

  defineProps<{
    mode?: "desktop" | "mobile";
  }>();

  useHead({
    bodyAttrs: {
      class: "mt4-route",
    },
  });

  type IconTextItem = {
    icon: string;
    text: string;
  };

  type TerminalCopy = {
    label: string;
    title: string;
    text: string;
    button?: string;
    secondaryButton?: string;
    iosButton?: string;
    androidButton?: string;
    imageAlt: string;
  };

  type Mt4Copy = {
    heroTitleAccent: string;
    heroTitleRest: string;
    heroText: string;
    heroImageAlt: string;
    terminalSectionLabel: string;
    desktop: TerminalCopy;
    mobile: TerminalCopy;
    about: {
      kicker: string;
      title: string;
      lead: string;
      text: string;
    };
    mac: {
      kicker: string;
      title: string;
      text: string;
      button: string;
      steps: string[];
    };
    requirements: {
      title: string;
      text: string;
      button: string;
      imageAlt: string;
    };
    heroFeatures: IconTextItem[];
    aboutFeatures: IconTextItem[];
  };

  const ASSET_BASE = "/static/mt4-redesign/";

  const assetPath = (name: string): string => `${ASSET_BASE}${name}`;
  const themeStore = useThemeStore();
  const themedAssetPath = (lightAsset: string, darkAsset: string): string =>
    assetPath(themeStore.currentTheme === "dark" ? darkAsset : lightAsset);

  const downloadLinks = {
    windows: "https://download.mql5.com/cdn/web/ester.holdings.ltd/mt4/ester4setup.exe",
    mac: "https://download.terminal.free/cdn/web/metaquotes.software.corp/mt4/MetaTrader4.pkg.zip",
    ios: "https://apps.apple.com/us/app/metatrader-4/id496212596",
    android: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader4",
  };

  const localizedCopy: Record<string, Mt4Copy> = {
    en: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText: "Download the desktop and mobile terminal and manage charts, orders and analytics from one workspace.",
      heroImageAlt: "MetaTrader 4 desktop and mobile terminals",
      terminalSectionLabel: "MetaTrader 4 terminal downloads",
      desktop: {
        label: "Desktop terminal",
        title: "Full MetaTrader 4 workspace on your computer",
        text: "Use multi-window charts, indicators, advisors and detailed order management when you need a complete trading desk.",
        button: "Download Desktop",
        secondaryButton: "Download for macOS",
        imageAlt: "MetaTrader 4 desktop terminal preview",
      },
      mobile: {
        label: "Mobile terminal",
        title: "Market access wherever you are",
        text: "Keep positions, quotes and charts within reach while staying connected to your account outside the desk.",
        iosButton: "Open App Store",
        androidButton: "Open Google Play",
        imageAlt: "MetaTrader 4 mobile terminal preview",
      },
      about: {
        kicker: "About platform",
        title: "A familiar workspace for active trading",
        lead: "Because MetaTrader 4 is:",
        text: "MetaTrader 4 is the most popular trading platform in the world. Thanks to many years' experience of work with this platform and active participation in its development, we provide you with the most profitable and comfortable conditions.",
      },
      mac: {
        kicker: "macOS installation",
        title: "Install MetaTrader 4 on macOS",
        text: "The macOS version is installed like a regular application: download the archive, open the installer package and start the terminal from Applications.",
        button: "Download for macOS",
        steps: [
          "Download the MetaTrader 4 package for macOS.",
          "Open the downloaded archive and run the installation package.",
          "Follow the installer steps, then move or launch MetaTrader 4 from Applications.",
          "Open the terminal and connect to your Ester Holdings trading account.",
        ],
      },
      requirements: {
        title: "System requirements:",
        text: "Windows XP or newer for desktop. Current iOS and Android versions are supported for mobile trading.",
        button: "Download Desktop",
        imageAlt: "Blue MetaTrader 4 download background",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows terminal" },
        { icon: "mobile-hand.svg", text: "iOS and Android" },
        { icon: "chart-histogram.svg", text: "Advanced charts" },
        { icon: "window-code.svg", text: "Fast order access" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Live charts" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Easy and understandable interface with a variety of tools of technical analysis",
        },
        { icon: "mobile-button.svg", text: "Opportunity to trade from smart phones, Ipads and PDAs" },
        {
          icon: "window-code.svg",
          text: "Built-in programming language MQL4, allowing to create own trade advisors and indicators",
        },
        {
          icon: "key.svg",
          text: "Access to interbank liquidity with the help of the technology MT4 Bridge, execution without re-quotes (No Dealing Desk)",
        },
      ],
    },
    uk: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Завантажте десктопний і мобільний термінал та керуйте графіками, ордерами й аналітикою в одному робочому просторі.",
      heroImageAlt: "Десктопний і мобільний термінали MetaTrader 4",
      terminalSectionLabel: "Завантаження терміналів MetaTrader 4",
      desktop: {
        label: "Десктопний термінал",
        title: "Повний робочий простір MetaTrader 4 на вашому комп'ютері",
        text: "Використовуйте багатовіконні графіки, індикатори, радники та детальне керування ордерами для повноцінної торгової роботи.",
        button: "Завантажити Desktop",
        secondaryButton: "Завантажити для macOS",
        imageAlt: "Превʼю десктопного терміналу MetaTrader 4",
      },
      mobile: {
        label: "Мобільний термінал",
        title: "Доступ до ринку будь-де",
        text: "Тримайте позиції, котирування та графіки поруч і залишайтесь підключеними до рахунку поза робочим місцем.",
        iosButton: "Відкрити App Store",
        androidButton: "Відкрити Google Play",
        imageAlt: "Превʼю мобільного терміналу MetaTrader 4",
      },
      about: {
        kicker: "Про платформу",
        title: "Знайомий робочий простір для активної торгівлі",
        lead: "Тому що MetaTrader 4 - це:",
        text: "MetaTrader 4 - найпопулярніша торгова платформа у світі. Завдяки багаторічному досвіду роботи з цією платформою та активній участі в її розвитку ми надаємо вам вигідні й комфортні умови.",
      },
      mac: {
        kicker: "Інсталяція macOS",
        title: "Встановіть MetaTrader 4 на macOS",
        text: "Версія для macOS встановлюється як звичайний застосунок: завантажте архів, відкрийте інсталяційний пакет і запустіть термінал з Applications.",
        button: "Завантажити для macOS",
        steps: [
          "Завантажте пакет MetaTrader 4 для macOS.",
          "Відкрийте завантажений архів і запустіть інсталяційний пакет.",
          "Пройдіть кроки інсталятора, після цього перемістіть або запустіть MetaTrader 4 з Applications.",
          "Відкрийте термінал і підключіться до свого торгового рахунку Ester Holdings.",
        ],
      },
      requirements: {
        title: "Системні вимоги:",
        text: "Windows XP або новіша версія для десктопу. Для мобільної торгівлі підтримуються актуальні версії iOS та Android.",
        button: "Завантажити Desktop",
        imageAlt: "Синій фон завантаження MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Термінал Windows" },
        { icon: "mobile-hand.svg", text: "iOS та Android" },
        { icon: "chart-histogram.svg", text: "Розширені графіки" },
        { icon: "window-code.svg", text: "Швидкий доступ до ордерів" },
        { icon: "lightbulb-on.svg", text: "Торгові радники" },
        { icon: "chart-waterfall.svg", text: "Живі графіки" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Простий і зрозумілий інтерфейс з широким набором інструментів технічного аналізу",
        },
        { icon: "mobile-button.svg", text: "Можливість торгувати зі смартфонів, iPad та інших мобільних пристроїв" },
        {
          icon: "window-code.svg",
          text: "Вбудована мова програмування MQL4 для створення власних радників та індикаторів",
        },
        {
          icon: "key.svg",
          text: "Доступ до міжбанківської ліквідності через технологію MT4 Bridge та виконання без реквот (No Dealing Desk)",
        },
      ],
    },
    ru: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Скачайте десктопный и мобильный терминал и управляйте графиками, ордерами и аналитикой в одном рабочем пространстве.",
      heroImageAlt: "Десктопный и мобильный терминалы MetaTrader 4",
      terminalSectionLabel: "Загрузки терминалов MetaTrader 4",
      desktop: {
        label: "Десктопный терминал",
        title: "Полный рабочий простор MetaTrader 4 на вашем компьютере",
        text: "Используйте многооконные графики, индикаторы, советники и детальное управление ордерами для полноценной торговой работы.",
        button: "Скачать Desktop",
        secondaryButton: "Скачать для macOS",
        imageAlt: "Превью десктопного терминала MetaTrader 4",
      },
      mobile: {
        label: "Мобильный терминал",
        title: "Доступ к рынку где бы вы ни были",
        text: "Держите позиции, котировки и графики под рукой и оставайтесь подключенными к счету вне рабочего места.",
        iosButton: "Открыть App Store",
        androidButton: "Открыть Google Play",
        imageAlt: "Превью мобильного терминала MetaTrader 4",
      },
      about: {
        kicker: "О платформе",
        title: "Знакомое рабочее пространство для активной торговли",
        lead: "Потому что MetaTrader 4 это:",
        text: "MetaTrader 4 - самая популярная торговая платформа в мире. Благодаря многолетнему опыту работы с этой платформой и активному участию в её развитии мы предоставляем вам выгодные и комфортные условия.",
      },
      mac: {
        kicker: "Установка macOS",
        title: "Установите MetaTrader 4 на macOS",
        text: "Версия для macOS устанавливается как обычное приложение: скачайте архив, откройте установочный пакет и запустите терминал из Applications.",
        button: "Скачать для macOS",
        steps: [
          "Скачайте пакет MetaTrader 4 для macOS.",
          "Откройте загруженный архив и запустите установочный пакет.",
          "Пройдите шаги установщика, затем переместите или запустите MetaTrader 4 из Applications.",
          "Откройте терминал и подключитесь к своему торговому счёту Ester Holdings.",
        ],
      },
      requirements: {
        title: "Системные требования:",
        text: "Windows XP или новее для десктопа. Для мобильной торговли поддерживаются актуальные версии iOS и Android.",
        button: "Скачать Desktop",
        imageAlt: "Синий фон загрузки MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Терминал Windows" },
        { icon: "mobile-hand.svg", text: "iOS и Android" },
        { icon: "chart-histogram.svg", text: "Расширенные графики" },
        { icon: "window-code.svg", text: "Быстрый доступ к ордерам" },
        { icon: "lightbulb-on.svg", text: "Торговые советники" },
        { icon: "chart-waterfall.svg", text: "Живые графики" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Простой и понятный интерфейс с большим набором инструментов технического анализа",
        },
        { icon: "mobile-button.svg", text: "Возможность торговать со смартфонов, iPad и других мобильных устройств" },
        {
          icon: "window-code.svg",
          text: "Встроенный язык программирования MQL4 для создания собственных советников и индикаторов",
        },
        {
          icon: "key.svg",
          text: "Доступ к межбанковской ликвидности через технологию MT4 Bridge и исполнение без реквот (No Dealing Desk)",
        },
      ],
    },
    de: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Laden Sie das Desktop- und Mobilterminal herunter und verwalten Sie Charts, Orders und Analysen in einem Arbeitsbereich.",
      heroImageAlt: "Desktop- und Mobilterminals von MetaTrader 4",
      terminalSectionLabel: "Downloads für MetaTrader 4 Terminals",
      desktop: {
        label: "Desktop-Terminal",
        title: "Vollständiger MetaTrader 4 Arbeitsplatz auf Ihrem Computer",
        text: "Nutzen Sie mehrere Chartfenster, Indikatoren, Expert Advisors und detaillierte Orderverwaltung für einen vollständigen Trading-Arbeitsplatz.",
        button: "Desktop herunterladen",
        secondaryButton: "Für macOS herunterladen",
        imageAlt: "Vorschau des MetaTrader 4 Desktop-Terminals",
      },
      mobile: {
        label: "Mobiles Terminal",
        title: "Marktzugang, wo immer Sie sind",
        text: "Behalten Sie Positionen, Kurse und Charts im Blick und bleiben Sie auch außerhalb Ihres Arbeitsplatzes mit Ihrem Konto verbunden.",
        iosButton: "App Store öffnen",
        androidButton: "Google Play öffnen",
        imageAlt: "Vorschau des MetaTrader 4 Mobilterminals",
      },
      about: {
        kicker: "Über die Plattform",
        title: "Ein vertrauter Arbeitsplatz für aktives Trading",
        lead: "Denn MetaTrader 4 ist:",
        text: "MetaTrader 4 ist die beliebteste Handelsplattform der Welt. Dank langjähriger Erfahrung mit dieser Plattform und aktiver Beteiligung an ihrer Entwicklung bieten wir Ihnen profitable und komfortable Bedingungen.",
      },
      mac: {
        kicker: "macOS-Installation",
        title: "MetaTrader 4 unter macOS installieren",
        text: "Die macOS-Version wird wie eine normale Anwendung installiert: Archiv herunterladen, Installationspaket öffnen und das Terminal aus Applications starten.",
        button: "Für macOS herunterladen",
        steps: [
          "Laden Sie das MetaTrader 4 Paket für macOS herunter.",
          "Öffnen Sie das heruntergeladene Archiv und starten Sie das Installationspaket.",
          "Folgen Sie den Installationsschritten und verschieben oder starten Sie MetaTrader 4 anschließend aus Applications.",
          "Öffnen Sie das Terminal und verbinden Sie sich mit Ihrem Ester Holdings Handelskonto.",
        ],
      },
      requirements: {
        title: "Systemanforderungen:",
        text: "Windows XP oder neuer für Desktop. Aktuelle iOS- und Android-Versionen werden für mobiles Trading unterstützt.",
        button: "Desktop herunterladen",
        imageAlt: "Blauer MetaTrader 4 Download-Hintergrund",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows-Terminal" },
        { icon: "mobile-hand.svg", text: "iOS und Android" },
        { icon: "chart-histogram.svg", text: "Erweiterte Charts" },
        { icon: "window-code.svg", text: "Schneller Orderzugriff" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Live-Charts" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Einfache und verständliche Oberfläche mit vielen Werkzeugen der technischen Analyse",
        },
        { icon: "mobile-button.svg", text: "Trading von Smartphones, iPads und PDAs aus möglich" },
        {
          icon: "window-code.svg",
          text: "Integrierte Programmiersprache MQL4 zum Erstellen eigener Handelsberater und Indikatoren",
        },
        {
          icon: "key.svg",
          text: "Zugang zu Interbank-Liquidität über MT4 Bridge und Ausführung ohne Requotes (No Dealing Desk)",
        },
      ],
    },
    es: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Descarga el terminal de escritorio y móvil y gestiona gráficos, órdenes y análisis desde un solo espacio de trabajo.",
      heroImageAlt: "Terminales MetaTrader 4 de escritorio y móvil",
      terminalSectionLabel: "Descargas de terminales MetaTrader 4",
      desktop: {
        label: "Terminal de escritorio",
        title: "Espacio completo de MetaTrader 4 en tu ordenador",
        text: "Utiliza gráficos con múltiples ventanas, indicadores, asesores y gestión detallada de órdenes cuando necesites una mesa de trading completa.",
        button: "Descargar Desktop",
        secondaryButton: "Descargar para macOS",
        imageAlt: "Vista previa del terminal de escritorio MetaTrader 4",
      },
      mobile: {
        label: "Terminal móvil",
        title: "Acceso al mercado dondequiera que estés",
        text: "Mantén posiciones, cotizaciones y gráficos a tu alcance mientras sigues conectado a tu cuenta fuera del escritorio.",
        iosButton: "Abrir App Store",
        androidButton: "Abrir Google Play",
        imageAlt: "Vista previa del terminal móvil MetaTrader 4",
      },
      about: {
        kicker: "Sobre la plataforma",
        title: "Un espacio familiar para trading activo",
        lead: "Porque MetaTrader 4 es:",
        text: "MetaTrader 4 es la plataforma de trading más popular del mundo. Gracias a muchos años de experiencia con esta plataforma y a la participación activa en su desarrollo, te ofrecemos condiciones rentables y cómodas.",
      },
      mac: {
        kicker: "Instalación en macOS",
        title: "Instala MetaTrader 4 en macOS",
        text: "La versión para macOS se instala como una aplicación normal: descarga el archivo, abre el paquete de instalación e inicia el terminal desde Applications.",
        button: "Descargar para macOS",
        steps: [
          "Descarga el paquete MetaTrader 4 para macOS.",
          "Abre el archivo descargado y ejecuta el paquete de instalación.",
          "Sigue los pasos del instalador y luego mueve o inicia MetaTrader 4 desde Applications.",
          "Abre el terminal y conéctate a tu cuenta de trading de Ester Holdings.",
        ],
      },
      requirements: {
        title: "Requisitos del sistema:",
        text: "Windows XP o posterior para escritorio. Las versiones actuales de iOS y Android son compatibles con trading móvil.",
        button: "Descargar Desktop",
        imageAlt: "Fondo azul de descarga de MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Terminal Windows" },
        { icon: "mobile-hand.svg", text: "iOS y Android" },
        { icon: "chart-histogram.svg", text: "Gráficos avanzados" },
        { icon: "window-code.svg", text: "Acceso rápido a órdenes" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Gráficos en vivo" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Interfaz sencilla y comprensible con una variedad de herramientas de análisis técnico",
        },
        { icon: "mobile-button.svg", text: "Posibilidad de operar desde smartphones, iPads y PDAs" },
        {
          icon: "window-code.svg",
          text: "Lenguaje de programación integrado MQL4 para crear asesores de trading e indicadores propios",
        },
        {
          icon: "key.svg",
          text: "Acceso a liquidez interbancaria mediante MT4 Bridge y ejecución sin recotizaciones (No Dealing Desk)",
        },
      ],
    },
    fr: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Téléchargez le terminal desktop et mobile et gérez graphiques, ordres et analyses depuis un seul espace de travail.",
      heroImageAlt: "Terminaux MetaTrader 4 desktop et mobile",
      terminalSectionLabel: "Téléchargements des terminaux MetaTrader 4",
      desktop: {
        label: "Terminal desktop",
        title: "Espace de travail MetaTrader 4 complet sur votre ordinateur",
        text: "Utilisez des graphiques multi-fenêtres, des indicateurs, des advisors et une gestion détaillée des ordres pour un poste de trading complet.",
        button: "Télécharger Desktop",
        secondaryButton: "Télécharger pour macOS",
        imageAlt: "Aperçu du terminal desktop MetaTrader 4",
      },
      mobile: {
        label: "Terminal mobile",
        title: "Accès au marché où que vous soyez",
        text: "Gardez positions, cotations et graphiques à portée de main tout en restant connecté à votre compte hors du bureau.",
        iosButton: "Ouvrir App Store",
        androidButton: "Ouvrir Google Play",
        imageAlt: "Aperçu du terminal mobile MetaTrader 4",
      },
      about: {
        kicker: "À propos de la plateforme",
        title: "Un espace familier pour le trading actif",
        lead: "Parce que MetaTrader 4 est :",
        text: "MetaTrader 4 est la plateforme de trading la plus populaire au monde. Grâce à de nombreuses années d'expérience avec cette plateforme et à une participation active à son développement, nous vous offrons des conditions rentables et confortables.",
      },
      mac: {
        kicker: "Installation macOS",
        title: "Installer MetaTrader 4 sur macOS",
        text: "La version macOS s'installe comme une application classique : téléchargez l'archive, ouvrez le package d'installation et lancez le terminal depuis Applications.",
        button: "Télécharger pour macOS",
        steps: [
          "Téléchargez le package MetaTrader 4 pour macOS.",
          "Ouvrez l'archive téléchargée et exécutez le package d'installation.",
          "Suivez les étapes de l'installateur, puis déplacez ou lancez MetaTrader 4 depuis Applications.",
          "Ouvrez le terminal et connectez-vous à votre compte de trading Ester Holdings.",
        ],
      },
      requirements: {
        title: "Configuration requise :",
        text: "Windows XP ou version plus récente pour desktop. Les versions actuelles d'iOS et Android sont prises en charge pour le trading mobile.",
        button: "Télécharger Desktop",
        imageAlt: "Fond bleu de téléchargement MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Terminal Windows" },
        { icon: "mobile-hand.svg", text: "iOS et Android" },
        { icon: "chart-histogram.svg", text: "Graphiques avancés" },
        { icon: "window-code.svg", text: "Accès rapide aux ordres" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Graphiques en direct" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Interface simple et intuitive avec une variété d'outils d'analyse technique",
        },
        { icon: "mobile-button.svg", text: "Possibilité de trader depuis smartphones, iPads et PDAs" },
        {
          icon: "window-code.svg",
          text: "Langage de programmation intégré MQL4 pour créer vos propres advisors et indicateurs",
        },
        {
          icon: "key.svg",
          text: "Accès à la liquidité interbancaire via MT4 Bridge et exécution sans recotation (No Dealing Desk)",
        },
      ],
    },
    it: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Scarica il terminale desktop e mobile e gestisci grafici, ordini e analisi da un unico spazio di lavoro.",
      heroImageAlt: "Terminali MetaTrader 4 desktop e mobile",
      terminalSectionLabel: "Download dei terminali MetaTrader 4",
      desktop: {
        label: "Terminale desktop",
        title: "Spazio di lavoro MetaTrader 4 completo sul tuo computer",
        text: "Usa grafici multi-finestra, indicatori, advisor e gestione dettagliata degli ordini quando ti serve una postazione di trading completa.",
        button: "Scarica Desktop",
        secondaryButton: "Scarica per macOS",
        imageAlt: "Anteprima del terminale desktop MetaTrader 4",
      },
      mobile: {
        label: "Terminale mobile",
        title: "Accesso al mercato ovunque tu sia",
        text: "Tieni posizioni, quotazioni e grafici a portata di mano restando connesso al tuo conto anche fuori dalla scrivania.",
        iosButton: "Apri App Store",
        androidButton: "Apri Google Play",
        imageAlt: "Anteprima del terminale mobile MetaTrader 4",
      },
      about: {
        kicker: "Informazioni sulla piattaforma",
        title: "Uno spazio familiare per il trading attivo",
        lead: "Perché MetaTrader 4 è:",
        text: "MetaTrader 4 è la piattaforma di trading più popolare al mondo. Grazie a molti anni di esperienza con questa piattaforma e alla partecipazione attiva al suo sviluppo, ti offriamo condizioni redditizie e confortevoli.",
      },
      mac: {
        kicker: "Installazione macOS",
        title: "Installa MetaTrader 4 su macOS",
        text: "La versione macOS si installa come una normale applicazione: scarica l'archivio, apri il pacchetto di installazione e avvia il terminale da Applications.",
        button: "Scarica per macOS",
        steps: [
          "Scarica il pacchetto MetaTrader 4 per macOS.",
          "Apri l'archivio scaricato ed esegui il pacchetto di installazione.",
          "Segui i passaggi dell'installatore, poi sposta o avvia MetaTrader 4 da Applications.",
          "Apri il terminale e connettiti al tuo conto di trading Ester Holdings.",
        ],
      },
      requirements: {
        title: "Requisiti di sistema:",
        text: "Windows XP o versioni successive per desktop. Le versioni attuali di iOS e Android sono supportate per il trading mobile.",
        button: "Scarica Desktop",
        imageAlt: "Sfondo blu di download MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Terminale Windows" },
        { icon: "mobile-hand.svg", text: "iOS e Android" },
        { icon: "chart-histogram.svg", text: "Grafici avanzati" },
        { icon: "window-code.svg", text: "Accesso rapido agli ordini" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Grafici live" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Interfaccia semplice e comprensibile con una varietà di strumenti di analisi tecnica",
        },
        { icon: "mobile-button.svg", text: "Possibilità di fare trading da smartphone, iPad e PDA" },
        {
          icon: "window-code.svg",
          text: "Linguaggio di programmazione integrato MQL4 per creare advisor e indicatori propri",
        },
        {
          icon: "key.svg",
          text: "Accesso alla liquidità interbancaria tramite MT4 Bridge ed esecuzione senza riquotazioni (No Dealing Desk)",
        },
      ],
    },
    pt: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Baixe o terminal desktop e móvel e gerencie gráficos, ordens e análises em um único espaço de trabalho.",
      heroImageAlt: "Terminais MetaTrader 4 desktop e móvel",
      terminalSectionLabel: "Downloads dos terminais MetaTrader 4",
      desktop: {
        label: "Terminal desktop",
        title: "Espaço completo do MetaTrader 4 no seu computador",
        text: "Use gráficos com múltiplas janelas, indicadores, advisors e gerenciamento detalhado de ordens quando precisar de uma mesa de trading completa.",
        button: "Baixar Desktop",
        secondaryButton: "Baixar para macOS",
        imageAlt: "Prévia do terminal desktop MetaTrader 4",
      },
      mobile: {
        label: "Terminal móvel",
        title: "Acesso ao mercado onde você estiver",
        text: "Mantenha posições, cotações e gráficos ao alcance enquanto continua conectado à sua conta fora da mesa.",
        iosButton: "Abrir App Store",
        androidButton: "Abrir Google Play",
        imageAlt: "Prévia do terminal móvel MetaTrader 4",
      },
      about: {
        kicker: "Sobre a plataforma",
        title: "Um espaço familiar para trading ativo",
        lead: "Porque MetaTrader 4 é:",
        text: "MetaTrader 4 é a plataforma de trading mais popular do mundo. Graças a muitos anos de experiência com esta plataforma e à participação ativa em seu desenvolvimento, oferecemos condições lucrativas e confortáveis.",
      },
      mac: {
        kicker: "Instalação no macOS",
        title: "Instale o MetaTrader 4 no macOS",
        text: "A versão para macOS é instalada como um aplicativo comum: baixe o arquivo, abra o pacote de instalação e inicie o terminal em Applications.",
        button: "Baixar para macOS",
        steps: [
          "Baixe o pacote MetaTrader 4 para macOS.",
          "Abra o arquivo baixado e execute o pacote de instalação.",
          "Siga os passos do instalador e depois mova ou inicie o MetaTrader 4 em Applications.",
          "Abra o terminal e conecte-se à sua conta de trading Ester Holdings.",
        ],
      },
      requirements: {
        title: "Requisitos do sistema:",
        text: "Windows XP ou mais recente para desktop. As versões atuais de iOS e Android são compatíveis com trading móvel.",
        button: "Baixar Desktop",
        imageAlt: "Fundo azul de download do MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Terminal Windows" },
        { icon: "mobile-hand.svg", text: "iOS e Android" },
        { icon: "chart-histogram.svg", text: "Gráficos avançados" },
        { icon: "window-code.svg", text: "Acesso rápido a ordens" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Gráficos ao vivo" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Interface simples e compreensível com uma variedade de ferramentas de análise técnica",
        },
        { icon: "mobile-button.svg", text: "Possibilidade de operar por smartphones, iPads e PDAs" },
        {
          icon: "window-code.svg",
          text: "Linguagem de programação integrada MQL4 para criar seus próprios advisors e indicadores",
        },
        {
          icon: "key.svg",
          text: "Acesso à liquidez interbancária com MT4 Bridge e execução sem requotes (No Dealing Desk)",
        },
      ],
    },
    tr: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "Masaüstü ve mobil terminali indirin; grafikleri, emirleri ve analizleri tek çalışma alanından yönetin.",
      heroImageAlt: "MetaTrader 4 masaüstü ve mobil terminalleri",
      terminalSectionLabel: "MetaTrader 4 terminal indirmeleri",
      desktop: {
        label: "Masaüstü terminal",
        title: "Bilgisayarınızda tam MetaTrader 4 çalışma alanı",
        text: "Tam bir trading masasına ihtiyaç duyduğunuzda çok pencereli grafikler, göstergeler, danışmanlar ve ayrıntılı emir yönetimi kullanın.",
        button: "Desktop indir",
        secondaryButton: "macOS için indir",
        imageAlt: "MetaTrader 4 masaüstü terminal önizlemesi",
      },
      mobile: {
        label: "Mobil terminal",
        title: "Nerede olursanız olun piyasaya erişim",
        text: "Pozisyonları, kotasyonları ve grafikleri elinizin altında tutun; masanız dışında da hesabınıza bağlı kalın.",
        iosButton: "App Store'u aç",
        androidButton: "Google Play'i aç",
        imageAlt: "MetaTrader 4 mobil terminal önizlemesi",
      },
      about: {
        kicker: "Platform hakkında",
        title: "Aktif trading için tanıdık bir çalışma alanı",
        lead: "Çünkü MetaTrader 4:",
        text: "MetaTrader 4 dünyanın en popüler işlem platformudur. Bu platformla uzun yıllara dayanan deneyimimiz ve geliştirilmesine aktif katılımımız sayesinde size karlı ve rahat koşullar sunuyoruz.",
      },
      mac: {
        kicker: "macOS kurulumu",
        title: "MetaTrader 4'ü macOS'a kurun",
        text: "macOS sürümü normal bir uygulama gibi kurulur: arşivi indirin, kurulum paketini açın ve terminali Applications içinden başlatın.",
        button: "macOS için indir",
        steps: [
          "macOS için MetaTrader 4 paketini indirin.",
          "İndirilen arşivi açın ve kurulum paketini çalıştırın.",
          "Kurulum adımlarını izleyin, ardından MetaTrader 4'ü Applications içinden taşıyın veya başlatın.",
          "Terminali açın ve Ester Holdings işlem hesabınıza bağlanın.",
        ],
      },
      requirements: {
        title: "Sistem gereksinimleri:",
        text: "Masaüstü için Windows XP veya daha yenisi. Mobil trading için güncel iOS ve Android sürümleri desteklenir.",
        button: "Desktop indir",
        imageAlt: "Mavi MetaTrader 4 indirme arka planı",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows terminali" },
        { icon: "mobile-hand.svg", text: "iOS ve Android" },
        { icon: "chart-histogram.svg", text: "Gelişmiş grafikler" },
        { icon: "window-code.svg", text: "Hızlı emir erişimi" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "Canlı grafikler" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "Çeşitli teknik analiz araçlarına sahip sade ve anlaşılır arayüz",
        },
        { icon: "mobile-button.svg", text: "Akıllı telefonlar, iPad'ler ve PDA'lardan işlem yapma imkanı" },
        {
          icon: "window-code.svg",
          text: "Kendi işlem danışmanlarınızı ve göstergelerinizi oluşturmak için yerleşik MQL4 programlama dili",
        },
        {
          icon: "key.svg",
          text: "MT4 Bridge ile bankalararası likiditeye erişim ve requote olmadan emir yürütme (No Dealing Desk)",
        },
      ],
    },
    he: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText: "הורד את הטרמינל למחשב ולמובייל ונהל גרפים, פקודות וניתוחים מסביבת עבודה אחת.",
      heroImageAlt: "טרמינלים של MetaTrader 4 למחשב ולמובייל",
      terminalSectionLabel: "הורדות טרמינל MetaTrader 4",
      desktop: {
        label: "טרמינל למחשב",
        title: "סביבת עבודה מלאה של MetaTrader 4 במחשב שלך",
        text: "השתמש בגרפים מרובי חלונות, אינדיקטורים, יועצים וניהול פקודות מפורט כשאתה צריך עמדת מסחר מלאה.",
        button: "הורד Desktop",
        secondaryButton: "הורד ל-macOS",
        imageAlt: "תצוגה מקדימה של טרמינל MetaTrader 4 למחשב",
      },
      mobile: {
        label: "טרמינל מובייל",
        title: "גישה לשוק מכל מקום",
        text: "שמור פוזיציות, ציטוטים וגרפים בהישג יד והישאר מחובר לחשבון גם מחוץ לעמדת העבודה.",
        iosButton: "פתח App Store",
        androidButton: "פתח Google Play",
        imageAlt: "תצוגה מקדימה של טרמינל MetaTrader 4 למובייל",
      },
      about: {
        kicker: "על הפלטפורמה",
        title: "סביבת עבודה מוכרת למסחר פעיל",
        lead: "כי MetaTrader 4 הוא:",
        text: "MetaTrader 4 היא פלטפורמת המסחר הפופולרית ביותר בעולם. בזכות ניסיון רב שנים עם הפלטפורמה והשתתפות פעילה בפיתוחה, אנו מספקים תנאים רווחיים ונוחים.",
      },
      mac: {
        kicker: "התקנת macOS",
        title: "התקן את MetaTrader 4 ב-macOS",
        text: "גרסת macOS מותקנת כמו יישום רגיל: הורד את הארכיון, פתח את חבילת ההתקנה והפעל את הטרמינל מתוך Applications.",
        button: "הורד ל-macOS",
        steps: [
          "הורד את חבילת MetaTrader 4 ל-macOS.",
          "פתח את הארכיון שהורדת והפעל את חבילת ההתקנה.",
          "עקוב אחר שלבי ההתקנה, ולאחר מכן העבר או הפעל את MetaTrader 4 מתוך Applications.",
          "פתח את הטרמינל והתחבר לחשבון המסחר שלך ב-Ester Holdings.",
        ],
      },
      requirements: {
        title: "דרישות מערכת:",
        text: "Windows XP או חדש יותר למחשב. גרסאות iOS ו-Android עדכניות נתמכות למסחר במובייל.",
        button: "הורד Desktop",
        imageAlt: "רקע כחול להורדת MetaTrader 4",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "טרמינל Windows" },
        { icon: "mobile-hand.svg", text: "iOS ו-Android" },
        { icon: "chart-histogram.svg", text: "גרפים מתקדמים" },
        { icon: "window-code.svg", text: "גישה מהירה לפקודות" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "גרפים חיים" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "ממשק פשוט וברור עם מגוון כלים לניתוח טכני",
        },
        { icon: "mobile-button.svg", text: "אפשרות לסחור מסמארטפונים, iPad ומכשירי PDA" },
        {
          icon: "window-code.svg",
          text: "שפת תכנות מובנית MQL4 ליצירת יועצי מסחר ואינדיקטורים משלך",
        },
        {
          icon: "key.svg",
          text: "גישה לנזילות בין-בנקאית בעזרת MT4 Bridge וביצוע ללא ציטוטים חוזרים (No Dealing Desk)",
        },
      ],
    },
    hi: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "डेस्कटॉप और मोबाइल टर्मिनल डाउनलोड करें और चार्ट, ऑर्डर व एनालिटिक्स को एक ही वर्कस्पेस से प्रबंधित करें।",
      heroImageAlt: "MetaTrader 4 डेस्कटॉप और मोबाइल टर्मिनल",
      terminalSectionLabel: "MetaTrader 4 टर्मिनल डाउनलोड",
      desktop: {
        label: "डेस्कटॉप टर्मिनल",
        title: "आपके कंप्यूटर पर पूरा MetaTrader 4 वर्कस्पेस",
        text: "पूर्ण ट्रेडिंग डेस्क की जरूरत होने पर मल्टी-विंडो चार्ट, इंडिकेटर, एडवाइजर और विस्तृत ऑर्डर प्रबंधन का उपयोग करें।",
        button: "Desktop डाउनलोड करें",
        secondaryButton: "macOS के लिए डाउनलोड करें",
        imageAlt: "MetaTrader 4 डेस्कटॉप टर्मिनल पूर्वावलोकन",
      },
      mobile: {
        label: "मोबाइल टर्मिनल",
        title: "जहां भी हों, बाजार तक पहुंच",
        text: "डेस्क से दूर रहते हुए भी पोजिशन, कोट और चार्ट को पास रखें और अपने खाते से जुड़े रहें।",
        iosButton: "App Store खोलें",
        androidButton: "Google Play खोलें",
        imageAlt: "MetaTrader 4 मोबाइल टर्मिनल पूर्वावलोकन",
      },
      about: {
        kicker: "प्लेटफॉर्म के बारे में",
        title: "सक्रिय ट्रेडिंग के लिए परिचित वर्कस्पेस",
        lead: "क्योंकि MetaTrader 4 है:",
        text: "MetaTrader 4 दुनिया का सबसे लोकप्रिय ट्रेडिंग प्लेटफॉर्म है। इस प्लेटफॉर्म के साथ कई वर्षों के अनुभव और इसके विकास में सक्रिय भागीदारी के कारण हम आपको लाभदायक और सुविधाजनक स्थितियां प्रदान करते हैं।",
      },
      mac: {
        kicker: "macOS इंस्टॉलेशन",
        title: "macOS पर MetaTrader 4 इंस्टॉल करें",
        text: "macOS संस्करण सामान्य एप्लिकेशन की तरह इंस्टॉल होता है: आर्काइव डाउनलोड करें, इंस्टॉलर पैकेज खोलें और Applications से टर्मिनल शुरू करें।",
        button: "macOS के लिए डाउनलोड करें",
        steps: [
          "macOS के लिए MetaTrader 4 पैकेज डाउनलोड करें।",
          "डाउनलोड किया गया आर्काइव खोलें और इंस्टॉलेशन पैकेज चलाएं।",
          "इंस्टॉलर के चरण पूरे करें, फिर MetaTrader 4 को Applications से मूव या लॉन्च करें।",
          "टर्मिनल खोलें और अपने Ester Holdings ट्रेडिंग खाते से कनेक्ट करें।",
        ],
      },
      requirements: {
        title: "सिस्टम आवश्यकताएं:",
        text: "डेस्कटॉप के लिए Windows XP या नया संस्करण। मोबाइल ट्रेडिंग के लिए वर्तमान iOS और Android संस्करण समर्थित हैं।",
        button: "Desktop डाउनलोड करें",
        imageAlt: "MetaTrader 4 डाउनलोड के लिए नीला बैकग्राउंड",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows टर्मिनल" },
        { icon: "mobile-hand.svg", text: "iOS और Android" },
        { icon: "chart-histogram.svg", text: "उन्नत चार्ट" },
        { icon: "window-code.svg", text: "तेज ऑर्डर एक्सेस" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "लाइव चार्ट" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "तकनीकी विश्लेषण के अनेक उपकरणों के साथ सरल और समझने योग्य इंटरफेस",
        },
        { icon: "mobile-button.svg", text: "स्मार्टफोन, iPad और PDA से ट्रेड करने की सुविधा" },
        {
          icon: "window-code.svg",
          text: "अपने ट्रेड एडवाइजर और इंडिकेटर बनाने के लिए अंतर्निहित MQL4 प्रोग्रामिंग भाषा",
        },
        {
          icon: "key.svg",
          text: "MT4 Bridge तकनीक की मदद से इंटरबैंक लिक्विडिटी तक पहुंच और बिना requotes के निष्पादन (No Dealing Desk)",
        },
      ],
    },
    ja: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText:
        "デスクトップ版とモバイル版のターミナルをダウンロードし、チャート、注文、分析を1つのワークスペースで管理できます。",
      heroImageAlt: "MetaTrader 4 デスクトップおよびモバイルターミナル",
      terminalSectionLabel: "MetaTrader 4 ターミナルのダウンロード",
      desktop: {
        label: "デスクトップターミナル",
        title: "コンピューター上の完全な MetaTrader 4 ワークスペース",
        text: "本格的なトレーディング環境が必要なときに、マルチウィンドウチャート、インジケーター、アドバイザー、詳細な注文管理を利用できます。",
        button: "Desktop をダウンロード",
        secondaryButton: "macOS 用をダウンロード",
        imageAlt: "MetaTrader 4 デスクトップターミナルのプレビュー",
      },
      mobile: {
        label: "モバイルターミナル",
        title: "どこにいても市場へアクセス",
        text: "デスクから離れていても、ポジション、レート、チャートを手元に置き、アカウントに接続したまま取引できます。",
        iosButton: "App Store を開く",
        androidButton: "Google Play を開く",
        imageAlt: "MetaTrader 4 モバイルターミナルのプレビュー",
      },
      about: {
        kicker: "プラットフォームについて",
        title: "アクティブトレードに慣れたワークスペース",
        lead: "MetaTrader 4 が選ばれる理由:",
        text: "MetaTrader 4 は世界で最も人気のある取引プラットフォームです。このプラットフォームでの長年の経験と開発への積極的な参加により、収益性と快適性を兼ね備えた条件を提供します。",
      },
      mac: {
        kicker: "macOS インストール",
        title: "macOS に MetaTrader 4 をインストール",
        text: "macOS 版は通常のアプリケーションと同じようにインストールできます。アーカイブをダウンロードし、インストーラーパッケージを開き、Applications からターミナルを起動してください。",
        button: "macOS 用をダウンロード",
        steps: [
          "macOS 用 MetaTrader 4 パッケージをダウンロードします。",
          "ダウンロードしたアーカイブを開き、インストールパッケージを実行します。",
          "インストーラーの手順に従い、その後 Applications から MetaTrader 4 を移動または起動します。",
          "ターミナルを開き、Ester Holdings の取引口座に接続します。",
        ],
      },
      requirements: {
        title: "システム要件:",
        text: "デスクトップ版は Windows XP 以降に対応しています。モバイル取引は最新の iOS と Android に対応しています。",
        button: "Desktop をダウンロード",
        imageAlt: "MetaTrader 4 ダウンロード用の青い背景",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows ターミナル" },
        { icon: "mobile-hand.svg", text: "iOS と Android" },
        { icon: "chart-histogram.svg", text: "高度なチャート" },
        { icon: "window-code.svg", text: "素早い注文アクセス" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "ライブチャート" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "豊富なテクニカル分析ツールを備えた、シンプルで分かりやすいインターフェース",
        },
        { icon: "mobile-button.svg", text: "スマートフォン、iPad、PDA から取引可能" },
        {
          icon: "window-code.svg",
          text: "独自のトレードアドバイザーやインジケーターを作成できる内蔵プログラミング言語 MQL4",
        },
        {
          icon: "key.svg",
          text: "MT4 Bridge 技術によるインターバンク流動性へのアクセスと、リクオートなしの約定 (No Dealing Desk)",
        },
      ],
    },
    ko: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText: "데스크톱 및 모바일 터미널을 다운로드하고 차트, 주문, 분석을 하나의 작업 공간에서 관리하세요.",
      heroImageAlt: "MetaTrader 4 데스크톱 및 모바일 터미널",
      terminalSectionLabel: "MetaTrader 4 터미널 다운로드",
      desktop: {
        label: "데스크톱 터미널",
        title: "컴퓨터에서 사용하는 완전한 MetaTrader 4 작업 공간",
        text: "완전한 트레이딩 데스크가 필요할 때 다중 창 차트, 지표, 어드바이저 및 세부 주문 관리를 사용하세요.",
        button: "Desktop 다운로드",
        secondaryButton: "macOS용 다운로드",
        imageAlt: "MetaTrader 4 데스크톱 터미널 미리보기",
      },
      mobile: {
        label: "모바일 터미널",
        title: "어디서든 시장에 접속",
        text: "데스크 밖에서도 포지션, 시세, 차트를 가까이 두고 계정에 계속 연결되어 있으세요.",
        iosButton: "App Store 열기",
        androidButton: "Google Play 열기",
        imageAlt: "MetaTrader 4 모바일 터미널 미리보기",
      },
      about: {
        kicker: "플랫폼 소개",
        title: "활발한 트레이딩을 위한 익숙한 작업 공간",
        lead: "MetaTrader 4는 다음과 같습니다:",
        text: "MetaTrader 4는 세계에서 가장 인기 있는 거래 플랫폼입니다. 이 플랫폼에 대한 오랜 경험과 개발 참여를 바탕으로 수익성 있고 편안한 조건을 제공합니다.",
      },
      mac: {
        kicker: "macOS 설치",
        title: "macOS에 MetaTrader 4 설치",
        text: "macOS 버전은 일반 애플리케이션처럼 설치됩니다. 아카이브를 다운로드하고 설치 패키지를 연 다음 Applications에서 터미널을 실행하세요.",
        button: "macOS용 다운로드",
        steps: [
          "macOS용 MetaTrader 4 패키지를 다운로드합니다.",
          "다운로드한 아카이브를 열고 설치 패키지를 실행합니다.",
          "설치 단계에 따라 진행한 뒤 Applications에서 MetaTrader 4를 이동하거나 실행합니다.",
          "터미널을 열고 Ester Holdings 거래 계정에 연결합니다.",
        ],
      },
      requirements: {
        title: "시스템 요구사항:",
        text: "데스크톱은 Windows XP 이상을 지원합니다. 모바일 거래는 최신 iOS 및 Android 버전을 지원합니다.",
        button: "Desktop 다운로드",
        imageAlt: "MetaTrader 4 다운로드용 파란색 배경",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows 터미널" },
        { icon: "mobile-hand.svg", text: "iOS 및 Android" },
        { icon: "chart-histogram.svg", text: "고급 차트" },
        { icon: "window-code.svg", text: "빠른 주문 접근" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "라이브 차트" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "다양한 기술적 분석 도구를 갖춘 쉽고 이해하기 쉬운 인터페이스",
        },
        { icon: "mobile-button.svg", text: "스마트폰, iPad 및 PDA에서 거래 가능" },
        {
          icon: "window-code.svg",
          text: "자신만의 트레이드 어드바이저와 지표를 만들 수 있는 내장 MQL4 프로그래밍 언어",
        },
        {
          icon: "key.svg",
          text: "MT4 Bridge 기술을 통한 은행 간 유동성 접근과 재호가 없는 체결 (No Dealing Desk)",
        },
      ],
    },
    zh: {
      heroTitleAccent: "MT4",
      heroTitleRest: "Desktop & Mobile",
      heroText: "下载桌面端和移动端交易终端，在一个工作空间中管理图表、订单和分析。",
      heroImageAlt: "MetaTrader 4 桌面端和移动端交易终端",
      terminalSectionLabel: "MetaTrader 4 终端下载",
      desktop: {
        label: "桌面端终端",
        title: "在电脑上使用完整的 MetaTrader 4 工作空间",
        text: "当您需要完整交易桌面时，可使用多窗口图表、指标、智能交易系统以及详细的订单管理。",
        button: "下载 Desktop",
        secondaryButton: "下载 macOS 版",
        imageAlt: "MetaTrader 4 桌面端终端预览",
      },
      mobile: {
        label: "移动端终端",
        title: "随时随地进入市场",
        text: "即使离开办公桌，也能随时查看持仓、报价和图表，并保持账户连接。",
        iosButton: "打开 App Store",
        androidButton: "打开 Google Play",
        imageAlt: "MetaTrader 4 移动端终端预览",
      },
      about: {
        kicker: "关于平台",
        title: "适合活跃交易的熟悉工作空间",
        lead: "因为 MetaTrader 4 是：",
        text: "MetaTrader 4 是全球最受欢迎的交易平台。凭借多年使用该平台的经验以及对其开发的积极参与，我们为您提供有利且舒适的交易条件。",
      },
      mac: {
        kicker: "macOS 安装",
        title: "在 macOS 上安装 MetaTrader 4",
        text: "macOS 版本可像普通应用一样安装：下载压缩包，打开安装包，然后从 Applications 启动终端。",
        button: "下载 macOS 版",
        steps: [
          "下载适用于 macOS 的 MetaTrader 4 安装包。",
          "打开下载的压缩包并运行安装包。",
          "按照安装程序步骤操作，然后从 Applications 移动或启动 MetaTrader 4。",
          "打开终端并连接到您的 Ester Holdings 交易账户。",
        ],
      },
      requirements: {
        title: "系统要求：",
        text: "桌面端支持 Windows XP 或更新版本。移动交易支持当前版本的 iOS 和 Android。",
        button: "下载 Desktop",
        imageAlt: "蓝色 MetaTrader 4 下载背景",
      },
      heroFeatures: [
        { icon: "display-chart-up.svg", text: "Windows 终端" },
        { icon: "mobile-hand.svg", text: "iOS 和 Android" },
        { icon: "chart-histogram.svg", text: "高级图表" },
        { icon: "window-code.svg", text: "快速订单访问" },
        { icon: "lightbulb-on.svg", text: "Expert Advisors" },
        { icon: "chart-waterfall.svg", text: "实时图表" },
      ],
      aboutFeatures: [
        {
          icon: "display-chart-up.svg",
          text: "简单易懂的界面，配备多种技术分析工具",
        },
        { icon: "mobile-button.svg", text: "可通过智能手机、iPad 和 PDA 进行交易" },
        {
          icon: "window-code.svg",
          text: "内置 MQL4 编程语言，可创建自己的交易顾问和指标",
        },
        {
          icon: "key.svg",
          text: "通过 MT4 Bridge 技术接入银行间流动性，并实现无重新报价执行 (No Dealing Desk)",
        },
      ],
    },
  };

  localizedCopy.ua = localizedCopy.uk;

  const { locale } = useI18n();

  const copy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const heroFeatures = computed(() => copy.value.heroFeatures);
  const aboutFeatures = computed(() => copy.value.aboutFeatures);
</script>

<style lang="scss" scoped>
  :global(body.mt4-route .page-content),
  :global(body.mt4-route .page--inner) {
    background-color: var(--landing-bg);
  }

  .mt4-page {
    display: flex;
    flex-direction: column;
    gap: clamp(78px, 7vw, 118px);
    color: var(--landing-text-primary);
    font-family: "DM Sans", "Inter", "Muli", sans-serif;
  }

  .mt4-hero {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: minmax(0, 1.26fr) minmax(360px, 0.74fr);
    align-items: center;
    gap: clamp(36px, 4vw, 72px);
    min-height: var(--landing-inner-hero-min-height);
    padding-block: var(--landing-inner-hero-padding-block);

    &__glows {
      position: absolute;
      top: -18%;
      bottom: -16%;
      left: 50%;
      width: 100vw;
      transform: translateX(-50%);
      z-index: -1;
      pointer-events: none;
      overflow: visible;
    }

    &__glow {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      will-change: transform, opacity, filter;

      &--blue-1 {
        left: max(0px, calc(50% - 700px));
        bottom: 4%;
        width: min(520px, 42vw);
        height: min(520px, 42vw);
        background: var(--landing-glow-blue);
        opacity: 0.22;
        filter: blur(135px);
        animation: mt4-glow-blue-left 10s ease-in-out infinite alternate;
      }

      &--blue-2 {
        right: max(22%, calc(50% - 430px));
        bottom: 16%;
        width: min(300px, 23vw);
        height: min(300px, 23vw);
        background: var(--landing-glow-blue);
        opacity: 0.12;
        filter: blur(120px);
        animation: mt4-glow-blue-center 12s ease-in-out infinite alternate;
      }

      &--orange-1 {
        top: 12%;
        left: min(52%, calc(50% + 20px));
        width: min(300px, 24vw);
        height: min(300px, 24vw);
        background: var(--landing-glow-orange);
        opacity: 0.18;
        filter: blur(95px);
        animation: mt4-glow-orange-top 11s ease-in-out infinite alternate;
      }

      &--orange-2 {
        top: 39%;
        right: max(8%, calc(50% - 650px));
        width: min(230px, 18vw);
        height: min(230px, 18vw);
        background: var(--landing-glow-orange);
        opacity: 0.12;
        filter: blur(85px);
        animation: mt4-glow-orange-right 9s ease-in-out infinite alternate;
      }
    }

    &__media {
      min-width: 0;
      mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 100%);
      -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 100%);

      img {
        display: block;
        width: min(100%, 860px);
        max-height: var(--landing-inner-hero-media-max-height);
        height: auto;
        object-fit: contain;
      }
    }

    &__content {
      max-width: 470px;
    }

    h1 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(56px, 6.1vw, 94px);
      font-weight: 500;
      line-height: 0.91;

      span {
        display: block;
        color: var(--landing-accent);
        font-weight: 800;
      }
    }

    p {
      margin: 32px 0 0;
      max-width: 382px;
      color: var(--landing-text-secondary);
      font-size: 15px;
      font-weight: 500;
      line-height: 1.45;
    }

    &__features {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 28px;
      margin: 34px 0 0;
      padding: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: 22px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
        min-width: 0;
        color: var(--landing-text-primary);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.18;
      }
    }

    &__feature-icon {
      display: inline-flex;
      width: 22px;
      height: 22px;
      background: var(--landing-accent);
      mask: var(--mt4-feature-icon) center / 18px 18px no-repeat;
      -webkit-mask: var(--mt4-feature-icon) center / 18px 18px no-repeat;
    }
  }

  @keyframes mt4-glow-blue-left {
    0% {
      opacity: 0.16;
      transform: translate3d(-38%, 22px, 0) scale(0.94);
      filter: blur(128px);
    }

    52% {
      opacity: 0.29;
      transform: translate3d(-30%, -10px, 0) scale(1.06);
      filter: blur(150px);
    }

    100% {
      opacity: 0.22;
      transform: translate3d(-43%, -4px, 0) scale(1.01);
      filter: blur(138px);
    }
  }

  @keyframes mt4-glow-blue-center {
    0% {
      opacity: 0.09;
      transform: translate3d(0, 18px, 0) scale(0.94);
    }

    48% {
      opacity: 0.17;
      transform: translate3d(-26px, -18px, 0) scale(1.08);
    }

    100% {
      opacity: 0.12;
      transform: translate3d(18px, -8px, 0) scale(1.02);
    }
  }

  @keyframes mt4-glow-orange-top {
    0% {
      opacity: 0.12;
      transform: translate3d(16px, -12px, 0) scale(0.92);
      filter: blur(86px);
    }

    50% {
      opacity: 0.24;
      transform: translate3d(-24px, 16px, 0) scale(1.08);
      filter: blur(105px);
    }

    100% {
      opacity: 0.17;
      transform: translate3d(10px, 8px, 0) scale(1);
      filter: blur(94px);
    }
  }

  @keyframes mt4-glow-orange-right {
    0% {
      opacity: 0.08;
      transform: translate3d(18px, 14px, 0) scale(0.94);
    }

    45% {
      opacity: 0.15;
      transform: translate3d(-16px, -18px, 0) scale(1.1);
    }

    100% {
      opacity: 0.11;
      transform: translate3d(4px, -6px, 0) scale(1.02);
    }
  }

  .terminal-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .terminal-card,
  .about-card {
    border: 6px solid var(--landing-border-strong);
    border-radius: 20px;
    background: linear-gradient(
      145deg,
      var(--landing-surface) 0%,
      var(--landing-surface-elevated) 48%,
      var(--landing-surface-muted) 100%
    );
    box-shadow: var(--landing-shadow-glass), var(--landing-shadow-card);
    backdrop-filter: none;
  }

  .terminal-card {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 460px;
    overflow: visible;
    padding: clamp(28px, 3vw, 38px);

    &__label {
      position: relative;
      z-index: 1;
      color: var(--landing-accent);
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
    }

    &__copy {
      position: relative;
      z-index: 1;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: flex-end;
      max-width: 640px;
    }

    h2 {
      max-width: 430px;
      margin: auto 0 0;
      color: var(--landing-text-strong);
      font-size: clamp(30px, 2.65vw, 42px);
      font-weight: 500;
      line-height: 0.99;
    }

    p {
      max-width: 520px;
      margin: 16px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.42;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }

    &__image {
      position: absolute;
      z-index: 2;
      pointer-events: none;
      user-select: none;
      object-fit: contain;
    }

    &__image--desktop {
      top: -133px;
      right: -37px;
      width: min(68%, 500px);
    }

    &__image--phone {
      top: -135px;
      right: clamp(42px, 5vw, 76px);
      width: min(42%, 250px);
    }

    &--mobile {
      h2 {
        max-width: 440px;
      }
    }

    &--desktop {
      h2 {
        max-width: 520px;
      }
    }
  }

  .mt4-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    border: 2px solid var(--landing-accent);
    border-radius: 12px;
    padding: 0 18px;
    background: var(--landing-accent);
    color: var(--landing-on-accent);
    font-size: 13px;
    font-weight: 800;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease;

    &:hover {
      border-color: var(--landing-accent-hover);
      background: var(--landing-accent-hover);
      color: var(--landing-on-accent);
    }

    &--secondary {
      background: transparent;
      color: var(--landing-accent);

      &:hover {
        background: color-mix(in srgb, var(--landing-accent) 10%, transparent);
        color: var(--landing-accent-hover);
      }
    }

    &--large {
      min-height: 70px;
      width: min(100%, 390px);
      justify-content: space-between;
      border-radius: 18px;
      padding: 0 24px;
      font-size: 18px;

      span {
        display: inline-block;
        width: 55px;
        height: 12px;
        background:
          linear-gradient(currentColor, currentColor) left 50% / 48px 2px no-repeat,
          linear-gradient(45deg, transparent 45%, currentColor 45% 58%, transparent 58%) right 50% / 12px 12px no-repeat;
      }
    }

    &--dark {
      min-height: 38px;
      border-color: rgba(255, 255, 255, 0.75);
      background: rgba(0, 81, 255, 0.28);
      color: #fff;

      &:hover {
        border-color: #fff;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
      }
    }
  }

  .section-kicker {
    display: inline-flex;
    color: var(--landing-accent);
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .about-section {
    display: flex;
    flex-direction: column;
    gap: 28px;

    &__head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.68fr);
      gap: clamp(28px, 5vw, 96px);
      align-items: end;

      h2 {
        max-width: 760px;
        margin: 18px 0 0;
        color: var(--landing-text-strong);
        font-size: clamp(34px, 4.2vw, 56px);
        font-weight: 500;
        line-height: 1.02;
      }

      strong {
        display: block;
        margin-top: 32px;
        color: var(--landing-text-primary);
        font-size: 20px;
        font-weight: 900;
        line-height: 1.2;
      }

      p {
        margin: 0 0 10px;
        color: var(--landing-text-secondary);
        font-size: 14px;
        font-weight: 500;
        line-height: 1.48;
      }
    }
  }

  .about-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .about-card {
    min-height: 198px;
    padding: 28px;

    &__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--landing-accent);

      img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        filter: brightness(0) invert(1);
      }
    }

    p {
      max-width: 520px;
      margin: 40px 0 0;
      color: var(--landing-text-secondary);
      font-size: clamp(18px, 2vw, 26px);
      font-weight: 500;
      line-height: 1.17;
    }
  }

  .mac-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h2 {
      margin: 18px 0 0;
      color: var(--landing-text-strong);
      font-size: clamp(34px, 4.1vw, 56px);
      font-weight: 500;
      line-height: 1;
    }

    > p {
      max-width: 780px;
      margin: 18px 0 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.45;
    }
  }

  .mac-steps {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(28px, 4vw, 74px);
    width: 100%;
    margin: 54px 0 44px;
    padding: 0;
    list-style: none;

    li {
      min-width: 0;
    }

    p {
      margin: 32px 0 0;
      max-width: 250px;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.28;
    }
  }

  .mac-step-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 18px;
    isolation: isolate;
    overflow: visible;

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
        inset 0 -18px 28px color-mix(in srgb, var(--landing-accent) 8%, transparent);
    }

    &::after {
      z-index: 2;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.01)),
        linear-gradient(145deg, transparent, color-mix(in srgb, var(--landing-accent) 4%, transparent));
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 22%, transparent),
        inset 0 -18px 28px color-mix(in srgb, var(--landing-accent) 7%, transparent);
    }

    &__orb {
      position: absolute;
      z-index: 0;
      pointer-events: none;
      border-radius: 999px;
    }

    &__orb--solid {
      width: 30px;
      height: 30px;
      background: linear-gradient(145deg, #1b63ff 0%, #4d86ff 100%);
    }

    &__orb--glow {
      width: 22px;
      height: 22px;
      background: radial-gradient(circle, rgba(142, 181, 255, 0.95) 0%, rgba(60, 122, 255, 0.62) 44%, transparent 72%);
      filter: blur(3px);
    }

    &__number {
      position: relative;
      z-index: 3;
      color: var(--landing-accent);
      font-size: 32px;
      font-weight: 500;
      line-height: 1;
    }

    &--1,
    &--3 {
      .mac-step-icon__orb--solid {
        top: -7px;
        right: -10px;
      }

      .mac-step-icon__orb--glow {
        top: 7px;
        right: 5px;
      }
    }

    &--2 {
      .mac-step-icon__orb--solid {
        right: -9px;
        bottom: -7px;
      }

      .mac-step-icon__orb--glow {
        right: 2px;
        bottom: 5px;
      }
    }

    &--4 {
      .mac-step-icon__orb--solid {
        left: -11px;
        bottom: -8px;
      }

      .mac-step-icon__orb--glow {
        left: 2px;
        bottom: 5px;
      }
    }
  }

  :global(:root[data-theme="dark"] .mac-step-icon::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -18px 28px rgba(0, 81, 255, 0.08);
  }

  :global(:root[data-theme="dark"] .mt4-hero__media img),
  :global(:root[data-theme="dark"] .terminal-card__image) {
    filter: var(--landing-hero-screen-filter) drop-shadow(0 20px 36px rgba(0, 0, 0, 0.24));
    opacity: 0.9;
  }

  :global(:root[data-theme="dark"] .terminal-card) {
    border-color: rgba(139, 164, 214, 0.24);
    background:
      radial-gradient(circle at 16% 118%, rgba(255, 139, 77, 0.2) 0%, transparent 42%),
      radial-gradient(circle at 78% -18%, rgba(91, 132, 255, 0.24) 0%, transparent 45%),
      linear-gradient(145deg, rgba(18, 35, 76, 0.98) 0%, rgba(5, 21, 56, 0.98) 55%, rgba(2, 17, 50, 0.98) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 22px 26px 58px rgba(255, 255, 255, 0.035),
      inset -30px -34px 74px rgba(0, 0, 0, 0.32),
      0 24px 54px rgba(0, 0, 0, 0.2);
  }

  :global(:root[data-theme="dark"] .terminal-card::before) {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 4px;
    border-radius: 14px;
    pointer-events: none;
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.018) 38%, transparent 72%),
      linear-gradient(-22deg, rgba(7, 23, 58, 0.1) 16.6%, rgba(38, 62, 111, 0.15) 84.4%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -22px 38px rgba(0, 81, 255, 0.06);
  }

  :global(:root[data-theme="dark"] .terminal-card::after) {
    content: "";
    position: absolute;
    z-index: 0;
    inset: auto 9% 8% 9%;
    height: 42%;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(91, 132, 255, 0.08) 42%, transparent 72%);
    filter: blur(28px);
    opacity: 0.95;
  }

  :global(:root[data-theme="dark"] .terminal-card__label) {
    color: #7fa0ff;
    text-shadow: 0 0 22px rgba(91, 132, 255, 0.34);
  }

  :global(:root[data-theme="dark"] .terminal-card h2) {
    color: #ffffff;
    text-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
  }

  :global(:root[data-theme="dark"] .terminal-card p) {
    color: #b7c2d5;
  }

  :global(:root[data-theme="dark"] .terminal-card .mt4-button--secondary) {
    background: rgba(91, 132, 255, 0.08);
  }

  :global(:root[data-theme="dark"] .about-card) {
    border-color: rgba(255, 255, 255, 0.18);
    background: linear-gradient(145deg, rgba(18, 35, 76, 0.96) 0%, rgba(7, 22, 56, 0.94) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 18px 18px 48px rgba(255, 255, 255, 0.04),
      inset -24px -26px 58px rgba(0, 0, 0, 0.28);
  }

  .requirements-banner {
    position: relative;
    min-height: 200px;
    overflow: hidden;
    border: 1px solid var(--landing-border-strong);
    border-radius: 18px;
    background: #031b5c;
    color: #fff;

    > img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__content {
      position: relative;
      z-index: 1;
      max-width: 720px;
      padding: clamp(28px, 3vw, 42px);

      span {
        display: block;
        color: #fff;
        font-size: 15px;
        font-weight: 900;
        line-height: 1;
        text-transform: uppercase;
      }

      p {
        max-width: 600px;
        margin: 18px 0 24px;
        color: rgba(255, 255, 255, 0.92);
        font-size: 17px;
        font-weight: 700;
        line-height: 1.3;
      }
    }
  }

  @media (max-width: 1199px) {
    .mt4-hero {
      grid-template-columns: minmax(0, 1fr);
      min-height: 0;
      padding-top: 12px;

      &__media img {
        width: min(100%, 820px);
        margin: 0 auto;
      }

      &__content {
        max-width: 720px;
        margin: 0 auto;
        text-align: center;
      }

      p {
        margin-right: auto;
        margin-left: auto;
      }

      &__features {
        max-width: 560px;
        margin-right: auto;
        margin-left: auto;
        text-align: left;
      }
    }

    .terminal-card {
      min-height: 430px;

      &__image--desktop {
        top: -116px;
        right: -30px;
        width: min(66%, 450px);
      }

      &__image--phone {
        top: -126px;
        right: 42px;
        width: min(40%, 230px);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mt4-hero__glow {
      animation: none;
    }
  }

  @media (max-width: 991px) {
    .mt4-page {
      gap: 70px;
    }

    .terminal-grid,
    .about-grid,
    .about-section__head {
      grid-template-columns: 1fr;
    }

    .terminal-card {
      min-height: 430px;
    }

    .about-section__head {
      gap: 20px;

      strong {
        margin-top: 22px;
      }
    }

    .mac-steps {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 575px) {
    .mt4-page {
      gap: 58px;
    }

    .mt4-hero {
      gap: 20px;
      padding-top: 0;

      &__media {
        margin: 0 -20px;

        img {
          width: 116%;
          max-width: none;
          transform: translateX(-7%);
        }
      }

      &__content {
        text-align: left;
      }

      h1 {
        font-size: clamp(44px, 16vw, 66px);
      }

      p {
        margin-top: 22px;
      }

      &__features {
        grid-template-columns: 1fr;
        gap: 14px;
      }
    }

    .terminal-card {
      display: flex;
      min-height: 0;
      padding: 22px;

      &__label {
        order: 0;
      }

      &__image {
        position: static;
        order: 1;
        margin-right: auto;
        margin-left: auto;
        transform: none;
      }

      &__copy {
        order: 2;
        min-height: 0;
      }

      h2 {
        margin-top: 22px;
        font-size: 27px;
      }

      &__image--desktop {
        width: min(78%, 320px);
        margin-top: 26px;
      }

      &__image--phone {
        width: min(42%, 150px);
        margin-top: 22px;
      }

      &__actions {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .mt4-button {
      width: 100%;
    }

    .about-card {
      min-height: 168px;
      padding: 22px;

      p {
        margin-top: 28px;
      }
    }

    .mac-steps {
      grid-template-columns: 1fr;
      gap: 32px;
      margin-top: 42px;

      p {
        max-width: none;
        margin-top: 18px;
      }
    }

    .requirements-banner {
      min-height: 300px;

      > img {
        object-position: 58% center;
      }
    }
  }
</style>
