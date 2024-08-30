import { AbstractControl, ValidationErrors } from '@angular/forms';

export class Validator {

  public static MatchPassword(controlName: string, matchingControlName: string){
    return (control: AbstractControl): ValidationErrors | null => {
      const input = control.get(controlName);
      const matchingInput = control.get(matchingControlName);

      if (input === null || matchingInput === null) {
          return null;
      }

      if (matchingInput?.errors && !matchingInput.errors.MatchPassword) {
          return null;
      }

      if (input.value !== matchingInput.value) {
          matchingInput.setErrors({ MatchPassword: true });
          return ({ MatchPassword: true });
      } else {
          matchingInput.setErrors(null);
          return null;
      }
  };
  }

}


