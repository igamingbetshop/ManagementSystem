import { Component, Injector, OnInit } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { SelectRendererComponent } from "../../../../../../components/grid-common/select-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { IRowNode } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-limits',
  templateUrl: './provider-settings.component.html',
  styleUrls: ['./provider-settings.component.scss']
})
export class ProviderSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData: ProviderPartner[] = [];
  public partnerId: number;
  public partnerName: string = '';
  public active = this.translate.instant("Common.Active");
  public inactive = this.translate.instant("Common.Inactive");
  public status = [
    { Name: `${this.active}`, Id: 1 },
    { Name: `${this.inactive}`, Id: 2 }
  ];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
  };

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    super(injector);
  }

  ngOnInit(): void {
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.getPartnerGameProviderSettings();
  }

  getPartnerGameProviderSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.GET_PARTNER_GAME_PROVIDER_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          this.initAgGrid();
        }
      });
  }

  initAgGrid(): void {
    this.columnDefs = [
      {
        headerName: 'Common.GameProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
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
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 90,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveProviderSettings['bind'](this),
          Label: this.translate.instant("Common.Save"),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
    ]
  }

  onSelectChange(params, value, param) {
    params.State = value;
    this.onCellValueChanged(param)
  }

  onCellValueChanged(param) {
    if (param.oldValue !== param.value) {
      let findingNode: IRowNode;
      let rowIndex = param.node.rowIndex;
      this.gridApi.forEachNode(node => {
        if (node.rowIndex == rowIndex) {
          findingNode = node;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findingNode] });
    }
  }

  saveProviderSettings(params) {
    const request = params.data;
    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.PARTNER, Methods.SAVE_PARTNER_GAME_PROVIDER_SETTING)
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

  async copyPartnerSettings() {
    const { CopySettingsComponent } = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }
}

export interface ProviderPartner {
  GameProviderId: number;
  GameProviderName: string;
  ObjectId?: number;
  Order: number;
  State: number;
}
