import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ACTIVITY_STATUSES, RECEIVER_TYPES } from 'src/app/core/constantes/statuses';
import { DatePipe } from '@angular/common';
import { CellClickedEvent } from 'ag-grid-community';
import { AnnouncementsService } from '../../../announcements.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {

  announcement: any;
  formGroup: UntypedFormGroup;
  isEdit = false;
  announcementId: number;
  partners: any[] = [];
  segments;
  rowData = [];
  columnDefs = [];
  segmentesEntites = [];
  announcementTypes: any[] = [];
  clientStates = ACTIVITY_STATUSES;
  ReceiverTypeIds = RECEIVER_TYPES;
  partnerId: any;
  submitting = false;


  constructor(
    public configService: ConfigService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    private announcementsService: AnnouncementsService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
  ) {
    super(injector);
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
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
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
    this.fetchAnnucementTypesEnum();
    this.partners = this.commonDataService.partners;
    this.announcementId = +this.activateRoute.snapshot.queryParams.announcementId;
    this.createForm();
    this.getAnnouncementById();
    this.getObjectHistory();
  }

  getPartnerPaymentSegments(partnerId) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
          this.setSegmentsEntytes();
        }
      });
  }

  fetchAnnucementTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_ANNOUNCEMENT_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.announcementTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }

  setSegmentsEntytes() {
    this.segmentesEntites.push(this.formGroup.value.SegmentIds.map(elem => {
      return this.segments.find((item) => elem === item.Id).Name
    }))
  }

  getAnnouncementById() {
    this.apiService.apiPost(this.configService.getApiUrl, this.announcementId,
      true, Controllers.CONTENT, Methods.GET_ANNOUNCEMENT_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.announcement = data.ResponseObject;
          this.partnerId = this.announcement.PartnerId;
          this.getPartnerPaymentSegments(this.announcement.PartnerId)
          this.formGroup.patchValue(this.announcement);
          this.announcement.PartnerName = this.partners.find(p => p.Id === this.announcement.PartnerId)?.Name;
          this.announcement.StateName = this.clientStates.find(field => field.Id === this.announcement.State)?.Name;
          this.announcement.TypeName = this.announcementTypes.find(field => field.Id === this.announcement.Type)?.Name;
          this.announcement.ReceiverTypeName = this.ReceiverTypeIds.find(field => field.Id === this.announcement.ReceiverType)?.Name;
        }
      });
  }

  getObjectHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: this.announcementId, ObjectTypeId: 70 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }
      });
  }

  createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      PartnerId: [null],
      NickName: [null],
      Type: [null],
      State: [null],
      UserId: [null],
      Message: [null],
      ClientIds: [[]],
      UserIds: [[]],
      ReceiverType: [null],
      SegmentIds: [[]],
      CreationDate: [null],
      LastUpdateDate: [null]
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid || this.submitting) {
      return;
    }
    this.submitting = true;
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_ANNOUNCEMENT).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Updated successfully', Type: "success" });
          this.isEdit = false;
          this.segmentesEntites = [];
          this.getAnnouncementById();
          this.getObjectHistory();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.submitting = false;
      });
  }

  onMultipleSelect(value: number[], params): void {
    params.data.AccessObjectsIds = value;
  }

  onInputChange(value, params) {
    params.data.AccessObjectsIds = value;
  }

  cancel() {
    this.isEdit = false;
    this.segmentesEntites = [];
    this.setSegmentsEntytes();
  }

  convertToArray(controlName: string): void {
    const values = this.formGroup.get(controlName).value
      .split(',')
      .map(value => parseFloat(value.trim()))
      .filter(value => !isNaN(value));

    this.formGroup.get(controlName).setValue(values);
  }

  redirectToAnnouncements(ev) {
    const row = ev.data;
    this.router.navigate(['/main/platform/notifications/announcements/announcement/main/history'], {
      queryParams: { announcementId: this.announcementId, id: row.Id, partnerId: this.partnerId }
    });
  }

  onNavigateToAnnouncement() {
    this.announcementsService.updateAnnouncement(this.announcement);
    this.router.navigate(['/main/platform/notifications/announcements']);
  }


}
