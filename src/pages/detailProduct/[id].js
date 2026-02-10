import DetailsProductComponent from "@/components/detailsProductComponent/DetailsProductComponent";
import { useRouter } from "next/router";
import { getProducts } from "@/utils/UtilsProducts";

export default function DetailsProductPage({footer}) {
  const router = useRouter();
  const { id } = router.query; 

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <DetailsProductComponent id = {id} footer={footer}/>
      
    </div>
  );
}

export async function getStaticPaths() {
  const products = getProducts();
  const locales = ['en', 'es'];
  
  const paths = products.flatMap(product =>
    locales.map(locale => ({
      params: { id: product.id },
      locale,
    }))
  );

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}