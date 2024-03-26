import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static numbersAndSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const numbersAndSpacesRegex: RegExp = /^[0-9\s]*$/;
      const valid = numbersAndSpacesRegex.test(control.value);
      return valid ? null : { 'invalidInput': true };
    };
  }

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { 'invalidEmail': true };
    };
  }
}