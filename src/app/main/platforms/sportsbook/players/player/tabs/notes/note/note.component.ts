import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "../../../../../../../../core/services";
import { take } from "rxjs/operators";
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public sentData;
  public isEdit = false;
  public noteText;
  public stateText;
  public enableEditIndex;
  public noteStates = [
    { Id: 1, Text: 'Active' },
    { Id: 2, Text: 'Deleted' }
  ];
  public editedNote;

  constructor(public dialogRef: MatDialogRef<NoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sentData: any },
    private apiService: SportsbookApiService,
    public configService: ConfigService) {
  }

  ngOnInit(): void {
    this.sentData = this.data.sentData;
    this.noteText = this.data.sentData.Message;
    this.stateText = this.data.sentData.State;
  }

  editNote() {
    this.isEdit = true;
  }

  close() {
    this.dialogRef.close();
  }

  onChange(event) {
    this.stateText = +event.target.value;
  }

  submitNote() {
    let editedNote = {
      Id: this.sentData.Id,
      ObjectId: this.sentData.ObjectId,
      ObjectTypeId: this.sentData.ObjectTypeId,
      isEditMode: true,
      State: this.stateText,
      Type: this.sentData.Type,
      CreationTime: this.sentData.CreationTime,
      CreatorFirstName: this.sentData.CreatorFirstName,
      CreatorLastName: this.sentData.CreatorLastName,
      Message: this.noteText,
      LastUpdateTime: this.sentData.LastUpdateTime,
    }
    this.apiService.apiPost('players/updatenote', editedNote).pipe(take(1)).pipe(take(1)).subscribe((data) => {

              if (data.Code === 0) {
          this.isEdit = false;
          this.editedNote = data.ResponseObject;
          this.dialogRef.close(data.ResponseObject);
        }
      });
  }

}
