'use client'
import React, { useState, useMemo, useCallback, SetStateAction, useEffect, useRef, useContext } from 'react'
import Tabs from '../molecules/tabs/Tabs'
import Tab from '../molecules/tabs/Tab'
import TabPanel from '../molecules/tabs/TabPanel'
import clsx from 'clsx'
import { NodeProps } from '../../ts/props/index';
import { AnimalEmojisIcon, EmojiIcon, FlagEmojisIcon, ObjectEmojisIcon, RecentIcon, SportsEmojisIcon, SymbolEmojisIcon, VehcleEmojisIcon } from '../IconWrapper';
import { FoodEmojisIcon } from './../IconWrapper';
import css from './emojis.module.scss';
import { ElementRefContextProvider } from './context/refContext';
import EmojiList from './EmojiList';
import TabsContainer from '../molecules/tabs/TabsContainer';
import useScrollGroupInView from './hooks/useScrollGroupInView';

interface EmojiPropType extends NodeProps {
    open: boolean;
    toggleEmojiPanel?: React.Dispatch<SetStateAction<boolean>>
}



export enum EmojiGroupId {
    smileys_people = "smileys_people",
    animals_nature = 'animals_nature',
    food_drink = 'food_drink',
    travel_places = 'travel_places',
    activities = 'activities',
    objects = 'objects',
    symbols = 'symbols',
    flags = 'flags'
}



export default function EmojiContainer(props: EmojiPropType) {

    const {
        open = false,
        toggleEmojiPanel
    } = props;

    const [state, setState] = useState<string | number>("smileys_people")

    useEffect(() => {
    }, [open])


    useEffect(() => {

        console.log(state)
    }, [state])

    useEffect(( ) => {
        console.log("emoji rendered")
    }, [])



    return (
        <ElementRefContextProvider >

            <div 
            className={
                clsx(css.emojis_container, 
                    "w-full h-full absolute bg-header-100  ", 
                    open ? "bottom-[53vh]" : "bottom-0 invisible")}
            >
                <TabsContainer contextValues = {{activeTabState : [state, setState]}}>

                <Tabs direction='row' >
                    <Tab value="recent"
                        icon={<RecentIcon />}
                    />
                    <Tab value="smileys_people"
                        icon={<EmojiIcon />}
                    />
                    <Tab value="animals_nature"
                        icon={<AnimalEmojisIcon />}
                    />
                    <Tab value="food_drink"
                        icon={<FoodEmojisIcon />}
                    />
                    <Tab value="activities"
                        icon={<SportsEmojisIcon />}
                    />
                    <Tab value="travel_places"
                        icon={<VehcleEmojisIcon />}
                    />
                    <Tab value="objects"
                        icon={<ObjectEmojisIcon />}
                    />
                    <Tab value="symbols"
                        icon={<SymbolEmojisIcon />}
                    />
                    <Tab value="flags"
                        icon={<FlagEmojisIcon />}
                    />
                </Tabs>
    
                <TabPanel>
                    <EmojiList currentEmojiGroup={state} setEmojiGroup={setState} />
                </TabPanel>
    
                </TabsContainer>

            </div>
        </ElementRefContextProvider>

    )
}
