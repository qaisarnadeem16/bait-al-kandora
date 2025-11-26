import { FC } from 'react';
import { TailSpin } from 'react-loader-spinner';
import styled from 'styled-components';

// Styled component for the background overlay
const LoadingBackground = styled.div`
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 12;
`;

// Styled component for the loading container
const LoadingContainer = styled.div`
	width: 68px;
	height: 68px;
	background-color: white;
	border-radius: 5px;
	padding: 10px;
`;

// LoadingOverlay component displays a loading spinner overlay
const LoadingOverlay: FC<{}> = () => {
	return (
		<LoadingBackground>
			<LoadingContainer>
				<TailSpin color='#000000' height={48} width={48} />
			</LoadingContainer>
		</LoadingBackground>
	);
};

export default LoadingOverlay;
