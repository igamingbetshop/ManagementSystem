import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SportsbookApiService} from "../../../../../../services/sportsbook-api.service";
import {ConfigService} from "../../../../../../../../../core/services";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-profit-info',
  templateUrl: './view-profit-info.component.html',
  styleUrls: ['./view-profit-info.component.scss']
})
export class ViewProfitInfoComponent implements OnInit {
  public profitInfo = [];

  constructor(public dialogRef: MatDialogRef<ViewProfitInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { PartnerId: any, MatchId: any , MarketTypeId: number},
              private _snackBar: MatSnackBar,
              private apiService: SportsbookApiService,
              public configService: ConfigService) {
  }

  ngOnInit(): void {
    this.viewProfitInfo();
  }

  viewProfitInfo() {
    this.apiService.apiPost('matches/profitinfo', {
      MatchId: String(this.data.MatchId),
      PartnerId: this.data.PartnerId,
      MarketTypeId: this.data.MarketTypeId
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const resp = data.ResponseObject;
          Object.keys(resp).forEach(key => {
            let row = [];
            row.push(key);
            if (resp[key] == null)
              row = [...row, ...['-', '-', '-', '-', '-', '-', '-', '-', '-', '-',]];
            else {
              row.push(!resp[key]['AbsoluteProfitRange1'] && resp[key]['AbsoluteProfitRange1'] !== 0 ? '-' : resp[key]['AbsoluteProfitRange1']);
              row.push(!resp[key]['AbsoluteProfitRange2'] && resp[key]['AbsoluteProfitRange2'] !== 0 ? '-' : resp[key]['AbsoluteProfitRange2']);
              row.push(!resp[key]['AbsoluteProfitRange3'] && resp[key]['AbsoluteProfitRange3'] !== 0 ? '-' : resp[key]['AbsoluteProfitRange3']);
              row.push(!resp[key]['AbsoluteProfitLive'] && resp[key]['AbsoluteProfitLive'] !== 0 ? '-' : resp[key]['AbsoluteProfitLive']);
              row.push(!resp[key]['RelativeLimitRange1'] && resp[key]['RelativeLimitRange1'] !== 0 ? '-' : resp[key]['RelativeLimitRange1']);
              row.push(!resp[key]['RelativeLimitRange2'] && resp[key]['RelativeLimitRange2'] !== 0 ? '-' : resp[key]['RelativeLimitRange2']);
              row.push(!resp[key]['RelativeLimitRange3'] && resp[key]['RelativeLimitRange3'] !== 0 ? '-' : resp[key]['RelativeLimitRange3']);
              row.push(!resp[key]['RelativeLimitLive'] && resp[key]['RelativeLimitLive'] !== 0 ? '-' : resp[key]['RelativeLimitLive']);
              row.push((resp[key]['AllowCashout'] == true) ? 'YES' : ((resp[key]['AllowCashout'] == false) ? 'NO' : "NONE"));
              row.push((resp[key]['AllowMultipleBets'] == true) ? 'YES'
              : row.push((resp[key]['AllowMultipleBets'] == false) ? 'NO' : "NONE"));
            }
            this.profitInfo.push(row);
          });
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

}
