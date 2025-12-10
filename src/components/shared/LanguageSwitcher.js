import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useRouter } from "next/router";
import useGestureDetector from "@/metrics/GestureDetectorHook";

export const LanguageSwitcher = () => {
    const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel } = useGestureDetector();

    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const changeLanguage = (newLocale) => {
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    const items = [
        {
            key: 'en',
            label: <span
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
            >English</span>,
            onClick: () => changeLanguage('en'),
        },
        {
            key: 'es',
            label: <span
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
            >Español</span>,
            onClick: () => changeLanguage('es'),
        },
    ];

    // TODO registrar eventos de gestos en los elementos del menú desplegable
    return (
        <Dropdown
            menu={{ items, selectedKeys: [locale] }} placement="bottomRight">
            <Button
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                icon={<GlobalOutlined />} type="text">
                {locale === 'es' ? 'ES' : 'EN'}
            </Button>
        </Dropdown>
    );
};
