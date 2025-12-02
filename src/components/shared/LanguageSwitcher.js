import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useRouter } from "next/router";

export const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const changeLanguage = (newLocale) => {
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    const items = [
        {
            key: 'en',
            label: 'English',
            onClick: () => changeLanguage('en'),
        },
        {
            key: 'es',
            label: 'Español',
            onClick: () => changeLanguage('es'),
        },
    ];

    return (
        <Dropdown menu={{ items, selectedKeys: [locale] }} placement="bottomRight">
            <Button icon={<GlobalOutlined />} type="text">
                {locale === 'es' ? 'ES' : 'EN'}
            </Button>
        </Dropdown>
    );
};
