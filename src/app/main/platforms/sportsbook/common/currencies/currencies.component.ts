import { Component, OnInit, Injector } from '@angular/core';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import {MatSnackBar} from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { take } from 'rxjs/operators';
import {AgBooleanFilterComponent} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../components/grid-common/numeric-editor.component";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {IRowNode} from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-Currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent extends BasePaginatedGridComponent implements OnInit {
  public frameworkComponents;
  public rowData = [];
  public path: string = 'common/currencies';
  public updatePath: string = 'common/updatecurrency';
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    private apiService:SportsbookApiService,
    protected injector:Injector,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_CURRENCIES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500'},
        filter: 'agTextColumnFilter',
        editable: true
      },
      {
        headerName: 'Payments.CurrentRate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentRate',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        editable: true
       },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveCurrencies['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
    ]
    this.frameworkComponents = {
      agBooleanColumnFilter:AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'currencies-grid-state';
    super.ngOnInit();
    this.getPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage(){
    this.apiService.apiPost(this.path)
    .pipe(take(1))
    .subscribe(data => {
      if(data.Code === 0){
        this.rowData = data.ResponseObject;
      }else{
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

  saveCurrencies(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath,row).subscribe(data => {
      if (data.Code === 0){
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
  }

}
