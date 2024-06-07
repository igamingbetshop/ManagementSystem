import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../components/grid-common/checkbox-renderer.component";
import { GridRowModelTypes } from "../../../../core/enums";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VirtualGamesApiService } from "../services/virtual-games-api.service";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { Paging } from 'src/app/core/models';

@Component({
  selector: 'app-market-types',
  templateUrl: './market-types.component.html',
  styleUrls: ['./market-types.component.scss']
})
export class MarketTypesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  masterDetail;
  nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  detailCellRendererParams: any;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData1 = [];
  columnDefs2;
  rowData = [];
  games = [];
  partners = [];
  path: string = 'markettypes';
  path3: string = 'markettypes/settings';
  partnerId: number | null = null;
  pageConfig;
  gameId: number | null = null;
  selectedRowId: any;
  cacheBlockSize = 5000;
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
              bgColor: '#3E4D66',
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
    this.getRows();
    this.getGames();
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
    // this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }


  getRows() {
    const paging = new Paging();
    paging.PageIndex = this.paginationPage - 1;
    paging.PageSize = this.cacheBlockSize;
    if (this.gameId) {
      paging.GameIds = {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.gameId, DecimalValue: this.gameId, OperationTypeId: 1 }],
      }
    }
    if (this.partnerId) {
      paging.PartnerIds = {
        PartnerIds: {
          IsAnd: true,
          ApiOperationTypeList: [{ IntValue: this.partnerId, DecimalValue: this.partnerId, OperationTypeId: 1 }],
        }
      }
    }

    this.apiService.apiPost(this.path, paging)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
            this.selectedRowId = this.agGrid.api.getSelectedRows()[0]?.Id;
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowSelected(params) {
    this.selectedRowId = params.data.Id;
  }

  onGameChange(event) {
    this.gameId = event;
    this.getRows();
  }

  onPartnerChange(partnerId: number) {
    this.partnerId = partnerId;
    this.getRows();
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

  // onPageSizeChanged() {
  //   this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
  //   this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  // }

}
