import {Component, Injector, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SkillGamesApiService} from "../../services/skill-games-api.service";
import {DatePipe} from "@angular/common";
import {take} from "rxjs/operators";
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {Paging} from "../../../../../core/models";
import 'ag-grid-enterprise';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-report-by-log',
  templateUrl: './report-by-log.component.html',
  styleUrls: ['./report-by-log.component.scss']
})
export class ReportByLogComponent extends BasePaginatedGridComponent implements OnInit {
  public path: string = 'report/log';
  public rowData;
  public fromDate = new Date();
  public toDate = new Date();
  public selected = false;
  public selectedItem = 'today';

  constructor(
    protected injector: Injector, private _snackBar: MatSnackBar,
    public apiService: SkillGamesApiService,
    public dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        maxWidth: 120,
        filter: 'agNumberColumnFilter',
        cellRenderer: 'agGroupCellRenderer',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Caller',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Caller',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'BetShops.DateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DateTime',
        maxWidth: 300,
        resizable: true,
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let date = datePipe.transform(params.data.DateTime, 'medium');
          if (!params.data.DateTime) {
            return ''
          } else {
            return `${date}`;
          }
        },
      },
      {
        headerName: 'Clients.Message',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Message',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        maxWidth: 200,
        field: 'Type',
        resizable: true,
        filter: false,
      },
    ];
  }

  ngOnInit(): void {
    this.setTime();
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = this.cacheBlockSize;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              params.success({rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count});
            } else {
              SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
            }
            setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 300);
          });
      }
    }
  }
}
