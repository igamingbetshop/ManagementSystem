import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { AuthService, ConfigService } from "src/app/core/services";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
  ]

})
export class ViewImageComponent implements OnInit {
  @ViewChild('imageArea') imageArea: ElementRef;
  @ViewChild('image') image: ElementRef;

  public zoomNumber = 1;
  public isPanning = false;
  public startX = 0;
  public startY = 0;
  public translateX = 0;
  public translateY = 0;

  public fileUrl: SafeResourceUrl;
  public isImage: boolean;
  imgValue: any;
  value: any;

  constructor(
    public dialogRef: MatDialogRef<ViewImageComponent>,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { image: any },
    private _el: ElementRef) {
  }

  ngOnInit(): void {
    this.value = this.data.image;
    this.imgValue = this.configService.defaultOptions.WebApiUrl;
    const url = `${this.imgValue}/Statement/${this.value}/?token=${this.authService.token}`;
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isImage = (/\.(gif|jpe?g|png|webp|bmp)$/i).test(this.value);
  }

  increaseZoomNumber() {
    if (this.zoomNumber < 5) {
      this.zoomNumber += 1;
      this.applyTransform();
    }
  }

  decreaseZoomNumber() {
    if (this.zoomNumber > 1) {
      this.zoomNumber -= 1;
      this.applyTransform();
    }
  }

  applyTransform() {
    this.image.nativeElement.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoomNumber})`;
  }

  startPanning(event: MouseEvent) {
    if (this.zoomNumber > 1) {
      this.isPanning = true;
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
      this.image.nativeElement.style.cursor = 'grabbing';
    }
  }

  panImage(event: MouseEvent) {
    if (this.isPanning) {
      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;
      this.applyTransform();
    }
  }

  stopPanning() {
    this.isPanning = false;
    this.image.nativeElement.style.cursor = 'grab';
  }

}
