import {onSideNavChange, animateText} from '../../../animations/animations';
import {CommonDataService, SidenavService} from '../../../core/services';
import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [onSideNavChange, animateText],
})
export class LeftMenuComponent {
  public sideNavState = false;
  public linkText = false;
  public homeSections =  JSON.parse(localStorage.getItem('adminMenu'));

  constructor(
    private _sidenavService: SidenavService,
    public commonDataService: CommonDataService,
  ) {
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 300);
  }

}
