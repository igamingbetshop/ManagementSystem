import { AbstractControl, ValidationErrors } from '@angular/forms';

export class Validator {

  // public static MatchPassword(AC: AbstractControl) {
  //   console.log("AC",AC);
  //    let password = AC.get('Password').value;
  //    console.log("password",password);
  //     let confirmPassword = AC.get('ConfirmPassword').value;
  //     console.log("ConfirmPassword",confirmPassword);
  //     if (password != confirmPassword) {

  //       AC.get('ConfirmPassword').setErrors({MatchPassword: true})

  //      } else {
  //        return null;
  //      }

  // }

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


