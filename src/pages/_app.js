import { notification, Tour, ConfigProvider as AntdConfigProvider } from 'antd';
import { ExperimentProvider } from "@/experiment/ExperimentContext";
import esESAntd from 'antd/locale/es_ES';
import enUSAntd from 'antd/locale/en_US';
import 'antd/dist/reset.css';
import 'antd-mobile/es/global';
import '../styles/output.css';
import { initNotification } from "../utils/UtilsNotifications";
import { useEffect, useState, useRef } from 'react';
import { ConfigProvider as AntdMobileConfigProvider } from 'antd-mobile';
import esESMobile from 'antd-mobile/es/locales/es-ES';
import enUSMobile from 'antd-mobile/es/locales/en-US';
import { clearCart } from '@/utils/UtilsCart';
import { clearFavorites } from '@/utils/UtilsFavorites';
import { InstructionsBanner } from '@/components/shared/InstructionsBanner';
import { clearLogin, isLoggedIn } from '@/utils/UtilsLogin';
import { getTourSteps } from '@/utils/UtilsTour';
import { task1, UtilsTasks } from '@/utils/UtilsTasks';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { getCurrentSceneId, registerComponent, COMPONENT_TOUR} from '../metrics/scriptTest';

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
            setTimeout(() => {setOpenTour(true);}, 500);
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
        task1();
        setOpenTour(false); 
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
            <NextIntlClientProvider locale={locale} messages={pageProps.messages}>
                <AntdConfigProvider locale={customLocale}>
                    <AntdMobileConfigProvider locale={antdMobileLocale}>
                        {contextHolder}
                        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                            <div style={{ flex: 1, display: "flex", minHeight: 0,
                            flexDirection: "column", padding: "0px 0px", paddingTop: isUserLoggedIn ? "40px" : "0px", overflow: "auto"}}>
                                {isUserLoggedIn && <InstructionsBanner ref={bannerRef}/>}
                                <Component {...pageProps} />
                            </div>
                            <footer style={{ textAlign: "center", padding: "16px" }}>
                                Universidad de Oviedo
                            </footer>
                        </div>

                        <Tour 
                            style={{margin: "0 30px"}}
                            open={openTour} 
                            onClose={closeTour} 
                            steps={getTourSteps({bannerRef, locale})}
                            id = "tour-instructions-banner"
                            data-trackable-id="tour-instructions-banner"
                        />
                    </AntdMobileConfigProvider>
                </AntdConfigProvider>
            </NextIntlClientProvider>
    );
}

/*        </ExperimentProvider>
*/