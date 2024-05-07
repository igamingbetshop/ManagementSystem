import { Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../components/classes/base-paginated-grid-component";
import { CoreApiService } from "../../services/core-api.service";
import { ConfigService } from "../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import { DatePipe } from "@angular/common";
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from "../../../../../core/enums";
import { take } from "rxjs/operators";
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ToggleRendererComponent } from 'src/app/main/components/grid-common/toggle-renderer';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-payment-systems',
  templateUrl: './payment-systems.component.html',
  styleUrls: ['./payment-systems.component.scss']
})
export class PaymentSystemsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', {read: ViewContainerRef}) bulkEditorRef!: ViewContainerRef;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  filteredData;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    checkBoxRenderer: ToggleRendererComponent,
  };

  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
    menuTabs: [   ]
  };

  constructor(private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_PROVIDERS_PAYMENTS;

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.IsActive',
        field: 'IsActive',
        sortable: true,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: [true, false],
          defaultOption: true,
        },
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onChange: this.onCellValueChanged.bind(this),
          onCellValueChanged: this.onCellValueChanged.bind(this)
        },
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        }
      },
    ]
  }

  ngOnInit() {
    this.getPaymentSystemTypes();
  }

  onCellValueChanged(params) {

    params.IsActive = !params.IsActive;

    this.apiService.apiPost(this.configService.getApiUrl,{ ...params},
      true, Controllers.PAYMENT, Methods.SAVE_PAYMENT_SYSTEM).pipe(take(1)).subscribe(data => {
        const updatedRow = this.rowData.find(x => x.Id === params.Id);
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Updated successfully', Type: "success" });
          if (updatedRow) {
            updatedRow.IsActive = params.IsActive;
            this.gridApi.forEachNode((node) => {
              if (node.data.Id === params.Id) {
                node.setData(updatedRow);
                this.gridApi.redrawRows({ rowNodes: [node] });
                return;
              }
            });
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          if (updatedRow) {
            updatedRow.IsActive = !params.IsActive;
            this.gridApi.forEachNode((node) => {
              if (node.data.Id === params.Id) {
                node.setData(updatedRow);
                this.gridApi.redrawRows({ rowNodes: [node] });
                return;
              }
            });
          }
        }
      });
}

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPaymentSystemTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }

        setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 300);
      });
  }

  isRowSelected() {
    return this.gridApi?.getSelectedRows().length;
  }

  async onBulkEditorOpen() {
    if (this.bulkEditorRef) {
      this.bulkEditorRef.clear();
    }

    if (!this.isRowSelected()) {
      return
    }

    const componentInstance = await import('./bulk-editor/bulk-editor.component').then(c => c.BulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.Ids =  this.gridApi.getSelectedRows().map(field => field.Id);
    ;
    componentRef.instance.method = Methods.SAVE_PAYMENT_SYSTEM;
    componentRef.instance.controller = Controllers.PAYMENT;
    componentRef.instance.afterClosed.subscribe(() => {
      this.getPaymentSystemTypes();
      this.bulkEditorRef.clear();
      this.gridApi.deselectAll();
    });
  }

}
