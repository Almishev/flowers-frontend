import Link from "next/link";
import styled, {css} from "styled-components";
import {ButtonStyle} from "@/components/Button";
import {primary} from "@/lib/colors";

// Филтрираме проповете за стилизиране, за да не стигат до DOM (<a> елемента).
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
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
  `}
  
  &:hover {
    ${props => props.white && !props.outline && css`
      background-color: #f5f5f5;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `}
    ${props => props.white && props.outline && css`
      background-color: #fff;
      border-color: #fff;
      color: ${primary};
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3);
      
      &::before {
        left: 100%;
      }
    `}
    ${props => props.black && !props.outline && css`
      background-color: #333;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `}
    ${props => props.black && props.outline && css`
      background-color: rgba(0, 0, 0, 0.05);
      border-color: #333;
    `}
    ${props => props.primary && !props.outline && css`
      background-color: ${primary};
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      color: #fff !important;
    `}
    ${props => props.primary && props.outline && css`
      background-color: ${primary};
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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