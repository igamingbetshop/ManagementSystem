import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToSpaces',
  standalone: true,
})
export class StringToSpacesPipe implements PipeTransform {
  transform(value: string): string {
    // Replace each capital letter with a space and the lowercase version of the letter
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
}
