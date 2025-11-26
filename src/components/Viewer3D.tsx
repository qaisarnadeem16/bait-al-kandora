import { useZakeke, ZakekeViewer } from '@zakeke/zakeke-configurator-react';
import { Button } from 'components/Atomic';
import ArDeviceSelectionDialog from 'components/dialogs/ArDeviceSelectionDialog';
import RecapPanel from 'components/widgets/RecapPanel';
import {
	findAttribute,
	findGroup,
	findStep,
	launchFullscreen,
	quitFullscreen,
	T,
	useActualGroups,
	useUndoRedoActions
} from 'Helpers';
import { UndoRedoStep } from 'Interfaces';
import { useEffect, useRef, useState } from 'react';
import useStore from 'Store';
import { ReactComponent as BarsSolid } from '../assets/icons/bars-solid.svg';
import { ReactComponent as DesktopSolid } from '../assets/icons/desktop-solid.svg';
import { ReactComponent as ExpandSolid } from '../assets/icons/expand-solid.svg';
import { ReactComponent as CollapseSolid } from '../assets/icons/compress-arrows-alt-solid.svg';
import { ReactComponent as ExplodeSolid } from '../assets/icons/expand-arrows-alt-solid.svg';

import { ReactComponent as RedoSolid } from '../assets/icons/redo-solid.svg';
import { ReactComponent as ResetSolid } from '../assets/icons/reset-alt-solid.svg';
import { ReactComponent as SearchMinusSolid } from '../assets/icons/search-minus-solid.svg';
import { ReactComponent as SearchPlusSolid } from '../assets/icons/search-plus-solid.svg';
import { ReactComponent as UndoSolid } from '../assets/icons/undo-solid.svg';
import { Dialog, useDialogManager } from './dialogs/Dialogs';
import Notifications from './widgets/Notifications';
import {
	AiIcon,
	ArIcon,
	BottomRightIcons,
	CollapseIcon,
	ExplodeIcon,
	FullscreenIcon,
	RecapPanelIcon,
	RedoIcon,
	ResetIcon,
	SecondScreenIcon,
	TopRightIcons,
	UndoIcon,
	ViewerContainer,
	ZoomInIcon,
	ZoomOutIcon
} from './layout/SharedComponents';
import TryOnsButton from 'components/widgets/TryOnsButtons';
import AiDialog from 'components/dialogs/AIDialog';

// Styled component for the container of the 3D view.
const Viewer3D = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const {
		isSceneLoading,
		IS_IOS,
		IS_ANDROID,
		getMobileArUrl,
		openArMobile,
		isSceneArEnabled,
		zoomIn,
		zoomOut,
		sellerSettings,
		reset,
		openSecondScreen,
		product,
		hasExplodedMode,
		setExplodedMode,
		hasVTryOnEnabled,
		getTryOnSettings,
		isInfoPointContentVisible,
		isAIEnabled
	} = useZakeke();

	const [isRecapPanelOpened, setRecapPanelOpened] = useState(
		sellerSettings?.isCompositionRecapVisibleFromStart ?? false
	);

	const { showDialog, closeDialog } = useDialogManager();
	const { setIsLoading, notifications, removeNotification, isDraftEditor } = useStore();

	useEffect(() => {
		if (sellerSettings && sellerSettings?.isCompositionRecapVisibleFromStart)
			setRecapPanelOpened(sellerSettings.isCompositionRecapVisibleFromStart);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sellerSettings]);

	const switchFullscreen = () => {
		if (
			(document as any).fullscreenElement ||
			(document as any).webkitFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).msFullscreenElement
		) {
			quitFullscreen(ref.current!);
		} else {
			launchFullscreen(ref.current!);
		}
	};

	const handleArClick = async (arOnFlyUrl: string) => {
		if (IS_ANDROID || IS_IOS) {
			setIsLoading(true);
			const url = await getMobileArUrl();
			setIsLoading(false);
			if (url)
				if (IS_IOS) {
					openArMobile(url as string);
				} else if (IS_ANDROID) {
					showDialog(
						'open-ar',
						<Dialog>
							<Button
								style={{ display: 'block', width: '100%' }}
								onClick={() => {
									closeDialog('open-ar');
									openArMobile(url as string);
								}}
							>
								{T._('See your product in AR', 'Composer')}
							</Button>
						</Dialog>
					);
				}
		} else {
			showDialog('select-ar', <ArDeviceSelectionDialog />);
		}
	};

	const { setIsUndo, undoStack, setIsRedo, redoStack } = useStore();
	const undoRedoActions = useUndoRedoActions();

	const handleUndoClick = () => {
		setIsUndo(true);

		let actualUndoStep = undoStack.length > 0 ? undoStack.pop() : null;
		if (actualUndoStep && actualUndoStep.length > 0) {
			undoRedoActions.fillRedoStack(actualUndoStep);
			actualUndoStep
				.filter((x: UndoRedoStep) => x.direction === 'undo')
				.forEach((singleStep: UndoRedoStep) => handleUndoSingleStep(singleStep));
		}

		setIsUndo(false);
	};

	const { undo, redo } = useZakeke();
	const { setSelectedGroupId, setSelectedStepId, setSelectedAttributeId, isMobile } = useStore();

	const actualGroups = useActualGroups() ?? [];

	const handleUndoSingleStep = (actualUndoStep: UndoRedoStep) => {
		if (actualUndoStep.id === null && !isMobile) return;
		if (actualUndoStep.type === 'group')
			return setSelectedGroupId(findGroup(actualGroups, actualUndoStep.id)?.id ?? null);
		if (actualUndoStep.type === 'step')
			return setSelectedStepId(findStep(actualGroups, actualUndoStep.id)?.id ?? null);
		if (actualUndoStep.type === 'attribute')
			return setSelectedAttributeId(findAttribute(actualGroups, actualUndoStep.id)?.id ?? null);
		if (actualUndoStep.type === 'option') {
			return undo();
		}
	};

	const handleRedoClick = () => {
		setIsRedo(true);

		let actualRedoStep = redoStack.length > 0 ? redoStack.pop() : null;
		if (actualRedoStep != null) {
			undoRedoActions.fillUndoStack(actualRedoStep);
			actualRedoStep
				.filter((x: UndoRedoStep) => x.direction === 'redo')
				.forEach(async (singleStep: UndoRedoStep) => handleRedoSingleStep(singleStep));
		}

		setIsRedo(false);
	};

	const handleRedoSingleStep = (actualRedoStep: { type: string; id: number | null; direction: string }) => {
		if (actualRedoStep.id === null && !isMobile) return;
		if (actualRedoStep.type === 'group')
			return setSelectedGroupId(findGroup(actualGroups, actualRedoStep.id)?.id ?? null);
		if (actualRedoStep.type === 'step')
			return setSelectedStepId(findStep(actualGroups, actualRedoStep.id)?.id ?? null);
		else if (actualRedoStep.type === 'attribute')
			return setSelectedAttributeId(findAttribute(actualGroups, actualRedoStep.id)?.id ?? null);
		else if (actualRedoStep.type === 'option') return redo();
	};

	return (
		<ViewerContainer ref={ref}>
			{!isSceneLoading && <ZakekeViewer bgColor='#f2f2f2' />}

			{!isInfoPointContentVisible && (
				<>
					<ZoomInIcon $isMobile={isMobile} key={'zoomin'} hoverable onClick={zoomIn}>
						<SearchPlusSolid />
					</ZoomInIcon>
					<ZoomOutIcon $isMobile={isMobile} key={'zoomout'} hoverable onClick={zoomOut}>
						<SearchMinusSolid />
					</ZoomOutIcon>
					{sellerSettings?.canUndoRedo && (
						<ResetIcon $isMobile={isMobile} key={'reset'} hoverable onClick={reset}>
							<ResetSolid />
						</ResetIcon>
					)}
					{sellerSettings?.canUndoRedo && (
						<UndoIcon $isMobile={isMobile} key={'undo'} hoverable onClick={handleUndoClick}>
							<UndoSolid />
						</UndoIcon>
					)}
					{sellerSettings?.canUndoRedo && (
						<RedoIcon $isMobile={isMobile} key={'redo'} hoverable onClick={handleRedoClick}>
							<RedoSolid />
						</RedoIcon>
					)}
					{!isSceneLoading && hasVTryOnEnabled && !isDraftEditor && <TryOnsButton settings={getTryOnSettings()} />}
					<BottomRightIcons>
						{hasExplodedMode() && product && !isSceneLoading && (
							<>
								<CollapseIcon hoverable onClick={() => setExplodedMode(false)}>
									<CollapseSolid />
								</CollapseIcon>
								<ExplodeIcon hoverable onClick={() => setExplodedMode(true)}>
									<ExplodeSolid />
								</ExplodeIcon>
							</>
						)}

						{product && product.isShowSecondScreenEnabled && !isDraftEditor && (
							<SecondScreenIcon key={'secondScreen'} hoverable onClick={openSecondScreen}>
								<DesktopSolid />
							</SecondScreenIcon>
						)}

						{!IS_IOS && (
							<FullscreenIcon
								className='fullscreen-icon'
								key={'fullscreen'}
								hoverable
								onClick={switchFullscreen}
							>
								<ExpandSolid />
							</FullscreenIcon>
						)}
					</BottomRightIcons>
					<TopRightIcons>
						{product && product.isAiConfigurationEnabled && isAIEnabled && !isDraftEditor && (
							<AiIcon
								$isArIconVisible={isSceneArEnabled()}
								onClick={() => showDialog('ai', <AiDialog />)}
							>
							</AiIcon>
						)}

						{isSceneArEnabled() && !isDraftEditor && <ArIcon onClick={() => handleArClick('ar.html')} />}
					</TopRightIcons>
					{sellerSettings?.isCompositionRecapEnabled && (
						<RecapPanelIcon key={'recap'} onClick={() => setRecapPanelOpened(!isRecapPanelOpened)}>
							<BarsSolid />
						</RecapPanelIcon>
					)}
					{sellerSettings?.isCompositionRecapEnabled && isRecapPanelOpened && (
						<RecapPanel key={'recapPanel'} onClose={() => setRecapPanelOpened(false)} />
					)}{' '}
				</>
			)}

			{/* Notifications */}
			<Notifications
				notifications={notifications}
				onRemoveNotificationClick={(notification) => removeNotification(notification.id)}
			/>
		</ViewerContainer>
	);
};

export default Viewer3D;
