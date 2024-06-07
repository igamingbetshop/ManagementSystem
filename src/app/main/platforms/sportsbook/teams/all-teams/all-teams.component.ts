import {Component, OnInit, Injector, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SportsbookApiService} from '../../services/sportsbook-api.service';
import {CommonDataService} from "../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {take} from 'rxjs/operators';
import {Paging} from 'src/app/core/models';
import {MatDialog} from "@angular/material/dialog";
import {GridMenuIds, ModalSizes} from 'src/app/core/enums';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CellClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss']
})
export class AllTeamsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  public rowData = [];
  public path: string = 'teams';

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_TEAMS;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: false,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.TypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        sortable: false,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }

      },
      {
        headerName: 'Partners.Rating',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rating',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },

      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          } else {
            return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
            </i>`
          }

        },
        onCellClicked: (event: CellClickedEvent) => this.goToTeam(event),
        sortable: false
      },
    ]
  }

  ngOnInit() {
    this.gridStateName = 'teams-grid-state';
    super.ngOnInit();
  }

  async addTeam() {
    const {AddTeamComponent} = await import('./add-team/add-team.component');
    const dialogRef = this.dialog.open(AddTeamComponent, {width: ModalSizes.LARGE});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getCurrentPage();
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex =this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging,)
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              params.success({rowData: data.Objects, rowCount: data.TotalCount});
            } else {
              SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
            }
          });
      },
    };
  }

  goToTeam(ev) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/main/sportsbook/teams/team`],
      {
        queryParams: {
          teamId: ev.data?.Id,
        }
      }));
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('Failed to construct URL');
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
