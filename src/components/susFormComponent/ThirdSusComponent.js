import { Form, Rate } from "antd"
import { modifyStateProperty } from "../../utils/UtilsState";

export const ThirdSusComponent = ({ formData, setFormData }) => {
    let tooltipsFrequency = ["Totalmente en desacuerdo", "En desacuerdo", "Neutro",
        "De acuerdo", "Totalmente de acuerdo"]
    
    const labelStyle = {
        whiteSpace: 'normal',
        lineHeight: '1.4',
        display: 'block'
    };

    return (
            <Form style={{ marginBottom: 0 }} labelWrap>
                <Form.Item label={<span style={labelStyle}>7. I would imagine that most people would learn to use this system very quickly.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus7", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>8. I found the system very cumbersome to use.</span>}>
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus8", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>9. I felt very confident using the system.</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus9", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>10. I needed to learn a lot of things before I could get going with this system.</span>}>
                    <Rate tooltips={tooltipsFrequency}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus10", value)} />
                </Form.Item>
            </Form>
    )
}
