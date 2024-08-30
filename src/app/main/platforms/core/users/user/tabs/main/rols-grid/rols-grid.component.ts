import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CellClickedEvent, GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { BET_SELECTION_STATUSES } from 'src/app/core/constantes/statuses';
import { DatePipe } from '@angular/common';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { InputMultiSelectComponent } from '../input-multi-select.component';

@Component({
  selector: 'app-rols-grid',
  templateUrl: './rols-grid.component.html',
  styleUrls: ['./rols-grid.component.scss']
})
export class RolsGridComponent extends BasePaginatedGridComponent {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() finishedMatchesMarket: EventEmitter<any> = new EventEmitter<any>();
  partners = [];
  @Input() rowData = [];
  @Input() userId: number;

  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents = {
    inputMultiSelect: InputMultiSelectComponent
  }

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
        headerName: 'Id',
        field: 'Id',
        sortable: true,
        resizable: true,
        maxWidth: 130
      },
      {
        headerName: 'Name',
        field: 'Permissionid',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Access Objects',
        field: 'AccessObjectsIds',
        sortable: true,
        resizable: true,
        cellRenderer: 'inputMultiSelect',
        cellRendererParams: {
          onInputChange: this.onInputChange.bind(this),
          onMultipleSelect: this.onMultipleSelect.bind(this),
          Selections: this.partners,
        }
      },
      {
        headerName: 'Save',
        field: 'Save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: params => {
          let IsForAll = !params.data.IsForAll ? `<button style="padding: 10px 15px; color: #FFF; background-color: #076192; border: unset; cursor: pointer; border-radius: 4px" data-action-type="save-role">Save</button>` : `<span></span>`;
          return `${IsForAll}`;
        },
        cellRendererParams: {
          onClick: this.saveRole['bind'](this),
          Label: 'Save',
        }
      },
    ]
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncNestedColumnReset();
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

}
