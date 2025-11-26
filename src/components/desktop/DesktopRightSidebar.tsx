import { Attribute, Step, ThemeTemplateGroup } from '@zakeke/zakeke-configurator-react';
import { ReactComponent as AngleLeftSolid } from '../../assets/icons/angle-left-solid.svg';
import { ReactComponent as AngleRightSolid } from '../../assets/icons/angle-right-solid.svg';
import textIcon from '../../assets/icons/font-solid.svg';
import savedCompositionsIcon from '../../assets/icons/saved_designs.svg';
import star from '../../assets/icons/star.svg';
import OptionItem from '../widgets/Option';
import Designer from '../layout/Designer';

import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { CarouselContainer, Icon } from 'components/Atomic';
import { T, useActualGroups, useUndoRedoActions, useUndoRegister } from 'Helpers';
import { Map } from 'immutable';
import React, { useEffect, useState } from 'react';
import useStore from 'Store';
import styled from 'styled-components';
import arrowDown from '../../assets/icons/angle-down-solid.svg';
import arrowUp from '../../assets/icons/angle-up-solid.svg';
import DesignsDraftList from '../layout/DesignsDraftList';
import {
	ArrowIcon,
	ItemAccordion,
	ItemAccordionName,
	ItemAccordionContainer,
	AttributeDescription,
	ItemContainer,
	ItemName,
	AttributesContainer,
	GroupIcon,
	GroupItem,
	GroupsContainer,
	Options,
	OptionsContainer,
	OptionSelectedName,
	ItemAccordionDescription
} from '../layout/SharedComponents';
import Steps from '../layout/Steps';
import TemplateGroup from 'components/TemplateGroup';

export const DesktopRightSidebarContainer = styled.div`
	display: flex;
	flex-flow: row;
	justify-content: flex-end;
	min-height: 0;

	@media (max-width: 1024px) {
		width: 100%;
		height: 50%;
		flex-direction: column;
		position: relative;
	}
`;

const SliderArrow = styled<React.FC<React.ComponentProps<typeof Icon> & { arrowDirection: 'left' | 'right' }>>(Icon)`
	background: white;
	border: 1px #eee solid;
	border-radius: 3px;
	position: relative;

	${(props) => props.arrowDirection === 'left' && `left: -28px`}
	${(props) => props.arrowDirection === 'right' && `right: -28px`}
`;

// This is the right sidebar component for the desktop layout
// that contains the list of groups, steps, attributes and options.
const DesktopRightSidebar = () => {
	const { isSceneLoading, templates, currentTemplate, setCamera, setTemplate, draftCompositions } = useZakeke();

	const {
		setSelectedGroupId,
		selectedGroupId,
		setSelectedStepId,
		selectedStepId,
		setSelectedAttributeId,
		selectedAttributeId,
		isUndo,
		isRedo,
		setSelectedTemplateGroupId,
		selectedTemplateGroupId,
		lastSelectedItem,
		setLastSelectedItem
	} = useStore();
	const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);
	const [attributesOpened, setAttributesOpened] = useState<Map<number, boolean>>(Map());
	const [isStartRegistering, setIsStartRegistering] = useState(false);

	const [lastSelectedSteps, setLastSelectedSteps] = useState(Map<number, number>());
	const [lastSelectedItemsFromGroups, setLastSelectedItemsFromGroups] = useState(Map<number, [number, string]>());
	const [lastSelectedItemsFromSteps, setLastSelectedItemFromSteps] = useState(Map<number, [number, string]>());

	const actualGroups = useActualGroups();
	const selectedGroup = selectedGroupId ? actualGroups.find((group) => group.id === selectedGroupId) : null;
	const selectedStep = selectedGroupId
		? actualGroups.find((group) => group.id === selectedGroupId)?.steps.find((step) => step.id === selectedStepId)
		: null;

	const currentAttributes = selectedStep ? selectedStep.attributes : selectedGroup ? selectedGroup.attributes : [];
	const currentTemplateGroups = selectedStep
		? selectedStep.templateGroups
		: selectedGroup
		? selectedGroup.templateGroups
		: [];

	const currentItems = [...currentAttributes, ...currentTemplateGroups].sort(
		(a, b) => a.displayOrder - b.displayOrder
	);
	const selectedAttribute = currentAttributes
		? currentAttributes.find((attr) => attr.id === selectedAttributeId)
		: null;

	const selectedTemplateGroup = currentTemplateGroups
		? currentTemplateGroups.find((templGr) => templGr.templateGroupID === selectedTemplateGroupId)
		: null;

	// const [lastSelectedItem, setLastSelectedItem] = useState<{ type: string; id: number }>();

	const undoRegistering = useUndoRegister();
	const undoRedoActions = useUndoRedoActions();
	const groupIndex = actualGroups && selectedGroup ? actualGroups.indexOf(selectedGroup) : 0;

	const handleNextStep = () => {
		if (selectedGroup) {
			if (groupIndex < actualGroups.length - 1) {
				const nextGroup = actualGroups[groupIndex + 1];
				handleGroupSelection(nextGroup.id);
			}
		}
	};

	const handlePreviousStep = () => {
		if (selectedGroup) {
			if (groupIndex > 0) {
				let previousGroup = actualGroups[groupIndex - 1];
				handleGroupSelection(previousGroup.id);

				// Select the last step
				if (previousGroup.steps.length > 0)
					handleStepSelection(previousGroup.steps[previousGroup.steps.length - 1].id);
			}
		}
	};

	const handleStepChange = (step: Step | null) => {
		if (step) handleStepSelection(step.id);
	};

	const handleGroupSelection = (groupId: number) => {
		setIsStartRegistering(undoRegistering.startRegistering());

		if (groupId && selectedGroupId !== groupId && !isUndo && !isRedo) {
			undoRedoActions.eraseRedoStack();
			undoRedoActions.fillUndoStack({
				type: 'group',
				id: selectedGroupId,
				direction: 'undo'
			});
			undoRedoActions.fillUndoStack({
				type: 'group',
				id: groupId ?? null,
				direction: 'redo'
			});
		}
		setSelectedGroupId(groupId);
	};

	const handleStepSelection = (stepId: number | null) => {
		setIsStartRegistering(undoRegistering.startRegistering());

		if (selectedStepId !== stepId && !isUndo && !isRedo) {
			undoRedoActions.eraseRedoStack();
			undoRedoActions.fillUndoStack({
				type: 'step',
				id: selectedStepId,
				direction: 'undo'
			});
			undoRedoActions.fillUndoStack({
				type: 'step',
				id: stepId ?? null,
				direction: 'redo'
			});
		}

		setSelectedStepId(stepId);

		const newStepSelected = lastSelectedSteps.set(selectedGroupId!, stepId!);
		setLastSelectedSteps(newStepSelected);
	};

	const handleAttributeSelection = (attributeId: number, isAttributesVertical?: boolean) => {
		setIsStartRegistering(undoRegistering.startRegistering());

		if (attributeId && selectedAttributeId !== attributeId && !isUndo && !isRedo) {
			undoRedoActions.eraseRedoStack();
			undoRedoActions.fillUndoStack({
				type: 'attribute',
				id: selectedAttributeId,
				direction: 'undo'
			});
			undoRedoActions.fillUndoStack({
				type: 'attribute',
				id: attributeId,
				direction: 'redo'
			});
		}

		setSelectedAttributeId(attributeId);

		if (isAttributesVertical && !selectedGroup?.attributesAlwaysOpened) {
			setAttributesOpened(attributesOpened.set(attributeId, !attributesOpened.get(attributeId)));
		}

		if (selectedStep && selectedStep.attributes.find((attr) => attr.id === attributeId)) {
			const newLastAttributeSelected = lastSelectedItemsFromSteps.set(selectedStepId!, [
				attributeId,
				'attribute'
			]);
			setLastSelectedItemFromSteps(newLastAttributeSelected);
		} else {
			const newLastAttributeSelected = lastSelectedItemsFromGroups.set(selectedGroupId!, [
				attributeId,
				'attribute'
			]);
			setLastSelectedItemsFromGroups(newLastAttributeSelected);
		}
		setLastSelectedItem({ type: 'attribute', id: attributeId });
	};

	const handleTemplateGroupSelection = (templateGroupId: number, isTemplateVertical?: boolean) => {
		setSelectedTemplateGroupId(templateGroupId);
		setLastSelectedItem({ type: 'template-group', id: templateGroupId });
		if (isTemplateVertical && !selectedGroup?.attributesAlwaysOpened) {
			setAttributesOpened(attributesOpened.set(templateGroupId, !attributesOpened.get(templateGroupId)));
		}
		if (
			selectedStep &&
			selectedStep.templateGroups.find((templGr) => templGr.templateGroupID === templateGroupId)
		) {
			const newLastTemplateGroupSelected = lastSelectedItemsFromSteps.set(selectedStepId!, [
				templateGroupId,
				'template group'
			]);
			setLastSelectedItemFromSteps(newLastTemplateGroupSelected);
		} else {
			const newLastItemSelected = lastSelectedItemsFromGroups.set(selectedGroupId!, [
				templateGroupId,
				'template group'
			]);
			setLastSelectedItemsFromGroups(newLastItemSelected);
		}
	};
	const setTemplateByID = async (templateID: number) => await setTemplate(templateID);
	// Initial template selection
	useEffect(() => {
		if (templates.length > 0 && !currentTemplate) setTemplateByID(templates[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templates]);

	// Initial group selection
	useEffect(() => {
		if (!isSceneLoading && actualGroups.length > 0 && !selectedGroupId) {
			handleGroupSelection(actualGroups[0].id);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSceneLoading, actualGroups]);

	// Reset attribute selection when group selection changes
	useEffect(() => {
		if (selectedGroup && selectedGroup.id !== -2) {
			if (selectedGroup.steps.length > 0) {
				// verifico che ci fosse già uno step selezionato per quel gruppo E CHE LO STESSO sia visibile
				// prima di selezionarlo, altrimenti seleziono il primo step disponibile del gruppo
				if (
					lastSelectedSteps.get(selectedGroupId!) &&
					selectedGroup.steps.find((step) => step.id === lastSelectedSteps.get(selectedGroupId!)!)
				)
					handleStepSelection(lastSelectedSteps.get(selectedGroupId!)!);
				else handleStepSelection(selectedGroup.steps[0].id);
			} else {
				handleStepSelection(null);
			}

			setSelectedCarouselSlide(0);

			if (!actualGroups.find((group) => group.id === selectedGroupId)!.attributesAlwaysOpened) {
				let attributes: Attribute[] = [];
				let group = actualGroups.find((group) => group.id === selectedGroupId)!;
				if (group.attributes.length > 0) {
					attributes.push(group.attributes[0]);
				}
				if (group.steps.length > 0) {
					let stepsFirstAttributes = group.steps.map((step) => {
						if (step.attributes.length > 0) {
							return step.attributes[0];
						} else return null;
					});
					stepsFirstAttributes.forEach((attribute) => {
						if (attribute) attributes.push(attribute);
					});
				}
				if (attributes && attributes.length > 0) {
					// Add attributes in openedAttributes and set isOpened to true if already exists
					setAttributesOpened((prev) => {
						attributes.forEach((attribute) => {
							prev = prev.set(attribute.id, true);
						});

						return prev;
					});
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedGroupId, selectedGroup?.steps.length]);

	// check at any changes if there are attributes that needs to be opened
	useEffect(() => {
		if (actualGroups) {
			let attributes: Attribute[] = [];

			actualGroups.forEach((group) => {
				if (group.direction === 1) {
					if (group.attributesAlwaysOpened)
						group.attributes
							.concat(group.steps.flatMap((s) => s.attributes))
							.map((attr) => attributes.push(attr));
				}
			});
			if (attributes.length > 0) {
				// Add attributes in openedAttributes and set isOpened to true if already exists
				setAttributesOpened((prev) => {
					attributes.forEach((attribute) => {
						prev = prev.set(attribute.id, true);
					});

					return prev;
				});
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actualGroups]);

	// Camera for groups
	useEffect(() => {
		if (!isSceneLoading && selectedGroup && selectedGroup.cameraLocationId) {
			setCamera(selectedGroup.cameraLocationId);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedGroupId, isSceneLoading]);

	// Camera for attributes
	useEffect(() => {
		if (!isSceneLoading && selectedAttribute && selectedAttribute.cameraLocationId) {
			setCamera(selectedAttribute.cameraLocationId);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAttribute, !isSceneLoading]);

	// select an attribute if selected step or group change
	useEffect(() => {
		if (selectedStep && currentItems.length > 0) {
			if (lastSelectedItemsFromSteps && selectedStepId && lastSelectedItemsFromSteps.get(selectedStepId!)) {
				const selectedItem = lastSelectedItemsFromSteps.get(selectedStepId!);
				if (selectedItem && selectedItem[1] === 'attribute') {
					if (selectedStep.attributes.some((attr) => attr.id === selectedItem[0]))
						handleAttributeSelection(lastSelectedItemsFromSteps!.get(selectedStepId!)![0]!);
					else handleAttributeSelection(selectedStep.attributes[0].id);
				}
				if (selectedItem && selectedItem[1] === 'template group') {
					if (selectedStep.templateGroups.some((templGr) => templGr.templateGroupID === selectedItem[0]))
						handleTemplateGroupSelection(lastSelectedItemsFromSteps!.get(selectedStepId!)![0]!);
					else handleTemplateGroupSelection(selectedStep.templateGroups[0].templateGroupID);
				}
			} else {
				if (!(currentItems[0] instanceof ThemeTemplateGroup)) handleAttributeSelection(currentItems[0].id);
				else handleTemplateGroupSelection(currentItems[0].templateGroupID);
			}
		} else if (selectedGroup && currentItems.length > 0) {
			if (lastSelectedItemsFromSteps && selectedGroupId && lastSelectedItemsFromGroups.get(selectedGroupId)) {
				const selectedItem = lastSelectedItemsFromGroups.get(selectedGroupId);
				if (selectedItem && selectedItem[1] === 'attribute') {
					const attributeToBeAutoSelected = selectedGroup.attributes.find(
						(attr) => attr.id === selectedItem[0]
					);
					// fix check if enabled in case of attributes with link
					if (attributeToBeAutoSelected && attributeToBeAutoSelected.enabled)
						handleAttributeSelection(lastSelectedItemsFromGroups!.get(selectedGroupId!)![0]!);
					else if (selectedGroup && selectedGroup.attributes.length > 0)
						handleAttributeSelection(selectedGroup.attributes[0].id);
				}
				if (selectedItem && selectedItem[1] === 'template group') {
					if (selectedGroup.templateGroups.some((templGr) => templGr.templateGroupID === selectedItem[0]))
						handleTemplateGroupSelection(lastSelectedItemsFromGroups!.get(selectedGroupId!)![0]!);
				}
			} else {
				if (!(currentItems[0] instanceof ThemeTemplateGroup))
					handleAttributeSelection(selectedGroup.attributes[0].id);
				else handleTemplateGroupSelection(currentItems[0].templateGroupID);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStepId, selectedGroupId]);

	useEffect(() => {
		if (isStartRegistering) {
			undoRegistering.endRegistering(false);
			setIsStartRegistering(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isStartRegistering]);

	return (
		<DesktopRightSidebarContainer>
			<GroupsContainer>
				{actualGroups &&
					!(actualGroups.length === 1 && actualGroups[0].name.toLowerCase() === 'other') &&
					actualGroups.map((group) => {
						if (group)
							return (
								<GroupItem
									key={group.guid}
									className={'group-item' + (group.id === selectedGroupId ? ' selected' : '')}
									onClick={() => handleGroupSelection(group.id)}
								>
									<GroupIcon
										loading='lazy'
										// fetchpriority="low"
										src={
											group.imageUrl && group.imageUrl !== ''
												? group.id === -3
													? savedCompositionsIcon
													: group.imageUrl
												: group.id === -2
												? textIcon
												: star
										}
									/>
									<span>{group.name ? T._d(group.name) : T._('Customize', 'Composer')}</span>
								</GroupItem>
							);
						else return null;
					})}
			</GroupsContainer>
			<AttributesContainer key={selectedAttributeId}>
				{/* Steps */}
				{selectedGroup && selectedGroupId !== -2 && selectedGroup.steps && selectedGroup.steps.length > 0 && (
					<Steps
						key={'steps-' + selectedGroupId}
						hasNextGroup={groupIndex !== actualGroups.length - 1}
						hasPreviousGroup={groupIndex !== 0}
						onNextStep={handleNextStep}
						onPreviousStep={handlePreviousStep}
						currentStep={selectedStep}
						steps={selectedGroup.steps}
						onStepChange={handleStepChange}
					/>
				)}

				{selectedGroupId && selectedGroupId !== -2 && selectedGroupId !== -3 && (
					<>
						{/* Attributes */}
						{selectedGroup?.direction === 0 && (
							<>
								<CarouselContainer
									key={selectedGroupId}
									slidesToShow={window.innerWidth <= 1600 ? 3 : 4}
									slideIndex={selectedCarouselSlide}
									afterSlide={setSelectedCarouselSlide}
									slidesToScroll={1}
									speed={50}
									renderBottomCenterControls={() => <span />}
									renderCenterRightControls={({ nextSlide, currentSlide, slideCount }) =>
										currentSlide + (window.innerWidth <= 1600 ? 3 : 4) > slideCount - 1 ? null : (
											<SliderArrow arrowDirection='right' onClick={nextSlide}>
												<AngleRightSolid />
											</SliderArrow>
										)
									}
									renderCenterLeftControls={({ previousSlide, currentSlide, slideCount }) =>
										currentSlide === 0 ? null : (
											<SliderArrow arrowDirection='left' onClick={previousSlide}>
												<AngleLeftSolid />
											</SliderArrow>
										)
									}
								>
									{currentItems &&
										currentItems.map((item) => {
											if (!(item instanceof ThemeTemplateGroup))
												return (
													<ItemContainer
														selected={item.id === lastSelectedItem?.id}
														key={item.guid}
														onClick={() => handleAttributeSelection(item.id)}
													>
														<ItemName key={item.name}>
															{' '}
															{T._d(item.name.toUpperCase())}{' '}
														</ItemName>
														<OptionSelectedName>
															{item.options.find((opt) => opt.selected)
																? T._d(item.options.find((opt) => opt.selected)!.name)
																: ''}
														</OptionSelectedName>
													</ItemContainer>
												);
											else
												return (
													<ItemContainer
														selected={item.templateGroupID === lastSelectedItem?.id}
														key={item.templateGroupID}
														onClick={() =>
															handleTemplateGroupSelection(item.templateGroupID)
														}
													>
														<ItemName key={item.name}>
															{T._d(item.name.toUpperCase())}
														</ItemName>
													</ItemContainer>
												);
										})}
								</CarouselContainer>

								{lastSelectedItem?.type === 'attribute' ? (
									<>
										<OptionsContainer key={'options-container'}>
											<Options key={'option'}>
												{selectedAttribute &&
													selectedAttribute.options
														.filter((x) => x.enabled)
														.map((option) => (
															<OptionItem
																key={option.guid}
																selectedAttribute={selectedAttribute}
																option={option}
																hasDescriptionIcon={selectedAttribute.options.some(
																	(x) => x.description
																)}
															/>
														))}
											</Options>
										</OptionsContainer>
										<AttributeDescription>{selectedAttribute?.description}</AttributeDescription>
									</>
								) : (
									<TemplateGroup
										key={selectedTemplateGroupId}
										templateGroup={selectedTemplateGroup!}
									/>
								)}
							</>
						)}

						{selectedGroup?.direction === 1 && (
							<>
								{currentItems &&
									currentItems.map((item) => {
										if (!(item instanceof ThemeTemplateGroup))
											return (
												<ItemAccordionContainer key={'container' + item.code}>
													<ItemAccordion
														key={item.guid}
														opened={attributesOpened.get(item.id)}
														onClick={
															selectedGroup.attributesAlwaysOpened
																? () => null
																: () => handleAttributeSelection(item.id, true)
														}
													>
														<ItemAccordionName>{T._d(item.name)}</ItemAccordionName>

														{!selectedGroup.attributesAlwaysOpened && (
															<ArrowIcon
																key={'accordion-icon'}
																src={
																	attributesOpened.get(item.id) ? arrowUp : arrowDown
																}
															/>
														)}
													</ItemAccordion>
													{item.description !== '' && (
														<ItemAccordionDescription>
															{T._d(item.description)}
														</ItemAccordionDescription>
													)}

													{attributesOpened.get(item.id) && (
														<OptionsContainer>
															<Options>
																{item.options
																	.filter((x) => x.enabled)
																	.map((option) => (
																		<OptionItem
																			key={option.guid}
																			selectedAttribute={selectedAttribute}
																			option={option}
																			hasDescriptionIcon={item.options.some(
																				(x) => x.description
																			)}
																		/>
																	))}
															</Options>
														</OptionsContainer>
													)}
												</ItemAccordionContainer>
											);
										else
											return (
												<>
													<ItemAccordionContainer key={'container' + item.templateGroupID}>
														<ItemAccordion
															key={item.templateGroupID + 'accordion'}
															opened={attributesOpened.get(item.templateGroupID)}
															onClick={() =>
																handleTemplateGroupSelection(item.templateGroupID, true)
															}
														>
															<ItemAccordionName>{T._d(item.name)}</ItemAccordionName>

															{!selectedGroup.attributesAlwaysOpened && (
																<ArrowIcon
																	key={'accordion-icon'}
																	src={
																		attributesOpened.get(item.templateGroupID)
																			? arrowUp
																			: arrowDown
																	}
																/>
															)}
														</ItemAccordion>

														{attributesOpened.get(item.templateGroupID) && (
															<TemplateGroup
																key={selectedTemplateGroupId + 'vertical'}
																templateGroup={selectedTemplateGroup!}
															/>
														)}
													</ItemAccordionContainer>
												</>
											);
									})}
							</>
						)}
					</>
				)}

				{/* Designer / Customizer */}
				{selectedGroupId === -2 && <Designer />}

				{/* Saved Compositions */}
				{draftCompositions && selectedGroupId === -3 && <DesignsDraftList />}
			</AttributesContainer>
		</DesktopRightSidebarContainer>
	);
};

export default DesktopRightSidebar;
