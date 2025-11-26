import { Icon } from 'components/Atomic';
import styled from 'styled-components';
import { EditTextItem } from '../widgets/ItemText';
import { EditImageItem } from '../widgets/ItemImage';
import { DialogWindow } from 'components/dialogs/Dialogs';
import { ReactComponent as ArSolid } from '../../assets/icons/ar.svg';
import { ReactComponent as AISolid } from '../../assets/icons/ai.svg';

export const GroupsContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 130px;
	width: 130px;
	overflow: auto;
	min-height: 0;

	@media (max-width: 1025px) {
		min-width: 100px;
		width: 100px;
	}

	@media (max-width: 1024px) {
		width: 100%;
		height: 90px;
		flex-direction: row;
		overflow: hidden;
	}
`;

export const GroupItem = styled.div`
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
	height: 100px;
	width: 100px;
	margin-bottom: 20px;
	text-align: center;
	cursor: pointer;
	padding: 0px 10px 0px 10px;

	&:hover {
		background-color: white;
	}

	&.selected {
		background-color: white;
	}

	span {
		font-size: 12px;
	}

	@media (max-width: 1025px) {
		min-width: 90px;
		padding-right: 5px;
	}

	@media (max-width: 1024px) {
		min-width: 110px;
		margin-bottom: 0;
		margin-right: 10px;
	}
	@media (max-width: 42px) {
		min-width: 100px;
	}
`;

export const GroupIcon = styled.img`
	width: 100%;
	height: 40px;
	object-fit: contain;
	margin-bottom: 10px;
    max-width: 40%;
`;

export const GroupStar = styled(Icon)`
	min-width: 40px;
	min-height: 40px;
`;

export const AttributesContainer = styled.div`
	background-color: white;
	flex: 1;
	padding: 40px;
	min-height: 0;
	overflow: auto;
	display: flex;
	flex-direction: column;

	@media (max-width: 1024px) {
		padding: 5px;
	}
`;

export const ItemContainer = styled.div<{ selected: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: left;
	min-height: 60px;
	border-bottom: 5px solid transparent;
	cursor: pointer;
	${(props) => props.selected && `border-bottom: 5px solid #c4c4c4;`}

	&:hover {
		border-bottom: 5px solid #c4c4c4;
	}
`;

export const ItemAccordionContainer = styled.div``;

export const ItemName = styled.span`
	font-size: 12px;
	font-weight: 600;
	overflow-wrap: anywhere;
`;

export const ItemAccordion = styled.div<{ opened?: boolean }>`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 20px;
	cursor: pointer;
	margin-bottom: 20px;
	${(props) => props.opened && `border-bottom: 5px solid #f5f6f7;`}
`;

export const ItemAccordionName = styled.span`
	font-size: 16px;
	text-transform: uppercase;
	font-weight: 600;
	display: block;
`;

export const ItemAccordionDescription = styled.span``;

export const ArrowIcon = styled.img`
	width: 10px;
`;

export const OptionSelectedName = styled.span`
	font-size: 12px;

	@media (max-width: 1400px) {
		font-size: 12px;
		display: block;
		position: static;
	}
`;

export const OptionsContainer = styled.div`
	display: flex;
	flex: 1;
	align-items: flex-start;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
`;

export const Options = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
	gap: 20px;
	list-style: none;
	user-select: none;
	align-items: start;
	justify-content: start;
	padding: 30px 0px;
	width: 100%;
	@media (min-width: 1920px) {
		grid-template-columns: repeat(auto-fill, minmax(100px, 110px));
	}
`;

export const TemplatesContainer = styled.div`
	display: flex;
	flex-direction: row;
	grid-gap: 5px;
	align-items: flex-start;
	margin-bottom: 40px;
	overflow: hidden;
	min-height: 0;
`;

export const Template = styled.div<{ selected?: boolean }>`
	padding: 10px;
	cursor: pointer;

	&:hover {
		background-color: #f4f4f4;
	}

	${(props) =>
		props.selected &&
		`
       background-color: #f4f4f4;
    `}
`;

export const ViewerContainer = styled.div`
	position: relative;
	min-height: 0;

	@media (max-width: 1024px) {
		height: 100%;
	}
`;

export const ZoomInIcon = styled(Icon)<{ $isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 32px;
	height: 32px;
	z-index: 3;
	${(props) =>
		props.$isMobile
			? `
		top: calc(10%);
		`
			: `top: calc(30%);`}
	@media (max-height: 550px) {
		top: calc(5%);
	}
`;

export const ZoomOutIcon = styled(Icon)<{ $isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 32px;
	height: 32px;
	z-index: 3;
	${(props) =>
		props.$isMobile
			? `
		top: calc(10% + 50px);
		`
			: `top: calc(30% + 50px);`};
	@media (max-height: 550px) {
		top: calc(5% + 40px);
	}
`;

export const ResetIcon = styled(Icon)<{ $isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 27px;
	height: 27px;
	z-index: 3;
	${(props) =>
		props.$isMobile
			? `
		top: calc(10% + 100px);
		`
			: `top: calc(30% + 100px);`};

	@media (max-height: 550px) {
		top: calc(5% + 80px);
	}
`;

export const UndoIcon = styled(Icon)<{ $isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 27px;
	height: 27px;
	z-index: 3;
	${(props) =>
		props.$isMobile
			? `
		top: calc(10% + 200px);
		`
			: `top: calc(30% + 200px);`};

	@media (max-height: 550px) {
		top: calc(5% + 120px);
	}
`;

export const RedoIcon = styled(Icon)<{ $isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 27px;
	height: 27px;
	z-index: 3;
	${(props) =>
		props.$isMobile
			? `
		top: calc(10% + 150px);
		`
			: `top: calc(30% + 150px);`};

	@media (max-height: 550px) {
		top: calc(5% + 160px);
	}
`;

export const CollapseIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const ExplodeIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const FullscreenIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const SecondScreenIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const RecapPanelIcon = styled(Icon)`
	position: absolute;
	left: 20px;
	bottom: 40px;
	width: 32px;
	height: 32px;
	z-index: 3;
	@media (max-height: 550px) {
		bottom: 20px;
	}
`;

export const TopRightIcons = styled.div`
	position: absolute;
	right: 10px;
	top: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 3;
	gap: 20px;
`;

export const BottomRightIcons = styled.div`
	position: absolute;
	right: 10px;
	bottom: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 3;
	gap: 20px;
	@media (max-height: 550px) {
		bottom: 20px;
	}
`;

export const ArIcon = styled(ArSolid)`
	position: absolute;
	right: 0px;
	top: 20px;
	width: 32px;
	height: 32px;
	cursor: pointer;

	@media (hover) {
		&:hover {
			opacity: 0.5;
		}
	}
`;

export const AiIcon = styled(AISolid)<{ $isArIconVisible?: boolean }>`
	width: 32px;
	height: 32px;
	cursor: pointer;
	position: absolute;
	top: 20px;
	right: 10px;

	${(props) =>
		props.$isArIconVisible &&
		`
    	right: 50px;
    `}
	@media (hover) {
		&:hover {
			opacity: 0.5;
		}
	}
`;

export const TryOnIcon = styled(Icon)`
	position: absolute;
	height: 80px;
	right: 0px;
	bottom: 90px;
	cursor: pointer;
`;

export const Center = styled.div`
	text-align: center;
	font-size: 18px;
	padding: 30px;
`;

export const SupportedFormatsList = styled.span`
	font-size: 16px;
	font-style: italic;
	text-align: center;
	color: #313c46;
	padding-top: 5px;
`;

export const ZakekeDesignerContainer = styled.div<{ $isMobile?: boolean }>`
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	background: #ffffff;
	${(props) =>
		props.$isMobile &&
		`
       position:fixed;
        inset:0;
        z-index:13;
    `}
`;

export const IconsAndDesignerContainer = styled.div`
	position: absolute;
	left: 0;
	top: calc(50% - 30px);
	z-index: 2;
	display: flex;
	flex-direction: column;
`;

export const DesignerContainer = styled.div`
	display: flex;
	flex-flow: column;
	user-select: none;
	width: 100%;
`;

export const UploadButtons = styled.div`
	display: flex;
	flex-direction: column;
	grid-gap: 5px;
	margin: 20px 0px;
`;

export type PropChangeHandler = (
	item: EditTextItem | EditImageItem,
	prop: string,
	value: string | boolean | File
) => void;

export const PriceContainer = styled.div<{ $isMobile?: boolean }>`
	font-size: 20px;
	font-weight: 600;
	color: #313c46;
	margin-right: 20px;
	${(props) =>
		props.$isMobile &&
		`
    margin-right: 0px;
    color:white;`};
`;

export const StepsContainer = styled.div`
	position: relative;
	padding: 0px 20px 20px 20px;

	@media (max-width: 1024px) {
		width: 100%;
		height: 50%;
		flex-direction: column;
		position: relative;
	}
`;

export const ActualStepName = styled.h4<{ $isMobile?: boolean }>`
	text-align: center;
	margin: 0;
	${(props) => !props.$isMobile && `margin-top: 15px;`}
	font-weight: 500;
	color: #313c46;
`;

export const QuantityContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 70px;
	background-color: white;
	padding-left: 10px;
	color: #313c46;
	grid-gap: 10px;
	/* min-width: 150px; */
	/* input{
		min-width: 100px;
	} */
`;

export const FooterMobileContainer = styled.div<{ isQuoteEnable?: boolean }>`
	height: 70px;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	background-color: #fff;
	font-size: 12px;
	margin-top: 4px;
	border-top: 1px #fff solid;
	grid-template-areas: 'back pdf save share cart';
	${(props) =>
		props.isQuoteEnable &&
		`
	grid-template-columns: repeat(6, 1fr);
	grid-template-areas: 'back pdf save share cart quote' 
	`};
`;

export const AttributeDescription = styled.p`
	margin: 0;
`;

export const SelectContainer = styled.div`
	margin-bottom: 30px;
	padding-bottom: 30px;
	border-bottom: 1px #ccc dotted;
	position: relative;
`;

export const ExtensionFieldsContainer = styled.div`
	margin: 0px auto;
	display: flex;
	flex-direction: row;
`;

export const ExtensionFieldItem = styled.div`
	border-right: 1px solid black;
	padding: 0px 5px;
	text-align: right;
`;

export const CustomQuotationConfirmMessage = styled(DialogWindow)`
	display: flex;
	align-items: center;
	justify-content: center;
`;
