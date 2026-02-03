import { getCurrentSceneId } from "@/metrics/constants/scenes";
import { COMPONENT_CARD, registerComponent } from "@/metrics/scriptTest";
import { getProductDescription, getProductTitle } from "@/utils/UtilsProductTranslations";
import { Card } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const {Meta} = Card;

export const ProductCard = ({p, index, onClick, onTouchStart, onTouchEnd, enableTracking = true}) => {
    const router = useRouter();
    const locale = router.locale || 'es';
    const t = useTranslations();
    const productTitle = getProductTitle(p.id, locale);
    const productDescription = getProductDescription(p.id, locale);
    const cardRef = useRef(null);
    const trackingId = `product-card-${p.id}`;

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
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  cover={<div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                        <img alt={productTitle} src={p.images[0]}
                          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: 'cover',
                            objectPosition: 'top'}}/>
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
                      <span style={{ fontSize: "1.5rem", fontWeight: "bold", display: "block" , color: "#000"}}>
                        {p.price}€
                      </span>
                    }/>
                    </div>
                </Card>
        </div>
    );
};