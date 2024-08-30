import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { Paging } from 'src/app/core/models';
import { take } from 'rxjs/operators';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent } from 'ag-grid-community';
import { DateAdapter } from "@angular/material/core";
import { AVAILABLEBETCATEGORIES, BETAVAILABLESTATUSES, BETSTATUSES } from 'src/app/core/constantes/statuses';
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ActivatedRoute } from '@angular/router';
import { ByBetsNotAcceptedComponent } from '../../../../reports/business-intelligence/by-bets-not-accepted/by-bets-not-accepted.component';

@Component({
  selector: 'app-not--bets-accepted',
  templateUrl: './not-accepted-bets.component.html',
  styleUrls: ['./not-accepted-bets.component.scss']
})
export class NotAcceptedBetsComponent extends ByBetsNotAcceptedComponent implements OnInit {

  pageIdName: string;
  playerId: number;
  externalId: any;

  constructor(
    protected injector: Injector,
    protected apiService: SportsbookApiService,
    protected _snackBar: MatSnackBar,
    protected dialog: MatDialog,
    protected dateAdapter: DateAdapter<Date>,
    private activateRoute: ActivatedRoute
  ) {
    super(
      injector,
      apiService,
      _snackBar,
      dialog,
      dateAdapter
    );
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
    this.externalId = this.activateRoute.snapshot.queryParams.externalId;
    this.gridStateName = 'report-by-bet-not-accepted-grid-state';
    this.getCommentTypes();
    this.pageIdName = `/ ${this.playerId} : ${this.translate.instant('Clients.Bets')}`;
    this.columnDefs[0].filter = false;
    this.columnDefs[1].filter = false;
    this.columnDefs[2].filter = false;
    this.columnDefs[3].filter = false;

  }


  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.LiveStatus = this.availableStatusesStatus;
        paging.BetCategory = this.availableBetCategoriesStatus;

        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        delete paging.StartDate;
        delete paging.EndDate;
        paging.ClientIds = {
          "ApiOperationTypeList": [
              {
                  "OperationTypeId": 1,
                  "StringValue": this.externalId,
              }
          ],
          "IsAnd": true
      }

        this.filteredData = paging;

        this.apiService.apiPost('report/notacceptedbets', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {

            const mappedRows = data.Objects;
            this.rowData1 = [];
            mappedRows.forEach((bet) => {

              let betTypeName = this.betTypesModel.find((betType) => {
                return betType.Id == bet.TypeId;
              })
              if (betTypeName) {
                bet['TypeName'] = betTypeName.Name;
              }
              let statusName = this.betStatuses.find((status) => {
                return status.Id == bet.State;
              })
              if (statusName) {
                bet['StatusName'] = statusName.Name;
              }

              let typeColor = this.commentTypes.find((com) => {
                return com.Id == bet.CommentTypeId;
              })
              if (typeColor) {
                bet['CommentTypeColor'] = typeColor.Color;
              }

              let typeName = this.commentTypes.find((com) => {
                return com.Id == bet.CommentTypeId;
              })
              if (typeName) {
                bet['CommentTypeName'] = typeColor.Name;
              }

              bet.SystemOutCountValue = bet.SystemOutCount === null ? '' : bet.SystemOutCount + '/...';

              bet['Competitors'] = bet['Competitors'].join("-");
            })
            if (!!mappedRows.length) {
              this.onRowClicked(mappedRows[0]);
              setTimeout(() => {
                this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
              }, 0)
            }
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  onNavigateTo() {
    this.router.navigate(["/main/sportsbook/players/all-players"])
  }
}
