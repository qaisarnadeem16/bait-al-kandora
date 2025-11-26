import { T } from "Helpers";
import { FC } from "react";
import styled from 'styled-components';
import { ReactComponent as CloseSvg } from './times-circle.svg'

const LineItemsAndLabelsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    align-items: left;
    justify-content: center;
`;

const Label = styled.span`
`;

const H4 = styled.h4`
    margin: 0px 0px 20px 0px;
`;

const LineItemsContainer = styled.div`
`;

const LineItemsList = styled.ul`
    margin:0px;
    padding-left: 0px;
`;

const LineItemRow = styled.li<{ isRemovable: boolean }>`
    list-style-type: none;
    display: grid;
    grid-template-columns: 20% 79%;
    grid-gap: 5px;
    ${props => props.isRemovable && `grid-template-columns: 20% 74% 5%`};
    margin-bottom: 10px;
`;

const RowItem = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
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

const AddRowButton = styled.div`
    padding: 5px;
    width: 80px;
    text-align: center;
    border: 1px #414042 solid;
    margin-top: 10px;
    cursor: pointer;
`;

const CloseIcon = styled(CloseSvg)`
    height: 25px !important;
    margin-top: auto;
    cursor: pointer;
`

const LineItems: FC<{
    readonly: boolean | false,
    index: number,
    updateJson: (index: number, value: any) => void,
    formJson: any | null
}> = ({ readonly, index, updateJson, formJson }) => {

    const updateDetails = (indexDetail: number, e: any, isQuantity: boolean) => {
        let newDetails = [...formJson.value];
        if (newDetails) {
            if (isQuantity)
                newDetails!.find((x: any, itemIndex: number) => itemIndex === indexDetail)!.quantity = e.target.value;
            else
                newDetails!.find((x: any, itemIndex: number) => itemIndex === indexDetail)!.description = e.target.value;
        }
        updateJson(index, newDetails);
    }

    const removeDetailsItem = (indexDetail: number) => {
        let filteredDetails = [...formJson.value]!.filter((x: { quantity: string, description: string }, i: number) => i !== indexDetail);
        updateJson(index, filteredDetails);
    }

    const addNewDetailItem = () => {
        let newDetails = [];
        newDetails.push(...formJson.value, { quantity: "", description: "" });
        updateJson(index, newDetails);
    }

    return (
        <LineItemsAndLabelsContainer>
            <H4>{T._("Line items", "Admin")}</H4>
            <Label>{formJson.label + (formJson.required ? "*" : "")}</Label>
            <LineItemsContainer>
                <LineItemsList>
                    {
                        formJson.value && formJson.value.map((item: { quantity: string, description: string }, index: number) => (
                            <LineItemRow className="row" key={index} isRemovable={index > 0}>
                                <RowItem>
                                    <Label>{T._("Quantity", "Admin")}</Label>
                                    <Input
                                        readOnly={readonly}
                                        type="number"
                                        placeholder={T._("Quantity", "Admin")}
                                        value={item.quantity}
                                        onChange={(e) => {
                                            updateDetails(index, e, true);
                                        }} />
                                </RowItem>
                                <RowItem>
                                    <Label>{T._("Details", "Admin")}</Label>
                                    <Input
                                        readOnly={readonly}
                                        type="text"
                                        placeholder={T._("Product variation", "Admin")}
                                        value={item.description}
                                        onChange={(e) => {
                                            updateDetails(index, e, false);
                                        }} />
                                </RowItem>
                                {(index > 0 && !readonly) &&
                                    <CloseIcon onClick={() => removeDetailsItem(index)}>
                                    </CloseIcon>
                                }
                            </LineItemRow>))
                    }
                </LineItemsList>
                {!readonly && <AddRowButton onClick={() => addNewDetailItem()}>{T._("Add line", "Admin")}</AddRowButton>}
            </LineItemsContainer>
            {formJson.tipText ? (<p>{formJson.tipText}</p>) : ("")}
        </LineItemsAndLabelsContainer>
    );
}
export default LineItems;