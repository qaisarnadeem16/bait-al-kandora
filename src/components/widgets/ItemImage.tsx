import { FC } from "react";
import styled from "styled-components";
import { TemplateArea, useZakeke } from '@zakeke/zakeke-configurator-react';
import { Button, Icon } from '../Atomic';
import { T } from '../../Helpers';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg'
import { FormControl } from "./FormControl";

export interface EditImageItem {
    guid: string,
    name: string,
    imageID: number,
    url: string,
    constraints: { [key: string]: any } | null
}

declare enum ItemType {
    Text = 0,
    Image = 1
}
export interface Item {
    type: ItemType;
    guid: string;
    name: string;
    areaId: number;
    constraints: ({
        [key: string]: any;
    }) | null;
}

interface ImageItem {
    type: ItemType;
    imageID: number;
    areaId: number;
    guid: string;
    name: string;
    url: string;
    deleted: boolean;
    constraints: ({
        [key: string]: any;
    }) | null;
}

const ImageAndButtonsContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 20px;
    input{
    display:none;
  }
`;

const ImagePreview = styled.div`
    border: 1px #f4f4f4 solid;
    padding: 4px;
    height: 130px;    
    background: #f2f2f2;
    img{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const ButtonsContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding:20px 0px;
    
`;

const ItemImage: FC<{ item: ImageItem, handleItemPropChange: any, currentTemplateArea: TemplateArea, uploadImgDisabled: boolean }> = ({ item, handleItemPropChange, currentTemplateArea, uploadImgDisabled }) => {
    const { removeItem } = useZakeke();

    let inputHtml!: HTMLInputElement;

    const handleChangeClick = () => inputHtml.click();

    const handleGalleryClick = () => handleItemPropChange(item, 'image-gallery');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            handleItemPropChange(item, 'image-upload', e.currentTarget.files![0])
        }
        inputHtml.value = "";
    }

    const constraints = item.constraints;
    const canEdit = constraints ? constraints.canEdit : true;

    const showUploadButton = ((!currentTemplateArea || currentTemplateArea.uploadRestrictions.isUserImageAllowed) && canEdit);
    const showGalleryButton = (!currentTemplateArea || !currentTemplateArea.disableSellerImages) && canEdit;    

    return <FormControl
        label={item.name || T._("Image", "Composer")}
        rightComponent={constraints!.canDelete && <Icon onClick={() => removeItem(item.guid)}><CloseIcon /></Icon>}>
        <ImageAndButtonsContainer>
            <ImagePreview><img src={item.url} alt="" /></ImagePreview>
            <ButtonsContainer>
                {showUploadButton && <Button disabled={uploadImgDisabled} isFullWidth onClick={handleChangeClick}>{T._("Upload", "Composer")}</Button>}
                {showGalleryButton && <Button isFullWidth onClick={handleGalleryClick}>{T._("Gallery", "Composer")}</Button>}
            </ButtonsContainer>
            <input type="file" ref={input => inputHtml = input!} onChange={handleInputChange} />
        </ImageAndButtonsContainer>
    </FormControl>
}

export default ItemImage;