import { Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { CoreApiService } from "../../services/core-api.service";
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ToggleRendererComponent } from 'src/app/main/components/grid-common/toggle-renderer';

@Component({
  selector: 'app-all-providers',
  templateUrl: './all-providers.component.html',
  styleUrls: ['./all-providers.component.scss']
})
export class AllProvidersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', {read: ViewContainerRef}) bulkEditorRef!: ViewContainerRef;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
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

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_PROVIDERS_PRODUCTS;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
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
        headerName: 'Providers.SessionExpireTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SessionExpireTime',
        resizable: true,
        sortable: true,
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Providers.GameLaunchUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameLaunchUrl',
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
          frameworkComponent: ToggleRendererComponent,
          onCellValueChanged: (params: ICellRendererParams) => {
            this.onCellValueChanged(params);
          }
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
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        cellStyle: function (params) {
          if (params.data.IsActive !== true) {
            return { color: 'white', backgroundColor: '#d3d3d3' };
          } else {
            return null;
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.redirectToProvider(event),
      },
    ]

  }

  ngOnInit() {
    this.gridStateName = 'all-providers-grid-state';
    this.getPage();
    super.ngOnInit();
  }

  redirectToProvider(params) {
    this.router.navigate(['/main/platform/providers/all-providers/provider'], {
      queryParams: { providerId: params.data.Id }
    });
  }

  async addProviders() {
    const { CreateProviderComponent } = await import('../../providers/create-provider/create-provider.component');
    const dialogRef = this.dialog.open(CreateProviderComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getPage();
    })
  }

  getPage() {
    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        {},
        true,
        Controllers.PRODUCT,
        Methods.GET_GAME_PROVIDERS
      )
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  onCellValueChanged(params) {
    params.IsActive = !params.IsActive;
      this.apiService.apiPost(this.configService.getApiUrl, params,
        true, Controllers.PRODUCT, Methods.SAVE_GAME_PROVIDER).pipe(take(1)).subscribe(data => {
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

    const componentInstance = await import('../payment-systems/bulk-editor/bulk-editor.component').then(c => c.BulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.Ids =  this.gridApi.getSelectedRows().map(field => field.Id);
    ;
    componentRef.instance.method = Methods.SAVE_GAME_PROVIDER;
    componentRef.instance.controller = Controllers.PRODUCT;

    componentRef.instance.afterClosed.subscribe(() => {
      this.getPage();
      this.bulkEditorRef.clear();
      this.gridApi.deselectAll();
    });
  }

}
