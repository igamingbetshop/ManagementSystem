import { Component, ElementRef, EventEmitter, OnInit, Output, signal, ViewChild } from '@angular/core';
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
]
})
export class NotificationComponent implements OnInit {
  
  @ViewChild('notificationsContainer') notificationsContainer!: ElementRef;
  notificationTypes = NotificationsMessages
  notificationsStatuses = NotificationsStatuses;
  public formGroup: UntypedFormGroup;
  id;
  fields: { [key: string]: string } = {}; 
  fieldKeys: string[] = [];
  user = signal<User | null>(null);
  notifications = signal([]);
  filter: string = 'all'; 

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private localStorage: LocalStorageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getBulkEditFields();
    this.getProfileData();
  }

  getBulkEditFields() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.USER, Methods.GET_NOTIFICATIONS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.notifications.set(data.ResponseObject);
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  getProfileData(): void {
    this.id = this.localStorage.get('user')?.UserId;
    this.api(this.id).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.user.set(data.ResponseObject);
      }
    });
  }

  api(id) {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.GET_USER_BY_ID;
    request.Controller = Controllers.USER;
    request.RequestObject = id;
    return this.apiService.apiPost(url, request);
  }

  onCancelBtn(event: MouseEvent) {
    event.stopPropagation();
  }

  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    const activeElement = document.activeElement as HTMLElement;
    const tabIndex = activeElement.getAttribute('tabindex');
    let nextElement: HTMLElement;

    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextElement = this.notificationsContainer.nativeElement.querySelector(`[tabindex="${+tabIndex + 1}"]`);
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      nextElement = this.notificationsContainer.nativeElement.querySelector(`[tabindex="${+tabIndex - 1}"]`);
    }

    if (nextElement) {
      nextElement.focus();
      event.preventDefault();
    }
  }

  onChangeConfig(event: any, config: any): void {
    config.BooleanValue = event.checked;
  
    const updatedConfigurations = this.user()['Configurations'].map(item => {
      if (item.Id === config.Id) {
        return { ...item, BooleanValue: config.BooleanValue };
      }
      return item;
    });
  
    this.user.set({
      ...this.user(),
      Configurations: updatedConfigurations
    });
  
    this.saveUserData(this.user()).pipe(take(1)).subscribe(data => {

      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, { Description: 'Updated', Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });;
  }

  saveUserData(obj) {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.SAVE_USER;
    request.Controller = Controllers.USER;
    request.RequestObject = { ...request, ...obj };
    return this.apiService.apiPost(url, request);
  }

  setFilter(type: string) {
    this.filter = type;
  }

  filteredNotifications() {
    if (this.filter === 'unread') {
      return this.notifications().filter(note => note.Status === 1);
    }
    return this.notifications();
  }

  onReadNote(note) {
    let request: any = {};
    request.Id = note.Id;
    this.apiService.apiPost(this.configService.getApiUrl, request, true, Controllers.USER, Methods.READ_NOTIFICATION ).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        // handle success response
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
    if(note.TypeId === 1) {
      this.onRedirectToCLients(note)
    } else if(note.TypeId === 2) {
      this.onRedirectToCLientKYC(note)
    } else if(note.TypeId === 3) {
      this.onRedirectToDeposit(note)
    } else if(note.TypeId === 4) {
      this.onRedirectToWithdraw(note)
    } else if(note.TypeId === 5) {
      this.onRedirectToBonus(note)
    }
  }

  onRedirectToCLients(note) {
    this.router.navigate(['/main/platform/clients/all-clients/client/main'], {
      queryParams: { clientId: note.ClientId }
    })
  }

  onRedirectToCLientKYC(note) {
    this.router.navigate(['/main/platform/clients/all-clients/client/kyc'], {
      queryParams: { clientId: note.ClientId }
    })
  }

  onRedirectToDeposit(note) {
    this.router.navigate(['/main/platform/payments/deposits/paymentrequests'], {
      queryParams: { paymentId: note.PaymentRequestId, type: 3 }
    })
  }

  onRedirectToWithdraw(note) {
    this.router.navigate(['/main/platform/payments/withdrawals/paymentrequests'], {
      queryParams: { paymentId: note.PaymentRequestId, type: 1 }
    })
  }

  onRedirectToBonus(note) {
    this.router.navigate(['/main/platform/bonuses/common/details'], {
      queryParams: { commonId: note.BonusId }
    })
  }

}
