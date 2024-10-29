import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService } from "../../../../core/services";
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CoreSignalRService {
  public hubConnection: any;
  public connection: any;
  public connectionEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(private configService: ConfigService) {}

  init() {
    const url = this.configService.getApiUrl.slice(0, -8);

    this.hubConnection = $.hubConnection(url + '/apisignalr/baseHub', {
      useDefaultPath: true,
      transport: ['webSockets', 'serverSentEvents', 'longPolling'], // Order of transports matters
      clientProtocol: '1.5',
      connectionData: [] 
    });

    this.connection = this.hubConnection.createHubProxy('baseHub');
    this.hubConnection.logging = true;

    this.connection.on('eventName', (data: any) => {
      console.log('Received message from SignalR:', data);
    });

    this.startSocket(); 
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


    this.hubConnection.disconnected(() => {
      console.warn('SignalR connection closed. Attempting to reconnect...');
      setTimeout(() => {
        this.startSocket(); 
      }, 5000);
    });
  }

  stop() {
    if (this.hubConnection) {
      try {
        return this.hubConnection.stop();
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
    return Promise.resolve();
  }
}
