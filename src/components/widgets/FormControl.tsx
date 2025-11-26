import { FC } from "react";
import styled from "styled-components";

const FormControlLabel = styled.div`
    padding:10px 0px;
    display:flex;
    justify-content:space-between;
`;

const FormControlContainer = styled.div<{ rightComponent?: any }>`
    display: flex;
    flex-direction:column;
    justify-content:center;
    grid-gap:5px;
    margin-bottom:10px;
`;

export const FormControl: FC<{
    label: string,
    rightComponent?: any,
    children?: React.ReactNode
}> = ({ label, rightComponent, children }) => {
    return <FormControlContainer>
        <FormControlLabel>
            <span>{label}</span>
            {rightComponent}
        </FormControlLabel>
        {children}
    </FormControlContainer>;
};