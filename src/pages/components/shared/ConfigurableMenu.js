import { ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Typography, Button } from "antd";
import { useRouter } from "next/router";

const {Title} = Typography

export const ConfigurableMenu = ({icon, text, onClick}) => {
    return (
        <>
        <Row align="middle" style={{paddingBottom:"1rem"}}>
            <Button size="large" style={{border:"none", marginRight:"1rem", fontSize:"1.5rem"}} 
                icon={<ArrowLeftOutlined/>}
                onClick={onClick}/>
            
            <Title level={4} style={{margin:0, padding: 0, fontWeight:"normal", display:"flex", justifyContent:"center", gap:"0.7rem" }}>{icon} {text}</Title>
        </Row>
        </>
    );
}