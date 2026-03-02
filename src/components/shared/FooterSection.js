import { useTranslations } from 'next-intl';
import { Footer } from 'antd-mobile';

export const FooterSection = ({ }) => {
    const t = useTranslations();
    return (
        <Footer 
        label={t("common.footerText")}> </Footer>
    )
}