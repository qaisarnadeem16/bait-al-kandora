import {
	ImageItem,
	Item,
	ProductArea,
	TemplateArea,
	TextItem,
	ZakekeDesigner,
	useZakeke
} from '@zakeke/zakeke-configurator-react';
import useStore from 'Store';
import AdvancedSelect from 'components/widgets/AdvancedSelect';
import { FormControl } from 'components/widgets/FormControl';
import { FC, useEffect, useRef, useState } from 'react';
import { CSSObjectWithLabel, GroupBase, OptionProps, SingleValueProps, components } from 'react-select';
import styled from 'styled-components';
import { T } from '../../Helpers';
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left-solid.svg';
import { ReactComponent as ArrowRightIcon } from '../../assets/icons/arrow-right-solid.svg';
import { ReactComponent as Arrows } from '../../assets/icons/arrows-alt-solid.svg';
import { ReactComponent as Add } from '../../assets/icons/plus-circle-solid.svg';
import { ReactComponent as SearchMinusSolid } from '../../assets/icons/search-minus-solid.svg';
import { ReactComponent as SearchPlusSolid } from '../../assets/icons/search-plus-solid.svg';
import {
	ArrowLeft,
	ArrowLeftIconStyled,
	ArrowRight,
	ArrowRightIconStyled,
	Button,
	CarouselContainer,
	CloseEditorButton,
	Icon
} from '../Atomic';
import AddTextDialog from '../dialogs/AddTextDialog';
import { useDialogManager } from '../dialogs/Dialogs';
import ErrorDialog from '../dialogs/ErrorDialog';
import ImagesGalleryDialog from '../dialogs/ImagesGalleryDialog';
import ItemImage, { EditImageItem } from '../widgets/ItemImage';
import ItemText, { EditTextItem } from '../widgets/ItemText';
import {
	Center,
	IconsAndDesignerContainer,
	SelectContainer,
	SupportedFormatsList,
	Template,
	TemplatesContainer,
	ZakekeDesignerContainer,
	ZoomInIcon,
	ZoomOutIcon
} from './SharedComponents';

export type PropChangeHandler = (
	item: EditTextItem | EditImageItem,
	prop: string,
	value: string | boolean | File
) => void;

export interface TranslatedTemplate {
	id: number;
	name: string;
}

const ZoomIconIn = styled(ZoomInIcon)`
	left: 0px;
`;
const ZoomIconOut = styled(ZoomOutIcon)`
	left: 0px;
`;

const MoveElementButton = styled(Button)`
	/* position: absolute;
	bottom: 0; */
`;

const DesignerContainer = styled.div<{ $isMobile?: boolean }>`
	display: flex;
	flex-flow: column;
	user-select: none;
	width: 100%;
	padding: 30px 30px 70px 30px;
	${(props) =>
		props.$isMobile &&
		`
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:11;
        background-color:#ffffff;
        overflow-y:scroll;
    `}
`;

const UploadButtons = styled.div`
	display: flex;
	flex-direction: column;
	grid-gap: 5px;
	margin: 20px 0px;
`;

const Area = styled.div<{ selected?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: left;
	min-height: 47px;
	min-width: 70px;
	border-bottom: 5px solid transparent;
	cursor: pointer;
	padding: 0px 5px;
	text-align: center;

	&:hover {
		border-bottom: 5px solid #c4c4c4;
	}

	${(props) =>
		props.selected &&
		`
       border-bottom: 5px solid #c4c4c4;
    `}
`;

const SelectOptionLabel = styled.span`
		color: black;
`;

const SelectSingleValueLabel = styled.span`
		color: black;
`;

const SelectOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.Option {...props}>
			<SelectOptionLabel>{props.data.name}</SelectOptionLabel>
		</components.Option>
	);
};

const SelectSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.SingleValue {...props}>
			<SelectSingleValueLabel>{props.data.name}</SelectSingleValueLabel>
		</components.SingleValue>
	);
};

const CopyrightMessage = styled.div`
	display: flex;
	flex-direction: column;
`;

const CopyrightMandatoryMessageContainer = styled.div`
	display: grid;
	grid-template-columns: 20px auto;
	grid-gap: 5px;
`;

const CopyrightCheckbox = styled.input`
	width: 13px;
`;

const CopyrightMandatoryMessage = styled.div``;

const Designer: FC<{ onCloseClick?: () => void }> = ({ onCloseClick }) => {
	const { showDialog, closeDialog } = useDialogManager();
	const [forceUpdate, setForceUpdate] = useState(false);
	const { setIsLoading, isMobile } = useStore();

	const {
		currentTemplate,
		items,
		isAreaVisible,
		product,
		templates,
		setTemplate,
		setCamera,
		removeItem,
		setItemImageFromFile,
		setItemImage,
		setItemText,
		setItemItalic,
		setItemBold,
		setItemColor,
		setItemFontFamily,
		setItemTextOnPath,
		addItemText,
		addItemImage,
		createImage,
		getTemplateUploadRestrictictions,
		eventMessages,
		setCopyrightMessageAccepted,
		getCopyrightMessageAccepted
	} = useZakeke();
	const customizerRef = useRef<any | null>(null);
	const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);

	const filteredAreas = product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];
	let finalVisibleAreas: ProductArea[] = [];

	const [moveElements, setMoveElements] = useState(false);

	const translatedTemplates = templates.map((template) => {
		return { id: template.id, name: T._d(template.name), areas: template.areas };
	});

	const translatedCurrentTemplate = {
		id: currentTemplate?.id,
		name: T._d(currentTemplate?.name ?? ''),
		areas: currentTemplate?.areas
	};

	filteredAreas.length > 0 &&
		filteredAreas.forEach((filteredArea) => {
			let currentTemplateArea = currentTemplate!.areas.find((x) => x.id === filteredArea.id);
			let itemsOfTheArea = items.filter((item) => item.areaId === filteredArea.id);
			const areAllItemsStatic = !itemsOfTheArea.some((item) => {
				return (
					!item.constraints ||
					item.constraints.canMove ||
					item.constraints.canRotate ||
					item.constraints.canResize ||
					item.constraints.canEdit
				);
			});
			if (
				!areAllItemsStatic ||
				!currentTemplateArea ||
				currentTemplateArea?.canAddImage ||
				currentTemplateArea?.canAddText
			)
				finalVisibleAreas.push(filteredArea);
		});

	const [actualAreaId, setActualAreaId] = useState<number>(
		finalVisibleAreas && finalVisibleAreas.length > 0 ? finalVisibleAreas[0].id : 0
	);

	let currentTemplateArea = currentTemplate!.areas.find((x) => x.id === actualAreaId);
	let itemsFiltered = items.filter((item) => item.areaId === actualAreaId).sort((a, b) => (b as any).index - (a as any).index);
	const allStaticElements = !itemsFiltered.some((item) => {
		return (
			!item.constraints || item.constraints.canMove || item.constraints.canRotate || item.constraints.canResize
		);
	});
	const showAddTextButton = !currentTemplateArea || currentTemplateArea.canAddText;
	const showUploadButton =
		!currentTemplateArea ||
		(currentTemplateArea.canAddImage && currentTemplateArea.uploadRestrictions.isUserImageAllowed);
	const showGalleryButton =
		!currentTemplateArea || (currentTemplateArea.canAddImage && !currentTemplateArea.disableSellerImages);

	const supportedFileFormats = getSupportedUploadFileFormats(currentTemplate!.id, actualAreaId).join(', ');

	const [copyrightMandatoryCheckbox, setCopyrightMandatoryCheckbox] = useState(getCopyrightMessageAccepted());
	const copyrightMessage = eventMessages && eventMessages.find((message) => message.eventID === 8);

	const slidesToShow = window.innerWidth <= 1600 ? 3 : 4;

	const setTemplateByID = async (templateID: number) => await setTemplate(templateID);

	useEffect(() => {
		if (templates.length > 0 && !currentTemplate) setTemplateByID(templates[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templates]);

	useEffect(() => {
		const area = filteredAreas.filter((a) => a.id === actualAreaId);
		if (area && area.length > 0) setCamera(area[0].cameraLocationID as string);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actualAreaId]);

	useEffect(() => {
		if (finalVisibleAreas.length > 0 && actualAreaId === 0) setActualAreaId(finalVisibleAreas[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finalVisibleAreas]);

	function getSupportedUploadFileFormats(templateId: number, areaId: number) {
		const restrictions = getTemplateUploadRestrictictions(templateId, areaId);
		const fileFormats: string[] = [];

		if (restrictions.isJpgAllowed) fileFormats.push('.jpg', '.jpeg');

		if (restrictions.isPngAllowed) fileFormats.push('.png');

		if (restrictions.isSvgAllowed) fileFormats.push('.svg');

		if (restrictions.isEpsAllowed) fileFormats.push('.eps');

		if (restrictions.isPdfAllowed) fileFormats.push('.pdf');

		return fileFormats;
	}

	const isItemEditable = (item: Item, templateArea?: TemplateArea) => {
		if (!item.constraints) return false;

		let {
			canEdit,
			canMove,
			canRotate,
			canResize,
			canDelete,
			canChangeFontColor,
			canChangeFontFamily,
			canChangeFontWeight,
			isPrintable
		} = item.constraints;

		if (!isPrintable) return false;

		let common = canEdit || canMove || canRotate || canResize || canDelete;
		let text = canChangeFontColor || canChangeFontFamily || canChangeFontWeight;
		let image =
			canEdit ||
			(templateArea && (templateArea.uploadRestrictions.isUserImageAllowed || !templateArea.disableSellerImages));

		if (item.type === 0) return common || text;
		else return common || image;
	};

	const handleAddTextClick = () => {
		showDialog(
			'add-text',
			<AddTextDialog
				onClose={() => closeDialog('add-text')}
				onConfirm={(item) => {
					addItemText(item, actualAreaId);
					closeDialog('add-text');
				}}
			/>
		);
	};

	const handleAddImageFromGalleryClick = async () => {
		showDialog(
			'add-image',
			<ImagesGalleryDialog
				onClose={() => closeDialog('add-image')}
				onImageSelected={(image: { imageID: number }) => {
					addItemImage(image.imageID, actualAreaId);
					closeDialog('add-image');
				}}
			/>
		);
	};

	const handleUploadImageClick = async (
	) => {
		if (currentTemplate && actualAreaId) {
			const fileFormats = getSupportedUploadFileFormats(currentTemplate.id, actualAreaId);
			let input = document.createElement('input');
			input.setAttribute('accept', fileFormats.join(','));
			input.setAttribute('type', 'file');
			input.addEventListener('change', async (e) => {
				const files = (e.currentTarget as HTMLInputElement).files;
				if (files && files.length > 0 && actualAreaId) {
					setIsLoading(true);
					try {
						const image = await createImage(files[0], (progress: number) => console.log(progress));
						await addItemImage(image.imageID, actualAreaId);
						input.remove();
					} catch (ex) {
						console.error(ex);
						showDialog(
							'error',
							<ErrorDialog
								error={T._('Failed uploading image.', 'Composer')}
								onCloseClick={() => closeDialog('error')}
							/>
						);
					} finally {
						setIsLoading(false);
					}
				}
			});
			document.body.appendChild(input);
			input.click();
		}
	};

	const handleItemRemoved = (guid: string) => {
		removeItem(guid);
	};

	const handleItemImageChange = async (item: EditImageItem, file: File) => {
		try {
			setIsLoading(true);
			await setItemImageFromFile(item.guid, file);
		} catch (ex) {
			console.error(ex);
		} finally {
			setIsLoading(false);
		}
	};

	const handleItemImageGallery = async (item: EditImageItem) => {
		showDialog(
			'add-image',
			<ImagesGalleryDialog
				onClose={() => closeDialog('add-image')}
				onImageSelected={async (image) => {
					closeDialog('add-image');
					try {
						setIsLoading(true);
						await setItemImage(item.guid, image.imageID);
					} catch (ex) {
						console.error(ex);
					} finally {
						setIsLoading(false);
					}
				}}
			/>
		);
	};

	const handleItemPropChange = (item: EditTextItem | EditImageItem, prop: string, value: string | boolean | File) => {
		switch (prop) {
			case 'remove':
				handleItemRemoved(item.guid);
				break;
			case 'image-upload':
				handleItemImageChange(item as EditImageItem, value as File);
				break;
			case 'image-gallery':
				handleItemImageGallery(item as EditImageItem);
				break;
			case 'text':
				setItemText(item.guid, value as string);
				break;
			case 'font-italic':
				setItemItalic(item.guid, value as boolean);
				break;
			case 'font-bold':
				setItemBold(item.guid, value as boolean);
				break;
			case 'font-color':
				setItemColor(item.guid, value as string);
				break;
			case 'font-family':
				console.log(item);
				setItemFontFamily(item.guid, value as string);
				console.log(item);
				break;
			case 'text-path':
				setItemTextOnPath(item.guid, actualAreaId, value as boolean);
				setTimeout(() => setForceUpdate(!forceUpdate), 100);
				break;
		}
	};

	return (
		<>
			{!moveElements && (
				<DesignerContainer $isMobile={isMobile}>
					{/* Templates */}
					{!isMobile && templates.length > 1 && (
						<TemplatesContainer>
							{templates.map((template) => (
								<Template
									key={template.id}
									selected={currentTemplate === template}
									onClick={async () => {
										await setTemplate(template.id);
									}}
								>
									{T._d(template.name)}
								</Template>
							))}
						</TemplatesContainer>
					)}

					{/* Areas */}
					{!isMobile && finalVisibleAreas.length > 1 && (
						<CarouselContainer
							slidesToScroll={1}
							speed={50}
							slidesToShow={slidesToShow}
							slideIndex={selectedCarouselSlide}
							afterSlide={setSelectedCarouselSlide}
							renderBottomCenterControls={() => <span />}
							renderCenterRightControls={() => {
								if (
									selectedCarouselSlide !==
									(finalVisibleAreas.length - slidesToShow > 0
										? finalVisibleAreas.length - slidesToShow
										: selectedCarouselSlide)
								)
									return (
										<ArrowRight onClick={() => setSelectedCarouselSlide(selectedCarouselSlide + 1)}>
											<ArrowRightIconStyled>
												<ArrowRightIcon />
											</ArrowRightIconStyled>
										</ArrowRight>
									);
							}}
							renderCenterLeftControls={() => {
								if (selectedCarouselSlide !== 0)
									return (
										<ArrowLeft onClick={() => setSelectedCarouselSlide(selectedCarouselSlide - 1)}>
											<ArrowLeftIconStyled>
												<ArrowLeftIcon />
											</ArrowLeftIconStyled>
										</ArrowLeft>
									);
							}}
						>
							{finalVisibleAreas.map((area) => (
								<Area
									key={area.id}
									selected={actualAreaId === area.id}
									onClick={() => setActualAreaId(area.id)}
								>
									{T._d(area.name)}
								</Area>
							))}
						</CarouselContainer>
					)}

					{isMobile && translatedTemplates.length > 1 && (
						<SelectContainer>
							<FormControl label={T._('Templates', 'Composer')}>
								<AdvancedSelect
									styles={{
										container: (base) =>
											({
												...base,
												minWidth: 300
											} as CSSObjectWithLabel),
									}}
									isSearchable={false}
									options={translatedTemplates}
									menuPosition='fixed'
									components={{
										Option: SelectOption,
										SingleValue: SelectSingleValue
									}}
									value={translatedTemplates!.find((x) => x.id === translatedCurrentTemplate.id)}
									onChange={async (template: any) => await setTemplate(template.id)}
								/>
							</FormControl>
						</SelectContainer>
					)}
					{isMobile && finalVisibleAreas.length > 1 && (
						<SelectContainer>
							<FormControl label={T._('Customizable Areas', 'Composer')}>
								<AdvancedSelect
									styles={{
										container: (base) =>
											({
												...base,
												minWidth: 300
											} as CSSObjectWithLabel)
									}}
									isSearchable={false}
									options={finalVisibleAreas}
									menuPosition='fixed'
									components={{
										Option: SelectOption,
										SingleValue: SelectSingleValue
									}}
									value={finalVisibleAreas.find((x) => x.id === actualAreaId) ?? finalVisibleAreas[0]}
								onChange={(area: any) => setActualAreaId(area.id)}
							/>
							</FormControl>
						</SelectContainer>
					)}

					{itemsFiltered.length === 0 && !(showAddTextButton || showUploadButton || showGalleryButton) && (
						<Center>{T._('No customizable items', 'Composer')}</Center>
					)}

					{itemsFiltered.map((item) => {
						if (item.type === 0 && isItemEditable(item, currentTemplateArea))
							return (
								<ItemText
									key={item.guid}
									handleItemPropChange={handleItemPropChange}
									item={item as TextItem}
								/>
							);
						else if (item.type === 1 && isItemEditable(item, currentTemplateArea))
							return (
								<ItemImage
									uploadImgDisabled={
										copyrightMessage && copyrightMessage.additionalData.enabled
											? !copyrightMandatoryCheckbox
											: false
									}
									key={item.guid}
									handleItemPropChange={handleItemPropChange}
									item={item as ImageItem}
									currentTemplateArea={currentTemplateArea!}
								/>
							);

						return null;
					})}

					{(showAddTextButton || showUploadButton || showGalleryButton) && (
						<UploadButtons>
							{showAddTextButton && (
								<Button isFullWidth onClick={handleAddTextClick}>
									<Icon>
										<Add />
									</Icon>
									<span>{T._('Add text', 'Composer')}</span>
								</Button>
							)}

							{showGalleryButton && (
								<Button isFullWidth onClick={handleAddImageFromGalleryClick}>
									<Icon>
										<Add />
									</Icon>
									<span>{T._('Add clipart', 'Composer')}</span>
								</Button>
							)}

							{showUploadButton && (
								<>
									<Button
										disabled={
											copyrightMessage && copyrightMessage.additionalData.enabled
												? !copyrightMandatoryCheckbox
												: false
										}
										isFullWidth
										onClick={handleUploadImageClick}
									>
										<Icon>
											<Add />
										</Icon>
										<span>
											<span>
												{itemsFiltered.some(
													(item) =>
														item.type === 1 && isItemEditable(item, currentTemplateArea)
												)
													? T._('Upload another image', 'Composer')
													: T._('Upload Images', 'Composer')}{' '}
											</span>
										</span>
									</Button>
								</>
							)}
							<SupportedFormatsList>
								{T._('Supported file formats:', 'Composer') + ' ' + supportedFileFormats}
							</SupportedFormatsList>

							{copyrightMessage && copyrightMessage.visible && (
								<CopyrightMessage>
									<div dangerouslySetInnerHTML={{ __html: copyrightMessage.description }} />
									{copyrightMessage && copyrightMessage.additionalData.enabled && (
										<CopyrightMandatoryMessageContainer>
											<CopyrightCheckbox
												type='checkbox'
												defaultChecked={copyrightMandatoryCheckbox}
												onClick={() => {
													setCopyrightMessageAccepted(!copyrightMandatoryCheckbox);
													setCopyrightMandatoryCheckbox(!copyrightMandatoryCheckbox);
												}}
											/>
											<CopyrightMandatoryMessage
												dangerouslySetInnerHTML={{
													__html: copyrightMessage.additionalData.message
												}}
											/>
										</CopyrightMandatoryMessageContainer>
									)}
								</CopyrightMessage>
							)}
						</UploadButtons>
					)}
					{itemsFiltered.length > 0 && !allStaticElements && (
						<MoveElementButton isFullWidth outline onClick={() => setMoveElements(true)}>
							<Icon>
								<Arrows />
							</Icon>
							<span>{T._('Move elements', 'Composer')} </span>
						</MoveElementButton>
					)}
					{isMobile && <CloseEditorButton onClick={onCloseClick}>{T._('OK', 'Composer')}</CloseEditorButton>}
				</DesignerContainer>
			)}
			{moveElements && (
				<ZakekeDesignerContainer $isMobile={isMobile} className='zakeke-container'>
					<ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />
					<IconsAndDesignerContainer>
						<ZoomIconIn hoverable onClick={() => customizerRef.current.zoomIn()}>
							<SearchPlusSolid />
						</ZoomIconIn>
						<ZoomIconOut hoverable onClick={() => customizerRef.current.zoomOut()}>
							<SearchMinusSolid />
						</ZoomIconOut>
					</IconsAndDesignerContainer>
					<Button isFullWidth onClick={() => setMoveElements(false)}>
						<span>{T._('OK', 'Composer')} </span>
					</Button>
				</ZakekeDesignerContainer>
			)}
		</>
	);
};

export default Designer;
