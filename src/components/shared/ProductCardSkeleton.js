import { Card } from "antd";

export const ProductCardSkeleton = () => {
  return (
    <div style={{ width: "100%" }}>
      <Card 
        className="skeleton-card"
        cover={
          <div style={{ 
            width: "100%", 
            paddingTop: "100%", 
            position: "relative",
            backgroundColor: "#f0f0f0"
          }}>
            <div style={{
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100%",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "loading 1.5s infinite"
            }}/>
          </div>
        }
        bodyStyle={{padding:"1rem"}}
      >
        <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "8px", borderRadius: "4px" }}/>
        <div style={{ height: "16px", backgroundColor: "#f0f0f0", marginBottom: "8px", borderRadius: "4px", width: "80%" }}/>
        <div style={{ height: "16px", backgroundColor: "#f0f0f0", marginBottom: "12px", borderRadius: "4px", width: "60%" }}/>
        <div style={{ height: "24px", backgroundColor: "#f0f0f0", borderRadius: "4px", width: "40%" }}/>
      </Card>
      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};