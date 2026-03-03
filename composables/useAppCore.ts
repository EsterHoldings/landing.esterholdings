import AccountsModule from "~/composables/core/modules/accounts/accounts.module";
import AccountTypesModule from "~/composables/core/modules/accountTypes/accountTypes.module";
import Auth2faModule from "~/composables/core/modules/auth2fa/auth2fa.module";
import AuthModule from "~/composables/core/modules/auth/auth.module";
import DepositModule from "~/composables/core/modules/deposit/deposit.module";
import DashboardModule from "~/composables/core/modules/dashboard/dashboard.module";
import DocumentsModule from "~/composables/core/modules/documents/documents.module";
import HelperModule from "~/composables/core/modules/helper/helper.module";
import ItemsModule from "~/composables/core/modules/items/items.module";
import PasswordModule from "~/composables/core/modules/password/password.module";
import PaymentSystemsModule from "~/composables/core/modules/paymentSystems/paymentSystems.module";
import PaymentsModule from "~/composables/core/modules/payments/payments.module";
import PaymentDetailsModule from "~/composables/core/modules/paymentDetails/paymentDetails.module";
import UsersModule from "~/composables/core/modules/users/users.module";
import NewsModule from "~/composables/core/modules/news/news.module";
import ReferralsModule from "~/composables/core/modules/referrals/referrals.module";
import VerificationsModule from "~/composables/core/modules/verification/verifications.module";
import TicketsModule from "~/composables/core/modules/tickets/tickets.module";
import MessagesModule from "~/composables/core/modules/messages/messages.module";
import LocationsModule from "~/composables/core/modules/locations/locations.module";
import TicketsPresenceModule from "~/composables/core/modules/ticketsPresence/ticketsPresence.module";

export interface ICoreModules {
  accounts: AccountsModule;
  accountTypes: AccountTypesModule;
  auth: AuthModule;
  auth2fa: Auth2faModule;
  clients: AuthModule;
  deposit: DepositModule;
  dashboard: DashboardModule;
  documents: DocumentsModule;
  items: ItemsModule;
  payments: PaymentsModule;
  paymentDetails: PaymentDetailsModule;
  paymentSystems: PaymentSystemsModule;
  users: UsersModule;
  helper: HelperModule;
  password: PasswordModule;
  tickets: TicketsModule;
  ticketsPresence: TicketsPresenceModule;
  messages: MessagesModule;
  locations: LocationsModule;
  verifications: VerificationsModule;
  news: NewsModule;
  referrals: ReferralsModule;
}

export const useAppCore = (): ICoreModules => {
  return {
    accounts: new AccountsModule(),
    accountTypes: new AccountTypesModule(),
    auth2fa: new Auth2faModule(),
    auth: new AuthModule(),
    clients: new AuthModule(),
    deposit: new DepositModule(),
    dashboard: new DashboardModule(),
    documents: new DocumentsModule(),
    helper: new HelperModule(),
    items: new ItemsModule(),
    password: new PasswordModule(),
    payments: new PaymentsModule(),
    paymentDetails: new PaymentDetailsModule(),
    paymentSystems: new PaymentSystemsModule(),
    tickets: new TicketsModule(),
    ticketsPresence: new TicketsPresenceModule(),
    messages: new MessagesModule(),
    locations: new LocationsModule(),
    users: new UsersModule(),
    verifications: new VerificationsModule(),
    news: new NewsModule(),
    referrals: new ReferralsModule(),
  };
};

export default useAppCore;
