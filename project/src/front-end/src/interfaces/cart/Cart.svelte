<script>
	import { cart, totalPrice, totalQuantity } from "@stores/cart";
	import axios from "axios";
	import { env } from "$env/dynamic/public";
	const url = env.PUBLIC_AUTH_SERVICE_URL;
	import Modal from "@interfaces/misc/Modal.svelte";
	import { goto } from "$app/navigation";
	import { success, error } from "@stores/toasts";

	let showModal = false;

	import { onMount } from "svelte";

	onMount(async () => {
		await cart.getCart();
	});

	function goToCheckout() {
		goto("/checkout");
	}

	const deleteItem = async (itemId) => {
		try {
			const localUser = window.localStorage.getItem("auth");
			const token = JSON.parse(localUser).token;
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			};

			const response = await axios.delete(
				`${url}/cart/${itemId}`,
				config,
			);
			await cart.getCart();
			success(response.data.message);
		} catch (err) {
			error(err);
		}
	};
</script>

<form class="d-flex">
	<button
		class="btn btn-outline-dark"
		on:click={async () => {
			await cart.getCart();
			showModal = true;
		}}
	>
		<i class="bi-cart-fill me-1" />
		Cart
		<span class="badge bg-dark text-white ms-1 rounded-pill"
			>{$totalQuantity}</span
		>
	</button>
</form>
<Modal bind:showModal cssClass="text-center m-2" isCart={true}>
	<h2 slot="header" class="text-xl mb-2">My cart</h2>
	{#if $cart.length > 0}
		<table class="table-auto text-center">
			<thead>
				<tr>
					<th />
					<th>Item</th>
					<th>Quantity</th>
					<th>Total price</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each $cart as item}
					<tr>
						<td
							><img
								class="h-14 w-14"
								src={item.image}
								alt={item.name}
							/></td
						>
						<td>{item.name}</td>
						<td>{item.quantity}</td>
						<td>{item.price * item.quantity}$</td>
						<td
							><button
								on:click={() => deleteItem(item._id)}
								class=" mt-1 border-none btn bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
							>
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="w-full inline-grid justify-end">
			<p>Total: <span class="font-semibold">{$totalPrice}$</span></p>
			<form method="dialog">
				<button
					on:click={goToCheckout}
					class=" mt-1 border-none btn bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
				>
					Checkout
				</button>
			</form>
		</div>
	{:else}
		<p>Your cart is empty</p>
	{/if}
</Modal>
