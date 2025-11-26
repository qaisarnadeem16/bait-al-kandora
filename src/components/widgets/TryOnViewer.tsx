import {
	TryOnMode,
	TryOnSettings,
	ZakekeTryOnExposedMethods,
	ZakekeTryOnViewer,
	useZakeke
} from '@zakeke/zakeke-configurator-react';
import useStore from 'Store';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { PDSwitch, PDSwitchButtonIcon } from './TryOnsButtons';
import styled from 'styled-components';
import { T } from 'Helpers';
import ErrorDialog from 'components/dialogs/ErrorDialog';
import { Dialog, useDialogManager } from 'components/dialogs/Dialogs';

function useStateAndRef<T>(initial: T): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] {
	const [value, setValue] = useState<T>(initial);
	const valueRef = useRef(value);
	valueRef.current = value;
	return [value, setValue, valueRef];
}

// #region TryOnViewer
/**
 * Component that manages the view of the try-on.
 */
export const TryOnViewer: FC = () => {
	const viewerRef = useRef<ZakekeTryOnExposedMethods>(null);
	const [viewerReady, setViewerReady] = useState(false);
	const [viewerLoaded, setViewerLoaded] = useState(false);
	const [tryOnSettings, setTryOnSettings] = useState<TryOnSettings>();
	const [isSingleButton, setIsSingleButton] = useState(false);

	const { showDialog, closeDialog } = useDialogManager();
	const { hasVTryOnEnabled, getTryOnSettings } = useZakeke();

	const { modeTryOn, setTryOnMode, setTryOnRef, setPdValue } = useStore();

	useEffect(() => {
		const settings = getTryOnSettings();
		setTryOnSettings(settings);
		if (
			tryOnSettings &&
			tryOnSettings.styleButton === 'single' &&
			tryOnSettings.typeSettings.pd &&
			tryOnSettings.typeSettings.try_on
		)
			setIsSingleButton(true);
		else setIsSingleButton(false);
	}, [viewerReady, getTryOnSettings, tryOnSettings]);

	useEffect(() => {
		setViewerReady(false);
		setViewerLoaded(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modeTryOn]);

	useEffect(() => {
		if (viewerRef.current?.mode) setTryOnMode(viewerRef.current?.mode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewerRef.current?.mode]);

	useEffect(() => {
		if (viewerRef) setTryOnRef(viewerRef);
	}, [setTryOnRef, viewerRef]);

	const handleWebcamError = () => {
		viewerRef.current?.setVisible?.(false);
		showDialog(
			'error',
			<ErrorDialog
				error={T._(
					"Oops! It looks like your device doesn't have a camera. To use the Virtual Try-On, please ensure your device has a functioning camera.",
					'Composer'
				)}
				onCloseClick={() => {
					closeDialog('error');
				}}
			/>
		);
	};
	return (
		<Fragment>
			{hasVTryOnEnabled && (
				<ZakekeTryOnViewer
					ref={viewerRef}
					switchable={isSingleButton}
					className='zakeke-try-on-viewer'
					onReady={() => {
						setViewerReady(true);
					}}
					onLoaded={() => {
						setViewerLoaded(true);
					}}
					onWebcamError={() => handleWebcamError()}
					onPDUpdated={(value) => {
						setPdValue(value);
					}}
					onClose={() => {
						viewerRef.current?.setVisible?.(false);
					}}
				>
					{viewerLoaded && modeTryOn === TryOnMode.PDTool && (
						<PupillaryDistanceTool
							onClose={() => {
								viewerRef.current?.closeFrame && viewerRef.current?.closeFrame();
								setViewerReady(false);
								setViewerLoaded(false);
							}}
							onBack={() => {
								if (isSingleButton) {
									viewerRef.current?.switchToTryOn?.();
									setTryOnMode(TryOnMode.TryOn);
								} else viewerRef.current?.closeFrame && viewerRef.current?.closeFrame();
								setViewerReady(false);
								setViewerLoaded(false);
							}}
							onStart={(time) =>
								viewerRef.current?.startPupillaryDistance &&
								viewerRef.current?.startPupillaryDistance(time)
							}
						/>
					)}
					{viewerLoaded && modeTryOn === TryOnMode.TryOn && (
						<TryOnShotButton
							onClick={() => viewerRef.current?.takeScreenshot && viewerRef.current?.takeScreenshot()}
						></TryOnShotButton>
					)}
					{viewerLoaded && isSingleButton && modeTryOn === TryOnMode.TryOn && (
						<PDSwitch
							type='button'
							onClick={() => {
								setViewerReady(false);
								setViewerLoaded(false);
								setTryOnMode(TryOnMode.PDTool);
								viewerRef.current?.switchToPDTool?.();
							}}
						>
							{PDSwitchButtonIcon} {T._('Pupillary distance', 'Composer')}
						</PDSwitch>
					)}
					{viewerLoaded && (
						<TryOnCloseButton
							onClick={() => {
								viewerRef.current?.closeFrame && viewerRef.current?.closeFrame();
								setViewerReady(false);
								setViewerLoaded(false);
							}}
						></TryOnCloseButton>
					)}
				</ZakekeTryOnViewer>
			)}
		</Fragment>
	);
};

// #endregion

// #region Virtual Try On

const TryOnCloseButtonComponent = styled.button`
	position: absolute;
	top: 3%;
	right: 1%;
	width: 32px;
	height: 32px;
	border: none;
	z-index: 7;
	cursor: pointer;
	font-size: 24px;
	background: white;
	border-radius: 50%;
	text-align: center;
	margin: auto;
	line-height: 0;
	padding: 1px;
`;

export interface TryOnCloseButtonProps {
	onClick: () => void;
}

export const TryOnCloseButton: FC<TryOnCloseButtonProps> = (props) => {
	return (
		<TryOnCloseButtonComponent onClick={props.onClick}>
			<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path
					d='M5.41406 4.33594L4.33594 5.41406L10.9219 12L4.33594 18.5859L5.41406 19.6641L12 13.0781L18.5859 19.6641L19.6641 18.5859L13.0781 12L19.6641 5.41406L18.5859 4.33594L12 10.9219L5.41406 4.33594Z'
					fill='#1A1C1D'
				/>
			</svg>
		</TryOnCloseButtonComponent>
	);
};

const TryOnShotButtonComponent = styled.button`
	padding: 15px;
	min-height: 50px;
	background-color: white;
	border: none;
	border-radius: 50%;
	outline: none;
	cursor: pointer;
	display: flex;
	margin: auto;
	-webkit-box-align: center;
	align-items: center;
	justify-content: space-evenly;
	z-index: 7;
	font-weight: 600;
	&:hover {
		opacity: 0.7;
	}
`;

const TryOnShotButtonContainer = styled.div`
	position: absolute;
	width: 100%;
	margin: auto;
	left: 0;
	bottom: 5%;
	text-align: center;
	margin: auto;
	z-index: 7;
`;

export interface TryOnShotButtonProps {
	onClick: () => void;
	children?: React.ReactNode;
}

export const TryOnShotButton: FC<TryOnShotButtonProps> = (props) => {
	return (
		<TryOnShotButtonContainer>
			<TryOnShotButtonComponent onClick={props.onClick}>
				<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M14 20.4167C15.4583 20.4167 16.6979 19.9062 17.7188 18.8854C18.7396 17.8646 19.25 16.625 19.25 15.1667C19.25 13.7083 18.7396 12.4688 17.7188 11.4479C16.6979 10.4271 15.4583 9.91667 14 9.91667C12.5417 9.91667 11.3021 10.4271 10.2813 11.4479C9.26043 12.4688 8.75001 13.7083 8.75001 15.1667C8.75001 16.625 9.26043 17.8646 10.2813 18.8854C11.3021 19.9062 12.5417 20.4167 14 20.4167ZM14 18.0833C13.1833 18.0833 12.4931 17.8014 11.9292 17.2375C11.3653 16.6736 11.0833 15.9833 11.0833 15.1667C11.0833 14.35 11.3653 13.6597 11.9292 13.0958C12.4931 12.5319 13.1833 12.25 14 12.25C14.8167 12.25 15.507 12.5319 16.0708 13.0958C16.6347 13.6597 16.9167 14.35 16.9167 15.1667C16.9167 15.9833 16.6347 16.6736 16.0708 17.2375C15.507 17.8014 14.8167 18.0833 14 18.0833ZM4.66668 24.5C4.02501 24.5 3.4757 24.2715 3.01876 23.8146C2.56182 23.3576 2.33334 22.8083 2.33334 22.1667V8.16667C2.33334 7.525 2.56182 6.97569 3.01876 6.51875C3.4757 6.06181 4.02501 5.83333 4.66668 5.83333H8.34168L10.5 3.5H17.5L19.6583 5.83333H23.3333C23.975 5.83333 24.5243 6.06181 24.9813 6.51875C25.4382 6.97569 25.6667 7.525 25.6667 8.16667V22.1667C25.6667 22.8083 25.4382 23.3576 24.9813 23.8146C24.5243 24.2715 23.975 24.5 23.3333 24.5H4.66668ZM4.66668 22.1667H23.3333V8.16667H18.6083L16.4792 5.83333H11.5208L9.39168 8.16667H4.66668V22.1667Z'
						fill='#007FFF'
					/>
				</svg>

				{props.children}
			</TryOnShotButtonComponent>
		</TryOnShotButtonContainer>
	);
};
// #endregion

// #region PupillaryDistance

const PDReferenceImageContainer = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	margin: auto;
	text-align: center;
	z-index: 9;
`;
const PDReferenceImage = styled.img`
	height: 100%;
	width: 100%;
	max-width: 650px;
	object-fit: contain;
	@media (max-width: 550px) {
		//phone
		left: 2.5%;
		top: 0%;
		height: 100%;
		width: 95%;
	}
	@media (min-width: 1559px) {
		// 2k
		max-width: 900px;
	}
	@media (min-width: 1559px) and (max-height: 1540px) {
		// 2k
		max-width: 750px;
	}
	@media (min-width: 2559px) {
		// retina 5k
		max-width: 1160px;
	}
`;
const PDReferencePoint = styled.div`
	position: absolute;
	left: calc(50% - 12px);
	top: 46%;
	width: 24px;
	height: 24px;
	background-color: rgb(232, 104, 37);
	border-radius: 50%;
	z-index: 8;
	@media (max-width: 550px) {
		left: calc(50% - 11px);
		top: 47%;
		width: 22px;
		height: 22px;
	}
`;
const PDReferenceText = styled.div`
	position: absolute;
	left: 0px;
	width: 100%;
	text-align: center;
	font-size: 23px;
	margin: auto;
	top: 50%;
	color: white;
	z-index: 8;
	@media (max-width: 550px) {
		font-size: 15px;
		left: 25%;
		width: 50%;
		top: 52%;
	}
`;
const PDCountDown = styled.div`
	position: absolute;
	left: 0;
	width: 100%;
	text-align: center;
	top: 60%;
	text-align: center;
	font-weight: bolder;
	font-size: 5em;
	color: white;
	z-index: 8;
	@media (max-width: 550px) {
		top: 59%;
		font-size: 4em;
	}
`;

const PDModalBody = styled.p`
	font-size: 1em;
	text-align: center;
`;
const PDDialogHeader = styled.h2`
	font-weight: bold;
	font-size: 1.3em;
	margin-bottom: 0;
	text-align: center;
`;
const PDBigText = styled.p`
	font-size: 6em;
	margin: 0;
	font-weight: bold;
	text-align: center;
`;
export interface PupillaryDistanceToolProps {
	onStart: (time: number) => void;
	onClose: () => void;
	onBack?: () => void;
}

export enum PupillaryDistanceToolState {
	Starting = 0,
	Countdown = 1,
	Ended = 2,
	Error = -1
}

export const PupillaryDistanceTool: FC<PupillaryDistanceToolProps> = (props) => {
	const [countdownInterval, setCountdownInterval] = useState(null as any);
	const [countdown, setCountdown, refCountdown] = useStateAndRef<number>(0);
	const [pdToolState, setPDToolState] = useState(PupillaryDistanceToolState.Starting);
	const { pdDistance } = useZakeke();

	const { showDialog, closeDialog } = useDialogManager();

	const startPDTool = (time: number) => {
		props.onStart(time - 1);
		setCountdown(time);
		setPDToolState(PupillaryDistanceToolState.Countdown);
	};

	useEffect(() => {
		switch (pdToolState) {
			case PupillaryDistanceToolState.Starting:
				console.log('Starting');
				showDialog(
					'pd-tool',
					<PDStartDialog
						onBack={() => {
							closeDialog('pd-tool');
							if (props.onBack) props.onBack();
						}}
						onStart={() => {
							closeDialog('pd-tool');
							startPDTool(5);
						}}
					/>
				);
				break;
			case PupillaryDistanceToolState.Countdown:
				setCountdownInterval(
					setInterval(() => {
						if (refCountdown.current < 1) setPDToolState(PupillaryDistanceToolState.Ended);
						setCountdown((countdown) => countdown - 1);
					}, 1000)
				);
				break;
			case PupillaryDistanceToolState.Ended:
				if (countdownInterval) {
					clearInterval(countdownInterval);
					setCountdownInterval(null);
					const pd = pdDistance();
					if (!pd || pd < 1) {
						setPDToolState(PupillaryDistanceToolState.Error);
						break;
					}
					showDialog(
						'pd-tool-end',
						<PDEndDialog
							onBack={() => {
								closeDialog('pd-tool-end');
								if (props.onBack) props.onBack();
							}}
							onStart={() => {
								closeDialog('pd-tool-end');
								startPDTool(5);
							}}
							pdValue={pd}
						/>
					);
					break;
				} else {
					setPDToolState(PupillaryDistanceToolState.Error);
				}
				break;
			case PupillaryDistanceToolState.Error:
				showDialog(
					'pd-tool-error',
					<PDErrorDialog
						onClose={() => {
							closeDialog('pd-tool-error');
							if (props.onBack) props.onBack();
						}}
						onStart={() => {
							closeDialog('pd-tool-error');
							startPDTool(5);
						}}
					/>
				);
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pdToolState]);

	return (
		<Fragment>
			<PDReferenceImageContainer>
				<PDReferenceImage src='https://zakeke.blob.core.windows.net/files/images/pd%20mask.png'></PDReferenceImage>
			</PDReferenceImageContainer>
			{pdToolState === PupillaryDistanceToolState.Countdown && (
				<>
					<PDReferencePoint></PDReferencePoint>
					<PDReferenceText>
						{T._('Please keep your eyes on the dot and do not move', 'Composer')}
					</PDReferenceText>
					<PDCountDown>{countdown}</PDCountDown>
				</>
			)}
		</Fragment>
	);
};

export interface PDStartDialogProps {
	onBack?: () => void;
	onStart?: () => void;
}

export const PDStartDialog: FC<PDStartDialogProps> = (props) => {
	const { isPDStartedFromCart } = useStore();
	return (
		<Dialog
			alignButtons='center'
			onClose={props.onBack}
			buttons={[
				{
					label: 'Cancel',
					onClick: props.onBack,
					secondary: true
				},
				{
					label: 'Start',
					onClick: props.onStart
				}
			]}
		>
			<PDDialogHeader>{T._('Measure Pupillary Distance', 'Composer')}</PDDialogHeader>
			<PDModalBody>
				{isPDStartedFromCart
					? T._(
							'Please measure your Pupillary Distance before adding your product to the cart to ensure a perfect fit for your eyewear. Click on "START" if you are ready.',
							'Composer'
					  )
					: T._(
							'This tool helps you accurately measure your Pupillary Distance (PD), ensuring a perfect fit for your eyewear. Click on "START" if you are ready.',
							'Composer'
					  )}
			</PDModalBody>
		</Dialog>
	);
};

export interface PDEndDialogProps {
	onBack?: () => void;
	onStart?: () => void;
	pdValue: number;
}

export const PDEndDialog: FC<PDEndDialogProps> = (props) => {
	return (
		<Dialog
			alignButtons='center'
			onClose={props.onBack}
			buttons={[
				{
					label: 'Start Again',
					onClick: props.onStart,
					secondary: true
				},
				{
					label: 'Confirm',
					onClick: props.onBack
				}
			]}
		>
			<PDDialogHeader>{T._('Pupillary Distance', 'Composer')}</PDDialogHeader>
			<PDBigText>{props.pdValue}</PDBigText>
		</Dialog>
	);
};

export interface PDErrorDialogProps {
	onClose?: () => void;
	onStart?: () => void;
}

export const PDErrorDialog: FC<PDErrorDialogProps> = (props) => {
	return (
		<Dialog
			alignButtons='center'
			onClose={props.onClose}
			buttons={[
				{
					label: 'Try Again',
					onClick: props.onStart
				},
				{
					label: 'Close',
					onClick: props.onClose,
					secondary: true
				}
			]}
		>
			<PDDialogHeader>{T._('Sorry!', 'Composer')}</PDDialogHeader>
			<PDModalBody>
				{T._(
					'It was not possible to determine your pupillary distance measurement. Please try again, ensuring that you carefully follow the provided instructions.',
					'Composer'
				)}
			</PDModalBody>
		</Dialog>
	);
};
// #endregion
