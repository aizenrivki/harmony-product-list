import { combineReducers, Reducer } from 'redux';

import baseReducers, { BaseApplicationState } from '@base/features/base-reducers';
import { CatalogState } from './catalog/interfaces';
import { CartState } from './cart/interfaces';
import { ProductState } from './product/interfaces';

export interface ApplicationState extends BaseApplicationState {
	cart: CartState;
	catalog: CatalogState;
	product: ProductState;
}

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
	...baseReducers,

	cart: require('./cart').reducer,
	catalog: require('./catalog').reducer,
	product: require('./product').reducer,
});

export default rootReducer;
