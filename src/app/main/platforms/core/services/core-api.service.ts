import { Injectable } from '@angular/core';
import { ApiService } from "../../../../core/services";
import { Request } from "../../../../core/models";

@Injectable(
  { providedIn: 'root' }
)
export class CoreApiService {
  constructor(private apiService: ApiService) {
  }

  apiPost(url: string, data: any, isApiRequest = false, controller: string = '', method: string = '', clientId = null, loading : boolean = true) {
    let requestUrl = '';
    let body = {};
    if (isApiRequest) {
      const request: Request = new Request();
      request.Method = method;
      request.Controller = controller;
      request.Loading = loading;
      clientId ? request.ClientId = clientId : null;
      requestUrl = `${url}/ApiRequest`;
      request.RequestObject = data ? (typeof data === 'string' || typeof data === 'number' || Array.isArray(data)) ? data : { ...request, ...data } : undefined;
      body = request;
    }
    else {
      requestUrl = `${url}/` + method;
      body = { ...body, ...data }
    }
    return this.apiService.apiPost(requestUrl, body);
  }

}
