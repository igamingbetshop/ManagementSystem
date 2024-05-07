import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import { GridRowModelTypes, ModalSizes } from "../../../../../../../core/enums";
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
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CLIENT_BOUNUS_STATUSES } from 'src/app/core/constantes/statuses';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  playerId: number;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  columnDefs = [];
  fromDate = new Date();

  toDate = new Date();
  clientData = {};
  statusName = [];
  clientBonusStatuses = CLIENT_BOUNUS_STATUSES;
  comments;
  selectedItem = 'today';
  pageIdName: string;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
    imageRenderer: ImageRendererComponent
  };

  constructor(
    private apiService: SportsbookApiService,    
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
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
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
    this.setTime();     
    this.getData();
    this.pageIdName = `/ ${this.playerId} : ${this.translate.instant('Clients.Notes')}`;
  }

  getData() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: this.toDate,
      Type: null,
      ObjectTypeId: 22,
      ObjectId: +this.playerId
    }
    this.apiService.apiPost('players/getnotes', this.clientData).pipe(take(1)).pipe(take(1)).subscribe((data) => {

        if (data.Code === 0) {
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

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getData();
  }

  onGridReady(params) {
    syncNestedColumnReset();
    super.onGridReady(params);
  }

  getCommentTemplates() {
    this.apiService.apiPost('commenttypes')
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
          this.comments =  data.CommentTypes;
        }
      });
  }

  async addNotes() {
    const { AddNoteComponent } = await import('./add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: this.playerId, ObjectTypeId: 22,
        CommentTypes: this.comments
       }
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

  onNavigateTo() {
    this.router.navigate(["/main/sportsbook/players/all-players"])
  }

}
