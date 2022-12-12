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
    addDoc,
} from "firebase/firestore";
import router from "../router/index.js";

export const useUsers = defineStore("users", () => {
    const currentUser = ref({});
    const userRef = collection(db, "users");
    const loginStatus = ref(false);
    const options = ref({});

    const login = async(username, password) => {
        await getDocs(
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
                    getDocs(
                        query(
                            collection(db, "options"),
                            where("user_id", "==", currentUser.value.id)
                        )
                    ).then((snap) => {
                        snap.forEach((post) => {
                            let data = { id: post.id, ...post.data() };
                            options.value = data;
                            localStorage.setItem("dark_theme", data.is_dark_theme);
                            localStorage.setItem("id", currentUser.value.id);
                            document.getElementsByTagName("body")[0].style.backgroundColor =
                                JSON.parse(localStorage.getItem("dark_theme")) ?
                                "black" :
                                "white";
                        });
                    });

                    if (!localStorage.getItem("id")) {
                        localStorage.setItem("id", currentUser.value.id);
                        options.value = {
                            user_id: currentUser.value.id,
                            is_dark_theme: false,
                        };
                        addDoc(collection(db, "options"), options.value);
                        localStorage.setItem("dark_theme", false);
                        document.getElementsByTagName("body")[0].style.backgroundColor =
                            JSON.parse(localStorage.getItem("dark_theme")) ?
                            "black" :
                            "white";
                    }

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
                                options.value = data;
                                localStorage.setItem("dark_theme", data.is_dark_theme);
                            });
                        });
                    });
                })
                .then(() => {
                    if (currentUser.value.id) {
                        loginStatus.value = true;
                        localStorage.setItem("id", currentUser.value.id);
                        document.getElementsByTagName("body")[0].style.backgroundColor =
                            JSON.parse(localStorage.getItem("dark_theme")) ?
                            "black" :
                            "white";
                    }
                });
        }
    };

    const logout = () => {
        loginStatus.value = false;
        localStorage.clear();
        currentUser.value = {};
        options.value = {};
        alert("successfully");
        router.push({ name: "feeds" });
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