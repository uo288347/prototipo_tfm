import { IndexComponent } from "@/components/IndexComponent";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useEffect } from "react";

export default function Index({footer}) {

  // Limpiar usuario al cargar la página para forzar creación de uno nuevo
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <div style={{
      flex: 1, padding: "0px 20px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      alignItems: "center", position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageSwitcher />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", 
        alignItems: "center", width: "100%",}}>
        <IndexComponent />
      </div>
      {footer}
    </div>
  );
}

export async function getStaticProps(context) {
  const locale = context.locale || 'es';

  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
