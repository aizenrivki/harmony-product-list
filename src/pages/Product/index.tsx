import * as React from 'react';
import { baseConnect } from '@base/features/base-redux-react-connect';
import { TranslateFunction } from 'react-localize-redux';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { ApplicationState } from 'actions/redux';
import ProductActions, { productSelector } from 'actions/redux/product';
import { Dispatch } from 'redux';
import { Product } from 'actions/redux/product/interfaces';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import moment from 'moment';

interface OwnProps {
	productId: string;
	success: boolean;
	initialValues: Product;
	translate: TranslateFunction;
	createProduct: (product: Product) => void;
	updateProduct: (Product: Product) => void;
}

interface Params {
	id?: string;
}

type Props = RouteComponentProps<Params> & OwnProps & InjectedFormProps<Product>;
const required = (value: any) => (value || typeof value === 'number' ? undefined : 'Required');
const maxLength = (value: any) => (value && value.length > 15 ? `Must be ${15} characters or less` : undefined);
const alphaNumeric = (value: any) => (value && /[^a-zA-Z0-9 ]/i.test(value)
	? 'Only alphanumeric characters'
	: undefined);
const formatDate = (value: string): string => (value ? moment(value).format('YYYY-MM-DD') : '');
const normalizeDate = (value: string): string | null => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null);
const formatCurrency = (value: string): string => (value ? parseFloat(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '');
const parseNumber = (value: string): number => parseFloat(value.replace(/[^0-9-.]/g, ''));

class ProductPage extends React.Component<Props> {
	isNew: boolean;
	submitted: boolean;
	constructor(props: Props) {
		super(props);

		const { initialValues } = this.props;
		this.isNew = !initialValues;

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	renderFiled({
		input,
		label,
		type,
		meta: { touched, error, warning },
	}: any) {
		return (
			<div>
				<label className="form-label">{label}</label>
				<div>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<input className="form-control" {...input} placeholder={label} type={type} />
					{touched
						&& ((error && <span>{error}</span>)
							|| (warning && <span>{warning}</span>))}
				</div>
			</div>
		);
	}

	handleSubmit(product: Product) {
		const { createProduct, updateProduct } = this.props;
		// const { product } = this.state;
		if (this.isNew) {
			createProduct(product);
		} else {
			updateProduct(product);
		}
		this.submitted = true;
	}
	render() {
		const categories = ['food', 'sport', 'electronic'];
		const {
			productId, translate, success, handleSubmit
		} = this.props;
		if (this.submitted && success) {
			return <Redirect push to="/" />;
		}

		return (
			<Container>
				<Row className="justify-content-md-center">
					<form onSubmit={handleSubmit(this.handleSubmit)}>
						<Row>
							<label className="form-label col-sm-2">{translate('products.id')}:</label>
							{productId}
						</Row>
						<Row>
							<Field
								label={translate('products.name')}
								component={this.renderFiled}
								type="text"
								name="name"
								validate={[required, maxLength]}
								warn={alphaNumeric}
							/>
						</Row>
						<Row>
							<label className="form-label">{translate('products.category')}:</label>
							<Field
								component="select"
								name="category"
								validate={[required]}
							>
								<option> </option>
								{categories.map(
									(category) => (<option key={category} value={category}>{category}</option>)
								)}
							</Field>
						</Row>
						<Row>
							<Field
								label={translate('products.description')}
								component={this.renderFiled}
								type="textarea"
								name="description"
								validate={[required]}
							/>
						</Row>
						<Row>
							<Field
								label={translate('products.registered')}
								component={this.renderFiled}
								format={formatDate}
								normalize={normalizeDate}
								type="date"
								name="registered"
							/>
						</Row>
						<Row>
							<Field
								label={translate('products.price')}
								component={this.renderFiled}
								format={formatCurrency}
								normalize={parseNumber}
								type="text"
								name="price"
							/>
						</Row>
						<Row>
							<Field
								label={translate('products.isInStock')}
								type="checkbox"
								name="isInStock"
								component={this.renderFiled}
							/>
							{/* <label> {translate('products.isInStock')}</label> */}
						</Row>
						<Row>
							<button type="submit" className="btn btn-primary">
								{this.isNew ? translate('products.createProduct') : translate('products.updateProduct')}
							</button>
						</Row>
					</form>
				</Row>
			</Container>
		);
	}
}
const ReduxFormComponent = reduxForm({
	form: 'product',
	enableReinitialize: true
})(ProductPage);

export default baseConnect(ReduxFormComponent,
	(state: ApplicationState, ownProps: RouteComponentProps<Params>) => {
		const productId = ownProps.match.params.id || '0';
		return {
			productId,
			initialValues: productSelector.getProduct(state, productId),
			success: productSelector.getSuccess(state)
		};
	},
	(dispatch: Dispatch) => {
		return {
			createProduct: (product: Product) => dispatch(ProductActions.createProduct(product)),
			updateProduct: (product: Product) => dispatch(ProductActions.updateProduct(product)),
		};
	});
