import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";

import { take } from "rxjs/operators";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { Paging } from "../../../core/models";
import { Controllers, Methods } from "../../../core/enums";
import { CoreApiService } from "../../platforms/core/services/core-api.service";
import { ConfigService } from "../../../core/services";
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-quick-find',
  templateUrl: './quick-find.component.html',
  styleUrls: ['./quick-find.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
    TranslateModule
  ],
})
export class QuickFindComponent {

  public isQuickLinksOpened = false;
  private baseUrl = '/main/platform';
  private quickFindData;

  quickLinksFilter = {
    ClientId: '',
    ClientName: '',
    ClientUserName: '',
    ClientEmail: '',
    DepositId: '',
    WithdrawId: '',
    InternetBetId: '',
    BetShopBetId: '',
    MobileNumber: '',
  };

  constructor(
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private configService: ConfigService
  ) {
  }

  toggleQuickMenu(): void {
    this.isQuickLinksOpened = !this.isQuickLinksOpened;
  }

  searchQuickLink(searchType: string): void {

    switch (searchType) {
      case 'clientId':
        this.handleClientRedirect('client-id', this.quickLinksFilter.ClientId)
        break;
      case 'clientUserName':
        this.handleClientRedirect('username', this.quickLinksFilter.ClientUserName)
        break;
      case 'clientName':
        this.handleClientRedirect('name', this.quickLinksFilter.ClientName);
        break;
      case 'clientEmail':
        this.handleClientRedirect('email', this.quickLinksFilter.ClientEmail);
        break;
      case 'MobileNumber':
        this.handleClientRedirect('mobileNumber', this.quickLinksFilter.MobileNumber);
        break;
      case 'depositId':
        const depositDetailUrl = this.baseUrl + "/payments/paymentrequests?type=2&paymentId=" + this.quickLinksFilter.DepositId;
        window.open(depositDetailUrl, '_blank');
        break;
      case 'withdrawId':
        const withdrawDetailUrl = this.baseUrl + "/payments/paymentrequests?type=1&paymentId=" + this.quickLinksFilter.WithdrawId;
        window.open(withdrawDetailUrl, '_blank');
        break;
      case 'internetBetId':
        const internetUrl = this.baseUrl + '/bets/internet';
        const windowInternet = window.open(internetUrl, '_blank');
        windowInternet['searchData'] = {
          value: this.quickLinksFilter.InternetBetId
        }
        break;
      case 'betShopBetId':
        const betShopUrl = this.baseUrl + '/bets/bet-bet-shops';
        const windowbetShop = window.open(betShopUrl, '_blank');
        windowbetShop['searchData'] = {
          value: this.quickLinksFilter.BetShopBetId
        }
        break;
    }
  }

  handleClientRedirect(type: string, value: string) {
    if (type !== "client-id") {
      value = value.trim();
    }
    const request = this.getRequestData(type, value)

    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.CLIENT, Methods.GET_CLIENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.quickFindData = data.ResponseObject.Entities;
          if (data.ResponseObject.Count === 0) {
            
            SnackBarHelper.show(this._snackBar, { Description: "Client not found", Type: "error" });
          } else if (data.ResponseObject.Count === 1) {
            const id = data.ResponseObject.Entities[0].Id;
            this.redirectClientDetail(id);
          } else {
            this.openNewClientsLink(type, value);
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getRequestData(type: string, value: string) {
    let paging = new Paging();

    paging.SkipCount = 0;
    paging.TakeCount = 100;

    if (type === "client-id") {
      paging.Ids = this.getOperationId(value)
    } else if (type === 'username') {
      paging.UserNames = this.getOperationType(value)
    } else if (type === 'name') {
      paging.FirstNames = this.getOperationType(value)
    } else if (type === 'email') {
      paging.Emails = this.getOperationType(value)
    } else if (type === 'mobileNumber') {
      paging.MobileNumbers = this.getOperationType(value)
    }

    return paging;
  }


  getOperationType(value: string) {
    return {
      IsAnd: true,
      ApiOperationTypeList: [{
        OperationTypeId: 7,
        StringValue: value
      }]
    }
  }

  getOperationId(value: string) {
    return {
      IsAnd: true,
      ApiOperationTypeList: [{
        OperationTypeId: 1,
        IntValue: Number(value)
      }]
    }
  }

  redirectClientDetail(id: number) {
    const clientDetailUrl = this.baseUrl + '/clients/all-clients/client/main?clientId=' + id;
    window.open(clientDetailUrl, '_blank');
  }

  openNewClientsLink(type: string, value: string): void {
    
    const clientUrl = this.baseUrl + '/clients/all-clients';
    const searchWindow = window.open(clientUrl, '_blank');
    searchWindow['searchData'] = this.quickFindData;
  }

}
