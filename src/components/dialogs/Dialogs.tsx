import { T } from 'Helpers';
import React, { FunctionComponent, ReactElement, Suspense, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'components/Atomic';
import styled from 'styled-components';
import useStore from '../../Store';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';

// Get the dialogs portal element
const dialogsPortal = document.getElementById('dialogs-portal')!;

// Create a context for managing dialogs
export const dialogContext = React.createContext({ dialogId: '' });

// Custom hook for managing dialogs
export function useDialogManager() {
	const { addDialog, removeDialog } = useStore();
	const { dialogId } = useContext(dialogContext);

	const showDialog = (key: string, dialog: ReactElement) => addDialog(key, dialog);
	const closeDialog = (key: string) => removeDialog(key);

	return {
		currentDialogId: dialogId,
		showDialog,
		closeDialog
	};
}

// Overlay for the dialog
const DialogOverlay = styled.div`
	position: fixed;
	background-color: rgba(0, 0, 0, 0.7);
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 40px;
	overflow: auto;
	z-index: 12;
	@media (max-width: 1024px) {
		padding: 20px;
	}
`;

// Container for the dialog window
const DialogWindowContainer = styled.div`
	padding: 20px;
	background-color: white;
	border-radius: 5px;
	flex-basis: 600px;
	display: flex;
	flex-direction: column;
	position: relative;
	min-width: 0;
`;

// Close icon for the dialog window
const DialogWindowClose = styled(CloseIcon)`
	position: absolute;
	right: 10px;
	top: 10px;
	cursor: pointer;
	font-size: 20px;
	z-index: 999;
	width: 24px;
	height: 24px;

	&:hover {
		opacity: 0.5;
	}
`;

// Component for the dialog window
export const DialogWindow: FunctionComponent<{
	children?: React.ReactNode;
	className?: string;
	showCloseButton?: boolean;
	onClose: () => void;
}> = ({ children, className, showCloseButton = true, onClose }) => {
	return (
		<DialogWindowContainer className={className}>
			{showCloseButton && <DialogWindowClose onClick={onClose} />}
			{children}
		</DialogWindowContainer>
	);
};

// Content of the dialog
const DialogContent = styled.div<{ hasTitle?: boolean }>`
	overflow-y: auto;
	padding: 4px;
	flex: 1;
	min-height: 0;
	max-height: 450px;
	${(props) => props.hasTitle && `margin-top: 20px;`}
`;

// Button for the dialog footer
export const DialogFooterButton = styled(Button)<{
	isMobile?: boolean;
	isFullWidth?: boolean;
	upperCase?: boolean;
	isSaveButton?: boolean;
}>`
	${(props) => !props.isSaveButton && `min-width:200px`};
	${(props) => props.isFullWidth && `width: 100%`};
	${(props) => props.upperCase && `text-transform: uppercase`};
	${(props) =>
		props.isMobile &&
		`
			flex:1;
			width:unset;
			font-size:12px;
			min-width: 100px;
		`};
`;

// Footer of the dialog
const DialogFooter = styled.div<{
	alignButtons?: string;
	noMarginFooterButton?: boolean;
	marginButtons?: number;
	isMobile?: boolean;
}>`
	display: flex;
	align-items: center;
	${(props) => props.alignButtons === 'left' && 'justify-content:flex-start'};
	${(props) => props.alignButtons === 'center' && 'justify-content:center'};
	${(props) => (props.alignButtons === 'right' || !props.alignButtons) && 'justify-content:flex-end'};
	padding: 20px 4px 0px 4px;

	${DialogFooterButton} + ${DialogFooterButton} {
		margin-left: ${(props) =>
			props.noMarginFooterButton ? '0' : props.marginButtons ? props.marginButtons + 'px' : '20px'};
	}
`;

// Title of the dialog
const DialogTitle = styled.h1`
	font-size: 15px;
	text-align: left;
	margin: 0;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	padding: 20px;
	width: 100%;
`;

// Interface for a dialog button
interface DialogButton {
	label: string;
	secondary?: boolean;
	disabled?: boolean;
	onClick?: (url?: string) => void;
	isFullWidth?: boolean;
	upperCase?: boolean;
	isSaveButton?: boolean;
}

// Interface for dialog props
interface DialogProps {
	showCloseButton?: boolean;
	children?: React.ReactNode;
	onClose?: () => void;
	title?: string;
	windowDecorator?: React.FunctionComponent<any>;
	buttons?: DialogButton[];
	alignButtons?: string;
	marginButtons?: number;
	noMarginFooterButton?: boolean;
}

// Component for a dialog
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
	const Window = props.windowDecorator || DialogWindow;
	const { removeDialog, isMobile } = useStore();
	const { dialogId } = useContext(dialogContext);
	const onClose = props.onClose || (() => removeDialog(dialogId));
	return (
		<DialogOverlay>
			{React.createElement(
				Window,
				{ onClose, showCloseButton: props.showCloseButton },
				<React.Fragment>
					{props.title && <DialogTitle>{props.title}</DialogTitle>}
					<DialogContent ref={ref} hasTitle={props.title !== undefined}>
						<Suspense fallback={'Loading...'}>{props.children}</Suspense>
					</DialogContent>

					{props.buttons && props.buttons.length > 0 && (
						<DialogFooter
							isMobile={isMobile}
							noMarginFooterButton={props.noMarginFooterButton}
							alignButtons={props.alignButtons}
							marginButtons={props.marginButtons}
						>
							{props.buttons.map((button) => {
								return (
									<DialogFooterButton
										isMobile={isMobile}
										isFullWidth={button.isFullWidth}
										upperCase={button.upperCase}
										isSaveButton={button.isSaveButton}
										key={button.label}
										disabled={button.disabled}
										primary={!button.secondary}
										onClick={() => button.onClick?.()}
									>
										{button.label}
									</DialogFooterButton>
								);
							})}
						</DialogFooter>
					)}
				</React.Fragment>
			)}
		</DialogOverlay>
	);
});

// Component for rendering dialogs
export const DialogsRenderer: FunctionComponent<{}> = (props) => {
	const { dialogs } = useStore();

	return (
		<>
			{createPortal(
				dialogs.map((x) => (
					<dialogContext.Provider key={x.id} value={{ dialogId: x.id }}>
						{x.dialog}
					</dialogContext.Provider>
				)),
				dialogsPortal
			)}
		</>
	);
};

// #region Basic dialogs

// Styled dialog window with max-width
export const BasicDialogWindow = styled(DialogWindow)`
	max-width: 600px;
`;

// Message dialog component
export const MessageDialog: FunctionComponent<{ message: string } & DialogProps> = ({ message, ...props }) => {
	const { closeDialog } = useDialogManager();
	const { dialogId } = useContext(dialogContext);

	return (
		<Dialog
			windowDecorator={BasicDialogWindow}
			alignButtons='center'
			buttons={[
				{
					label: 'OK',
					onClick: () => {
						closeDialog(dialogId);
						props.onClose?.();
					}
				}
			]}
			{...props}
		>
			<div dangerouslySetInnerHTML={{ __html: message }} />
		</Dialog>
	);
};

// Question dialog component
export const QuestionDialog: FunctionComponent<
	{
		message?: React.ReactNode;
		eventMessage?: string;
		buttonYesLabel?: string;
		buttonNoLabel?: string;
		onYesClick?: () => void;
		onNoClick?: () => void;
	} & DialogProps
> = ({ message, eventMessage, buttonYesLabel, buttonNoLabel, onYesClick, onNoClick, ...props }) => {
	const { closeDialog } = useDialogManager();
	const { dialogId } = useContext(dialogContext);

	return (
		<Dialog
			windowDecorator={BasicDialogWindow}
			buttons={[
				{ label: buttonYesLabel || T._('Yes', 'Admin'), onClick: onYesClick || (() => closeDialog(dialogId)) },
				{
					label: buttonNoLabel || T._('No', 'Admin'),
					secondary: true,
					onClick: onNoClick || (() => closeDialog(dialogId))
				}
			]}
			{...props}
		>
			{message && <p>{message}</p>}
			{eventMessage && <div dangerouslySetInnerHTML={{ __html: eventMessage }} />}
		</Dialog>
	);
};

// #endregion
