import React, { FC, useState } from 'react';
import { Button } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { setCookie } from 'nookies';
import { Alert } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '../../redux/hooks';
import { LoginDto } from '../../utils/api/types';
import { LoginFormSchema } from '../../utils/validations';
import { Api } from '../../utils/api';
import { FormField } from '../FormField';
import { setUserData } from '../../redux/slices/user';
import styles from './LoginForm.module.scss';
import { useRouter } from 'next/router';

interface LoginFormProps {
  onOpenRegister: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onOpenRegister }) => {
  const dispatch = useAppDispatch();

  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(LoginFormSchema),
  });

  const onSubmit = async (dto: LoginDto) => {
    try {
      const data = await Api().user.login(dto);

      setCookie(null, 'authToken', data.token, {
        maxAge: 30 * 24 * 60,
        path: '/',
      });
      setErrorMessage('');

      dispatch(setUserData(data));

      router.push('/conversations');
    } catch (err) {
      console.warn('Auth error', err);

      if (err.response) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  return (
    <div className={styles.rightSide}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p style={{ fontSize: 74, textAlign: 'center' }}>Авторизация</p>
          {errorMessage && (
            <Alert
              severity="error"
              style={{
                marginBottom: 25,
                marginTop: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 17,
                height: 50,
              }}>
              {errorMessage}
            </Alert>
          )}
          <FormField name="fullName" label="Логин" />
          <FormField name="password" label="Пароль" />
          <div className={styles.formActions}>
            <Button onClick={onOpenRegister}>Регистрация</Button>
            <Button disabled={!form.formState.isValid || form.formState.isSubmitting} type="submit">
              Войти
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
