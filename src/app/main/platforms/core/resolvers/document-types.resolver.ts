import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {Controllers, Methods} from "../../../../core/enums";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {CommonDataService} from "../../../../core/services/common-data.service";
import {CoreApiService} from "../services/core-api.service";

@Injectable()
export class DocumentTypesResolver 
{
  constructor(private apiService:CoreApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService,
              private commonDataService:CommonDataService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const documentTypes = this.localStorageService.get('document-types');
    if(documentTypes)
    {
      this.commonDataService.setDocumentTypes(documentTypes);
      return documentTypes;
    }
    else
    {
      return this.apiService.apiPost(this.configService.getApiUrl,
        {}, true, Controllers.ENUMERATION, Methods.GET_CLIENT_DOCUMENT_TYPES).pipe(map(data => {
          let documentTypes = [];
          if( data.ResponseCode === 0)
          {
            documentTypes = data.ResponseObject;
            this.localStorageService.add('document-types', documentTypes);
            this.commonDataService.setDocumentTypes(documentTypes);
          }
          return  documentTypes;
      }));
    }
  }
}
