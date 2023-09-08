import 'raf/polyfill';
import 'setimmediate';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
