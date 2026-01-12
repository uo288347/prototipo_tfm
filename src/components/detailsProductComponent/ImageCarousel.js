import { Carousel, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { PinchZoomImage } from "./PinchZoomImage";
import { useRef, useEffect } from "react";
import { registerComponent, COMPONENT_BUTTON, COMPONENT_CAROUSEL, getCurrentSceneId } from "@/metrics/scriptTest";

export const ImageCarousel = ({ product }) => {
    const router = useRouter();
    const backButtonRef = useRef(null);
    const carouselRef = useRef(null);

    useEffect(() => {
        const sceneId = getCurrentSceneId();
        const timer = setTimeout(() => {
            // Register back button
            if (backButtonRef.current) {
                const rect = backButtonRef.current.getBoundingClientRect();
                registerComponent("btn-back-home", COMPONENT_BUTTON, sceneId, rect.x, rect.y, rect.width, rect.height);
            }
            // Register carousel
            if (carouselRef.current) {
                const carouselElement = carouselRef.current.querySelector('.ant-carousel') || carouselRef.current;
                const rect = carouselElement.getBoundingClientRect();
                registerComponent("carousel-product-images", COMPONENT_CAROUSEL, sceneId, rect.x, rect.y, rect.width, rect.height);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [product]);

    return (
        <>
            <Button
                ref={backButtonRef}
                id="btn-back-home"
                data-trackable-id="btn-back-home"
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
            <div ref={carouselRef} data-trackable-id="carousel-product-images">
                <Carousel
                    dots
                    swipeToSlide
                    style={{ width: "100%", height: "50vh", overflow: "hidden" }}
                >
                    {product.images?.map((img, index) => (
                        <div key={index} style={{ height: "50vh", overflow: "hidden" }}>
                            <PinchZoomImage
                                src={img}
                                alt={`${product?.title || 'Product'} - Image ${index + 1}`}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );
}

/*                        <img
                            src={img}
                            alt={`Imagen ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "500px",
                                objectFit: "cover",
                                objectPosition: 'top'
                            }}
                        />*/