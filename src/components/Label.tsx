import React from "react";
import styled, { CSSProperties } from "styled-components";

type Props = {
  children: React.ReactNode;
  size?: string;
  weight?: string;
  sx?: CSSProperties;
};

function Label({ children, size = "1rem", weight = "normal", sx }: Props) {
  return (
    <StyledLabel style={sx} $size={size} $weight={weight}>
      {children}
    </StyledLabel>
  );
}

const StyledLabel = styled.span<{ $size: string; $weight: string }>`
  font-size: ${(p) => p.$size};
  font-weight: ${(p) => p.$weight};
  color: ${(p) => p.theme.font};
  word-break: break-word;
`;

export default Label;
