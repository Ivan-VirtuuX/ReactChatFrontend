import React, { FC, useState } from 'react';
import { Button } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { setCookie } from 'nookies';
import { Alert } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '../../redux/hooks';
import { Api } from '../../utils/api';
import { FormField } from '../FormField';
import { setUserData } from '../../redux/slices/user';
import { CreateUserDto } from '../../utils/api/types';
import { RegisterFormSchema } from '../../utils/validations';
import styles from './RegisterForm.module.scss';
import router from 'next/router';

interface RegisterFormProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onOpenRegister, onOpenLogin }) => {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(RegisterFormSchema),
  });

  const onSubmit = async (dto: CreateUserDto) => {
    try {
      const data = await Api().user.register(dto);

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
          <p style={{ fontSize: 78, textAlign: 'center' }}>Регистрация</p>
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
          <FormField name="secondPassword" label="Повторите пароль" />
          <div className={styles.formActions}>
            <Button onClick={onOpenLogin}>Войти</Button>
            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              onClick={onOpenRegister}
              type="submit">
              Создать аккаунт
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
