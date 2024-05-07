import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../../../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../../../../../components/grid-common/select-renderer.component";
import { GridRowModelTypes } from "../../../../../../../../core/enums";
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { BET_SELECTION_STATUSES } from 'src/app/core/constantes/statuses';
import { ResultsComponent } from './results/results.component';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild(ResultsComponent) results;
  path: string = 'matches/uncalculatedselections';
  name: string = '';
  number: number;
  matchId: number;
  partnerId: number;
  sportId: number;
  rowData;
  rowData1;
  columnDefs2;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  partners: any[] = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  pageConfig;
  statusModel = BET_SELECTION_STATUSES;
  rowStyle;

  constructor(protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Sport.MarketId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketId',
        sortable: true,
        resizable: true,
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.MarketStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketStatus',
        sortable: true,
        resizable: true,
        editable: false,
      },
      {
        headerName: 'Segments.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.SelectionStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionStatus',
        sortable: true,
        resizable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange1['bind'](this),
          Selections: this.statusModel,
        },
        editable: true
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
    ]
  }

  ngOnInit() {
    this.matchId = +this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.number = this.activateRoute.snapshot.queryParams.number;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;   
    this.getPartners();
    this.pageConfig = {
      MatchId: this.matchId,
      PartnerId: this.partnerId ? this.partnerId : null,
    };
    this.getCalculation();
  }

  onPartnerChange(val) {
    this.partnerId = undefined;
    this.partnerId = val;
    this.pageConfig.PartnerId = val;
    this.getCalculation();
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

  getCalculation() {
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
          this.rowData.forEach((entity) => {
            let selectionStatusName = this.statusModel?.find((stat) => {
              return stat.Id == entity.SelectionStatus;
            })
            if (selectionStatusName) {
              entity['SelectionStatusName'] = selectionStatusName.Name;
            }
          })          
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSelectChange1(params, val, event) {
    params.SelectionStatus = val;
    this.onCellValueChanged(event);
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
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  saveFinishes(params) {
    const row = params.data;
    let sData = {
      Status: row.SelectionStatus,
      SelectionId: row.SelectionId,
      Index: -1
    };
    let updatedSelections = { Selections: [] };

    updatedSelections.Selections.push(sData);
    if (row.SelectionStatus == 2 && row.MarketSuccessOutcomeCount == 1) {
      for (let i = 0; i < this.rowData.length; i++) {
        if (row.MarketId == this.rowData[i].MarketId) {
          if (this.rowData[i].SelectionId != sData.SelectionId)
            updatedSelections.Selections.push({ Status: 3, SelectionId: this.rowData[i].SelectionId, Index: i });
        }
      }
    }
    this.apiService.apiPost('/markets/updateuncalculatedselections', updatedSelections)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          for (let j = 1; j < updatedSelections.Selections.length; j++) {
            if (updatedSelections.Selections[j].Index != -1)
              this.rowData[updatedSelections.Selections[j].Index].SelectionStatus = updatedSelections.Selections[j].Status;
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  autoCalculate() {
    this.results.autoCalculate();
  }

  onEditChange() {
    this.results.isEdit = true;
  }


  // calculateOutcomesScoreChange(type) {
  //   if (this.isCalculate(type)) {
  //     let result;

  //     for (let i = 0; i < this.calculateOutcomesScore.Results.length - 1; i++) {
  //       if (!result)
  //         result = this.calculateOutcomesScore.Results[i].TR[type].V;
  //       else {
  //         result = result - this.calculateOutcomesScore.Results[i].TR[type].V;
  //       }
  //     }
  //     if (!isNaN(result) && result !== '')
  //       this.calculateOutcomesScore.Results[this.calculateOutcomesScore.Results.length - 1].TR[type].V = result;
  //   }
  // }

  // isCalculate(type) {
  //   let count = 0;
  //   for (let i = 0; i < this.calculateOutcomesScore.Results.length; i++) {
  //     if (this.calculateOutcomesScore.Results[i].TR[type].V === '') {
  //       count++;
  //     }
  //   }
  //   return count < 2;
  // }

  // clear() {
  //   this.calculateOutcomesScore.Results.forEach(result => {
  //     result.TR.forEach(tr => tr.V = undefined);
  //   });
  // }

}
