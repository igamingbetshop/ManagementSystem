import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToSpaces',
  standalone: true,
})
export class StringToSpacesPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
}
