import { Carousel, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export const ImageCarousel = ({product}) => {
    const router = useRouter();
    return (
        <>
        <Button
            type="text"
            icon={<ArrowLeftOutlined style={{ fontSize: "24px" }} />}
            onClick={() => router.push("/home")}
            style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "50%",
            padding: "0.5rem",
            }}
        />
        <Carousel
                autoplay
                dots
                swipeToSlide
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
                {product.images?.map((img, index) => (
                <div key={index}>
                    <img
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                        objectPosition: 'top'
                    }}
                    />
                </div>
                ))}
            </Carousel>
        </>
    );
}