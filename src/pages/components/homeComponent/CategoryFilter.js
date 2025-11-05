import React, { useState } from "react";
import { Card, Col, Row, Image } from "antd";
import { motion } from "framer-motion";


const categories = [
    { id: 1, name: "Home", image: "/home.jpg" },
    { id: 2, name: "Sports", image: "/sports.jpg" },
    { id: 3, name: "Children's fashion", image: "/clothes_children.png" },
    { id: 4, name: "Women's fashion", image: "/clothes_woman.png" },
    { id: 5, name: "Men's fashion", image: "/clothes_man.png" },
];

export const CategoryFilter = ({filters, setFilters}) => {
    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '16px', }}>
            {categories.map((cat) => (
            <Card
                onClick={() => {
                    setFilters((f) => ({...f, category: cat.name === "all" ? null : cat.name}))
                    console.log(cat)
                }}
                key={cat.name}
                cover={
                <div style={{ width: '160px', height: '160px', overflow: 'hidden' }}>
                    <img
                    alt={cat.name}
                    src={cat.image}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top'
                    }}
                    />
                </div>
                }
                bodyStyle={{
                    padding: '8px 0',
                    textAlign: 'center'
                }}
                style={{
                    width: '160px',
                    border: 'none',
                    borderRadius: '0',
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                >
                <div style={{ fontSize: '14px', lineHeight: '1' }}>{cat.name}</div>
            </Card>
            ))}
        </div>
        </div>
    );
}