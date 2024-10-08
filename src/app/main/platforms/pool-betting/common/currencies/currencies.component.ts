import { Component, OnInit, Injector, WritableSignal, signal, inject } from '@angular/core';
import {  GridRowModelTypes, PBControllers, PBMethods } from 'src/app/core/enums';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { AgBooleanFilterComponent } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../components/grid-common/numeric-editor.component";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { PoolBettingApiService } from '../../../sportsbook/services/pool-betting-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrenciesComponent } from '../../../sportsbook/common/currencies/currencies.component';

@Component({
  selector: 'app-Currencies',
  templateUrl: '../../../sportsbook/common/currencies/currencies.component.html',
  styleUrls: ['../../../sportsbook/common/currencies/currencies.component.scss']
})
export class PBCurrenciesComponent extends CurrenciesComponent implements OnInit {

  public rowData: WritableSignal<any> = signal([]);
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  pbapiService = inject(PoolBettingApiService);
  _snackBar = inject(MatSnackBar);
  constructor(
    injector: Injector,
  ) {
    super(
      injector,
    );
    // this.adminMenuId = GridMenuIds.SP_CURRENCIES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
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
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
    }
  }


  getPage() {
    this.pbapiService.apiPost(PBControllers.COMMON, PBMethods.GET_CURRENCIES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData.set(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
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

  saveCurrencies(params) {
    const row = params.data;
    this.pbapiService.apiPost(PBControllers.COMMON, PBMethods.CHANGE_CURRENCY, row).subscribe(data => {
      if (data.Code === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

}
