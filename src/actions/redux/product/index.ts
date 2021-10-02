import Immutable, { ImmutableObject, from } from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import { ApplicationState } from '../index';
import {
	ProductState, TypesNames, ActionCreator, SetProductsAction, SetFilterProductAction, Product, SetProductAction
} from './interfaces';
import { AnyAction } from 'redux';
import {
	sortBy, includes, isEmpty, keyBy, values
} from 'lodash';
import { persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import { createSelector } from 'reselect';

/* ------------- Types and Action Creators ------------- */

const { Creators } = createActions<TypesNames, ActionCreator>({
	getProducts: [],
	setProducts: ['products'],
	setFilter: ['filter'],
	createProduct: ['product'],
	updateProduct: ['product'],
	setProduct: ['product'],
	loadProduct: [],
});

export const ProductTypes = TypesNames;
export default Creators;

/* ------------- Initial State ------------- */

const INITIAL_STATE = Immutable<ProductState>({
	products: {},
	filter: {
		isInStock: true,
		filterText: ''
	},
	loading: false,
	success: false,
	error: false,
});

/* ------------- Selectors ------------- */

const getProducts = (state: ApplicationState) => Object.values(state.product.products);
const getFilter = (state: ApplicationState) => state.product.filter;
const getIsInStock = (state: ApplicationState) => state.product.filter.isInStock;
const getFilterText = (state: ApplicationState) => state.product.filter.filterText;

const getProductsList = (products: Product[], isInStock: boolean, filterText: string) => {
	return products.filter((product: Product) => {
		if (!isProductContainsText(product, filterText)) return false;
		if (isInStock && !product.isInStock) return false;
		return true;
	});
};

const isProductContainsText = (product: Product, search: string) => {
	if (isEmpty(search)) return true;
	if (includes(product.name, search)) return true;
	if (includes(product.price, search)) return true;
	return false;
};

const getProductsSelector = createSelector(
	[getProducts, getIsInStock, getFilterText],
	getProductsList
);

export const productSelector = {
	getProductsList: getProductsSelector,
	getFilter,
	getProduct: (state: ApplicationState, id: string) => {
		return state.product.products[id];
	},
	getSuccess: (state: ApplicationState) => state.product.success,
	getError: (state: ApplicationState) => state.product.error,
};

/* ------------- Reducers ------------- */

const setProductsReducer = (state: ProductState, action: SetProductsAction) => {
	const { products } = action;
	return from(state).merge({
		products: keyBy(products, 'id'), loading: false, success: true, error: false
	});
};

const setFilterProductReducer = (state: ProductState, action: SetFilterProductAction) => {
	const { filter } = action;
	return from(state).merge({ filter });
};

const setProductReducer = (state: ProductState, action: SetProductAction) => {
	const { product } = action;
	const { products } = state;
	if (products[product.id]) {
		return from(state).merge({
			products: {
				...products,
				[product.id]: { ...product }
			},
			loading: false,
			success: true,
			error: false
		});
	}
	const newProducts = sortBy([...values(products), product], ['category']);
	return from(state).merge({
		products: keyBy(newProducts, 'id'), loading: false, success: true, error: false
	});
};

const setErrorReducer = (state: ProductState) => {
	return from(state).merge({ loading: false, success: false, error: true });
};

const setLoadReducer = (state: ProductState) => {
	return from(state).merge({ loading: true, success: false, error: false });
};

/* ------------- Hookup Reducers To Types ------------- */
const productReducer = createReducer<any, AnyAction>(INITIAL_STATE, {
	[ProductTypes.SET_PRODUCTS]: setProductsReducer,
	[ProductTypes.SET_FILTER]: setFilterProductReducer,
	[ProductTypes.SET_PRODUCT]: setProductReducer,
	[ProductTypes.PRODUCT_ERROR]: setErrorReducer,
	[ProductTypes.LOAD_PRODUCT]: setLoadReducer,
});

const localPersistConfig = {
	storage: localStorage,
	key: 'ProductlocalPersistData',
	version: 1
};

const sessionPersistConfig = {
	storage: sessionStorage,
	key: 'ProductsessionPersistData',
	version: 2,
};
export const reducer = persistReducer(localPersistConfig, productReducer);

