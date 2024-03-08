import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { GridRowModelTypes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-mapped-phases',
  templateUrl: './mapped-phases.component.html',
  styleUrls: ['./mapped-phases.component.scss']
})
export class MappedPhasesComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() callParent: EventEmitter<void> = new EventEmitter<void>();
  @Input() isCanNotSelect = true;

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;


  public sportId: number = 1;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };


  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Bonuses.Sequence',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Sequence',
      },
      {
        headerName: 'Sport.GameSequence',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameSequence',
      },
      {
        headerName: 'Sport.LowNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LowNumber',
      },
      {
        headerName: 'Sport.HighNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HighNumber',
      },
    ];
  }

  ngOnInit() {
    this.getRows();
  }

  isUnknownRowSelected() {
    return this.agGrid.api && this.agGrid.api.getSelectedRows().length === 0;
  };

  onRowSelected() {
    this.callParent.emit();
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  getRows() {
    const paging = new Paging();
    paging.PageIndex = this.paginationPage - 1;
    paging.PageSize = 1000;
    paging.SportIds = null;
    this.apiService.apiPost('matches/matchphases', paging,
    ).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.Objects
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  };

}
