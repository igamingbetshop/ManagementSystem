import { AbstractControl, ValidatorFn } from '@angular/forms';

export function imageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const imageData = control.value;
      const imageName = control.parent?.get('ImageName')?.value;
      if (imageData && imageName) {
        const isValidFormat = /\.(jpg|jpeg|png|gif)$/i.test(imageName);
        const isValidSize = imageData.length * 0.75 < 5000000; // Approximate size check for base64 data
  
        return isValidFormat && isValidSize ? null : { invalidImage: true };
      }
      return null;
    };
  }