import {Component, Injector, OnInit} from '@angular/core';
import {Controllers, Methods} from "../../../../../../../core/enums";
import {mergeMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {take} from "rxjs";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-downline',
  templateUrl: './downline.component.html',
  styleUrl: './downline.component.scss'
})
export class DownlineComponent implements OnInit {
  userId: any;
  userData: any;
  agentsEnums: any;
  levelTypes: any;
  selectedAgentId: any = 0;
  selectedTabIndex: number = 0;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector,
  ) {}

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.getAgentLevels();
  }

  private getAgentLevels() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId, true, Controllers.AGENT, Methods.GET_EXISTING_LEVELS)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.agentsEnums = data.ResponseObject;
        console.log(this.agentsEnums);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  private getAgents() {

  }

  onTabSelectionChange(event: MatTabChangeEvent): void {
    const selectedAgent = this.agentsEnums[event.index];
    this.selectedAgentId = selectedAgent.Id;
    console.log(this.selectedAgentId);
  }
}
