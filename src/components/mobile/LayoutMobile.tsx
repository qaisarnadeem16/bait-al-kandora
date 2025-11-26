import FooterMobile from 'components/mobile/FooterMobile';
import MobileMenu from 'components/mobile/MobileMenu';
import Viewer3D from 'components/Viewer3D';
import styled from 'styled-components';

// Container component for the mobile layout
export const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow:column;
  padding:40px 60px;
  @media (max-width: 1024px) {
    flex-direction: column;
    padding:0px;
    height: 100%;
  }
  @media (min-width: 1024px) {
    width: 100%;
    height: 100%;
  }
`;

// MobileContainer component for the mobile layout
export const MobileContainer = styled.div`
  position: relative;
  display:grid;
  grid-template-rows: 1fr auto auto;
  height:100%;
  width:100%;
  overflow:hidden;
`;

// Top component for the mobile layout
export const Top = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 40%;
  min-height:0;

  @media (max-width: 1024px) {
    display:flex;
    flex-direction: column;
  }
`;

// LayoutMobile component for the mobile layout
function LayoutMobile() {
  return (
    <MobileContainer>
      <Viewer3D /> {/* Renders the 3D viewer */}
      <MobileMenu /> {/* Renders the mobile menu */}
      <FooterMobile /> {/* Renders the mobile footer */}
    </MobileContainer>
  );
}

export default LayoutMobile;
