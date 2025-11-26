import { FC } from "react";
import styled from 'styled-components';

const RadiosAndLabelContainer = styled.div` 
    display: flex;
    flex-flow: column;
    grid-gap: 5px;
    margin-bottom: 20px;
`;

const RadiosLabel = styled.span`
`;

const FormCheck = styled.div`
    display: flex;
    flex-flow: row;
`;

const InputRadio = styled.input`
`;

const Label = styled.label`
`;

const RadioGroup: FC<{
    readonly: boolean | false,
    index: number,
    updateJson: (index: number, value: any) => void,
    formJson: any | null
}> = ({ readonly, index, updateJson, formJson }) => {

    const changeValue = (e: any) => {
        updateJson(index, e.target.value);
    }

    return (
        <RadiosAndLabelContainer>
            <RadiosLabel>{formJson.label + (formJson.required ? "*" : "")}</RadiosLabel>
            {formJson.options.map((item: any, index: number) => (
                <FormCheck key={index}>
                    <InputRadio
                        readOnly={readonly}
                        type="radio"
                        name={formJson.name}
                        id="gridRadios1"
                        required={formJson.required}
                        value={item.value}
                        defaultChecked={formJson.value === item.value}
                        onChange={e => changeValue(e)} />
                    <Label htmlFor="gridRadios1">
                        {item.label}
                    </Label>
                </FormCheck>
            ))}
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}
        </RadiosAndLabelContainer>
    );
}
export default RadioGroup;