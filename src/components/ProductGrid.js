import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Row, Col, Pagination, Modal } from "antd";
import { useState } from "react";
import { ProductCard } from "./homeComponent/ProductCard";
import { getProducts } from "@/utils/UtilsProducts";
import { useRouter } from "next/router";
import { LongPressWrapper } from "./shared/LongPressWrapper"
import { ModalProductCard } from "./homeComponent/ModalProductCard";

const ProductGrid = ({ category, filter }) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  let [products, setProducts] = useState([]);
  let [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    setProducts(getProducts())
  }, [])

  useEffect(() => {
        console.log("filters: ", category)

    if (products.length == 0) setFilteredProducts([])
    else {
      let prs = products.filter((p) => {
        const matchCategory = !category || p.category.toLowerCase() === category.toLowerCase();
        const matchFilter = !filter || p.filter.toLowerCase() === filter;
        return matchCategory && matchFilter;
      })
      setFilteredProducts(prs)
    }
  }, [products, category, filter])

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


  if (filteredProducts.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <p>No products found with selected filters</p>
      </div>
    );
  }

  return (
    <>
      <Row gutter={[8, 8]} align="center">
        {filteredProducts.map((p, index) => (
          <Col xs={12} sm={12} md={8} lg={6} xl={6} key={p.id}>
            <LongPressWrapper
              /*onLongPressHold={() => handleTouchStart(p)}
              onLongPressRelease={handleTouchEnd}*/
              onClick={() => router.push(`/detailProduct/${p.id}`)}>
              <ProductCard p={p} index={index} />
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
            <ModalProductCard product={selectedProduct} />
          </>
        )}
      </Modal>
    </>
  );
};

export default ProductGrid;

