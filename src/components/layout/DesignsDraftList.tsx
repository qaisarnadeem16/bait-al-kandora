import { FC, useEffect, useState } from 'react';
import useStore from 'Store';
import styled from 'styled-components';
import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';
import { T } from '../../Helpers';
import { CloseEditorButton, Icon } from '../Atomic';

interface ThemeCompositions {
	name: string;
	docID: string;
	previewImageUrl: string;
	tags: string[];
}

const DesignsDraftContainer = styled.div<{ $isMobile?: boolean }>`
	overflow: auto;
	width: 100%;
	display: block;
	height: 100%;
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

const H3 = styled.h3`
	margin-bottom: 30px;
	color: #313c46;
`;

const DesignsDraftTagsList = styled.ul<{ $isMobile?: boolean }>`
	margin: 10px 0px;
	list-style: none;
	overflow: hidden;
	padding-left: 0px;
	${(props) =>
		props.$isMobile &&
		`
        margin: 10px 5px;
        display:flex;
        justify-content: center;
        
        ::-webkit-scrollbar {
            display: none;
        }
    `}
`;

const TagItem = styled.li<{ selected?: boolean }>`
	float: left;
	margin: 0px 10px 20px 0px;
	padding: 5px 10px;
	border: 2px solid #eee;
	cursor: pointer;
	font-size: 14px;
	${(props) =>
		props.selected &&
		`
        border: 2px solid #313c46;
    `};
`;

const DesignsDraft = styled.div<{ $isMobile?: boolean }>`
	padding: 0px;
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

const DesignDraftItem = styled.div<{ isMobile?: boolean }>`
	display: flex;
	position: relative;
	border: 1px solid transparent;
	background-color: #eceff1;
	padding: 0 20px;
	img {
		width: 100%;
	}
	&:hover {
		border: 1px solid #161b1f;
	}
`;

const RemoveIconContainer = styled(Icon)`
	position: absolute;
	cursor: pointer;
	right: 5px;
	top: 5px;
	opacity: 0.8;
	font-size: 15px;
	padding: 5px;
	background-color: white;
	height: 25px;
	border-radius: 100%;
	&:hover {
		opacity: 1;
	}
`;

const DesignsDraftList: FC<{ onCloseClick?: () => void }> = ({ onCloseClick }) => {
	const { draftCompositions, loadSavedComposition, deleteSavedComposition, groups } = useZakeke();

	const { setSelectedGroupId, isMobile, tagsOfSavedDesigns, setTagsOfSavedDesigns } = useStore();
	const [tagsChosen, setTagsChosen] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>(tagsOfSavedDesigns ?? []);
	const [compositionsChosen, setCompositionsChosen] = useState<ThemeCompositions[]>();

	useEffect(() => {
		let tempTags: string[] = [];

		if (draftCompositions && draftCompositions.length > 0) {
			draftCompositions.forEach((composition) => {
				if (composition.tags) {
					const actualTags = composition.tags;
					tempTags.push(...actualTags);
				}
			});
		}

		let filteredTags = Array.from(new Set(tempTags));
		setTags(filteredTags);
		setTagsOfSavedDesigns(filteredTags);
        console.log("useeffect tagssaveddesign", tagsOfSavedDesigns);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draftCompositions]);

	const loadComposition = async (docId: string) => {
		await loadSavedComposition(docId);
		if (isMobile) setSelectedGroupId(null);
	};

	const deleteComposition = async (docID: string) => {
		await deleteSavedComposition(docID);
		if (draftCompositions && draftCompositions.length === 1) setSelectedGroupId(groups[0].id);

	};

	const handleTagSelection = (tag: string) => {
		let tags = tagsChosen;
		if (tags.indexOf(tag) !== -1) tags = tagsChosen.filter((x) => x !== tag);
		else tags.push(tag);
		setTagsChosen(tags);
		let compositions = draftCompositions!.filter((x) => x.tags?.some((y) => tags.indexOf(y) !== -1));
		setCompositionsChosen(compositions);
	};

	return (
		<DesignsDraftContainer $isMobile={isMobile}>
			<H3>{T._('Saved configurations', 'Composer')}</H3>
			{draftCompositions && draftCompositions.length === 0 && (
				<span>{T._('You currently have no saved configurations.', 'Composer')}</span>
			)}
			{draftCompositions && draftCompositions.length > 0 && (
				<>
					{tags && tags.length > 0 && (
						<DesignsDraftTagsList $isMobile={isMobile}>
							{tags.map((tag) => {
								return (
									<TagItem selected={tagsChosen.indexOf(tag) !== -1} key={tag}>
										<span onClick={() => handleTagSelection(tag)}>{tag}</span>
									</TagItem>
								);
							})}
						</DesignsDraftTagsList>
					)}
					{draftCompositions && (
						<DesignsDraft $isMobile={isMobile}>
							{(tagsChosen && tagsChosen.length === 0 ? draftCompositions! : compositionsChosen!).map(
								(savedComposition) => {
									return (
										<DesignDraftItem
											key={savedComposition.docID}
											isMobile={isMobile}
											onClick={() => loadComposition(savedComposition.docID)}
										>
											<img src={savedComposition.previewImageUrl} alt=''></img>
											<RemoveIconContainer
												onClick={() => deleteComposition(savedComposition.docID)}
											>
												<CloseIcon />
											</RemoveIconContainer>
										</DesignDraftItem>
									);
								}
							)}
						</DesignsDraft>
					)}
					{isMobile && <CloseEditorButton onClick={onCloseClick}>{T._('OK', 'Composer')}</CloseEditorButton>}
				</>
			)}
		</DesignsDraftContainer>
	);
};

export default DesignsDraftList;
