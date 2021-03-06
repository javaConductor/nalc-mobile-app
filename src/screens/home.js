// Home.js
import React from 'react'
import {Dimensions, Image, Linking, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {createAppContainer, NavigationEvents} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import systemCheck from "../services/system-check";
import auth from '../services/auth';
import Styles from '../screens/main-styles';
import ShowPost from '../screens/news/show-post';
import storage from "../services/storage";
import util from "../services/util";
import {Grid, Row} from "react-native-easy-grid";
import {SocialIcon} from 'react-native-elements'
import MenuButton from "../components/menu/menu-button";
import Config from '../../src/config';
import smugMugLogo from '../../assets/Smugmug-Icon_33997.png';
//import smugMugLogo from '../../assets/309_Smugmug-512.png';

const logo = require('../../assets/gldLogo72.png');

class Home extends React.Component {
	static navigationOptions = {
		//title: 'Home',
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
			isAuthenticated: false,
			dims: Dimensions.get('screen'),
			isLoading: true
		};
		this._isMounted = false;
	}

	async componentDidMount() {
		this._isMounted = true;
		//console.log("Home.componentDidMount");

		try {
			//console.log(`Home.componentDidMount: dim.screen ${JSON.stringify(Dimensions.get('screen'), null, 2)}  dim.window ${JSON.stringify(Dimensions.get('window'))}`);
			await systemCheck.check();
			//console.log('Home.componentDidMount: check OK');
		} catch (e) {
			console.error(`Home.componentDidMount: check FAILED!!! ${util.errorMessage(e)}`);
			throw e;
		}

		try {
			const isAuthenticated = await auth.isUserAuthenticated();
			//console.log(`Home.componentDidMount: setting isAuthenticated: ${isAuthenticated}`);
			const origPosts = await storage.getNewsPosts();
			//console.log(`Home.componentDidMount: origPosts: ${JSON.stringify(origPosts, null, 2)}`);
			//const posts = origPosts.reverse();// move the latest to the front
			const lastPost = origPosts.length > 0 ? origPosts[0] : null;
			const nextToLastPost = origPosts.length > 1 ? origPosts[1] : null;
			const nextToNextToLastPost = origPosts.length > 2 ? origPosts[2] : null;

			console.log(`Home.componentDidMount: lastPosts: ${JSON.stringify(lastPost, null, 2)} \nand ${JSON.stringify(nextToLastPost, null, 2)}`);

			if (this._isMounted)
				this.setState((prevState) => {
					return {
						...prevState,
						isAuthenticated,
						dims: Dimensions.get('screen'),
						isLoading: false,
						lastPost,
						nextToLastPost,
						nextToNextToLastPost
					}
				});

		} catch (e) {
			console.error(`Home.componentDidMount: ERROR: ${util.errorMessage(e)}`);
			throw e;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	gotoFacebook() {
		Linking.openURL(Config.SOCIAL_FACEBOOK);
	}

	gotoTwitter() {
		Linking.openURL(Config.SOCIAL_TWITTER);
	}

	gotoInstagram() {
		Linking.openURL(Config.SOCIAL_INSTAGRAM);
	}

	gotoSmugMug() {
		Linking.openURL(Config.SOCIAL_SMUGMUG);
	}

	gotoYouTube() {
		// Linking.openURL('https://www.youtube.com/channel/UCKZJ1C15xMWWxLGIRRfCDIw');
		Linking.openURL(Config.SOCIAL_YOUTUBE);

	}

	render() {

		if (this.state.isLoading)
			return null;
		const {navigate} = this.props.navigation;
		//console.log(`Home.render(): userIsAuthenticated: ${this.state.isAuthenticated}`);
		const {lastPost, nextToLastPost, nextToNextToLastPost} = this.state;
		return (<View style={Styles.container}>
				<MenuButton navigation={this.props.navigation}/>
				<NavigationEvents
					onWillFocus={this.componentDidMount.bind(this)}
					onDidFocus={this.componentDidMount.bind(this)}
				/>
				<Grid>
					<Row size={5}>
						<View style={{...Styles.logoContainer,}}>
							<View style={{alignContent: 'center', width: '100%'}}>
								<Text style={Styles.screenTitle}>Latest News</Text>
							</View>
							<ScrollView style={{paddingLeft: 10, paddingRight: 10}}>
								{lastPost ? <ShowPost post={lastPost}/> : null}
								{nextToLastPost ? <ShowPost post={nextToLastPost}/> : null}
								{nextToNextToLastPost ? <ShowPost post={nextToNextToLastPost}/> : null}
							</ScrollView>
						</View>
					</Row>
					<Row size={1}>
						<Text
							style={[Styles.homeLabel, {marginTop: 5}]}
							onPress={() => {
								navigate('News', {})
							}}>
							M o r e N e w s >>
						</Text>
					</Row>
					<Row size={1}>
						<Text style={Styles.homeLabel}>NALC on Social Media</Text>
					</Row>
					<Row size={1}>
						<View
							style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between'}}>
							<SocialIcon
								title='NALC on Facebook'
								type='facebook'
								onPress={this.gotoFacebook}
							/>

							<SocialIcon
								title='NALC on Twitter'
								onPress={this.gotoTwitter}
								type='twitter'
							/>

							<SocialIcon
								title='NALC on Instagram'
								onPress={this.gotoInstagram}
								type='instagram'
							/>

							<SocialIcon
								title='NALC on YouTube'
								onPress={this.gotoYouTube}
								type='youtube'
							/>

							<TouchableOpacity
								onPress={this.gotoSmugMug}
								style={{top: 5,}}>
								<Image resizeMode={'contain'}
								       source={smugMugLogo}
								       style={{width: 55, height: 55,}}/>
							</TouchableOpacity>

						</View>
					</Row>
				</Grid>
			</View>
		);
	}
}

const AppNavigator = createStackNavigator({
	Home: {
		screen: Home,
	},
});

export default createAppContainer(AppNavigator);

