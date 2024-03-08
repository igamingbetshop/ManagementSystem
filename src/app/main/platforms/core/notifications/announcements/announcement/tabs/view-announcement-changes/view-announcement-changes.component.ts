import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

import {Controllers, Methods} from "../../../../../../../../core/enums";
import {CoreApiService} from "../../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import { ACTIVITY_STATUSES, RECEIVER_TYPES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-view-announcement-changes',
  templateUrl: './view-announcement-changes.component.html',
  styleUrls: ['./view-announcement-changes.component.scss']
})
export class ViewAnnouncementChangesComponent implements OnInit {
  public id;
  public announcementId;
  public oldData;
  public newData;
  public partners: any[] = [];
  public clientStates = ACTIVITY_STATUSES;
  public segments;
  public ReceiverTypeIds = RECEIVER_TYPES;
  partnerId: any;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public commonDataService: CommonDataService,
              private router: Router,
              public configService: ConfigService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.queryParams.id;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partners = this.commonDataService.partners;
    this.announcementId = this.activateRoute.snapshot.queryParams.announcementId;
    this.getPartnerPaymentSegments(this.partnerId);
  }

  getPartnerPaymentSegments(partnerId) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
          this.fetchHistory();
        }
      });
  }


  onNavigateTo() {
    this.router.navigate(['main/platform/notifications/announcements/announcement/main'],
      {queryParams: {"announcementId": this.announcementId}});
  }

  fetchHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, this.id, true, Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.oldData = this.parseData(data.ResponseObject[0]);
          this.newData = this.parseData(data.ResponseObject[1]);

          this.updateDataProperties(this.oldData);
          this.updateDataProperties(this.newData);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  parseData(data: any): any {
    return data ? JSON.parse(data) : "";
  }

  updateDataProperties(target: any): void {
    if (target !== "") {
      target.PartnerName = this.getNameById(target.PartnerId, this.partners);
      target.StateName = this.getNameById(target.State, this.clientStates);
      target.ReceiverTypeName = this.getNameById(target.ReceiverType, this.ReceiverTypeIds);
      target.segmentesEntites = [this.mapIdsToNames(target.SegmentIds, this.segments)];
    }
  }

  getNameById(id: number, array: any[]): string {
    return array.find(field => field.Id === id)?.Name || "";
  }

  mapIdsToNames(ids: number[], array: any[]): string[] {
    return ids.map(elem => array.find(item => elem === item.Id)?.Name || "");
  }

  areArraysEqual(array1: any[], array2: any[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }


}
