
import { useRouter } from "next/router";
import { Typography, Row, Button } from "antd";

const {Title} = Typography

export const BottomSection = ({productsLength, selectionMode, calculateTotal}) => {
    const router = useRouter();
    
    return (<>
        {productsLength > 0 && !selectionMode &&
            (<div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "white",
                borderTop: "1px solid #e5e7eb",
                padding: "1rem",
            }}>
                <Row style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: "1rem" }}>
                    <Title level={2} style={{ padding: 0, margin: 0, fontWeight: "normal" }}>Total</Title>
                    <Title level={2} style={{ padding: 0, margin: 0, fontWeight: "normal" }}>{calculateTotal()}€</Title>
                </Row>
                <Button type="primary" block size="large"
                    style={{ padding: "1rem", marginTop: "1rem" }}
                    onClick={() => { router.push("/checkout") }}>
                    Continue
                </Button>
            </div>)}
    </>);
}