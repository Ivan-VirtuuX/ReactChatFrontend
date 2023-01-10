export type LoginDto = {
  fullName: string;
  password: string;
};

export type CreateUserDto = {} & LoginDto;

export type ResponseUser = {
  id?: string;
  _id?: string;
  userId: string;
  avatarUrl: string;
  fullName: string;
  token?: string;
  createdAt?: string;
};

export type Conversation = {
  conversationId: string;
  sender: ResponseUser;
  receiver: ResponseUser;
};

export type Message = {
  messageId?: string;
  id?: string;
  conversationId: string;
  sender?: ResponseUser;
  text: string;
  createdAt?: string | Date;
};

export type ConversationDto = {
  receiver: string;
};
