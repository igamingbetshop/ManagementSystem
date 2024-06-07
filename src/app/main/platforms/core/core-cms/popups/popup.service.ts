import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PopupService {
  private dataSource = new BehaviorSubject<any>(null);
  currentUpdate = this.dataSource.asObservable();

  constructor() {}

  update(news: any) {
    this.dataSource.next(news);
  }
}
