import {Col, Form, Row, Select, Card, Rate, Button} from "antd"
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { TextInputField } from "./shared/TextInputField";
import {validateFormDataInputYear, allowSubmitForm} from "../../utils/UtilsValidations"
import { modifyStateProperty } from "../../utils/UtilsState";

export const InitialFormComponent = ({}) => {
    const router = useRouter();
    let [formData,setFormData] = useState({})
    //let requiredInForm = ["handedness","sex","birthYear","rating"]
    let requiredInForm = []
    let [formErrors, setFormErrors] = useState({})

    let tooltips = ["Never", "Not often", "Often", "Very often" ,"Almost everyday / Everyday"]
 
    return (
        <Card>
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
                setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} validateFunc={validateFormDataInputYear}/>
            <Form.Item name="rating" label="How often do you use e-commerce websites">
                <Rate tooltips={tooltips} 
                onChange={(value) => modifyStateProperty(formData, setFormData, "rating", value)} 
                count={tooltips.length}
                value={formData.rating}  />
            </Form.Item>

            <Form.Item  style={{ marginBottom: 0 }}>
                { allowSubmitForm(formData,formErrors,requiredInForm) ?
                    <Button type="primary" size="large" onClick={() => {router.push("/login")}} block >Register</Button> :
                    <Button type="primary" size="large" block disabled>Register</Button>
                }
            </Form.Item>
        </Form>
        </Card>
    );
}