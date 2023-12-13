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


@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;

  public name: string = '';
  public MatchId: number;
  public number: number;
  public partnerId: number;
  public sportId: number;

  public partners: any[] = [];
  public selectedMarketId: any[] = [];
  public checked = false;

  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  public pageConfig: any = {};

  public statusModel = [
    { 'Name': "Uncalculated", 'Id': 1 },
    { 'Name': "Won", 'Id': 2 },
    { 'Name': "Lost", 'Id': 3 },
    { 'Name': "Returned", 'Id': 4 },
    { 'Name': "PartiallyWon", 'Id': 5 },
    { 'Name': "PartiallyLost", 'Id': 6 },
  ];

  public rowData = [];
  public rowData1 = [];
  public columnDefs2;

  public itemsCount;
  public coefficientCount;
  public baseCoefficientCount;

  public CoefficientValue;

  public path: string = 'matches/match';
  public selectPath: string = 'markets/selections';

  public compatitionName;
  private oddsType: number;

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
        },
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
      IsBlocked: row.IsBlocked
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

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  onRowSelected(params) {

    if (params.node.selected) {
      this.selectedMarketId = params.data.Id;


      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  showMe(item, successOutComeCount) {
    this.rowData1 = item;
    this.itemsCount = item.length;
    let itemCoef = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i]['Coefficient'] != 0) {
        itemCoef += 1 / item[i]['Coefficient'];
      }
      let calculateCofe = 100 * (1 - successOutComeCount / itemCoef);
      this.coefficientCount = this.precisionRound(calculateCofe, 2);
    }

    let itemBaseCoef = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i]['BaseCoefficient'] != 0) {
        itemBaseCoef += 1 / item[i]['BaseCoefficient'];
      }
      let calculate = 100 * (1 - successOutComeCount / itemBaseCoef);
      this.baseCoefficientCount = this.precisionRound(calculate, 2);
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
      if (this.partnerId) {
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
            // editable: true,
            floatingFilter: true,
            suppressMenu: true,
            floatingFilterComponentParams: {
              suppressFilterButton: true,
            },
            onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
            cellEditor: 'numericEditor',
          },
          {
            headerName: 'Sport.Coefficient',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Coefficient',
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
            headerName: 'Common.TotalBetAmount',
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
            headerName: 'Common.PossibleProfit',
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
      } else {
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
      }
      this.apiService.apiPost(this.selectPath, data)
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

            this.showMe(data.Selections, row.SuccessOutcomeCount);
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
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

}
