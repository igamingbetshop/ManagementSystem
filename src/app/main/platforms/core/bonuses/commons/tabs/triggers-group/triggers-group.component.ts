import {Component, Injector, OnInit} from '@angular/core';
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {UntypedFormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods, ModalSizes} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-triggers-group',
  templateUrl: './triggers-group.component.html',
  styleUrls: ['./triggers-group.component.scss']
})
export class TriggersGroupComponent implements OnInit {
  public commonID;
  public triggerGroups;
  public types = [
    {
      Id: 1,
      Name: "All"
    },
    {
      Id: 2,
      Name: "Any"
    }
  ];

  constructor(private apiService: CoreApiService,
              private commonDataService: CommonDataService,
              private fb: UntypedFormBuilder,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              protected injector: Injector,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.commonID = this.activateRoute.snapshot.queryParams.commonId;
    this.getTriggerGroups();
  }

  getTriggerGroups() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.commonID, true,
      Controllers.BONUS, Methods.GET_TRIGGER_GROUPS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.triggerGroups = data.ResponseObject.map((item) => {
          item.TypeName = this.types.find((chr) => {
            return chr.Id === item.Type;
          }).Name;

          return item;
        });
      }
    });
  }

  async openAddTriggerToGroup(triggerGroup) {
    const {AddTriggerToGroupComponent} = await import('./add-trigger-to-group/add-trigger-to-group.component');
    const dialogRef = this.dialog.open(AddTriggerToGroupComponent, {
      width: ModalSizes.MEDIUM,
      data: triggerGroup
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getTriggerGroups()
      }
    });
  }

  async createTriggerGroup() {
    const {CreateTriggerGroupComponent} = await import('./create-trigger-group/create-trigger-group.component');
    const dialogRef = this.dialog.open(CreateTriggerGroupComponent, {
      width: ModalSizes.MEDIUM
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getTriggerGroups()
      }
    });
  }

  removeTriggerFromGroup(triggerGroup, setting, index) {
    const obj = {
      TriggerGroupId: triggerGroup.Id,
      TriggerGroupBonusId: +this.commonID,
      TriggerSettingId: setting.Id
    }
    this.apiService.apiPost(this.configService.getApiUrl, obj, true,
      Controllers.BONUS, Methods.REMOVE_TRIGGER_FROM_GROUP).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        triggerGroup.TriggerSetting.splice(index, 1);
        SnackBarHelper.show(this._snackBar, {Description : 'Deleted Successfully', Type : "success"});
      } else {
        SnackBarHelper.show(this._snackBar, {Description : 'failed', Type : "error"});
      }
    });
  }

  onRemoveTriggerGroup(event) {

    this.apiService.apiPost(this.configService.getApiUrl, { TriggerGroupId: event.Id}, true,
      Controllers.BONUS, Methods.REMOVE_TRIGGER_GROUP).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, {Description : 'Deleted Successfully', Type : "success"});
      } else {
        SnackBarHelper.show(this._snackBar, {Description : 'failed', Type : "error"});
      }
    });

  }

  onPriorityChange(ev) {
    // console.log(ev);

  }

}
