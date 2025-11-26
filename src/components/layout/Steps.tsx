import { FC, useEffect, useState } from 'react';
import { Step, useZakeke } from '@zakeke/zakeke-configurator-react';
import { StepsContainer } from './SharedComponents';
import styled from 'styled-components';
import { Icon } from 'components/Atomic';
import { ReactComponent as LeftArrow } from '../../assets/icons/angle-left-solid.svg';
import { ReactComponent as RightArrow } from '../../assets/icons/angle-right-solid.svg';
import { range, T } from 'Helpers';
import React from 'react';
import useStore from 'Store';

const ArrowIcons = styled(Icon)<{ isRight?: boolean }>`
	position: absolute;
	top: 5px;
	${(props) => (props.isRight ? `right:-5px;` : `left:-5px;`)}
`;

const StepsIcons = styled.div<{ isMobile?: boolean }>`
	display: flex;
	${(props) => (props.isMobile ? `align-items:center;` : `align-items:flex-start;`)}
	justify-content:center;
	max-width: 100%;
	${(props) => !props.isMobile && `background-color: #fff;`}
	height: 40px;
	grid-gap: 20px;
	${(props) => (props.isMobile ? `justify-content:flex-start;` : `justify-content:center;`)}

	@media (max-width: 1500px) {
		grid-gap: 8px;
	}
`;

const StepItem = styled.div<{ selected?: boolean; isMobile?: boolean; stepName?: string }>`
	border-radius: 32px;
	background-color: #f4f4f4;
	color: #313c46;
	width: 32px;
	height: 32px;
	font-weight: 500;
	z-index: 2;
	position: relative;
	display: flex;
	align-items: center;
	font-size: 18px;
	justify-content: center;
	font-weight: bold;
	cursor: pointer;
	padding: 0px 20px;
	${(props) => props.selected && `background-color:#313c46;`}
	${(props) => props.selected && `color:white;`}

  :hover {
		background-color: #313c46;
		color: white;
	}
	${(props) =>
		!props.isMobile &&
		`
  :not(:last-child){
  :before{
    content: "";
    position: absolute;
    left: 100%;
    top: 50%;
    width: 100%;
    height: 1px;  
    background-color: #eee;
    z-index: 1;
  }
}
`}
	span {
		z-index: 2;
	}
`;

const ActualStepName = styled.h4<{ isMobile?: boolean }>`
	text-align: center;
	margin: 0;
	${(props) => !props.isMobile && `margin-top: 15px`};
	font-weight: 500;
	color: #313c46;
	${(props) =>
		props.isMobile &&
		`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width:70px;
    `}
`;

export const Steps: FC<{
	hasNextGroup?: boolean;
	hasPreviousGroup?: boolean;
	onNextStep: () => void;
	onPreviousStep: () => void;
	onStepChange: (step: Step | null) => void;
	currentStep?: Step | null;
	steps: Step[] | null;
	children?: React.ReactNode;
}> = ({
	hasNextGroup,
	hasPreviousGroup,
	onNextStep: onNextGroup,
	onPreviousStep: onPreviousGroup,
	onStepChange,
	currentStep,
	steps,
	children
}) => {
	const maxItems = window.innerWidth <= 1024 ? 3 : window.innerWidth <= 1366 ? 4 : window.innerWidth <= 1600 ? 5 : 6;
	const [actualStepIndex, setActualStepIndex] = useState<number>(0);
	const [cameraOfSelectedStepId, setCameraOfSelectedStepId] = useState<number>(-1);
	const { isMobile } = useStore();
	const { setCamera } = useZakeke();
	const rangeOfSteps = range(actualStepIndex + 1, maxItems, steps);

	const handleNextClick = () => {
		if (steps) {
			if (actualStepIndex === steps.length - 1) onNextGroup();
			else onStepChange(steps[actualStepIndex + 1]);
		}
	};

	const handlePreviousClick = () => {
		if (steps) {
			if (actualStepIndex === 0) onPreviousGroup();
			else onStepChange(steps[actualStepIndex - 1]);
		}
	};

	useEffect(() => {
		if (steps && currentStep) {
			setActualStepIndex(steps.indexOf(currentStep));
			if (currentStep.cameraLocationID && cameraOfSelectedStepId !== currentStep.id) {
				setCameraOfSelectedStepId(currentStep.id);
				setCamera(currentStep.cameraLocationID);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [steps, currentStep]);

	return (
		<StepsContainer>
			{(!(actualStepIndex === 0) || hasPreviousGroup) && !isMobile && (
				<ArrowIcons onClick={handlePreviousClick}>
					<LeftArrow />
				</ArrowIcons>
			)}

			<StepsIcons isMobile={isMobile}>
				{(!(actualStepIndex === 0) || hasPreviousGroup) && isMobile && (
					<Icon onClick={handlePreviousClick}>
						<LeftArrow />
					</Icon>
				)}
				{steps &&
					(steps.length < maxItems ? steps : rangeOfSteps).map((step, index) => {
						return (
							<React.Fragment key={step.id}>
								<StepItem
									isMobile={isMobile}
									key={step.id}
									onClick={() => onStepChange(step)}
									selected={step.id === currentStep?.id}
								>
									<span>{steps.indexOf(step) + 1}</span>
								</StepItem>
								{currentStep && step.id === currentStep?.id && isMobile && (
									<ActualStepName isMobile={isMobile}>{T._d(currentStep.name)}</ActualStepName>
								)}
							</React.Fragment>
						);
					})}
				{(!(actualStepIndex === steps!.length - 1) || hasNextGroup) && isMobile && (
					<Icon onClick={handleNextClick}>
						<RightArrow />
					</Icon>
				)}
			</StepsIcons>

			{(!(actualStepIndex === steps!.length - 1) || hasNextGroup) && !isMobile && (
				<ArrowIcons isRight onClick={handleNextClick}>
					<RightArrow />
				</ArrowIcons>
			)}
			{currentStep && !isMobile && <ActualStepName>{T._d(currentStep.name)}</ActualStepName>}
		</StepsContainer>
	);
};

export default Steps;
