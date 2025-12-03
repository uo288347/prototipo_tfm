import { useRouter } from "next/router";
import { Button } from "antd";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default function Index() {
  const t = useTranslations();
  const router = useRouter();
  const handleStart = () => {
    router.push("/form"); 
  };

  return (
    <div style={{flex: 1, padding: "20px 20px", 
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
    <div style={{ position: "absolute", top: "20px", right: "20px" }}>
      <LanguageSwitcher />
    </div>
    <Button style={{width:"100%"}} size="large" type="primary" onClick={handleStart}>
      {t('auth.start')}
    </Button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const locale = context.locale || 'es';
  
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
