import { Component, OnInit, Injector } from '@angular/core';

import { take } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { AgBooleanFilterComponent } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../components/grid-common/numeric-editor.component";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { MatDialog } from '@angular/material/dialog';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss']
})
export class CoinsComponent extends BasePaginatedGridComponent implements OnInit {
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
  };
  rowData = [];
  partners = [];
  path: string = 'utils/coins';
  private updateSettingsPath = 'utils/updatecoins';
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  isSendingReqest = false;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_COINS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agTextColumnFilter',
        editable: true
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        editable: true
      },
      {
        headerName: 'Payments.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        editable: true
      },
      {
        headerName: 'Bonuses.Value',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Value',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        editable: true,
        // onCellValueChanged: (event: CellValueChangedEvent) => this.setCoinsValue(event),
      },
    ]
  }

  ngOnInit() {
    this.gridStateName = 'currencies-grid-state';
    super.ngOnInit();
    this.getPartners();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  getPage() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const mappedRows = data.ResponseObject.map((items) => {
            items.PartnerName = this.partners.find((item => item.Id === items.PartnerId))?.Name;
            return items;
          });
          this.rowData = mappedRows;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  setCoinsValue(params) {
    const row = params.data;
    this.apiService.apiPost(this.updateSettingsPath, row).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }
  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async onAddEditCoin(editable: boolean) {
    const row = this.gridApi.getSelectedRows()[0];
    let coinData = {};
    if (editable) {
      coinData = { IsEdit: true, ...row };
    }

    const { AddEditCoinComponent } = await import('./add-edit-coin/add-edit-coin.component');
    const dialogRef = this.dialog.open(AddEditCoinComponent, {
      width: ModalSizes.SMALL,
      data: coinData
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getPage();
    })
  }

  onDeleteCoin() {
    this.isSendingReqest = true;
    const coinId = this.gridApi.getSelectedRows()[0].Id;
    this.apiService.apiPost('utils/deletecoin', { Id: coinId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = this.rowData.filter(elem => elem.Id !== coinId);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

}
