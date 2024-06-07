import { Component, OnInit, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AffiliateStates, Controllers, GridMenuIds, GridRowModelTypes, Methods, } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CommonDataService } from 'src/app/core/services';
import { syncColumnReset, syncPaginationWithoutBtn } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-all-affiliates',
  templateUrl: './all-affiliates.component.html',
  styleUrls: ['./all-affiliates.component.scss']
})
export class AllAffiliatesComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public partners = [];
  public countries = [];
  public genders = [];
  public categories = [];
  public languages = [];
  public partnerId;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
  };
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
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.AFFILIATES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
      },
      {
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
      },
      {
        headerName: 'Clients.MobileNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileNumber',
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Gender',
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionId',
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
      },
      {
        headerName: 'PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
      },
      {
        headerName: 'View',
        cellRenderer: OpenerComponent,
        minWidth: 60,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'affiliate');
          data.queryParams = { affiliateId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];
  }

  ngOnInit() {
    this.gridStateName = 'all-affiliates';
    this.partners = this.commonDataService.partners;
    this.getAllCountries();
    this.genders = this.commonDataService.genders;
    this.languages = this.commonDataService.languages;
    this.getCategories();
    this.getPage();
  }

  getAllCountries() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countries = data.ResponseObject;
        }
      });
  }

  getCategories() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_CATEGORIES_ENUM).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.categories = data.ResponseObject;
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncPaginationWithoutBtn();
    syncColumnReset();

  }

  getPage() {
    this.apiService
      .apiPost(this.configService.getApiUrl, {}, true, Controllers.AFFILIATES, Methods.GET_AFFILIATES)
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject.Entities;
          const state = mappedRows?.State
          mappedRows.map((payment) => {
            payment.PartnerId = this.partners.find((partner) => partner.Id === payment.PartnerId)?.Name;
            payment.Gender = this.genders.find((gender) => gender.Id === payment.Gender)?.Name;
            payment.LanguageId = this.languages.find((language) => language.Id === payment.LanguageId)?.Name;
            payment.CategoryId = this.categories.find((category) => category.Id === payment.CategoryId)?.Name;
            payment.RegionId = this.countries.find((country) => country.Id === payment.RegionId)?.Name;
            payment.State = AffiliateStates[payment.State];
            return payment;
          });
          this.rowData = mappedRows;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.getPage();
  }

}
