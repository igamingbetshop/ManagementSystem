import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {ServerCommonModel} from "../models/server-common-model";

@Injectable()
export class CommonDataService
{
  public currencies:ServerCommonModel[] = [];
  public currencyNames:string[] = [];
  public genders:ServerCommonModel[] = [];
  public partners:ServerCommonModel[] = [];
  public languages:ServerCommonModel[] = [];
  public documentTypes:ServerCommonModel[] = [];
  public setLanguage$: Subject<string> = new Subject<string>();

  private initialized:boolean = false;
  private isDocumentTypeSet:boolean = false;

  initCommonData(commonData:any)
  {
    if(!this.initialized)
    {
      this.initialized = true;
      this.currencies = commonData.currencies;
      this.genders = commonData.genders;
      this.languages = commonData.languages;
      this.currencyNames = this.currencies.map(currency => currency.Name);
    }
  }

  setPartners(partners)
  {
      this.partners = partners;
  }

  setDocumentTypes(documentTypes)
  {
    if(!this.isDocumentTypeSet)
    {
      this.isDocumentTypeSet = true;
      this.documentTypes = documentTypes;
    }
  }
}
