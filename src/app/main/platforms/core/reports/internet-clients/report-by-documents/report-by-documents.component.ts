import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../services/core-api.service';
import { syncColumnSelectPanel, syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { TransactionsComponent } from '../../../clients/client/tabs/transactions/transactions.component';
import { GridMenuIds } from 'src/app/core/enums';

@Component({
  selector: 'app-report-by-documents',
  templateUrl: './report-by-documents.component.html',
  styleUrls: ['./report-by-documents.component.scss']
})
export class ReportByDocumentsComponent extends TransactionsComponent implements OnInit, AfterViewInit {

  public rowData = [];
  public statusNames = [];
  public fromDate = new Date();
  public toDate = new Date();
  public pageFilter = {};
  public selectedItem = 'today';
  public partners = [];
  public frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };

  constructor(
    protected apiService: CoreApiService,
    protected activateRoute: ActivatedRoute,
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    protected configService: ConfigService,
    protected _snackBar: MatSnackBar,
    protected dateAdapter: DateAdapter<Date>
  ) {
    super(
      apiService,
      activateRoute,
      injector,
      commonDataService,
      configService,
      _snackBar,
      dateAdapter
    );
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_DOCS;

  }

  ngAfterViewInit(): void {
    // Parent component use filtering
  }

  onGridReady(params) {
    syncColumnSelectPanel();
    syncColumnReset();
    super.onGridReady(params);
  }


}
