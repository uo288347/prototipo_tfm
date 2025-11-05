import {Row, Col, Button, Typography, Popconfirm} from 'antd';
import { useRouter } from "next/router";
import { ArrowLeftOutlined, BackwardOutlined, ShoppingOutlined, StepBackwardOutlined } from '@ant-design/icons';
import { BuyButton } from '../../shared/BuyButton';
import { useEffect } from 'react';
import { openNotification } from '@/utils/UtilsNotifications';

export const BottomButtons = ({id}) => {
    const router = useRouter();

    let cards = []
    let selectedCard = null

    useEffect(() => {
        getCreditCards();
    }, [])

    const getCreditCards = async () => {
        let res = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/creditCards",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (res.ok) {
            const data = await res.json();
            cards = data;
            selectedCard = cards[0].id
            console.log("card: ", cards[0], selectedCard)
            //setLoadingCards(false);
        } else {
            openNotification("top","Error: User has no credit cards", "error" )
        }
    };

    let confirm = async () => {
        console.log("productId: "+id+", credit card: ")
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/transactions/",
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    productId: id,
                    buyerPaymentId: selectedCard
                })
            });

        if ( response.ok ){
            let jsonData = await response.json();
            if (jsonData.affectedRows == 1){

            }
            openNotification("top","Product bought successfully", "success" )
            router.push("/myProducts")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
            openNotification("top","Error: could not buy product", "error" )
        }
    }
    let cancel = () => {}

    return (
        <Row align="bottom" gutter={2}>
                <Col flex="100px">
                    <Button
                        style={{marginTop:"2rem"}}
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push(`/products`)}
                    >
                        Back
                    </Button>
                </Col>
                <Col flex="auto">
                <BuyButton onConfirm={confirm} onCancel={cancel}/>
                </Col>
            </Row>
    );
}