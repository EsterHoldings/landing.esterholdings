export const footerMenuRoutes = () => {
  return {
    trading: [
      {
        labelKey: "landing.header.megaMenu.Trading[3].items[0]",
        path: "account-replenishment",
      },
      {
        labelKey: "landing.header.megaMenu.Trading[3].items[1]",
        path: "withdrawal-of-funds",
      },
    ],
    company: [
      { labelKey: "landing.footer.company.items[0]", path: "about-company" },
      { labelKey: "landing.footer.company.items[1]", path: "documents" },
      { labelKey: "landing.footer.company.items[2]", path: "company-news" },
      { labelKey: "landing.footer.company.items[3]", path: "contacts" },
    ],
  };
};
