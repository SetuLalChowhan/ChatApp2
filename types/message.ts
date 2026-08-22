export interface MessageSender {
  _id: string;
  name: string;
  phone?: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: string | MessageSender;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  text: string;
}

export interface MessageHistoryResponse {
  messages: Message[];
  hasMore: boolean;
}
