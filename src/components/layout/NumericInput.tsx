import { FC } from 'react';
import styled from 'styled-components';
import { Icon } from 'components/Atomic';
import { ReactComponent as UpArrow } from '../../assets/icons/arrow-top-simple.svg';
import { ReactComponent as DownArrow } from '../../assets/icons/arrow-bottom-simple.svg';

// Styled component for the container of the numeric input
const NumberInput = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-left: 5px;
	border: 1px solid #f4f4f4;
	input {
		width: 50px;
		border: 1px solid transparent;
	}
	padding: 5px 10px 5px 10px;
`;

// Styled component for the container of the up and down arrows
const NumberInputArrows = styled.div`
	display: flex;
	flex-direction: column;
	div {
		width: 15px;
		height: 15px;
		color: gray;
	}
`;

// Styled component for the input element
const Input = styled.input``;

// NumericInput component that represents a numeric input field with up and down arrows
export const NumericInput: FC<{
	value?: number;
	readOnly: boolean;
	onChange: (e: any) => void;
	min: number;
	max: number | undefined;
	step: number | undefined;
}> = ({ value, readOnly, onChange, min, max, step }) => {
	let ref: HTMLInputElement | null;

	// Event handler for the up arrow click
	let handleUpClick = () => {
		if (!ref) return;

		let oldValue = parseFloat(ref.value || ref.min || '0');

		let step = parseFloat(ref.step || '1');
		ref.value = (oldValue + step).toString();

		if (ref.max && parseFloat(ref.value) > parseFloat(ref.max)) ref.value = ref.max;

		const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
		const event = new Event('input', { bubbles: true });

		setValue.call(ref, ref.value);
		ref.dispatchEvent(event);
	};

	// Event handler for the down arrow click
	let handleDownClick = () => {
		if (!ref) return;

		let oldValue = parseFloat(ref.value || ref.min || '0');

		let step = parseFloat(ref.step || '1');
		ref.value = (oldValue - step).toString();

		if (ref.min && parseFloat(ref.value) < parseFloat(ref.min)) ref.value = ref.min;

		var nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
		nativeInputValueSetter.call(ref, ref.value);

		var ev = new Event('input', { bubbles: true });
		ref.dispatchEvent(ev);
	};
	return (
		<NumberInput>
			<Input
				value={value}
				readOnly={readOnly}
				onInput={onChange}
				min={min}
				max={max}
				step={step}
				ref={(input) => (ref = input ? input : null)}
			/>
			<NumberInputArrows>
				<Icon hoverable onClick={handleUpClick}>
					<UpArrow />
				</Icon>
				<Icon hoverable onClick={handleDownClick}>
					<DownArrow />
				</Icon>
			</NumberInputArrows>
		</NumberInput>
	);
};

export default NumericInput;
