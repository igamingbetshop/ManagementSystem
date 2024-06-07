import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreApiService } from '../../platforms/core/services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bet-shops-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select 
        (selectionChange)="betShopsChange($event.value)"
        panelClass="overlay-dropdown"
        disableOptionCentering
        placeholder="{{'BetShops.SelectBetShop' | translate}}"
        >
        <mat-option [value]="null">{{'BetShops.SelectBetShop' | translate }}</mat-option>
        @for (_Shops of betShopGroups; track _Shops.Id) {
        <mat-option [value]="_Shops.Id">{{_Shops.Name | translate}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BetShopsesComponent implements OnInit {
  betShopGroups: any[] = [];
  @Output() toBetShopsChange = new EventEmitter<any>();
  selectedBetshop;
  constructor(
    private apiService: CoreApiService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getBetshopGroups();
  }

  getBetshopGroups() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_BET_SHOP_GROUPS_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betShopGroups = data.ResponseObject;
          this.selectedBetshop = this.betShopGroups[0].Id;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }


  betShopsChange(event: number) {
    console.log(event, "event");
    
    this.toBetShopsChange.emit(event);
  }

}