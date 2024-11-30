/**
 * Layout component that provides the overall structure of the application.
 * It includes a header and a content area where child routes will be rendered.
 * The `Outlet` component is used to display the active child route.
 * 
 * @component
 * @example
 * return (
 *   <Layout>
 *     <SomeOtherComponent />
 *   </Layout>
 * )
 */
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";

/**
 * The Layout component renders the Header and content area.
 * The `Outlet` component serves as a placeholder for rendering child routes.
 * 
 * @returns {JSX.Element} The rendered layout of the application with Header and child routes.
 */
function Layout() {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        {/* Outlet renders the current child route */}
        <Outlet />
      </StyledContent>
    </StyledLayout>
  );
}

const StyledLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 93%;
`;

export default Layout;
