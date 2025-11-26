import styled, { keyframes } from 'styled-components';

// Animazione per il caricamento
const loadingAnimation = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

// Stile del contenitore del dialog
const DialogContainer = styled.div`
	width: 100%;
	background-color: white;
	display: flex;
	flex-direction: column;
    grid-gap: 20px;
`;

// Stile delle linee scheletro
const SkeletonLine = styled.div`
	height: 12px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: ${loadingAnimation} 1.5s infinite;
	border-radius: 4px;

	&.short {
		width: 30%;
	}

	&.long {
		width: 100%;
	}
`;

const SkeletonDialog = () => {
	return (
		<DialogContainer>
			<SkeletonLine className='short' />
			<SkeletonLine className='long' />
		</DialogContainer>
	);
};

export default SkeletonDialog;
