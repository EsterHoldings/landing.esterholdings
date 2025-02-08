export class IsRequired implements IRule {
  passes(value: any, params: any = null) {

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return !!value;
  }

  message(fieldName: any) {
    return `Field ${fieldName} is required!`;
  }
}

export default IsRequired;
