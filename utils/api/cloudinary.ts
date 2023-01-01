import { AxiosInstance } from 'axios';

export const Cloudinary = (instance: AxiosInstance) => ({
  async changeImage(imageFormData: any) {
    const data = await instance.post('/upload', imageFormData);

    return data;
  },
});
