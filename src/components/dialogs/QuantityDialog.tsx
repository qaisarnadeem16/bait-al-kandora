import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogFooterButton, DialogWindow } from './Dialogs';
import { T } from 'Helpers';
import { useZakeke, ProductQuantityRule } from '@zakeke/zakeke-configurator-react';
import { QuantityContainer } from 'components/layout/SharedComponents';
import NumericInput from 'components/layout/NumericInput';

const QuantityDialogWindow = styled(DialogWindow)`
	max-width: unset;
	display: flex;
	flex-direction: column;
`;

const QuantityDialog: FC<{ quantityRule: ProductQuantityRule; onClick: () => void }> = ({ quantityRule, onClick }) => {
	const { isSceneLoading, setQuantity, quantity } = useZakeke();
	const [quantityValue, setQuantityValue] = useState(
		quantityRule && quantityRule?.minQuantity ? quantityRule.minQuantity : quantity
	);

	useEffect(() => {
		const delayInputTimeoutId = setTimeout(() => {
			if (!isSceneLoading) {
				if (quantityRule && quantityRule?.minQuantity && quantityValue < quantityRule?.minQuantity) {
					setQuantityValue(quantityRule.minQuantity);
				} else if (quantityRule && quantityRule?.maxQuantity && quantityValue > quantityRule?.maxQuantity) {
					setQuantityValue(quantityRule.maxQuantity);
				} else setQuantityValue(quantityValue);
			}
		}, 600);
		return () => clearTimeout(delayInputTimeoutId);
	}, [quantityValue, isSceneLoading, quantityRule]);

	return (
		<Dialog windowDecorator={QuantityDialogWindow} alignButtons={'center'}>
			<QuantityContainer>
				<label>{T._d('Quantity')}</label>
				<NumericInput
					value={quantityValue}
					readOnly={quantityRule && (quantityRule.step === null || quantityRule.step === 0) ? false : true}
					onChange={(e: any) => {
						if (e.currentTarget.value === '') setQuantityValue(quantityRule?.minQuantity ?? 1);
						else setQuantityValue(parseInt(e.currentTarget.value));
					}}
					min={
						quantityRule.minQuantity != null
							? Math.max(quantityRule.step || 1, quantityRule.minQuantity)
							: quantityRule.step || 1
					}
					max={quantityRule.maxQuantity != null ? quantityRule.maxQuantity : undefined}
					step={quantityRule.step != null ? quantityRule.step : 1}
				/>
			</QuantityContainer>
			<DialogFooterButton
				primary
				isFullWidth
				onClick={() => {
					if (quantityRule) setQuantity(quantityValue);
					onClick();
				}}
			>
				{T._('Add to cart', 'Composer')}
			</DialogFooterButton>
		</Dialog>
	);
};

export default QuantityDialog;
