<script>
  
	import { user } from "@stores/auth";
	import { goto } from "$app/navigation";
	import { env } from "$env/dynamic/public";
	import { addToast } from "@stores/toasts";
	import axios from "axios";
  
	const url = env.PUBLIC_SERVICE_URL || "http://localhost:3001";
  
	let username = "";
	let password = "";
	function handleOnSubmit() {
	  axios
		.post(`${url}/user`, { username, password })
		.then((res) => {
		  $user.isLogged = true;
		  $user.isAdmin = false;
		  window.localStorage.setItem("auth", JSON.stringify({ ...$user, token: res.data.token }));
		  addToast({
			message: "Registration succeeded: Welcome!",
			type: "success",
			dismissible: true,
			timeout: 3000,
		  });
		  goto("/");
		})
		.catch((err) => {
		  addToast({
			message: "Registration completed with an error.",
			type: "error",
			dismissible: true,
			timeout: 3000,
		  });
		});
	}
  </script>
  
  <form method="POST" on:submit|preventDefault={handleOnSubmit}>
	<div class="container py-5 h-100">
	  <div class="row d-flex justify-content-center align-items-center h-100">
		<div class="col-12 col-md-8 col-lg-6 col-xl-5">
		  <div class="card shadow-2-strong" style="border-radius: 1rem;">
			<div class="card-body p-5 text-center">
			  <h3 class="mb-5">Register</h3>
  
			  <div class="form-outline mb-4">
				<input
				  id="username"
				  class="form-control form-control-lg"
				  bind:value={username}
				/>
				<label class="form-label" for="username">Username</label>
			  </div>
  
			  <div class="form-outline mb-4">
				<input
				  type="password"
				  id="password"
				  class="form-control form-control-lg"
				  bind:value={password}
				/>
				<label class="form-label" for="password">Password</label>
			  </div>
  
			  <button class="btn btn-primary btn-lg btn-block" type="submit"
				>Register</button
			  >
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </form>