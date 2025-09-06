export type EmojiClickData = {
    activeSkinTone: SkinTones;
    unified: string;
    unifiedWithoutSkinTone: string;
    emoji: string;
    names: string[];
    getImageUrl: (emojiStyle: EmojiStyle) => string;
  };
  

  export interface EmojiData  {
    n ?: string[];
    u :string;
    a ?:string;
    v ?: string[];

}
  
  export enum EmojiStyle {
    NATIVE = 'native',
    APPLE = 'apple',
    TWITTER = 'twitter',
    GOOGLE = 'google',
    FACEBOOK = 'facebook'
  }
  
  export enum EmojiProperties {
    u = 'u',
    v = 'v',
    n = 'n',
    a = 'a'
  }
 
  
  export enum SkinTones {
    NEUTRAL = 'neutral',
    LIGHT = '1f3fb',
    MEDIUM_LIGHT = '1f3fc',
    MEDIUM = '1f3fd',
    MEDIUM_DARK = '1f3fe',
    DARK = '1f3ff'
  }
  
  export enum Categories {
    SUGGESTED = 'suggested',
    SMILEYS_PEOPLE = 'smileys_people',
    ANIMALS_NATURE = 'animals_nature',
    FOOD_DRINK = 'food_drink',
    TRAVEL_PLACES = 'travel_places',
    ACTIVITIES = 'activities',
    OBJECTS = 'objects',
    SYMBOLS = 'symbols',
    FLAGS = 'flags'
  }
  
  