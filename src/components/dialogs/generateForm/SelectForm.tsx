import { FC, useState } from "react";
import styled from 'styled-components';

const SelectAndLabelContainer = styled.div` 
    display: flex;
    flex-direction: column;
    grid-gap: 5px;
    margin-bottom: 20px;
    align-items: left;
    justify-content: center;
`;

const Label = styled.span`
`;

const Select = styled.select`
    height: 38px;
    border: 1px #f4f4f4 solid;
    padding: 2px;
    &:hover{
    border: 1px #414042 solid;
    }

    &:focus{
    border: 1px #414042 solid;
    outline:none;
    }
`;

const SelectForm: FC<{
    readonly: boolean | false,
    index: number,
    updateJson: (index: number, value: any) => void,
    formJson: any | null
}> = ({ readonly, index, updateJson, formJson }) => {

    const [text, setText] = useState();

    const changeValue = (e: any) => {
        setText(e.target.value);
        updateJson(index, e.target.value);
    }

    return (
        <SelectAndLabelContainer>
            <Label>{formJson.label + (formJson.required ? "*" : "")}</Label>
            <Select
                value={text}
                name={formJson.name}
                disabled={readonly}
                required={formJson.required}
                onChange={(e) => changeValue(e)}>
                {formJson.options.map((item: any, index: number) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </Select>
            {formJson.sufix}
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}
        </SelectAndLabelContainer >
    );
}
export default SelectForm;