import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DateAdapter } from "@angular/material/core";
import { AgGridAngular } from "ag-grid-angular";

import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { Controllers, Methods, ModalSizes } from 'src/app/core/enums';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-account-types-table',
  templateUrl: './account-types-table.component.html',
  styleUrls: ['./account-types-table.component.scss']
})
export class AccountTypesTableComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public clientStates: ServerCommonModel[] = [];
  public statuses = ACTIVITY_STATUSES;
  public accounts = [];

  displayedColumns: string[] = ['id', 'balance', 'currency', 'type', 'status'];
  dataSource;
  selection = new SelectionModel<any>(false, []);


  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>,
  ) {
  }

  ngOnInit() {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.clientStates = this.activateRoute.snapshot.data.clientStates;
    this.getClientAccounts();
  }




  getClientAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          const _account = data.ResponseObject.map(element => {
            element.StatusName = this.statuses?.find((state) => state.Id === element.Status)?.Name;
          });
          this.accounts = data.ResponseObject;
          this.dataSource = this.accounts;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowClick(event: any, account: any) {
    this.selection.clear();
    this.selection.select(account);
  }

  isRowSelected(account: any): boolean {
    return this.selection.isSelected(account);
  }

  async onActionOnAccount(value: number) {
    const payload = { ...this.selection.selected[0], 'Status': value };
    const { ConfirmComponent } = await import('../../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, payload, true, Controllers.CLIENT,
          Methods.UPDATE_ACCOUNT).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              this.selection.selected[0].StatusName = this.statuses[value - 1].Name;
              this.selection.selected[0].Status = value;
              this.selection.clear();
              SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });

            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          })

      }
    })

  }

}
