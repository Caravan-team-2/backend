import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
  handleConnection(client: any, ...args: any[]) {
  
    //TODO: implement auth here
    console.log('Client connected:', client.id);
  }

  extractUserFromSocket(socket: any): any {
    // Implement your logic to extract user information from the socket
    return socket.user;
  }
}
