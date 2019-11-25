// FacebookView.js
import React from 'react'
import HTML from "react-native-render-html";
import WebView from "react-native-webview";
import {View} from "react-native";


class FacebookView extends React.Component {
	render() {
		return <View style={{flex: 1}}>
			<HTML debug={true} uri={'http://github.com/facebook/react-native'}/>

			<WebView
				style={{width: 320, height: 600}}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				startInLoadingState={false}
				onLoadEnd={() => {
					console.log("load ended")
				}}
				onLoadStart={() => {
					console.log("load start")
				}}
				automaticallyAdjustContentInsets={false}

				source={{uri: 'facebook/react-native', baseUrl: 'http://github.com'}}
			/>
		</View>
//		return <HTML uri={'http://www.facebook.com/LeeCollinsChicago'}></HTML>
	}

}

export default FacebookView;
