// App.js
import React from 'react';
import {createAppContainer} from "react-navigation";
import {createMainNavigator} from "./src/components/menu/main-nav";


const AppContainer = createAppContainer(createMainNavigator());

const App = () => (
	<AppContainer/>
);

export default App;
