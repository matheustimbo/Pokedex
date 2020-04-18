import React, { Component } from 'react'
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    Easing,
    ScrollView
} from 'react-native'
import ArrowLeft from './assets/svgs/left-arrow.svg'
import Heart from './assets/svgs/heart.svg'
import { sizes, urls, getTypeColor } from './utils'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

const { width, height, pokemonBannerSize, bgPokeballSize } = sizes;

export default class PokemonDetails extends Component {
    translateY = new Animated.Value(0)
    constructor() {
        super()
        this.state = {
            spinValue: new Animated.Value(0),
            tabsScroll: new Animated.Value(0),
            pokeInfoTranslateY: new Animated.Value(0),
            pokeInfoOffset: 0,
        }
    }

    getPokemonId = id => {
        if(id < 10){
            return '#00' + id
        }
        if(id < 100){
            return '#0' + id
        }
        return '#' + id
    }

    componentDidMount() {
        Animated.loop(Animated.timing(this.state.spinValue, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true, })).start()
    }

    onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            let fullscreen = false
            const { translationY } = event.nativeEvent;
            this.setState({
                pokeInfoOffset: this.state.pokeInfoOffset += translationY
            })
            /*this.state.pokeInfoTranslateY.setOffset(this.state.pokeInfoOffset)
            this.state.pokeInfoTranslateY.setValue(0)*/
            console.log("translationy", translationY)
            if (translationY <= -100) {
                fullscreen = true
            } else {
                this.state.pokeInfoTranslateY.setValue(this.state.pokeInfoOffset)
                this.state.pokeInfoTranslateY.setOffset(0)
                this.setState({ pokeInfoOffset: 0 })
            }

            Animated.timing(this.state.pokeInfoTranslateY, {
                toValue: fullscreen ? -height / 2 : 0,
                duration: 200,
                useNativeDriver: true
            }).start(() => {
                this.setState({
                    pokeInfoOffset: fullscreen ? -height / 2 : 0
                })
                this.state.pokeInfoTranslateY.setOffset(this.state.pokeInfoOffset)
                this.state.pokeInfoTranslateY.setValue(0)
            });

        }
    }

    render() {
        let { pokemon } = this.props.route.params
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        const tabsIndicatorOffset = this.state.tabsScroll.interpolate({
            inputRange: [0, width * 4],
            outputRange: [0, ((width * 0.9) / 4) * 4]
        })
        const pokeInfoMargin = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-height / 2, 0],
            outputRange: [-height * 0.1, height * 0.3],
            extrapolate: 'clamp'
        })
        const bgPokeballOpacity = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2)/2, 0],
            outputRange: [0, 0.2],
            extrapolate: 'clamp'
        })
        const bgPokeballOnTopOpacity = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2), 0],
            outputRange: [0.2, 0],
            extrapolate: 'clamp'
        })
        const pokeImgOpacity = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2)/2, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const pokeNameMarginTop = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2), 0],
            outputRange: [sizes.bgPokeballSize * 0.10 , sizes.bgPokeballSize * 0.15 + 24 + 20],
            extrapolate: 'clamp'
        })
        const pokeNameMarginLeft = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2), 0],
            outputRange: [40, 0],
            extrapolate: 'clamp'
        })
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: getTypeColor(pokemon.types[pokemon.types.length - 1].type.name), justifyContent: 'space-between', }}>
                <Animated.Image
                    style={[styles.bgPokeball, { transform: [{ rotate: spin }], opacity: bgPokeballOpacity}]}
                    source={require('./assets/imgs/pokeball.png')}
                />
                <Animated.Image
                    style={[styles.bgPokeballOnTop, { transform: [{ rotate: spin }], opacity: bgPokeballOnTopOpacity}]}
                    source={require('./assets/imgs/pokeball.png')}
                />
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => {
                        this.props.navigation.navigate('Home')
                    }}
                >
                    <View style={{ width: 40, height: 40 }}>
                        <ArrowLeft width={24} height={24} fill="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.likeBtn}
                >
                    <Heart width={24} height={24} fill="white" />
                </TouchableOpacity>
                
                <Animated.View style={[styles.bgSquare]} />
                <View style={{ marginHorizontal: sizes.bgPokeballSize * 0.15}}>
                    <View style={{flexDirection: 'row', width: width - (sizes.bgPokeballSize * 0.15)*2, justifyContent: 'space-between'}}> 
                        <Animated.Text style={[styles.pokeName, { transform: [{ translateY: pokeNameMarginTop }, {translateX: pokeNameMarginLeft}]}]}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Animated.Text>
                        <Animated.Text style={[styles.pokeId, {opacity: pokeImgOpacity}]}>{this.getPokemonId(pokemon.id)}</Animated.Text>
                    </View>
                    
                    <Animated.View style={{ flexDirection: 'row', marginTop: 8, opacity: pokeImgOpacity}}>
                        {pokemon.types.map(type => {
                            return (
                                <View style={styles.typeCard}>
                                    <Text style={styles.typeCardText}>{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</Text>
                                </View>
                            )
                        })}
                    </Animated.View>
                </View>

                <Animated.View style={[styles.pokeInfoContainer, { transform: [{ translateY: pokeInfoMargin }] }]}>
                    <Animated.Image
                        style={[styles.pokeImg, {opacity: pokeImgOpacity}]}
                        source={{
                            uri: urls.baseImageUrl + pokemon.id + '.png'
                        }}
                    />
                    <PanGestureHandler
                        onHandlerStateChange={event => this.onHandlerStateChange(event)}
                        onGestureEvent={Animated.event([{ nativeEvent: { translationY: this.state.pokeInfoTranslateY } }], { useNativeDriver: true })}>
                        <Animated.View>
                            <View style={{ flexDirection: 'row', marginHorizontal: width * 0.05, paddingTop: height * 0.05, }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: 0, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Text>About</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: width, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Text>Base Stats</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: width * 2, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Text>Evolution</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: width * 3, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Text>Moves</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.tabLine}>
                                    <Animated.View style={[styles.tabSelectedIndicator, { marginLeft: tabsIndicatorOffset }]} />
                                </View>
                            </View>
                        </Animated.View>


                    </PanGestureHandler>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        ref={(ref) => this.myScroll = ref}
                        style={{
                            width: width,
                            height: height * 0.45 - 24
                        }}
                        contentContainerStyle={{
                            justifyContent: 'flex-end', alignItems: 'flex-end'
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: this.state.tabsScroll } } }]
                        )}
                    >

                        <View style={styles.tabView}>

                        </View>

                        <View style={styles.tabView}>

                        </View>
                        <View style={styles.tabView}>

                        </View>
                        <View style={styles.tabView}>

                        </View>
                    </ScrollView>
                </Animated.View>


            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    tabSelectedIndicator: {
        width: (width * 0.9) / 4,
        height: 3,
        backgroundColor: '#979ABB'
    },
    tabLine: {
        position: 'absolute',
        width: width * 0.9,
        height: 3,
        backgroundColor: '#FAFAFA',
        bottom: 0,
        left: 0
    },
    tabView: {
        width: width,
        height: (height * 0.45) * 2,
        backgroundColor: 'white'
    },
    tabTitle: {
        width: (width * 0.9) / 4,
        alignItems: 'center',
        marginBottom: 24,
    },
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
        left: width/2 - bgPokeballSize/2,
        top: height / 2 - bgPokeballSize,
    },
    bgPokeballOnTop: {
        position: 'absolute',
        opacity: 0.2,
        width: bgPokeballSize*0.7,
        height: bgPokeballSize*0.7,
        right: -bgPokeballSize*0.15,
        top:  -bgPokeballSize*0.15,
    },
    pokeImg: {
        width: pokemonBannerSize,
        height: pokemonBannerSize,
        position: 'absolute',
        left: width / 2 - pokemonBannerSize / 2,
        top: - pokemonBannerSize * 0.85
    },
    pokeInfoContainer: {
        width: width,
        height: height,
        backgroundColor: 'white',
        alignSelf: 'flex-end',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        //marginTop: -height * 0.1 //ir ate -height*0.1
    },
    pokeName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 32,
        //marginTop: sizes.bgPokeballSize * 0.10,
        //marginLeft: 40
        //marginTop: sizes.bgPokeballSize * 0.15 + 24 + 20
    },
    pokeId: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: sizes.bgPokeballSize * 0.15 + 24 + 20 + 20
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
        width: width / 3,
        height: width / 3,
        position: 'absolute',
        borderRadius: 20,
        top: -(width / 2) * 0.3,
        left: -(width / 2) * 0.2,
        transform: [{ rotate: '-30deg' }]
    }
})
