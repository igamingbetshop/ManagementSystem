import {inject, Injectable} from '@angular/core';
import {AuthService, ConfigService} from "../../../../core/services";
import {CoreApiService} from "./core-api.service";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({providedIn: 'any'})

export class ExportService {

  #apiService = inject(CoreApiService);
  #configService = inject(ConfigService);
  #snackBar = inject(MatSnackBar);
  #authService = inject(AuthService);

  exportToCsv(controller:string, method:string, data?:any)
  {
    this.#apiService.apiPost(this.#configService.getApiUrl, data, true,
      controller, method).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let iframe = document.createElement('iframe');
        iframe.setAttribute('src', `${this.#configService.defaultOptions.WebApiUrl}/Statement/${data.ResponseObject.ExportedFilePath}/?token=${this.#authService.token}`);
        iframe.setAttribute('style', 'display: none');
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this.#snackBar, { Description: data.Description, Type: 'error' });
      }
    });
  }
}
