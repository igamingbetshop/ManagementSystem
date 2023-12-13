import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class SearchService {
  public searchDataNotifier$: Subject<string> = new Subject();
  public searchData$ = this.searchDataNotifier$.asObservable();

  private searchStateNotifier$: Subject<boolean> = new Subject();
  public searchState$ = this.searchStateNotifier$.asObservable();

  sendSearchValue(value: string) {
    this.searchDataNotifier$.next(value);
  }

  showSearchContainer(showed: boolean) {
    this.searchStateNotifier$.next(showed);
  }

  constructor() {}
}
