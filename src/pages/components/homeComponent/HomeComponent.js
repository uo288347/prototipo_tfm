import { Breadcrumb, Col, Row, Select, Typography } from "antd";
import { useState, useEffect, useMemo } from "react";
import { StandardMenu } from "../shared/StandardMenu";
import { FilterOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "@/utils/UtilsState";
import { CategoryFilter } from "./CategoryFilter";
import ProductGrid from "../ProductGrid";
import { filter } from "framer-motion/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getCategory, getCategoryLabel } from "@/utils/UtilsCategories";

const { Title } = Typography

export const HomeComponent = ({ }) => {
    const [filters, setFilters] = useState({
        category: null,
        filter: ""
    });

    let getFilters = [
        { value: "", label: "All" },
        { value: "clothing", label: "Clothing" },
        { value: "accessories", label: "Accessories" },
        { value: "footwear", label: "Footwear" }];


    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateUrl = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    // 🔹 Cada vez que cambian los parámetros de la URL, sincroniza el estado local
    useEffect(() => {
        let label = getCategoryLabel(searchParams.get("category"))
        setFilters({
            category: searchParams.get("category") || null,
            categoryLabel: label || null,
            filter: searchParams.get("filter") || "",
        });
    }, [searchParams]);

    const handleCategorySelect = (value, label) => {
        setFilters((prev) => ({
            ...prev,
            category: value,
            categoryLabel: label
        }));
        console.log("category, ", value, label, filters.category, filters.categoryLabel)
        updateUrl("category", value);
    };

    return (
        <>
            <StandardMenu />

            <Row style={{ minWidth: "100%", paddingTop: "2rem" }}>
                <Col xs={24}>
                    <Select
                        size="large"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder={<div>
                            <FilterOutlined /> Filters
                        </div>}
                        onChange={(value) => updateUrl("filter", value)}
                        options={getFilters}
                    />
                </Col>
            </Row>

            {filters.category == null ?
                <Row style={{ minWidth: "100%", paddingTop: "1rem" }}>
                    <Col xs={24}>
                        <h2>Categories</h2>
                        <CategoryFilter selectedCategory={filters.category} onSelectCategory={handleCategorySelect} />
                    </Col>
                </Row>
                :
                <Breadcrumb style={{ paddingTop: "1rem" }} items={[
                    { title: <a onClick={() => handleCategorySelect(null)}>Home</a> },
                    { title: filters.categoryLabel }
                ]} />}

            <Row style={{ minWidth: "100%", paddingTop: "1.5rem" }}>
                <Col xs={24}>
                    {filters.category == null && <h2>Products</h2>}
                    <ProductGrid category={filters.category}
                        filter={filters.filter} />
                </Col>
            </Row>
        </>
    );
}