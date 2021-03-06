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
import ArrowRight from './assets/svgs/right-arrow.svg'
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
            pokeEvolutions: []
        }
    }

    getPokemonId = id => {
        if (id < 10) {
            return '#00' + id
        }
        if (id < 100) {
            return '#0' + id
        }
        return '#' + id
    }

    componentDidMount() {
        let pokemon = this.props.route.params.pokemon
        console.log("species", pokemon.species)
        this.getEvolutionChain(pokemon)
        Animated.loop(Animated.timing(this.state.spinValue, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true, })).start()
    }

    getEvolutionChain = pokemon => {
        fetch(pokemon.species.url)
            .then(response => {
                return response.json()
            })
            .then(species => {
                let evolChainUrl = species.evolution_chain.url
                fetch(evolChainUrl)
                    .then(response => {
                        return response.json()
                    })
                    .then(evolChain => {
                        console.log('evolchain', evolChain)
                        this.getEvolvesTo(evolChain.chain)
                    })
            })
    }

    getEvolvesTo = async evolvesTo => {
        await evolvesTo.evolves_to.map(async evolvesToPokemon => {
            let poke1Url = evolvesTo.species.url
            let poke1 = await fetch(poke1Url)
                .then(async response => {
                    return response.json()
                }).then(async specie => {
                    let pokemon = await fetch(specie.varieties[0].pokemon.url)
                        .then(response => {
                            return response.json()
                        })
                    return pokemon
                })
            let poke2Url = evolvesToPokemon.species.url
            let poke2 = await fetch(poke2Url)
                .then(async response => {
                    return response.json()
                }).then(async specie => {
                    let pokemon = await fetch(specie.varieties[0].pokemon.url)
                        .then(response => {
                            return response.json()
                        })
                    return pokemon
                })
            this.setState({ pokeEvolutions: [...this.state.pokeEvolutions, [poke1, poke2]] })
        })
        evolvesTo.evolves_to.map(evolvesto => {
            this.getEvolvesTo(evolvesto)
        })

        
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
            outputRange: [-(height * 0.2 - (sizes.bgPokeballSize * 0.15 + 40)), height * 0.3],
            extrapolate: 'clamp'
        })
        const bgPokeballOpacity = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2) / 2, 0],
            outputRange: [0, 0.2],
            extrapolate: 'clamp'
        })
        const bgPokeballOnTopOpacity = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2), 0],
            outputRange: [0.2, 0],
            extrapolate: 'clamp'
        })
        const pokeImgOpacity = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2) / 2, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const pokeNameMarginTop = this.state.pokeInfoTranslateY.interpolate({
            inputRange: [-(height / 2), 0],
            outputRange: [sizes.bgPokeballSize * 0.10, sizes.bgPokeballSize * 0.15 + 24 + 20],
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
                    style={[styles.bgPokeball, { transform: [{ rotate: spin }], opacity: bgPokeballOpacity }]}
                    source={require('./assets/imgs/pokeball.png')}
                />
                <Animated.Image
                    style={[styles.bgPokeballOnTop, { transform: [{ rotate: spin }], opacity: bgPokeballOnTopOpacity }]}
                    source={require('./assets/imgs/pokeball.png')}
                />


                <Animated.View style={[styles.bgSquare]} />
                <View style={{ marginHorizontal: sizes.bgPokeballSize * 0.15 }}>
                    <View style={{ flexDirection: 'row', width: width - (sizes.bgPokeballSize * 0.15) * 2, justifyContent: 'space-between' }}>
                        <Animated.Text style={[styles.pokeName, { transform: [{ translateY: pokeNameMarginTop }, { translateX: pokeNameMarginLeft }] }]}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Animated.Text>
                        <Animated.Text style={[styles.pokeId, { opacity: pokeImgOpacity }]}>{this.getPokemonId(pokemon.id)}</Animated.Text>
                    </View>

                    <Animated.View style={{ flexDirection: 'row', marginTop: 8, opacity: pokeImgOpacity }}>
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
                    <PanGestureHandler
                        onGestureEvent={evt=>console.log('evt', evt.nativeEvent.translationX)}
                    >
                        <Animated.Image
                            style={[styles.pokeImg, { opacity: pokeImgOpacity }]}
                            source={{
                                uri: urls.baseImageUrl + pokemon.id + '.png'
                            }}
                        />
                    </PanGestureHandler>
                    
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
                                        <Animated.Text style={[styles.tabText, {color: this.state.tabsScroll.interpolate({ inputRange: [0, width/2], outputRange: ['rgb(0,0,0)', 'rgb(188,188,188)'], extrapolate: 'clamp'})}]}>About</Animated.Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: width, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Animated.Text style={[styles.tabText, {color: this.state.tabsScroll.interpolate({ inputRange: [width/2, width, width*1.5], outputRange: ['rgb(188,188,188)', 'rgb(0,0,0)', 'rgb(188,188,188)'], extrapolate: 'clamp'})}]}>Base Stats</Animated.Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: width * 2, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Animated.Text style={[styles.tabText, {color: this.state.tabsScroll.interpolate({ inputRange: [width*1.5, width*2, width*2.5], outputRange: ['rgb(188,188,188)', 'rgb(0,0,0)', 'rgb(188,188,188)'], extrapolate: 'clamp'})}]}>Evolution</Animated.Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.myScroll.scrollTo({ y: 0, x: width * 3, animated: true })
                                    }}
                                >
                                    <View style={styles.tabTitle}>
                                        <Animated.Text style={[styles.tabText, {color: this.state.tabsScroll.interpolate({ inputRange: [width*2.5, width*3], outputRange: ['rgb(188,188,188)', 'rgb(0,0,0)'], extrapolate: 'clamp'})}]}>Moves</Animated.Text>
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
                            flex: 1
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: this.state.tabsScroll } } }]
                        )}
                    >

                        <View style={styles.tabView}>

                        </View>

                        <View style={styles.tabView}>

                        </View>
                        <View style={[styles.tabView, styles.evolTab]}>
                            <Text style={styles.evolutionChainTitle}>Evolution Chain</Text>
                            <ScrollView style={{ flex: 1 }}>
                                {this.state.pokeEvolutions.map((chain, index) => {
                                    let poke1 = chain[0]
                                    let poke2 = chain[1]
                                    return (
                                        <View style={[styles.evolChainContainer, index == this.state.pokeEvolutions.length - 1 ? {} : { borderBottomWidth: 1, borderColor: '#EDEDED', }]}>
                                            <TouchableOpacity
                                                onPress={() => { this.props.navigation.navigate('PokemonDetails', { pokemon: poke1 }) }}
                                            >
                                                <View>
                                                    <Image
                                                        style={[styles.evolChainPokeImg, { position: 'absolute', left: 0, top: 0, opacity: 0.1 }]}
                                                        source={require('./assets/imgs/pokeball_black.png')}
                                                    />
                                                    <Image
                                                        style={styles.evolChainPokeImg}
                                                        source={{
                                                            uri: urls.baseImageUrl + poke1.id + '.png'
                                                        }}
                                                    />

                                                </View>
                                            </TouchableOpacity>

                                            <View>
                                                <ArrowRight width={32} height={32} fill="#EDEDED" />
                                            </View>
                                            <TouchableOpacity
                                                onPress={()=>{this.props.navigation.navigate("PokemonDetails", {pokemon: poke2})}}
                                            >
                                                <View>
                                                    <Image
                                                        style={[styles.evolChainPokeImg, { position: 'absolute', left: 0, top: 0, opacity: 0.1 }]}
                                                        source={require('./assets/imgs/pokeball_black.png')}
                                                    />
                                                    <Image
                                                        style={styles.evolChainPokeImg}
                                                        source={{
                                                            uri: urls.baseImageUrl + poke2.id + '.png'
                                                        }}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    )
                                })}
                            </ScrollView>

                        </View>
                        <View style={styles.tabView}>

                        </View>
                    </ScrollView>
                </Animated.View>
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

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    tabText: {
        fontWeight: 'bold'
    },
    evolutionChainTitle: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: width * 0.05
    },
    evolChainPokeImg: {
        width: width * 0.2,
        height: width * 0.2
    },
    evolChainContainer: {
        width: width * 0.9,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 20
    },
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
        flex: 1,
        backgroundColor: 'white'
    },
    evolTab: {
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingTop: width * 0.1,
        //height: height*0.8 - width*0.1
        flex: 1
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
        left: width / 2 - bgPokeballSize / 2,
        top: height / 2 - bgPokeballSize,
    },
    bgPokeballOnTop: {
        position: 'absolute',
        opacity: 0.2,
        width: bgPokeballSize * 0.7,
        height: bgPokeballSize * 0.7,
        right: -bgPokeballSize * 0.15,
        top: -bgPokeballSize * 0.15,
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
        height: height - (sizes.bgPokeballSize * 0.15 + 40),
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
