import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../core/services";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId;
  public partnerName;
  public selectedRow;

  constructor(private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              protected injector: Injector,
              public configService: ConfigService,
              public dialog: MatDialog,
              private ref: ChangeDetectorRef,
              private _snackBar: MatSnackBar) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.BankName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Partners.BankCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankCode',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.BankAccountNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Accounts',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Partners.BranchName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BranchName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Partners.IBAN',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IBAN',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Partners.OwnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OwnerName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.PaymentSystemId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
    ]
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getPartnerBanks();
  }

  getPartnerBanks() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.GET_PARTNER_BANKS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      }
    });
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  createAccount(params) {
  }

  onRowSelected(params) {
    if (params.node.selected) {
      // this.selectedButton = true;
      this.selectedRow = params
    } else {
      return;
    }
  }

  editAccount(row_obj) {
    this.selectedRow = row_obj;
  }

  async openDialog(action, obj) {
    obj.action = action;
    const {CreateEditAccountComponent} = await import('./create-edit-account/create-edit-account.component');
    const dialogRef = this.dialog.open(CreateEditAccountComponent, {
      width: ModalSizes.MEDIUM,
      data: obj
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result.event == 'Add') {
        this.createAccount(result.data);
      } else if (result.event == 'Edit') {
        this.editAccount(result.data);
      }
      this.getPartnerBanks();
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  async copyPartnerSettings() {
    const {CopySettingsComponent} = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

}
