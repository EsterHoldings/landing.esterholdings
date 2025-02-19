import useValidation from "../../../../composables/useValidation";

import { formData } from ".";

export const validatorUserForm: any = useValidation(formData, {
    roles: ["required"],
});

export const validateUserForm: any = (doSendFormCallback: any): void =>
    validatorUserForm.doValidate() && doSendFormCallback();
export const resetValidationUserForm: any = (): void =>
    validatorUserForm.clearFieldsErrors() && resetFormData();

export const resetFormData: any = (): void => {
    formData.roles = [];
};
