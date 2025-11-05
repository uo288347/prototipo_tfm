import { ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Typography, Button } from "antd";
import { useRouter } from "next/router";

const {Title} = Typography

export const ConfigurableMenu = ({text}) => {
    const router = useRouter();
    return (
        <>
        <Row justify="left" align="top" style={{padding:"1rem"}}>
            <Button size="large" style={{border:"none"}} 
                icon={<ArrowLeftOutlined/>}
                onClick={() => {router.push("/home")}}/>
            <Title level={3}>{text}</Title>
        </Row>
        </>
    );
}