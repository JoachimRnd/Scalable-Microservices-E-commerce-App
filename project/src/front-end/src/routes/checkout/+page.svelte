<script lang="ts">
	import { totalPrice, totalQuantity, cart } from "@stores/cart";
	import { onMount } from "svelte";

	import axios from "axios";
	import { env } from "$env/dynamic/public";
	const url = env.PUBLIC_SERVICE_URL;

	import { addToast } from "@stores/toasts";

	let prevCheckout: any[];

	onMount(async () => {
		try {
			await cart.getCart();

			let localUser = window.localStorage.getItem("auth");
			const token = JSON.parse(localUser).token;

			const response = await axios.get(`${url}/orders/user/orders`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const orders = response.data.data || [];
			const productIds = orders.flatMap((order) =>
				order.items.map((item) => item._id),
			);

			if (productIds.length > 0) {
				const productsDetailsResponse = await axios.get(
					`${url}/products/id?productsId=${productIds.join(",")}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				const productsDetails = productsDetailsResponse.data.data;

				prevCheckout = orders.map((order) => ({
					...order,
					items: order.items.map((item) => {
						const productDetail = productsDetails.find(
							(detail) => detail._id === item._id,
						);

						return productDetail
							? { ...item, ...productDetail }
							: {
									...item,
									name: "Deleted from the store",
									price: 0,
									image: "https://cdn-icons-png.flaticon.com/512/1178/1178479.png",
									category: "Not found",
							  };
					}),
				}));
			} else {
				prevCheckout = [];
			}
		} catch (error) {
			console.error("Error fetching user orders:", error);
			addToast({
				message: "Error fetching user orders.",
				type: "error",
				dismissible: true,
				timeout: 3000,
			});
		}
	});

	function handleCheckout() {
		let productsDetails = $cart.map((item) => ({
			_id: item._id,
			quantity: item.quantity,
		}));

		const order = {
			items: $cart,
			extras: {
				totalQuantity: $totalQuantity,
				totalPrice: $totalPrice,
				date: new Date().toLocaleDateString("fr"),
			},
		};

		const orderForServer = { ...order, items: productsDetails };

		prevCheckout = [...prevCheckout, order];
		let localUser = window.localStorage.getItem("auth");
		const token = JSON.parse(localUser).token;

		const config = {
			headers: { Authorization: `Bearer ${token}` },
		};

		const bodyParameters = {
			order: orderForServer,
		};

		//Adding order in orders-db
		axios
			.post(`${url}/orders/checkout`, bodyParameters, config)
			.then((res) => {
				addToast({
					message: "Order completed",
					type: "success",
					dismissible: true,
					timeout: 3000,
				});
			})
			.catch((err) => {
				addToast({
					message: "Order completed with an error.",
					type: "error",
					dismissible: true,
					timeout: 3000,
				});
			});

		//Removing cart in shopping-carts-db
		axios.delete(`${url}/cart`, config).catch((err) => {
			console.error("Error removing cart:", err);
		});

		cart.update((old) => []);
	}
</script>

<!-- Header-->
<header class="py-5 bg-gradient-to-r from-pink-500 to-yellow-500">
	<div class="container px-4 px-lg-5 my-3">
		<div class="text-center text-white">
			<h1 class="display-4 fw-bolder">Checkout</h1>
		</div>
	</div>
</header>
<div class="container p-3 max-w-4xl">
	<main>
		<div class="py-5 row g-5">
			<!-- Current cart -->
			<div class="col-md-6 col-lg-5 order-md-last">
				<h4 class="d-flex justify-content-end align-items-center mb-3">
					<span class="text-primary text-2xl pr-3">Your cart</span>
					<span class="badge bg-primary rounded-pill"
						>{$totalQuantity}</span
					>
				</h4>
				<ul class="list-group mb-3">
					{#if $cart && $cart.length > 0}
						{#each $cart as item}
							<li
								class="list-group-item grid grid-flow-row-dense grid-cols-4 lh-sm"
							>
								<img
									class="object-contain h-10 w-10"
									src={item.image}
									alt={item.name}
								/>
								<div class="m-auto">{item.name}</div>
								<span
									class="text-body-secondary text-gray-500 m-auto"
									>{item.quantity}</span
								>
								<span
									class="text-body-secondary text-gray-500 m-auto"
									>${item.price * item.quantity}</span
								>
							</li>
						{/each}
						<form
							method="POST"
							on:submit|preventDefault={handleCheckout}
						>
							<button
								class="w-100 btn btn-primary bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 border-none my-3"
								type="submit">Checkout</button
							>
						</form>
					{:else}
						<li
							class="list-group-item grid grid-flow-row-dense lh-sm"
						>
							Your cart is empty
						</li>
					{/if}
				</ul>
			</div>
			<!-- Previous purchases -->
			<div class="col-md-6 col-lg-7">
				<h1 class="text-2xl mb-3 text-center">Purchase history</h1>
				<ul class="list-group mb-3">
					{#if prevCheckout && prevCheckout.length > 0}
						{#each prevCheckout as checkout}
							<li
								class="list-group-item grid grid-flow-row-dense grid-cols-2 lh-sm"
							>
								{#each checkout.items as item}
									<div class="m-auto flex justify-end w-full">
										<img
											class="object-contain h-10 w-10"
											src={item.image}
											alt={item.name}
										/>
										<span class="my-auto">
											{item.quantity} x
											{item.name}</span
										>
									</div>
									<span
										class="text-body-secondary text-gray-500 m-auto"
										>${item.price * item.quantity}</span
									>
								{/each}
								<div class="m-auto w-full pt-2 col-auto">
									Total: ${checkout.extras.totalPrice}
								</div>
							</li>
						{/each}
					{:else}
						<li
							class="list-group-item grid grid-flow-row-dense lh-sm"
						>
							Your cart is empty
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</main>
</div>
