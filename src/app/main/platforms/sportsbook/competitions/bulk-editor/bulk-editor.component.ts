import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";

import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

import {ModalSizes, ObjectTypes} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {Paging} from "../../../../../core/models";

@Component({
  selector: 'bulk-editor',
  templateUrl: './bulk-editor.component.html',
  styleUrls: ['./bulk-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class BulkEditorComponent implements OnInit {
  @Input() bulkMenuTrigger: any;
  @Input() filterData: Paging;
  public formGroup: UntypedFormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.formGroup = this.fb.group({
      StateSpecified: [null],
      State: [null],
      CategorySpecified: [null],
      CategoryId: [null],
    });
  }

  onCancelBtn() {
    this.bulkMenuTrigger.closeMenu();
  }

  async openConfirmDialog() {

    let bulkUpdateRequest = this.formGroup.getRawValue();
    bulkUpdateRequest = {...bulkUpdateRequest, ...this.filterData};

    const {ConfirmComponent} = await import('./confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: ModalSizes.MIDDLE,
      data : bulkUpdateRequest
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.bulkMenuTrigger.closeMenu();
      }
    })
  }

}
