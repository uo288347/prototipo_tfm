import { notification, Tour, ConfigProvider as AntdConfigProvider } from 'antd';
import esESAntd from 'antd/locale/es_ES';
import 'antd/dist/reset.css';
import 'antd-mobile/es/global';
import '../styles/output.css';
import { initNotification } from "../utils/UtilsNotifications";
import { useEffect, useState, useRef } from 'react';
import { ConfigProvider as AntdMobileConfigProvider } from 'antd-mobile';
import esESMobile from 'antd-mobile/es/locales/es-ES';
import { clearCart } from '@/utils/UtilsCart';
import { clearFavorites } from '@/utils/UtilsFavorites';
import { InstructionsBanner } from '@/components/shared/InstructionsBanner';
import { clearLogin, isLoggedIn } from '@/utils/UtilsLogin';
import { getTourSteps } from '@/utils/UtilsTour';
import { task1, UtilsTasks } from '@/utils/UtilsTasks';

// Personalizar los textos del Tour
const customLocale = {
    ...esESAntd,
    Tour: {
        Next: 'Continue',
        Previous: 'Back',
        Finish: 'Finish',
    },
};

export default function App({ Component, pageProps }) {
    const [api, contextHolder] = notification.useNotification();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [openTour, setOpenTour] = useState(false);

    const bannerRef = useRef(null);
    
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

    return (
        <AntdConfigProvider locale={customLocale}>
            <AntdMobileConfigProvider locale={esESMobile}>
                {contextHolder}
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                    <div style={{ flex: 1, padding: "0px 0px" }}>
                        {isUserLoggedIn && <InstructionsBanner ref={bannerRef}/>}
                        <Component {...pageProps} />
                    </div>
                    <footer style={{ textAlign: "center", padding: "16px" }}>
                        Teresa González - Universidad de Oviedo
                    </footer>
                </div>

                <Tour 
                    style={{margin: "0 30px"}}
                    open={openTour} 
                    onClose={closeTour} 
                    steps={getTourSteps({bannerRef})}
                />
            </AntdMobileConfigProvider>
        </AntdConfigProvider>
    );
}