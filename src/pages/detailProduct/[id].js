import DetailsProductComponent from "@/components/detailsProductComponent/DetailsProductComponent";
import { useRouter } from "next/router";

export default function DetailsProductPage({footer}) {
  const router = useRouter();
  const { id } = router.query; 

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <DetailsProductComponent id = {id} footer={footer}/>
      
    </div>
  );
}

export async function getServerSideProps(context) {
  const locale = context.locale || 'en';
  
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}