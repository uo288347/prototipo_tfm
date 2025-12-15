import { Form, Rate } from "antd"
import { modifyStateProperty } from "../../utils/UtilsState";
import { useTranslations } from 'next-intl';

export const ThirdSusComponent = ({ formData, setFormData }) => {
    const t = useTranslations();
    const tooltipsFrequency = [
        t('susForm.stronglyDisagree'),
        t('susForm.disagree'),
        t('susForm.neutral'),
        t('susForm.agree'),
        t('susForm.stronglyAgree')
    ];
    
    const labelStyle = {
        whiteSpace: 'normal',
        lineHeight: '1.4',
        display: 'block'
    };

    return (
            <Form style={{ marginBottom: 0 }} labelWrap>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question7')}</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus7}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus7", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question8')}</span>}>
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus8}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus8", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question9')}</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus9}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus9", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question10')}</span>}>
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus10}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus10", value)} />
                </Form.Item>
            </Form>
    )
}
