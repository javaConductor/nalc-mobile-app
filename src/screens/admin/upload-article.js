// UploadArticle.js
import React from 'react'
import {Button, StyleSheet, Switch, Text, View} from 'react-native'
import TextInput from "react-native-web/dist/exports/TextInput";
import categoryService from '../../services/categories';
import mainStyles from '../main-styles';
import newsService from '../../services/news';


export default class UploadArticle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: undefined,
            url: undefined,
            selectedCategories: {},//{categoryId: true/false}
            categories: []// name, id
        }
    }

    async componentDidMount() {
        this.mounted = true;
        return categoryService.getCategories()
            .then((categories) => {
                const selectedCategories = this.createSelectedCategories(categories);
                if (this.mounted)
                    this.setState((prevState) => {
                        return {...prevState, categories}
                    });
            })
            .catch((error) => {
                console.log(`UploadArticle.componentDidMount: ERROR: ${error}`);
                throw error;
            });
    }

    createSelectedCategories(categories) {
        return categories.reduce((acc, cat) => {
            return {...acc, [cat.id]: false}
        }, {});
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    updateTitle(title) {
        this.setState((prevState) => ({...prevState, title: title}));
    }

    updateUrl(url) {
        this.setState((prevState) => ({...prevState, url: url.trim()}));
    }

    updateSelectedCategories(categoryId, selected) {
        const selectCats = {...this.state.selectedCategories, [categoryId]: selected};
        console.log(`UploadArticle.updateSelectedCategories: selectedCategories ${JSON.stringify(selectCats, null, 2)} `);
        this.setState((prevState) => ({...prevState, selectedCategories: selectCats}));
    }

    selectedIdList(selectedCategories) {
        const keys = Object.keys(selectedCategories);
        console.log(`selectedIdList: keys: ${JSON.stringify(keys, null, 2)}`);
        console.log(`selectedIdList: selected: ${JSON.stringify(selectedCategories, null, 2)}`);

        /// keys are category ids
        return keys.filter((categorySelection) => selectedCategories[categorySelection]);
    }

    async onSave() {
        const {navigate} = this.props.navigation;
        const {content, url, title} = this.state;
        const categories = this.selectedIdList(this.state.selectedCategories);
        const contentLink = `<a target='_blank' href='${url}'> Link...</a>`;
        try {
            const response = await newsService.addNewsPost({content: contentLink, title, categories});
            const selectedCategories = this.createSelectedCategories(this.state.categories);
            this.setState((prevState) => ({
                ...prevState,
                message: `Article '${title}' uploaded`,
                url: null,
                content: null,
                title: null,
                selectedCategories
            }));
        } catch (e) {
            this.setState((prevState) => ({...prevState, message: `Error uploading article: ${e}`}));
        }
    }

    render() {
        const {title, url, selectedCategories} = this.state;
        const selected = this.selectedIdList(selectedCategories);
        const canSave = title && title.trim().length > 0 && selected.length > 0;
        const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : null;
        return (
            <View style={{flex: 1}}>
                {msgCtrl}
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                    <View style={styles.leftSide}>
                        <View style={styles.formRow}>
                            <View style={styles.formLabel}>
                                <Text>Title</Text>
                            </View>
                            <View style={styles.formInput}>
                                <Text style={styles.formInput}>
                                    <TextInput
                                        value={title}
                                        onChangeText={this.updateTitle.bind(this)}/>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.formLabel}>
                                <Text>URL</Text>
                            </View>
                            <View style={styles.formInput}>
                                <Text style={styles.formInput}>
                                    <TextInput
                                        value={url}
                                        onChangeText={this.updateUrl.bind(this)}/>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rightSide}>
                        {this.renderCategoryChoices()}
                    </View>
                </View>
                <Button disabled={!canSave} title={'Save'} onPress={this.onSave.bind(this)}/>
            </View>
        )
    }

    renderCategoryChoices() {
        const selectedCategories = this.state.selectedCategories;
        return this.state.categories.map((cat) => {
            const inCategory = selectedCategories[cat.id];
            return this.renderRow(cat, inCategory);
        });
    }

    renderRow(category, inCategory) {
        const updateSelectedCategories = this.updateSelectedCategories.bind(this);
        return (
            <View key={category.slug} style={styles.formRow}>
                <View style={styles.leftSide}>
                    <Text>{category.name}</Text>
                </View>
                <View style={styles.rightSide}>
                    <Switch
                        onValueChange={(isInCategory) => {
                            updateSelectedCategories(category.id, isInCategory)
                        }}
                        value={inCategory}
                    />
                </View>
            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    leftSide: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        width: '50%'
    },
    rightSide: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        width: '50%'
    },

});

const styles = StyleSheet.compose(mainStyles, localStyles);
