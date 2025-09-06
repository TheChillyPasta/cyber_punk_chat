import React from 'react';
import { BoxNodeProps, NodeProps } from '../props/index';

export interface TabsPropsType extends BoxNodeProps {
    children : JSX.Element[];
    selected ?: string | number;
    onChange ?: React.Dispatch<React.SetStateAction<string|number>>;
}

export type TabIconStyleType = {
    position ?: "center" |  "left" | "right" ,
    size ?: string;
    color ?: string;
}


export interface TabPropsType extends BoxNodeProps {
    name ?: string;
    value : string|number;
    icon ?: JSX.Element | undefined;
    tabIconStyles ?: {
        position ?: "center" |  "left" | "right" ,
        size ?: string;
        color ?: string;
    };
    tabIconClasses ?: string;

}