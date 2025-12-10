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
import { StandardNavBar } from "../shared/StandardNavBar";
import { useTranslations } from 'next-intl';
import { useRouter as useNextRouter } from 'next/router';
import useGestureDetector from "@/metrics/GestureDetectorHook";

export const HomeComponent = ({ }) => {
    const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel } = useGestureDetector();

    const t = useTranslations();
    const nextRouter = useNextRouter();
    const locale = nextRouter.locale || 'es';
    const [filters, setFilters] = useState({
        category: null,
        filter: ""
    });

    let getFilters = [
        { value: "", label: t('categories.all') },
        { value: "clothing", label: t('categories.clothing') },
        { value: "accessories", label: t('categories.accessories') },
        { value: "footwear", label: t('categories.footwear') }];

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
        let label = getCategoryLabel(searchParams.get("category"), locale)
        setFilters({
            category: searchParams.get("category") || null,
            categoryLabel: label || null,
            filter: searchParams.get("filter") || "",
        });
    }, [searchParams, locale]);

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
        <div>
            <StandardNavBar />

            <Row style={{ minWidth: "100%", paddingTop: "1rem" }}>
                <Col xs={24}>
                    <Select
                        size="large"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder={<div>
                            <FilterOutlined /> {t('home.filters')}
                        </div>}
                        onChange={(value) => updateUrl("filter", value)}
                        options={getFilters}
                    />
                </Col>
            </Row>

            {filters.category == null ?
                <Row style={{ minWidth: "100%", paddingTop: "1rem" }}>
                    <Col xs={24}>
                        <h2>{t('home.categories')}</h2>
                        <CategoryFilter selectedCategory={filters.category} onSelectCategory={handleCategorySelect} />
                    </Col>
                </Row>
                :
                <Breadcrumb style={{ paddingTop: "1rem" }} items={[
                    { title: <a onClick={() => handleCategorySelect(null)}>{t('home.home')}</a> },
                    { title: filters.categoryLabel }
                ]} />}

            <Row style={{ minWidth: "100%", paddingTop: "1.5rem" }}>
                <Col xs={24}>
                    {filters.category == null && <h2>{t('home.products')}</h2>}
                    <ProductGrid category={filters.category}
                        filter={filters.filter} />
                </Col>
            </Row>
        </div>
    );
}