import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image } from "antd";
import { motion } from "framer-motion";
import { label } from "framer-motion/client";
import { getCategories } from "@/utils/UtilsCategories";

export const CategoryFilter = ({selectedCategory, onSelectCategory}) => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        let cats = getCategories()
        setCategories(cats)
    }, [])

    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '16px', }}>
            {categories.map((cat) => (
            <Card
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