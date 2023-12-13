import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-core-enumerations',
  templateUrl: './core-enumerations.component.html',
  styleUrls: ['./core-enumerations.component.scss']
})
export class CoreEnumerationsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];

  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_ENUMERATIONS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Cms.EnumType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EnumType',
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Bonuses.Value',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Value',
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Partners.Text',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Text',
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.LanguageId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        resizable: true,
        filter: 'agTextColumnFilter',
      },
    ];

  }

  ngOnInit() {
    this.gridStateName = 'core-enumerations-grid-state';

    this.getPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();

  }

  getPage() {
    this.apiService.apiPost(this.configService.getApiUrl, 'en',
      true, Controllers.ENUMERATION, Methods.GET_ENUMERATIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

}
