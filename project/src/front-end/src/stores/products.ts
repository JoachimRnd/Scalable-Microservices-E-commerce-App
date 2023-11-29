import { derived, writable } from 'svelte/store';
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { addToast } from '@stores/toasts';
import Product from '@interfaces/products/Product.svelte';

const PRODUCT_URL = `${env.PUBLIC_AUTH_SERVICE_URL}/products`;

function createProducts() {
	const { subscribe, set, update } = writable([]);

	const handleError = (error: any, message: string) => {
		console.error(`${message}:`, error);
		addToast({
			message: `Failed to ${message.toLowerCase()}`,
			type: 'error',
			dismissible: true,
			timeout: 3000,
		});
	};

	const getProducts = async () => {
		try {
			const response = await axios.get(PRODUCT_URL);
			const data = response.data.data;
			const categorizedProducts = categorizeProducts(data);
			set(categorizedProducts);
			return categorizedProducts;
		} catch (error) {
			handleError(error, 'get products');
		}
	};

	const categorizeProducts = (products: any[]): any => {
		const categorizedProducts: any = {};

		for (const product of products) {
			if (!categorizedProducts[product.category]) {
				categorizedProducts[product.category] = [];
			}

			categorizedProducts[product.category].push(product);
		}

		return categorizedProducts;
	};

	const addProductsLocal = (products: any, newProduct: any) => {
		// Add the product in the local list
		const { category } = newProduct;

		if (!products[category]) {
			products[category] = [];
		}

		products[category].push(newProduct);

		return products;
	};

	const __addProduct = async (product: Product) => {
		try {
			const localUser = window.localStorage.getItem('auth');
			if (!localUser) {
				throw new Error('No user found');
			}
			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const bodyParameters = {
				product: {
					name: product.name,
					price: product.price,
					image: product.image,
					category: product.category,
				}
			};

			const response = await axios.post(PRODUCT_URL, bodyParameters, config);
			const finalProduct = response.data.message.product;

			update((oldProducts) => {
				return addProductsLocal(oldProducts, finalProduct);
			});
		} catch (error) {
			handleError(error, 'Add Product');
		}
	};

	const updateProductLocal = (products: any, updatedProduct: any) => {
		const { category } = updatedProduct;

		// Find the product in the local list
		const index = products[category].findIndex(
			(product: any) => product._id === updatedProduct._id
		);

		// Update the product in the local list
		products[category][index] = updatedProduct;

		return products;
	}

	const __updateProducts = async (product: Product) => {
		try {
			const localUser = window.localStorage.getItem('auth');
			if (!localUser) {
				throw new Error('No user found');
			}
			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const bodyParameters = {
				product: {
					_id : product._id,
					_rev: product._rev,
					name: product.name,
					price: product.price,
					image: product.image,
					category: product.category,
				}
			};

			const response = await axios.put(PRODUCT_URL, bodyParameters, config);
			const finalProduct = response.data.message.product;

			update((oldProducts) => {
				return updateProductLocal(oldProducts, finalProduct);
			});
		} catch (error) {
			handleError(error, 'Update Product');
		}
	}

	const deleteProductLocal = (products: any, deletedProduct: any) => {
		const { category } = deletedProduct;

		// Find the product in the local list
		const index = products[category].findIndex(
			(product: any) => product._id === deletedProduct._id
		);

		// Delete the product in the local list
		products[category].splice(index, 1);

		return products;
	}

	const __deleteProduct = async (product: Product) =>  {

		try {
			const localUser = window.localStorage.getItem('auth');
			if (!localUser) {
				throw new Error('No user found');
			}
			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			console.log('headers', config.headers)

			const bodyParameters = {
				product: {
					_id : product._id,
					_rev: product._rev,
					name: product.name,
					price: product.price,
					image: product.image,
					category: product.category,
				}
			};

			console.log('bodyParameters', bodyParameters);

			const response = await axios.delete(PRODUCT_URL, { data: bodyParameters, ...config });			
			const finalProduct = response.data.message.product;
			
			console.log('finalProduct', finalProduct);

			update((oldProducts) => {
				return deleteProductLocal(oldProducts, finalProduct);
			});
		} catch (error) {
			handleError(error, 'Delete Product');
		}
	}

	
	getProducts(); 
	return {
		subscribe,
		__updateProducts,
		set,
		__addProduct,
		__deleteProduct,
		getProducts,
	};
}


function staticCatalog() {
	return {
		Vegetables: [
			{
				id: 1,
				name: 'Brocolli',
				price: 2.73,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg',
				category: 'Vegetables'
			},
			{
				id: 2,
				name: 'Cauliflower',
				price: 6.3,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg',
				category: 'Vegetables'
			},
			{
				id: 3,
				name: 'Cucumber',
				price: 5.6,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg',
				category: 'Vegetables'
			},
			{
				id: 4,
				name: 'Beetroot',
				price: 8.7,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/beetroot.jpg',
				category: 'Vegetables'
			}
		],
		Fruits: [
			{
				id: 5,
				name: 'Apple',
				price: 2.34,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/apple.jpg',
				category: 'Fruits'
			},
			{
				id: 6,
				name: 'Banana',
				price: 1.69,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/banana.jpg',
				category: 'Fruits'
			},
			{
				id: 7,
				name: 'Grapes',
				price: 5.98,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/grapes.jpg',
				category: 'Fruits'
			},
			{
				id: 8,
				name: 'Mango',
				price: 6.8,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/mango.jpg',
				category: 'Fruits'
			}
		]
	};
}



export const products = createProducts();
export const productsStatic = staticCatalog();

export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});