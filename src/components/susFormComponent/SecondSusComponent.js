import { Form, Rate } from "antd"
import { modifyStateProperty } from "../../utils/UtilsState";

export const SecondSusComponent = ({ formData, setFormData }) => {
    let tooltipsFrequency = ["Totalmente en desacuerdo", "En desacuerdo", "Neutro",
        "De acuerdo", "Totalmente de acuerdo"]
    
    const labelStyle = {
        whiteSpace: 'normal',
        lineHeight: '1.4',
        display: 'block'
    };

    return (
            <Form style={{ marginBottom: 0 }} labelWrap>
                <Form.Item label={<span style={labelStyle}>4. I think that I would need the support of a technical person to be able to use this system.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus4", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>5. I found the various functions in this system were well integrated.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus5", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>6. I thought there was too much inconsistency in this system.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus6", value)} />
                </Form.Item>
            </Form>
    )
}