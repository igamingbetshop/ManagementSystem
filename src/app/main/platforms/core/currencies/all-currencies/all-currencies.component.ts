import {Component, OnInit, Injector} from '@angular/core';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import {AgBooleanFilterComponent} from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import {CoreApiService} from '../../services/core-api.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes} from 'src/app/core/enums';
import {take} from 'rxjs/operators';
import {OpenerComponent} from 'src/app/main/components/grid-common/opener/opener.component';
import {ButtonRendererComponent} from 'src/app/main/components/grid-common/button-renderer.component';
import {NumericEditorComponent} from 'src/app/main/components/grid-common/numeric-editor.component';
import {TextEditorComponent} from 'src/app/main/components/grid-common/text-editor.component';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {IRowNode} from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';


@Component({
  selector: 'app-all-currencies',
  templateUrl: './all-currencies.component.html',
  styleUrls: ['./all-currencies.component.scss']
})
export class AllCurrenciesComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public frameworkComponents;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_CURRENCIES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        editable: true,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Payments.CurrentRate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentRate',
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Partners.Symbol',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Symbol',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
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
          onClick: this.saveCurrencySettings['bind'](this),
          Label: 'Save',
          isDisabled: true
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'currency');
          data.queryParams = {currencyId: params.data.Id};
          return data;
        },
        sortable: false
      },
    ]
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      textEditor: TextEditorComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'all-currencies-grid-state';
    this.getPage();

  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  saveCurrencySettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.configService.getApiUrl, row,
      true, Controllers.CURRENCY, Methods.SAVE_CURRENCY)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          SnackBarHelper.show(this._snackBar, {Description: 'Success', Type: "success"});
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }

  async AddCurrency() {
    const {AddCurrencyComponent} = await import('./add-currency/add-currency.component');
    const dialogRef = this.dialog.open(AddCurrencyComponent, {width: ModalSizes.SMALL});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.rowData.unshift(data);
        this.gridApi.setRowData(this.rowData);
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.CURRENCY, Methods.GET_CURRENCIES).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

}
