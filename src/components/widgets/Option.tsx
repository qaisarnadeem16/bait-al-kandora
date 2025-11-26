import { useUndoRegister, useUndoRedoActions, T } from "Helpers";
import { FC } from "react";
import styled from "styled-components";
import { Option, useZakeke, Attribute } from '@zakeke/zakeke-configurator-react';
import Tooltip from "./tooltip";

const OptionContainer = styled.div<{ optionShape: number, selected: boolean, hasDescriptionIcon: boolean }>`
    display:flex;
    flex-flow:column;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    position:relative;
    padding: ${props => props.hasDescriptionIcon ? '26px' : '10px'} 0px 10px 0;
    user-select: none;
    width: 100%;
    min-width: 0;

    &:hover {
        background-color: #f5f6f7;
    }
    
    ${props => props.selected && `
        background-color: #f5f6f7;
    `}
`;

const OptionIconContainerStyled = styled.div`
   overflow: hidden;
   width: 100%;
   aspect-ratio: 1;
   padding: 0 10px;
`;

const OptionIconContainer: FC<{
    children?: React.ReactNode
}> = ({ children }) => {
    return <OptionIconContainerStyled>{children}</OptionIconContainerStyled>;
}

const OptionIcon = styled.img<{ optionShape?: boolean }>`
    object-fit: contain;
    width: 100%;
    height: 100%;
    aspect-ratio: 1;

    ${props => props.optionShape && `
        border-radius: 100%;
        object-fit: cover;
    `};
`;

const OptionName = styled.span`
    font-size:12px;
    margin-top: 10px;
    text-align:center;
    overflow:hidden;

    @media (max-width: 1025px) {
        font-size:10px;
        margin-top: 2px;
        text-align:center;
    }

    @media (max-width: 1024px) {
        font-size:10px;
        text-align:center;
    }
`;

const OptIconContainer = styled.div`
    width: 100%;
    aspect-ratio: 1;
`;

const OptionItem: FC<{ selectedAttribute: Attribute | null | undefined, option: Option, hasDescriptionIcon: boolean }> = ({ selectedAttribute, option, hasDescriptionIcon }) => {

    const selectedOptionId: number | null = selectedAttribute?.options.find(opt => opt.selected)?.id ?? null;

    const { selectOption } = useZakeke();
    const undoRegistering = useUndoRegister();
    const undoRedoActions = useUndoRedoActions();

    const handleOptionSelection = (option: Option) => {
        const undo = undoRegistering.startRegistering();
        undoRedoActions.eraseRedoStack();
        undoRedoActions.fillUndoStack({ type: "option", id: selectedOptionId, direction: "undo" });
        undoRedoActions.fillUndoStack({ type: "option", id: option.id, direction: "redo" });

        selectOption(option.id);
        undoRegistering.endRegistering(undo);

        try {
            if ((window as any).algho)
                (window as any).algho.sendUserStopForm(true);
        } catch (e) { }
    }

    return <OptionContainer
        hasDescriptionIcon={hasDescriptionIcon}
        selected={option.selected}
        optionShape={option.attribute.optionShapeType}
        onClick={() => handleOptionSelection(option)}>

        <OptionIconContainer>
            {option.description && option.description.length !== 0 &&
                <Tooltip key={"tooltip" + option.guid} optionDescription={option.description} />
            }
            {option.imageUrl && <OptIconContainer><OptionIcon loading="lazy" 
            // fetchpriority="low" 
            src={option.imageUrl ?? ""} optionShape={option.attribute.optionShapeType === 2} /></OptIconContainer>}
        </OptionIconContainer>

        {!option.attribute.hideOptionsLabel && <OptionName >{T._d(option.name)}</OptionName>}
    </OptionContainer>;
}

export default OptionItem;