import { FontFamily, useZakeke } from '@zakeke/zakeke-configurator-react';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { CSSObjectWithLabel, GroupBase, OptionProps, SingleValueProps, components } from 'react-select';
import styled from 'styled-components';
import { T, wrapperJoin } from '../../Helpers';
import { Button, Columns, Icon, TextArea } from '../Atomic';

import type { PropChangeHandler } from '../layout/Designer';

import { ReactComponent as CurveIcon } from '../../assets/icons/bezier-curve-solid.svg';
import { ReactComponent as BoldIcon } from '../../assets/icons/bold-solid.svg';
import { ReactComponent as ItalicSolid } from '../../assets/icons/italic-solid.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';
import AdvancedSelect from './AdvancedSelect';
import { FormControl } from './FormControl';
import ColorPicker from './colorpicker';

export interface EditTextItem {
	guid: string;
	name: string;
	text: string;
	fillColor: string;
	fontFamily: string;
	fontWeight: string;
	fontSize: number;
	isTextOnPath: boolean;
	constraints: { [key: string]: any } | null;
}

const defaultColorsPalette = ['#000000', '#FFFFFF'];

enum ItemType {
	Text = 0,
	Image = 1
}

export interface TextItem {
	type: ItemType;
	areaId: number;
	guid: string;
	name: string;
	text: string;
	strokeColor: string;
	strokeWidth: number;
	fillColor: string;
	fontFamily: string;
	fontSize: number;
	fontWeight: string;
	fontStyle: string | undefined;
	fontStretch: string;
	justification: string;
	isTextOnPath: boolean;
	constraints: {
		[key: string]: any;
	} | null;
}

const ItemTextContainer = styled.div``;

const TextToolsContainer = styled.div`
	display: flex;
	flex-direction: row;
	grid-gap: 10px;
	flex-wrap: wrap;
`;

const TextButtonsContainer = styled.div`
	width: 50%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 5px;
`;

const ColorPickerContainer = styled.div`
	margin-right: 5px;
	width: calc(50% - 30px);
`;

const ColorsContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding-bottom: 20px;
	border-bottom: 1px #ccc dotted;
`;

const SinglePaletteItem = styled.div<{ color: string; selected: boolean }>`
	width: 20px;
	height: 20px;
	background-color: ${(props) => props.color};
	border: 1px lightgray solid;
	cursor: pointer;

	${(props) => props.selected && `border: 1px black solid;`}

	&:hover {
		opacity: 0.6;
	}
`;

const TextColorsContainer = styled.div<{ $isDefaultPalette?: boolean }>`
	display: grid;
	${(props) =>
		!props.$isDefaultPalette &&
		`
    grid-template-columns: repeat(auto-fill,minmax(20px,1fr));
    grid-gap: 5px;`};
	/* grid-template-columns: repeat(auto-fill,minmax(20px,1fr)); */
	width: 100%;
`;

const FontCustomOption = styled.img`
	max-width: 100%;
	height: 24px;
	object-fit: contain;
`;

const FontCustomSingleValue = styled.img`
	max-width: 100%;
	height: 24px;
	object-fit: contain;
`;

const FontCustomSingleValueContainer = styled.div`
	display: flex;
	place-content: center;
	width: 100%;
	height: 100%;
`;

const FontOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.Option {...props}>
			{<FontCustomOption src={props.data.imageUrl} alt={props.data.name} />}
		</components.Option>
	);
};

const FontSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
	return (
		<components.SingleValue {...props}>
			<FontCustomSingleValueContainer>
				{<FontCustomSingleValue src={props.data.imageUrl} alt={props.data.name} />}
			</FontCustomSingleValueContainer>
		</components.SingleValue>
	);
};

const ItemText: FC<{
	item: EditTextItem;
	handleItemPropChange: PropChangeHandler;
	fonts?: FontFamily[];
	inDialog?: boolean;
	hideRemoveButton?: boolean;
}> = ({ item, handleItemPropChange, inDialog, hideRemoveButton }) => {
	const { removeItem, fonts, getPrintingMethodsRestrictions, getSanitationText } =
		useZakeke();

	const constraints = item.constraints;
	const canEdit = constraints?.canEdit ?? true;
	const hasCurvedText = item.isTextOnPath;
	const isUpperCase = constraints?.toUppercase ?? false;

	let currentFont = fonts?.find((x) => x.name === item.fontFamily);

	const textRestrictions = getPrintingMethodsRestrictions();
	// Used for performance cache
	const [fillColor, setFillColor] = useState(item.fillColor);

	const [fontLoading, setFontLoading] = useState(false);
	const [dirtyCharInserted, setDirtyCharInserted] = useState([] as string[]);

	const weightData = typeof item.fontWeight === 'number' ? ['normal', 'normal'] : item.fontWeight.split(' ');
	const isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
	const isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;

	const setItemTextDebounced = (value: string) => {
		handleItemPropChange?.(item, 'text', isUpperCase ? value.toUpperCase() : value);
		debounce(() => {
			const initialText = value;
			const sanitizationInfo = currentFont
				? getSanitationText(currentFont, value)
				: {
						sanitizedText: value,
						dirtyChars: []
				  };
			setDirtyCharInserted(sanitizationInfo.dirtyChars);
			const text = sanitizationInfo.sanitizedText;

			if (text !== initialText) {
				handleItemPropChange?.(item, 'text', isUpperCase ? text.toUpperCase() : text);
			}
		}, 500)();
	};

	const handleFontChange = (font: string) => {
		handleItemPropChange(item, 'font-family', font);
		currentFont = fonts?.find((x) => x.name === font);
		setItemTextDebounced(item.text);
	};

	useEffect(() => {
		handleFontChange(item.fontFamily);
		//eslint-disable-next-line
	}, []);

	if (item)
		return (
			<ItemTextContainer>
				<FormControl
					label={item.name || T._('Text', 'Composer')}
					rightComponent={
						!hideRemoveButton &&
						item.constraints!.canDelete && (
							<Icon onClick={() => removeItem(item.guid)}>
								<CloseIcon />
							</Icon>
						)
					}
				>
					<TextArea
						value={isUpperCase ? item.text.toUpperCase() : item.text}
						onChange={(e) => {
							e.currentTarget.value = e.currentTarget.value.replace('⠀', '');
							setItemTextDebounced(e.currentTarget.value);
						}}
						maxLength={!item.constraints ? null : item.constraints.maxNrChars || null}
						disabled={!canEdit || fontLoading}
					/>
					{dirtyCharInserted.length > 0 && currentFont && (
						<div style={{ color: 'red' }}>
							{T._(
								`The following characters have been removed as they are not supported by the font ${
									currentFont.name
								}: ${wrapperJoin(dirtyCharInserted, ',', '"', '"')}`,
								'Composer'
							)}{' '}
						</div>
					)}
				</FormControl>

				<TextToolsContainer>
					{(!constraints || constraints.canChangeFontFamily) && (
						<FormControl label={T._('Font', 'Composer')}>
							<AdvancedSelect
								components={{
									Option: FontOption,
									SingleValue: FontSingleValue
								}}
								styles={{
									container: (base) =>
										({
											...base,
											width: 200
										} as CSSObjectWithLabel)
								}}
								isSearchable={false}
								options={fonts}
								isDisabled={fontLoading}
								menuPosition='fixed'
								value={[fonts!.find((x) => x.name === item.fontFamily)]}
								onChange={(font: any) => {
									item.fontFamily = font.name;
									setFontLoading(true);
									handleFontChange(font.name);
									setTimeout(() => {
										setFontLoading(false);
									}, 2000);
								}}
							/>
						</FormControl>
					)}
					{(textRestrictions.allowedBold ||
						textRestrictions.allowedItalic ||
						textRestrictions.allowedCurved) && (
						<TextButtonsContainer>
							{(!constraints || constraints.canChangeFontWeight) &&
								(textRestrictions.allowedBold || textRestrictions.allowedItalic) && (
									<FormControl label={T._('Style', 'Composer')}>
										<Columns
											columns={
												textRestrictions.allowedBold && textRestrictions.allowedItalic ? 2 : 1
											}
										>
											{textRestrictions.allowedBold && (
												<Button
													outline
													selected={isBold}
													onClick={() => handleItemPropChange(item, 'font-bold', !isBold)}
												>
													<Icon>
														<BoldIcon />
													</Icon>
												</Button>
											)}
											{textRestrictions.allowedItalic && (
												<Button
													outline
													selected={isItalic}
													onClick={() => handleItemPropChange(item, 'font-italic', !isItalic)}
												>
													<Icon>
														<ItalicSolid />
													</Icon>
												</Button>
											)}
										</Columns>
									</FormControl>
								)}
							{(!constraints || constraints.canChangeTextPathMode) && textRestrictions.allowedCurved && (
								<FormControl label={T._('Curved', 'Composer')}>
									<Button
										outline
										selected={hasCurvedText}
										onClick={() => handleItemPropChange(item, 'text-path', !hasCurvedText)}
									>
										<Icon>
											<CurveIcon />
										</Icon>
									</Button>
								</FormControl>
							)}
						</TextButtonsContainer>
					)}
				</TextToolsContainer>

				{(!textRestrictions.disableTextColors || !(textRestrictions.disableTextColors && textRestrictions.textColors.length === 1)) &&
					!!item.constraints?.canChangeFontColor && (
						<FormControl label={T._('Color', 'Composer')}>
							<ColorsContainer>
								{!textRestrictions.disableTextColors && (
									<ColorPickerContainer>
										<ColorPicker
											color={fillColor}
											onChange={(color) => {
												// handleFillColorChange(color);
												handleItemPropChange(item, 'font-color', color);
												setFillColor(color);
											}}
										/>
									</ColorPickerContainer>
								)}

								{!textRestrictions.disableTextColors && (
									<TextColorsContainer $isDefaultPalette>
										{defaultColorsPalette.map((hex) => (
											<SinglePaletteItem
												key={hex}
												onClick={() => {
													handleItemPropChange(item, 'font-color', hex);
													setFillColor(hex);
												}}
												selected={hex === fillColor}
												color={hex}
											/>
										))}
									</TextColorsContainer>
								)}

								{textRestrictions.disableTextColors && (
									<TextColorsContainer>
										{textRestrictions.textColors.map((textColor) => (
											<SinglePaletteItem
												key={textColor.colorCode}
												onClick={() => {
													handleItemPropChange(item, 'font-color', textColor.colorCode);
													setFillColor(textColor.colorCode);
												}}
												selected={textColor.colorCode === fillColor}
												color={textColor.colorCode}
											/>
										))}
									</TextColorsContainer>
								)}
							</ColorsContainer>
						</FormControl>
					)}
			</ItemTextContainer>
		);
	else return null;
};

export default ItemText;
