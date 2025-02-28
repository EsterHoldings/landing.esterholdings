import AdminsModule from "~/composables/core/modules/admins/admins.module";
import AccountsModule from "~/composables/core/modules/accounts/accounts.module";
import AuthModule from "~/composables/core/modules/clients/auth.module";
import ItemsModule from "~/composables/core/modules/items/items.module";
import RolesModule from "~/composables/core/modules/roles/roles.module";
import PermissionsModule from "~/composables/core/modules/permissions/permissions.module";
import UsersModule from "~/composables/core/modules/users/users.module";
import HelperModule from "~/composables/core/modules/helper/helper.module";

export interface ICoreModules {
    admins : AdminsModule;
    accounts : AccountsModule;
    auth: AuthModule;
    clients: AuthModule;
    items: ItemsModule;
    roles: RolesModule;
    permissions: PermissionsModule;
    users: UsersModule;
    helper: HelperModule;
}

export const useAppCore = (): ICoreModules => {
    return {
        admins: new AdminsModule(),
        accounts: new AccountsModule(),
        auth: new AuthModule(),
        clients: new AuthModule(),
        items: new ItemsModule(),
        roles: new RolesModule(),
        permissions: new PermissionsModule(),
        users: new UsersModule(),
        helper: new HelperModule(),
    };
};

export default useAppCore;
