import { FC } from "react";
import styled from 'styled-components';

const CheckboxAndLabelContainer = styled.div`
    display: flex;
    flex-flow: column;
    grid-gap: 5px;
    margin-bottom: 20px;
    align-items: left;
    justify-content: center;
`;

const Label = styled.span`
`;

const Checkbox = styled.input`
    width: 13px;
`;

const CheckBoxForm: FC<{
    readonly: boolean | false,
    index: number,
    updateJson: (index: number, value: any) => void,
    formJson: any | null
}> = ({ readonly, index, updateJson, formJson }) => {

    const changeValue = (e: any) => {
        updateJson(index, e.target.value);
    }

    return (
        <CheckboxAndLabelContainer>
            <Label>{formJson.label + (formJson.required ? "*" : "")}</Label>
            <Checkbox
                type="checkbox"
                readOnly={readonly}
                required={formJson.required}
                defaultChecked={formJson.defaultSelected}
                name={formJson.name}
                onChange={e => changeValue(e)}
            />
            {formJson.sufix}
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}

        </CheckboxAndLabelContainer>
    );
}
export default CheckBoxForm;