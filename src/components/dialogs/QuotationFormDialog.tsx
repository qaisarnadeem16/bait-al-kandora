import { FC, useState } from "react";
import styled from 'styled-components';
import { T } from "../../Helpers";
import { Dialog, DialogWindow } from "./Dialogs";
import GenerateForm from "./generateForm/GenerateForm";

const CustomWindow = styled(DialogWindow)`
  max-width: 600px;
  height: 80%;
  padding: 30px;
  svg{
    height:15px;
  }
  @media (max-width: 1024px) {
    padding:5px;
  }
`;

const H3 = styled.h3`
    text-align: center;
    margin-top: 0px;
`;

const QuotationFormDialog: FC<{ getQuoteRule: any, onFormSubmit: (result: any) => void }> = ({ getQuoteRule, onFormSubmit }) => {

  const [updatedJson, setUpdatedJson] = useState<any>(JSON.parse(getQuoteRule?.formControlsData));

  const onConfirm = () => {
    onFormSubmit(updatedJson);
  }

  return <Dialog
    windowDecorator={CustomWindow}
    alignButtons="center"
    noMarginFooterButton
    buttons={[
      {
        label: T._("Send", "Composer"),
        onClick: () => onConfirm(),
        isFullWidth: true,
        upperCase: true
      }]}
  >
    <>
      <H3>{T._("Request quotation", "Composer")}</H3>
      <GenerateForm
        updatedJson={updatedJson}
        setUpdatedJson={setUpdatedJson}
        readonly={false}
        showSubmitButton={true}
        submitLabel={T._("Send", "Composer")}
      />
    </>
  </Dialog >;
}
export default QuotationFormDialog;