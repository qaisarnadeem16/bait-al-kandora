import { FC } from "react";
import styled from 'styled-components';

const ParagraphFormContainer = styled.div` 
    margin-bottom: 20px;
`;

const P = styled.p`
`;

const ParagraphForm: FC<{ formJson: any | null }> = ({ formJson }) => {
    return (
        <ParagraphFormContainer>
            <P>
                {formJson.content}
            </P>
        </ParagraphFormContainer>
    );
}
export default ParagraphForm;