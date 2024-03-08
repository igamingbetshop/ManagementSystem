import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService, ConfigService, LocalStorageService } from "../../../core/services";
import { interval, Subject, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { SearchService } from "../../../core/services/search.sevice";
import { debounceTime } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('matSelect') matSelect: MatSelect;
  public currentDateTime = new Date();
  public userName = '';
  private timeInterval = 1000;
  private subscription$: Subscription;
  public showSearchBox = false;
  public searchedValue: string;
  public inputChanged$ = new Subject<string>();
  public imagePath: string = '';
  public languages = [];
  public defaultLanguage: string = "";

  constructor(
    public authService: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private searchService: SearchService,
    private translate: TranslateService,
    private configService: ConfigService,
  ) {
    this.searchService.searchState$.subscribe(showSearchBox => {
      this.showSearchBox = showSearchBox;
    });
  }

  ngOnInit() {
    this.languages = this.configService.langList;
    this.defaultLanguage = this.getLanguage();
    this.setDateTime();
    this.userName = this.localStorageService.get('user')?.UserName;
    this.debounceSearchTime();
    this.setLogoByDomain();
  }

  getLanguage(): string {
    if (!this.localStorageService.getLanguage('lang')) {
      return 'en';
    }
    return this.localStorageService.getLanguage('lang');
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.localStorageService.addLanguage('lang', language);
  }

  debounceSearchTime(): void {
    this.inputChanged$.pipe(debounceTime(this.timeInterval)).subscribe((value) => {
      this.searchService.sendSearchValue(value);
    });
  }

  setLogoByDomain() {
    const imagePath = "assets/images/" + window.location.hostname + "/logo.svg";

    let image = new Image();

    image.onload = () => {
      this.imagePath = imagePath;
    };
    image.onerror = () => {
      this.imagePath = 'assets/images/logo.svg';
    };
    image.src = imagePath;
  }

  openMatSelect(): void {
    const panel = this.matSelect.panel.nativeElement as HTMLDivElement;
    panel.scrollTo({ top: 0, behavior: 'smooth' });
  }

  searchData(value: string) {
    this.inputChanged$.next(value);
  }

  setDateTime(): void {
    this.subscription$ = interval(this.timeInterval).subscribe(time => {
      this.currentDateTime = new Date();
    });
  }

  navigateMain(): void {
    this.router.navigate(['/main/home']);
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
