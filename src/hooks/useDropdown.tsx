import React, { FC, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

// Styled component for the dropdown container
const DropdownContainer = styled.div<{ x: number; y: number; visible: boolean }>`
	position: fixed;
	left: ${(props) => props.x}px;
	top: ${(props) => props.y}px;
	height: auto;
	background: white;
	border: 1px #ddd solid;
	border-radius: 5px;
	box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
	z-index: 3;
	visibility: hidden;

	${(props) =>
		props.visible &&
		`
        visibility: visible;
    `}
`;

// Dropdown component that positions itself relative to a button element
const Dropdown: FC<{ buttonRef: HTMLElement; anchor: Anchor; alignment: Alignment; children?: React.ReactNode }> = ({
	buttonRef: el,
	anchor,
	alignment,
	children
}) => {
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	// Function to calculate the position of the dropdown based on the anchor and alignment
	const getPosition = (anchor: Anchor, alignment: Alignment) => {
		if (!dropdownRef.current) return [0, 0];

		const dropdownWidth = dropdownRef.current.getBoundingClientRect().width;
		const dropdownHeight = dropdownRef.current.getBoundingClientRect().height;

		let buttonX = el.getBoundingClientRect().x;
		let buttonY = el.getBoundingClientRect().y;
		let buttonWidth = el.getBoundingClientRect().width;
		let buttonHeight = el.getBoundingClientRect().height;

		let dropdownPositionX = buttonX;
		let dropdownPositionY = buttonY;

		switch (anchor) {
			case 'top':
				dropdownPositionY = buttonY - dropdownHeight;

				if (alignment === 'right') {
					dropdownPositionX = buttonX + buttonWidth - dropdownWidth;
				}
				break;
			case 'bottom':
				dropdownPositionY = buttonY + buttonHeight;

				if (alignment === 'right') {
					dropdownPositionX = buttonX + buttonWidth - dropdownWidth;
				}
				break;
			case 'left':
				dropdownPositionX = buttonX - dropdownWidth;

				if (alignment === 'bottom') {
					dropdownPositionY = buttonY + buttonHeight - dropdownHeight;
				}
				break;
			case 'right':
				dropdownPositionX = buttonX + buttonWidth;

				if (alignment === 'bottom') {
					dropdownPositionY = buttonY + buttonHeight - dropdownHeight;
				}
				break;
		}

		return [dropdownPositionX, dropdownPositionY];
	};

	// UseLayoutEffect to calculate the position of the dropdown when the component mounts or updates
	useLayoutEffect(() => {
		if (!dropdownRef.current) return;

		const dropdownWidth = dropdownRef.current.getBoundingClientRect().width;
		const dropdownHeight = dropdownRef.current.getBoundingClientRect().height;

		let currentAnchor = anchor;
		let currentAlignment = alignment;

		let [dropdownPositionX, dropdownPositionY] = getPosition(currentAnchor, currentAlignment);

		// Adjust the position if the dropdown exceeds the window boundaries
		if (dropdownPositionX + dropdownWidth > window.innerWidth) {
			if (currentAnchor === 'right') {
				[dropdownPositionX, dropdownPositionY] = getPosition('left', currentAlignment);
				currentAnchor = 'left';
			} else {
				[dropdownPositionX, dropdownPositionY] = getPosition(currentAnchor, 'right');
				currentAlignment = 'right';
			}
		}

		if (dropdownPositionX < 0) {
			if (currentAnchor === 'left') {
				[dropdownPositionX, dropdownPositionY] = getPosition('right', currentAlignment);
				currentAnchor = 'right';
			} else {
				[dropdownPositionX, dropdownPositionY] = getPosition(currentAnchor, 'left');
				currentAlignment = 'left';
			}
		}

		if (dropdownPositionY + dropdownHeight > window.innerHeight) {
			if (currentAnchor === 'bottom') {
				[dropdownPositionX, dropdownPositionY] = getPosition('top', currentAlignment);
				currentAnchor = 'right';
			} else {
				[dropdownPositionX, dropdownPositionY] = getPosition(currentAnchor, 'bottom');
				currentAlignment = 'bottom';
			}
		}

		if (dropdownPositionY + dropdownHeight > window.innerHeight) {
			if (currentAnchor === 'bottom') {
				[dropdownPositionX, dropdownPositionY] = getPosition('top', currentAlignment);
				currentAnchor = 'right';
			} else {
				[dropdownPositionX, dropdownPositionY] = getPosition(currentAnchor, 'bottom');
				currentAlignment = 'bottom';
			}
		}

		setX(dropdownPositionX);
		setY(dropdownPositionY);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [el, anchor, alignment, dropdownRef.current]);

	return (
		<DropdownContainer
			onClick={(e) => e.nativeEvent.stopPropagation()}
			ref={dropdownRef}
			x={x}
			y={y}
			visible={dropdownRef.current !== null}
		>
			{children}
		</DropdownContainer>
	);
};

// Anchor type for the dropdown position
type Anchor = 'left' | 'top' | 'bottom' | 'right';

// Alignment type for the dropdown position
type Alignment = 'left' | 'top' | 'bottom' | 'right';

// Custom hook for managing dropdown state and behavior
type UseDropdownCommands = [
	(el: HTMLElement, anchor?: Anchor, alignment?: Alignment, isTooltip?: boolean) => void,
	() => void,
	boolean,
	React.FC<{ children?: React.ReactNode }>
];


const useDropdown = (): UseDropdownCommands => {
	const [isOpened, setIsOpened] = useState(false);
	const [anchor, setAnchor] = useState<Anchor>('bottom');
	const [alignment, setAlignment] = useState<Alignment>('left');

	const elementRef = useRef<HTMLElement | null>(null);

	// Close the dropdown when clicking outside of it
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			// If clicked element contains elementRef.current, do nothing
			if (elementRef.current && elementRef.current.contains(e.target as HTMLElement)) return;

			setIsOpened(false);
		};

		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Memoized custom dropdown component
	const CustomDropdown: FC<{ children?: React.ReactNode }> = memo(({ children }) => {
		return (
			elementRef.current && (
				<Dropdown buttonRef={elementRef.current} anchor={anchor} alignment={alignment}>
					{children}
				</Dropdown>
			)
		);
	});

	// Open the dropdown with the specified anchor, alignment, and tooltip mode
	const open = (el: HTMLElement, anchor: Anchor = 'bottom', alignment: Alignment = 'left', isTooltip?: boolean) => {
		if (isTooltip) setIsOpened(!isOpened);
		else setIsOpened(true);
		setAlignment(alignment);
		setAnchor(anchor);
		elementRef.current = el;
	};

	// Close the dropdown
	const close = () => {
		setIsOpened(false);
	};

	// Return the result as a memoized array
	const result = useMemo<UseDropdownCommands>(
		() => [open, close, isOpened, CustomDropdown],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[anchor, alignment, isOpened]
	);

	return result;
};

export default useDropdown;
