import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ModalSizes } from "../../../core/enums";
import { take } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { SportsbookApiService } from '../../platforms/sportsbook/services/sportsbook-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-note',
  templateUrl: './sb-view-note.component.html',
  styleUrls: ['./sb-view-note.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class SbViewNoteComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  BetId: number;
  CommentTypes: any[] = [];
  allCommentTypes: any[] = [];

  public viewNotes = [];

  constructor(public dialogRef: MatDialogRef<SbViewNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { CommentTypes: any, BetId: any },
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.BetId = this.data.BetId;
    this.CommentTypes = this.data.CommentTypes;
    this.allCommentTypes = this.data.CommentTypes.filter((type) => {
      return type.Kind == 1
    });

    this.getNotes();
  }

  getNotes() {
    this.apiService.apiPost('commenttypes/getbetcomments', { BetId: this.BetId, TypeId: 0, Comment: '' },
    ).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.viewNotes = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });

  }

  close() {
    this.dialogRef.close();
  }


  async addNote() {
    this.close();
    const { SbAddNoteComponent } = await import('../sb-add-note/sb-add-note.component');
    const dialogRef = this.dialog.open(SbAddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { CommentTypes: this.CommentTypes, BetId: this.BetId }
    });

  }

}
