<script lang="ts">
  import { user } from "@stores/auth";
  import { cart } from "@stores/cart";
  import { success } from "@stores/toasts";
  import Modal from "@interfaces/misc/Modal.svelte";
  import axios from "axios";
  import { env } from "$env/dynamic/public";

  let showModal = false;

  interface Product {
    _id: string;
    _rev: string;
    name: string;
    price: number;
    image: string;
    category: String;
  }
  export let product: Product;

  let quantity: number = 0;
  let recommendations: Product[] = [];
  let recommendedQuantities: { [key: string]: number } = {};

  const url = env.PUBLIC_SERVICE_URL;

  let loading = false;

  const showQuickView = async (productId) => {
    showModal = true;
    loading = true;

    if ($user.isLogged) {
      let localUser = window.localStorage.getItem("auth");
      const token = JSON.parse(localUser || "").token;

      try {
        const recommendationsResponse = await axios.get(
          `${url}/recommendations/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        recommendations = recommendationsResponse.data.data || [];
        recommendations.forEach((product) => {
          recommendedQuantities[product._id] = 0;
        });
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
      loading = false;
    }
  };

  const addToCart = (productToAdd: Product, quantityToAdd: number) => {
    if (quantityToAdd > 0) {
      cart.addToCart({ ...productToAdd, quantity: quantityToAdd });
      success("Added item to cart");
    }
  };
</script>

<div class="col mb-5">
  <div class="card h-100">
    <!-- Product image-->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
      class="card-img-top"
      src={product.image}
      alt="..."
      on:click={() => showQuickView(product._id)}
    />
    <!-- Product details-->
    <div class="card-body p-4">
      <div class="text-center">
        <!-- Product name-->
        <h5 class="fw-bolder">{product.name}</h5>
        <!-- Product price-->
        ${product.price}
      </div>
    </div>
    <!-- Product actions-->
    {#if $user.isLogged}
      <div class="card-footer p-4 pt-0 border-top-0 bg-transparent mb-4">
        <div class="custom-number-input h-10 w-32 m-auto">
          <div
            class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
          >
            <button
              on:click={() => {
                if (quantity > 0) quantity--;
              }}
              class=" bg-pink-500 text-gray-600 hover:text-gray-700 hover:bg-pink-600 h-full w-20 rounded-l cursor-pointer outline-none"
            >
              <span class="m-auto text-2xl font-thin">−</span>
            </button>
            <input
              type="number"
              class="outline-none focus:outline-none text-center w-full bg-gradient-to-r from-pink-500 to-yellow-500 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none"
              name="custom-input-number"
              bind:value={quantity}
            />
            <button
              on:click={() => quantity++}
              class="bg-yellow-500 text-gray-600 hover:text-gray-700 hover:bg-yellow-600 h-full w-20 rounded-r cursor-pointer"
            >
              <span class="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
          <button
            disabled={quantity == 0}
            class="p-1 transition ease-in-out bg-gradient-to-r from-pink-500 to-yellow-500 to-90% text-center font-semibold text-md w-full text-white hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-md"
            on:click={() => {
              addToCart(product, quantity);
              quantity = 0;
            }}>Add to cart</button
          >
        </div>
      </div>
    {/if}

    <!-- QuickView-->
    <Modal bind:showModal cssClass="text-center">
      <h2 class="text-4xl" slot="header">
        {product.name}
        <br />
        <span class="text-xl"><em>{product.price}$</em></span>
      </h2>
      <div class="container">
        <img class="card-img-top" src={product.image} alt={product.name} />
        {#if $user.isLogged}
          <br />
          <hr class="mb-3" />
          <h3>Recommendations</h3>
          {#if loading}
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          {:else if recommendations.length > 0}
            <div class="recommendations-grid">
              {#each recommendations as recommendedProduct}
                <div class="recommended-product">
                  <img
                    src={recommendedProduct.image}
                    alt={recommendedProduct.name}
                    class="recommendation-image"
                  />
                  <div class="recommendation-info">
                    <p>{recommendedProduct.name}</p>
                    <p>${recommendedProduct.price}</p>
                    <div
                      class="card-footer p-4 pt-0 border-top-0 bg-transparent mb-4"
                    >
                      <div class="custom-number-input h-10 w-32 m-auto">
                        <div
                          class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
                        >
                          <button
                            on:click={() => {
                              if (
                                recommendedQuantities[recommendedProduct._id] >
                                0
                              )
                                recommendedQuantities[recommendedProduct._id]--;
                            }}
                            class="bg-pink-500 text-gray-600 hover:text-gray-700 hover:bg-pink-600 h-full w-20 rounded-l cursor-pointer outline-none"
                          >
                            <span class="m-auto text-2xl font-thin">−</span>
                          </button>
                          <input
                            type="number"
                            class="outline-none focus:outline-none text-center w-full bg-gradient-to-r from-pink-500 to-yellow-500 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none"
                            bind:value={recommendedQuantities[
                              recommendedProduct._id
                            ]}
                          />
                          <button
                            on:click={() =>
                              recommendedQuantities[recommendedProduct._id]++}
                            class="bg-yellow-500 text-gray-600 hover:text-gray-700 hover:bg-yellow-600 h-full w-20 rounded-r cursor-pointer"
                          >
                            <span class="m-auto text-2xl font-thin">+</span>
                          </button>
                        </div>

                        <button
                          disabled={recommendedQuantities[
                            recommendedProduct._id
                          ] == 0}
                          class="p-1 transition ease-in-out bg-gradient-to-r from-pink-500 to-yellow-500 to-90% text-center font-semibold text-md w-full text-white hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-md"
                          on:click={() => {
                            addToCart(
                              recommendedProduct,
                              recommendedQuantities[recommendedProduct._id],
                            );
                            recommendedQuantities[recommendedProduct._id] = 0;
                          }}>Add to cart</button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p>No recommendations available.</p>
          {/if}
        {/if}
      </div>
    </Modal>
  </div>
</div>

<style>
  .recommended-product {
    transition:
      transform 0.4s ease,
      box-shadow 0.4s ease;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .recommended-product:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }

  .recommendations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }

  .recommended-product img {
    width: 100%;
    height: auto;
  }

  /* Chrome, Safari, Edge, Opera */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .custom-number-input input:focus {
    outline: none !important;
  }

  .custom-number-input button:focus {
    outline: none !important;
  }
</style>
