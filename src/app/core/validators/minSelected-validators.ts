import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function minSelectedItemsValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedItems = control.value as any[];
      if (selectedItems && selectedItems.length >= min) {
        return null; // Validation passed
      }
      return { minSelectedItems: { requiredLength: min, actualLength: selectedItems ? selectedItems.length : 0 } };
    };
  }