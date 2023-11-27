import { derived, writable } from 'svelte/store';
import axios from 'axios';
import { env } from "$env/dynamic/public";
const url = env.PUBLIC_AUTH_SERVICE_URL;
import { addToast } from "@stores/toasts";

function createCart() {
	const { subscribe, set, update } = writable([]);

	const handleError = (error: any, message: string) => {
		console.error(`${message}:`, error);
		addToast({
			message: `Failed to ${message.toLowerCase()}`,
			type: "error",
			dismissible: true,
			timeout: 3000,
		});
	};

	const saveCart = async (cart: any) => {
		try {
			const localUser = window.localStorage.getItem('auth');
			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const cartToSave = cart.map((item) => ({
				_id: item._id,
				quantity: item.quantity,
			}));

			const bodyParameters = {
				cart: { items: cartToSave },
			};
			const response = await axios.post(`${url}/cart`, bodyParameters, config);
		} catch (error) {
			handleError(error, 'save Cart');
		}
	};

	const getCart = async () => {
		try {
			const localUser = window.localStorage.getItem('auth');
			if (!localUser) return;

			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.get(`${url}/cart`, config);
			if (response.data.cart && response.data.cart.length > 0) {
				const productIds = response.data.cart.flatMap((item) => item._id);

				if (productIds.length > 0) {
					const productsDetailsResponse = await axios.post(
						`${url}/products/ids`,
						{ productIds },
						config
					);

					const productsDetails = productsDetailsResponse.data.data;
					const updatedCart = response.data.cart.map((item) => ({
						...item,
						...productsDetails.find((detail) => detail._id === item._id),
					}));
					set(updatedCart);
				}
				//const cartFromServer = response.data.cart;
				//set(cartFromServer);
			} else {
				cart.update((old) => []);
			}
		} catch (error) {
			handleError(error, 'get Cart');
		}
	};

	return {
		subscribe,
		update,
		addToCart: (item: any) =>
			update((oldCart) => {
				const itemIndex = oldCart.findIndex((e) => e._id === item._id);
				const newCart =
					itemIndex === -1
						? [...oldCart, item]
						: (() => {
							oldCart[itemIndex].quantity += item.quantity;
							return oldCart;
						})();

				saveCart(newCart);
				return newCart;
			}),
		saveCart: () => {
			saveCart($cart);
		},
		getCart
	};
}

export const cart = createCart();

export const totalQuantity = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity, 0)
);

export const totalPrice = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
);
