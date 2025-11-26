import { FC, useState } from "react";
import styled from 'styled-components';

const TextAreaAndLabelContainer = styled.div`
    display: flex;
    flex-flow: column;
    grid-gap: 5px;
    margin-bottom: 20px;
`;

const Label = styled.span`
`;

const TextAreaTag = styled.textarea`
    height: 100px;
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

const TextArea: FC<{
    readonly: boolean | false,
    index: number,
    updateJson: (index: number, value: any) => void,
    formJson: any | null
}> = ({ readonly, index, updateJson, formJson }) => {

    const [text, setText] = useState<string>("");

    const changeValue = (e: any) => {
        setText(e.target.value);
        updateJson(index, e.target.value);
    }

    return (
        <TextAreaAndLabelContainer>
            <Label>{formJson.label + (formJson.required ? "*" : "")}</Label>
            <TextAreaTag
                readOnly={readonly}
                required={formJson.required}
                name={formJson.name}
                id=""
                cols={formJson.cols || 30}
                rows={formJson.rows || 10}
                defaultValue={text ?? ""}
                placeholder={formJson.placeholder}
                minLength={formJson.min_length}
                maxLength={formJson.max_length}
                className={formJson.class || "form-control"}
                onChange={e => changeValue(e)}
            />
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}
        </TextAreaAndLabelContainer>
    );
}
export default TextArea;