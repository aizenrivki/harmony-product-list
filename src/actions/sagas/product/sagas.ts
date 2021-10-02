import { put } from 'redux-saga/effects';
import ProductActions from 'actions/redux/product';
import { CreateProductAction, Product, UpdateProductAction } from 'actions/redux/product/interfaces';
import data from './products.json';
import { sortBy } from 'lodash';
import { Guid } from 'guid-typescript';

export function* productsSaga() {
	yield put(ProductActions.loadProduct());
	const products: Product[] = sortBy(data, ['category']);
	yield put(ProductActions.setProducts(products));
}

export function* createProductSaga({ product }: CreateProductAction) {
	yield put(ProductActions.loadProduct());
	const newProduct: Product = { ...product, id: Guid.raw() };
	yield put(ProductActions.setProduct(newProduct));
}

export function* updateProductSaga({ product }: UpdateProductAction) {
	yield put(ProductActions.loadProduct());
	yield put(ProductActions.setProduct(product));
}
