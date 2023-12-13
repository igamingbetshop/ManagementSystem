import {Injectable} from '@angular/core';
import {ServerFilterOption} from "../models/server-filter-option";
import {FilterOption} from "../models/filter-option";

@Injectable({providedIn: 'root'})

export class FilterService {

  public booleanOptions:FilterOption[] = [];
  public stateOptions:FilterOption[] = [];
  public numberOptions:FilterOption[] = [];
  public textOptions:FilterOption[] = [];

  private initialized:boolean = false;

  public initFilterOptions(filterOptions:ServerFilterOption[]) {
    if(!this.initialized) {
      this.initialized = true;

      filterOptions.forEach(serverOption => {
        const option = new FilterOption();
        option.displayKey = serverOption.Id;
        option.displayName = serverOption.NickName;
        option.test = (c,f) => {};
        switch (option.displayKey) {
          case 1:
            this.numberOptions.push(option);
            this.booleanOptions.push(option);
            this.textOptions.push(option);
            this.stateOptions.push(option);
            break;
          case 2:
            this.numberOptions.push(option);
            break;
          case 3:
            this.numberOptions.push(option);
            break;
          case 4:
            this.numberOptions.push(option);
            break;
          case 5:
            this.numberOptions.push(option);
            break;
          case 6:
            this.numberOptions.push(option);
            this.stateOptions.push(option);
            this.textOptions.push(option);
            this.booleanOptions.push(option);
            break;
          case 7:
            this.textOptions.push(option);
            break;
          case 8:
            this.textOptions.push(option);
            break;
          case 9:
            this.textOptions.push(option);
            break;
          case 10:
            this.textOptions.push(option);
            break;
          case 11:
            /*In set*/
            break;
          case 12:
            /*Out of set*/
            break;
          case 13:
            /*At least one in set*/
            break;
        }
      });
    }
  }
}
