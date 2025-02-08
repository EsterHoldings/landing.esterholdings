import useAppCore from "~/composables/useAppCore";

export class IsUnique implements IRule {

  async passes(value: any, params: any = null) {
    const appCore = useAppCore();

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    const parts = params.value.split(',').map(part => part.trim()).filter(Boolean);

    const table:string|null = parts[0] || null;
    const field:string|null = parts[1] || null;

    try {
      const result = await appCore.helper.validationIsUnique({
        'table': table,
        'value': value,
        'field': field
      })

      return result.data.data;
    } catch (e) {
      console.error('IsUnique -> request Error');
      return true;
    }
  }

  message(fieldName: any) {
    return `This value ${fieldName} is exist!`;
  }
}

export default IsUnique;
