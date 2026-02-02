import { CheckoutComponent } from "@/components/CheckoutComponent";

export default function Checkout({footer}) {

    return (
        <div style={{ flex:1, display:"flex", flexDirection:"column", height: "100%", padding: "0px 20px"}}>
            <CheckoutComponent />
            {footer}
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