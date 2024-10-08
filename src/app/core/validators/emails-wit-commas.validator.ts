import { FormControl, Validators } from "@angular/forms";

export function emailsWithCommasValidator(control: FormControl) {
    const value = control.value;
    if (!value || value.trim() === '') {
      return null;
    }
    const entries = value.split(',');
    const invalidEntry = entries.find(entry => {
      const trimmedEntry = entry.trim(); 
      return trimmedEntry.indexOf('@') === -1;
    });
    return invalidEntry ? { invalidEmails: true } : null;
  }