import { ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Typography, Button } from "antd";
import { useRouter } from "next/router";

const {Title} = Typography

export const ConfigurableMenu = ({icon, text}) => {
    const router = useRouter();
    return (
        <>
        <Row justify="left" align="middle" style={{padding:"1rem"}}>
            <Button size="large" style={{border:"none", marginRight:"1rem"}} 
                icon={<ArrowLeftOutlined/>}
                onClick={() => {router.push("/home")}}/>
            
            <Title level={3} style={{margin:0, padding: 0 }}>{icon} {text}</Title>
        </Row>
        </>
    );
}