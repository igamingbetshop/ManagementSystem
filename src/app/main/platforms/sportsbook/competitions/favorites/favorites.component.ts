import { Component, OnInit, Injector, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  public path: string = 'competitions';
  public path1: string = 'competitions/favorites';


  public rowData = [];
  public favoritesRowData = [];
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  };
  isSendingRequest = false;

  public partners: any[] = [];
  public partnerId: number = null;
  public priority: number = null;
  selectedRowId = null;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ];
  }

  ngOnInit() {
    this.gridStateName = 'sport-favorites-type-grid-state';
    this.getPartners();
    this.getPage();
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

  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;

  }

  onPriorityChange(val) {
    this.priority = val;
  }

  onAddCompetition() {
    this.isSendingRequest = true;
    if (this.partnerId == null) {
      SnackBarHelper.show(this._snackBar, { Description: 'Select partner', Type: "error" });
      return;
    }
    let row = this.agGrid.api.getSelectedRows()[0];
    let model = {
      CompetitionId: row.Id,
      PartnerId: this.partnerId,
      Priority: +this.priority,
    };
    this.apiService.apiPost('competitions/addfavorite', model)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.favoritesRowData.unshift(data);
          this.favoritesRowData = [...this.favoritesRowData]
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingRequest = false;
      });
    this.partnerId = null;
    this.priority = null;

  }

  onRemoveCompetition() {
    this.isSendingRequest = true;
    this.apiService.apiPost('competitions/removefavorite', { CompetitionId: this.selectedRowId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          let index = this.favoritesRowData.findIndex(links => {
            return links.Id = this.selectedRowId;
          })
          if (index >= 0) {
            this.favoritesRowData.splice(index, 1);
            this.selectedRowId = null;
          }
          this.favoritesRowData = [...this.favoritesRowData]
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingRequest = false;
      });
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  onRowSelected(id: number) {
    this.selectedRowId = id;
  };

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }


  onCellValueChanged(params) {
    this.apiService.apiPost('competitions/updatefavorite', params.data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  getPage() {
    this.apiService.apiPost(this.path1, {})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.favoritesRowData = data.Competitions;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.pageindex = this.paginationPage - 1;
        paging.pagesize = Number(this.cacheBlockSize);
        paging.PartnerId = this.partnerId;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.apiService.apiPost(this.path, paging)
          .pipe(take(1)).subscribe(data => {
            if (data.Code === 0) {
              params.success({ rowData: data.Objects, rowCount: data.TotalCount });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  onPageSizeChanged() {
    this.agGrid.api.paginationSetPageSize(Number(this.cacheBlockSize));
    this.agGrid.api.setServerSideDatasource(this.createServerSideDatasource());
  }

}
