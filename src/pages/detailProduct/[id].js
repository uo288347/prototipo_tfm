import { useRouter } from "next/router";
import DetailsProductComponent from "../components/detailsProductComponent/DetailsProductComponent";

export default function DetailsProductPage() {
  const router = useRouter();
  const { id } = router.query; 

  return (
    <div >
      <DetailsProductComponent id = {id}/>
    </div>
  );
}