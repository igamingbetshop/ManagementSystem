import {EventEmitter, Injectable} from '@angular/core';
import {ConfigService} from "../../../../core/services";
declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class CoreSignalRService {
  public hubConnection: any;
  public connection: any;
  public connectionEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private configService: ConfigService
  ) {}

  init() {
    const url = this.configService.getApiUrl.slice(0, -4);
    this.hubConnection = $.hubConnection(url + '/signalr/signalr', {
      useDefaultPath: false,
      transport: ['webSockets', 'serverSentEvents', 'longPolling']
    });

    this.connection = this.hubConnection.createHubProxy('baseHub');
    this.hubConnection.logging = true;
    this.startSocket();

    // Example of listening for an event from the SignalR hub
    this.connection.on('eventName', (data: any) => {
      console.log('Received message from SignalR:', data);
    });
  }

  startSocket() {
    this.hubConnection.start()
      .done(() => {
        console.log('Connected to SignalR successfully');
        this.connectionEmitter.emit(true);
      })
      .fail((error: any) => {
        console.error('Error starting SignalR connection:', error);
        this.connectionEmitter.emit(false);
      });
  }

  stop() {
    if (this.hubConnection) {
      this.hubConnection.stop();
      console.log('SignalR connection stopped');
    }
  }
}