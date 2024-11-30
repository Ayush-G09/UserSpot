import React from 'react'
import styled from 'styled-components'

function Divider() {
  return (
    <StyledDivider/>
  )
};

const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(p) => p.theme.primary};
`;

export default Divider