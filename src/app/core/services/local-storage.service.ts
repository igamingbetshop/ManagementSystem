import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {

  public get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  public add(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public removeAll(): void {
    localStorage.clear();
  }

  public addLanguage(key: string, data: any): void {
    localStorage.setItem(key, data);
  }

  public getLanguage(key: string): string {
    return localStorage.getItem(key);
  }
}
