import { ManualScrollEngine } from "@/metrics/ManualScrollEngine";
import { COMPONENT_CARD, EVENT_ON_POINTER_CANCEL, EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, getCurrentSceneId, registerComponent, trackWithEvent } from "@/metrics/scriptTest";
import { getCategories } from "@/utils/UtilsCategories";
import { Card } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const scrollEngineRef = useRef(null);

    const router = useRouter();
    const locale = router.locale || 'es';
    const [categories, setCategories] = useState([])
    const cardRefs = useRef({});

    useEffect(() => {
        let cats = getCategories(locale)
        setCategories(cats)
    }, [locale])

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            categories.forEach((cat) => {
                const ref = cardRefs.current[cat.key];
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    registerComponent(sceneId, `category-card-${cat.key}`,
                        rect.x, rect.y, rect.width, rect.height, COMPONENT_CARD, null);
                }
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [categories]);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        //console.log("Initializing ManualScrollEngine horizontal", { container, content });
        if (!container || !content || categories.length === 0) return;

        // Esperar a que el contenido se renderice completamente
        const initScroll = () => {
            const availableWidth = container.clientWidth;
            const scrollWidth = content.scrollWidth;

            //console.log("Scroll dimensions:", { availableWidth, scrollWidth });

            // Si el contenido cabe en el contenedor, no hay scroll
            if (scrollWidth <= availableWidth) {
                //console.log("Content fits, no scroll needed");
                return;
            }

            const maxOffset = 0;
            const minOffset = -(scrollWidth - availableWidth);

            //console.log("Scroll limits:", { minOffset, maxOffset });

            // Mapeo de tipos de evento a constantes de tracking
            const eventTypeMap = {
                'pointerdown': EVENT_ON_POINTER_DOWN,
                'pointermove': EVENT_ON_POINTER_MOVE,
                'pointerup': EVENT_ON_POINTER_UP,
                'pointercancel': EVENT_ON_POINTER_CANCEL,
            };

            scrollEngineRef.current = new ManualScrollEngine(container, content, {
                axis: "x",
                scrollFactor: 1,
                minOffset,
                maxOffset,
                stopPropagation: true,
                onPointerEvent: (eventType, event) => {
                    const trackingEventType = eventTypeMap[eventType];
                    if (trackingEventType !== undefined) {
                        trackWithEvent(trackingEventType, event);
                    }
                },
            });
        };

        // Usar requestAnimationFrame para asegurar que el layout esté calculado
        const rafId = requestAnimationFrame(() => {
            setTimeout(initScroll, 50);
        });

        return () => {
            cancelAnimationFrame(rafId);
            if (scrollEngineRef.current) {
                scrollEngineRef.current.destroy();
                scrollEngineRef.current = null;
            }
        };
    }, [categories]);

    return (
        <div ref={containerRef}
            style={{
                touchAction: "none",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "100%",
            }}>
            <div ref={contentRef} style={{ 
                display: 'flex', 
                gap: '16px', 
            }}>
                {categories.map((cat) => (
                    <Card
                        ref={(el) => cardRefs.current[cat.key] = el}
                        id={`category-card-${cat.key}`}
                        data-trackable-id={`category-card-${cat.key}`}
                        onClick={() => onSelectCategory(cat.key, cat.label)}
                        key={cat.key}
                        cover={
                            <div style={{ width: '160px', height: '160px', overflow: 'hidden' }}>
                                <img alt={cat.label} src={cat.image}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                />
                            </div>
                        }
                        bodyStyle={{ padding: '8px 0', textAlign: 'center' }}
                        style={{
                            width: '160px', border: 'none', borderRadius: '0', boxShadow: 'none',
                            display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}
                    >
                        <div style={{ fontSize: '14px', lineHeight: '1' }}>{cat.label}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}