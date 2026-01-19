import { ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Typography, Button } from "antd";
import { useRouter } from "next/router";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useRef, useEffect } from "react";
import { registerComponent, COMPONENT_BUTTON, getCurrentSceneId } from "@/metrics/script_v2";

const {Title} = Typography

export const ConfigurableMenu = ({icon, text, onClick}) => {
    const backButtonRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            if (backButtonRef.current) {
                const rect = backButtonRef.current.getBoundingClientRect();
                registerComponent("btn-menu-back", COMPONENT_BUTTON, sceneId, rect.x, rect.y, rect.width, rect.height);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
        <Row align="middle" justify="space-between" style={{paddingBottom:"1rem", paddingTop:"1rem", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"center"}}>
                <Button ref={backButtonRef} id="btn-menu-back" data-trackable-id="btn-menu-back" type="text" size="large" style={{border:"none", marginRight:"1rem", fontSize:"1.5rem"}} 
                    icon={<ArrowLeftOutlined/>}
                    onClick={onClick}/>
                
                <Title level={4} style={{margin:0, padding: 0, fontWeight:"normal", display:"flex", justifyContent:"center", gap:"0.7rem" }}>{icon} {text}</Title>
            </div>
            
            <LanguageSwitcher />
        </Row>
        </>
    );
}