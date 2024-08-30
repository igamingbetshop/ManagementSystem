import { Component, Injector, OnInit, input } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { IRowNode } from 'ag-grid-community';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';

@Component({
  selector: 'app-partner-currency-settings',
  templateUrl: './partner-currency-settings.component.html',
  styleUrls: ['./partner-currency-settings.component.scss']
})
export class PartnerCurrencySettingsComponent extends BaseGridComponent implements OnInit {

  rowData = input<[]>();
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  statusName = ACTIVITY_STATUSES;

  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    selectRenderer: SelectRendererComponent,
  };

  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
  ) {
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
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        editable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange1['bind'](this),
          Selections: this.statusName,
        },
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.UserMinLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserMinLimit',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.UserMaxLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserMaxLimit',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.ClientMinBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientMinBet',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.editCurrencySetting['bind'](this),
          Label: 'Save',
          isDisabled: true,
        }
      },
    ]

  }

  ngOnInit() {
  }

  onSelectChange1(params, val, param) {
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

  editCurrencySetting(params) {
    this.apiService.apiPost(this.configService.getApiUrl, params.data, true,
      Controllers.CURRENCY, Methods.SAVE_PARTNER_CURRENCY_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


}
