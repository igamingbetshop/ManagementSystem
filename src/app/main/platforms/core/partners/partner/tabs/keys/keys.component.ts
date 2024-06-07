import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../components/grid-common/checkbox-renderer.component";
import { IRowNode } from "ag-grid-community";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  partnerId;
  partnerName;
  frameworkComponents;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.GameProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.PaymentSystemId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemId',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.NotificationServiceId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NotificationServiceId',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.NumericValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NumericValue',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.StringValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StringValue',
        sortable: true,
        resizable: true,
        editable: true,
      },
      {
        headerName: 'Common.DateValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DateValue',
        sortable: true,
        resizable: true,
        editable: true,
      },
    ];
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
    }
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getPartnerKeys();
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
      this.saveCategorySettings(event);
    }
  }

  getPartnerKeys() {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: +this.partnerId }, true,
      Controllers.PARTNER, Methods.GET_PARTNER_KEYS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }
      });
  }

  async addKey() {
    const { AddKeyComponent } = await import('./add-key/add-key.component');
    const dialogRef = this.dialog.open(AddKeyComponent, {
      width: ModalSizes.SMALL
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPartnerKeys();
      }
    });
  }

  async copyPartnerSettings() {
    const { CopySettingsComponent } = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        partnerId: +this.partnerId,
        lable: "Copy Payment Settings",
        method: "COPY_PARTNERS_KEYS"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

  saveCategorySettings(params) {
    this.apiService.apiPost(this.configService.getApiUrl, params.data, true,
      Controllers.PARTNER, Methods.SAVE_PARTNER_KEY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }
}
