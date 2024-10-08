import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import 'ag-grid-enterprise';
import { BasePaginatedGridComponent } from "../../../../../../../components/classes/base-paginated-grid-component";
import { AgBooleanFilterComponent } from "../../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../../components/grid-common/checkbox-renderer.component";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { Paging } from "../../../../../../../../core/models";
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { OddsTypePipe } from "../../../../../../../../core/pipes/odds-type.pipe";
import { LocalStorageService } from "../../../../../../../../core/services";
import { BetStatuses, ModalSizes, OddsTypes } from 'src/app/core/enums';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { BetsComponent } from '../../../../active-matches/active/tabs/bets/bets.component';

@Component({
  selector: 'app-bets',
  templateUrl: '../../../../active-matches/active/tabs/bets/bets.component.html',
  styleUrls: ['../../../../active-matches/active/tabs/bets/bets.component.scss']
})
export class FinishedBetsComponent extends BetsComponent implements OnInit {

  public title: string = 'Sport.Finished';
  public routerLink: string = '../../all-finished';

 
  constructor(
    protected injector: Injector,
    protected apiService: SportsbookApiService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    protected activateRoute: ActivatedRoute,
    protected localStorageService: LocalStorageService
  ) {
    super(
      injector,
      apiService,
      _snackBar,
      dialog,
      activateRoute,
      localStorageService
    );

  }

  ngOnInit() {
    this.matchId = this.activateRoute.snapshot.queryParams.finishId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.pageConfig = {
      MatchId: this.matchId
    };
    this.getCommentTypes();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    // this.mapStatusFilter();
  }


}
