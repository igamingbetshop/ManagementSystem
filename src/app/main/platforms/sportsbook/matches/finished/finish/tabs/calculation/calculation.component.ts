import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";
import { IRowNode } from "ag-grid-community";

import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { AgBooleanFilterComponent } from "../../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../../../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../../../../../components/grid-common/select-renderer.component";
import { GridRowModelTypes } from "../../../../../../../../core/enums";
import { BasePaginatedGridComponent } from "../../../../../../../components/classes/base-paginated-grid-component";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { ResultsComponent } from '../../../../active-matches/active/tabs/calculation/results/results.component';
import { BET_SELECTION_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild(ResultsComponent) results;
  public path: string = 'matches/uncalculatedselections';
  public name: string = '';
  public number: number;
  public matchId: number;
  public sportId: number;
  public rowData;
  public rowData1;
  public columnDefs2;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
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
  public statusModel = BET_SELECTION_STATUSES

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
        cellEditor: 'textEditor',
        editable: true
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
    this.matchId = +this.activateRoute.snapshot.queryParams.finishId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.number = this.activateRoute.snapshot.queryParams.number;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.pageConfig = {
      MatchId: this.matchId
    };
    this.getCalculation();
  }

  getCalculation() {
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
          this.rowData.forEach((entity) => {
            let selectionStatusName = this.statusModel.find((stat) => {
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
    this.apiService.apiPost('markets/updateuncalculatedselections', updatedSelections)
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

}
