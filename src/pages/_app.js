import { notification, ConfigProvider as AntdConfigProvider } from 'antd';
import esESAntd from 'antd/locale/es_ES';
import 'antd/dist/reset.css';
import 'antd-mobile/es/global';
import '../styles/output.css';
import { initNotification } from "../utils/UtilsNotifications";
import { useEffect } from 'react';
import { ConfigProvider as AntdMobileConfigProvider } from 'antd-mobile';
import esESMobile from 'antd-mobile/es/locales/es-ES';
import { clearCart } from '@/utils/UtilsCart';
import { clearFavorites } from '@/utils/UtilsFavorites';

export default function App({ Component, pageProps }) {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        initNotification(api);
        clearCart();
        clearFavorites();
    }, [api]);

    return (
        <AntdConfigProvider locale={esESAntd}>
            <AntdMobileConfigProvider locale={esESMobile}>
                {contextHolder}
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                    <div style={{ flex: 1, padding: "0px 0px" }}>
                        <Component {...pageProps} />
                    </div>
                    <footer style={{ textAlign: "center", padding: "16px" }}>
                        Teresa González - Universidad de Oviedo
                    </footer>
                </div>
            </AntdMobileConfigProvider>
        </AntdConfigProvider>
    );
}