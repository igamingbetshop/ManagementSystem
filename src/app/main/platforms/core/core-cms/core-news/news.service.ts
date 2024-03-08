import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsSource = new BehaviorSubject<any>(null);
  currentUpdate = this.newsSource.asObservable();

  constructor() {}

  update(news: any) {
    this.newsSource.next(news);
  }
}
