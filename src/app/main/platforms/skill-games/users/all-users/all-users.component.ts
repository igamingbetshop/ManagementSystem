import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import 'ag-grid-enterprise';
import {Paging} from "../../../../../core/models";
import {take} from "rxjs/operators";
import {CommonDataService} from "../../../../../core/services";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {SkillGamesApiService} from "../../services/skill-games-api.service";

// TODO handle when solved backand issue

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public partners = [];
  public genders: any[] = [
    {Id: 1, NickName: null, Name: "Male", Info: null},
    {Id: 2, NickName: null, Name: "Female", Info: null}
  ];
  public partnerId;
  private path = 'user';

  constructor(protected injector: Injector,
              public apiService: SkillGamesApiService,
              public commonDataService: CommonDataService,
              private _snackBar: MatSnackBar) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GenderName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      }
    ]
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onPartnerChange(value: number) {
    this.partnerId = value;
    this.getCurrentPage();
  }

  createServerSideDatasource() {

    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.pageindex = this.paginationPage - 1;
        paging.pagesize = this.cacheBlockSize;
        if (this.partnerId) {
          paging.PartnerIds = {
            ApiOperationTypeList: [{OperationTypeId: 1, IntValue: this.partnerId, DecimalValue: this.partnerId}],
            IsAnd: true
          }
        }

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.GenderName = this.genders.find((item => item.Id === items.Gender))?.Name;
                return items;
              });
              params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
            } else {
              SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
            }
            setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 200);
          });
      },
    };
  }
}
