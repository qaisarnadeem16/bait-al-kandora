import { FC } from 'react';
import styled from 'styled-components';
import { Dialog } from './Dialogs';
import { T } from 'Helpers';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const ErrorDialog: FC<{ error: string; onCloseClick: () => void }> = ({ error, onCloseClick }) => {
	return (
		<Dialog alignButtons='center' buttons={[{ label: T._('Close', 'Composer'), onClick: onCloseClick }]}>
			<Container>
				<span>{error}</span>
			</Container>
		</Dialog>
	);
};

export default ErrorDialog;
