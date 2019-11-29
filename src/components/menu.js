// Home.js
import React from 'react';
import {View} from 'react-native';
import {withNavigation} from 'react-navigation';
import auth from '../services/auth';
import CheeseburgerMenu from 'cheeseburger-menu';
import HamburgerMenu from 'react-hamburger-menu';
import MenuContent from '../components/menu-content';
import util from "../services/util";


class Menu extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			menuOpen: false,
			isAuthenticated: false
		};
	}

	closeMenu() {
		this.setState({menuOpen: false})
	}

	toggleMenu() {
		const open = !this.state.menuOpen;
		this.setState({menuOpen: open})
	}

	async componentDidMount() {
		this._isMounted = true;
		try {
			const isAuthenticated = await auth.isUserAuthenticated();
			//console.log(`Menu.componentDidMount: setting isAuthenticated: ${isAuthenticated}`);
			if (this._isMounted)
				this.setState((prevState) => {
					return {...prevState, isAuthenticated}
				});
		} catch (e) {
			console.error(`Menu.componentDidMount: FAILED authentication check: ${util.errorMessage(e)}`);
			throw e;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onLogOff() {
		auth.logoff();
		this.setState((prevState) => {
			return {...prevState, isAuthenticated: false}
		})
	}

	render() {
		const {navigate} = this.props.navigation;
		//console.log(`Menu.render: userIsAuthenticated: ${this.state.isAuthenticated}`);

		return (
			<View style={{alignSelf: 'flex-start', marginRight: 30, height: '500', flexGrow: 1, zIndex: 2}}>

				<HamburgerMenu
					isOpen={this.state.menuOpen}
					menuClicked={this.toggleMenu.bind(this)}
					width={32}
					height={24}
					strokeWidth={3}
					rotate={0}
					color='navy'
					borderRadius={0}
					animationDuration={0.5}
				/>
				<CheeseburgerMenu
					isOpen={this.state.menuOpen}
					closeCallback={this.closeMenu.bind(this)}>
					<MenuContent closeCallback={this.closeMenu.bind(this)}/>
				</CheeseburgerMenu>

			</View>
		);
	}
}

const MenuWithNav = withNavigation(Menu);

export default MenuWithNav;

