


export function scrollTo(ref : HTMLElement, top : number = 0){


    requestAnimationFrame(() => {
        ref.scrollTop = top - 100;
    })

}