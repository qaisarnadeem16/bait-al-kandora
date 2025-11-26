import { TryOnMode, useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from 'Helpers';
import useStore from 'Store';
import styled from 'styled-components';
import { ReactComponent as AngleLeftSolid } from '../../assets/icons/angle-left-solid.svg';
import { ReactComponent as QuoteSolid } from '../../assets/icons/quote-sign.svg';
import { ReactComponent as PdfSolid } from '../../assets/icons/file-pdf-solid.svg';
import { ReactComponent as ShareSolid } from '../../assets/icons/share-alt-square-solid.svg';
import { ReactComponent as CartSolid } from '../../assets/icons/shopping-cart-solid.svg';
import { MessageDialog, QuestionDialog, useDialogManager } from '../dialogs/Dialogs';
import ErrorDialog from '../dialogs/ErrorDialog';
import PdfDialog from '../dialogs/PdfDialog';
import ShareDialog from '../dialogs/ShareDialog';
import { FooterMobileContainer, PriceContainer } from '../layout/SharedComponents';

import QuotationFormDialog from 'components/dialogs/QuotationFormDialog';
import SaveDesignsDraftDialog from 'components/dialogs/SaveDesignsDraftDialog';
import { TailSpin } from 'react-loader-spinner';
import { ReactComponent as SaveSolid } from '../../assets/icons/save-solid.svg';
import NftDialog, { NftForm } from 'components/dialogs/NftDialog';
import { useEffect, useRef, useState } from 'react';
import useDropdown from 'hooks/useDropdown';
import { TooltipContent } from 'components/Atomic';
import QuantityDialog from 'components/dialogs/QuantityDialog';

const OutOfStockTooltipContent = styled(TooltipContent)`
	max-width: 400px;
`;

const FooterMobileIcon = styled.div<{
	isHidden?: boolean;
	color?: string;
	backgroundColor?: string;
	iconColor?: string;
	isCart?: boolean;
	disabled?: boolean;
	gridArea?: string;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px transparent solid;
	color: ${(props) => (props.color ? props.color : `#313c46`)};
	background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : `transparent`)};
	font-size: 14px;
	text-transform: uppercase;
	text-align: center;
	display: inline-flex;
	min-height: 38px;
	border: none;
	border-right: 3px #f4f4f4 solid;
	cursor: pointer;
	flex-direction: column;
	font-weight: bold !important;

	svg {
		fill: ${(props) => props.iconColor && `${props.iconColor}`};
		width: 32px;
		height: 32px;
	}

	${(props) => props.isHidden && `visibility:hidden`};

	${(props) =>
		props.isCart &&
		`
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: center;`};

	${(props) =>
		props.disabled &&
		`
      background-color: lightgray;
      border: 1px solid gray;
      color: #313c46;
  `}
	${(props) => props.gridArea && `grid-area:${props.gridArea}`};
`;

const FooterMobile = () => {
	const [openOutOfStockTooltip, , isOutOfStockTooltipVisible, Dropdown] = useDropdown();
	const addToCartButtonRef = useRef<HTMLDivElement>(null);

	const {
		useLegacyScreenshot,
		setCameraByName,
		getPDF,
		addToCart,
		product,
		price,
		isOutOfStock,
		groups,
		isSceneLoading,
		eventMessages,
		visibleEventMessages,
		isAddToCartLoading,
		sellerSettings,
		saveComposition,
		createQuote,
		getPrintingMethodsRestrictions,
		isMandatoryPD,
		nftSettings
	} = useZakeke();

	const {
		setIsLoading,
		selectedGroupId,
		setSelectedGroupId,
		selectedAttributeId,
		setSelectedTemplateGroupId,
		selectedTemplateGroupId,
		selectedStepId,
		setSelectedAttributeId,
		priceFormatter,
		setIsQuoteLoading,
		isQuoteLoading,
		isViewerMode,
		isDraftEditor,
		isEditorMode,
		setTryOnMode,
		tryOnRef,
		setIsPDStartedFromCart,
		pdValue,
		isMobile,
		setIsSavingComposition,
		isSavingComposition
	} = useStore();

	const { showDialog, closeDialog } = useDialogManager();

	const pmRestrictions = getPrintingMethodsRestrictions();
	const pdfPreviewDisabled = pmRestrictions.isPDFPreviewEnabled === false;
	const isBuyVisibleForQuoteRule = product?.quoteRule ? product.quoteRule.allowAddToCart : true;

	const [disableButtonsByVisibleMessages, setDisableButtonsByVisibleMessages] = useState(false);

	useEffect(() => {
		if (visibleEventMessages && visibleEventMessages.some((msg) => msg.addToCartDisabledIfVisible))
			setDisableButtonsByVisibleMessages(true);
		else setDisableButtonsByVisibleMessages(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visibleEventMessages]);

	const handleAddToCart = () => {
		const cartMessage = eventMessages?.find((message) => message.eventID === 4);
		if (isMandatoryPD && pdValue < 1) {
			setIsPDStartedFromCart(true);
			tryOnRef?.current?.setVisible?.(true);
			tryOnRef?.current?.changeMode?.(TryOnMode.PDTool);
			setTryOnMode(TryOnMode.PDTool);
			return;
		}
		// if you're saving a draft composition in backoffice
		if (isDraftEditor) {
			setIsSavingComposition(true);
			saveComposition().then(() => {
				setIsSavingComposition(false);
				showDialog(
					'WelcomeMessage',
					<MessageDialog alignButtons='center' message={T._('Composition saved successfully', 'Composer')} />
				);
			});
		} else if (cartMessage && cartMessage.visible && !isDraftEditor && !isEditorMode)
			showDialog(
				'question',
				<QuestionDialog
					alignButtons='center'
					eventMessage={cartMessage?.description}
					buttonNoLabel={T._('Cancel', 'Composer')}
					buttonYesLabel={T._('Add to cart', 'Composer')}
					onYesClick={() => {
						if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
							showDialog(
								'nft',
								<NftDialog
									nftTitle={T._(
										"You're purchasing a customized product together with an NFT.",
										'Composer'
									)}
									nftMessage={T._(
										'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
										'Composer'
									)}
									buttonNoLabel={T._('Skip and continue', 'Composer')}
									buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
									price={nftSettings.priceToAdd + price}
									onYesClick={(nftForm: NftForm) => {
										closeDialog('nft');
										addToCart([], undefined, useLegacyScreenshot, nftForm);
									}}
									onNoClick={() => {
										closeDialog('nft');
										addToCart([], undefined, useLegacyScreenshot);
									}}
								/>
							);
						else addToCart([], undefined, useLegacyScreenshot);
						closeDialog('question');
					}}
				/>
			);
		else if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
			showDialog(
				'nft',
				<NftDialog
					nftTitle={T._("You're purchasing a customized product together with an NFT.", 'Composer')}
					nftMessage={T._(
						'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
						'Composer'
					)}
					price={nftSettings.priceToAdd + price}
					buttonNoLabel={T._('Skip and continue', 'Composer')}
					buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
					onYesClick={(nftForm: NftForm) => {
						closeDialog('nft');
						addToCart([], undefined, useLegacyScreenshot, nftForm);
					}}
					onNoClick={() => {
						closeDialog('nft');
						addToCart([], undefined, useLegacyScreenshot);
					}}
				/>
			);
		else if (product && product.quantityRule)
			showDialog(
				'quantity',
				<QuantityDialog
					quantityRule={product.quantityRule}
					onClick={() => {
						closeDialog('quantity');
						addToCart([], undefined, useLegacyScreenshot);
					}}
				/>
			);
		else {
			addToCart([], undefined, useLegacyScreenshot);
		}
	};

	const showError = (error: string) => {
		showDialog('error', <ErrorDialog error={error} onCloseClick={() => closeDialog('error')} />);
	};

	const handleShareClick = async () => {
		setCameraByName('buy_screenshot_camera', false, false);
		showDialog('share', <ShareDialog />);
	};
	const handleSaveClick = async () => {
		showDialog('save', <SaveDesignsDraftDialog onCloseClick={() => closeDialog('save')} />);
	};
	const handlePdfClick = async () => {
		try {
			setIsLoading(true);
			const url = await getPDF();
			showDialog('pdf', <PdfDialog url={url} onCloseClick={() => closeDialog('pdf')} />);
		} catch (ex) {
			console.log(ex);
			showError(T._('Failed PDF generation', 'Composer'));
		} finally {
			setIsLoading(false);
		}
	};
	const handleBackClick = () => {
		if (selectedAttributeId) {
			setSelectedAttributeId(null);

			const selectedCurrentGroup = groups.find((x) => x.id === selectedGroupId);
			const selectedCurrentStep = selectedCurrentGroup?.steps.find((x) => x.id === selectedStepId);

			if (
				selectedCurrentGroup &&
				((selectedCurrentGroup.attributes.length === 1 && selectedCurrentGroup.templateGroups.length === 0) ||
					(selectedCurrentStep?.attributes.length === 1 && selectedCurrentStep.templateGroups.length === 0))
			) {
				setSelectedGroupId(null);
			}
		} else if (selectedTemplateGroupId) {
			console.log('selectedTemplateGroupId');
			setSelectedTemplateGroupId(null);

			const selectedCurrentGroup = groups.find((x) => x.id === selectedGroupId);
			const selectedCurrentStep = selectedCurrentGroup?.steps.find((x) => x.id === selectedStepId);

			if (
				selectedCurrentGroup &&
				((selectedCurrentGroup.templateGroups.length === 1 && selectedCurrentGroup.attributes.length === 0) ||
					(selectedCurrentStep?.templateGroups.length === 1 && selectedCurrentStep.attributes.length === 0))
			) {
				setSelectedGroupId(null);
			}
		} else if (selectedGroupId) {
			setSelectedGroupId(null);
		}
	};

	const handleSubmitRequestQuote = async (formData: any) => {
		let thereIsARequiredFormEmpty = formData.some((form: any) => form.required && form.value === '');
		if (thereIsARequiredFormEmpty)
			showDialog(
				'error',
				<ErrorDialog
					error={T._(
						'Failed to send the quotation since there is at least 1 required field empty.',
						'Composer'
					)}
					onCloseClick={() => closeDialog('error')}
				/>
			);
		else
			try {
				closeDialog('request-quotation');
				setIsQuoteLoading(true);
				setCameraByName('buy_screenshot_camera', false, false);
				await saveComposition();
				await createQuote(formData);
				showDialog(
					'message',
					<MessageDialog message={T._('Request for quotation sent successfully', 'Composer')} />
				);
				setIsQuoteLoading(false);
			} catch (ex) {
				console.error(ex);
				setIsQuoteLoading(false);
				showDialog(
					'error',
					<ErrorDialog
						error={T._(
							'An error occurred while sending request for quotation. Please try again.',
							'Composer'
						)}
						onCloseClick={() => closeDialog('error')}
					/>
				);
			}
	};

	const handleGetQuoteClick = async () => {
		let rule = product?.quoteRule;
		if (rule)
			showDialog(
				'request-quotation',
				<QuotationFormDialog getQuoteRule={rule} onFormSubmit={handleSubmitRequestQuote} />
			);
	};

	return (
		<>
			{!isSceneLoading && (
				<FooterMobileContainer isQuoteEnable={product?.quoteRule !== null}>
					<FooterMobileIcon gridArea='back' isHidden={selectedGroupId === null} onClick={handleBackClick}>
						<AngleLeftSolid />
					</FooterMobileIcon>

					{!pdfPreviewDisabled && (
						<FooterMobileIcon gridArea='pdf' onClick={handlePdfClick}>
							<PdfSolid />
						</FooterMobileIcon>
					)}

					{!isDraftEditor &&
						!isEditorMode &&
						!isViewerMode &&
						sellerSettings &&
						sellerSettings.canSaveDraftComposition && (
							<FooterMobileIcon gridArea='save' onClick={handleSaveClick}>
								<SaveSolid />
							</FooterMobileIcon>
						)}

					{!isDraftEditor && !isEditorMode && sellerSettings && sellerSettings.shareType !== 0 && (
						<FooterMobileIcon gridArea='share' onClick={handleShareClick}>
							<ShareSolid />
						</FooterMobileIcon>
					)}

					{isBuyVisibleForQuoteRule && !isViewerMode && (
						<FooterMobileIcon
							gridArea='cart'
							isCart
							iconColor='white'
							color='white'
							ref={addToCartButtonRef}
							onPointerEnter={() => {
								if (isOutOfStock) openOutOfStockTooltip(addToCartButtonRef.current!, 'top', 'top');
							}}
							disabled={disableButtonsByVisibleMessages || isAddToCartLoading || isOutOfStock}
							backgroundColor='#313c46'
							onClick={!isAddToCartLoading ? () => handleAddToCart() : () => null}
						>
							{!isOutOfStock &&
								price !== null &&
								price > 0 &&
								(!sellerSettings || !sellerSettings.hidePrice) && (
									<PriceContainer style={{ fontSize: '18px' }} $isMobile={isMobile}>
										{priceFormatter.format(price)}
									</PriceContainer>
								)}

							{isOutOfStock && T._('OUT OF STOCK', 'Composer')}

							{!isOutOfStock &&
								!isAddToCartLoading &&
								!isDraftEditor &&
								(isEditorMode ? <SaveSolid /> : <CartSolid />)}
							{isDraftEditor && !isSavingComposition && <SaveSolid />}
							{(isAddToCartLoading || isSavingComposition) && <TailSpin color='#FFFFFF' height='25px' />}
						</FooterMobileIcon>
					)}
					{product?.quoteRule && !isViewerMode && !isDraftEditor && !isEditorMode && (
						<FooterMobileIcon
							gridArea='quote'
							iconColor='white'
							color='white'
							style={{ fontSize: '14px' }}
							backgroundColor='#313c46'
							disabled={disableButtonsByVisibleMessages}
							onClick={handleGetQuoteClick}
						>
							{!isQuoteLoading && (
								<>
									<QuoteSolid />
									{T._('Get a Quote', 'Composer')}
								</>
							)}
							{isQuoteLoading && <TailSpin color='#FFFFFF' height='25px' />}
						</FooterMobileIcon>
					)}
				</FooterMobileContainer>
			)}

			{isOutOfStockTooltipVisible && (
				<Dropdown>
					<OutOfStockTooltipContent>
						{T._(
							'The configuration you have done is out-of-stock, please select different options to purchase this product.',
							'Composer'
						)}
					</OutOfStockTooltipContent>
				</Dropdown>
			)}
		</>
	);
};

export default FooterMobile;
