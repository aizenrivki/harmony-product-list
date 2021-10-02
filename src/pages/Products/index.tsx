import * as React from 'react';
import { baseConnect } from '@base/features/base-redux-react-connect';
import FilterableProductTable from 'containers/products/FilterableProductTable';
import { Container } from 'react-bootstrap';
import { TranslateFunction } from 'react-localize-redux';

interface Props {
	translate: TranslateFunction;
}

class Products extends React.Component<Props> {
	render() {
		return (
			<Container>
				<h1>product list</h1>
				<FilterableProductTable />
			</Container>
		);
	}
}

export default baseConnect(Products, () => { return {}; }, () => { return {}; });
