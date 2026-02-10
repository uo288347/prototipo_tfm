import { getCurrentSceneId } from "@/metrics/scriptTest";
import { COMPONENT_CARD, registerComponent } from "@/metrics/scriptTest";
import { isProductFree } from "@/utils/UtilsOffer";
import { getProductDescription, getProductTitle } from "@/utils/UtilsProductTranslations";
import { Card } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef, useState, memo } from "react";

const {Meta} = Card;

const ProductCardComponent = ({p, index, onClick, enableTracking = true}) => {
    const router = useRouter();
    const locale = router.locale || 'es';
    const t = useTranslations();
    const productTitle = getProductTitle(p.id, locale);
    const productDescription = getProductDescription(p.id, locale);
    const cardRef = useRef(null);
    const trackingId = `product-card-${p.id}`;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const isFree = isProductFree(p.id);

    // Auto-registro del componente para métricas
    useEffect(() => {
        if (!enableTracking) return;

        const timer = setTimeout(() => {
            const element = cardRef.current;
            if (!element) return;

            const sceneId = getCurrentSceneId();
            if (sceneId === null) return;

            const rect = element.getBoundingClientRect();
            registerComponent(
                sceneId,
                trackingId,
                rect.left + window.scrollX,
                rect.top + window.scrollY,
                rect.right + window.scrollX,
                rect.bottom + window.scrollY,
                COMPONENT_CARD,
                null
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [trackingId, enableTracking]);

    return (
        <div ref={cardRef} data-trackable-id={trackingId} id = {trackingId}>
            <Card key={p.id}
                  className="hover-card"
                  hoverable 
                  onClick={onClick}
                  cover={<div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                        {/* Skeleton mientras carga */}
                        {!imageLoaded && !imageError && (
                            <div style={{
                                position: "absolute", 
                                top: 0, 
                                left: 0, 
                                width: "100%", 
                                height: "100%",
                                backgroundColor: "#f0f0f0",
                                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                                animation: "loading 1.5s infinite"
                            }}/>
                        )}
                        
                        <img 
                          alt={productTitle} 
                          src={p.images[0]}
                          loading="lazy"
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageError(true)}
                          style={{
                            position: "absolute", 
                            top: 0, 
                            left: 0, 
                            width: "100%", 
                            height: "100%", 
                            objectFit: 'cover',
                            objectPosition: 'top',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                        />
                        
                        {/* Error fallback */}
                        {imageError && (
                            <div style={{
                                position: "absolute", 
                                top: 0, 
                                left: 0, 
                                width: "100%", 
                                height: "100%",
                                backgroundColor: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "12px"
                            }}>
                                {t('product.imageError') || 'Image not available'}
                            </div>
                        )}
                            
                        {p.freeCode && (
                        <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#ff4d4f",
                          color: "white", padding: "4px 12px", borderRadius: "4px", fontWeight: "bold",
                          fontSize: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        }}>{t('product.free')}</div>
                      )}
                      </div>}
                  bodyStyle={{padding:"1rem"}}
                  >
                    <div className="card-content" style={{ transition: "opacity 0.3s" }}>
                    <Meta title={
                      <span style={{ fontSize: "1rem" }}>{productTitle}</span>
                    }/>
                    <p style={{ fontSize: "0.9rem", color: "#666" , paddingTop:"0.5rem", display: "-webkit-box",
                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}
                    >{productDescription}</p>
                    <Meta description={
                      isFree ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "1rem", textDecoration: "line-through", color: "red" }}>
                            {p.price}€
                          </span>
                          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#000" }}>
                            0€
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "1.5rem", fontWeight: "bold", display: "block", color: "#000" }}>
                          {p.price}€
                        </span>
                      )
                    }/>
                    </div>
                </Card>
                
                {/* CSS para animación de skeleton */}
                <style jsx>{`
                    @keyframes loading {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                `}</style>
        </div>
    );
};

// Memoización del componente para optimizar re-renders
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian estas propiedades específicas
    return (
        prevProps.p.id === nextProps.p.id &&
        prevProps.index === nextProps.index &&
        prevProps.enableTracking === nextProps.enableTracking &&
        prevProps.onClick === nextProps.onClick
    );
});