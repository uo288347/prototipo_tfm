import { COMPONENT_BUTTON, getCurrentSceneId, registerComponent } from "@/metrics/scriptTest";
import { Button, Typography, message } from "antd";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Lottie from 'react-lottie';
import animationData from '../../public/Rewards.json';
import { ShareButton } from "./shared/ShareButton";

const { Title } = Typography;

export const FinalComponent = ({ }) => {
    const t = useTranslations();
    const [copied, setCopied] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = t('end.shareMessage') || "¡Participa en este experimento!";

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
    };

    const handleFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    };

    const handleTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback for older browsers
            const el = document.createElement("textarea");
            el.value = shareUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t('end.shareTitle') || "Experimento",
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // El usuario canceló, no hacer nada
            }
        }
    };

    return (
        <div style={{
            flex: 1, minHeight: "100%", padding: "20px 20px",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <Title style={{ textAlign: "center" }} level={3}>{t('end.thanksMessage')}</Title>

            <div style={{ width: "200px", height: "200px" }}>
                <Lottie options={defaultOptions} />
            </div>

            {/* Share section */}
            <div style={{ marginTop: "24px", textAlign: "center", }}>
                <p style={{ marginBottom: "14px", color: "#555", fontSize: "15px", fontWeight: 500 }}>
                    {t('end.shareMessage') || "¡Comparte el experimento!"}
                </p>
                <div style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "180px"
                }}>
                    {navigator.share && (
                        <ShareButton
                            label={t('end.shareMore') || "Más opciones"}
                            color="#61a4fc"
                            hoverColor="#1877F2"
                            onClick={handleNativeShare}
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                                </svg>
                            }
                        />
                    )}
                    <ShareButton
                        label="WhatsApp"
                        color="#25D366"
                        hoverColor="#1ebe57"
                        onClick={handleWhatsApp}
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.1 1.51 5.833L.057 23.535a.5.5 0 00.614.614l5.702-1.453A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.506-5.228-1.387l-.374-.22-3.882.99.99-3.882-.22-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                        }
                    />
                    <ShareButton
                        label="Facebook"
                        color="#1877F2"
                        hoverColor="#0d65d8"
                        onClick={handleFacebook}
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                            </svg>
                        }
                    />
                    <ShareButton
                        label="X / Twitter"
                        color="#000"
                        hoverColor="#333"
                        onClick={handleTwitter}
                        icon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        }
                    />
                    <ShareButton
                        label={copied ? (t('end.copied') || "¡Copiado!") : (t('end.copyLink') || "Copiar enlace")}
                        color={copied ? "#52c41a" : "#6c757d"}
                        hoverColor={copied ? "#3f9e0f" : "#545b62"}
                        onClick={handleCopyLink}
                        icon={
                            copied
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                        }
                    />

                </div>
            </div>
        </div>
    );
};