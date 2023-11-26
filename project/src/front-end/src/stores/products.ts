import { v4 as uuidv4 } from 'uuid';
import { derived, writable } from 'svelte/store';

import axios from 'axios';
import { env } from "$env/dynamic/public";


const PRODUCT_URL = `${env.PUBLIC_AUTH_SERVICE_URL}/products`;

export const products = createProducts();
export const productsStatic = test();
// export const products = dynamicCatalog();

function createProducts() {
	console.log(dynamicCatalog());
	const { subscribe, set, update } = writable(dynamicCatalog());

	return {
		subscribe,
		update,
		set,
		__addProduct,
	};
}

function test() {
	const products = staticCatalog();
	console.log(products);
	const { subscribe, set, update } = writable(products);

	return {
		subscribe,
		update,
		set,
	};
}

async function __addProduct(product) {
	axios
		.post(PRODUCT_URL, product)
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});
}

async function dynamicCatalog() {
	axios
		.get(PRODUCT_URL)
		.then((response) => {
			const data = response.data.data;
			console.log(categorizeProducts(data));	
			return categorizeProducts(data);
		})
		.catch((error) => {
			console.log(error);
		});
}

function categorizeProducts(products: any[]): any {
	const categorizedProducts: any = {};

	for (const product of products) {
		const { _id, _rev, ...rest } = product;

		if (!categorizedProducts[rest.category]) {
			categorizedProducts[rest.category] = [];
		}

		categorizedProducts[rest.category].push(rest);
	}

	return categorizedProducts;
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

export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});
