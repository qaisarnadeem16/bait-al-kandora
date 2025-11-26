import { FC, useState } from 'react';
import { Dialog } from './Dialogs';
import ItemText from '../widgets/ItemText';
import { TextItem, useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from '../../Helpers';

import type { PropChangeHandler } from '../layout/Designer';

interface EditTextItem {
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

const AddTextDialog: FC<{ onClose: () => void; onConfirm: (item: EditTextItem) => void }> = ({
	onClose,
	onConfirm
}) => {
	const { fonts, getPrintingMethodsRestrictions } = useZakeke();

	const textRestrictions = getPrintingMethodsRestrictions();
	const [item, setItem] = useState<EditTextItem>({
		guid: '',
		name: '',
		text: T._('Text', 'Composer'),
		fillColor: textRestrictions.defaultColor,
		fontFamily: fonts[0].name,
		fontSize: 48,
		fontWeight: 'normal normal',
		isTextOnPath: false,
		constraints: null
	});

	const handleItemPropChange: PropChangeHandler = (item, prop, value) => {
		let weightData: string[] = [];

		let newItem = { ...item } as EditTextItem;

		switch (prop) {
			case 'text':
				newItem.text = value as string;
				break;
			case 'font-italic':
				weightData = newItem.fontWeight.split(' ');
				let isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
				newItem.fontWeight = (value ? 'italic' : 'normal') + ' ' + (isBold ? 'bold' : 'normal');
				break;
			case 'font-bold':
				weightData = newItem.fontWeight.split(' ');
				let isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;
				newItem.fontWeight = (isItalic ? 'italic' : 'normal') + ' ' + (value ? 'bold' : 'normal');
				break;
			case 'font-color':
				newItem.fillColor = value as string;
				break;
			case 'font-family':
				newItem.fontFamily = value as string;
				break;
			case 'text-path':
				newItem.isTextOnPath = value as boolean;
				break;
		}

		setItem(newItem);
	};

	return (
		<Dialog
			title={T._('Add text', 'Composer')}
			buttons={[{ label: T._('Confirm', 'Composer'), onClick: () => onConfirm(item) }]}
		>
			<ItemText
				key={item.guid}
				item={item as TextItem}
				handleItemPropChange={handleItemPropChange}
				hideRemoveButton={true}
			/>
		</Dialog>
	);
};

export default AddTextDialog;
