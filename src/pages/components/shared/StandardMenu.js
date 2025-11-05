import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import { Row, Col, Menu } from "antd"
import Link from "next/link";

export const StandardMenu = () => {
    return(
        <Row justify="space-between" align="middle" style={{paddingTop:"1rem"}}>
        <Col xs={6} sm={4} md={8} lg={10} xl={8} >
        <Menu  mode="horizontal" items={ [
            { key:"logo",  label: <Link href="/"><img src="/globe.svg" width="40" height="40" /></Link>}
        ]} >
        </Menu>
        </Col>
        <Col xs={9} sm={16} md={16} lg={18} xl={18} style={{ alignItems: 'right'}}>
        <Menu mode="horizontal" items={ [
            { key:"menuFavorites", label: <Link href="/favorites"><HeartOutlined style={{ fontSize: 24 }}/></Link>},
            { key:"menuCart", label: <Link href="/shoppingCart"><ShoppingCartOutlined style={{ fontSize: 24 }}/></Link>},
        ]} >
        </Menu>
        </Col>

        </Row>
    )
}