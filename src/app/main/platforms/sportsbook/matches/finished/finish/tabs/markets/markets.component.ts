import { Component, OnInit, Injector, ViewChild, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { IRowNode } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { BET_SELECTION_STATUSES } from 'src/app/core/constantes/statuses';


@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  public name = signal<string>('');
  public finishId = signal<number>(0);
  public number: number;
  public partnerId: number;

  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  public pageConfig = {};

  public statusModel = BET_SELECTION_STATUSES;

  public rowData = signal<any[]>([]);
  public selectionsRowData = signal<any[]>([]);
  public columnDefs2;

  public itemsCount;
  public coefficientCount;
  public baseCoefficientCount;

  public CoefficientValue;

  public path: string = 'matches/match';
  public selectPath: string = 'markets/selections';

  public compatitionName;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
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
        editable: true,
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
        filter: false,
      },
      {
        headerName: 'SkillGames.Blocked',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsBlocked',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        sortable: true,
        editable: true,
        filter: false,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.MatchStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchStatus',
        resizable: true,
        sortable: true,
        editable: true,
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
    this.finishId.set( +this.activateRoute.snapshot.queryParams.finishId );
    this.number = this.activateRoute.snapshot.queryParams.number;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;

    this.pageConfig = {
      MatchId: this.finishId(),
      PartnerId: this.partnerId ? this.partnerId : null,
      WithMarkets: true
    };

    this.getPage();
    this.getSecondGridData();
  }

  resetMarket() {
    let rows = this.selectionsRowData();
    this.apiService.apiPost('markets/recalculatemarket', { "Selections": rows })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  saveFinishes(params) {
    const row = params.data;
    let data = {
      MarketId: row.Id,
      PartnerId: this.partnerId,
      MatchId: this.finishId,
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

  onCellValueChanged(params) {
    let data;
    if (params.colDef.field === 'Coefficient') {
      data = {
        PartnerId: this.partnerId,
        SelectionId: params.data.SelectionId,
        LimitLeft: null,
        Coefficient: params.data.Coefficient
      };
    } else {
      data = {
        PartnerId: this.partnerId,
        SelectionId: params.data.SelectionId,
        LimitLeft: params.data.LimitLeft,
        Coefficient: null,
      };
    }

    this.apiService.apiPost('matches/updateselection', data)
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
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  showMe(item) {
    this.selectionsRowData.set(item);
    this.selectionsRowData().forEach(element => {
      element.ResettleStatus = this.statusModel.find(model => {
        return model.Id == element.Status;
      }).Name;
    });
    this.itemsCount = item.length;
    let itemCoef = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i]['Coefficient'] != 0) {
        itemCoef += 1 / item[i]['Coefficient'];
      }
      let calculateCofe = 100 - (100 / itemCoef);
      this.coefficientCount = this.precisionRound(calculateCofe, 2);
    }

    let itemBaseCoef = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i]['BaseCoefficient'] != 0) {
        itemBaseCoef += 1 / item[i]['BaseCoefficient'];
      }
      var calculate = 100 - (100 / itemBaseCoef);
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
        PartnerId: this.partnerId,
        MatchId: row.MatchId
      };
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
            })

            this.showMe(data.Selections);
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
          this.name.set(data.ResponseObject.Competitors[0].TeamName + ' vs ' + data.ResponseObject.Competitors[1].TeamName);
          this.rowData.set(data.ResponseObject.Markets);
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
