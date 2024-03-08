import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";




@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule
  ],
})
export class ImagePopupComponent implements OnInit {

  imagePath = '';

  constructor(
    public dialogRef: MatDialogRef<ImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imagePath: string },
  ) { }

  ngOnInit() {
    this.imagePath = (this.data.imagePath);
  }


  close() {
    this.dialogRef.close();
  }
}
