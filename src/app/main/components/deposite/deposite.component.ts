import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CoreApiService } from "../../platforms/core/services/core-api.service";
import { CommonDataService, ConfigService } from "../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, Methods, ModalSizes } from "../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";
import { MatDialog } from "@angular/material/dialog";
import { StateService } from '../../platforms/core/services/state.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deposite',
  templateUrl: './deposite.component.html',
  styleUrls: ['./deposite.component.scss'],
})
export class DepositeComponent implements OnInit {
  public clientId: number;
  public paymentId;
  public payment;
  public paymentVerified;
  public paymentHistory = [];
  public statusName = [];
  public partners = [];
  public paymentStatus;
  public partnerName;
  public languages = [];
  public commentList = [];
  public selectedLanguage;
  public paymentSystemName: string;
  public type;
  public selectedPage;
  public paymentInfo;
  public paymentButtons = [
    { Id: 3, Name: 'Payments.InProcess' },
    { Id: 4, Name: 'Payments.Frozen' },
    { Id: 5, Name: 'Payments.WaitingForKYC' },
    { Id: 2, Name: 'Common.Cancel' },
    { Id: 7, Name: 'Common.Confirm' },
    { Id: 8, Name: 'Payments.Approve' },
  ]
  public data: any;
  public textName = '';
  public SendEmail = false;
  public Comment = '';

  splitVisible: boolean = false;
  totalAmount: number;
  totalSplitedAmount: number;
  isSumValid: boolean = false;

  splitedItems: any[] = [];
  mySplitedItem: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    protected injector: Injector,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private stateService: StateService,
    private router: Router,
    private translate: TranslateService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.paymentId = this.activateRoute.snapshot.queryParams.paymentId;
    this.paymentSystemName = this.activateRoute.snapshot.queryParams.paymentSystemName
    this.type = this.activateRoute.snapshot.queryParams.type;
    this.partners = this.commonDataService.partners;
    this.selectedPage = this.type == '1' ? 'Withdrawals' : this.type == '2' || '3' ? 'Deposits' : '';
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_PAYMENT_REQUEST_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.statusName = data.ResponseObject;
        }
      });
    this.getPaymentHistory();
    this.getPaymentRequestById();

    this.apiService.apiPost(this.configService.getApiUrl, 1, true,
      Controllers.CONTENT, Methods.GET_COMMENT_TEMPLATES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.commentList = data.ResponseObject;
        }
      });
    this.getLanguages();
  }

  onMessageTransaction()  {
    SnackBarHelper.show(this._snackBar, { Description: this.translate.instant('Common.TransactionDosentExist'), Type: "error" });
  }

  getPaymentRequestById() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.paymentId, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_REQUEST_BY_ID).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          // if((data.ResponseObject.PaymentRequest.Type == 2 && this.type != 2 || data.ResponseObject.PaymentRequest.Type == 3 && this.type == 2)
          // ) {
          //   this.onMessageTransaction();
          //   return;
          // }
          if ((data.ResponseObject.PaymentRequest.Type == 3 || data.ResponseObject.PaymentRequest.Type == 2 )
           &&
            (this.selectedPage == 'Withdrawals' )
            ) {
              this.onMessageTransaction();
              return;
          }
          if ((data.ResponseObject.PaymentRequest.Type == 1 ) &&
            this.type != 1
            ) {
              this.onMessageTransaction();
              return;
          }
          this.paymentVerified = data.ResponseObject;
          this.payment = data.ResponseObject.PaymentRequest;
          this.paymentInfo = JSON.parse(this.payment.Info);
          this.paymentStatus = this.statusName.find((item => item.Id === data.ResponseObject.PaymentRequest.State))?.Name;
          this.partnerName = this.partners.find((item => item.Id === data.ResponseObject.PaymentRequest.PartnerId))?.Name;

          if (this.payment.Parameters) {
            this.payment['ParsedParameters'] = JSON.parse(this.payment.Parameters);
          }
          this.totalAmount = this.payment.Amount;
          this.totalSplitedAmount = this.totalAmount;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPaymentHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { PaymentRequestId: this.paymentId }, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_REQUEST_HISTORIES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentHistory = data.ResponseObject.map((items) => {
            items.StatusName = this.statusName.find((item => item.Id === items.Status))?.Name;
            return items;
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getLanguages() {
    this.languages = this.commonDataService.languages;
    this.selectedLanguage = this.commonDataService.languages.find((item) => (String(item.Id) === localStorage.getItem('lang')))?.Id;
  }

  cancelDeposit() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: String(this.payment.Id) }, true,
      Controllers.PAYMENT, Methods.CANCEL_DEPOSIT_FROM_BET_SHOP).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  // dublicate....need to clear
  async onApproveDeposite() {
    const { ConfirmComponent } = await import('../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        let value = {
          PaymentRequestId: this.paymentId,
          Comment: JSON.stringify(this.Comment),
          SendEmail: false,
          Parameters: '{}'
        }

        this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
          Methods.PAY_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });

              this.stateService.getInfo(true);
              this.getPaymentHistory();
              this.getPaymentRequestById();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          })

      }
    })
  }

  async openTransactionsModal(id, name) {
    const { ConfirmPaymentModalComponent } = await import('./confirm-payment-modal/confirm-payment-modal.component');
    const dialogRef = this.dialog.open(ConfirmPaymentModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { PaymentRequestId: String(this.payment.Id), RequestType: id, RequestName: name, SendEmail: this.SendEmail, Comment: this.Comment }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPaymentHistory();
        this.getPaymentRequestById();
      }
    });
  }

  onNavigate() {
    this.router.navigate([`main/platform/payments/${this.selectedPage.toLowerCase()}`])
  }



  onSplitPayoutRequest() {
    if (this.calculateSumOfItems() < this.totalAmount) {
      this.splitedItems.push((this.totalSplitedAmount));
    }

    const data = {
      PaymentRequestId: this.paymentId,
      Installments: this.splitedItems,
    }

    this.apiService.apiPost(this.configService.getApiUrl, data, true, Controllers.PAYMENT,
      Methods.SPLIT_PAYOUT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });

          this.stateService.getInfo(true);
          this.getPaymentHistory();
          this.getPaymentRequestById();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }

  addItem() {
    if (this.mySplitedItem) {
      this.splitedItems.push(this.mySplitedItem);
      this.mySplitedItem = '';
    }
    this.setTotalSplitedAmount();
  }

  setTotalSplitedAmount() {
    this.totalSplitedAmount = this.totalAmount - this.calculateSumOfItems();
  }

  calculateSumOfItems(): number {
    return this.splitedItems.reduce((acc, item) => acc + parseFloat(item), 0);
  }

  deleteItem(index: number) {
    this.splitedItems.splice(index, 1);
    this.setTotalSplitedAmount();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.isAddItemValid()) {
      this.addItem();
    }
  }

  isAddItemValid(): boolean {
    if (!this.mySplitedItem) {
      return false;
    }

    const newItemValue = parseFloat(this.mySplitedItem);

    if (isNaN(newItemValue) || newItemValue < 0 || newItemValue % 1 !== 0) {
      return false;
    }

    const sumOfItems = this.splitedItems.reduce((acc, item) => acc + parseFloat(item), 0) + newItemValue;

    if (Math.abs(sumOfItems) >= Math.abs(this.totalAmount)) {
      return false;
    }

    return true;
  }

}
