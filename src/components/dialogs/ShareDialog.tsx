import { Button } from 'components/Atomic';
import { T } from 'Helpers';
import { FC, useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import useStore from 'Store';
import styled from 'styled-components';
import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { ReactComponent as FbIcon } from '../../assets/images/social/facebook_svg.svg';
import { ReactComponent as EmailIcon } from '../../assets/images/social/mail_svg.svg';
import { ReactComponent as PinIcon } from '../../assets/images/social/pinterest_svg.svg';
import { ReactComponent as TwitterIcon } from '../../assets/images/social/twitter_svg.svg';
import { ReactComponent as WhatsappIcon } from '../../assets/images/social/whatsapp_svg.svg';
import { Dialog, DialogWindow } from './Dialogs';

declare const Zakeke: any;

const CustomWindow = styled(DialogWindow)`
	flex-basis: 450px;
`;

const ShareDialogContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	grid-gap: 10px;
	padding: 20px;
`;

const SharePreviewImg = styled.img`
	width: 100%;
	max-width: 250px;
	height: 100%;
	max-height: 300px;
	object-fit: contain;
`;

const SocialContainer = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	align-self: center;
	grid-gap: 30px;
`;

const ShareName = styled.span`
	font-weight: 700;
	font-size: 16px;
	font-family: 'Montserrat', sans-serif;
`;

const SocialIcon = styled.div`
	svg {
		height: 30px;
		color: #445a64;
		cursor: pointer;

		@media (hover) {
			&:hover {
				opacity: 0.7;
			}
		}
	}
`;

const Hr = styled.hr`
	border: 1px solid #dbe2e6;
	width: 100%;
`;

const ShareLinkContainer = styled.input`
	width: 100%;
	height: 40px;
	border: 1px solid #dbe2e6;
`;

const ShareDialog: FC<{}> = () => {
	const [imgUrl, setImgUrl] = useState('');
	const [shareCompositionUrl, setShareCompositionUrl] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const { isMobile, isDraftEditor, isViewerMode } = useStore();
	const { useLegacyScreenshot, getOnlineScreenshot, sellerSettings, getShareCompositionUrl } = useZakeke();

	const fetchImageToBlob = async (url: string) => {
		const response = await fetch(url);
		let blob = await response.blob();
		let file = new File([blob], 'share.png', { type: blob.type });
		return file;
	};

	const getShareCompositionUrlAsync = async () => {
		let shareCompositionUrl = '';
		shareCompositionUrl = await getShareCompositionUrl();
		setShareCompositionUrl(shareCompositionUrl);
	};

	useEffect(() => {
		getOnlineScreenshot(1024, 1024, useLegacyScreenshot, '#FFFFFF').then(async ({ originalUrl, rewrittenUrl }) => {
			console.log(originalUrl, rewrittenUrl);
			const file = await fetchImageToBlob(originalUrl);
			setFile(file);

			setImgUrl(rewrittenUrl);

			if (sellerSettings && !isDraftEditor && (sellerSettings.shareType === 2 || sellerSettings.shareType === 3))
				getShareCompositionUrlAsync();
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFacebookClick = (url: string) => {
		if (!url) return;

		openWindow(
			'https://www.facebook.com/dialog/feed?app_id=' +
				Zakeke.config.facebookAppID +
				'&display=popup&link=' +
				encodeURIComponent(url),
			'Facebook',
			500,
			500
		);
	};

	const handlePinterestClick = (url: string) => {
		if (!url) return;

		openWindow(
			'https://pinterest.com/pin/create/bookmarklet/?media=' +
				encodeURIComponent(url) +
				'&url=zakeke.com&is_video=0&description=',
			'Pinterest',
			500,
			500
		);
	};

	const handleTwitterClick = (url: string) => {
		if (!url) return;

		openWindow('https://twitter.com/intent/tweet?text=' + encodeURIComponent(url), 'Twitter', 500, 500);
	};

	const handleWhatsappClick = (url: string) => {
		if (!url) return;

		openWindow('whatsapp://send?text=' + encodeURIComponent(url), 'Whatsapp', 500, 500);
	};

	const handleEmailClick = (url: string) => {
		if (!url) return;

		let mailLink = `mailto:?subject=&body=${encodeURIComponent(url)}`;
		let newTabLink = document.createElement('a');
		newTabLink.setAttribute('href', mailLink);
		newTabLink.setAttribute('target', '_blank');
		document.body.appendChild(newTabLink);
		newTabLink.click();
		newTabLink.remove();
	};

	const openWindow = (url: string, name: string, width: number, height: number) => {
		const left = (window.innerWidth - width) / 2;
		const top = (window.innerHeight - height) / 2;
		return window.open(
			url,
			name,
			'width=' +
				width +
				',height=' +
				height +
				',left=' +
				left +
				',top=' +
				top +
				',menubar=no,location=no,status=no,toolbar=no'
		);
	};

	const handleOnShareClick = (url?: string) => {
		const fileShare = file;
		try {
			if (fileShare && (navigator as any).canShare && (navigator as any).canShare({ files: [fileShare] })) {
				(navigator as any).share({
					files: [fileShare],
					title: 'Share',
					text: ''
				});
			} else {
				(navigator as any).share({ url: url });
			}
		} catch (ex) {
			alert((ex as any).message);
		}
	};

	return (
		<Dialog windowDecorator={CustomWindow} noMarginFooterButton alignButtons='center'>
			<ShareDialogContainer>
				{(sellerSettings?.shareType === 1 || sellerSettings?.shareType === 3) && (
					<>
						<ShareName>{T._('Share your design', 'Composer')}</ShareName>
						{imgUrl === '' && <TailSpin color='#000000' />}
						{imgUrl !== '' && <SharePreviewImg src={imgUrl} alt='preview' />}
						{isMobile && (navigator as any).share && (
							<Button uppercase primary isFullWidth onClick={() => handleOnShareClick(imgUrl)}>
								{T._('Share image', 'Composer')}
							</Button>
						)}
						{(!isMobile || !navigator.share) && (
							<SocialContainer>
								<SocialIcon title='Facebook' onClick={() => handleFacebookClick(imgUrl)}>
									<FbIcon />
								</SocialIcon>
								<SocialIcon title='Pinterest' onClick={() => handlePinterestClick(imgUrl)}>
									<PinIcon />
								</SocialIcon>
								<SocialIcon title='Twitter' onClick={() => handleTwitterClick(imgUrl)}>
									<TwitterIcon />
								</SocialIcon>
								<SocialIcon title='Email' onClick={() => handleEmailClick(imgUrl)}>
									<EmailIcon />
								</SocialIcon>
								<SocialIcon title='Whatsapp' onClick={() => handleWhatsappClick(imgUrl)}>
									<WhatsappIcon />
								</SocialIcon>
							</SocialContainer>
						)}
					</>
				)}

				{!isDraftEditor && !isViewerMode && sellerSettings!.shareType === 3 && <Hr />}

				{!isDraftEditor &&
					!isViewerMode &&
					(sellerSettings?.shareType === 2 || sellerSettings?.shareType === 3) && (
						<>
							{shareCompositionUrl === '' && <TailSpin color='#000000' />}
							{shareCompositionUrl !== '' && (
								<>
									<ShareName>{T._('Share your configuration', 'Composer')}</ShareName>
									<ShareLinkContainer value={shareCompositionUrl} />
									{isMobile && (navigator as any).share && (
										<Button
											uppercase
											primary
											isFullWidth
											onClick={() => handleOnShareClick(shareCompositionUrl)}
										>
											{T._('Share link', 'Composer')}
										</Button>
									)}
									{(!isMobile || !navigator.share) && (
										<SocialContainer>
											<SocialIcon
												title='Facebook'
												onClick={() => handleFacebookClick(shareCompositionUrl)}
											>
												<FbIcon />
											</SocialIcon>
											<SocialIcon
												title='Pinterest'
												onClick={() => handlePinterestClick(shareCompositionUrl)}
											>
												<PinIcon />
											</SocialIcon>
											<SocialIcon
												title='Twitter'
												onClick={() => handleTwitterClick(shareCompositionUrl)}
											>
												<TwitterIcon />
											</SocialIcon>
											<SocialIcon
												title='Email'
												onClick={() => handleEmailClick(shareCompositionUrl)}
											>
												<EmailIcon />
											</SocialIcon>
											<SocialIcon
												title='Whatsapp'
												onClick={() => handleWhatsappClick(shareCompositionUrl)}
											>
												<WhatsappIcon />
											</SocialIcon>
										</SocialContainer>
									)}
								</>
							)}
						</>
					)}
			</ShareDialogContainer>
		</Dialog>
	);
};
export default ShareDialog;
