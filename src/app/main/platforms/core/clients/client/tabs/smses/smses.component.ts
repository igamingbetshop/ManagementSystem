import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../core/services";
import {take} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {CellDoubleClickedEvent} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-smses',
  templateUrl: './smses.component.html',
  styleUrls: ['./smses.component.scss']
})
export class SmsesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public filteredClientId = {};

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private dialog: MatDialog) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_SMS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.Message',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Message',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
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
      }
    ]
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.filteredClientId = {
      IsAnd: true,
      ApiOperationTypeList: [{
        OperationTypeId: 1,
        IntValue: this.clientId
      }]
    }
    this.apiService.apiPost(this.configService.getApiUrl, {ClientIds: this.filteredClientId}, true,
      Controllers.CLIENT, Methods.GET_SMSES).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject.Entities;
      }
    });
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const message = event.value;
    const {ViewHtmlComponent} = await import('../../../../../../components/view-html/view-html.component');
    const dialogRef = this.dialog.open(ViewHtmlComponent, {
      width: ModalSizes.MEDIUM, data: {
        message
      }
    });
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  onGridReady(params: any): void {
    syncNestedColumnReset();
    super.onGridReady(params);
  }

}
