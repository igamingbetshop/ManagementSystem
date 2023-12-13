import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {CommonDataService} from "../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SkillGamesApiService} from "../../services/skill-games-api.service";
import {DatePipe} from "@angular/common";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {ModalSizes} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {Paging} from "../../../../../core/models";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public partners;
  public partnerId = null;

  constructor(public commonDataService: CommonDataService,
              protected injector: Injector, private _snackBar: MatSnackBar,
              public dialog: MatDialog, public apiService: SkillGamesApiService) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
      },
      {
        headerName: 'Cms.Body',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Body',
        resizable: true,
      },
      {
        headerName: 'Cms.Head',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Head',
        resizable: true,
      },
      {
        headerName: 'Cms.Image',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Image',
        resizable: true,
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
      },
      {
        headerName: 'Common.StartDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartDate',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.EndDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EndDate',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        resizable: true,
      },
      {
        headerName: 'Cms.IsEnabled',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsEnabled',
        resizable: true,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'banner');
          data.queryParams = {
            Id: params.data.Id,
          };
          return data;
        },
        sortable: false
      },
    ];
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
  }
  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;
    this.go();
  }

  go() {
    this.getCurrentPage();
  }

  deleteBanner() {
    const row = this.gridApi.getSelectedRows()[0];
    delete row.UserId;
    delete row.CurrencyId;

    this.apiService.apiPost('cms/deletebanner', row).subscribe(data => {

      if (data.ResponseCode === 0) {
        this.go();
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  async addBanner() {
    const {AddBannerComponent} = await import('./add-banner/add-banner.component');
    const dialogRef = this.dialog.open(AddBannerComponent, {width: ModalSizes.LARGE, height: '810px'});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost('cms/addbanner', data).pipe(take(1)).subscribe(data => {

          if (data.ResponseCode === 0) {
            this.go();
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex =this.paginationPage - 1;
        paging.PageSize = this.cacheBlockSize;
        paging.PartnerId = this.partnerId;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost('cms/banners', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.Entities;

            mappedRows.forEach((payment) => {
              let partnerName = this.partners.find((partner) => {
                return partner.Id == payment.PartnerId;
              })
              if (partnerName) {
                payment['PartnerName'] = partnerName.Name;
              }
            })

            params.success({rowData: mappedRows, rowCount: data.ResponseObject.TotalCount});
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      },
    };
  }


}
