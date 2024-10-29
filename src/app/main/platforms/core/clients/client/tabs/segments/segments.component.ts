import { Component, Injector, OnInit } from '@angular/core';

import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";

import { take } from "rxjs/operators";
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { ACTIVITY_STATUSES, MODES } from 'src/app/core/constantes/statuses';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss']
})

export class SegmentsComponent extends BaseGridComponent implements OnInit {

  clientId: number;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = [];
  filteredClientId = {};
  partners: any[] = [];
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public commonDataService: CommonDataService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_SEGMENTS;
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.partners = this.commonDataService.partners;
    this.setColDefs();
    this.featchSegments();
  }

  featchSegments() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_SEGMENTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          this.rowData.forEach((row) => {
            row.PartnerName = this.partners.find(partner => partner.Id === row.PartnerId)?.Name;
            row.ModeName = MODES.find(mode => mode.Id === row.Mode)?.Name;
            row.Status = ACTIVITY_STATUSES.find(status => status.Id === row.State)?.Name;
            row.ConsideredDate = row.ConsideredDate ? new Date(row.ConsideredDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;
            row.CreationDate = row.CreationDate ? new Date(row.CreationDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;
            row.LastUpdateDate = row.LastUpdateDate ? new Date(row.LastUpdateDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
          });
        }
      });
  }

  setColDefs() {
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
        headerName: 'Common.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
      },
      {
        headerName: 'Common.Mode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ModeName',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: ['Active', 'Inactive'],
          newRowsAction: 'keep',
          caseSensitive: false,
          cellHeight: 20,
        },
      },
      {
        headerName: 'Common.ConsideredDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ConsideredDate',
      },
      {
        headerName: 'Common.CreationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
      },
      {
        headerName: 'Common.LastUpdateDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateDate',
      },
    ]
  }

  onGridReady(params: any): void {
    syncNestedColumnReset();
    super.onGridReady(params);
  }

  onReconsiderClientSegments() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.RECONSIDER_CLIENT_SEGMENTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Your request will be submitted', Type: "success" });
        }
      });
  }
}
