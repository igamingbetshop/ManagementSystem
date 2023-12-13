import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../components/grid-common/select-renderer.component";
import { Controllers, GridRowModelTypes, Methods } from "../../../../core/enums";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VirtualGamesApiService } from "../services/virtual-games-api.service";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-market-types',
  templateUrl: './market-types.component.html',
  styleUrls: ['./market-types.component.scss']
})
export class MarketTypesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public masterDetail;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  public detailCellRendererParams: any;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData1 = [];
  public columnDefs2;
  public rowData = [];
  public games = [];
  public partners = [];
  public columnDefs;
  public path: string = 'markettypes';
  public path2: string = 'markettypes/selectiontypes';
  public path3: string = 'markettypes/settings';
  public selectedPartner;
  public pageConfig;

  constructor(protected injector: Injector, private _snackBar: MatSnackBar,
    private apiService: VirtualGamesApiService) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.SelectionsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsCount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
      }
    ]
    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        editable: true
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
      }
    ]
    this.masterDetail = true;
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowHeight: 47,
        defaultColDef: {
          sortable: true,
          filter: true,
          flex: 1,
        },
        components: this.nestedFrameworkComponents,
        columnDefs: [
          {
            headerName: 'Partners.PartnerId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'PartnerId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Partners.PartnerName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'PartnerName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.Profit',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Profit',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'VirtualGames.BalanceAmount',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'BalanceAmount',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'VirtualGames.BalancePercent',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'BalancePercent',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Order',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Order',
            sortable: true,
            resizable: true,
            editable: true,
            cellEditor: 'numericEditor',
          },
          {
            headerName: 'Common.Save',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'save',
            resizable: true,
            sortable: false,
            filter: false,
            cellRenderer: 'buttonRenderer',
            cellRendererParams: {
              onClick: this.saveSettings['bind'](this),
              Label: 'Save',
              isDisabled: true,
              bgColor: '#076192',
              textColor: '#FFFFFF',
            }
          }

        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost(this.path3, { MarketTypeId: params.data.Id })
            .pipe(take(1))
            .subscribe((data) => {
              const nestedRowData = data.ResponseObject;
              params.successCallback(nestedRowData);
            })
        }
      },
    }
  }

  ngOnInit(): void {
    this.getPartners();
    this.getGames();
    this.getMarketTypes();
    this.getSecondGridData();
  }

  getMarketTypes() {
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowSelected(params) {

    if (params.node.selected) {
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  getSecondGridData(params?) {
    const row = params?.data;
    let countRows = this.agGrid?.api.getSelectedRows().length;
    if (countRows) {
      let data = {
        MarketTypeId: row.Id
      };
      this.apiService.apiPost(this.path2, data)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.rowData1 = data.ResponseObject;
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }

  onGameChange(event) {
    if (event) {
      this.pageConfig = {
        GameIds: {
          IsAnd: true,
          ApiOperationTypeList: [{ IntValue: event, DecimalValue: event, OperationTypeId: 1 }],
        }
      }
    } else {
      this.pageConfig = undefined
    }
    this.getMarketTypes();
  }

  onPartnerChange(event) {
    this.selectedPartner = event;
    // this.pageConfig.PartnerId = event;
  }

  getGames() {
    this.apiService.apiPost('game')
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.games = data.ResponseObject;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.ResponseCode === 0) {
        this.partners = data.ResponseObject.Entities;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  saveSettings(params) {
    const request = params.data;
    this.apiService.apiPost('markettypes/savesettings', request)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      })
  }

}
