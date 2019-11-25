import React, {Component, Fragment} from 'react'
import {NavigationEvents, withNavigation} from 'react-navigation';
import auth from '../services/auth';
import './menu-content.css';
import {Linking, View} from "react-native";
import {SocialIcon} from 'react-native-elements'


class MenuContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuthenticated: false,
			closeMenu: this.props.closeCallback
		};
		this._isMounted = false;
		this.renderAdminOptions = this.renderAdminOptions.bind(this);
		const {navigate} = this.props.navigation;
		this.state.navigate = navigate;
	}

	closeAndNavigate(screenName) {
		this.state.closeMenu();
		this.state.navigate(screenName, {});
	}

	componentWillUnmount() {
		this._isMounted = false;

	}

	async componentDidMount() {
		this._isMounted = true;
		const isAuthenticated = await auth.isUserAuthenticated();
		const canManage = await auth.currentUserCanManageAdmins();
		if (this._isMounted) {
			this.setState((prevState) => {
				return {...prevState, isAuthenticated, canManage}
			});
		}
	}

	renderAdminOptions() {
		//const {navigate} = this.state;
		if (!this.state.isAuthenticated)
			return <div className="menu-item" key={'Admin'}>
				<a onClick={() => {
					this.closeAndNavigate('Admin')
				}}>
					Admin
				</a>
			</div>;

		const manageAdminsComponent = (this.state.canManage) ? <div className="menu-item" key={'ManageAdmins'}>
			<a onClick={() => {
				this.closeAndNavigate('ManageAdmins')
			}}>
				Manage Administrators
			</a>
		</div> : null;

		console.log(`MenuContent.render: canManage: ${this.state.canManage}`);
		return <Fragment>
			<div className="menu-item" key={'News'}>
				<hr/>
			</div>
			{manageAdminsComponent}
			<div className="menu-item" key={'ManageCategories'}>
				<a onClick={() => this.closeAndNavigate('ManageCategories')}>
					Manage Categories
				</a>
			</div>
			<div className="menu-item" key={'UploadArticle'}>
				<a onClick={() => this.closeAndNavigate('UploadArticle')}>
					Upload Article
				</a>
			</div>
			<div className="menu-item" key={'ChangePassword'}>
				<a onClick={() => this.closeAndNavigate('ChangePassword')}>
					Change Password
				</a>
			</div>
			<div className={'menu-item'}>
				<a onClick={() => this.closeAndNavigate('Tester')}>
					Tester
				</a>
			</div>
		</Fragment>
	}

	onLogOff() {
		auth.logoff();
		this.setState((prevState) => {
			return {...prevState, isAuthenticated: false}
		})
	}

	render() {
		const {navigate} = this.state;
		const logoffComponent = this.state.isAuthenticated
			? <div className="menu-item" key={'Logoff'}>
				{/*<Button title={'Sign Out'} onPress={this.onLogOff.bind(this)}/>*/}
				<a onClick={this.onLogOff.bind(this)}>
					Sign Out
				</a>
			</div>
			: null;
		return (
			<View>
				<div className="menu">
					<NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>

					<div className="menu-item" key={'ManageInterests'} z-index="2">
						<a onClick={() => this.closeAndNavigate('ManageInterests')}>
							Manage Interests
						</a>
					</div>
					<div className="menu-item" key={'News'}>
						<a onClick={() => this.closeAndNavigate('PostList')}>
							News
						</a>
					</div>


					{this.renderSocialMediaOptions()}
					{this.renderAdminOptions()}
					{logoffComponent}
				</div>
			</View>

		)
	}

	renderSocialMediaOptions() {

		return <Fragment>
			<div className="menu-item" key={'Facebook'}>
				<a onClick={this.gotoFacebook}>
					<SocialIcon
						title='NALC on Facebook'
						button
						type='facebook'
					/>
				</a>
			</div>

			<div className="menu-item" key={'Twitter'}>
				<a onClick={this.gotoTwitter}>
					<SocialIcon
						title='NALC on Twitter'
						button
						type='twitter'
					/>
				</a>
			</div>

			<div className="menu-item" key={'Instagram'}>
				<a onClick={this.gotoInstagram}>
					<SocialIcon
						title='NALC on Instagram'
						button
						type='instagram'
					/>
				</a>
			</div>

			<div className="menu-item" key={'Flickr'}>
				<a onClick={this.gotoFlickr}>
					<SocialIcon
						title='NALC on Flickr'
						button
						type='flickr'
					/>
				</a>
			</div>

			<div className="menu-item" key={'youtube'}>
				<a onClick={this.gotoYouTube}>
					<SocialIcon
						title='NALC on YouTube'
						button
						type='youtube'
					/>
				</a>
			</div>

		</Fragment>
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
}

export default withNavigation(MenuContent);
