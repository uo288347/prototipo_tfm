import { Form, Rate } from "antd"
import { modifyStateProperty } from "../../utils/UtilsState";
import { useTranslations } from 'next-intl';

export const FirstSusComponent = ({ formData, setFormData }) => {
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
        lineHeight: '1.2',
        display: 'block'
    };

    return (
            <Form labelWrap>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question1')}</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus1}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus1", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question2')}</span>}>
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus2}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus2", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question3')}</span>} >
                    <Rate tooltips={tooltipsFrequency}
                        value={formData.sus3}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus3", value)} />
                </Form.Item>
            </Form>
    )
}