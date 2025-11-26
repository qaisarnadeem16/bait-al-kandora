import { FC } from 'react';
import { Icon } from '../Atomic';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';
import styled from 'styled-components';
import { MOBILE_BREAKPOINT } from '../../Store';

export interface Notification {
	id: number;
	closable: boolean;
	title: string;
	message: string;
	type: number;
}

interface NotificationsProps {
	notifications: Notification[];
	onRemoveNotificationClick: (notification: Notification) => void;
}

const NotificationsContainer = styled.div`
	z-index: 4;
	position: absolute;
	left: 0;
	bottom: 0;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	width: 100%;
`;

const NotificationItem = styled.div`
	background: white;
	border: 1px red solid;
	padding: 10px;
	width: 100%;
	max-width: 450px;
	font-size: 12px;
	position: relative;
	color: red;

	${Icon} {
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
	}

	@media (max-width: ${() => MOBILE_BREAKPOINT}px) {
		font-size: 10px;
	}
`;

const NotificationTitle = styled.strong`
	font-weight: 600;
	margin-bottom: 10px;
`;

const NotificationMessage = styled.p`
	margin: 0;

	p {
		margin: 0;
	}
`;

const Notifications: FC<NotificationsProps> = ({ notifications, onRemoveNotificationClick }) => {
	return (
		<NotificationsContainer>
			{notifications.slice(0, 1).map((notification, index) => {
				return (
					<NotificationItem key={index}>
						{notification.closable && (
							<Icon hoverable onClick={() => onRemoveNotificationClick(notification)}>
								<CloseIcon />
							</Icon>
						)}
						<NotificationTitle dangerouslySetInnerHTML={{ __html: notification.title }} />
						<NotificationMessage dangerouslySetInnerHTML={{ __html: notification.message }} />
					</NotificationItem>
				);
			})}
		</NotificationsContainer>
	);
};

export default Notifications;
