import * as yup from 'yup';

export const LoginFormSchema = yup.object().shape({
  fullName: yup.string().required('Введите логин').max(10, 'Длина логина больше 10 символов'),
  password: yup.string().required('Введите пароль').min(6, 'Длина пароля менее 6 символов'),
});

export const RegisterFormSchema = yup
  .object()
  .shape({
    secondPassword: yup
      .string()
      .required('Введите пароль')
      .min(6, 'Длина пароля менее 6 символов')
      .oneOf([yup.ref('password')], 'Пароли не совпадают'),
  })
  .concat(LoginFormSchema);
