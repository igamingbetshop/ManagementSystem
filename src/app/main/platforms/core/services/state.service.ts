import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private clientInfoStateNotifier$: Subject<boolean> = new Subject();
  public clientState$ = this.clientInfoStateNotifier$.asObservable();

  getInfo(enabled: boolean) {
    this.clientInfoStateNotifier$.next(enabled);
  }

  constructor() {}
}
