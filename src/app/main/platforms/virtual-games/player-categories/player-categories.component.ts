import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {AgBooleanFilterComponent} from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../components/grid-common/checkbox-renderer.component";
import {TextEditorComponent} from "../../../components/grid-common/text-editor.component";
import {SelectRendererComponent} from "../../../components/grid-common/select-renderer.component";
import {GridMenuIds, GridRowModelTypes} from "../../../../core/enums";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VirtualGamesApiService} from "../services/virtual-games-api.service";
import {take} from "rxjs/operators";
import {ColorEditorComponent} from "../../../components/grid-common/color-editor.component";
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";
import {IRowNode} from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-player-categories',
  templateUrl: './player-categories.component.html',
  styleUrls: ['./player-categories.component.scss']
})
export class PlayerCategoriesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    colorEditor: ColorEditorComponent
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public path: string = 'clientcategory';
  public path2: string = 'clientcategory/save';

  constructor(protected injector: Injector, private _snackBar: MatSnackBar,
              private apiService: VirtualGamesApiService) {
    super(injector);
    this.adminMenuId = GridMenuIds.VG_PLATERS_CATEGORIES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        editable: true,
        cellEditor: 'textEditor'
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'textEditor'
      },
      {
        headerName: 'Sport.Color',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Colour',
        resizable: true,
        sortable: true,
        editable: true,
        minWidth: 100,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: function (params) {
          let color = params.data.Colour;
          return `
          <div class="label" style=" padding-top: 6px; display: flex; justify-content: space-between;">
          <label  for="head" style="color:${color}">${color}</label>
          <input  type="color" disabled name="head"  value = ${color}>
          </div>`;
        },
        cellEditor: 'colorEditor',
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

  ngOnInit(): void {
    this.getPlayerCategories();
  }

  getPlayerCategories() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  onCellValueChanged(event){
    if(event.oldValue !== event.value){
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if(nod.rowIndex == node){
          findedNode = nod;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }

  saveFinishes(params) {
    const row = params.data;
    let data = {
      Id: row.Id,
      Colour: row.Colour,
      Name: row.Name
    };
    this.apiService.apiPost(this.path2, data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getPlayerCategories()
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

}
