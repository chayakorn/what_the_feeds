<script setup>
import { useUsers } from "../stores/user";

const myUser = useUsers();
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <router-link :to="{ name: 'feeds' }" class="navbar-brand"
        ><h4>What the Feeds</h4></router-link
      >

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav me-auto mb-2 mb-lg-0"></div>
        <router-link :to="{ name: 'login' }" v-if="!myUser.loginStatus"
          ><button class="btn btn-outline-success">Login</button></router-link
        >

        <div class="text-dark mx-4" v-if="myUser.loginStatus">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{
                  `${myUser.currentUser.firstname} ${myUser.currentUser.lastname}`
                }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link
                    :to="{
                      name: 'profile',
                      params: { user: myUser.currentUser.id },
                    }"
                    class="dropdown-item"
                    href="/profile"
                    >Profile</router-link
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>

                <li class="d-flex justify-content-center">
                  <button
                    class="btn btn-outline-danger"
                    v-if="myUser.loginStatus"
                    @click="myUser.logout"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style></style>
