import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'http';

@WebSocketGateway(3001, { path: '/websockets', serveClient: true, namespace: '/'})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger(`AppGateway`);

  
  afterInit(server: Server) {
    this.logger.log(`Inicializado`);
  }
  
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
     this.logger.log(`Cliente conectado ${client.id}`);
  }
  
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string):void {
    this.wss.emit('msgToClient', text);
    // return {event: 'msgToClient', data: text};
  }
}
