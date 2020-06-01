import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({namespace: '/chat'})
export class ChatGateway implements OnGatewayInit  {
  @WebSocketServer() wss: Server;
  
  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    this.logger.log('Inicializacion');
  }
  
  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: {sender: string, room:string, message: string}) {
    this.wss.to(message.room).emit('chatToClient', message);
  }
  
  @SubscribeMessage('joinRoom')
  hadleJoinRoom(client: Socket, room: string){
    client.join(room);
    client.emit('joinedRoom',room);
  }
  
  
  @SubscribeMessage('leaveRoom')
  hadleLeaveRoom(client: Socket, room: string){
    client.leave(room);
    client.emit('leftRoom',room);
  }
}
