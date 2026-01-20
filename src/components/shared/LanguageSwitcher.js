import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { registerComponent, COMPONENT_BUTTON, COMPONENT_OPTION, getCurrentSceneId } from "@/metrics/scriptTest";

export const LanguageSwitcher = () => {
    /*const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel } = useGestureDetector();*/

    const router = useRouter();
    const { locale, pathname, asPath, query } = router;
    const buttonRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                registerComponent(sceneId, "btn-language-switcher", rect.x, rect.y, rect.width, rect.height, COMPONENT_BUTTON);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const changeLanguage = (newLocale) => {
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    // Registra las opciones cuando el dropdown se abre
    const handleDropdownOpen = (open) => {
        if (open) {
            setTimeout(() => {
                const sceneId = getCurrentSceneId();
                const dropdownItems = document.querySelectorAll('.ant-dropdown-menu-item');
                dropdownItems.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    const optionId = index === 0 ? 'lang-option-en' : 'lang-option-es';
                    registerComponent(optionId, COMPONENT_OPTION, sceneId, rect.x, rect.y, rect.width, rect.height);
                    item.setAttribute('data-trackable-id', optionId);
                });
            }, 50);
        }
    };

    const items = [
        {
            key: 'en',
            label: <span
                data-trackable-id="lang-option-en"
                /*onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}*/
            >English</span>,
            onClick: () => changeLanguage('en'),
        },
        {
            key: 'es',
            label: <span
                data-trackable-id="lang-option-es"
                /*onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}*/
            >Español</span>,
            onClick: () => changeLanguage('es'),
        },
    ];

    return (
        <Dropdown
            onOpenChange={handleDropdownOpen}
            menu={{ items, selectedKeys: [locale] }} placement="bottomRight">
            <Button
                ref={buttonRef}
                id="btn-language-switcher"
                data-trackable-id="btn-language-switcher"
                /*onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}*/
                icon={<GlobalOutlined />} type="text">
                {locale === 'es' ? 'ES' : 'EN'}
            </Button>
        </Dropdown>
    );
};