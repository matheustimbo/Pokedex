import { Dimensions } from 'react-native'

export const colors = {
    black: '#303943',
    blue: '#429BED',
    brown: '#B1736C',
    grey: '#303943',
    indigo: '#6C79DB',
    lightBlue: '#58ABF6',
    lightBrown: '#CA8179',
    lighterGrey: '#F4F5F4',
    lightGrey: '#F5F5F5',
    lightPurple: '#9F5BBA',
    lightRed: '#F7786B',
    lightTeal: '#2CDAB1',
    lightYellow: '#FFCE4B',
    purple: '#7C538C',
    red: '#FA6555',
    teal: '#4FC1A6',
    yellow: '#F6C747'
}

export const sizes = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    bgPokeballSize: Dimensions.get('window').width/2,
    pokemonBannerSize: Dimensions.get('window').height*0.3,
}

export const urls = {
    baseImageUrl : 'https://pokeres.bastionbot.org/images/pokemon/'
}

export const getTypeColor = type => {
    switch(type){
        case 'grass':
            return colors.teal;
        case 'bug':
            return colors.lightTeal;
        case 'fire':
            return colors.lightRed;
        case 'water':
            return colors.blue;
        case 'fighting':
            return colors.lightBrown;
        case 'normal':
            return colors.lightBlue;
        case 'electric':
            return colors.yellow;
        case 'poison':
            return colors.purple;
        case 'ghost':
            return colors.lightPurple;
        case 'ground':
            return colors.brown;
        case 'rock':
            return colors.lightBrown;
        case 'dark':
            return colors.black;
        default:
            return colors.lightBlue;
    }
}