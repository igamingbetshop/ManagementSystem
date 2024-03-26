import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../platforms/core/services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-core-accounts-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
    <div class="partner-dropdown">
      <mat-select
        (selectionChange)="onSelectAccountType($event.value)"
        placeholder="{{'Clients.SelectAccount' | translate}}"
        panelClass="overlay-dropdown"
        disableOptionCentering>
        <mat-option [value]="null">{{'Clients.SelectAccount' | translate}}</mat-option>
        <mat-option *ngFor="let account of accounts" [value]="account.Id">{{account.AccountTypeName}}</mat-option>
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CoreAccountsSelectComponent implements OnInit {

  accounts = [];
  @Output() toAccountChange = new EventEmitter<any>();
  @Input() clientId: number;
  public configService = inject(ConfigService);
  private apiService = inject(CoreApiService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getClientAccounts();
  }

  getClientAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.accounts = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  onSelectAccountType(event: number) {
    this.toAccountChange.emit(event);
  }

}