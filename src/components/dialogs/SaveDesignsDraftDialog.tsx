import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, DialogWindow } from './Dialogs';
import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { TailSpin } from 'react-loader-spinner';
import { T } from '../../Helpers';
import { CSSObjectWithLabel } from 'react-select';
import Creatable from 'react-select/creatable';
import useStore from 'Store';

const CustomWindow = styled(DialogWindow)`
	flex-basis: 450px;
`;

const CenteredLoader = styled(TailSpin)`
	margin: auto;
	display: block;
	width: 48px;
	height: 48px;
`;

const PreviewImg = styled.img`
	max-height: 165px;
	max-width: 100%;
	margin: 18px auto 10px auto !important;
	background-color: #f2f2f2;
`;

const SaveDialogContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	text-align: left;
	grid-gap: 8px;
`;

const Label = styled.span`
	width: 100%;
`;

const NameInput = styled.input`
	width: 100%;
	height: 40px;
	margin-bottom: 15px;
	border: 1px solid lightgray;
`;

const SaveDesignsDraftDialog: FC<{ onCloseClick: () => void }> = ({ onCloseClick }) => {
	const { getOnlineScreenshot, saveDraftsComposition, currentCompositionInfo } = useZakeke();
	const { setIsLoading, isLoading, tagsOfSavedDesigns, setTagsOfSavedDesigns } = useStore();
	const [url, setUrl] = useState('');
	const [name, setName] = useState('');

	const [tags, setTags] = useState<{ label: string; value: string }[]>(
		currentCompositionInfo?.compositionTags?.map((tag) => ({ value: tag, label: tag })) ?? []
	);

	console.log(tags);

	useEffect(() => {
		getOnlineScreenshot(1024, 1024, false, '#FFFFFF').then(async ({ rewrittenUrl }) => {
			setUrl(rewrittenUrl);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (currentCompositionInfo) {
			console.log('currentCompositionInfo', currentCompositionInfo);
			setName(currentCompositionInfo.compositionName ?? '');

			if (currentCompositionInfo.compositionTags && currentCompositionInfo.compositionTags.length > 0) {
				let currentTags: { label: string; value: string }[] = [];

				currentCompositionInfo.compositionTags.forEach((tag) => {
					if (tag) currentTags.push({ value: tag, label: tag });
				});

				if (currentTags.length > 0) {
					setTags((prevTags) =>
						Array.from(new Map([...prevTags, ...currentTags].map((tag) => [tag.value, tag])).values())
					);
				}
			}
		}
	}, [currentCompositionInfo]);

	const handleSave = async (isCopy?: boolean) => {
		onCloseClick();
		setIsLoading(true);
		let tagsToSave: string[] = [];

		if (tags) {
			tagsToSave = Array.from(new Set(tags.map((tag) => tag.value)));
		}
		console.log('tagsToSave', tagsToSave);
		await saveDraftsComposition(name, tagsToSave, isCopy);
		setTagsOfSavedDesigns(Array.from(new Set([...tagsOfSavedDesigns, ...tagsToSave])));

		setIsLoading(false);
	};

	// Creatable components

	// const selectOptions = useCallback(() => {
	// 	return Array.from(new Map(tags.map((tag) => [tag.value, tag])).values());
	// }, [tags]);

	const formatCreateLabel = (inputValue: any) => `Create new... ${inputValue}`;

	const handleChange = (tagsOptions: { label: string; value: string }[]) => {
		setTags(tagsOptions);
	};

	// Filtra i tag disponibili escludendo quelli già selezionati
	const availableTags = tagsOfSavedDesigns
		.filter((tag) => !tags.some((t) => t.value === tag))
		.map((tag) => ({ label: tag, value: tag }));

	return (
		<Dialog
			marginButtons={5}
			windowDecorator={CustomWindow}
			buttons={[
				{ label: T._('Save', 'Composer'), onClick: () => handleSave(), isSaveButton: true },
				{ label: T._('Save as Copy', 'Composer'), onClick: () => handleSave(true), isSaveButton: true }
			]}
		>
			{isLoading && <CenteredLoader color='#000000' height={48} width={48} />}
			<SaveDialogContainer>
				{!isLoading && (
					<>
						{url === '' && <CenteredLoader color='#000000' height={48} width={48} />}
						{url !== '' && <PreviewImg src={url} />}
						<Label>{T._('Name', 'Composer') + ' *'}</Label>
						<NameInput defaultValue={name} onChange={(e: any) => setName(e.currentTarget.value)} />
						<Label>{T._('Tags', 'Composer')}</Label>
						<Creatable
							id='tags-input'
							isMulti
							value={tags}
							styles={{
								container: (base) =>
									({
										...base,
										height: 'fit-content',
										width: '100%'
									} as CSSObjectWithLabel),
								control: (base) =>
									({
										...base,
										height: 'fit-content',
										width: '100%',
										borderRadius: '0px'
									} as CSSObjectWithLabel)
							}}
							menuPosition='fixed'
							placeholder={T._('Insert tags', 'Composer')}
							noOptionsMessage={() => T._('No tags found', 'Composer')}
							options={availableTags}	
							onChange={(e: any) => handleChange(e)}
							formatCreateLabel={formatCreateLabel}
							components={{
								DropdownIndicator: () => null,
								IndicatorSeparator: () => null
							}}
						/>
					</>
				)}
			</SaveDialogContainer>
		</Dialog>
	);
};

export default SaveDesignsDraftDialog;
