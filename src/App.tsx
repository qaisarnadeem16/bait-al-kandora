import { TextItem, useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from 'Helpers';
import LayoutDesktop from 'components/desktop/LayoutDesktop';
import LayoutMobile from 'components/mobile/LayoutMobile';
import { Dialog, MessageDialog, useDialogManager } from 'components/dialogs/Dialogs';
import LoadingOverlay from 'components/widgets/LoadingOverlay';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-tippy/dist/tippy.css';
import styled from 'styled-components';
import './App.css';
import useStore from './Store';
import ProgressBarLoadingOverlay from './components/widgets/ProgressBarLoadingOverlay';
import { TryOnViewer } from 'components/widgets/TryOnViewer';
import MeasurementModal from 'components/MeasurementModal';

export const Container = styled.div`
	position: relative;
	display: flex;
	flex-flow: column;
	padding: 40px 60px;
	@media (max-width: 1024px) {
		flex-direction: column;
		padding: 0px;
		height: 100%;
	}
	@media (min-width: 1024) {
		width: 100%;
		height: 100%;
	}
`;

export const Top = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: grid;
	grid-template-columns: 1fr 40%;
	min-height: 0;

	@media (max-width: 1024px) {
		display: flex;
		flex-direction: column;
	}
`;

const UnpublishedProductText = styled.div`
	font-size: 16px;
	text-align: center;
`;

/**
 * Main Component
 *
 * This component is the main entry point of the application.
 * It serves as the root component and renders the entire application.
 */
function App() {
	const [resize, setResize] = useState(false);
	const resizeRef = useRef(false);
	const [prevItems, setPrevItems] = useState<TextItem[]>([]);
	resizeRef.current = resize;
	const { showDialog } = useDialogManager();
	const [delayedLoading, setDelayedLoading] = useState(true);

	const {
		eventMessages,
		personalizedMessages,
		product,
		isSceneLoading,
		isAssetsLoading,
		culture,
		currency,
		groups,
		addFocusAttributesListener,
		isViewerReady,
		translations,
		items,
		setItemText,
		visibleEventMessages,
		draftCompositions
	} = useZakeke();

	const {
		isLoading,
		setPriceFormatter,
		setSelectedAttributeId,
		setSelectedGroupId,
		setSelectedStepId,
		isMobile,
		selectedGroupId,
		setIsMobile,
		setNotifications,
		setLastSelectedItem,
		isDraftEditor,
		isEditorMode,
		tagsOfSavedDesigns,
		setTagsOfSavedDesigns
	} = useStore();

	const groupsRef = useRef(groups);
	groupsRef.current = groups;
	// let counter = 0;
	const [flagStartLoading, setFlagStartLoading] = useState(false);
	const [isProductUnpublished, setIsProductUnpublished] = useState(false);

	// Page resize
	useEffect(() => {
		const resizeFunction = () => {
			setResize(!resizeRef.current);
		};

		window.addEventListener('resize', resizeFunction);
		return () => window.removeEventListener('resize', resizeFunction);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	console.log('product', product);
	// Tags save from saved compositions
	useEffect(() => {
		if (tagsOfSavedDesigns && tagsOfSavedDesigns.length === 0 && draftCompositions && draftCompositions.length > 0) {
			let tempTags: string[] = [];

			if (draftCompositions && draftCompositions.length > 0) {
				draftCompositions.forEach((composition) => {
					if (composition.tags) {
						const actualTags = composition.tags;
						tempTags.push(...actualTags);
					}
				});
			}

			let filteredTags = Array.from(new Set(tempTags));
			setTagsOfSavedDesigns(filteredTags);
			console.log('useeffect tagssaveddesign', tagsOfSavedDesigns);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draftCompositions]);
	useEffect(() => {
		const handleStatusChange = (event: CustomEvent) => {
			console.log("event")
			console.log('product unpublished:', event.detail.statusID);
			setIsProductUnpublished(true);
		};

		window.addEventListener('productUnpublished', handleStatusChange as EventListener);

		// Cleanup
		return () => {
			window.removeEventListener('productUnpublished', handleStatusChange as EventListener);
		};
	}, []);

	// added a flag because at the very beginning of the loading the isSceneLoading is false
	// requested this delay for the progress bar dialog
	useEffect(() => {
		if (isSceneLoading) setFlagStartLoading(true);
		if (!isSceneLoading && flagStartLoading) {
			setTimeout(() => setDelayedLoading(false), 250);
			const allowedSkus = ["8814503067897", "8814503100665", "8814502871289", "8814502936825", "8814503231737"];
			if (product?.sku && allowedSkus.includes(product.sku.toString())) {
				showDialog('measurement-modal', <MeasurementModal />);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSceneLoading]);

	// for translations
	useEffect(() => {
		if (translations) {
			T.translations = translations;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [translations]);

	useEffect(() => {
		if (isViewerReady) {
			addFocusAttributesListener((event: { groups: string | any[] }) => {
				if (event.groups.length > 0) {
					setSelectedGroupId(event.groups[0].groupId);
					const group = groups.find((group) => group.id === event.groups[0].groupId);
					if (group && group.steps) {
						const firstStep = group.steps.find((step) =>
							step.attributes.find((attr) => attr.id === event.groups[0].visibleAttributes[0])
						);
						if (firstStep) setSelectedStepId(firstStep.id);
					}
					setLastSelectedItem({ type: 'attribute', id: event.groups[0].visibleAttributes[0] });
					setSelectedAttributeId(event.groups[0].visibleAttributes[0]);
				}
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isViewerReady, selectedGroupId]);

	useEffect(() => {
		setPriceFormatter(
			new Intl.NumberFormat(culture, {
				style: 'currency',
				currency: currency
			})
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [culture, currency]);

	useEffect(() => {
		if (product && !isSceneLoading && !isDraftEditor && !isEditorMode) {
			const personalizedMessage = personalizedMessages?.find((message) => message.eventID === 3);
			const welcomeMessage = eventMessages?.find((message) => message.eventID === 3 && message.isDefault);
			if ((personalizedMessage && personalizedMessage.visible) || (welcomeMessage && welcomeMessage.visible))
				showDialog(
					'WelcomeMessage',
					<MessageDialog
						alignButtons='center'
						message={
							personalizedMessage && personalizedMessage.visible
								? personalizedMessage.description
								: welcomeMessage!.description
						}
					/>
				);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product, isSceneLoading, eventMessages]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const setNotificationsDebounced = useCallback(
		debounce((notifications: (typeof visibleEventMessages)[number][]) => {
			setNotifications(
				notifications.map((x, index) => ({
					id: index,
					closable: x.closabled,
					title: x.title,
					message: x.message,
					type: x.type
				}))
			);
		}, 300),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	useEffect(
		() => setNotificationsDebounced(visibleEventMessages),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[visibleEventMessages]
	);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 1024);
		};
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// translation template texts
	useEffect(() => {
		const textItems = items.filter((item) => item.type === 0) as TextItem[];
		const newItems = textItems.filter((item) => !prevItems.some((prevItem) => prevItem.guid === item.guid));
		newItems.forEach((item) => {
			if (item.isTemplateElement) setItemText(item.guid, T._d(item.text));
		});
		setPrevItems(textItems);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	return (
		<>
			{isProductUnpublished && (
				<Dialog showCloseButton={false}>
					<UnpublishedProductText>
						We're sorry, but this product is currently not accessible.
						<br></br>
						Please contact our support team for further assistance.
					</UnpublishedProductText>
				</Dialog>
			)}
			{!isProductUnpublished && (
				<>
					{isMobile ? <LayoutMobile /> : <LayoutDesktop />}
					{(isLoading || isSceneLoading || isAssetsLoading) && <LoadingOverlay />}
					{delayedLoading && <ProgressBarLoadingOverlay flagStartLoading={flagStartLoading} />}
					{!isSceneLoading && <TryOnViewer />}
				</>
			)}
		</>
	);
}

export default App;
