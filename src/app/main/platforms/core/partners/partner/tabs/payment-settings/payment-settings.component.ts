import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { Paging } from "../../../../../../../core/models";
import 'ag-grid-enterprise';
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { IRowNode } from 'ag-grid-enterprise';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public partnerId;
  public partnerName;
  public fromDate = new Date();
  public toDate = new Date();
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs = [];
  public statusName = [
    { Id: 1, Name: 'Active' },
    { Id: 3, Name: 'Hidden' },
    { Id: 2, Name: 'Inactive' },
  ];
  public typeNames = [
    { Id: 2, NickName: null, Name: "Deposit", Info: null },
    { Id: 1, NickName: null, Name: "Withdraw", Info: null }
  ];
  frameworkComponents = {
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
  }

  constructor(
    private apiService: CoreApiService,
    private commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    public activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog) {
    super(injector);
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
    this.getPartnerPayments();
    this.setColumnDefs();    
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Partners.PaymentSystem',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agSetColumnFilter',
        floatingFilter: true,
        filterParams: {
          valueFormatter: params => {
            const state = Number(params.value);
            return this.statusName.find(field => field.Id === state)?.Name;
          }
        },
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "State"),
          Selections: this.statusName,
        },
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Partners.Commission',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Commission',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.MinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Bonuses.MaxAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: 'main-info', queryParams: null };
          // data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          data.queryParams = { id: params.data.Id };
          return data;
        },
        sortable: false
      }
    ];
  }

  onSelectChange(key, params, val, event) {
    params[key] = val;
    this.saveCellValueChanged(event);
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.saveCellValueChanged(event);
    }
  }

  saveCellValueChanged(event) {
    const { Id, State, Priority, MinAmount, MaxAmount, Commission, PartnerId, PaymentSystemId, CurrencyId, Type } = event.data;
    const payload = {
      Id,
      State,
      Priority,
      MinAmount,
      MaxAmount,
      Commission,
      PartnerId,
      PaymentSystemId, 
      CurrencyId, 
      Type
    };
    this.apiService.apiPost(this.configService.getApiUrl, payload, true,
      Controllers.PAYMENT, Methods.UPDATE_PARTNER_PAYMENT_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  getPartnerPayments() {
    const paging = new Paging();
    paging.BetDateFrom = this.fromDate;
    paging.BetDateBefore = this.toDate;
    paging.PartnerId = +this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, paging, true,
      Controllers.PAYMENT, Methods.GET_PARTNER_PAYMENT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.map((items) => {
            items.PartnerName = this.commonDataService.partners.find((item => item.Id === items.PartnerId))?.Name;
            // items.StatusName = this.statusName.find((item => item.Id === items.State))?.Name;
            items.TypeName = this.typeNames.find((item => item.Id === items.Type))?.Name;
            return items;
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async addPaymentSettings() {
    const { AddPaymentSettingComponent } = await import('./add-payment-setting/add-payment-setting.component');
    const dialogRef = this.dialog.open(AddPaymentSettingComponent, {
      width: ModalSizes.MEDIUM
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPartnerPayments();
      }
    });
  }

  async copyPartnerSettings() {
    const { CopySettingsComponent } = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) { }
    });
  }


}
