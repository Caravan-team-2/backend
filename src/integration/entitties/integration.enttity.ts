import { Entity } from 'typeorm';

@Entity()
export class Integration {
  id: string;
  serverUrl: string;
  //So our server can communicate with the parsing layer servers
  apiKey: string;
}
