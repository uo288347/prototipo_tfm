import { HomeComponent } from "@/components/homeComponent/HomeComponent";

export default function Home() {
    return (
    <div style={{margin: "0 10px"}}>
      <HomeComponent />
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