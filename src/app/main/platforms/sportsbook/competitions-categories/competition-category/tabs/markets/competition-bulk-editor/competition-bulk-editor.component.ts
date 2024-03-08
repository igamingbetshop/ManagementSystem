import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ModalSizes } from 'src/app/core/enums';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'competition-bulk-editor',
  templateUrl: './competition-bulk-editor.component.html',
  styleUrls: ['./competition-bulk-editor.component.scss'],
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
export class CompetitionBulkEditorComponent implements OnInit {
  @Input() bulkMenuTrigger: any;
  @Input() ids: any;
  @Input() competitionCategoryId: any;
  @Input() path: string;
  @Input() competitionId: any;
  @Input() partnerId: any;
  @Input() matchId: any;
  @Output() afterClosed: EventEmitter<void> = new EventEmitter<void>();

  public formGroup: UntypedFormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      PartnerId: [null],
      CompetitionCategoryId: [null],
      CompetitionId: [null],
      MatchId: [null],
      Entities: [[]],
      AbsoluteProfitRange1: [null],
      AbsoluteProfitRange2: [null],
      AbsoluteProfitRange3: [null],
      AbsoluteProfitLive: [null],
      RelativeLimitRange1: [null],
      RelativeLimitRange2: [null],
      RelativeLimitRange3: [null],
      RelativeLimitLive: [null],
    });
  }

  ngOnInit() {
    this.formGroup.get('Entities').setValue(this.ids);
    if(this.competitionId) {
      this.formGroup.get('CompetitionId').setValue(this.competitionId);
    }
    if(this.competitionCategoryId) {
      this.formGroup.get('CompetitionCategoryId').setValue(this.competitionCategoryId);
    }

    if(this.partnerId) {
      this.formGroup.get('PartnerId').setValue(this.partnerId);
    }

    if(this.matchId) {
      this.formGroup.get('MatchId').setValue(this.matchId);
    }
  }



  onCancelBtn() {
    this.bulkMenuTrigger.closeMenu();
  }

  async openConfirmDialog() {
    const { ConfirmComponent } = await import('../../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.onSubmit();
      }
    })
  }

  onSubmit() {
    const formValues = this.formGroup.value;
    this.apiService
    .apiPost(this.path, formValues)
    .pipe(take(1))
    .subscribe((data) => {
      if (data.Code === 0) {
        this.bulkMenuTrigger.closeMenu();
        this.afterClosed.emit();
      } else {
        SnackBarHelper.show(this._snackBar, {
          Description: data.Description,
          Type: "error",
        });
      }
    });
  }

}
