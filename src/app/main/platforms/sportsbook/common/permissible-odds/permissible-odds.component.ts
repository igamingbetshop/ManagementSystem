import { Component, OnInit, Injector, ViewChild } from '@angular/core';

import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { MatSnackBar } from "@angular/material/snack-bar";

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { CommonDataService } from "../../../../../core/services";
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

@Component({
  selector: 'app-permissible-odds',
  templateUrl: './permissible-odds.component.html',
  styleUrls: ['./permissible-odds.component.scss']
})
export class PermissibleOddsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  isSendingReqest = false;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  frameworkComponents = {
    numericEditor: NumericEditorComponent,
  };

  private path = 'utils/permissibleodds';
  partnerId: null;
  partners: any;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public dialog: MatDialog,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_PERMISSIBLE_ODDSS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        cellEditor: 'numericEditor',
      },
    ]
  }

  ngOnInit() {
    this.getPartners();
    this.gridStateName = 'permissible-odds';

  }

  onPartnerChange(val) {
    this.partnerId = val;
    this.getPage();
  }

  onCellValueChanged(event) {
    const { data } = event;
    delete data.UserId;
    data.PartnerId = this.partnerId;
    this.apiService.apiPost('utils/updatepermissibleodd', data).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.getPage();
    });
  }

  async addOdd() {
    const { AddOddComponent } = await import('./add-odd/add-odd.component');
    const dialogRef = this.dialog.open(AddOddComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  getPage() {
    this.apiService.apiPost(this.path, { PartnerId: this.partnerId }).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject;
        this.rowData.forEach(x => {
          x.PartnerName = this.partners.find(y => y.Id === x.PartnerId)?.Name
        })
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  deleteOdd() {
    this.isSendingReqest = true
    const row = this.gridApi.getSelectedRows()[0];
    delete row.UserId;
    this.apiService.apiPost('utils/deletepermissibleodd', row).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = this.rowData.filter(x => x.Id !== row.Id);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

}
