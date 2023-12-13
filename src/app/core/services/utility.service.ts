import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';

@Injectable()
export class UtilityService {

  constructor(public configService: ConfigService) {

  }

  public removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }


  public GetTimeZone() {
    const d = new Date();
    return -1 * d.getTimezoneOffset() / 60;
  }


  public showError(errorMessage: string, source: any, optionalPropertyName?: string, optionalPropertyValue?: string) {
    source.errorMessage = errorMessage;
    let timeoutId = setTimeout(() => {
      source.errorMessage = '';
      if (optionalPropertyName) {
        source[optionalPropertyName] = '';
      }
      clearTimeout(timeoutId);
    }, 3000);
  }


  public showMessageWithDelay(source: any, args: any[], delay: number = 3) {
    args.forEach(item => {
      Object.keys(item).forEach(key => {
        source[key] = item[key];
      });
    });
    let timeoutId = setTimeout(() => {
      args.forEach(item => {
        Object.keys(item).forEach(key => {
          source[key] = '';
        });
      });
      clearTimeout(timeoutId);
    }, delay * 1000);
  }



}
