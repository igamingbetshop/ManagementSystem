import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { ModalSizes } from "../../../../../core/enums";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { Paging } from "../../../../../core/models";
import { CommonDataService } from 'src/app/core/services';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class BulkEditorComponent implements OnInit {
  @Input() bulkMenuTrigger: any;
  @Input() filterData: Paging;
  partners;
  public formGroup: UntypedFormGroup;

  constructor(
    private dialog: MatDialog,
    private commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
    this.partners = this.commonDataService.partners;
  }

  private createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null],
      StateSpecified: [null],
      State: [null],
      CategorySpecified: [null],
      CategoryId: [null],
      TemplateId: [null],
    });
  }

  onCancelBtn() {
    this.bulkMenuTrigger.closeMenu();
  }

  async openConfirmDialog() {
    let bulkUpdateRequest = this.formGroup.getRawValue();
    bulkUpdateRequest = { ...bulkUpdateRequest, ...this.filterData };
    bulkUpdateRequest.PartnerId = this.formGroup.get('PartnerId').value;
   
    const { ConfirmComponent } = await import('./confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: ModalSizes.MIDDLE,
      data: bulkUpdateRequest
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.bulkMenuTrigger.closeMenu();
      }
    });
  }
}
