import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../../../services/core-api.service';
import 'ag-grid-enterprise';
import { Paging } from 'src/app/core/models';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { syncColumnNestedSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import {ExportService} from "../../../../services/export.service";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public segmentId;
  public partners: any[] = [];
  public genders: any[] = [];
  public clientCategories: any[] = [];
  public regions: any[] = [];
  public languages: any[] = [];
  public clientStates: any[] = [];
  public filteredData;

  constructor(
    protected injector:Injector,
    private _snackBar: MatSnackBar,
    private apiService:CoreApiService,
    public commonDataService:CommonDataService,
    private exportService:ExportService,
    private activateRoute: ActivatedRoute,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GenderName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.BirthDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BirthDate',
        filter: 'agDateColumnFilter',
        cellRenderer: function(params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.BirthDate,'medium');
          return `${dat}`;
          },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Payments.Document',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentNumber',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.IssuedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentIssuedBy',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Category',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountryName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.Address',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Address',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.MobileNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileNumber',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.PhoneNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PhoneNumber',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.DocumentVerified',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsDocumentVerified',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.AffiliateId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliateId',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.AffiliatePlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliatePlatformId',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.ZipCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ZipCode',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StateName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        filter: 'agDateColumnFilter',
        cellRenderer: function(params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime,'medium');
          return `${dat}`;
          },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.numberOptions
        },
      },
      {
        headerName: 'Payments.LastDepositDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastDepositDate',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        },
      },
    ];
   }

  ngOnInit() {
    this.segmentId = this.activateRoute.snapshot.queryParams.segmentId;
    this.clientStates = this.activateRoute.snapshot.data.clientStates;
    this.clientCategories = this.activateRoute.snapshot.data.clientCategories;

    this.gridStateName = 'segment-clients-grid-state';
    this.getRegions();
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.genders = this.commonDataService.genders;
  }

  private getRegions() {
    this.apiService.apiPost(this.configService.getApiUrl, {TypeId: null}, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        data.ResponseObject.forEach(r => {
          if (r.TypeId === 5)
            this.regions.push(r);
        });

        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }


  onGridReady(params)
  {
    syncColumnNestedSelectPanel()
    super.onGridReady(params);

  }

  createServerSideDatasource()
  {
    return {
      getRows:  (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.SegmentId = this.segmentId;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CLIENT, Methods.GET_SEGMENT_CLIENTS).pipe(take(1)).subscribe(data => {
          if(data.ResponseCode === 0)
          {
            const mappedRows = data.ResponseObject.Entities.map((items) => {

              items.PartnerName = this.partners.find((item => item.Id === items.PartnerId))?.Name;
              items.StateName = this.clientStates.find((item => item.Id === items.State))?.Name;
              items.CategoryName = this.clientCategories.find((item => item.Id === items.CategoryId))?.Name;
              items.GenderName = this.genders.find((item => item.Id === items.Gender))?.Name;
              items.LanguageName = this.languages.find((item => item.Id === items.LanguageId))?.Name;
              items.CountryName = this.regions.find((item => item.Id === items.RegionId))?.Name;

              return items;
            });
            params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count});
          } else{
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.CLIENT, Methods.EXPORT_SEGMENT_CLIENTS, this.filteredData);
  }

}
