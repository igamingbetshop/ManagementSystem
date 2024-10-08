import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ViewContainerRef, signal } from '@angular/core';
import { AuthService, ConfigService, LocalStorageService } from "../../../core/services";
import {filter, interval, Subject, Subscription} from "rxjs";
import { Router } from "@angular/router";
import { SearchService } from "../../../core/services/search.sevice";
import { debounceTime } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { MatSelect } from "@angular/material/select";
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { SportsbookSignalRService } from '../../platforms/sportsbook/services/signal-r/sportsbook-signal-r.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('matSelect') matSelect: MatSelect;
  @ViewChild('languageContainer', { static: false }) languageContainer: ElementRef;
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', { read: ViewContainerRef }) bulkEditorRef!: ViewContainerRef;
  public currentDateTime = new Date();
  public subscription: Subscription = new Subscription();
  public userName = '';
  public vipLevel;
  private timeInterval = 1000;
  private subscription$: Subscription;
  public showSearchBox = false;
  public searchedValue: string;
  public inputChanged$ = new Subject<string>();
  public imagePath: string = '';
  public languages = [];
  public defaultLanguage: string = "";
  public signalRSubscription: Subscription;
  notificationsCount = signal(0);
  isReconnected: boolean;

  constructor(
    private authService: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private searchService: SearchService,
    private translate: TranslateService,
    private configService: ConfigService,
    private _signalR: SportsbookSignalRService,
    private _snackBar: MatSnackBar,
  ) {
    this.searchService.searchState$.subscribe(showSearchBox => {
      this.showSearchBox = showSearchBox;
    });
  }

  ngOnInit() {
    this.languages = this.configService.langList;
    this.defaultLanguage = this.getLanguage();
    this.translate.use(this.defaultLanguage);
    this.setGlobalDirection(this.defaultLanguage);
    this.setDateTime();
    this.initSignalR();
    this.userName = this.localStorageService.get('user')?.UserName;
    this.vipLevel = this.localStorageService.get('user')?.VipLevel;
    this.notificationsCount.set(this.localStorageService.get('user')?.NotificationsCount);
    this.debounceSearchTime();
    this.setLogoByDomain();
  }

  initSignalR() {
    this._signalR.init('basehub');

    this.subscription.add(this._signalR.connectionState$.pipe(filter((data) => !!data)).subscribe(connected => {
      this.listenForNotifications();
    }));

    this.subscription.add(this._signalR.reConnectionState$.subscribe(isReconnected => {
      this.isReconnected = isReconnected;
      this.listenForNotifications();
    }));
  }

  listenForNotifications(): void {
    this._signalR.connection.on('onNotificationsCount', (message) => {
      console.log('Received onNotificationsCount message:', message);

      if (message !== undefined) {
        this.notificationsCount.set(message);
      }
    });

    this._signalR.connection.on('error', (error) => {
      console.error('Error in receiving notifications:', error);
      SnackBarHelper.show(this._snackBar, { Description: 'Error receiving notifications', Type: 'error' });
    });
  }


  getLanguage(): string {
    const storedLanguage = this.localStorageService.getLanguage('lang');
    return storedLanguage ? storedLanguage : 'en';
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.localStorageService.addLanguage('lang', language);
    this.setGlobalDirection(language);
  }

  setGlobalDirection(language: string) {
    if (['ar', 'fa'].includes(language)) {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
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

  onLogOut() {
    this.authService.logOut()
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  async onOpenNotifications() {
    if (this.bulkEditorRef) {
      this.bulkEditorRef.clear();
    }
    const componentInstance = await import('../notification/notification.component').then(c => c.NotificationComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
  }

}
