import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { CellDoubleClickedEvent, CellValueChangedEvent } from 'ag-grid-community';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-core-job-areas',
  templateUrl: './core-job-areas.component.html',
  styleUrls: ['./core-job-areas.component.scss']
})
export class CoreJobAreasComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public CommentTypes: any[] = [];
  public partners: any[] = [];
  public frameworkComponents;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_JOBE_AREAS;
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
        headerName: 'Common.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Info',
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        filter: 'agNumberColumnFilter',
      },

    ];
    this.frameworkComponents = {

      textEditor: TextEditorComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'core-job-areas-grid-state';
    this.partners = this.commonDataService.partners;
    this.getPage();
  }



  async addJobAreas() {
    const { AddCoreJobAreasComponent } = await import('./add-job-areas/add-job-areas.component');
    const dialogRef = this.dialog.open(AddCoreJobAreasComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }


  onCellValueChanged(params) {
    const row = params.data;

    this.apiService.apiPost(this.configService.getApiUrl, row,
      true, Controllers.CONTENT, Methods.SAVE_JOB_AREA
    )
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.CONTENT, Methods.GET_JOB_AREA)
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
