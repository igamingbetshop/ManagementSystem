import { Component, OnInit, Injector, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import { GridRowModelTypes } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { CellValueChangedEvent } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;

  public path: string = 'competitions';
  public path1: string = 'competitions/favorites';


  public rowData = [];
  public rowData1 = [];
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  };
  public rowModelType1: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs2;
  isSendingReqest = false;

  public partners: any[] = [];
  public partnerId: number = null;
  public priority: number = null;


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

    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
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
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
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
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        sortable: true,
        editable: true,
        filter: false,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        cellEditor: 'numericEditor',
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
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: false,
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
    this.isSendingReqest = true;
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
          this.rowData1.unshift(data);
          this.agGrid1.api.setRowData(this.rowData1);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
    this.partnerId = null;
    this.priority = null;

  }

  onRemoveCompetition() {
    this.isSendingReqest = true;
    let row = this.agGrid1.api.getSelectedRows()[0];
    this.apiService.apiPost('competitions/removefavorite', { CompetitionId: row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          let index = this.rowData1.findIndex(links => {
            return links.Id = row.Id
          })
          if (index >= 0) {
            this.rowData1.splice(index, 1);
          }
          this.agGrid1.api.setRowData(this.rowData1);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  isRowSelected1() {
    return this.agGrid1?.api && this.agGrid1?.api.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onGridReady1(params) {
    super.onGridReady(params);
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
          this.rowData1 = data.Competitions;
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
