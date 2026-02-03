import { Form } from "antd";
import { useTranslations } from 'next-intl';
import { modifyStateProperty } from "../../utils/UtilsState";
import { TrackableRate } from "../shared/TrackableRate";

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
                    <TrackableRate 
                        id="rate-sus1"
                        tooltips={tooltipsFrequency}
                        value={formData.sus1}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus1", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question2')}</span>}>
                    <TrackableRate 
                        id="rate-sus2"
                        tooltips={tooltipsFrequency}
                        value={formData.sus2}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus2", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question3')}</span>} >
                    <TrackableRate 
                        id="rate-sus3"
                        tooltips={tooltipsFrequency}
                        value={formData.sus3}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus3", value)} />
                </Form.Item>
            </Form>
    )
}