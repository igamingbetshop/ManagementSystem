import {Component} from '@angular/core';
import {SidenavService} from '../../../core/services/sidenav.service';
import {onMainContentChange} from "../../../animations/animations";
import {LoaderService} from "../../../core/services";

@Component({
  selector: 'app-default-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations:[onMainContentChange]
})
export class MainComponent {
  public onSideNavChange: boolean = true;
  public loading = false;
  public showSideNav = false;


  constructor (
      private sidenavService: SidenavService,
      private loader: LoaderService
  ) {
    this.sidenavService.sideNavState$.subscribe(hasSideNav => {
      this.onSideNavChange = hasSideNav;
    });

    this.loader.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }

  closeSideNav() {
    this.showSideNav = !this.showSideNav;
  }
}
