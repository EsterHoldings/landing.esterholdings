import useAppCore from "~/composables/useAppCore";

export class IsUnique implements IRule {

    async passes(value: any, params: any = null) {
        return true;
    }

    message(fieldName: any) {
        return `The password is not compare!`;
    }
}

export default IsUnique;
