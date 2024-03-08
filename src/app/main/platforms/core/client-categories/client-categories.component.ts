import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import 'ag-grid-enterprise';
import { CellClickedEvent, CellValueChangedEvent, } from 'ag-grid-community';
import { MatDialog } from "@angular/material/dialog";
import { CommonDataService } from 'src/app/core/services';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { take } from 'rxjs/operators';
import { CoreApiService } from '../services/core-api.service';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { ColorEditorComponent } from 'src/app/main/components/grid-common/color-editor.component';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";


@Component({
  selector: 'app-client-categories',
  templateUrl: './client-categories.component.html',
  styleUrls: ['./client-categories.component.scss']
})
export class ClientCategoriesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public frameworkComponents;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public isRowSelected = false;
  public singleRowDataId: number = 0;
  public selectedRowId: number = 0;
  public color: any;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Name',
        field: 'NickName',
        editable: true,
        sortable: true,
        resizable: true,
        cellEditor: 'textEditor',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      },
      {
        headerName: 'Color',
        field: 'Color',
        sortable: false,
        resizable: true,
        editable: true,
        filter: false,
        cellRenderer: function (params) {
          let color = params.data.Color;
          return `
          <div class="label" style=" padding-top: 6px; display: flex; justify-content: center;">
          <input  type="color" disabled name="head"  value = ${color}>
          </div>`;
        },
        cellEditor: 'colorEditor',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      },

    ];

    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      textEditor: TextEditorComponent,
      colorEditor: ColorEditorComponent,
    }
  }



  ngOnInit() {
    super.ngOnInit();
    this.gridStateName = 'client-categories-grid-state';
    this.getPage();
  }

  onCellClicked(event: CellClickedEvent) {
    this.singleRowDataId = 0;
    let selRow = this.gridApi.getSelectedNodes()[0].rowIndex;
    if (selRow == this.selectedRowId) {
      return;
    }
    this.singleRowDataId = event.data.Id;
    this.selectedRowId = selRow;
    this.isRowSelected = true;
  }

  onCellValueChanged(event) {
    this.apiService.apiPost(
      this.configService.getApiUrl,
      event.data,
      true,
      Controllers.CLIENT,
      Methods.SAVE_CLIENT_CATEGORY
    )
      .subscribe((data) => {
        if (data.ResponseCode === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  async addCategory() {
    const { CreateCategoriesComponent } = await import('../../core/client-categories/create-categories/create-categories.component');
    const dialogRef = this.dialog.open(CreateCategoriesComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.push(data);
      this.gridApi.setRowData(this.rowData);
    })
  }

  onDelete() {
    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        this.singleRowDataId,
        true,
        Controllers.CLIENT,
        Methods.DELETE_CLIENT_CATEGORY
      )
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          let index = this.rowData.findIndex(row => {
            return row.Id == data.ResponseObject.Id;
          });
          if (index > -1) {
            this.rowData.splice(index, 1);
          }
          this.gridApi.setRowData(this.rowData);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getPage() {
    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        {},
        true,
        Controllers.CLIENT,
        Methods.GET_CLIENT_CATEGORIES
      )
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 0);

      });

  }

  onGridReady(params) {
    super.onGridReady(params);
  }

}
