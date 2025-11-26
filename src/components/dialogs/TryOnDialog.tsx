import { T } from "Helpers";
import { FC } from "react";
import styled from 'styled-components';
import { Dialog } from "./Dialogs";

const TryOnDialogContainer = styled.div`
  display:flex !important;
  justify-content:center !important;    
  text-align:center;
  background-color: #f6efe5;
  color:#949089;
`;

const TryOnDialog: FC<{ onCloseClick: () => void, url: string , onConfirm: () => void }> = ({ onCloseClick,onConfirm,  url }) => {
  return <Dialog title={T._('Try On', 'Composer')}>
    <TryOnDialogContainer>
    </TryOnDialogContainer>
  </Dialog>
}
export default TryOnDialog;