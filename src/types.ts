export enum Sender {
  USER = 'user',
  TOLA = 'tola',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface TolaResponse {
  messages: string[];
}
