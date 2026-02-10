import { FinalComponent } from "@/components/FinalComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default function Final({footer}) {

  return (
    <div style={{
      flex: 1, padding: "20px 20px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      alignItems: "center", position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageSwitcher />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <FinalComponent />
      </div>
      {footer}
    </div>

  );
}

export async function getStaticProps(context) {
  const locale = context.locale || 'en';

  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}