import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private announcementSource = new BehaviorSubject<any>(null);
  currentAnnouncement = this.announcementSource.asObservable();

  constructor() {}

  updateAnnouncement(announcement: any) {
    this.announcementSource.next(announcement);
  }
}
