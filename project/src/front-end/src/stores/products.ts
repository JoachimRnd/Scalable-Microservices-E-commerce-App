import { derived, writable } from 'svelte/store';
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { addToast } from '@stores/toasts';

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
			const { _rev, ...rest } = product;

			if (!categorizedProducts[rest.category]) {
				categorizedProducts[rest.category] = [];
			}

			categorizedProducts[rest.category].push(rest);
		}

		return categorizedProducts;
	};

	const addProduct = async (product) => {
		try {
			const localUser = window.localStorage.getItem('auth');
			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};
			//TODO à voir pour la structure du product la c'est peut être pas bon -> voir cart.ts

			const response = await axios.post(PRODUCT_URL, product, config);

			update((oldProducts) => {
				return [...oldProducts, response.data];
			});
		} catch (error) {
			handleError(error, 'Add Product');
		}
	};

	
	getProducts(); 

	return {
		subscribe,
		update,
		set,
		addProduct,
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