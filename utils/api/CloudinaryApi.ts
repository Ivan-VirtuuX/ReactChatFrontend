import { Cloudinary } from './cloudinary';
import axios from 'axios';
import { GetServerSidePropsContext, NextPageContext } from 'next';

export type ApiReturnType = {
  cloudinary: ReturnType<typeof Cloudinary>;
};

export const CloudinaryApi = (ctx?: NextPageContext | GetServerSidePropsContext): ApiReturnType => {
  const instance = axios.create({
    baseURL: 'https://api.cloudinary.com/v1_1/virtuux/image',
  });

  const apis = {
    cloudinary: Cloudinary,
  };

  return Object.entries(apis).reduce((prev, [key, f]) => {
    return {
      ...prev,
      [key]: f(instance),
    };
  }, {} as ApiReturnType);
};
