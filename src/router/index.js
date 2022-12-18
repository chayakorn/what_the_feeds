import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import FeedsView from "../views/Feeds.vue";
import ProfileView from "../views/Profile.vue";

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [
        { path: "/login", name: "login", component: LoginView },
        { path: "/profile/:user", name: "profile", component: ProfileView },
        { path: "/", name: "feeds", component: FeedsView },
    ],
});

export default router;