import { COMPONENT_BUTTON, COMPONENT_CAROUSEL, getCurrentSceneId, registerComponent } from "@/metrics/scriptTest";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Carousel } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { PinchZoomImage } from "./PinchZoomImage";

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
                registerComponent(sceneId, "btn-back-home", rect.left + window.scrollX, rect.top + window.scrollY,
                    rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_BUTTON, null);
            }
            // Register carousel
            if (carouselRef.current) {
                const carouselElement = carouselRef.current.querySelector('.ant-carousel') || carouselRef.current;
                const rect = carouselElement.getBoundingClientRect();
                registerComponent(sceneId, "carousel-product-images", rect.left + window.scrollX, rect.top + window.scrollY,
                    rect.right + window.scrollX, rect.bottom + window.scrollY, COMPONENT_CAROUSEL, null);
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