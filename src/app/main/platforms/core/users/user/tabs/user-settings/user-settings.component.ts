import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {mergeMap, take} from "rxjs/operators";
import {CoreApiService} from "../../../../services/core-api.service";
import {Controllers, Methods} from "../../../../../../../core/enums";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  userId: any;
  userData: any;
  isEdit = false;
  formGroup: UntypedFormGroup;
  agentsEnum: any;
  levelTypes: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    protected injector: Injector,
  ) {}

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.createForm();
    this.mergeUserSettingsApi();
  }

  private mergeUserSettingsApi() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId, true, Controllers.ENUMERATION, Methods.GET_AGENT_LEVELS_ENUM)
      .pipe(
        mergeMap(data => {
          this.setAgentLevelsEnumResponse(data);
          return this.apiService.apiPost(this.configService.getApiUrl, this.userId, true, Controllers.USER, Methods.GET_USER_SETTINGS);
        }))
      .subscribe(data => {
        this.setSettingsResponse(data);
    });
  }

  private setAgentLevelsEnumResponse(data: any) {
    if (data.ResponseCode === 0) {
      this.agentsEnum = data.ResponseObject;
      this.filterAgentsEnum();
    } else {
      SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
    }
  }

  private setSettingsResponse(data: any) {
    if (data.ResponseCode === 0) {
      this.userData = data.ResponseObject;
      this.userData.CountLimits = JSON.parse(this.userData.CountLimits);
      this.formGroup.patchValue(this.userData);
      this.setLevelCountLimits();
    } else {
      SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
    }
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [{value: null, disabled: true}],
      AgentMaxCredit: [null],
      AllowAutoPT: [null],
      AllowOutright: [null],
      CalculationPeriod: [null],
      Comment: [null],
      CreationTime: [null],
      LastUpdateTime: [null],
      LevelLimits: [null],
      OddsType: [null],
      ParentState: [null],
      UserId: [null],
      CountLimits: this.fb.group({
        0: [null],
        1: [null],
        2: [null],
        3: [null],
        4: [null],
        5: [null],
      })
    });
  }

  filterAgentsEnum() {
    this.levelTypes = this.agentsEnum.filter(elem => elem.Id !== 0 && elem.Id !== 1);
    this.levelTypes.sort((a, b) => a.Id - b.Id);
  }

  setLevelCountLimits() {
    if (this.userData.CountLimits.length !== 0) {
      this.levelTypes.map((elem, index) => {
        if (this.userData.CountLimits[index].Count) {
          elem["Count"] = this.userData.CountLimits[index].Count
        } else {
          elem["Count"] = '';
        }
      })
    }
  }

  mapLevels(data) {
    this.levelTypes.forEach((elem, index) => {
      (data[index]) ? elem.Count = data[index] : elem = null
    })
    this.levelTypes = this.levelTypes.filter(elem => elem.Count !== '')
  }

  private getLevelNameUsingId() {
    const levelTypes = JSON.parse(JSON.stringify(this.levelTypes));
    levelTypes.forEach(type => {
      type['Level'] = type['Id'];
      delete type['Id'];
    });
    return JSON.stringify(levelTypes);
  }

  onSubmit() {
    let requestData = this.formGroup.getRawValue();
    this.mapLevels(requestData.CountLimits);
    requestData.CountLimits = this.getLevelNameUsingId();
    if (this.formGroup.invalid) {
      return;
    }

    this.apiService.apiPost(this.configService.getApiUrl, requestData,
      true, Controllers.USER, Methods.UPDATE_USER_SETTINGS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, {
          Description: 'The User Settings has been updated successfully', Type: "success"
        });
        this.isEdit = false;
        this.ngOnInit();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

}
