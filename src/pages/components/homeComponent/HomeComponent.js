import { Breadcrumb, Col, Row, Select, Typography } from "antd";
import { useState, useEffect, useMemo } from "react";
import { StandardMenu } from "../shared/StandardMenu";
import { FilterOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "@/utils/UtilsState";
import { CategoryFilter } from "./CategoryFilter";
import ProductGrid from "../ProductGrid";
import { filter } from "framer-motion/client";

const {Title} = Typography

export const HomeComponent = ({}) => {
    const [filters, setFilters] = useState({
        category: null,
        filter: ""
    });

    let getFilters = [
        {value: "all", label: "All"},
        {value: "women", label: "Women"},
        {value: "men", label: "Men"},
        {value: "kids", label: "Kids"}];

    return (
        <>
        <StandardMenu/>

        <Row style={{minWidth:"100%", paddingTop:"2rem"}}>
        <Col xs={24}>
        <Select
            size="large"
            allowClear
            style={{ width: "100%" }}
            placeholder={<div>
                <FilterOutlined/> Filters
            </div>}
            onChange={(value) => {
                setFilters((f) => ({...f, filter: value === "all" ? "" : value}))
            }}
            options={getFilters}
        /> 
        </Col>
        </Row>

        {filters.category==null ?
        <Row style={{minWidth:"100%", paddingTop:"1rem"}}>
        <Col xs={24}>
        <h2>Categories</h2>
        <CategoryFilter filters={filters} setFilters={setFilters}/>
        </Col>
        </Row>
        : 
        <Breadcrumb style={{paddingTop:"1rem"}} items={[
        {
          title: <a href="/home">Home</a>,
        },
        {
          title: filters.category,
        }
      ]}/>}

        <Row style={{minWidth:"100%", paddingTop:"1.5rem"}}>
        <Col xs={24}>
        <h2>Products</h2>
        <ProductGrid filters={filters} setFilters={setFilters}/>
        </Col>
        </Row>
        </>
    );
}