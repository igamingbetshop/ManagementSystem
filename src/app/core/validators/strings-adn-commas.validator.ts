import { FormControl } from "@angular/forms";

export function stringAndCommaValidator(control: FormControl) {
    const value = control.value;
    if (!value || value.trim() === '') {
      return null;
    }
    const regex = /^[a-zA-Z, ]+$/;
    return regex.test(value) ? null : { invalidStringAndComma: true };
  }
  