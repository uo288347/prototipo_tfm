import { Collapse, Input, Button } from "antd-mobile";
import { useState, useEffect } from "react";
import { isEligibleForFree, isProductFree, setItemAsOffer } from "@/utils/UtilsOffer";

export const FreeProductOffer = ({ id, freeCode, isApplied, setIsApplied }) => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Si el producto ya está marcado como gratuito, desactivar input y botón
        if (isProductFree(id)) {
            setIsApplied(true);
            setItemAsOffer(id);
            setMessage("✅ This product is already FREE!");
        }
    }, [id]);

    const handleApplyCode = () => {
        // Replace "FREE123" with your real codes logic
        const validCodes = ["FREE123", "BONUS2025"];
        if (isEligibleForFree(id) && code.toUpperCase() === freeCode.toUpperCase()) {
            setMessage("🎉 Congratulations! This product is now FREE!");
            setIsApplied(true);
            setItemAsOffer(id);
        } else {
            console.log("is eligible", isEligibleForFree(id))

            setMessage("❌ Sorry, this code is not valid for a free product.");
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <Collapse>
                <Collapse.Panel
                    key="1"
                    title={"🎁 Unlock a Free Product!"}
                >
                    <p>
                        Some of our products come with a special <strong style={{ color: "red" }}>red code</strong> displayed on their image.
                    </p>
                    <p>
                        Enter this code in the input box below, and voilà — the product is yours for <strong>FREE</strong>!
                    </p>
                    <p style={{ fontStyle: "italic", color: "#555" }}>
                        Look out for red-marked items and treat yourself to a special surprise. Only a few lucky products carry this offer!
                    </p>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                        <Input
                            placeholder="Enter your code"
                            value={code}
                            onChange={val => setCode(val)}
                            disabled={isApplied}
                        />
                        <Button color="primary" onClick={handleApplyCode} disabled={isApplied}>
                            {isApplied ? "Applied" : "Apply"}
                        </Button>
                    </div>
                    {message && (
                        <p style={{ marginTop: "0.5rem", color: message.startsWith("❌") ? "red" : "green" }}>
                            {message}
                        </p>
                    )}
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};
