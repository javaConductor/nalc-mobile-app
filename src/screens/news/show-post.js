// ShowPost.js
import React from 'react';
import {ActivityIndicator, Linking, Text, TouchableOpacity, View} from 'react-native'
import HTML from 'react-native-render-html';
import styles from '../../screens/main-styles';
import utils from "../../services/util";
import moment from "moment";


const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

//import {Document, Page, pdfjs} from 'react-pdf';
//import 'react-pdf/dist/Page/AnnotationLayer.css';
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ShowPost extends React.Component {

	constructor(props) {
		super(props);
		if (!props.post) {
			throw {errorMessage: 'ShowPost: Error "post" prop not set or null.'}
		}
		this.state = {
			post: props.post,
			loading: true
		};
	}

	async componentDidMount() {
		await utils.loadFonts();

		const pdfURL = null;//this.findPdfName(this.state.post.content);

		console.log(`${pdfURL ? '' : 'NO '}PDF in ${this.state.post.content}`)
		this.setState((prevState) => {
			return {...prevState, loading: false, pdfURL, pdfPageNumber: 1}
		})
	}

	findPdfName = (content) => {
		const htmlparser2 = require('htmlparser2');
		const decoded = decodeURI(content);
		let pdfURL = null;
		const parser = new htmlparser2.Parser({
				onopentag(name, attribs) {
					if (name === "a" && attribs.href.endsWith('pdf')) {
						pdfURL = attribs.href;
						console.log(`findPdfName: PDF:[${attribs.href}]`);
					}
				},
			},
			{decodeEntities: true}
		);

		parser.write(decoded);
		parser.end();
		return pdfURL;
	};

	render() {
		const {post, pdfURL, pdfPageNumber, loading} = this.state;

		if (loading)
			return <ActivityIndicator size={'large'}/>;

		console.log(`ShowPost: post: ${post.title} link: [${post.link}]`);
		const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
		//const dateStr = new Date(post.date).toLocaleString("en-US", options);

		const dateStr = moment(post.date.valueOf()).format('LL');
		return <View style={[styles.post, {alignItems: 'flex-start', backgroundColor: '#e0eaf6'}]}
		             key={post.id}>
			<Text>{dateStr}</Text>
			<Text style={{...styles.postTitle, fontSize: 20, fontFamily: 'OswaldHeavy-Regular'}}>
				{entities.decode(post.title)}
			</Text>
			<View style={[styles.postContent, {
				backgroundColor: '#e0eaf6',
				alignContent: 'center',
				flexDirection: 'column'
			}]}>
				<HTML html={post.content} onLinkPress={(evt, href) => {
					Linking.openURL(href);
				}}/>
				<TouchableOpacity
					style={{}}
					onPress={() => {
						Linking.openURL(post.link);
					}}
				>
					<Text
						style={{fontFamily: 'Oswald-Regular', color: 'navy'}}
					>View in browser...</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					width: '100%',
					borderBottomColor: '#ccc',
					borderBottomWidth: 3,
				}}
			/>
		</View>
	}

}

export default ShowPost;
