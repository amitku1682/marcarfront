import '../styles/styles.scss';
import type { AppProps } from 'next/app';
import { AuthContextProvider } from '../context/authContext';
import { ThemeContextProvider } from '../context/themeContext';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import { ThemeProvider } from 'react-jss';
import { ToastProvider } from 'react-toast-notifications';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import { TourProvider } from '@reactour/tour';
import steps, { styles } from '../steps';
import Portal from '../layout/Portal/Portal';
import { ReactNotifications } from 'react-notifications-component';
import Wrapper from '../layout/Wrapper/Wrapper';
import { appWithTranslation } from 'next-i18next';
import App from '../layout/App/App';
import AsideRoutes from '../layout/Aside/AsideRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router'; // Import Next.js router

const MyApp = ({ Component, pageProps }: AppProps) => {
  getOS();

  // Get the current route using Next.js router
  const router = useRouter();

  // Define the routes where you want to hide the AsideRoutes component
  const routesToHideAside = ['/route1', '/route2']; // Add your route paths here

  // Check if the current route is in the list of routes to hide AsideRoutes
  const shouldHideAside = routesToHideAside.includes(router.pathname);

  /**
   * Dark Mode
   */
  const { themeStatus } = useDarkMode();
  const theme = {
    theme: themeStatus,
    primary: COLORS.PRIMARY.code,
    secondary: COLORS.SECONDARY.code,
    success: COLORS.SUCCESS.code,
    info: COLORS.INFO.code,
    warning: COLORS.WARNING.code,
    danger: COLORS.DANGER.code,
    dark: COLORS.DARK.code,
    light: COLORS.LIGHT.code,
  };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeContextProvider>
          <ThemeProvider theme={theme}>
            <ToastProvider components={{ ToastContainer, Toast }}>
              <TourProvider
                steps={steps}
                styles={styles}
                showNavigation={false}
                showBadge={false}
              >
                <App>
                  {router.pathname !== '/'   && <AsideRoutes />}
                  {/* <AsideRoutes /> */}
                  <Wrapper>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <Component {...pageProps} />
                  </Wrapper>
                </App>
                {/* <Portal id='portal-notification'>
                  <ReactNotifications />
                </Portal> */}
              </TourProvider>
            </ToastProvider>
          </ThemeProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default appWithTranslation(MyApp /*, nextI18NextConfig */);
