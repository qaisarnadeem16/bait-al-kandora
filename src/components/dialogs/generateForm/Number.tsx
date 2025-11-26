import { FC, useState } from "react";
import styled from 'styled-components';

const NumberAndLabelContainer = styled.div`
    display: flex;
    flex-flow: column;
    grid-gap: 5px;
    margin-bottom: 20px;
`;

const Label = styled.span`
`;

const NumberTag = styled.input`
    height: 38px;
    border: 1px #f4f4f4 solid;
    padding: 5px;
    &:hover{
    border: 1px #414042 solid;
    }

    &:focus{
    border: 1px #414042 solid;
    outline:none;
    }
`;

const Number: FC<{
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
        <NumberAndLabelContainer>
            <Label>{formJson.label + (formJson.required ? "*" : "")}</Label>
            <NumberTag
                required={formJson.required}
                type="number"
                onChange={e => changeValue(e)}
                value={text ?? ""}
                name={formJson.name}
                placeholder={formJson.placeholder}
                step={formJson.step}
                min={formJson.min_value}
                max={formJson.max_value}
            />
            {formJson.sufix}
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}
        </NumberAndLabelContainer>
    );
}
export default Number;