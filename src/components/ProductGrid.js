
import { getProducts } from "@/utils/UtilsProducts";
import { Col, Row } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductCard } from "./homeComponent/ProductCard";
import { LongPressWrapper } from "./shared/LongPressWrapper";
import { ProductCardSkeleton } from "./shared/ProductCardSkeleton";


const ProductGrid = ({ category, filter, onLoadComplete }) => {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  let [products, setProducts] = useState([]);
  
  useEffect(() => {
    setIsLoading(true);
    // Simular pequeña carga asíncrona para mostrar skeletons
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setIsLoading(false);
      // Notificar que la carga ha terminado para recalcular scroll
      if (onLoadComplete) {
        setTimeout(onLoadComplete, 50);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [onLoadComplete])

  // Memoizar productos filtrados para evitar re-cálculos innecesarios
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];
    
    return products.filter((p) => {
      const matchCategory = !category || p.category.toLowerCase() === category.toLowerCase();
      const matchFilter = !filter || p.filter.toLowerCase() === filter;
      return matchCategory && matchFilter;
    });
  }, [products, category, filter]);

  // Memoizar handlers para evitar re-renders en ProductCard
  const handleProductClick = useCallback((productId) => {
    router.push(`/detailProduct/${productId}`);
  }, [router]);

  // Mostrar skeletons mientras carga
  if (isLoading) {
    return (
      <Row gutter={[8, 8]} align="center">
        {Array.from({ length: 8 }, (_, index) => (
          <Col xs={12} sm={12} md={8} lg={6} xl={6} key={`skeleton-${index}`}>
            <ProductCardSkeleton />
          </Col>
        ))}
      </Row>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <p>{t('product.noProductsFound')}</p>
      </div>
    );
  }

  return (
    <>
      <Row gutter={[8, 8]} align="center">
        {filteredProducts.map((p, index) => (
          <Col xs={12} sm={12} md={8} lg={6} xl={6} key={p.id}>
            <LongPressWrapper
              onClick={() => handleProductClick(p.id)}>
              <ProductCard 
                p={p} 
                index={index}
              />
            </LongPressWrapper>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductGrid;