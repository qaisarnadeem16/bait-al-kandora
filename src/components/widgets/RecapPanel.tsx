import { FC } from "react";
import { isEmpty } from "lodash";
import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from "../../Helpers";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';
import { Icon } from "components/Atomic";


const RecapPanelContainer = styled.div`
    position: absolute;
    left: 50px;
    bottom: 35px;
    z-index: 3;
    min-width: 170px;  
    @media (max-height: 550px) {
		bottom: 25px;
	}
`;

const RecapPanelContent = styled.div`
    opacity: 0.9;
    min-height: 90px;
    margin-left: 15px;
    box-shadow: 1px 1px 6px #a59b9b;
    background: white;
    position:relative;
    padding: 5px;
`;

const RemoveIcon = styled(Icon)`
    position: absolute;
    right: 5px;
    width:15px;
`;

const Item = styled.div`
    margin: 0 0 10px 20px;
    font-size: 12px;
`;

const Label = styled.div`
    text-transform: capitalize;
`;

const Value = styled.div`
    text-transform: capitalize;
    font-weight: bold;
`;

const ArrowLeft = styled.div`
    position: absolute;
    width: 0;
    height: 0;
    bottom: 10px;
    left: 5px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid white;
    @media (max-height: 550px) {
		bottom: 0px;
	}
`;

const NoOptionsContainer = styled.div`
`;

const NoOptionsSpan = styled.span`
`;

const RecapPanel: FC<{ onClose: () => void }> = ({ onClose }) => {

    const { currentAttributesSelection, sellerSettings } = useZakeke();
    const allSettings: React.ReactNode[] = [];

    const setItemsForTheRecapPanel = (currentAttributesSelection: object) => {

        Object.entries(currentAttributesSelection)
            .sort(([key1, item1], [key2, item2]) => {
                return ((item1 as any).groupDisplayOrder - (item2 as any).groupDisplayOrder)
                    || ((item1 as any).stepDisplayOrder - (item2 as any).stepDisplayOrder)
                    || ((item1 as any).attributeDisplayOrder - (item2 as any).attributeDisplayOrder)
                    || ((item1 as any).optionDisplayOrder - (item2 as any).optionDisplayOrder);
            })
            .forEach(([key, item], index) => {
                let label = key;
                if ((item as any).showGroup) {
                    label = `${(item as any).groupName} ${T._d(key)}`;
                }

                allSettings.push(
                    (<Item key={index}>
                        <Label>{label}: </Label>
                        <Value>{(item.value)}</Value>
                    </Item>)
                );
            });

        if (isEmpty(allSettings)) {
            allSettings.push(
                (<NoOptionsContainer key="no-items">
                    <NoOptionsSpan>{T._("No Options Selected.", "Composer")}</NoOptionsSpan>
                </NoOptionsContainer>)
            );
        }
    }

    if (currentAttributesSelection)
        setItemsForTheRecapPanel(currentAttributesSelection);

    return <RecapPanelContainer key="recap-container">
        <RecapPanelContent key="recap-content">

            {sellerSettings?.canUserCloseCompositionRecap && <RemoveIcon onClick={onClose}><CloseIcon /></RemoveIcon>}
            {allSettings}
        </RecapPanelContent>
        <ArrowLeft />
    </RecapPanelContainer>
}

export default RecapPanel;