import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { CommonDataService } from 'src/app/core/services';
import { CoreApiService } from '../services/core-api.service';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { CellClickedEvent, CellValueChangedEvent, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bet-shops-edit',
  templateUrl: './bet-shops-edit.component.html',
  styleUrls: ['./bet-shops-edit.component.scss']
})
export class BetShopsEditComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  public oldData: any = {};
  public groupContainer: any[] = [];
  public partners: any[] = [];
  public filter = null;
  public rowData = [];
  public selectedGroup;
  public statuses = [
    { Name: `Yes`, Id: true },
    { Name: `No`, Id: false },
    { Name: `None`, Id: null },
  ]
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents = {
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    buttonRenderer: ButtonRendererComponent,
  }
  override defaultColDef = {
    flex: 1,
    unSortIcon: false,
    copyHeadersToClipboard: true,
    resizable: true,
    editable: true,
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
    },
    cellEditor: 'numericEditor',
    menuTabs: [
      'filterMenuTab',
      'generalMenuTab',
    ],
    minWidth: 50,
  };

  public autoGroupColumnDef: ColDef = {
    headerName: 'Common.Id',
    headerValueGetter: this.localizeHeader.bind(this),
    floatingFilter: true,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
    },
    checkboxSelection: true,
    filter: 'agNumberColumnFilter',
    cellRendererParams: {
      suppressCount: true,
    },
    minWidth: 230,
  };

  public groupDefaultExpanded = 0;

  constructor(
    protected injector: Injector,
    public activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    public dialog: MatDialog,

  ) {
    super(injector);
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.setColdefs();
    this.getBetShops();
  }

  setColdefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        editable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        editable: true,
        floatingFilter: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.partners.map(item => item.Id),
          debounceMs: 200,
          suppressFilterButton: true,
          valueFormatter: (
            params: ValueFormatterParams
          ) => params.value = this.partners.find(item => item.Id == params.value)?.Name,
        },
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "PartnerId"),
          Selections: this.partners,
        },
      },
      {
        headerName: 'Products.ParentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ParentId',
        editable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellParentValueChanged(event.data),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'BetShops.MaxCopyCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxCopyCount',
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'BetShops.MaxWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinAmount',
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'BetShops.MinBetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinBetAmount',
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'BetShops.MaxEventCountPerTicket',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxEventCountPerTicket',
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'BetShops.CommissionType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommissionType',
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'BetShops.CommisionRate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommisionRate',
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'BetShops.AnonymousBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AnonymousBet',
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "AnonymousBet"),
          Selections: this.statuses,
        },
      },
      {
        headerName: 'Sport.AllowCashout',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowCashout',
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "AllowCashout"),
          Selections: this.statuses,
        },
      },
      {
        headerName: 'BetShops.AllowLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowLive',
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "AllowLive"),
          Selections: this.statuses,
        },
      },
      {
        headerName: 'BetShops.UsePin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UsePin',
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "UsePin"),
          Selections: this.statuses,
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.goToBetShops(event),
      },
    ];
  }

  async addGroup() {
    let paretnId;
    if (this.agGrid?.api.getSelectedRows()[0]) {
      paretnId = this.agGrid?.api.getSelectedRows()[0];
    }

    const { AddComponent } = await import('./add/add.component');
    const dialogRef = this.dialog.open(AddComponent, {
      width: ModalSizes.SMALL,
      data: { parentGroup: paretnId, partners: this.partners }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getBetShops();
      }
    })
  }

  async deleteGroup() {
    if (!this.agGrid?.api.getSelectedRows()[0]) {
      SnackBarHelper.show(this._snackBar, { Description: 'Please select group', Type: "error" });
      return;
    }
    const group = this.agGrid?.api.getSelectedRows()[0];
    const { ConfirmComponent } = await import('../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, group,
          true, Controllers.BET_SHOP, Methods.DELETE_BET_SHOP_GROUPS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.getBetShops();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }

    })
  }

  public getDataPath = (data: any) => {
    return data.groupKey;
  };

  onSelectChange(key, params, val,) {
    params[key] = val;

    this.onCellValueChanged(params);
  }

  onCellValueChanged(group) {
    this.apiService.apiPost(this.configService.getApiUrl, group,
      true, Controllers.BET_SHOP, Methods.SAVE_BET_SHOP_GROUPS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getBetShops() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.BET_SHOP, Methods.GET_BET_SHOP_GROUPS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          let mappedData = [];
          data.ResponseObject.forEach(field => {
            // field.PartnerName = this.partners.find((partner) => partner.Id === field.PartnerId)?.Name;
            if (field.ParentId === null) {
              field.groupKey = [field.Id];
              mappedData.push(field);
              this.handleDataRecursively(data.ResponseObject, field, mappedData);
            }
          })
          this.rowData = mappedData;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCellParentValueChanged(event) {
    this.onCellValueChanged(event);
    setTimeout(() => {
      this.getBetShops();
    }, 100);
  }

  handleDataRecursively(mappedData, parent, dest) {
    let children = mappedData.filter(field => field.ParentId === parent.Id);
    if (children.length > 0) {
      children.forEach(field => {
        field.groupKey = [...parent.groupKey, field.Id];
        dest.push(field);
        this.handleDataRecursively(mappedData, field, dest);
      })
    }
  };

  goToBetShops(ev) {
    const row = ev.data;
    this.router.navigate(['/main/platform/bet-shop-groups/bet-shops/all-bet-shops'], {
      queryParams: { BetId: row.Id, Name: row.Name }
    });
  }

}
