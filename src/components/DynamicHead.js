import { useTranslations } from "next-intl";
import Head from "next/head";
export const DynamicHead = () => {
  const t = useTranslations(); // Asumiendo que creas una sección "metadata" en tus JSON
  
  return (
    <Head>
      <title>{t('metadata.title')}</title>
      <meta property="og:title" content={t('metadata.ogTitle')} />
      <meta property="og:description" content={t('metadata.ogDescription')} />
      <meta property="og:image" content="https://carbayo.vercel.app/mascota_render_v5.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('metadata.ogTitle')} />
      <meta name="twitter:description" content={t('metadata.ogDescription')} />
      <meta name="twitter:image" content="https://carbayo.vercel.app/mascota_render_v5.png" />
    </Head>
  );
};