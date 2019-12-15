// Home.js
import React from 'react'
import {Dimensions, Linking, Text, View} from 'react-native';
import {createAppContainer, NavigationEvents} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import systemCheck from "../services/system-check";
import auth from '../services/auth';
import Styles from '../screens/main-styles';
import ShowPost from '../screens/news/show-post';
import storage from "../services/storage";
import util from "../services/util";
import {Col, Grid} from "react-native-easy-grid";
import {SocialIcon} from 'react-native-elements'


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
			console.log(`Home.componentDidMount: lastPosts: ${JSON.stringify(lastPost, null, 2)} \nand ${JSON.stringify(nextToLastPost, null, 2)}`);

			if (this._isMounted)
				this.setState((prevState) => {
					return {
						...prevState,
						isAuthenticated,
						dims: Dimensions.get('screen'),
						isLoading: false,
						lastPost,
						nextToLastPost
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
		Linking.openURL('https://www.facebook.com/nalc.national/');
	}

	gotoTwitter() {
		Linking.openURL('https://twitter.com/NALC_National?lang=en');
	}

	gotoInstagram() {
		Linking.openURL('https://www.instagram.com/lettercarriers/');
	}

	gotoFlickr() {
		Linking.openURL('https://www.flickr.com/photos/nalc-usa/');
	}

	gotoYouTube() {
		Linking.openURL('https://www.youtube.com/channel/UCKZJ1C15xMWWxLGIRRfCDIw');
	}

	render() {

		if (this.state.isLoading)
			return null;
		const {navigate} = this.props.navigation;
		//console.log(`Home.render: userIsAuthenticated: ${this.state.isAuthenticated}`);
		const {lastPost, nextToLastPost} = this.state;
		return (<View style={Styles.container}>
				<NavigationEvents
					onWillFocus={this.componentDidMount.bind(this)}
					onDidFocus={this.componentDidMount.bind(this)}
				/>
				<Grid>

					<Col size={10}>
						<View style={{...Styles.logoContainer, zIndex: 0,}}>
							<Text style={Styles.homeLabel}> Latest News </Text>
							{lastPost ? <ShowPost post={lastPost}/> : null}
							{nextToLastPost ? <ShowPost post={nextToLastPost}/> : null}
						</View>
						<Text style={Styles.homeLabel} onPress={() => {
							navigate('News', {})
						}}>M o r e N e w s >></Text>
						<Text style={Styles.homeLabel}>NALC on Social Media</Text>
						<View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between'}}>
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
								title='NALC on Flickr'
								onPress={this.gotoFlickr}
								type='flickr'
							/>
							<SocialIcon
								title='NALC on YouTube'
								onPress={this.gotoYouTube}
								type='youtube'
							/>
						</View>

					</Col>

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

