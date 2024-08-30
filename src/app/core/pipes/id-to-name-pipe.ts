import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'IdToName',
  standalone: true,
})

export class IdToNamePipe implements PipeTransform {
  transform(value: string | number, mapping: { Id: number | string | boolean, Name: string }[]): string {
    if (value === null || value === undefined) return '';
    const stringValue = value.toString();
    
    const IdToNameMap = mapping.reduce((acc, item) => {
      let key: string;
      if (item.Id === null) {
        key = 'null';
      } else if (item.Id === true) {
        key = 'true';
      } else if (item.Id === false) {
        key = 'false';
      } else {
        key = item.Id.toString();
      }
      acc[key] = item.Name;
      return acc;
    }, {} as { [key: string]: string });

    const Ids = stringValue.split(',').map(Id => Id.trim());
    const Names = Ids.map(Id => IdToNameMap[Id] || Id);

    return Names.join(', ');
  }
}
