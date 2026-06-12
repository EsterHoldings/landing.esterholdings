export const footerMenuRoutes = () => {
  return {
    trading: [
      { labelKey: "landing.footer.trading.items[2]", path: "platform" },
      { labelKey: "landing.footer.trading.items[3]", path: "trading-conditions" },
    ],
    company: [
      { labelKey: "landing.footer.company.items[0]", path: "about-company" },
      { labelKey: "landing.footer.company.items[1]", path: "documents" },
      { labelKey: "landing.footer.company.items[2]", path: "company-news" },
      { labelKey: "landing.footer.company.items[3]", path: "contacts" },
    ],
  };
};
