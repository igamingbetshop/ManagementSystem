import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { RouteTabItem } from 'src/app/core/interfaces';
import { CoreApiService } from '../../services/core-api.service';
import { ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  tabs: RouteTabItem[] = [
    {
      label: 'Sport.MainInfo',
      route: 'main'
    },
    {
      label: 'Clients.Corrections',
      route: 'corrections'
    },
    {
      label: 'Users.AccountsHistory',
      route: 'accounts-history'
    },
    {
      label: 'Clients.ProductLimits',
      route: 'product-limits'
    },
    {
      label: 'Users.UserLogs',
      route: 'user-logs'
    },
    {
      label: 'Clients.Sessions',
      route: 'session'
    },
    {
      label: 'Home.Settings',
      route: 'user-settings'
    },
  ];

  userId: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public translate: TranslateService,

  ) { }

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.getUser();
  }

  getUser() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId,
      true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          if (data.ResponseObject.Type === 4) {
            this.tabs.push(
              {
                label: 'Commission Plan',
                route: 'commission-plan'
              },
              {
                label: 'Settings',
                route: 'user-settings'
              }
            )
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
