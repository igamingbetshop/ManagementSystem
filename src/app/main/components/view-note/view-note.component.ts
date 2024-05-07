import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CoreApiService } from '../../platforms/core/services/core-api.service';
import { ConfigService } from '../../../core/services';
import { Controllers, Methods } from '../../../core/enums';
import { take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';

import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.scss'],
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
    MatTabsModule
  ],
})
export class ViewNoteComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  private objectId;
  private objectTypeId;
  public isEdit = false;
  public enableEditIndex;
  public viewNotes = [];
  public noteStates = [
    { Id: 1, Text: 'Active' },
    { Id: 2, Text: 'Deleted' }
  ];
  public stateText;
  public noteText;
  public editedNote;
  public oldNote;
  public addNotes = false;
  public noteTypes = [{ Id: 1, Name: 'Notes' }, { Id: 2, Name: 'Attentions' }];
  public noteType = 1;
  public addNoteType = 1;

  constructor(
    public dialogRef: MatDialogRef<ViewNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ObjectId: any, ObjectTypeId: any, Type: any },
    private apiService: CoreApiService,
    public configService: ConfigService,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.objectId = this.data.ObjectId;
    this.objectTypeId = this.data.ObjectTypeId;
    this.noteType = this.data.Type;
    this.formValues();
    this.getNotes();
  }

  getNotes(): void {
    const requestBody = {
      ObjectId: this.objectId,
      ObjectTypeId: this.objectTypeId,
      Type: this.noteType
    };

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.UTIL, Methods.GET_NOTES)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.viewNotes = data.ResponseObject;
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  editNote(note, index) {
    this.isEdit = true;
    this.enableEditIndex = index;
    this.stateText = note.State;
    this.noteText = note.Message;
    this.oldNote = note.Message;
  }

  saveEditedNote(note) {

    const editedNote = {
      Id: note.Id,
      ObjectId: note.ObjectId,
      ObjectTypeId: note.ObjectTypeId,
      isEditMode: true,
      State: this.stateText,
      Type: this.addNoteType,
      CreationTime: note.CreationTime,
      CreatorFirstName: note.CreatorFirstName,
      CreatorLastName: note.CreatorLastName,
      Message: this.noteText,
      LastUpdateTime: note.LastUpdateTime,
      oldMessage: this.oldNote,
      oldState: 1
    };
    this.apiService.apiPost(this.configService.getApiUrl, editedNote, true, Controllers.UTIL,
      Methods.SAVE_NOTE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.editedNote = data.ResponseObject;
          this.getNotes();
        }
      });
  }

  changeNoteType(typeId: number) {
    this.noteType = typeId;
    this.getNotes();
  }

  cancelEditedNote() {
    this.isEdit = false;
  }

  onChange(event) {
    this.stateText = +event.target.value;
  }

  formValues() {
    this.formGroup = this.fb.group({
      Id: [0],
      Message: [null, [Validators.required]],
      ObjectId: [this.objectId],
      ObjectTypeId: [this.objectTypeId],
      State: [1],
      Type: [1],
    });
  }

  addNote() {
    this.addNotes = true;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.UTIL,
      Methods.SAVE_NOTE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
