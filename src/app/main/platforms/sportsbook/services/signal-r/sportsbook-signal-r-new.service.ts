import {Injectable, Injector} from '@angular/core';
import {ConfigService} from "../../../../../core/services";
import * as signalR from "@microsoft/signalr";
import {SportsbookSignalRService} from "./sportsbook-signal-r.service";


@Injectable()
export class SportsbookSignalRNewService extends SportsbookSignalRService {

  constructor(
    public configService: ConfigService
  ) {
    super();
  }

  init() {
    const url = `${this.configService.getSBApiUrl}/` + 'api/signalr/reporthub';
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(url)
      .withAutomaticReconnect()
      .build();
    this.startSocket();
  }

  private startSocket() {
    this.connection.start()
      .then(() => {
        console.log("connection start");
      })
      .catch((err) => {
        console.error(err.toString());
      });
  }

  stop() {
    this.connection.stop();
  }

}
