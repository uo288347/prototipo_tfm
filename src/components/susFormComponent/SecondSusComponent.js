import { Form } from "antd";
import { useTranslations } from 'next-intl';
import { modifyStateProperty } from "../../utils/UtilsState";
import { TrackableRate } from "../shared/TrackableRate";

export const SecondSusComponent = ({ formData, setFormData }) => {
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
                <Form.Item label={<span style={labelStyle}>{t('susForm.question4')}</span>} >
                    <TrackableRate 
                        id="rate-sus4"
                        tooltips={tooltipsFrequency}
                        value={formData.sus4}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus4", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question5')}</span>} >
                    <TrackableRate 
                        id="rate-sus5"
                        tooltips={tooltipsFrequency}
                        value={formData.sus5}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus5", value)} />
                </Form.Item>
                <Form.Item label={<span style={labelStyle}>{t('susForm.question6')}</span>} >
                    <TrackableRate 
                        id="rate-sus6"
                        tooltips={tooltipsFrequency}
                        value={formData.sus6}
                        onChange={(value) => modifyStateProperty(formData, setFormData, "sus6", value)} />
                </Form.Item>
            </Form>
    )
}