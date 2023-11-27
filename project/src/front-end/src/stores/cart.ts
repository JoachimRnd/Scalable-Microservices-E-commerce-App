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
			const bodyParameters = {
				cart: { items: cart },
			};
			const response = await axios.post(`${url}/cart`, bodyParameters, config);
		} catch (error) {
			handleError(error, 'Save Cart');
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
				const cartFromServer = response.data.cart;
				set(cartFromServer);
			}else{
				cart.update((old) => []);
			}
		} catch (error) {
			handleError(error, 'Get Cart');
		}
	};

	return {
		subscribe,
		update,
		addToCart: (item: any) =>
			update((oldCart) => {
				const itemIndex = oldCart.findIndex((e) => e.id === item.id);
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
