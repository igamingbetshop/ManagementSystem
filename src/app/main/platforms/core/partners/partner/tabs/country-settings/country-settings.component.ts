import { Component, Injector, OnInit, ViewChild } from '@angular/core';
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
import { COUNTRY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-country-settings',
  templateUrl: './country-settings.component.html',
  styleUrls: ['./country-settings.component.scss']
})

export class CountrySettingsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public partnerId: number;
  public status = 2;
  public partnerName: string = '';
  public statuses = COUNTRY_STATUSES;
  public updatedStatusData = this.statuses.map(status => {
    status.Name = status.Name.replace('Common.', '');
    return status;
  });
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
    super(injector); this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Common.CountryName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountryName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Cms.IsoCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsoCode',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.Delete',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Delete',
        resizable: true,
        minWidth: 90,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.deleteCountrySettings['bind'](this),
          Label: this.translate.instant("Common.Delete"),
          isDisabled: true,
          bgColor: '#A30019',
          textColor: '#FFFFFF'
        }
      },
    ]
  }

  ngOnInit(): void {
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.getPartnerCountrySettings();
  }

  getPartnerCountrySettings(value?) {
    if (value) {
      this.status = value
    }
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: +this.partnerId, Type: value | this.status }, true,
      Controllers.PARTNER, Methods.GET_PARTNER_COUNTRY_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject;
          mappedRows.forEach(element => {
            element.TypeName = this.updatedStatusData.find((status) =>
              status.Id == element.Type)?.Name;
          })
          this.rowData = mappedRows;
        }
      });
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

  async deleteCountrySettings(params) {
    const request = { Id: params.data.Id, PartnerId: params.data.PartnerId, Type: params.data.Type };
    const { ConfirmComponent } = await import('../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, request,
          true, Controllers.PARTNER, Methods.REMOVE_PARTNER_COUNTRY_SETTINGS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.getPartnerCountrySettings();
              SnackBarHelper.show(this._snackBar, { Description: 'Provider successfully updated', Type: "success" });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          })
      }
    })
  }

  async addCountrySetting() {
    const { AddCountrySettingComponent } = await import('./add-country-settings/add-country-setting.component');
    const dialogRef = this.dialog.open(AddCountrySettingComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        partnerId: this.partnerId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPartnerCountrySettings();
      }
    });
  }
}

