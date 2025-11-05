import Link from "next/link";
import { useEffect } from "react";
import { Row, Col, Pagination, Modal } from "antd";
import { useState } from "react";
import { ProductCard } from "./homeComponent/ProductCard";
import { getProducts } from "@/utils/UtilsProducts";
import { useRouter } from "next/router";
import {LongPressWrapper} from "./shared/LongPressWrapper"
import { ModalProductCard } from "./homeComponent/ModalProductCard";

const ProductGrid = ({}) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleTouchStart = (product) => {
    console.log("handle: ", product)
    setSelectedProduct(product);
  };

  useEffect(() => {
    if (selectedProduct) {
      setIsModalVisible(true);
    }
  }, [selectedProduct]);

  const handleTouchEnd = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  let [products, setProducts] = useState([]);
  useEffect( ()=> {
    setProducts(getProducts())
  }, [])

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p>No products found with selected filters</p>
      </div>
    );
  }

  return (
    <>
    <Row gutter={[8,8]} align="center">
      {products.map((p, index) => (
        <Col xs={12} sm={12} md={8} lg={6} xl={6} key={p.id}>
          <LongPressWrapper 
          onLongPressHold={() => handleTouchStart(p)}
          onLongPressRelease={handleTouchEnd}
          onClick={() => router.push(`/detailProduct/${p.id}`)}>
            <ProductCard p={p} index={index}/>
          </LongPressWrapper>
        </Col>
      ))}
    </Row>


      <Modal
        open={isModalVisible}
        onCancel={handleTouchEnd}
        footer={null}
        closable={false}
      >
        {selectedProduct && (
          <>
            <ModalProductCard product={selectedProduct}/>
          </>
        )}
      </Modal>
    </>
  );
};

export default ProductGrid;

