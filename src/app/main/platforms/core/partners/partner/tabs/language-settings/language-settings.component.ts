import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { IRowNode } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';

import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { PartnerLanguageSettingsComponent } from './grids/partner-languages/partner-language-settings.component';
import { AllLanguageSettingsComponent } from './grids/all-languages/all-language-settings.component';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {
  @ViewChild('AllLanguageSettingsComponent') allLanguageSettingsComponent: AllLanguageSettingsComponent;
  @ViewChild('PartnerLanguageSettingsComponent') partnerLanguageSettingsComponent: PartnerLanguageSettingsComponent;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId;
  public partnerName;
  public rowData = [];
  public partnersRowData = [];
  public selectedNode;
  public statusName = ACTIVITY_STATUSES;
  public blockedData;
  public isCanNotSelect = true;
  public formGroup: UntypedFormGroup;

  constructor(private apiService: CoreApiService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getLanguages();
    this.formValues()
  }

  formValues() {
    this.formGroup = this.fb.group({
      State: [null, [Validators.required]],
      LanguageId: [null],
    })
  }

  getLanguages() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.LANGUAGE, Methods.GET_PARTNER_LANGUAGE_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = [...data.ResponseObject.languages];
          this.partnersRowData = [...data.ResponseObject.partnerLanguages];
          this.partnersRowData.forEach((entity) => {
            let selectionStatusName = this.statusName.find((stat) => {
              return stat.Id == entity.State;
            })
            if (selectionStatusName) {
              entity['StateName'] = selectionStatusName.Name;
            }
          })
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowClicked(params) {
    this.blockedData = params;
  }


  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.allLanguageSettingsComponent.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.allLanguageSettingsComponent.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.allLanguageSettingsComponent.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  addLanguageToPartner() {
    let selectedNodes = this.selectedNode;

    let selectedData = selectedNodes.map(node => node.data);
    this.formGroup.get('LanguageId').setValue(selectedData[0].Id);
    if (!this.formGroup.valid) {
      return;
    }
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.LANGUAGE, Methods.SAVE_PARTNER_LANGUAGE_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getLanguages();
          this.isCanNotSelect = true;
          this.selectedNode = null;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  editLanguageSetting(params) {
    this.apiService.apiPost(this.configService.getApiUrl, params, true,
      Controllers.LANGUAGE, Methods.SAVE_PARTNER_LANGUAGE_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getLanguages();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  async copyPartnerSettings() {
    const { CopySettingsComponent } = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

  handleValueEmitted(value: boolean) {
    this.isCanNotSelect = value;
  }

  selectedNodes(event) {
    this.selectedNode = event
  }

}
