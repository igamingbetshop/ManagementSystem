import { Component, Injector, OnInit, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';


@Component({
  selector: 'app-by-player-limits',
  templateUrl: '../by-limits/by-limits.component.html',
  styleUrls: ['../by-limits/by-limits.component.scss']
})


export class ByPlayerLimitsComponent extends BasePaginatedGridComponent implements OnInit {
  titleName = "Reports.ReportByPlayerLimits";
  partners: WritableSignal<[]> = signal([]);;
  partnerId: number = 1;
  path = "report/playerlimits";
  rowData: WritableSignal<[]> = signal([]);
  filter: any = {};
  sports: any;
  defaultColDef = {
    flex: 1,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    sortable: false,
    minWidth: 50,
  };

  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_PLAYER_LIMITS;
    this.columnDefs = [
      {
        headerName: 'Sport.PlayerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlayerId',
      },
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
      },
      {
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
      },
      {
        headerName: 'Sport.TotalWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinAmount',
      },
      {
        headerName: 'Sport.LimitLeft',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LimitLeft',
      },
    ];
  }

  ngOnInit() {
    this.featchSports();
    this.getPartners();
    this.getPage();
  }

  featchSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = this.setEnum(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners.set(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  go() {
    this.getPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
  }

  getPage() {
    this.filter.PartnerId = this.partnerId;
    this.apiService.apiPost(this.path, this.filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const _rowData = data.ResponseObject;
          _rowData.forEach(elem => {
            return elem.SportName = this.sports[elem.SportId]
          })
          this.rowData.set(_rowData);

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  exportToCsv() {
    return;
    // SnackBarHelper.show(this._snackBar, { Description: 'data.Description', Type: "error" });

  //   this.apiService.apiPost('report/exportlimits',  {...this.filter, adminMenuId: this.adminMenuId}).pipe(take(1)).subscribe((data) => {
  //     if (data.Code === 0) {
  //       let iframe = document.createElement("iframe");
  //       iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
  //       iframe.setAttribute("style", "display: none");
  //       document.body.appendChild(iframe);
  //     } else {
  //       SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
  //     }
  //   });
  }

}
