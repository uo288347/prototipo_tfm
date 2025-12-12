import { Form, Rate } from "antd"
import { modifyStateProperty } from "../../utils/UtilsState";

export const FirstSusComponent = ({ formData, setFormData }) => {
    let tooltipsFrequency = ["Totalmente en desacuerdo", "En desacuerdo", "Neutro",
        "De acuerdo", "Totalmente de acuerdo"]
    
    const labelStyle = {
        whiteSpace: 'normal',
        lineHeight: '1.2',
        display: 'block'
    };

    return (
            <Form labelWrap>
                <Form.Item label={<span style={labelStyle}>1. I think that I would like to use this system frequently.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus1", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>2. I found the system unnecessarily complex.</span>}>
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus2", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>3. I thought the system was easy to use.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus3", value)} />
                </Form.Item>
            </Form>
    )
}