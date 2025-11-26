import Select, { CSSObjectWithLabel, GroupBase, Props, StylesConfig } from 'react-select';
import React from 'react';

interface ExtendedProps<T> {
	onOptionFocus?: (e: T) => void;
}

function styles<
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>
>(): StylesConfig<Option, IsMulti, Group> {
	return {
		container: (base) =>
			({
				...base,
				minWidth: 200,
				display: 'flex',
				maxHeight: 'fit-content'
			} as CSSObjectWithLabel),

		option: (base) =>
			({
				...base,
				backgroundColor: 'white',
				color: 'black',
				'&:hover': {
					backgroundColor: '#ddd'
				}
			} as CSSObjectWithLabel),
		valueContainer: (provided) => {
			return {
				...provided
			};
		}
	};
}

const AdvancedSelect = <Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
	props: Props<Option, IsMulti, Group> & ExtendedProps<Option>
) => {
	return <Select {...props} styles={{ ...styles<Option, IsMulti, Group>(), ...props.styles }} />;
};

export default AdvancedSelect;
