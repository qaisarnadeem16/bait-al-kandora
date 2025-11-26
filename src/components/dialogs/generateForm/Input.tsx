import { FC, useState } from "react";
import styled from 'styled-components';

const InputAndLabelContainer = styled.div` 
    display: flex;
    flex-flow: column;
    grid-gap: 5px;
    margin-bottom: 20px;
`;

const Label = styled.span`
`;

const InputTag = styled.input`  
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

const Input: FC<{
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
        <InputAndLabelContainer>
            <Label>{formJson.label + (formJson.required ? "*" : "")}</Label>
            <InputTag
                readOnly={readonly}
                required={formJson.required}
                type={formJson.type || 'text'}
                onChange={e => changeValue(e)}
                value={text ?? ""}
                name={formJson.name}
                placeholder={formJson.placeholder}
                minLength={formJson.min_length}
                maxLength={formJson.max_length}
            />
            {formJson.sufix}
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}
        </InputAndLabelContainer>
    );
}
export default Input;