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

const {Meta} = Card;

export const ProductCard = ({p, index, onClick, onTouchStart, onTouchEnd}) => {

    return (
        <Card key={p.id}
              className="hover-card"
              hoverable 
              onClick={onClick}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              cover={<div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                    <img alt={p.title} src={p.images[0]}
                      style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: 'cover',
                        objectPosition: 'top'}}/>
                  </div>}>

                <div className="card-content" style={{ transition: "opacity 0.3s" }}>
                <Meta title={
                  <span style={{ fontSize: "1rem" }}>{p.title}</span>
                }/>
                <p style={{ fontSize: "0.9rem", color: "#666" , paddingTop:"0.5rem"}}>{p.description}</p>
                <Meta description={
                  <span style={{ fontSize: "2rem", fontWeight: "bold", display: "block" , color: "#000"}}>
                    {p.price}€
                  </span>
                }/>
                </div>
            </Card>
    );
};