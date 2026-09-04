import Link from "next/link";
import styled, {css} from "styled-components";
import {ButtonStyle} from "@/components/Button";
import {primaryHover} from "@/lib/colors";

const goldHoverFill = css`
  background-color: ${primaryHover};
  border-color: ${primaryHover};
  color: #1a1a1a !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(201, 162, 39, 0.4);
  filter: none;
`;

const BaseLink = ({primary, white, black, outline, size, block, ...rest}) => {
  return <Link {...rest} />;
};

const StyledLink = styled(BaseLink)`
  ${ButtonStyle}
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  ${props => props.white && props.outline && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.35), transparent);
      transition: left 0.5s ease;
    }
  `}
  
  &:hover {
    ${goldHoverFill}

    ${props => props.white && props.outline && css`
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 30px rgba(201, 162, 39, 0.45), 0 0 20px rgba(212, 175, 55, 0.3);

      &::before {
        left: 100%;
      }
    `}
  }
  
  &:active {
    ${props => props.white && props.outline && css`
      transform: translateY(-1px) scale(1.02);
    `}
    ${props => !props.white || !props.outline ? css`
      transform: translateY(0);
    ` : ''}
  }
`;

export default function ButtonLink(props) {
  return <StyledLink {...props} />;
}
