import { Component, OnInit, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { DateAdapter } from "@angular/material/core";
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { ACTIVITY_STATUSES, DEVICE_TYPES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-popup-statistics',
  templateUrl: './popup-statistics.component.html',
  styleUrls: ['./popup-statistics.component.scss']
})
export class PopupStatisticsComponent implements OnInit {
  id = signal<number | null>(null);
  status = ACTIVITY_STATUSES;
  rowType = 2;
  deviceTypes = DEVICE_TYPES;
  partners = [];
  popup = signal<any>(null);

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public router: Router,
    public configService: ConfigService,
    public dialog: MatDialog,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dateAdapter: DateAdapter<Date>
  ) {
    effect(() => {
      if (this.id()) {
        this.fetchPopupById();
      }
    });
  }

  ngOnInit(): void {
    this.id.set(+this.activateRoute.snapshot.queryParams.id);
    this.partners = this.commonDataService.partners;
  }

  fetchPopupById() {
    const data = { PopupId: this.id() };
    this.apiService.apiPost(this.configService.getApiUrl, data, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_POPUP_STATISTICS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.popup.set(data.ResponseObject.Entities[0]);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  onNavigatePopups() {
    this.router.navigate(['/main/platform/cms/popups']);
  }
}
