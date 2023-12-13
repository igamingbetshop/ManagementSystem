import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes, ObjectTypes } from "../../../../../../../core/enums";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { TextEditorComponent } from "../../../../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../../../../components/grid-common/select-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { ImageRendererComponent } from "../../../../../../components/grid-common/image-renderer.component";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CLIENT_BOUNUS_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs = [];
  public fromDate = new Date();

  public toDate = new Date();
  public clientData = {};
  public statusName = [];
  public clientBonusStatuses = CLIENT_BOUNUS_STATUSES;
  public comments;
  public selectedItem = 'today';
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
    imageRenderer: ImageRendererComponent
  };

  constructor(private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.adminMenuId = GridMenuIds.CLIENTS_NOTES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.Message',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Message',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.Comments',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommentTemplateId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.CreatorFirstName !== null || params.data.CreatorLastName !== null) {
            a.innerHTML = params.data.CreatorFirstName + ' ' + params.data.CreatorLastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          return `<i class="material-icons">visibility</i>`
        },
        sortable: false,
        filter: false,
        onCellClicked: this.openNotes['bind'](this)
      }
    ];
  }

  ngOnInit(): void {
    this.getCommentTemplates();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.startDate();
    this.getData();
  }

  getData() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: this.toDate,
      Type: null,
      ObjectTypeId: 2,
      ObjectId: +this.clientId
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.UTIL, Methods.GET_NOTES).pipe(take(1)).subscribe((data) => {

        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.map((items) => {
            items.StatusName = this.clientBonusStatuses.find((item => item.Id === items.State))?.Name;
            if (this.comments?.length) {
              items.CommentTemplateId = this.comments.find((item => item.Id === items.CommentTemplateId))?.Name;
            }
            return items;
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.selectedItem = time;
    this.getData();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  onGridReady(params) {
    syncNestedColumnReset();
    super.onGridReady(params);
  }

  getCommentTemplates() {
    this.apiService.apiPost(this.configService.getApiUrl, 5, true,
      Controllers.CONTENT, Methods.GET_COMMENT_TEMPLATES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.comments = data.ResponseObject;
        }
      });
  }

  async addNotes() {
    const { AddNoteComponent } = await import('../../../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: this.clientId, ObjectTypeId: ObjectTypes.Client }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getData();
      }
    });
  }

  async openNotes(params) {
    const { NoteComponent } = await import('../notes/note/note.component');
    const dialogRef = this.dialog.open(NoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { sentData: params.data }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getData();
      }
    });
  }

}