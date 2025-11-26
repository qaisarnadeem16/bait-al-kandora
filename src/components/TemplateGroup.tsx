import { ThemeTemplateGroup, useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from 'Helpers';
import { FC, useEffect, useState } from 'react';
import Select, { CSSObjectWithLabel } from 'react-select';
import styled from 'styled-components';
import { CloseEditorButton } from './Atomic';

interface Category {
	label: string;
	value: number;
}

interface MacroCategory {
	label: string;
	options: Category[];
}

interface ThemeTemplateGroupsCompositions {
	compositionID: number;
	name: string;
	previewImageUrl: string;
}

const TemplateGroupContainer = styled.div<{ $isMobile?: boolean }>`
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 20px 0px;
	${(props) =>
		props.$isMobile &&
		`
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:11;
        background-color:#ffffff;
    `}
`;

const TemplatesContainer = styled.div<{ $isMobile?: boolean }>`
	padding: 20px 0px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(128px, 150px));
	grid-gap: 10px;
	cursor: pointer;
	${(props) =>
		props.$isMobile &&
		`
        padding: 5px;
        justify-content: center;
    `};
`;

const TemplateItem = styled.div<{ $isMobile?: boolean; selected?: boolean }>`
	display: flex;
	flex-direction: column;
	position: relative;
	text-align: center;
	border: 1px solid transparent;
	padding: 0 20px;
	img {
		width: 100%;
	}
	&:hover {
		border: 1px solid #161b1f;
	}
	${(props) =>
		props.selected &&
		`
		background-color: #eceff1;
    `};
`;

const TemplateGroup: FC<{ templateGroup: ThemeTemplateGroup; isMobile?: boolean; onCloseClick?: () => void }> = ({
	templateGroup,
	isMobile,
	onCloseClick
}) => {
	const [selectedCategory, setSelectedCategory] = useState<Category>();
	const [categories, setCategories] = useState<MacroCategory[]>();
	const [appliedTemplateID, setAppliedTemplateID] = useState(0);
	const [allCategories, setAllCategories] = useState<{ categoryID: number; composition: any[] }[]>();
	const { applyTemplate } = useZakeke();
	const [templates, setTemplates] = useState<ThemeTemplateGroupsCompositions[]>();

	const handleCategoryClick = async (category: any) => {
		setSelectedCategory(category);
		await updateTemplates(category.value);
	};

	const handleTemplateClick = async (templateID: number) => {
		setAppliedTemplateID(templateID);
		applyTemplate(templateID);
	};

	const updateTemplates = async (categoryID: number) => {
		const template = allCategories!.find(
			(singleCategory: { categoryID: number; composition: any[] }) => categoryID === singleCategory.categoryID
		)?.composition;
		if (template) await setTemplates(template);
		else await setTemplates([]);
	};

	useEffect(() => {
		if (
			templateGroup &&
			templateGroup.macroCategory.length > 0 &&
			templateGroup.macroCategory[0].category.length > 0 &&
			!categories
		) {
			setSelectedCategory({
				label: templateGroup.macroCategory[0].category[0].name,
				value: templateGroup.macroCategory[0].category[0].id
			});

			const categories: MacroCategory[] = templateGroup.macroCategory
				.filter((macroCategory) => macroCategory.category.length > 0)
				.map((macroCategory) => {
					return {
						label: macroCategory.name,
						options: macroCategory.category
							.filter((category) => category.composition.length > 0)
							.map((category) => {
								return {
									label: category.name,
									value: category.id
								};
							})
					};
				});
			setCategories(categories);

			let allCategories: any = [];
			templateGroup.macroCategory.map((macroCategory) =>
				macroCategory.category.map((singleCategory) => {
					return allCategories.push({
						categoryID: singleCategory.id,
						composition: singleCategory.composition
					});
				})
			);
			setAllCategories(allCategories);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templateGroup, categories]);

	useEffect(() => {
		if (selectedCategory) updateTemplates(selectedCategory.value);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory]);

	return (
		<TemplateGroupContainer key={'container'} $isMobile={isMobile}>
			{allCategories && allCategories.length > 1 && (
				<Select
					placeholder={T._('Choose the category', 'Composer')}
					styles={{
						control: (base, state) =>
							({
								...base,
								border: state.isFocused ? 0 : 0,
								boxShadow: state.isFocused ? '0' : '0',
								'&:hover': {
									border: state.isFocused ? 0 : 0
								},
								cursor: 'pointer'
							} as CSSObjectWithLabel),
						container: (base) =>
							({
								...base,
								width: '100%',
								borderBottom: '2px solid #f5f6f7',
								cursor: 'pointer'
							} as CSSObjectWithLabel)
					}}
					components={{
						IndicatorSeparator: () => null
					}}
					isSearchable={false}
					options={categories}
					menuPosition='fixed'
					value={selectedCategory}
					onChange={async (category: any) => {
						await handleCategoryClick(category);
					}}
					inputValue={''}
				/>
			)}
			{templates && templates.length > 0 && (
				<TemplatesContainer $isMobile={isMobile}>
					{templates.map((template) => (
						<TemplateItem
							key={template.compositionID}
							onClick={() => handleTemplateClick(template.compositionID)}
							selected={template.compositionID === appliedTemplateID}
						>
							<img src={template.previewImageUrl} alt=''></img>
							<span>{template.name}</span>
						</TemplateItem>
					))}
				</TemplatesContainer>
			)}
			{isMobile && <CloseEditorButton onClick={onCloseClick}>{T._('OK', 'Composer')}</CloseEditorButton>}
		</TemplateGroupContainer>
	);
};

export default TemplateGroup;
