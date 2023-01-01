import axios from 'axios';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import Cookies, { parseCookies } from 'nookies';
import { ConversationApi } from './conversation';
import { MessageApi } from './message';
import { UserApi } from './user';

export type ApiReturnType = {
  user: ReturnType<typeof UserApi>;
  conversation: ReturnType<typeof ConversationApi>;
  message: ReturnType<typeof MessageApi>;
};

export const Api = (ctx?: NextPageContext | GetServerSidePropsContext): ApiReturnType => {
  const cookies = ctx ? Cookies.get(ctx) : parseCookies();
  const token = cookies.authToken;

  const instance = axios.create({
    baseURL: 'http://localhost:7777',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  const apis = {
    user: UserApi,
    conversation: ConversationApi,
    message: MessageApi,
  };

  return Object.entries(apis).reduce((prev, [key, f]) => {
    return {
      ...prev,
      [key]: f(instance),
    };
  }, {} as ApiReturnType);
};
