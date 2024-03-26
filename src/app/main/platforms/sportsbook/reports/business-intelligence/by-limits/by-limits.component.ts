import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-by-limits',
  templateUrl: './by-limits.component.html',
  styleUrls: ['./by-limits.component.scss']
})
export class ByLimitsComponent extends BasePaginatedGridComponent implements OnInit {

  public partners: any[] = [];
  public partnerId: number = 1;
  public path = "report/limits";
  public rowData = [];
  public filter: any = {};
  public sports: any;
  public defaultColDef = {
    flex: 1,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    sortable: false,
    minWidth: 50,
  };

  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_LIMITES;
    this.columnDefs = [
      {
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
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
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
      },
      {
        headerName: 'Sport.MarketId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketId',
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
      },
      {
        headerName: 'Segments.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
      },
      {
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
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
    this.gridStateName = 'report-by-limits-grid-state';
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
        this.partners = data.ResponseObject;
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
          this.rowData = _rowData;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  exportToCsv() {
    this.apiService.apiPost('report/exportlimits',  {...this.filter, adminMenuId: this.adminMenuId}).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

}
