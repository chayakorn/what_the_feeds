<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavbarVue from "./components/Navbar.vue";
import { useUsers } from "./stores/user.js";

const myUser = useUsers();
myUser.refresh().then(() => {
  document.getElementsByTagName("body")[0].style.backgroundColor = JSON.parse(
    localStorage.getItem("dark_theme")
  )
    ? "black"
    : "white";
});
</script>

<template>
  <NavbarVue />
  <div>
    <RouterView />
  </div>
</template>

<style>
a {
  display: block;
}
</style>
