export type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export type ElementRef<
E extends HTMLElement = HTMLElement
> = React.MutableRefObject<E | null>;