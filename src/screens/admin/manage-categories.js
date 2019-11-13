// ManageCategories.js
import React from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import categoryService from '../../services/categories';

export default class ManageCategories extends React.Component {

    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Manage Categories'
                },
            }
        };
    }

    async componentWillMount() {
        this.setState((prevState) => { return {...prevState, isLoading:true} });
        const  categories = await categoryService.getCategories();
        console.log(`EditCategory.componentWillMount: categories: (${JSON.stringify(categories)})`);

        this.setState((prevState) => { return {...prevState, isLoading:false, categories} });
    }

    render() {
        if( this.state.isLoading)
            return null;
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>

                <Text>Manage Categories</Text>
                <Button onPress={() => navigate('EditCategory', {})} title={"Add New Category"} />
                {this.state.categories.map(this.renderRow.bind(this)) }


            </View>
        )
    }

    onRemove(categoryId){

    }

    renderRow(category) {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.row} key={category.id} >
                <Button title={category.name} onPress={() => navigate('EditCategory', {category})} />
                <Button title={category.slug} onPress={() => navigate('EditCategory', {category})} />

            </View>
        )

    }
        addNewCategory() {




    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});