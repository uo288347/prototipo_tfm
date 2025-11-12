import DetailsProductComponent from "@/components/detailsProductComponent/DetailsProductComponent";
import { useRouter } from "next/router";

export default function DetailsProductPage() {
  const router = useRouter();
  const { id } = router.query; 

  return (
    <div >
      <DetailsProductComponent id = {id}/>
    </div>
  );
}