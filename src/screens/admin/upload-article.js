// UploadArticle.js
import React from 'react'
import {Button, StyleSheet, Switch, Text, View} from 'react-native'
import TextInput from "react-native-web/dist/exports/TextInput";
import categoryService from '../../services/categories';
import mainStyles from '../main-styles';

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
                const selectedCategories = categories.reduce((acc, cat) => {
                    return {...acc, [cat.id]: false}
                }, {});
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

    componentWillUnmount() {
        this.mounted = false;
    }

    updateTitle(title) {
        this.setState((prevState) => ({...prevState, title: title.trim()}));
    }

    updateUrl(url) {
        this.setState((prevState) => ({...prevState, url: url.trim()}));
    }


    updateSelectedCategories(categoryId, selected) {
        const selectCats = {...this.state.selectedCategories, [categoryId]: selected};
        console.log(`UploadArticle.updateSelectedCategories: selectedCategories ${JSON.stringify(selectCats, null, 2)} `);
        this.setState((prevState) => ({...prevState, selectedCategories: selectCats}));
    }

    onSave() {


    }

    render() {
        const {title, url, selectedCategories} = this.state;
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                    <View style={styles.leftSide}>
                        <Text>Left side of screen.</Text>
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
                <Button title={'Save'} onPress={this.onSave.bind(this)}/>
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
        justifyContent: 'center'
    },
    rightSide: {
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },

});

const styles = StyleSheet.compose(mainStyles, localStyles);
