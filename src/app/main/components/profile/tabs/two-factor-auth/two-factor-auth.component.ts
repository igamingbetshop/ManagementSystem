import { Component, OnInit } from '@angular/core';
import { CommonDataService, LocalStorageService } from 'src/app/core/services';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class TwoFactorAuthComponent implements OnInit {

  public userName;
  constructor(
    private activateRoute: ActivatedRoute,
    public commonDataService: CommonDataService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.userName = this.activateRoute.snapshot.params.user;
  }

  async onOpenQRPopup() {
    const { ApplicationSetupComponent } = await import('../../application-setup/application-setup.component');
    const dialogRef = this.dialog.open(ApplicationSetupComponent, {
      width: ModalSizes.MEDIUM,
      data: { UserName: this.userName }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.localStorageService.remove('isTwoFactorEnabled');
        this.localStorageService.add('isTwoFactorEnabled', 'true');
        this.router.navigate(['/main/profile/main']);
      }
    });
  }

}
