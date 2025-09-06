import React from 'react'
import {BoxNodeProps} from "../../ts/props"
import clsx from 'clsx'
import styled from 'styled-components';
import {} from 'styled-components'
import { css } from 'styled-components';
import { SharedStyles, StylePropsType } from './Style';
import IconWrapper from '../IconWrapper';

export interface BaseButtonType extends  StylePropsType, React.DetailedHTMLProps<
React.ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
>{
    
}

export interface ButtonProps extends BaseButtonType {
    size ?: 'sm' | 'md' | 'lg';
    variant ?: 'p' | 's' | 't' ;
    onClick ?: React.MouseEventHandler<HTMLElement>;

}


export interface TabButtonProps extends BaseButtonType{
    aria_selected : boolean;
    value : string | number;
    name ?: string ;
}




const StyledButton = styled.button<BaseButtonType>`
    ${
    // @ts-ignore
    SharedStyles
    };
    padding : ${props => props.p || "5px 8px"};
    outline : none;
    border : ${props => props.border || "none"};

`;


export  const Button =   React.forwardRef( ( 
    { children, p, m, rad, cx, sx, onClick, ...props } : ButtonProps, ref  :  React.Ref<HTMLButtonElement>)  => {
    
    return (
        <StyledButton  {...props}  ref = {ref}   onClick = {onClick} >
            {children}
        </StyledButton>
    )
});


export const TabButton =  React.forwardRef<HTMLButtonElement, TabButtonProps>(({ cx, children, aria_selected, sx, onClick, ...props}, ref ) => {
   
    return (
        <StyledButton ref = {ref} className = {clsx(cx)} aria-selected = {aria_selected}  onClick = {onClick} >
            {children}
        </StyledButton>
    )
},)
 

export interface ActionBtnPropsType extends ButtonProps{
    icon : React.ReactNode;
    active ?: boolean | string | number;
    activeClass ?: string;
}


export const  ActionButton  = React.forwardRef( ( 
    { children, icon,onClick,active,activeClass,  ...props } : ActionBtnPropsType, ref  :  React.Ref<HTMLButtonElement>)  => {
    
    return (
        <StyledButton   p = "0" {...props} ref = {ref} onClick = {onClick}  >
            <div className = {clsx('flex items-center justify-center h-auto w-auto')}>
            <IconWrapper active = {active} cx = {  active ? clsx(activeClass) : "" } >
                    {icon}
            </IconWrapper>
            </div>
            {children}
        </StyledButton>
    )
} )