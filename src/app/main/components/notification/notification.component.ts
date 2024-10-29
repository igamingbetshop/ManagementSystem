import { Component, ElementRef, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { take } from "rxjs/operators";
import { ConfigService, LocalStorageService } from 'src/app/core/services';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { Controllers, Methods, NotificationsMessages, NotificationsStatuses } from 'src/app/core/enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatMenuModule } from '@angular/material/menu';
import { CustomSelectComponent } from "../custom-select/custom-select.component";
import { MatIconModule } from '@angular/material/icon';
import { User } from 'src/app/core/interfaces';
import { Router } from '@angular/router';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    CustomSelectComponent,
    MatIconModule,
    ScrollingModule
  ]
})

export class NotificationComponent implements OnInit {
  @Input() menuTrigger: any;
  @ViewChild('notificationsContainer') notificationsContainer!: ElementRef;
  @ViewChild('infiniteScroll') infiniteScroll!: ElementRef;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  notificationTypes = NotificationsMessages;
  notificationsStatuses = NotificationsStatuses;
  public formGroup: UntypedFormGroup;
  id: any;
  user = signal<User | null>(null);
  notifications = signal([]);
  filter: string = 'all';

  loadCount = 20;
  paging = { SkipCount: 1, TakeCount: this.loadCount };
  loading = false;
  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private localStorage: LocalStorageService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadUserProfile();
  }

  loadNotifications() {
    if (this.loading) return;
    this.loading = true;

    const paging = {
      SkipCount: this.paging.SkipCount,
      TakeCount: this.paging.TakeCount,
    };

    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        paging,
        true,
        Controllers.USER,
        Methods.GET_NOTIFICATIONS
      )
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          const _data = data.ResponseObject;
          this.notifications.set([...this.notifications(), ..._data]);          
          this.paging.SkipCount += 1;
        }
        this.loading = false;
      });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onScroll(event) {
    const end = this.viewport.measureScrollOffset('bottom');
    const totalHeight = this.viewport.measureScrollOffset('top');
    const buffer = 100; // 100px buffer to trigger load earlier
    if (!this.loading && end <= buffer) {
      console.log('Loading more notifications');
      this.loadNotifications(); // load more notifications when near the end
    }
  }

  loadUserProfile() {
    this.id = this.localStorage.get('user')?.UserId;
    if (this.id) {
      this.api(this.id)
        .pipe(take(1))
        .subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.user.set(data.ResponseObject);
          }
        });
    }
  }

  api(id: string) {
    const url = this.configService.getApiUrl + '/ApiRequest';
    const request = {
      Method: Methods.GET_USER_BY_ID,
      Controller: Controllers.USER,
      RequestObject: id,
    };
    return this.apiService.apiPost(url, request);
  }

  handleConfigChange(event: any, config: any): void {
    config.BooleanValue = event.checked;

    const updatedConfigurations = this.user()?.Configurations?.map((item) =>
      item.Id === config.Id ? { ...item, BooleanValue: config.BooleanValue } : item
    );

    this.user.set({
      ...this.user(),
      Configurations: updatedConfigurations,
    });

    this.saveUserData(this.user()).pipe(take(1)).subscribe((data) => {
      const message = data.ResponseCode === 0 ? 'Updated' : data.Description;
      const type = data.ResponseCode === 0 ? 'success' : 'error';
      SnackBarHelper.show(this._snackBar, { Description: message, Type: type });
    });
  }

  saveUserData(obj: any) {
    const url = this.configService.getApiUrl + '/ApiRequest';
    const request = {
      Method: Methods.SAVE_USER,
      Controller: Controllers.USER,
      RequestObject: { ...obj },
    };
    return this.apiService.apiPost(url, request);
  }

  setFilter(type: string) {
    this.filter = type;
  }

  filteredNotifications() {
    if (this.filter === 'unread') {
      return this.notifications().filter((note) => note.Status === 1);
    }
    return this.notifications();
  }

  markAsRead(note: any) {
    if (note.Status === 1) {
      const request = { Id: note.Id };
      this.apiService
        .apiPost(this.configService.getApiUrl, request, true, Controllers.USER, Methods.READ_NOTIFICATION)
        .pipe(take(1))
        .subscribe((data) => {
          if (data.ResponseCode !== 0) {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
          }
        });
    }

    this.handleRedirection(note);
  }

  handleRedirection(note: any) {
    let route: string;
    let queryParams: any = {};
  
    switch (note.TypeId) {
      case 1:
        route = '/main/platform/clients/all-clients/client/main';
        queryParams = { clientId: note.ClientId };
        break;
      case 2:
        route = '/main/platform/clients/all-clients/client/kyc';
        queryParams = { clientId: note.ClientId };
        break;
      case 3:
        route = '/main/platform/payments/deposits/paymentrequests';
        queryParams = { paymentId: note.PaymentRequestId, type: 3 };
        break;
      case 4:
        route = '/main/platform/payments/withdrawals/paymentrequests';
        queryParams = { paymentId: note.PaymentRequestId, type: 1 };
        break;
      case 5:
        route = '/main/platform/bonuses/common/details';
        queryParams = { commonId: note.BonusId };
        break;
      default:
        return;
    }
  
    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
      this.router.navigate([route], { queryParams, queryParamsHandling: 'merge' }).then(() => {
        this.closeMenu();
      });
    });
  }

  closeMenu() {
    this.menuTrigger?.closeMenu();
  }

}
