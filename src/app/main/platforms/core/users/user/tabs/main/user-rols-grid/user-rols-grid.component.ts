import { Component, EventEmitter, Injector, input, Input, Output, signal, ViewChild } from '@angular/core';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { InputMultiSelectComponent } from '../input-multi-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { RolsGridComponent } from "../rols-grid/rols-grid.component";
import { MatButtonModule } from '@angular/material/button';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';

@Component({
  selector: 'app-user-rols-grid',
  templateUrl: './user-rols-grid.component.html',
  styleUrls: ['./user-rols-grid.component.scss'],
  standalone: true,
  imports: [
    AgGridModule,
    TranslateModule,
    RolsGridComponent,
    MatButtonModule
]

})
export class UserRolsGridComponent extends BasePaginatedGridComponent {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() finishedMatchesMarket: EventEmitter<any> = new EventEmitter<any>();
  partners = [];
  editUserRoles = input(false, {
    transform: (value: boolean|string) => {
      if (value == true) {
        this.getUserRoles();
        return true;
      }
      return value as boolean;
    }
  });
  @Input() userId: number;
  rowData = signal([]);
  public permitionRowData  = signal([]);

  public enableEditRole = false;
  public roles = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    inputMultiSelect: InputMultiSelectComponent
  };

  public defaultColDef1 = {
    flex: 1,
    resizable: true,
    sortable: false,
    filter: false,
    minWidth: 50,
  };

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector,
  ) {
    super(injector);
    this.gridIndex = 1;

    this.partners = this.commonDataService.partners;

    this.columnDefs = [
      {
        headerName: 'Add Role To User',
        field: 'HasRole',
        sortable: true,
        resizable: true,
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange3['bind'](this),
          onCellValueChanged: this.onCheckBoxChange3.bind(this)
        },
      },
      {
        headerName: 'Id',
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Name',
        field: 'Name',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Comment',
        field: 'Comment',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'View',
        field: 'View',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.getRolePermission['bind'](this),
          Label: 'View',
          bgColor: '#3E4D66',
          textColor: '#FFFFFF',
        }
      },
    ];
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncNestedColumnReset();
  }

  getUserRoles() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.userId,
      true, Controllers.PERMISSION, Methods.GET_USER_ROLES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData.set(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  onInputChange(value, params) {
    params.data.AccessObjectsIds = value;
  }

  onMultipleSelect(value: number[], params): void {
    params.data.AccessObjectsIds = value;
  }

  onSelectChange(params, val) {
    params.ResettleStatus = val;
  }

  getContextMenuItemsForBets(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = [
      'copy',
    ];
    return result;
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "save-role":
          return this.saveRole(data);
      }
    }
  }

  saveRole(params) {
    const request = {
      Id: params.data.Id,
      IsForAll: params.data.IsForAll,
      Permissionid: params.data.Permissionid,
      RoleId: params.data.RoleId,
      UserId: this.userId,
      AccessObjects: params.data.AccessObjects,
      AccessObjectsIds: null,
    };

    if (typeof params.data.AccessObjectsIds === 'string') {
      request.AccessObjectsIds = params.data.AccessObjectsIds.split(',');
    } else {
      request.AccessObjectsIds = params.data.AccessObjectsIds;
    }

    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.PERMISSION, Methods.SAVE_ACCESS_OBJECTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Role successfully updated', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCheckBoxChange3(params, val) {
    params.HasRole = val;
    this.enableEditRole = true;

    if (params.HasRole === true) {
      this.roles.push(params);
    } else if (params.HasRole === false) {
      this.roles = this.roles.filter(elem => elem.HasRole)
    }
  }

  getRolePermission(params) {
    this.apiService.apiPost(this.configService.getApiUrl, { UserId: +this.userId, RoleId: params.data.Id },
      true, Controllers.PERMISSION, Methods.GET_ROLE_PERMISSIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.permitionRowData.set(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  saveUserRoles() {
    let saved = {
      UserId: +this.userId,
      RoleModels: this.rowData().filter(elem => elem.HasRole != false)
    };

    this.apiService.apiPost(this.configService.getApiUrl, saved,
      true, Controllers.PERMISSION, Methods.SAVE_USER_ROLES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Successfully updated', Type: "success" });
          this.permitionRowData.set(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
