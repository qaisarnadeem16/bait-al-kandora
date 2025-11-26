import { FC } from "react";
import styled from 'styled-components';
import { T } from "../../Helpers";
import { Dialog } from "./Dialogs";

const PdfDialogContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;    
  text-align:center;
  background-color: white;
  color:#465664;
  font-size:18px;
  padding:30px;
  line-height:1.6;
`;

const SpanContainer = styled.div`
  display:flex;
  flex-direction:column;
  padding-bottom:30px;  
  font-weight:500px;
  `;

const PdfDialog: FC<{ onCloseClick: () => void, url: string }> = ({ onCloseClick, url }) => {
  return <Dialog
    title={T._('PDF Preview', 'Composer')}
    buttons={[
      { label: T._('Download', 'Composer'), onClick: () => window.open(url, "_blank") }
    ]}
    alignButtons="center"
    noMarginFooterButton>
    <PdfDialogContainer>
      <SpanContainer>
        <span>{T._('The PDF preview is ready.', 'Composer')}</span>
      </SpanContainer>
      <SpanContainer>
        <span>{T._('In case the PDF is of low resolution, please go back to the editor, zoom in and try again.', 'Composer')}</span>
      </SpanContainer>
    </PdfDialogContainer>
  </Dialog>;
}
export default PdfDialog;