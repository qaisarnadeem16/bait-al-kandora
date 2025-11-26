
import { FC } from "react";
import styled from 'styled-components';
import Input from "./Input";
import TextArea from "./TextArea";
import Number from "./Number";
import RadioGroup from "./RadioGroup";
import CheckBoxForm from "./CheckBoxForm";
import SelectForm from "./SelectForm";
import HeaderForm from "./HeaderForm";
import ParagraphForm from "./paragraphForm";
import LineItems from "./LineItems";

const FormContainer = styled.div`
`;

const Form = styled.form`
`;

const FormItem = styled.div`     
`;

const GenerateForm: FC<{
    updatedJson: any | null,
    setUpdatedJson: (updatedJson: any) => void,
    readonly: boolean | false,
    showSubmitButton: boolean | null,
    submitLabel: string
}> = ({ readonly, updatedJson, setUpdatedJson }) => {


    const updateJson = (index: number, value: any) => {
        const newJson = [...updatedJson];
        newJson.find((x: any, itemIndex: number) => itemIndex === index).value = value;
        setUpdatedJson(newJson);
    }

    return <FormContainer>
        <Form>
            <>
                {updatedJson && updatedJson.map((item: any, index: number) => {
                    return <FormItem key={index}>
                        {(() => {
                            switch (item.typeField) {
                                case "text":
                                    return <Input key={index} readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                                case "textArea":
                                    return <TextArea readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                                case "number":
                                    return <Number readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                                case "inputRadio":
                                    return <RadioGroup readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                                case "inputCheckbox":
                                    return <CheckBoxForm readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                                case "select":
                                    return <SelectForm key={index} readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                                case "paragraph":
                                    return <ParagraphForm formJson={item} />
                                case "header":
                                    return <HeaderForm formJson={item} />
                                case "lineItems":
                                    return <LineItems readonly={readonly} index={index} updateJson={updateJson} formJson={item} />
                            }
                        })()}
                    </FormItem>
                })}
            </>
        </Form>
    </FormContainer>
}
export default GenerateForm;
