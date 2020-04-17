import React, { Component } from 'react'
import {
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView
} from 'react-native'
import LeftArrow from './assets/svgs/left-arrow.svg'
import Menu from './assets/svgs/menu.svg'
import { sizes, colors, getTypeColor } from './utils'

const { width, height } = Dimensions.get('window')
const baseImageUrl = 'https://pokeres.bastionbot.org/images/pokemon/'
const bgPokeballSize = width / 2

export default class Home extends Component {

    constructor() {
        super()
        this.state = {
            pokemons: [],
            nextUrl: 'https://pokeapi.co/api/v2/pokemon/',
            fetchingPokemon: false
        }
    }

    componentDidMount() {
        this.fetchPokemon()
    }

    fetchPokemonDetails = async url => {
        fetch(url)
            .then(response => { return response.json(); })
            .then(responseJson => {
                console.log('response ', responseJson)
                this.setState({
                    pokemons: [...this.state.pokemons, responseJson].sort((a, b) => { return a.id - b.id })
                })
            })
    }

    fetchPokemon = () => {
        this.setState({ fetchingPokemon: true })
        fetch(this.state.nextUrl)
            .then(response => { return response.json(); })
            .then(responseJson => {
                responseJson.results.map(result => {
                    this.fetchPokemonDetails(result.url)
                })
                this.setState({
                    nextUrl: responseJson.next,
                    fetchingPokemon: false
                })
            })
    }

    renderPokemonCard = pokemon => {
        console.log('types', pokemon.types[pokemon.types.length-1])
        return (
            <View style={styles.pokemonCardWrapper}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate("PokemonDetails", {pokemon: pokemon})
                    }}
                >
                    <View style={[styles.pokemonCard, {backgroundColor: getTypeColor(pokemon.types[pokemon.types.length-1].type.name)}]}>
                        <Image
                            style={styles.bgPokeballCard}
                            source={require('./assets/imgs/pokeball.png')}
                        />
                        <Text style={styles.pokemonCardName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                        {pokemon.types.map(type=>{
                            console.log('type', type)
                            return(
                                <View style={styles.typeCard}>
                                    <Text style={styles.typeCardText}>{type.type.name}</Text>
                                </View>
                            )
                        })}
                        <Image
                            style={styles.pokemonCardImg}
                            source={{
                                uri: baseImageUrl + pokemon.id + '.png'
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Image
                    style={styles.bgPokeball}
                    source={require('./assets/imgs/pokeball_black.png')}
                />
                <TouchableOpacity
                    style={styles.menuBtn}
                >
                    <Menu width={24} height={24} fill="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.backBtn}
                >
                    <LeftArrow width={24} height={24} fill="black" />
                </TouchableOpacity>
                <Text style={styles.pokedexTitle}>
                    Pokedex
                </Text>
                <FlatList
                    data={this.state.pokemons}
                    renderItem={({ item }) => this.renderPokemonCard(item)}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => { if (!this.state.fetchingPokemon) { this.fetchPokemon() } }}
                    style={styles.flatList}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    typeCardText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 10,
    },
    typeCard: {
        borderRadius: 10,
        paddingHorizontal: 2,
        backgroundColor: 'rgba(255,255,255,0.4)',
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 8
    },
    pokemonCardName: {
        marginTop: 16,
        marginLeft: 8,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    pokemonCardImg: {
        width: (width * 0.4 / 2) * 0.85,
        height: (width * 0.4 / 2) * 0.85,
        position: 'absolute',
        bottom: 8,
        right: 8
    },
    bgPokeballCard: {
        width: (width * 0.4) * 0.6,
        height: (width * 0.4) * 0.6,
        opacity: 0.2,
        position: 'absolute',
        bottom: -((width * 0.4) * 0.6) * 0.2,
        right: -((width * 0.4) * 0.6) * 0.2
    },
    pokemonCard: {
        width: width * 0.4,
        height: (width * 0.4) * 0.6,
        backgroundColor: '#FC6C6D',
        borderRadius: 12,
    },
    pokemonCardWrapper: {
        width: width * 0.45,
        height: (width * 0.45) * 0.6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatList: {
        width: width * 0.9,
        marginHorizontal: width * 0.05
    },
    pokedexTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginLeft: bgPokeballSize * 0.15,
        marginTop: bgPokeballSize * 0.15 + 36,
        marginBottom: 36
    },
    backBtn: {
        position: 'absolute',
        top: sizes.bgPokeballSize * 0.15,
        left: sizes.bgPokeballSize * 0.15
    },
    menuBtn: {
        position: 'absolute',
        top: bgPokeballSize * 0.15,
        right: bgPokeballSize * 0.15
    },
    bgPokeball: {
        opacity: 0.2,
        width: bgPokeballSize,
        height: bgPokeballSize,
        position: 'absolute',
        top: -bgPokeballSize * 0.3,
        right: -bgPokeballSize * 0.3
    }
})
