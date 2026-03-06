
// ── Tarjeta de invitación que se convierte en imagen ──────────────────────────
export const InvitationCard = ({ shareText, t }) => (
    <div
        style={{
            width: "420px",
            background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
            borderRadius: "18px",
            padding: "32px 28px",
            fontFamily: "'Segoe UI', sans-serif",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "hidden",
        }}
    >
        {/* Decorative circle */}
        <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
        }} />

        {/* University badge */}
        <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "4px 14px",
            fontSize: "12px",
            letterSpacing: "0.5px",
            marginBottom: "16px",
            backdropFilter: "blur(4px)",
        }}>
            🎓 Universidad de Oviedo
        </div>

        {/* Main text */}
        <p style={{ fontSize: "15px", lineHeight: "1.7", margin: "0 0 24px", color: "#e0e0e0" }}>
            {shareText
                // Remove the credentials block so we render them separately below
                .replace(/📧.*\n?🔑.*\n?/, "")
                .trim()}
        </p>

        {/* Credentials box — visually distinct, no copy-paste affordance */}
        <div style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "16px",
        }}>
            <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Credenciales de acceso
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "20px" }}>📧</span>
                <div>
                    <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>Email</p>
                    {/* Each character in a separate span to break copy-paste behaviour */}
                    <p style={{ fontSize: "15px", fontWeight: "700", margin: 0, letterSpacing: "1px", userSelect: "none" }}>
                        {"usuario@gmail.com".split("").map((c, i) => (
                            <span key={i}>{c}</span>
                        ))}
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🔑</span>
                <div>
                    <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>Contraseña</p>
                    <p style={{ fontSize: "15px", fontWeight: "700", margin: 0, letterSpacing: "2px", userSelect: "none" }}>
                        {"participa".split("").map((c, i) => (
                            <span key={i}>{c}</span>
                        ))}
                    </p>
                </div>
            </div>
        </div>

        <p style={{ fontSize: "13px", color: "#aaa", margin: 0, textAlign: "center" }}>
            ¡Gracias por tu colaboración! 🙏
        </p>
    </div>
);