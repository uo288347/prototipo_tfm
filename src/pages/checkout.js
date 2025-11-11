import { CheckoutComponent } from "./components/CheckoutComponent";

export default function Checkout() {

    return (
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", height:"100dvh", padding: "20px 20px"}}>
            <CheckoutComponent/>
        </div>
    );
}