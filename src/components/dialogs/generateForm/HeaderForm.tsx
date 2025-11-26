import { FC } from "react";
import styled from 'styled-components';

const HeaderFormContainer = styled.div` 
    margin-bottom: 20px;
`;

const H1 = styled.h1`
`;

const H2 = styled.h2`
`;

const H3 = styled.h3`
`;

const H4 = styled.h4`
`;

const H5 = styled.h5`
`;

const H6 = styled.h6`
`;

const HeaderForm: FC<{ formJson: any | null }> = ({ formJson }) => {
    return (
        <HeaderFormContainer>
            {(() => {
                switch (formJson.headerlevel) {
                    case "h1":
                        return <H1>{formJson.headertext}</H1>
                    case "h2":
                        return <H2>{formJson.headertext}</H2>
                    case "h3":
                        return <H3>{formJson.headertext}</H3>
                    case "h4":
                        return <H4>{formJson.headertext}</H4>
                    case "h5":
                        return <H5>{formJson.headertext}</H5>
                    case "h6":
                        return <H6>{formJson.headertext}</H6>
                }
            })()}
        </HeaderFormContainer>
    );
}
export default HeaderForm;