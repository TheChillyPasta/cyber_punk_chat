import React, {createRef, useRef, useContext} from 'react'
import { createContext } from 'react'


export type ElementRef<
  E extends HTMLElement = HTMLElement
> = React.MutableRefObject<E | null>;

type ElementRefs = {
  ContainerRef: ElementRef<HTMLDivElement>;
};


const ElementRefContext = createContext<ElementRefs>({
    ContainerRef: createRef(),
  });


  
export const ElementRefContextProvider= ( {children} : {
    children : React.ReactNode
} ) => {

    const ContainerRef = useRef<HTMLDivElement>(null)
    return (
        <ElementRefContext.Provider 
          value = {{
              ContainerRef
          }}
        >
        {children}
        </ElementRefContext.Provider>
    )
}


function useElementRef() {
  const context = useContext(ElementRefContext)
  return context
}

export function useEmojiContainerRef (){
  return useElementRef()["ContainerRef"]
}



