import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SkillGamesApiService} from "../../../../../services/skill-games-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-edit-menu',
  templateUrl: './add-edit-menu.component.html',
  styleUrls: ['./add-edit-menu.component.scss']
})
export class AddEditMenuComponent implements OnInit {
  public action;
  public partnerId;
  public menuItem;
  public formGroup: UntypedFormGroup;
  public validDocumentSize;
  public validDocumentFormat;
  public checkDocumentSize;
  public iconChanging;
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<AddEditMenuComponent>,
              public apiService: SkillGamesApiService,
              private _snackBar: MatSnackBar,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.action = this.data.action;
    this.menuItem = this.data;
    this.formValues();
  }

  private formValues() {
    if (this.action === 'Add') {
      this.formGroup = this.fb.group({
        Title: [null],
        Type: [''],
        Icon: [''],
        Href: [""],
        Order: [null],
        OpenInRouting: [false],
        MenuId: [this.menuItem.MenuId],
        Orientation: [false],
        Image: [null],
      })
    } else if (this.action === 'Edit') {
      this.formGroup = this.fb.group({
        Id: [this.menuItem.Id],
        Title: [this.menuItem.Title],
        Type: [this.menuItem.Type],
        Icon: [this.menuItem.Icon],
        Href: [this.menuItem.Href],
        Order: [this.menuItem.Order],
        OpenInRouting: [this.menuItem.OpenInRouting],
        MenuId: [this.menuItem.MenuId],
        Orientation: [this.menuItem.Orientation],
        Image: [null],
      })
    }
  }

  submit() {
    this.isSendingReqest = true;
    const value = this.formGroup.getRawValue();
    this.apiService.apiPost('cms/savewebsitemenuitem', value)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
      });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }


}
