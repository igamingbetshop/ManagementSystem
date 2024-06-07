import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, IRowNode } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { OddsTypePipe } from "../../../../../../../../core/pipes/odds-type.pipe";
import { LocalStorageService } from "../../../../../../../../core/services";
import { GridRowModelTypes, OddsTypes, ModalSizes } from 'src/app/core/enums';
import { SelectStateRendererComponent } from 'src/app/main/components/grid-common/select-state-renderer.component';
import { BET_SELECTION_STATUSES, SETTELMENT_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;

  name: string = '';
  MatchId: number;
  number: number;
  partnerId: number;
  sportId: number;
  private settlementStatuses = SETTELMENT_STATUSES;
  partners: any[] = [];
  selectedMarketId: any[] = [];
  checked = false;

  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    selectStateRenderer: SelectStateRendererComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  pageConfig: any = {};

  statusModel = BET_SELECTION_STATUSES;

  rowData = [];
  rowData1 = [];
  columnDefs2;

  itemsCount;
  coefficientCount = 0;
  baseCoefficientCount = 0;

  CoefficientValue;

  path: string = 'matches/match';
  selectPath: string = 'markets/selections';

  compatitionName;
  private oddsType: number;
  selectedSelections: any;
  rowSuccessOutcomeCount: any;
  selectedRowData: { MarketId: any; PartnerId: number; MatchId: any; LineNumber: any; };
  selectedRowSuccessOutcomeCount: any;
  selectedSuccessOutcomeCount: any;
  successOutcomeCount: any;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.ProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderId',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Sport.TypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Value',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Value',
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'SkillGames.Blocked',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsBlocked',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
        },
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange['bind'](this),
          onCellValueChanged: this.onCheckBoxChange.bind(this)
        },
      },
      {
        headerName: 'Sport.AutoSettlement',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AutoSettlement',
        resizable: true,
        sortable: true,
        editable: true,
        cellRenderer: 'selectStateRenderer',
        cellRendererParams: {
          onchange: this.onSelectSettlement['bind'](this),
          Selections: this.settlementStatuses,
        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color, height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.MatchStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchStatus',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveFinishes['bind'](this),
          Label: 'Save',
          isDisabled: true
        }
      }
    ];
  }

  ngOnInit() {
    this.MatchId = +this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.number = +this.activateRoute.snapshot.queryParams.number;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId || null;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;

    this.getPartners();
    this.pageConfig = {
      MatchId: this.MatchId,
      PartnerId: this.partnerId ? this.partnerId : null,
      WithMarkets: true
    };

    this.getPage();
    this.getSecondGridData();
  }

  onSelectSettlement(params, value: number, event) {
    params.AutoSettlement = value;
      this.onCellValueChanged(event);
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onPartnerChange(val) {
    this.partnerId = undefined;
    this.partnerId = val;
    this.pageConfig.PartnerId = val;
    this.go();
  }

  go() {
    this.getPage();
  }

  resetMarket() {
    const rows = [];
    this.rowData1.forEach(dataItem => {
      rows.push(dataItem);
    });
    this.apiService.apiPost('markets/recalculatemarket', { "Selections": rows })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async AddMarket() {
    const { AddMarketComponent } = await import('../markets/add-market/add-market.component');
    const dialogRef = this.dialog.open(AddMarketComponent, {
      width: ModalSizes.MEDIUM,
      data: { PartnerId: this.pageConfig.PartnerId, MatchId: this.pageConfig.MatchId }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    });
  }

  onSelectChange1(params, val) {
    params.ResettleStatus = val;
    this.resetMarket();
  }

  onCheckBoxChange(params, val, event) {
    params.IsBlocked = val;
    this.onCellValueChanged1(event)
  }

  saveFinishes(params) {
    const row = params.data;
    let data = {
      MarketId: row.Id,
      PartnerId: this.partnerId,
      MatchId: this.MatchId,
      IsBlocked: row.IsBlocked,
      Status: row.Status,
      AutoSettlement: row.AutoSettlement,
    };
    this.apiService.apiPost('markets/updatemarket', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getPage();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCellValueChanged(params) {
    let data = {
      PartnerId: this.pageConfig.PartnerId,
      MarketId: this.selectedMarketId,
      SelectionId: params.data.SelectionId,
      AutoSettlement: params.data.AutoSettlement,
      LimitLeft: null,
      ResettleStatus: params.data.ResettleStatus,
      Coefficient: null,
      BaseCoefficient: null,
      MatchId: this.MatchId,
    };

    if (params.colDef.field === 'LimitLeft') {
      data.LimitLeft = params.data.LimitLeft;
    } else {
      data.Coefficient = params.data.Coefficient;
      data.BaseCoefficient = params.data.BaseCoefficient;
    }

    this.apiService.apiPost('markets/updateselection', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getSelectedRowData();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedMarketId = params.data.Id;
      this.successOutcomeCount = params.data.SuccessOutcomeCount;
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  showMe(item, successOutComeCount) {
    this.coefficientCount = 0;
    this.baseCoefficientCount = 0;
    this.rowData1 = item;
    this.itemsCount = item.length;
    let itemCoef = 0;
    let itemBaseCoef = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i]['Coefficient'] != 0) {
        itemCoef += 1 / item[i]['Coefficient'];
        let calculateCofe = 100 * (1 - (successOutComeCount / itemCoef));
        this.coefficientCount = this.precisionRound(calculateCofe, 2);
      }
      if (item[i]['BaseCoefficient'] != 0) {
        itemBaseCoef += 1 / item[i]['BaseCoefficient'];
        let calculate = 100 * (1 - (successOutComeCount / itemBaseCoef));
        this.baseCoefficientCount = this.precisionRound(calculate, 2);      
      }
    }
  };

  precisionRound(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  getSecondGridData(params?) {
    const row = params?.data;
    let countRows = this.agGrid?.api.getSelectedRows().length;
    if (countRows) {
      let data = {
        MarketId: row.Id,
        PartnerId: this.partnerId ? this.partnerId : null,
        MatchId: row.MatchId,
        LineNumber: row.LineNumber,
      };
      this.selectedRowData = data;
      this.selectedRowSuccessOutcomeCount = row.SuccessOutcomeCount;
      this.selectedSuccessOutcomeCount = row.SuccessOutcomeCount;

      this.columnDefs2 = [
        {
          headerName: 'Common.Id',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'SelectionId',
          sortable: true,
          resizable: true,
          minWidth: 100,
          tooltipField: 'Id',
          cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
        },
        {
          headerName: 'Products.ExternalId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ExternalId',
          sortable: true,
          resizable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Name',
          sortable: true,
          resizable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
        },
        {
          headerName: 'Sport.BaseCoefficient',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'BaseCoefficient',
          resizable: true,
          sortable: true,
          editable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
          cellStyle: { backgroundColor: '#cccccc' },
          onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.Coefficient',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Coefficient',
          resizable: true,
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
          onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
          cellRenderer: (params) => {
            const oddsTypePipe = new OddsTypePipe();
            let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
            return `${data}`;
          }
        },
        {
          headerName: 'Sport.CoefficientDiff',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'CoefficientDiff',
          resizable: true,
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
          cellRenderer: function (params) {
            let color = params.data.CoefficientDiff < 0 ? 'red' : 'green';
            let value = params.data.CoefficientDiff;
            let sign = params.data.CoefficientDiff >= 0 ? '+' : '';
            return `<div class="${color}">${sign}${value}%</div>`;
          },
        },
        {
          headerName: 'Sport.GoLiveCoefficient',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'GoLiveCoefficient',
          resizable: true,
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
        },
        {
          headerName: 'Sport.LimitLeft',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'LimitLeft',
          resizable: true,
          sortable: true,
          editable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
          cellStyle: { backgroundColor: '#cccccc' },
          onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Common.StatusName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'StatusName',
          resizable: true,
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },

        },
        {
          headerName: 'Sport.ResettleStatus',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ResettleStatus',
          resizable: true,
          sortable: true,
          cellRenderer: 'selectRenderer',
          cellRendererParams: {
            onchange: this.onSelectChange1['bind'](this),
            Selections: this.statusModel,
          },

        },
        {
          headerName: 'Sport.TotalBetAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'TotalBetAmount',
          resizable: true,
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
        },
        {
          headerName: 'Sport.PossibleProfit',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'PossibleProfit',
          resizable: true,
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
          cellRenderer: function (params) {
            let color = params.data.PossibleProfit < 0 ? 'red' : 'green';
            let value = params.data.PossibleProfit;
            let sign = params.data.PossibleProfit > 0 ? '+' : '';
            return `<div class="${color}">${sign}${value}</div>`;
          },
        },
        {
          headerName: 'Payments.CurrencyId',
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
          headerName: 'Sport.TeamId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'TeamId',
          sortable: true,
          resizable: true,
          floatingFilter: true,
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: true,
          },
        },
        {
          headerName: 'Common.View',
          headerValueGetter: this.localizeHeader.bind(this),
          cellRenderer: OpenerComponent,
          filter: false,
          valueGetter: params => {
            let data = { path: '', queryParams: null };
            let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
            data.path = this.router.url.replace(replacedPart, 'market').split('?')[0];
            data.queryParams = { SelectionId: params.data.SelectionId };
            return data;
          },
          sortable: false
        },
      ];

      if (this.partnerId) {
        for (const definition of this.columnDefs2) {
          if (definition.headerName === 'Sport.BaseCoefficient') {
            definition.editable = false,
            definition.cellStyle = { backgroundColor: 'transparent' };
          }
          if (definition.headerName == 'Sport.Coefficient') {
            definition.editable = true;
            definition.cellStyle = { backgroundColor: '#cccccc' };
          }
        }
      };
      this.getSelectedRowData();
    }
  }

  getSelectedRowData() {
    this.apiService.apiPost(this.selectPath, this.selectedRowData)
    .pipe(take(1))
    .subscribe(data => {
      if (data.Code === 0) {

        data.Selections.forEach(sel => {
          sel.ResettleStatus = sel.Status;
          let selName = this.statusModel.find(model => {
            return model.Id == sel.Status;
          })
          if (selName) {
            sel.StatusName = selName.Name;
          }
        });

        this.selectedSelections = data.Selections;
        this.rowSuccessOutcomeCount = this.selectedRowSuccessOutcomeCount;
        this.showMe(data.Selections, this.selectedSuccessOutcomeCount);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }


  getSelections() {
    
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }

  getPage() {
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.compatitionName = data.CompetitionName;
          this.rowData = data.ResponseObject.Markets;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCellValueChanged1(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.agGrid.api.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.agGrid.api.redrawRows({ rowNodes: [findedNode] });
    }
  }

  onReset() {
    const data = {
      MarketId: this.selectedMarketId,
      PartnerId: this.partnerId,
    };
    this.apiService.apiPost('markets/resetselections', data)
    .pipe(take(1))
    .subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Reseted", Type: "success" });
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  async onBuildMarket() {
    const { BuildMarketComponent } = await import('../markets/build-market/build-market.component');
    const dialogRef = this.dialog.open(BuildMarketComponent, {
      width: ModalSizes.LARGE,
      data: { PartnerId: this.pageConfig.PartnerId, MatchId: this.pageConfig.MatchId }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    });
  }

}
