import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Row, Image } from "antd";
import { motion } from "framer-motion";
import { label } from "framer-motion/client";
import { getCategories } from "@/utils/UtilsCategories";
import { useRouter } from "next/router";
import { registerComponent, COMPONENT_CARD, getCurrentSceneId } from "@/metrics/scriptTest";

export const CategoryFilter = ({selectedCategory, onSelectCategory}) => {
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

    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '16px', }}>
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}}
                    />
                </div>
                }
                bodyStyle={{ padding: '8px 0', textAlign: 'center' }}
                style={{ width: '160px', border: 'none', borderRadius: '0', boxShadow: 'none', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                <div style={{ fontSize: '14px', lineHeight: '1' }}>{cat.label}</div>
            </Card>
            ))}
        </div>
        </div>
    );
}