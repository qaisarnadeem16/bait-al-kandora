import styled from 'styled-components';
import React, { FC } from 'react';
import { TryOnButtonCustomization, TryOnMode, TryOnSettings } from '@zakeke/zakeke-configurator-react';
import useStore from 'Store';

export interface TryOnComponentProps {
	settings: TryOnSettings;
}

const TryOnContainer = styled.div`
	position: absolute;
	bottom: 40px;
	width: 100%;
	margin: auto;
	display: flex;
	gap: 5px;
	justify-content: center;
	align-items: center;
	align-content: center;
	@media (max-height: 550px) {
		bottom: 15px;
	}
`;

export const PDSwitch = styled.button`
	position: absolute;
	width: 200px;
	left: calc(50% - 100px);
	right: 0px;
	top: 3%;
	padding: 5px 16px;
	min-height: 38px;
	border: 1px solid rgb(49, 60, 70);
	background-color: white;
	display: flex;
	justify-content: space-around;
	-webkit-box-align: center;
	align-items: center;
	z-index: 10;
	cursor: pointer;
	font-weight: 600;
	&:hover {
		opacity: 0.7;
	}
`;

const TryOnsButtonContainer = styled.div<TryOnButtonCustomization>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	align-content: center;
	font-size: 12px;
	padding: 7px 10px;
	min-width: 100px;
	min-height: 50px;
	gap: 5px;
	color: ${(props) => props.textColor};
	background-color: ${(props) => props.backgroundColor};
	border: ${(props) => props.borderWidth}px solid ${(props) => props.borderColor};
	border-radius: ${(props) => props.borderRadius}px;
	cursor: pointer;
	& svg {
		width: 28px;
		height: 28px;
		object-fit: contain;
	}
	& > * {
		max-width: 75px;
		max-height: 75px;
	}
`;

interface TryOnButtonElementProps {
	onClick: () => void;
	customization: TryOnButtonCustomization;
	children?: React.ReactNode;
}

const TryOnButtonElement: FC<TryOnButtonElementProps> = (props: TryOnButtonElementProps) => {
	return (
		<TryOnsButtonContainer onClick={props.onClick} {...props.customization}>
			{props.children}
		</TryOnsButtonContainer>
	);
};

const TryOnsButton: FC<TryOnComponentProps> = (props: TryOnComponentProps) => {
	let buttons: React.ReactNode = null;

	const { setTryOnMode, tryOnRef } = useStore();

	const handleClick = (mode: TryOnMode) => {
		tryOnRef?.current?.setVisible?.(true);
		tryOnRef?.current?.changeMode?.(mode);
		setTryOnMode(mode);
	};

	if (props.settings.styleButton === 'single') {
		const button = props.settings.buttonCustomizations[0];
		console.log(button.borderWidth);
		buttons = (
			<TryOnButtonElement onClick={() => handleClick(TryOnMode.TryOn)} customization={button}>
				{button.image && button.image === 'base' ? (
					<VtoIcon />
				) : button.image ? (
					<img src={button.image!} alt='icon' />
				) : (
					<></>
				)}
				{button.textLabel}
			</TryOnButtonElement>
		);
	} else {
		const tryOnButton = props.settings.buttonCustomizations[0];
		const pdButton = props.settings.buttonCustomizations[1];
		buttons = (
			<>
				<TryOnButtonElement onClick={() => handleClick(TryOnMode.TryOn)} customization={tryOnButton}>
					{tryOnButton.image && tryOnButton.image === 'base' ? (
						<VtoIcon />
					) : tryOnButton.image ? (
						<img src={tryOnButton.image!} alt='icon' />
					) : (
						<></>
					)}
					{tryOnButton.textLabel}
				</TryOnButtonElement>
				<TryOnButtonElement onClick={() => handleClick(TryOnMode.PDTool)} customization={pdButton}>
					{pdButton.image && pdButton.image === 'base' ? (
						<PDToolSVGIcon />
					) : pdButton.image ? (
						<img src={pdButton.image!} alt='icon' />
					) : (
						<></>
					)}
					{pdButton.textLabel}
				</TryOnButtonElement>
			</>
		);
	}

	return <TryOnContainer>{buttons}</TryOnContainer>;
};

export const VtoIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
	<svg className={className} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 30 30'>
		<path
			fill={color ?? '#263238'}
			d='M4.591 6.494a.87.87 0 0 0 .881-.875V1.768h3.804a.87.87 0 0 0 .88-.875.87.87 0 0 0-.88-.876H3.711V5.62a.88.88 0 0 0 .88.875ZM20.53 1.75h3.805v3.852c0 .49.387.875.88.875a.87.87 0 0 0 .88-.875V0H20.53a.87.87 0 0 0-.88.875c0 .49.387.875.88.875ZM9.276 27.57H5.472v-3.85a.87.87 0 0 0-.88-.876.87.87 0 0 0-.881.875v5.602h5.565a.87.87 0 0 0 .88-.876.87.87 0 0 0-.88-.875Zm15.939-4.726a.87.87 0 0 0-.88.875v3.851H20.53a.87.87 0 0 0-.88.875c0 .49.387.876.88.876h5.566v-5.602a.88.88 0 0 0-.88-.875ZM14.93 27.203c-.723 0-1.304.577-1.304 1.295s.582 1.295 1.304 1.295a1.296 1.296 0 1 0 0-2.59ZM27.957 15.34c0 1.05-.192 1.95-.576 2.705-.383.75-.909 1.33-1.577 1.735-.665.403-1.42.604-2.267.604-.85 0-1.61-.201-2.278-.604-.665-.406-1.189-.986-1.572-1.74-.384-.754-.575-1.654-.575-2.7 0-1.047.191-1.947.575-2.698.383-.754.907-1.333 1.572-1.736.668-.405 1.427-.608 2.277-.608.847 0 1.603.203 2.268.608.668.403 1.194.982 1.577 1.736.384.751.576 1.65.576 2.699Zm-1.467 0c0-.798-.13-1.47-.389-2.017-.255-.55-.607-.966-1.054-1.247a2.74 2.74 0 0 0-1.51-.427c-.566 0-1.071.143-1.515.427-.445.281-.796.697-1.055 1.247-.256.546-.384 1.219-.384 2.018 0 .799.128 1.473.384 2.023.259.546.61.962 1.055 1.246.444.282.949.422 1.515.422a2.76 2.76 0 0 0 1.51-.422c.447-.284.799-.7 1.054-1.246.26-.55.389-1.224.389-2.023Zm-15.543-3.633v-1.275h7.599v1.275h-3.064v8.543h-1.476v-8.543h-3.059Zm-7.735-1.275 2.733 7.996h.11l2.732-7.996h1.602L6.855 20.25H5.144L1.61 10.432h1.6Z'
		/>
	</svg>
);

export const PDToolSVGIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
	<svg className={className} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 25'>
		<path
			stroke={color ?? '#263238'}
			stroke-linecap='round'
			stroke-width='.88'
			d='M6.916 10.916V4.314h28.168v6.602M10.437 4.754v4.401M24.52 4.754v4.401M13.958 4.754v4.401m14.084-4.401v4.401M17.479 4.754v4.401m14.084-4.401v4.401M21 4.754v6.162'
		/>
		<path
			fill={color ?? '#263238'}
			d='M7.042 14.437c-3.669 0-6.492 3.232-6.492 3.232l-.261.289.261.289s2.574 2.934 5.997 3.204c.163.021.326.028.495.028.168 0 .332-.007.495-.028 3.423-.27 5.997-3.204 5.997-3.204l.261-.29-.261-.288s-2.823-3.232-6.492-3.232Zm0 .88c.97 0 1.864.265 2.64.62a3.079 3.079 0 0 1-2.297 4.649c-.008 0-.018-.003-.027-.001-.105.005-.21.014-.316.014-.117 0-.23-.007-.344-.014a3.079 3.079 0 0 1-2.737-3.067c0-.574.155-1.11.426-1.568h-.013c.784-.361 1.688-.633 2.668-.633Zm0 .88a1.32 1.32 0 1 0 0 2.642 1.32 1.32 0 0 0 0-2.642Zm-3.851.413a3.93 3.93 0 0 0 .495 3.012 10.21 10.21 0 0 1-2.132-1.664c.212-.217.801-.79 1.637-1.348Zm7.702 0a10.542 10.542 0 0 1 1.637 1.348 10.213 10.213 0 0 1-2.132 1.664 3.93 3.93 0 0 0 .495-3.012Z'
		/>
		<g clip-path='url(#a)'>
			<path
				fill={color ?? '#263238'}
				d='M34.958 14.437c-3.668 0-6.491 3.232-6.491 3.232l-.262.289.262.289s2.573 2.934 5.996 3.204c.163.021.327.028.495.028.169 0 .332-.007.495-.028 3.423-.27 5.997-3.204 5.997-3.204l.261-.289-.26-.289s-2.824-3.232-6.493-3.232Zm0 .88c.97 0 1.864.265 2.641.62a3.079 3.079 0 0 1-2.297 4.649c-.008 0-.019-.003-.027-.001-.105.005-.21.014-.317.014-.117 0-.23-.007-.344-.014a3.079 3.079 0 0 1-2.736-3.067c0-.574.154-1.109.426-1.568h-.014c.784-.361 1.688-.633 2.668-.633Zm0 .88a1.32 1.32 0 1 0 0 2.642 1.32 1.32 0 0 0 0-2.641Zm-3.85.413a3.93 3.93 0 0 0 .495 3.012 10.213 10.213 0 0 1-2.133-1.664c.212-.217.802-.79 1.637-1.348Zm7.701 0a10.52 10.52 0 0 1 1.637 1.348 10.208 10.208 0 0 1-2.132 1.664 3.93 3.93 0 0 0 .495-3.012Z'
			/>
		</g>
		<defs>
			<clipPath id='a'>
				<path fill='none' d='M27.916 10.916H42V25H27.916z' />
			</clipPath>
		</defs>
	</svg>
);

export const PDSwitchButtonIcon = (
	<svg width='40' height='29' viewBox='0 0 30 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M4.89551 8.34513V3.78674H24.3446V8.34513'
			stroke='#263238'
			strokeWidth='0.607784'
			strokeLinecap='round'
		/>
		<path d='M7.32666 4.09058L7.32666 7.1295' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<path d='M17.0508 4.09058L17.0508 7.1295' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<path d='M9.75781 4.09058L9.75781 7.1295' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<path d='M19.4819 4.09058L19.4819 7.1295' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<path d='M12.189 4.09058L12.189 7.1295' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<path d='M21.9131 4.09058L21.9131 7.1295' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<path d='M14.6196 4.09058L14.6196 8.34507' stroke='#263238' strokeWidth='0.607784' strokeLinecap='round' />
		<g clipPath='url(#clip0_250_1448)'>
			<path
				d='M4.98316 10.7761C2.44993 10.7761 0.500748 13.0078 0.500748 13.0078L0.320312 13.2073L0.500748 13.4067C0.500748 13.4067 2.27781 15.433 4.64128 15.6194C4.75405 15.6337 4.86682 15.6384 4.98316 15.6384C5.09949 15.6384 5.21226 15.6337 5.32504 15.6194C7.68851 15.433 9.46557 13.4067 9.46557 13.4067L9.646 13.2073L9.46557 13.0078C9.46557 13.0078 7.51639 10.7761 4.98316 10.7761ZM4.98316 11.3839C5.65267 11.3839 6.26995 11.5667 6.80651 11.8113C7.00001 12.1318 7.1104 12.5009 7.1104 12.9034C7.1104 14.0014 6.28657 14.9036 5.22057 15.0211C5.21464 15.0223 5.20752 15.0199 5.20158 15.0211C5.12917 15.0247 5.05676 15.0306 4.98316 15.0306C4.90244 15.0306 4.82409 15.0259 4.74574 15.0211C3.67975 14.9036 2.85591 14.0014 2.85591 12.9034C2.85591 12.5069 2.96275 12.1377 3.15031 11.8208H3.14081C3.68212 11.5715 4.30652 11.3839 4.98316 11.3839ZM4.98316 11.9917C4.47984 11.9917 4.07148 12.4 4.07148 12.9034C4.07148 13.4067 4.47984 13.815 4.98316 13.815C5.48648 13.815 5.89483 13.4067 5.89483 12.9034C5.89483 12.4 5.48648 11.9917 4.98316 11.9917ZM2.3241 12.2766C2.27662 12.4808 2.24813 12.6861 2.24813 12.9034C2.24813 13.4364 2.40007 13.9349 2.66598 14.3564C1.90031 13.9136 1.3685 13.3853 1.194 13.2073C1.34001 13.0577 1.74718 12.6612 2.3241 12.2766ZM7.64222 12.2766C8.21914 12.6612 8.6263 13.0577 8.77231 13.2073C8.59781 13.3853 8.066 13.9136 7.30034 14.3564C7.56624 13.9349 7.71819 13.4364 7.71819 12.9034C7.71819 12.6861 7.6897 12.4784 7.64222 12.2766Z'
				fill='#263238'
			/>
		</g>
		<g clipPath='url(#clip1_250_1448)'>
			<path
				d='M24.2585 10.7761C21.7253 10.7761 19.7761 13.0078 19.7761 13.0078L19.5957 13.2073L19.7761 13.4067C19.7761 13.4067 21.5532 15.433 23.9167 15.6194C24.0294 15.6337 24.1422 15.6384 24.2585 15.6384C24.3749 15.6384 24.4877 15.6337 24.6004 15.6194C26.9639 15.433 28.741 13.4067 28.741 13.4067L28.9214 13.2073L28.741 13.0078C28.741 13.0078 26.7918 10.7761 24.2585 10.7761ZM24.2585 11.3839C24.9281 11.3839 25.5453 11.5667 26.0819 11.8113C26.2754 12.1318 26.3858 12.5009 26.3858 12.9034C26.3858 14.0014 25.562 14.9036 24.496 15.0211C24.49 15.0223 24.4829 15.0199 24.477 15.0211C24.4046 15.0247 24.3321 15.0306 24.2585 15.0306C24.1778 15.0306 24.0995 15.0259 24.0211 15.0211C22.9551 14.9036 22.1313 14.0014 22.1313 12.9034C22.1313 12.5069 22.2381 12.1377 22.4257 11.8208H22.4162C22.9575 11.5715 23.5819 11.3839 24.2585 11.3839ZM24.2585 11.9917C23.7552 11.9917 23.3469 12.4 23.3469 12.9034C23.3469 13.4067 23.7552 13.815 24.2585 13.815C24.7619 13.815 25.1702 13.4067 25.1702 12.9034C25.1702 12.4 24.7619 11.9917 24.2585 11.9917ZM21.5995 12.2766C21.552 12.4808 21.5235 12.6861 21.5235 12.9034C21.5235 13.4364 21.6755 13.9349 21.9414 14.3564C21.1757 13.9136 20.6439 13.3853 20.4694 13.2073C20.6154 13.0577 21.0226 12.6612 21.5995 12.2766ZM26.9176 12.2766C27.4945 12.6612 27.9017 13.0577 28.0477 13.2073C27.8732 13.3853 27.3414 13.9136 26.5757 14.3564C26.8416 13.9349 26.9936 13.4364 26.9936 12.9034C26.9936 12.6861 26.9651 12.4784 26.9176 12.2766Z'
				fill='#263238'
			/>
		</g>
		<defs>
			<clipPath id='clip0_250_1448'>
				<rect width='9.72455' height='9.72455' fill='#263238' transform='translate(0.120117 8.34509)' />
			</clipPath>
			<clipPath id='clip1_250_1448'>
				<rect width='9.72455' height='9.72455' fill='#263238' transform='translate(19.3955 8.34509)' />
			</clipPath>
		</defs>
	</svg>
);

export default TryOnsButton;
