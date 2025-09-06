export interface NodeProps   {
    children ?: React.ReactNode;
    cx ?: string;
    sx ?: React.CSSProperties | string;
    
} 

export interface BoxNodeProps extends NodeProps{
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
}



 

export interface textPropsType extends NodeProps {
    type ?: string;

}