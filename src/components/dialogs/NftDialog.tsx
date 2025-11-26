import { FC, useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogFooterButton, DialogWindow } from './Dialogs';
import { T } from 'Helpers';
import useStore from 'Store';
import { useZakeke } from '@zakeke/zakeke-configurator-react';

const NftDialogWindow = styled(DialogWindow)`
	max-width: unset;
`;
export interface NftForm {
	email: string;
	walletAddress: string;
}

const NftTitle = styled.h2`
	text-align: left;
`;

const NftMessage = styled.p`
	text-align: left;
`;

const NftFormContainer = styled.div``;

const NftButtonsContainer = styled.div``;

const PriceAndYesButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 0px;
`;

const NftPrice = styled.div`
	font-weight: 600;
	font-size: 18px;
`;

const NftText = styled.div``;

const NftLink = styled.a`
	color: #f46200;
`;

const NftTextAndNoButtonContainer = styled.div`
	padding: 20px 0px;
	button {
		margin-top: 20px;
		margin-left: auto;
	}
`;

const NftItem = styled.div``;

const NftLabel = styled.p<{ isNotValid?: boolean }>`
	${(props) => props.isNotValid && `color: red;`}
`;

const NftTextArea = styled.textarea`
	width: 100%;
	border: 1px #f4f4f4 solid;
	padding: 5px;
	&:hover {
		border: 1px #414042 solid;
	}

	&:focus {
		border: 1px #414042 solid;
		outline: none;
	}
`;

const NFTDialog: FC<
	{
		nftTitle: string;
		nftMessage: React.ReactNode;
		nftHtmlMessage?: string;
		price: number;
		buttonYesLabel: string;
		buttonNoLabel: string;
		onYesClick: (nftForm: NftForm) => void;
		onNoClick?: () => void;
	}
> = ({ nftTitle, nftMessage, price, nftHtmlMessage, buttonYesLabel, buttonNoLabel, onYesClick, onNoClick }) => {
	const [nftEmail, setNftEmail] = useState<string>('');
	const [nftWalletAddress, setNftWalletAddress] = useState<string>('');
	const { priceFormatter } = useStore();

	const { validationNFTEmail, validationNFTWalletAddress } = useZakeke();

	const [validNftEmail, setValidNftEmail] = useState<boolean>(true);
	const [validNftWalletAddress, setValidNftWalletAddress] = useState<boolean>(true);

	const onConfirmationDialog = (email: string, walletAddress: string) => {
		if (validationNFTEmail(email) && validationNFTWalletAddress(walletAddress))
			onYesClick({ email: nftEmail, walletAddress: nftWalletAddress });
		else {
			setValidNftEmail(validationNFTEmail(email));
			setValidNftWalletAddress(validationNFTWalletAddress(walletAddress));
			return;
		}
	};

	return (
		<Dialog windowDecorator={NftDialogWindow} alignButtons={'center'}>
			{nftTitle && <NftTitle>{nftTitle}</NftTitle>}
			{nftMessage && <NftMessage>{nftMessage}</NftMessage>}
			<NftFormContainer>
				<NftItem>
					<NftLabel>{T._('Email* - Here you will receive the NFT redeemable link', 'Admin')}</NftLabel>
					<NftTextArea placeholder='Email' onChange={(e) => setNftEmail(e.target.value)} />
					{!validNftEmail && <NftLabel isNotValid>{T._('email not valid', 'Admin')}</NftLabel>}
				</NftItem>
				<NftItem>
					<NftLabel>{T._('Wallet Adress*', 'Admin')}</NftLabel>
					<NftTextArea placeholder='Wallet Adress' onChange={(e) => setNftWalletAddress(e.target.value)} />
					{!validNftWalletAddress && (
						<NftLabel isNotValid>
							{T._(
								'The wallet address is not compatible with Ethereum, please use one as suggested above.',
								'Admin',
							)}
						</NftLabel>
					)}
				</NftItem>
			</NftFormContainer>
			<NftButtonsContainer>
				<PriceAndYesButtonContainer>
					<NftPrice>{priceFormatter.format(price)}</NftPrice>
					<DialogFooterButton primary onClick={() => onConfirmationDialog(nftEmail, nftWalletAddress)}>
						{buttonYesLabel}
					</DialogFooterButton>
				</PriceAndYesButtonContainer>
				<NftText>
					{T._('By confirming you agree to abide by the ', 'Admin')}
					<NftLink target='_BLANK' href='https://www.zakeke.com/nft-enhanced-products-terms-and-conditions/'>
						{T._('terms and conditions', 'Admin')}
					</NftLink>
					{T._(' the processing of data with Marketing Purposes.', 'Admin')}
				</NftText>
				<NftTextAndNoButtonContainer>
					<NftText>
						{T._('Click here if you want to skip and continue buying the product regularly.', 'Admin')}
					</NftText>
					<DialogFooterButton onClick={onNoClick}>{buttonNoLabel}</DialogFooterButton>
				</NftTextAndNoButtonContainer>
			</NftButtonsContainer>
			{nftHtmlMessage && <div dangerouslySetInnerHTML={{ __html: nftHtmlMessage }} />}
		</Dialog>
	);
};

export default NFTDialog;
