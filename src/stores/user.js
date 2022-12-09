import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";
import db from "../firebase/init.js";
import { useRouter } from "vue-router";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
} from "firebase/firestore";
import router from "../router/index.js";

export const useUsers = defineStore("users", () => {
    const currentUser = ref({});
    const userRef = collection(db, "users");
    const loginStatus = ref(false);
    const options = ref({});

    const login = async(username, password) => {
        getDocs(
                query(
                    userRef,
                    where("__name__", "==", username),
                    where("password", "==", password)
                )
            )
            .then((snap) => {
                snap.forEach((doc) => {
                    currentUser.value = doc.data();
                    currentUser.value.id = doc.id;
                });
            })
            .then(() => {
                if (currentUser.value.id) {
                    alert("successfully");
                    loginStatus.value = true;
                    localStorage.setItem("id", currentUser.value.id);
                    getDocs(
                        query(
                            collection(db, "options"),
                            where("user_id", "==", currentUser.value.id)
                        )
                    ).then((snap) => {
                        snap.forEach((post) => {
                            let data = { id: post.id, ...post.data() };
                            localStorage.setItem("dark_theme", data.is_dark_theme);
                        });
                    });
                    router.push({ name: "feeds" });
                } else {
                    alert("error");
                }
            });
    };

    const refresh = async() => {
        if (localStorage.getItem("id")) {
            await getDocs(
                    query(userRef, where("__name__", "==", localStorage.getItem("id")))
                )
                .then((snap) => {
                    snap.forEach((doc) => {
                        currentUser.value = { id: doc.id, ...doc.data() };
                        getDocs(
                            query(
                                collection(db, "options"),
                                where("user_id", "==", currentUser.value.id)
                            )
                        ).then((snap) => {
                            snap.forEach((post) => {
                                let data = { id: post.id, ...post.data() };
                                localStorage.setItem("dark_theme", data.is_dark_theme);
                            });
                        });
                    });
                })
                .then(() => {
                    if (currentUser.value.id) {
                        loginStatus.value = true;
                        localStorage.setItem("id", currentUser.value.id);
                    }
                });
        }
    };

    const logout = () => {
        loginStatus.value = false;
        localStorage.setItem("id", "");
        currentUser.value = {};
        alert("successfully");
    };

    const updateUser = (user, id) => {
        updateDoc(doc(db, "users", id), user);
    };
    return {
        login,
        currentUser,
        options,
        logout,
        loginStatus,
        refresh,
        updateUser,
    };
});

if (
    import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsers,
        import.meta.hot));
}