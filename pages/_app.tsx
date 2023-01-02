import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { useRouter } from 'next/router';
import { wrapper } from '../redux/store';
import { Api } from '../utils/api';
import { setUserData } from '../redux/slices/user';
import { socket, SocketContext } from '../utils/context/SocketContext';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      {router.asPath !== '/' && <Header />}
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
      </SocketContext.Provider>
    </>
  );
}

App.getInitialProps = wrapper.getInitialAppProps((store) => async ({ ctx, Component }) => {
  try {
    const userData = await Api(ctx).user.getMe();

    store.dispatch(setUserData(userData));
  } catch (err) {
    console.warn(err);
  }

  return {
    pageProps: Component.getInitialProps ? await Component.getInitialProps({ ...ctx, store }) : {},
  };
});

export default wrapper.withRedux(App);
