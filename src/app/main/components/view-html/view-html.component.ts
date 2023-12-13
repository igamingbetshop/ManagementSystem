import {CommonModule} from '@angular/common';
import {Component, Inject,  OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-view-html',
  templateUrl: './view-html.component.html',
  styleUrls: ['./view-html.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    MatDialogModule,
  ]
})
export class ViewHtmlComponent implements OnInit {
  public message: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string},
    public dialogRef: MatDialogRef<ViewHtmlComponent>,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.message = this.sanitizer.bypassSecurityTrustHtml(this.data.message);
  }

  close() {
    this.dialogRef.close();
  }
}


