import { FormControl } from "@angular/forms";

export function numbersAndCommas (control: FormControl) {
    const value = control.value;
    if (!value || value.trim() === '') {
      return null; 
    }
    const regex = /^\d+(\s*,\s*\d+)*$/;
    return regex.test(value) ? null : { invalidAffiliateId: true };
  }