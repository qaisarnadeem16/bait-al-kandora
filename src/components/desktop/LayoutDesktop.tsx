import FooterDesktop from 'components/desktop/FooterDesktop';
import Viewer3D from 'components/Viewer3D';

import DesktopRightSidebar from 'components/desktop/DesktopRightSidebar';
import styled from 'styled-components';

// Container component for the desktop layout
export const LayoutDesktopContainer = styled.div`
	position: relative;
	display: flex;
	flex-flow: column;
	padding: 40px 60px;
	@media (max-width: 1024px) {
		flex-direction: column;
		padding: 0px;
		height: 100%;
	}
	@media (min-width: 1024px) {
		width: 100%;
		height: 100%;
	}
`;

// Top section of the layout
export const Top = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: grid;
	grid-template-columns: 1fr 40%;
	min-height: 0;
  
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1200px) {
		grid-template-columns: 50% 50%;
	}
`;

// Main component for the desktop layout
function LayoutDesktop() {
	return (
		<LayoutDesktopContainer>
			<Top>
				<Viewer3D />
				<DesktopRightSidebar />
			</Top>
			<FooterDesktop />
		</LayoutDesktopContainer>
	);
}

export default LayoutDesktop;
