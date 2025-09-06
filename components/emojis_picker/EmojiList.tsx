'use client'
import React, { useState, useMemo, useCallback, SetStateAction, useEffect, useRef , useContext} from 'react'
import clsx from 'clsx'
import { NodeProps } from '../../ts/props/index';
import { AnimalEmojisIcon, EmojiIcon, FlagEmojisIcon, ObjectEmojisIcon, RecentIcon, SportsEmojisIcon, SymbolEmojisIcon, VehcleEmojisIcon } from '../IconWrapper';
import { FoodEmojisIcon } from '../IconWrapper';
import { InputBox } from '../SearchBox';
import groups, {mapGroupsWithLabels} from './groups';
import emojis from './data';
import css from './emojis.module.scss';
import { skinTonesMapped, skinTonesNamed } from './skinVariations';
import { EmojiData , EmojiProperties, EmojiStyle} from '../../ts/emojis';
import { unifiedEmojisVariations, getEmojisUrl } from './emojisSelector';
import { ElementRefContextProvider, useEmojiContainerRef } from './context/refContext';
import useActionGroupScrollDetection from './hooks/useActionGroupScrollDetection';
import useScrollGroupInView from './hooks/useScrollGroupInView';


interface EmojiPropType extends NodeProps {
    open : boolean;
    toggleEmojiPanel ?: React.Dispatch<SetStateAction<boolean>>
}

interface EmojisListPropsType extends NodeProps{
    currentEmojiGroup : string | number;
    setEmojiGroup : React.Dispatch<SetStateAction<string | number>>
}


interface EmojisGroupByTypePropsType extends NodeProps , EmojisListPropsType{

    groupTitle : string;
    data_label : string;
    innerContainerPosition ?: any

}

export enum EmojiGroupId  {
    smileys_people = "smileys_people",
    animals_nature = 'animals_nature',
    food_drink = 'food_drink',
    activities = 'activities',
    travel_places = 'travel_places',
    objects = 'objects',
    symbols = 'symbols',
    flags = 'flags'
}

interface EmojiPropsType extends NodeProps {
    
    skinTone ?: string;
    name ?: string;
    description ?: string;
    emojiUrl : string;
    emoji : EmojiData;
    unified ?: string;
    size ?: number;
    emojiStyle ?: string

}



const Emoji = (props : EmojiPropsType) => {
    const{
        skinTone = "neutral",
        name  = "untitled",
        description,
        emojiUrl,
        unified,
        emojiStyle = "native",

    } = props;

    return (
        <img 
            src = {emojiUrl}
            width = {30}
            height = {30}
            alt = "emoji"
            className = {clsx("basis grow-0 cursor-pointer")}
        />
        )

}


const EmojisGroupByType = (props : EmojisGroupByTypePropsType ) => {

    const{
        groupTitle,
        data_label,
        currentEmojiGroup ,
        setEmojiGroup  ,
        innerContainerPosition
    } = props

    const data = useMemo(( ) => emojis?.[data_label]  ?? [] , [data_label])

    const emojisToShow = useMemo( ( ) => data.map((emoji) => {

        const unified = unifiedEmojisVariations(emoji);
        const emojiUrl = getEmojisUrl(unified)
        const [ name , description ] : string[] = emoji[EmojiProperties.n] ?? []
        return <Emoji 
            unified = {unified}
            emoji = {emoji}
            name = {name}
            description = {description}
            emojiUrl = {emojiUrl}
            key = {unified}
        />

    }) , [] )
    
    const ref = useRef<HTMLDivElement>(null)




    // useEffect(( ) => {

    //     if(targetPosition.top != 0){

    //         if( targetPosition?.top <= innerContainerPosition.bottom && targetPosition?.bottom >=  innerContainerPosition.top )
    //             setEmojiGroup(data_label)
    //         console.log(targetPosition)

    //     }
    //     console.log(ref, innerContainerPosition)

    // }, [targetPosition, ref.current])

    // function toggleEmojiGroups(event : React.BaseSyntheticEvent){
        
        


    // } 

    // const handleScroll = (event : React.BaseSyntheticEvent) => {

    //     const targetPosition = event.currentTarget.getBoundingClientRect()

    //     if(targetPosition.top != 0){

    //         if( targetPosition?.top <= innerContainerPosition.bottom && targetPosition?.bottom >=  innerContainerPosition.top )
    //             setEmojiGroup(data_label)

    //     }
        
    // }


    return (
        <div  className = {clsx( " emoji_group w-full h-auto px-2 py-2 " )}  ref = {ref} id = {data_label}  >
            <p className = {clsx("text-sm text-gray-500 m-2  ")} >
                {groupTitle}
            </p>
            <div className = {clsx("flex flex-row flex-wrap gap-2 px-3 ")}>
              {emojisToShow}
            </div>
        </div>
 
    )
}

export default function EmojiList(props : EmojisListPropsType) {
    const [query, setEmojis] = useState<string>("")

    const{
        currentEmojiGroup ,
        setEmojiGroup  
    } = props

    useScrollGroupInView(currentEmojiGroup) 
    useActionGroupScrollDetection(setEmojiGroup)
    
    const emojisGroupList = useMemo(( ) => {

           
           return groups?.length && groups.map(group  => (
                <EmojisGroupByType 
                    key = {group} 
                    groupTitle = {mapGroupsWithLabels[group] } 
                    data_label ={  group} 
                    currentEmojiGroup = {currentEmojiGroup}
                    setEmojiGroup = {setEmojiGroup}
                />
            ))


    }, [])

    useEffect(( ) => {
        
    }, [currentEmojiGroup])

    return (
        <div 
            className = {clsx( "flex flex-col gap-2 h-auto w-full bg-header-100 overflow-hidden  " )}
        >   <div className = {clsx("h-header px-2  py-1 ")}>
                <InputBox cx = {clsx("bg-search-300")} setQuery = {setEmojis}  placeholder = "Search Emojis .. "/>
             
            </div>
            <div className={clsx("overflow-auto max-h-emoji_panel")}
            ref = {useEmojiContainerRef()}

            >
                <div className = {clsx("h-auto")} >
                    {
                    emojisGroupList ?? ""      
                    }
                </div>

            </div>
        </div>
    )
}
