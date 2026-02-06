import { HomeComponent } from "@/components/homeComponent/HomeComponent";

export default function Home({footer}) {
    return (
    <div style={{margin: "0 10px"}}>
      <HomeComponent footer={footer}/>
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