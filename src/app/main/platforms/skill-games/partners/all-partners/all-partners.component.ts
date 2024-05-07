import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {GridMenuIds, GridRowModelTypes} from "../../../../../core/enums";
import {CommonDataService} from "../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {take} from "rxjs/operators";
import {SkillGamesApiService} from "../../services/skill-games-api.service";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-all-partners',
  templateUrl: './all-partners.component.html',
  styleUrls: ['./all-partners.component.scss']
})
export class AllPartnersComponent extends BasePaginatedGridComponent implements OnInit {
  public path = 'partners';
  public rowData = [];
  public partners;
  public status = ACTIVITY_STATUSES;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(protected injector: Injector,
              public apiService: SkillGamesApiService,
              public commonDataService: CommonDataService,
              private _snackBar: MatSnackBar) {
    super(injector);
    this.adminMenuId = GridMenuIds.SG_PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'partner');
          data.queryParams = {partnerId: params.data.Id, partnerName: params.data.Name};
          return data;
        },
        sortable: false
      },
    ]
  }

  ngOnInit(): void {
    this.getPartners();
  }

  getPartners() {
    this.apiService.apiPost('partners')
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  createPartner() {

  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();

  }

}
