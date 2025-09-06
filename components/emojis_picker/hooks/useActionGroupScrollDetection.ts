import React , {useEffect} from 'react'
import { useEmojiContainerRef } from '../context/refContext'
import { EmojiGroupId } from '../EmojiContainer';

/*
  Update the active emoji group when fall under the visible viewport
*/
export default function useActionGroupScrollDetection(

    setActiveGroup : (group : string) => void,

) : void {
    const emojiContainerRef =  useEmojiContainerRef()

    useEffect(() => {

      const containerElement = emojiContainerRef.current
      const visibleGroup = new Map()
      const observer = new IntersectionObserver((entries ) => {

        if(!containerElement)
        return ;

        for (const entry of entries){
          const id = entry.target.id;
          visibleGroup.set(id, entry.intersectionRatio);
        }
        
        const ratios =  Array.from(visibleGroup)

        const lastGroup = ratios[ratios.length - 1]

        if(lastGroup[1] == 1)
          return setActiveGroup(lastGroup[0])

        for (const [id, ratio] of ratios){
           if(ratio)
          { setActiveGroup(id)
          break;
          }
        }

      }, 
      {
        threshold : [0, 1]
      })

      containerElement?.querySelectorAll('.emoji_group').forEach((ele ) => {
        observer.observe(ele);
      })

      // console.log("emojiContainerRef -- ", emojiContainerRef)
    
    }, [emojiContainerRef, setActiveGroup]);
}
