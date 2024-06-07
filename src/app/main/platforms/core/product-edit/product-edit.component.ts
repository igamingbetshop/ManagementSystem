import { Component, Injector, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { CoreApiService } from '../services/core-api.service';
import { CellClickedEvent, CellValueChangedEvent, ColDef, GetServerSideGroupKey, GridApi, GridReadyEvent, ICellRendererParams, IsServerSideGroup } from 'ag-grid-community';

import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { AgGridAngular } from 'ag-grid-angular';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})

export class ProductEditComponent extends BaseGridComponent {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  public searchName = '';
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    agBooleanColumnFilter: AgBooleanFilterComponent,
  };

  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,) {
    super(injector);
  }

  public rowData: any[];
  public columnDefs: ColDef[] = [
    {
      headerName: 'Common.Id',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Id', hide: true,
      filter: false,
    },
    {
      headerName: 'Common.Name',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Name',
      editable: true,
      onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      filter: false,
    },
    {
      headerName: 'Common.Description',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Description',
      editable: true,
      onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      filter: false,
    },
    {
      headerName: 'Common.State',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'State',
      cellRenderer: (params) => {
        return params.data.State === 0 ? 'Inactive' : params.data.State === 1 ? 'Active' : '';
      },
      filter: false,
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
      onCellClicked: (event: CellClickedEvent) => this.redirectToProducts(event),
    },
  ];

  public autoGroupColumnDef: ColDef = {
    headerName: 'Common.GroupId',
    headerValueGetter: this.localizeHeader.bind(this),
    field: 'Id',
    checkboxSelection: true,
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
  };
  public rowModelType: GridRowModelTypes = GridRowModelTypes.SERVER_SIDE;

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };

  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }
  redirectToProducts(ev) {
    const row = ev.data;
    if (!row.GameProviderId) {
      this.router.navigate(['/main/platform/products/all-products'], {
        queryParams: { "BetId": row.Id, "Name": row.Name }
      });
    } else {
      this.router.navigate(['/main/platform/products/all-products/product'], {
        queryParams: { "BetId": row.ParentId, "Name": row.Name, "ProductId": row.Id }
      });
    }
  }

  onCellValueChanged(params) {
    let group = params.data;
    group.NewId = group.Id;
    this.apiService.apiPost(this.configService.getApiUrl, group,
      true, Controllers.PRODUCT, Methods.EDIT_PRODUCTS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          group.isEditMode = false;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        const filter: any = {};
        filter.SkipCount = 0;
        filter.TakeCount = -1;
        if (params.parentNode.level == -1) {
          filter.ProductId = 1;
        } else {
          filter.ParentId = params.parentNode.data.Id;
        }
        this.setFilter(params.request.filterModel, filter);

        if (filter.Names) {
          filter.Pattern = filter.Names.ApiOperationTypeList[0].StringValue;
          delete filter.Names;
        }
        if (filter.States) {
          filter.State = filter.States.ApiOperationTypeList[0].BooleanValue;
          delete filter.States;
        }

        this.apiService.apiPost(this.configService.getApiUrl, filter,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const enitities = (data.ResponseObject.Entities);
              enitities.forEach(entity => {
                entity.group = !entity.IsLeaf;
              })
              params.success({ rowData: enitities, rowCount: enitities.length });
            }
          });
      },
    };
  }

  async addGroup() {
    const groupC = this.agGrid?.api.getSelectedRows()[0];
    const { AddComponent } = await import('./add/add.component');
    const dialogRef = this.dialog.open(AddComponent, {
      width: ModalSizes.SMALL,
      data: groupC
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.refreshServerSide({ purge: true });
        this.gridApi.deselectAll();
      }
    })
  }

}
