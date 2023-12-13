import {MatSnackBar} from "@angular/material/snack-bar";

export class SnackBarHelper {

  private static duration = 3000;

  static show(snackBar: MatSnackBar, snackbarData: ISnackbar) {
    this.openSnackBar(snackBar, snackbarData).catch(() => {});
  }

  static async openSnackBar(snackBar, snackbarData: ISnackbar): Promise<void> {
    const {CustomSnackBarComponent} = await import('../../main/components/custom-snackbar/custom-snackbar.component');
    snackBar.openFromComponent(CustomSnackBarComponent, {
      data: snackbarData,
      duration: this.duration,
      verticalPosition: "top"
    });
  }
}

export interface ISnackbar {
  Description: string;
  Type: string;
}
