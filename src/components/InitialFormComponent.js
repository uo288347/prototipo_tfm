import { Col, Form, Row, Select, Card, Rate, Button, Divider } from "antd"
//import { Form  } from "antd-mobile";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { TextInputField } from "./shared/TextInputField";
import { validateFormDataInputYear, allowSubmitForm } from "../utils/UtilsValidations"
import { modifyStateProperty } from "../utils/UtilsState";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";

export const InitialFormComponent = ({ }) => {
    const router = useRouter();
    let [formData, setFormData] = useState({})
    //let requiredInForm = ["handedness","sex","birthYear","rating"]
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    let tooltipsFrequency = ["Never", "Once a month", "2-3 times a month", "1-3 times a week", "Almost everyday / Everyday"]

    return (
        <Card title="Initial form">
            <Form>
                <Form.Item>
                    <Select
                        placeholder="Handedness"
                        onChange={(value) => {
                            modifyStateProperty(formData, setFormData, "handedness", value);
                        }}
                        options={[
                            { value: 'right', label: <span>Right-handed</span> },
                            { value: 'left', label: <span>Left-handed</span> },
                        ]}
                    />
                </Form.Item>
                <Form.Item>
                    <Select
                        placeholder="Sex"
                        onChange={(value) => {
                            modifyStateProperty(formData, setFormData, "sex", value);
                        }}
                        options={[
                            { value: 'man', label: <span>Man</span> },
                            { value: 'woman', label: <span>Woman</span> },
                        ]}
                    />
                </Form.Item>
                <TextInputField name={"birthYear"} placeholder={"Birth year"} formData={formData}
                    setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputYear} />

                <Divider/>

                <Form.Item name="frequency" label="How often do you use e-commerce websites">
                    <Select
                        placeholder="Select frequency"
                        onChange={(value) => modifyStateProperty(formData, setFormData, "frequency", value)}
                        options={[
                            { value: 'never', label: "Never" },
                            { value: 'once_month', label: "Once a month" },
                            { value: '2_3_times_month', label: "2-3 times a month" },
                            { value: '1_3_times_week', label: "1-3 times a week" },
                            { value: 'everyday', label: "Almost everyday / Everyday" },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Which device do you use most for online shopping?">
                    <Select
                        placeholder="Device type"
                        onChange={(value) => {
                            modifyStateProperty(formData, setFormData, "device", value);
                        }}
                        options={[
                            { value: 'computer', label: <span><LaptopOutlined /> Laptop / Computer</span> },
                            { value: 'phone', label: <span><MobileOutlined /> Smartphone</span> },
                            { value: 'tablet', label: <span><TabletOutlined /> Tablet</span> },
                        ]}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    {allowSubmitForm(formData, formErrors, requiredInForm) ?
                        <Button type="primary" size="large" onClick={() => { router.push("/login") }} block >Register</Button> :
                        <Button type="primary" size="large" block disabled>Register</Button>
                    }
                </Form.Item>
            </Form>
        </Card>
    );
}