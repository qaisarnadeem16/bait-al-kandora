import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from 'Helpers';
import { FC } from 'react';
import styled from 'styled-components';
import { ReactComponent as CheckSolid } from '../../assets/icons/check-circle-solid_1.svg';
import { Icon } from 'components/Atomic';
import useStore from 'Store';

const LoadingLabel = styled.div`
	color: #000;
	font-size: 12px;
	font-style: normal;
	font-weight: 700;
	line-height: 16px;
`;

const LoaderContainer = styled.div<{ $isMobile: boolean }>`
	height: 8px;
	${(props) => (props.$isMobile ? `width: 250px` : `width: 600px`)};
	border-radius: 4px;
	background-color: #dbe2e6;
`;

const LoadingPercentageLabel = styled.span`
	color: #8fa4ae;
	font-weight: 400;
	font-size: 12px;
	line-height: 16px;
	font-style: normal;
`;

const LoadingPercentageandIconContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;

const CheckIcon = styled(Icon)`
	cursor: unset;
	color: #008556;
`;

const LoaderFill = styled.div<{ $completed: number; $bgColor: string; $isCompleted: boolean }>`
	height: 100%;
	border-radius: 4px;
	margin: 7px 0px;
	${(props) => `width: ${props.$completed}% `};
	${(props) =>
		props.$bgColor && props.$isCompleted ? `background-color: #008556` : `background-color: ${props.$bgColor}`};
	border-radius: 'inherit';
`;

const ProgressBar: FC<{ $flagStartLoading: boolean; $bgColor: string; $completed: number }> = ({
	$flagStartLoading,
	$bgColor,
	$completed
}) => {
	const { isSceneLoading } = useZakeke();
	const { isMobile } = useStore();

	return (
		<div>
			<LoadingLabel>
				{isSceneLoading
					? T._d('Loading your product...')
						? T._d('Loading your product...')
						: T._('Loading your product...', 'Composer')
					: T._d('Loading complete.')
					? T._d('Loading complete.')
					: T._('Loading complete.', 'Composer')}
			</LoadingLabel>
			<LoaderContainer $isMobile={isMobile}>
				<LoaderFill
					$completed={!isSceneLoading && $flagStartLoading ? 100 : $completed}
					$bgColor={$bgColor}
					$isCompleted={!isSceneLoading && $flagStartLoading}
				></LoaderFill>
				<LoadingPercentageandIconContainer>
					<LoadingPercentageLabel>
						{isSceneLoading
							? (T._d('In progress | ') ? T._d('In progress | ') : T._('In progress | ', 'Composer')) +
							  `${$completed}%`
							: '100%'}
					</LoadingPercentageLabel>
					{!isSceneLoading && (
						<CheckIcon>
							<CheckSolid />
						</CheckIcon>
					)}
				</LoadingPercentageandIconContainer>
			</LoaderContainer>
		</div>
	);
};

export default ProgressBar;
