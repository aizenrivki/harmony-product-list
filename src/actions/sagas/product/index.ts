import {
	all, fork, takeEvery, takeLatest
} from 'redux-saga/effects';
import * as Sagas from './sagas';
import { ProductTypes } from 'actions/redux/product';

function* watchProductsSaga() {
	yield takeLatest(ProductTypes.GET_PRODUCTS, Sagas.productsSaga);
}

function* watchUpdateProductSaga() {
	yield takeEvery(ProductTypes.UPDATE_PRODUCT, Sagas.updateProductSaga);
}

function* watchCreateProductSaga() {
	yield takeEvery(ProductTypes.CREATE_PRODUCT, Sagas.createProductSaga);
}

function* productSaga() {
	yield all([
		fork(watchProductsSaga),
		fork(watchCreateProductSaga),
		fork(watchUpdateProductSaga)
	]);
}

export default productSaga;

