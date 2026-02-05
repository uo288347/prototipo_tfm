import { Footer } from '@/components/shared/Footer';
import { InstructionsBanner } from '@/components/shared/InstructionsBanner';
import { ExperimentProvider } from "@/experiment/ExperimentContext";
import { clearCart } from '@/utils/UtilsCart';
import { clearFavorites } from '@/utils/UtilsFavorites';
import { clearLogin, isLoggedIn } from '@/utils/UtilsLogin';
import { task1, UtilsTasks } from '@/utils/UtilsTasks';
import { getTourSteps } from '@/utils/UtilsTour';
import { ConfigProvider as AntdConfigProvider, notification, Tour } from 'antd';
import { ConfigProvider as AntdMobileConfigProvider } from 'antd-mobile';
import 'antd-mobile/es/global';
import enUSMobile from 'antd-mobile/es/locales/en-US';
import esESMobile from 'antd-mobile/es/locales/es-ES';
import 'antd/dist/reset.css';
import enUSAntd from 'antd/locale/en_US';
import esESAntd from 'antd/locale/es_ES';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { COMPONENT_TOUR, getCurrentSceneId, registerComponent } from '../metrics/scriptTest';
import '../styles/output.css';
import { initNotification } from "../utils/UtilsNotifications";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const locale = router.locale || 'en';
    const [api, contextHolder] = notification.useNotification();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [openTour, setOpenTour] = useState(false);

    const bannerRef = useRef(null);

    // Seleccionar los locales de Ant Design según el idioma
    const antdLocale = locale === 'es' ? esESAntd : enUSAntd;
    const antdMobileLocale = locale === 'es' ? esESMobile : enUSMobile;

    // Personalizar los textos del Tour según el idioma
    const customLocale = {
        ...antdLocale,
        Tour: {
            Next: locale === 'es' ? 'Continuar' : 'Continue',
            Previous: locale === 'es' ? 'Atrás' : 'Back',
            Finish: locale === 'es' ? 'Finalizar' : 'Finish',
        },
    };

    useEffect(() => {
        initNotification(api);
        clearCart();
        clearFavorites();
        clearLogin();
        UtilsTasks.resetAllTasks();
    }, [api]);

    useEffect(() => {
        // Verificar si el usuario está logueado al cargar la app
        const loggedIn = isLoggedIn();
        setIsUserLoggedIn(loggedIn);

        if (loggedIn) {
            setTimeout(() => { setOpenTour(true); }, 500);
        }

        // Verificar periódicamente el estado del login
        const interval = setInterval(() => {
            const currentLoginState = isLoggedIn();
            const wasLoggedOut = !isUserLoggedIn;
            setIsUserLoggedIn(currentLoginState);

            // Si cambió de logged out a logged in, mostrar tour
            if (wasLoggedOut && currentLoginState) {
                setTimeout(() => {
                    setOpenTour(true);
                }, 500);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isUserLoggedIn]);

    const closeTour = () => {
        setOpenTour(false);
        task1();
    };

    const tourRef = useRef(false);
    useEffect(() => {
        console.log("[_app] Registering tour for metrics: ", tourRef.current);
        if (openTour) {
            const componentId = 'tour-instructions-banner';
            const tour = document.getElementById(componentId);
            if (!tour) {
                tourRef.current = false;
                return;
            }

            console.log("[_app] Registering tour for metrics: ", tour);
            const sceneId = getCurrentSceneId();
            if (sceneId === null || sceneId === undefined || tourRef.current) return;

            const rect = tour.getBoundingClientRect()
            const scrollX = window.scrollX || window.pageXOffset || 0;
            const scrollY = window.scrollY || window.pageYOffset || 0;
            registerComponent(sceneId, componentId,
                rect.left + scrollX,
                rect.top + scrollY,
                rect.right + scrollX,
                rect.bottom + scrollY,
                COMPONENT_TOUR, null);
        }
    }, []);

    return (
        <ExperimentProvider>
            <NextIntlClientProvider locale={locale} messages={pageProps.messages}>
                <AntdConfigProvider locale={customLocale}>
                    <AntdMobileConfigProvider locale={antdMobileLocale}>
                        {contextHolder}
                        <div style={{
                            minHeight: "100dvh",
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#fff"
                        }}>
                            {isUserLoggedIn && <InstructionsBanner ref={bannerRef} />}
                            <div style={{
                                flex: 1, display: "flex", minHeight: 0,
                                flexDirection: "column", padding: "0px 0px",
                                paddingTop: isUserLoggedIn ? "40px" : "0px",
                                overflow: "auto"
                            }}>
                                <Component {...pageProps} footer={<Footer />} />
                            </div>
                        </div>

                        <Tour
                            style={{ margin: "0 30px" }}
                            open={openTour}
                            onClose={closeTour}
                            steps={getTourSteps({ bannerRef, locale })}
                            id="tour-instructions-banner"
                            data-trackable-id="tour-instructions-banner"
                        />
                    </AntdMobileConfigProvider>
                </AntdConfigProvider>
            </NextIntlClientProvider>
        </ExperimentProvider>
    );
}

/*        </ExperimentProvider>
*/