import {Component, OnInit, Injector} from '@angular/core';
import {CommonDataService} from 'src/app/core/services';
import {CoreApiService} from '../../services/core-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {Controllers, GridMenuIds, Methods, ModalSizes, ObjectTypes} from 'src/app/core/enums';
import {Paging} from 'src/app/core/models';
import {take} from 'rxjs/operators';
import 'ag-grid-enterprise';
import {MatDialog} from '@angular/material/dialog';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { CellClickedEvent, CellDoubleClickedEvent } from 'ag-grid-community';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { ActivatedRoute } from '@angular/router';
import { RECEIVER_TYPES } from 'src/app/core/constantes/statuses';

const states = [
  {"Name": 'Active', "Id": 1},
  {"Name": 'Inactive', "Id": 2}
];

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public partners: any[] = [];
  public announcementTypes: any[] = [];
  public partnerId;
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();
  public receiverTypeIds = RECEIVER_TYPES

  constructor(
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    public apiService: CoreApiService,
    public _snackBar: MatSnackBar,
    public activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.adminMenuId = GridMenuIds.CORE_ANNOUNCMENTS;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
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
        },
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Notifications.Receivers',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Receivers',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.ReceiverType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ReceiverTypeName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.redirectToAnnouncements(event),
      },
    ];
  }

  ngOnInit() {
    this.fetchAnnucementTypesEnum()
    this.partners = this.commonDataService.partners;
    this.gridStateName = 'announcements-grid-state';
    this.startDate();
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  fetchAnnucementTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_ANNOUNCEMENT_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.announcementTypes = data.ResponseObject;          
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  onPartnerChange(val: number) {
    this.partnerId = val;
    this.getCurrentPage();
  }

  async addAnnouncement() {
    const {AddAnnouncementsComponent} = await import('./add-announcements/add-announcements.component');
    const dialogRef = this.dialog.open(AddAnnouncementsComponent, {
      width: ModalSizes.SMALL, 
      data: {
        partners: this.partners,
        partnerId: this.partnerId, announcementTypes: this.announcementTypes, announcement: {}
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  async editAnnouncement() {
    const row = this.gridApi.getSelectedRows()[0];
    const {AddAnnouncementsComponent} = await import('./add-announcements/add-announcements.component');
    const dialogRef = this.dialog.open(AddAnnouncementsComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        partnerId: this.partnerId, announcementTypes: this.announcementTypes, announcement: row
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();

      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = params.request.startRow;
        // paging.TakeCount = this.cacheBlockSize;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.PartnerId = this.partnerId;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CONTENT, Methods.GET_ANNOUNCEMENTS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((entity) => {
                let partnerName = this.partners.find((partner) => {
                  return partner.Id == entity.PartnerId;
                })
                if (partnerName) {
                  entity['PartnerName'] = partnerName.Name;
                }
                let statusName = states.find((st) => {
                  return st.Id == entity.State;
                })
                if (statusName) {
                  entity['StatusName'] = statusName.Name;
                }
                let typeName = this.announcementTypes.find((st) => {
                  return st.Id == entity.Type;
                })
                if (typeName) {
                  entity['TypeName'] = typeName.Name;
                }

                let receiverTypeName = this.receiverTypeIds.find((st) => {
                  return st.Id == entity.ReceiverType;
                })
                if (receiverTypeName) {
                  entity['ReceiverTypeName'] = receiverTypeName.Name;
                }
              })
              params.success({rowData: mappedRows});
            } else {
              SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
            }
            setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 200);
          });
      },
    };
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const id = event.data.Id;
    const {NikiNamePopup} = await import('./nike-name-popup/nike-name-popup.component');
    const dialogRef = this.dialog.open(NikiNamePopup, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId:  ObjectTypes.Announcement
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource())      }
    })
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {this.gridApi.setServerSideDatasource(this.createServerSideDatasource());}, 0);
  }

  redirectToAnnouncements(ev) {
    const row = ev.data;
    this.router.navigate(['/main/platform/notifications/announcements/announcement/main'], {
      queryParams: { "announcementId": row.Id }
    });
  }

}
