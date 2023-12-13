import {Component, OnInit, Injector, ViewChild} from '@angular/core';

import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {IRowNode} from "ag-grid-community";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SportsbookApiService} from '../../services/sportsbook-api.service';
import {CommonDataService} from "../../../../../core/services";
import {GridMenuIds, GridRowModelTypes} from 'src/app/core/enums';
import {NumericEditorComponent} from 'src/app/main/components/grid-common/numeric-editor.component';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-permissible-odds',
  templateUrl: './permissible-odds.component.html',
  styleUrls: ['./permissible-odds.component.scss']
})
export class PermissibleOddsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents;

  public DetailRowData = [];
  masterDetail;

  private path = 'utils/permissibleodds';

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_PERMISSIBLE_ODDSS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
         headerValueGetter: this.localizeHeader.bind(this),
        field: 'id',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',

      },

    ]
    this.masterDetail = true;

    this.frameworkComponents = {
      numericEditor: NumericEditorComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'permissible-odds';
    this.getPage();
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
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }


  getPage() {
    this.apiService.apiPost(this.path).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject;

      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
      setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 300);
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

}
