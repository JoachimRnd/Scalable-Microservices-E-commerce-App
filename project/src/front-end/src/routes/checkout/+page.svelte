<script lang="ts">
	import { totalPrice, totalQuantity, cart } from "@stores/cart";
	import { onMount } from "svelte";

	import axios from "axios";
	import { env } from "$env/dynamic/public";
	const url = env.PUBLIC_AUTH_SERVICE_URL;

	import { addToast } from "@stores/toasts";

	let prevCheckout: any[];

	onMount(async () => {
		await cart.getCart();

		let localUser = window.localStorage.getItem("auth");
		const token = JSON.parse(localUser).token;

		axios
			.get(`${url}/order/user/orders`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				prevCheckout = response.data.data || [];
			})
			.catch((error) => {
				console.error("Error fetching user orders:", error);
				addToast({
					message: "Error fetching user orders.",
					type: "error",
					dismissible: true,
					timeout: 3000,
				});
			});
	});

	function handleCheckout() {
		let order = {
			items: $cart,
			extras: {
				totalQuantity: $totalQuantity,
				totalPrice: $totalPrice,
				date: new Date().toLocaleDateString("fr"),
			},
		};

		prevCheckout = [...prevCheckout, order];
		let localUser = window.localStorage.getItem("auth");
		const token = JSON.parse(localUser).token;

		const config = {
			headers: { Authorization: `Bearer ${token}` },
		};

		const bodyParameters = {
			order: order,
		};

		//Adding order in orders-db
		axios
			.post(`${url}/order/checkout`, bodyParameters, config)
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
		axios
			.delete(`${url}/cart`, config)
			.catch((err) => {
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
					{#if $cart.length > 0}
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
					{#if prevCheckout}
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
