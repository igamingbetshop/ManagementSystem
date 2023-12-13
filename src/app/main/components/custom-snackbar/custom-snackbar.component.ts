import { CommonModule } from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {ISnackbar} from "../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],

})
export class CustomSnackBarComponent implements OnInit {

  public description: string;
  public type: string;

  constructor(
    public snackBarRef: MatSnackBarRef<CustomSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ISnackbar
  ) {
    this.description = data.Description;
    this.type = data.Type;
  }

  ngOnInit() {}

  public closeSnackBar(): void {
    this.snackBarRef.dismiss();
  }
}
