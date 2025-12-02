import { EndComponent } from "@/components/EndComponent";

export default function End() {

    return (
        <div style={{ flex:1, display: "flex", flexDirection:"column", justifyContent: "center", 
        alignItems: "center", height: "100%", padding: "20px 20px"}}>
            <EndComponent/>
        </div>
    );
}

export async function getServerSideProps(context) {
  const locale = context.locale || 'en';
  
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}