import React, { FC, useState, useEffect } from "react"
import styled from "styled-components";
import { Dialog, DialogWindow } from "./Dialogs"
import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { TailSpin } from 'react-loader-spinner';
import { T } from '../../Helpers';

const CustomWindow = styled(DialogWindow)`
    flex-basis: 350px;
`;

const CategoriesList = styled.ul`
    max-height:300px;
    padding: 0;
    margin: 0;
    overflow:auto;
    margin-top: 20px;
`;

const CategoryItem = styled.li`
    height: 70px;
    min-width:200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    cursor: pointer;
    margin-bottom: 10px;
    color: #313c46;
    &:hover{
        background-color: #313c46;
        color: white;
    }
`;

const ImagesList = styled.ul`
    max-height:300px;
    padding-left:0px;
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: 10px;
    overflow:auto;
`

const ImageItem = styled.li`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px #f4f4f4 solid;
    padding: 10px;
    cursor: pointer;

    &:hover {
        border: 1px black solid;
    }

    img {
        width: 100%;
        height: 80px;
        display: block;
        object-fit: contain;
        margin-bottom: 5px;
        background-color: #fff;
    }

    span {
        font-size: 12px;
    }
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const CenteredLoader = styled(TailSpin)`
    margin: auto;
    display: block;
    width: 48px;
    height: 48px;
`;

const BackTitle = styled.div`
    text-align: center;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;

    @media(hover) {
        &:hover {
            opacity: 0.8;
        }
    }
`;

interface ImageMacroCategory {
    macroCategoryID: number | null;
    name: string;
    hasImages: boolean;
    categories: ImageCategory[];
}

interface ImageCategory {
    categoryID: number | null;
    name: string;
    hasImages: boolean;
}

interface Image {
    imageID: number;
    name: string;
    choiceUrl: string;
    preferredWidth: number | null;
    preferredHeight: number | null;
}

const ImagesGalleryDialog: FC<{ onClose: () => void, onImageSelected: (image: any) => void }> = ({ onClose, onImageSelected, }) => {

    const { getMacroCategories, getImages } = useZakeke();
    const [isLoading, setIsloading] = useState(false);
    const [macroCategories, setMacroCategories] = useState<ImageMacroCategory[]>([]);
    const [selectedMacroCategory, setSelectedMacroCategory] = useState<ImageMacroCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ImageCategory | null>();
    const [images, setImages] = useState<Image[]>();

    useEffect(() => {
        updateCategories();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCategories = async () => {
        try {
            setIsloading(true);
            let macroCategories = await getMacroCategories();
            setIsloading(false);
            setMacroCategories(macroCategories);

            if (macroCategories.length === 1)
                handleMacroCategoryClick(macroCategories[0]);
        } catch (ex) {
            console.error(ex);
        }
    }

    const handleMacroCategoryClick = async (macroCategory: ImageMacroCategory) => {
        setSelectedMacroCategory(macroCategory);

        if (macroCategory.categories.length === 1)
            handleCategoryClick(macroCategory.categories[0]);
    }

    const handleCategoryClick = async (category: ImageCategory) => {
        try {
            setIsloading(true);
            setSelectedCategory(category);

            const images: Image[] = await getImages(category.categoryID!);
            setIsloading(false);
            setImages(images);
        } catch (ex) {
            console.error(ex);
        }
    }

    return <Dialog
        windowDecorator={CustomWindow}
        title={T._("Image gallery", "Composer")}>
        {isLoading && <LoaderContainer>
            <CenteredLoader
                color="#000000"
                height={48}
                width={48}
            />
        </LoaderContainer>}

        {!isLoading && <>
            {!selectedMacroCategory && <CategoriesList>{macroCategories.map(macroCategory => {
                return <CategoryItem
                    key={macroCategory.macroCategoryID!.toString()}
                    onClick={() => handleMacroCategoryClick(macroCategory)}>
                    {macroCategory.name}</CategoryItem>
            })}
            </CategoriesList>}

            {selectedMacroCategory && !selectedCategory && <>
                <BackTitle onClick={() => setSelectedMacroCategory(null)}>{T._("Return to macro categories", "Composer")}</BackTitle>

                <CategoriesList>
                    {selectedMacroCategory.categories.map(category => {
                        return <CategoryItem key={category.categoryID!.toString()} onClick={() => handleCategoryClick(category)}>{category.name}</CategoryItem>
                    })}
                </CategoriesList>
            </>}

            {selectedMacroCategory && selectedCategory && images && <>
                <BackTitle onClick={() => setSelectedCategory(null)}>{T._("Return to categories", "Composer")}</BackTitle>

                <ImagesList>
                    {images.map(image => {
                        return <ImageItem key={image.imageID!.toString()} onClick={() => onImageSelected(image)}>
                            <img src={image.choiceUrl} alt={image.name} />
                            <span>{image.name}</span>
                        </ImageItem>
                    })}
                </ImagesList>

            </>}
        </>}
    </Dialog>
}

export default ImagesGalleryDialog;
