import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useAppSelector } from '../redux/hooks';
import { selectUserData } from '../redux/slices/user';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const router = useRouter();

  const userData = useAppSelector(selectUserData);

  useEffect(() => {
    userData && router.push('/conversations');
  }, []);

  return (
    <>
      <Head>
        <title>React Chat</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <p>Добро пожаловать в</p>
          <p>ReactChat</p>
        </div>
        {formType === 'login' && <LoginForm onOpenRegister={() => setFormType('register')} />}
        {formType === 'register' && (
          <RegisterForm
            onOpenRegister={() => setFormType('register')}
            onOpenLogin={() => setFormType('login')}
          />
        )}
      </div>
    </>
  );
};

export default Home;
