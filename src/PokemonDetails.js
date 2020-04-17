import React, { Component } from 'react'
import { 
    Text, 
    View,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    Easing
} from 'react-native'
import ArrowLeft from './assets/svgs/left-arrow.svg'
import Heart from './assets/svgs/heart.svg'
import { sizes, urls, getTypeColor } from './utils'

const { width, height, pokemonBannerSize, bgPokeballSize } = sizes;




export default class PokemonDetails extends Component {

    constructor(){
        super()
        this.state = {
            spinValue : new Animated.Value(0)
        }
    }

    componentDidMount(){
        // First set up animation 
        Animated.loop( Animated.timing(this.state.spinValue, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true, }) ).start()

        
    }
    
    render() {
        let {pokemon} = this.props.route.params
        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
            })
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: getTypeColor(pokemon.types[pokemon.types.length-1].type.name), justifyContent: 'space-between',}}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={()=>{
                        this.props.navigation.navigate('Home')
                    }}
                >
                    <ArrowLeft width={24} height={24} fill="white"/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.likeBtn}
                >
                    <Heart width={24} height={24} fill="white"/>
                </TouchableOpacity>
                <Animated.Image
                    style={[styles.bgPokeball, {transform: [{rotate: spin}]}]}
                    source={require('./assets/imgs/pokeball.png')}
                />
                <Animated.View style={[styles.bgSquare]}/>
                <View style={{marginLeft: sizes.bgPokeballSize * 0.15}}>
                    <Text style={styles.pokeName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                        {pokemon.types.map(type=>{
                            return(
                                <View style={styles.typeCard}>
                                    <Text style={styles.typeCardText}>{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
                
                <View style={styles.pokeInfoContainer}>
                    <Image
                        style={styles.pokeImg}
                        source={{
                            uri: urls.baseImageUrl + pokemon.id + '.png'
                        }}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    typeCardText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 14,
    },
    typeCard: {
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    bgPokeball: {
        position: 'absolute',
        opacity: 0.2,
        width: bgPokeballSize,
        height: bgPokeballSize,
        right: -bgPokeballSize/10,
        top: height/2 - bgPokeballSize,
    },
    pokeImg: {
        width: pokemonBannerSize,
        height: pokemonBannerSize,
        position: 'absolute',
        left: width/2 - pokemonBannerSize/2,
        top: - pokemonBannerSize*0.85
    },
    pokeInfoContainer: {
        width: width,
        height: height*0.5,
        backgroundColor: 'white',
        alignSelf: 'flex-end',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    pokeName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 32,
        marginTop: sizes.bgPokeballSize * 0.15 + 24 + 20
    },
    likeBtn: {
        position: 'absolute',
        top: sizes.bgPokeballSize * 0.15,
        right: sizes.bgPokeballSize * 0.15  
    },
    backBtn: {
        position: 'absolute',
        top: sizes.bgPokeballSize * 0.15,
        left: sizes.bgPokeballSize * 0.15
    },
    bgSquare: {
        backgroundColor: 'rgba(255, 255,255, 0.1)',
        width: width/3,
        height: width/3,
        position: 'absolute',
        borderRadius: 20,
        top: -(width/2)*0.3,
        left: -(width/2)*0.2,
        transform: [{rotate: '-30deg'}]
    }
})
