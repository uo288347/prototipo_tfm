import { useRouter } from "next/router";
import { Card, Button, Tooltip, Avatar } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  LaptopOutlined,
  SkinOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { getProductTitle, getProductDescription } from "@/utils/UtilsProductTranslations";
import { useTranslations } from 'next-intl';

const {Meta} = Card;

export const ModalProductCard = ({product})=> {
    const router = useRouter();
    const locale = router.locale || 'es';
    const productTitle = getProductTitle(product?.id, locale);
    const productDescription = getProductDescription(product?.id, locale);
    const imageSrc = Array.isArray(product?.images) && product.images.length > 0
        ? product.images[0]
        : "/picture3.jpg";
    return (
        <Card key={product.id}
              style={{border:"none", padding:0}}
              bodyStyle={{ padding: 0 }}
              cover={<div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                    <img alt={productTitle} src={imageSrc}
                      style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: 'cover',
                        objectPosition: 'top'}}/>
                  </div>}>

                <div style={{ width: "100%",  paddingTop:"1rem"}}>
                <Meta title={
                  <span style={{ fontSize: "1rem"}}>{productTitle}</span>
                }/>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>{productDescription}</p>
                <Meta description={
                  <span style={{ fontSize: "2rem", fontWeight: "bold", display: "block" , color: "#000"}}>
                    {product?.price}€
                  </span>
                }/>
                </div>
            </Card>
    );
};