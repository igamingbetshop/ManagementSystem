import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService
{
  constructor(private http: HttpClient)
  {

  }

  apiPost(url:string, body:any)
  {
    return this.http.post<any>(
      url,
      body, {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
      });
  }

  apiGet(url: string, data?:any, method:string = '')
  {
    let requestUrl = '';
    requestUrl = `${url}/` + method;
    return this.http.get<any>(requestUrl, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

}
