import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {GridRowModelTypes} from "../../../../../../../../core/enums";
import {SportsbookApiService} from "../../../../../services/sportsbook-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  public path: string = 'report/matchevents';
  public name: string = '';
  public matchId: number;
  public rowData;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public pageConfig = {};
  public liveUpdatesState = false;

  constructor(protected injector: Injector,
              private apiService: SportsbookApiService,
              private _snackBar: MatSnackBar,
              private activateRoute: ActivatedRoute) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.MatchPhaseId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchPhaseId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MatchPhaseName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchPhaseName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.ResultTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ResulTypeId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.ResultTypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ResultTypeName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Reports.Point',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Point',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.Sequence',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Sequence',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.GameSequence',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameSequence',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.TeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Date',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.Date, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.Deleted',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Deleted',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ]
  }

  ngOnInit() {
    this.matchId = this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.pageConfig = {
      MatchId: this.matchId
    };
    this.getEvents();
  }
  getEvents() {
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  liveUpdates() {
    this.liveUpdatesState = !this.liveUpdatesState;
  }

}
