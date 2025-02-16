import { derived, writable } from 'svelte/store';
import axios from 'axios';
import { env } from "$env/dynamic/public";
const url = env.PUBLIC_SERVICE_URL;
import { addToast } from "@stores/toasts";

function createCart() {
	const { subscribe, set, update } = writable([]);

	const handleError = (error, message) => {
		console.error(`${message}:`, error);
		addToast({
			message: `Failed to ${message.toLowerCase()}`,
			type: "error",
			dismissible: true,
			timeout: 3000,
		});
	};

	const saveCart = async (cart) => {
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
			await axios.post(`${url}/cart`, bodyParameters, config);
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
					const productsDetailsResponse = await axios.get(
						`${url}/products/id?productsId=${productIds.join(",")}`,
						config
					);
					if(productsDetailsResponse.data.error) throw new Error(productsDetailsResponse.data.error);
					const productsDetails = productsDetailsResponse.data.data;

					const updatedCart = response.data.cart.map((item) => {
						const productDetail = productsDetails.find((detail) => detail._id === item._id);
						return productDetail
						  ? { ...item, ...productDetail }
						  : {
							  ...item,
							  name: "Deleted from the store",
							  price: 0,
							  image: "https://cdn-icons-png.flaticon.com/512/1178/1178479.png",
							  category: "Not found",
							};
					  });


					set(updatedCart);
				} else {
					cart.update((old) => []);
				}
			} else {
				cart.update((old) => []);
			}
		} catch (error) {
			cart.update((old) => []);
			handleError(error, 'get Cart');
		}
	};

	return {
		subscribe,
		update,
		addToCart: (item) =>
			update((oldCart) => {
				const itemIndex = oldCart.findIndex((e) => e._id === item._id);
				const newCart =
					itemIndex === -1
						? [...oldCart, item]
						: (() => {
							oldCart[itemIndex].quantity += item.quantity;
							return oldCart.slice();
						})();

				saveCart(newCart);
				return newCart;
			}),
		saveCart: () => {
			saveCart($cart);
		},
		getCart,
	};
}

export const cart = createCart();

export const totalQuantity = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity, 0)
);

export const totalPrice = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
);
