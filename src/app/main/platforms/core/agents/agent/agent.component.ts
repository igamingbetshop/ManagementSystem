import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouteTabItem} from "../../../../../core/interfaces";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CoreApiService} from "../../services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Controllers, Methods} from "../../../../../core/enums";
import {filter, take} from "rxjs";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent implements OnInit {
  tabs: RouteTabItem[] = [
    {
      label: 'Agents.MainInfo',
      route: 'main'
    },
    {
      label: 'Agents.Corrections',
      route: 'corrections'
    },
    {
      label: 'Agents.Employees',
      route: 'employees'
    },
    {
      label: 'Agents.Downline',
      route: 'downline'
    },
    {
      label: 'Agents.CommissionPlan',
      route: 'commission-plan'
    },
    {
      label: 'Agents.Clients',
      route: 'clients'
    },
    {
      label: 'Agents.Settings',
      route: 'user-settings'
    }
  ];
  backupTabs: any[] = [];
  selectedTab;
  userId: number;
  partnerId: number;
  agentIds;
  agentIdArray: { Id: string, LevelName: string, UserName: string }[];
  level: any;
  agentLevelId;
  agentLevelName;
  agentUserName;
  agentsLevelsEnums: any;
  innerAgentLevelName;
  currentRoute: string;
  showDatas = false;
  agentLevel: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public translate: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.backupTabs = [...this.tabs];
  }

  ngOnInit() {
    // localStorage.removeItem('agentData');
    this.setupAgentIds();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setupAgentIds();
      let agent = this.agentIds.split(',');
      if (agent.length < this.agentIdArray.length) {
        this.agentIdArray.splice(-1, 1);
        localStorage.setItem('agentData', JSON.stringify(this.agentIdArray));
      } else if (agent?.length === this.agentIdArray.length) {
        localStorage.setItem('agentData', JSON.stringify(this.agentIdArray));
      }
      this.getUser();
      history.replaceState({selectedTab: this.selectedTab}, '');
      if (!this.router.url.includes('/agents/agent')) {
        localStorage.removeItem('agentData');
        this.agentIdArray = [];
        this.activateRoute.snapshot.queryParams = {};
      }
    });
    const currentUrl = this.router.url;
    const urlBeforeQuestionMark = currentUrl.split('?')[0];
    const segments = urlBeforeQuestionMark.split('/');
    this.currentRoute = segments[segments.length - 1];
    this.selectedTab = this.getLabelForRoute(this.currentRoute);
    this.userId = this.activateRoute.snapshot.queryParams.agentIds;
    // this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    // this.agentLevelId = +this.activateRoute.snapshot.queryParams.levelId;
    this.getUser();
    this.getAgentLevelsEnum();
    this.getUserForLevels();
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.selectedTab) {
        this.selectedTab = event.state.selectedTab;
      }
    });
  }

  private setupAgentIds() {
    let queryParams = this.activateRoute.snapshot.queryParams;
    if (queryParams && queryParams.agentIds) {
      this.agentIds = queryParams.agentIds;
      this.userId = this.agentIds.split(',')[0];
      let agent = this.agentIds.split(',');
      if (agent.length > 1) {
        const indexToRemove = this.tabs.findIndex(tab => tab.label === 'Agents.Corrections');
        if (indexToRemove !== -1) {
          this.tabs.splice(indexToRemove, 1);
        }
      } else {
        this.tabs = this.backupTabs.slice();
      }
      const agentData = localStorage.getItem('agentData');
      if (agentData) {
        this.agentIdArray = JSON.parse(agentData);
        if (this.agentIdArray.some(agent => !agent.LevelName)) {
          this.getUserForLevels();
        }
      } else {
        this.agentIdArray = this.agentIds.split(',').map(id => ({Id: id}));
      }
      this.showDatas = true;
    } else {
      this.agentIds = queryParams.agentIds;
      this.userId = this.agentIds.split(',')[0];
      let agent = this.agentIds.split(',');
      if (agent.length > 1) {
        const indexToRemove = this.tabs.findIndex(tab => tab.label === 'Agents.Corrections');
        if (indexToRemove !== -1) {
          this.tabs.splice(indexToRemove, 1);
        }
      } else {
        this.tabs = this.backupTabs.slice();
      }
      if (this.agentIds) {
        // this.agentIdArray = this.agentIds.split(',').map(id => ({Id: id}));
        const agentData = localStorage.getItem('agentData');
        if (agentData) {
          this.agentIdArray = JSON.parse(agentData);
          // if (this.agentIdArray.some(agent => !agent.LevelName)) {
          //   this.getUserForLevels();
          // }
        } else {
          this.agentIdArray = this.agentIds.split(',').map(id => ({Id: id}));
        }
      }
    }
  }


  getLabelForRoute(route: string): string {
    const matchingTab = this.tabs.find(tab => tab.route === route);
    return matchingTab ? matchingTab.label : '';
  }

  selectedTabItem(rla) {
    this.selectedTab = rla.label;
  }

  getUser() {
    let requestObject;
    if (this.agentIds) {
      let agentIdArray = this.agentIds.split(',');
      let lastAgentId = agentIdArray[agentIdArray.length - 1];
      requestObject = lastAgentId;
    } else {
      requestObject = this.userId;
    }
    this.apiService.apiPost(this.configService.getApiUrl, requestObject,
      true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const agent = data.ResponseObject;
        this.level = agent?.['Level'];
        this.agentLevelId = agent?.['Level'];
        this.agentUserName = agent?.['UserName'];
        this.agentLevelName = this.getLevelNameById(this.agentLevelId);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  getUserForLevels() {
    // if (this.agentIdArray && this.agentIdArray.length > 1) {
    if (this.agentIdArray) {
      this.agentIdArray.forEach(agent => {
        const agentId = agent.Id;
        this.apiService.apiPost(this.configService.getApiUrl, agentId,
          true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const levelId = data.ResponseObject?.Level;
            const levelName = this.getLevelNameById(levelId);
            agent.LevelName = levelName;
            agent.UserName = data.ResponseObject?.UserName;
            localStorage.setItem('agentData', JSON.stringify(this.agentIdArray));
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      });
    }
  }

  getLevelNameById(levelId: string): string {
    const level = this.agentsLevelsEnums?.find(level => level?.Id === levelId);
    return level ? '(' + level?.Name + ')' : '';
  }

  setAgentLevel() {
    this.agentLevel = this.agentsLevelsEnums?.find((level: any) => level.Id == this.level)?.Name;
  }

  private getAgentLevelsEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId, true, Controllers.ENUMERATION, Methods.GET_AGENT_LEVELS_ENUM)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.agentsLevelsEnums = data.ResponseObject;
        this.agentLevelName = `(${this.agentsLevelsEnums.find(agent => agent.Id === this.agentLevelId)?.Name})`;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  handleIdClick(id: string, index) {
    const queryParams = {...this.activateRoute.snapshot.queryParams};

    if (queryParams.agentIds) {
      const agentIds = queryParams.agentIds.split(',');
      const idIndex = agentIds.indexOf(id);
      if (idIndex !== -1) {
        const newAgentIds = agentIds.slice(0, idIndex + 1);
        queryParams.agentIds = newAgentIds.join(',');
        const storedData = localStorage.getItem('agentData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const newData = parsedData.slice(0, index + 1);
          localStorage.setItem('agentData', JSON.stringify(newData));

          this.agentIdArray = newData.map(entry => ({ LevelName: entry.LevelName, UserName: entry.UserName }));
        }
      }
    } else {
      queryParams.agentIds = id;
    }
    let downline = 'downline';
    this.router.navigate(['/main/platform/agents/agent/' + downline], {queryParams});
    this.selectedTab = downline;
  }

  resetClickItem() {
    localStorage.removeItem('agentData')
    const firstId = this.agentIds.includes(',') ? this.agentIds.split(',')[0] : this.agentIds;
    const queryParams = {
      agentIds: firstId
    };
    let downline = 'downline';
    this.router.navigate(['/main/platform/agents/agent/' + downline], {queryParams});
    this.selectedTab = downline;
  }

}
