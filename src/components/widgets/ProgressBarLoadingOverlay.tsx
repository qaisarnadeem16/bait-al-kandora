import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import { useZakeke } from '@zakeke/zakeke-configurator-react';
import useStore from 'Store';
import SkeletonDialog from './SkeletonDialog';

// Background container for the loading overlay
const ProgressBarLoadingBackground = styled.div`
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

// Container for the loading progress bar
const ProgressBarLoadingContainer = styled.div<{ $isMobile?: boolean }>`
	${(props) => (props.$isMobile ? `width: 300px` : `width: 650px`)};
	height: 150px;
	padding: 10px;
	display: inline-flex;
	padding: 48px 24px;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	border-radius: 4px;
	background: var(--surface-default, #fff);
	box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.15), 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
`;

// Component for the loading overlay with progress bar
const ProgressBarLoadingOverlay: FC<{ flagStartLoading: boolean }> = ({ flagStartLoading }) => {
	const { isSceneLoading, translations } = useZakeke();
	const [completed, setCompleted] = useState(0);
	const [areTranslationsLoaded, setAreTranslationsLoaded] = useState(false);
	const { isMobile } = useStore();

	useEffect(() => {
		let current_progress = 0;
		let step = 0.3;
		// if (!isSceneLoading) setCompleted(100.0);
		// else
		if (isSceneLoading)
			setInterval(() => {
				current_progress += step;
				setCompleted(Math.round((Math.atan(current_progress / 2) / (Math.PI / 2)) * 100 * 100) / 100);
			}, 400);
	}, [isSceneLoading]);

	useEffect(() => {
		if (translations) {
			setAreTranslationsLoaded(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [translations]);

	return (
		<ProgressBarLoadingBackground>
			<ProgressBarLoadingContainer $isMobile={isMobile}>
				{!areTranslationsLoaded ? (
					<SkeletonDialog />
				) : (
					<ProgressBar $flagStartLoading={flagStartLoading} $bgColor={'#F46200'} $completed={completed} />
				)}
			</ProgressBarLoadingContainer>
		</ProgressBarLoadingBackground>
	);
};

export default ProgressBarLoadingOverlay;
