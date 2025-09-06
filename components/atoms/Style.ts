import { css } from "styled-components";
import {} from "styled-components"
import styled from "styled-components";
import { BoxNodeProps, NodeProps } from "../../ts/props";

export interface StylePropsType extends NodeProps {
    w ?: string | number;
    h ?: string | number;
    p ?: string ;
    m ?: string;
    rad ?: string;
    d ?: string;
    direction ?: "row" | "column";
    align ?:  string;
    justify ?: string;
    mx ?: string;
    my ?: string;
    px ?: string;
    py ?: string;
    maxw ?: string;
    minw ?: string;
    maxh ?: string;
    minh ?: string;
    zi ?: string | number;
    left ?: string;
    right ?: string;
    top ?: string;
    bottom ?: string;
    pos ?: "fixed" | "absolute" | "relative" | "static";
    gap ?: string | number | any;
    cols ?: string;
    rows ?: string;
    border ?: string;
    hover ?: string;
    wrap ?: string; // flex wrap
    bg ?: string; //background
    color ?: string;
    minW ?: string;
    minH ?: string;
    maxW ?: string;
    maxH ?: string;
    of ?: string; // overflow
    tAlign ?: "left" | "right" | "center";
    o ?: string | number; //opacity
    animate ?: string;
    tf ?: string //transform
    family ?: string ;//font family
    trans ?: string; //transition
    sx ?:  React.CSSProperties  |  string; // style
    cx ?: string; //class name
    tfOrigin ?: string; // transform origin
    xl ?: string;
    lg ?: string;
    md ?: string;
    sm ?: string;
    xs ?: string;
}




export const SharedStyles =  css<StylePropsType>`

align-items: ${(props) => props.align || ""};
justify-content: ${(props) => props.justify || ""};
flex-direction : ${(props) => props.direction || ""};
flex-wrap : ${(props) => props.wrap || ""};
background: ${(props) => props.bg || ""};
color: ${(props) => props.color || ""};   
margin : ${(props) => props.m || ""};
padding : ${(props) => props.p || ""};   
min-width : ${(props) => props.minW || ""};
max-width : ${(props)=> props.maxW || ""};
min-height : ${(props) => props.minH || ""};
max-height : ${(props) => props.maxH || ""};
position : ${props => props.pos || "" };
top : ${props => props.top || ""};
border-radius : ${props => props.rad || ""};
bottom : ${props => props.bottom || ""};
right : ${props => props.right || ""};
left : ${props => props.left || ""};
z-index : ${props => props.zi || ""};
overflow : ${props => props.of || ""};
text-align : ${props => props.tAlign || ""};
border : ${props => props.border || ""};
opacity : ${props => props.o || ""};
padding : ${(props) => props.p || "0px"};   
margin : ${props => props.m || "0px"};
width : ${props => props.w || "auto"};
height: ${(props) => props.h || "auto"};
display : ${(props) => props.d || "block"};
z-index : ${(props) => props.zi || "1"};
animation : ${props => props.animate || ""};
transform : ${props => props.tf || ""};
font-family : ${props => props.family || "inherit"};
gap : ${props => props.gap || ""};
transition : ${props => props.trans || ""};
transform-origin : ${props => props.tfOrigin};
&:hover{
    ${props => css`${props.hover}`}
}


${props => css`${
    //@ts-ignore
    props.sx
}`};


@media (max-width: 1400px) {   
  ${(props) => css`${props.xl}` };
}
@media (max-width: 1100px) {   
  ${(props) => css`${props.lg}` };
}
@media (max-width: 800px) {   
  ${(props) => css`${props.md}`};
}
@media (max-width: 500px) {   
  ${(props) => css`${props.sm}` };
}
@media (max-width: 300px) {   
  ${(props) => css`${props.xs}`};
}


`