import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService, ConfigService, LocalStorageService } from "../../core/services";
import { TranslateService } from "@ngx-translate/core";
import { AutofillMonitor } from "@angular/cdk/text-field";
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ModalSizes } from 'src/app/core/enums';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements AfterViewInit {

  @ViewChild('user') user: ElementRef;

  defaultValue = 'en';
  errorMessage: string;
  changePassword: any;
  languages: any[];
  loginForm: UntypedFormGroup;
  imagePath: string = '';
  firstDisabled: boolean = false;
  ignoreAutofill = true;
  isSendingReqest = false;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private autofill: AutofillMonitor
  ) {
  }

  ngOnInit() {
    this.languages = this.configService.langList;
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      LanguageId: ['en', Validators.required]
    });
    this.loginForm.valueChanges.subscribe(data => {
      this.ignoreAutofill = true;
      this.errorMessage = '';
    });

    this.authService.notifyGetUserLoginSucces.subscribe(resp => {
      this.localStorageService.add('user', resp);
      this.localStorageService.add('token', resp.Token);
      this.localStorageService.add('isTwoFactorEnabled', resp.IsTwoFactorEnabled);
      if (resp.RequiredParameters?.ResetPassword) {
        this.openChangePasswordComp();
      }
      else if (!!resp.IsTwoFactorEnabled) {
        this.onOpenToTwoFactorConfirm(resp.UserId);
      }
      else {
        this.router.navigate(['/']);
      }
    });
    this.authService.notifyGetUserLoginError.subscribe(value => {
      this.errorMessage = value;
      this.isSendingReqest = false;
    });

    this.setLogoByDomain();
  }

  async onOpenToTwoFactorConfirm(_id) {
    const { TwoFactorConfirm } = await import('../../main/components/profile/two-factor-confirm/two-factor-confirm.component');
    const dialogRef = this.dialog.open(TwoFactorConfirm, {
      width: ModalSizes.MEDIUM,
      data: { isDisable: false, id: _id }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.router.navigate(['/']);
      }
    });
  }

  ngAfterViewInit() {
    this.autofill.monitor(this.user).subscribe(event => {
      if (event.isAutofilled) {
        this.ignoreAutofill = false;
      }
    }
    );
  }

  setLogoByDomain(): void {
    const imagePath = "assets/images/" + window.location.hostname + "/login-logo.svg";
    let image = new Image();
    image.onload = () => {
      this.imagePath = imagePath;
    };
    image.onerror = () => {
      this.imagePath = 'assets/images/login-logo.svg';
    };
    image.src = imagePath;
  }

  changeLanguage(language: string): void {
    this.localStorageService.addLanguage('lang', language);
    this.translate.use(language);
  }

  hasError(fieldName: string) {
    return this.loginForm.get(fieldName).hasError('required') && this.loginForm.get(fieldName).touched;
  }

  async openChangePasswordComp() {
    const { ChangePasswordComponent } = await import("../change-password/change.password.component");
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: ModalSizes.LARGE,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
    })
  }

  get disabledButton() {
    if (!this.ignoreAutofill) {
      return false;
    }
    return this.loginForm.invalid;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSendingReqest = true;
      this.authService.logIn(this.loginForm.getRawValue());
    }
  }
  addBorder(wrap: HTMLElement) {
    wrap.classList.add('bordered');
  }

}
