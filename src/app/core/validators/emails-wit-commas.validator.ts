import { FormControl, Validators } from "@angular/forms";

export function emailsWithCommasValidator(control: FormControl) {
    const value = control.value;
    // Check if the value is null or empty
    if (!value || value.trim() === '') {
      return null; // Return null if value is empty
    }
    // Split the value by commas to get individual email-like entries
    const entries = value.split(',');
    // Check each entry for the presence of '@'
    const invalidEntry = entries.find(entry => {
      const trimmedEntry = entry.trim(); // Trim whitespace
      return trimmedEntry.indexOf('@') === -1; // Check for presence of '@' symbol
    });
    return invalidEntry ? { invalidEmails: true } : null;
  }