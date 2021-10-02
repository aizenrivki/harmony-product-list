import * as React from 'react';
import { baseConnect } from '@base/features/base-redux-react-connect';
import { Col, Container, Row } from 'react-bootstrap';
import { TranslateFunction } from 'react-localize-redux';
import { Dispatch } from 'redux';

import { Product, ProductFilter } from 'actions/redux/product/interfaces';
import { ApplicationState } from 'actions/redux';
import ProductActions, { productSelector } from 'actions/redux/product';

import ProductTable from '../ProductTable';
import ProductView from '../ProductView';
import ProductSearchBar from '../ProductSearchBar';

interface Props {
	products: Product[];
	getProductsList: () => void;
	filter: ProductFilter;
	setFilter: (filter: ProductFilter) => void;
	translate: TranslateFunction;
}

interface State {
	selectedProduct: Product | null;
}

class FilterableProductTable extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selectedProduct: null
		};

		this.handleProductSelected = this.handleProductSelected.bind(this);
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
		this.handleIsInStockChange = this.handleIsInStockChange.bind(this);
	}

	componentDidMount() {
		const { getProductsList, products } = this.props;
		if (products.length === 0) {
			getProductsList();
		}
	}

	handleProductSelected(selectedProduct: Product) {
		this.setState({ selectedProduct });
	}

	handleFilterTextChange(filterText: string) {
		const { setFilter, filter } = this.props;
		setFilter({ ...filter, filterText });
	}

	handleIsInStockChange(isInStock: boolean) {
		const { setFilter, filter } = this.props;
		setFilter({ ...filter, isInStock });
	}

	render() {
		const { selectedProduct } = this.state;
		const { filter: { filterText, isInStock }, products, translate } = this.props;
		return (
			<Container>
				<Row>
					<ProductSearchBar
						filterText={filterText}
						onFilterTextChange={this.handleFilterTextChange}
						isInStock={isInStock}
						onIsInStockChange={this.handleIsInStockChange}
					/>
				</Row>
				<Row>
					<Col lg={8}>
						<ProductTable
							products={products}
							translate={translate}
							selectedProductId={selectedProduct ? selectedProduct.id : ''}
							onProductSelected={this.handleProductSelected}
						/>
					</Col>
					<Col>
						{selectedProduct != null && <ProductView translate={translate} product={selectedProduct} />}
					</Col>
				</Row>
			</Container>
		);
	}
}

export default baseConnect(FilterableProductTable,
	(state: ApplicationState) => {
		return {
			products: productSelector.getProductsList(state),
			filter: productSelector.getFilter(state)
		};
	},
	(dispatch: Dispatch) => {
		return {
			getProductsList: () => dispatch(ProductActions.getProducts()),
			setFilter: (filter: ProductFilter) => dispatch(ProductActions.setFilter(filter))
		};
	});

