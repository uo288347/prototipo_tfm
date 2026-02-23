import { Button } from "antd";
import { useState } from "react";

export const ShareButton = ({ icon, label, color, hoverColor, onClick }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            size="large"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                backgroundColor: hovered ? hoverColor : color,
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                transition: "background-color 0.2s, transform 0.15s",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
        >
            {icon}
            {label}
        </Button>
    );
};
