import { Component, OnInit, Injector } from '@angular/core';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { CommonDataService } from 'src/app/core/services';
import { CoreApiService } from '../../services/core-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Controllers, GridMenuIds, Methods, ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { Paging } from 'src/app/core/models';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';


@Component({
  selector: 'app-all-roles',
  templateUrl: './all-roles.component.html',
  styleUrls: ['./all-roles.component.scss']
})
export class AllRolesComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public frameworkComponents;
  public partners: any[] = [];
  public permissions: any[] = [];
  public filter = { Id: null, Name: '', PermissionIds: [] };   //id, name, permissionIds, skipCount, takeCount


  constructor(
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_ROLES;
    this.columnDefs = [
      {
        field: 'Id',
        width: 100,
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressColumnsToolPanel: false,
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.IsAdmin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsAdmin',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'role');
          data.queryParams = { roleId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ]
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'roles-grid-state';
    this.partners = this.commonDataService.partners;
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.PERMISSION, Methods.GET_PERMISSIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.permissions = data.ResponseObject
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async cloneRole() {
    const row = this.gridApi.getSelectedRows()[0];
    const { CloneRoleComponent } = await import('./clone-role/clone-role.component');
    const dialogRef = this.dialog.open(CloneRoleComponent, { width: ModalSizes.SMALL, data: { Data: row } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })

  }

  async AddRole() {
    const { AddRoleComponent } = await import('./add-role/add-role.component');
    const dialogRef = this.dialog.open(AddRoleComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  searchByFilter() {
    this.getCurrentPage();
  }

  onCheckBoxChange(ev, val) {
    if (ev.checked) {
      this.filter.PermissionIds.push(val);
    } else {
      const index = this.filter.PermissionIds.findIndex(el => {
        return el == val;
      })
      if (index >= 0) {
        this.filter.PermissionIds.splice(index, 1);
      }
    }
    this.getCurrentPage();
  }


  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.Name = this.filter.Name;
        paging.PermissionIds = this.filter.PermissionIds;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.PERMISSION, Methods.GET_ROLES).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities
              mappedRows.forEach((entity) => {
                let partnerName = this.partners?.find((partner) => {
                  return partner.Id == entity.PartnerId;
                })
                if (partnerName) {
                  entity['PartnerName'] = partnerName.Name;
                }
              })
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
