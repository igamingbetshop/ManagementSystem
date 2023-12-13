import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { SelectRendererComponent } from "../../../../../../components/grid-common/select-renderer.component";
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { IRowNode, } from "ag-grid-community";
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-provider-settings',
  templateUrl: './provider-settings.component.html',
  styleUrls: ['./provider-settings.component.scss']
})
export class ProviderSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public clientId: number;
  public status = [
    { Name: 'Active', Id: 1 },
    { Name: 'Inactive', Id: 2 }
  ];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
  };
  @ViewChild('agGrid') agGrid: AgGridAngular;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    protected injector: Injector,
    private _snackBar: MatSnackBar) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_PROVIDER_SETTINGS;
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getClientGameProviderSettings();
  }

  getClientGameProviderSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_GAME_PROVIDER_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          this.init();
        }
      });
  }

  init() {
    this.columnDefs = [
      {
        headerName: 'Sport.ProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderName',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this),
          Selections: this.status,
        }
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveSettings['bind'](this),
          Label: 'Save',
          isDisabled: true,
        }
      }
    ]
  }

  onSelectChange(params, val, param) {
    params.State = val;
    this.onCellValueChanged(param)
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

  saveSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.configService.getApiUrl, row,
      true, Controllers.CLIENT, Methods.SAVE_CLIENT_GAME_PROVIDER_SETTING)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          SnackBarHelper.show(this._snackBar, { Description: 'Provider successfully updated', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      })
  }

  onGridReady(params: any): void {
    syncNestedColumnReset();
    super.onGridReady(params);
  }

}
