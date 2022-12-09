<script setup>
import { useUsers } from "../stores/user";
import { ref } from "vue";

const myUser = useUsers();

const username = ref("");
const password = ref("");

const login = (e) => {
  if (username.value && password.value) {
    e.preventDefault();
    myUser.login(username.value, password.value);
  }
};
</script>

<template>
  <div class="mt-3 p-2 bg-light text-dark">
    <form @submit="login">
      <h1>Login</h1>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label"
          ><strong>Username</strong></label
        >
        <input
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="username"
          required
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">
          <strong>Password</strong>
        </label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="password"
          required
        />
      </div>

      <button type="submit" class="btn btn-success">Login</button>
    </form>
  </div>
</template>

<style></style>
