<script setup>
import { useUsers } from "../stores/user.js";
import db from "../firebase/init.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getCountFromServer,
  addDoc,
} from "@firebase/firestore";
import { ref, onBeforeMount, onMounted } from "vue";
import Post from "../components/Post.vue";
import router from "../router";

const myUser = useUsers();

const posts = ref([]);
const countPosts = ref(0);
const status = ref("post");
const options = ref({});
if (!localStorage.getItem("id")) {
  router.push({ name: "feeds" });
}
const getPosts = () => {
  posts.value = [];
  getCountFromServer(
    query(
      collection(db, "postFeeds"),
      where("user", "==", myUser.currentUser.id)
    )
  ).then((e) => {
    countPosts.value = e.data().count;
  });
  getDocs(
    query(
      collection(db, "postFeeds"),
      where("user", "==", myUser.currentUser.id)
    )
  ).then((snap) => {
    snap.forEach((post) => {
      let data = { id: post.id, ...post.data() };
      posts.value.push(data);
    });
  });
};

const getLikedPosts = () => {
  posts.value = [];
  getCountFromServer(
    query(
      collection(db, "postFeeds"),
      where("like", "array-contains", myUser.currentUser.id)
    )
  ).then((e) => {
    countPosts.value = e.data().count;
  });
  getDocs(
    query(
      collection(db, "postFeeds"),
      where("like", "array-contains", myUser.currentUser.id)
    )
  ).then((snap) => {
    snap.forEach((post) => {
      let data = { id: post.id, ...post.data() };
      posts.value.push(data);
    });
  });
};
const getOptions = () => {
  getDocs(
    query(
      collection(db, "options"),
      where("user_id", "==", myUser.currentUser.id)
    )
  ).then(async (snap) => {
    if (snap.empty) {
      options.value = { is_dark_theme: true, user_id: myUser.currentUser.id };
      await addDoc(collection(db, "options"), options.value).then((e) => {
        options.value.id = e.id;
      });
    } else {
      snap.forEach((post) => {
        let data = { id: post.id, ...post.data() };
        options.value = data;
      });
    }
  });
};

const updateOptions = () => {
  options.value.is_dark_theme = !options.value.is_dark_theme;
  updateDoc(doc(db, "options", options.value.id), {
    is_dark_theme: options.value.is_dark_theme,
  });
  localStorage.setItem("dark_theme", options.value.is_dark_theme);
  document.getElementsByTagName("body")[0].style.backgroundColor = JSON.parse(
    localStorage.getItem("dark_theme")
  )
    ? "black"
    : "white";
};

const updatePost = (index) => {
  updateDoc(doc(db, "postFeeds", posts.value[index].id), {
    like: posts.value[index].like ? posts.value[index].like : [],
    dislike: posts.value[index].dislike ? posts.value[index].dislike : [],
  });
};
const like = (index, bool) => {
  if (bool) {
    posts.value[index].dislike = posts.value[index].dislike.filter((value) => {
      return value != myUser.currentUser.id;
    });
  }
  if (!posts.value[index].like) {
    posts.value[index].like = [];
  }
  posts.value[index].like.push(myUser.currentUser.id);
  updatePost(index);
};

const unlike = (index, bool) => {
  posts.value[index].like = posts.value[index].like.filter((value) => {
    return value != myUser.currentUser.id;
  });
  updatePost(index);
};

const dislike = (index, bool) => {
  if (bool) {
    posts.value[index].like = posts.value[index].like.filter((value) => {
      return value != myUser.currentUser.id;
    });
  }
  if (!posts.value[index].dislike) {
    posts.value[index].dislike = [];
  }
  posts.value[index].dislike.push(myUser.currentUser.id);
  updatePost(index);
};

const undislike = (index, bool) => {
  posts.value[index].dislike = posts.value[index].dislike.filter((value) => {
    return value != myUser.currentUser.id;
  });
  updatePost(index);
};
const addComment = (newComment, index) => {
  let comment = myUser.loginStatus
    ? {
        comment: newComment,
        cmtdate: new Date(),
        user_id: myUser.currentUser.id,
        firstname: myUser.currentUser.firstname,
        lastname: myUser.currentUser.lastname,
      }
    : {
        comment: newComment,
        cmtdate: new Date(),
      };
  addDoc(
    collection(db, "postFeeds", posts.value[index].id, "comments"),
    comment
  ).then(() => {
    comment.cmtdate = Timestamp.fromDate(comment.cmtdate);
    if (!posts.value[index].comments) {
      posts.value[index].comments = [];
    }
    posts.value[index].comments.push(comment);
  });
};

const addPost = (newPost) => {
  console.log(myUser.currentUser.id);
  const post = {
    body: newPost,
    dislike: [],
    like: [],
    ishide: false,
    user: myUser.currentUser.id ? myUser.currentUser.id : "",
    postdate: new Date(),
  };
  addDoc(collection(db, "postFeeds"), post).then((e) => {
    post.id = e.id;
    post.postdate = Timestamp.fromDate(post.postdate);
    posts.value.shift(post);
  });
};

const getLuckyNumber = () => {
  myUser.currentUser.luckynumber = Math.floor(Math.random() * 1000);
  myUser.updateUser(myUser.currentUser, myUser.currentUser.id);
};

const hideUnhide = (index) => {
  posts.value[index].ishide = !posts.value[index].ishide;
  updatePost(index);
};

onMounted(() => {
  if (!localStorage.getItem("id")) {
    router.push({ name: "feeds" });
  }
  myUser.refresh().then(() => {
    getPosts();
  });
});
</script>

<template>
  <div class="py-3">
    <div>
      <!-- Column -->
      <div class="card text-dark">
        <!-- <img  src="../assets/user-icon.png" /> -->
        <div class="card-img-top bg-green"></div>
        <div class="card-body little-profile text-center">
          <div class="pro-img">
            <img src="../assets/user-icon.png" alt="user" />
          </div>
          <h3 class="m-b-0">
            {{
              `${myUser.currentUser.firstname} ${myUser.currentUser.lastname}`
            }}
          </h3>

          <div class="row text-center mt-3">
            <div>
              🎂
              {{
                myUser.currentUser.dob ? myUser.currentUser.dob.toDate() : ""
              }}
            </div>
            <div>🍀 Lucky Number</div>
            <div v-if="myUser.currentUser.luckynumber">
              {{ myUser.currentUser.luckynumber }}
            </div>
            <div v-else>
              <button class="btn btn-primary" @click="getLuckyNumber">
                Get Your Lucky Number
              </button>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item" style="cursor: pointer">
          <a
            :class="['nav-link', status == 'post' ? 'active' : '']"
            @click="status == 'post' ? '' : ((status = 'post'), getPosts())"
            aria-current="true"
            >Post</a
          >
        </li>
        <li class="nav-item" style="cursor: pointer">
          <a
            :class="['nav-link', status == 'likedpost' ? 'active' : '']"
            @click="
              status == 'likedpost'
                ? ''
                : ((status = 'likedpost'), getLikedPosts())
            "
            >Liked Post</a
          >
        </li>
        <li class="nav-item" style="cursor: pointer">
          <a
            :class="['nav-link', status == 'option' ? 'active' : '']"
            @click="
              status == 'options' ? '' : ((status = 'options'), getOptions())
            "
            >Option</a
          >
        </li>
      </ul>
    </div>
    <div class="card-body text-dark">
      <div>
        <h5 class="card-title">
          {{
            status == "likedpost"
              ? "Liked Posts"
              : status == "options"
              ? "Options"
              : `All Posts`
          }}{{ status == "options" ? "" : `(${countPosts})` }}
        </h5>

        <div v-if="status != 'options'">
          <Post
            v-for="(post, index) in posts"
            :key="post.id"
            :post="post"
            :index="index"
            @like="like"
            @unlike="unlike"
            @dislike="dislike"
            @undislike="undislike"
            @addComment="addComment"
            @hide-unhide="hideUnhide"
          />
        </div>
        <div v-else>
          <div class="row">
            <div class="col-xs-12">
              <div class="form-check">
                <label class="form-check-label form-check-toggle">
                  <div class="d-flex">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="options.is_dark_theme"
                      @click="updateOptions()"
                    /><span class="ml-5"
                      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Dark Theme
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.form-check {
  position: relative;
  display: block;
  margin-bottom: 0.75rem;
}

.form-check-toggle {
  position: relative;
  padding-left: 0;
  line-height: 30px;
}
.form-check-toggle input {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 0%;
  margin: 0;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
}
.form-check-toggle input + span {
  cursor: pointer;
  user-select: none;
  height: 30px;
  margin-left: 70px;
  display: block;
}
.form-check-toggle input + span:before {
  content: "";
  position: absolute;
  left: 0;
  display: inline-block;
  height: 30px;
  width: 50px;
  background: #fff;
  border: solid 1px #eff2f3;
  transition: background 0.3s ease-in-out, border-color 0.3s ease-in-out;
  border-radius: 15px;
}
.form-check-toggle input + span:after {
  width: 28px;
  height: 28px;
  margin-top: 1px;
  margin-left: 1px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  background: #fff;
  transition: margin-left 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  text-align: center;
  font-weight: bold;
  content: "";
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 0 5px rgba(0, 0, 0, 0.05);
}
.form-check-toggle input:checked + span:after {
  content: "";
  margin-left: 21px;
  box-shadow: none;
}
.form-check-toggle input:checked + span:before {
  background-color: #86be4e;
  border-color: #86be4e;
  transition: background 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.padding {
  padding: 3rem !important;
  margin-left: 200px;
}

.card-img-top {
  height: 250px;
  background-color: red;
  background: rgb(74, 8, 6);
  background: linear-gradient(
    180deg,
    rgba(74, 8, 6, 1) 0%,
    rgba(203, 41, 23, 1) 35%,
    rgba(255, 255, 255, 1) 100%
  );
}

.card-no-border .card {
  border-color: #d7dfe3;
  border-radius: 4px;
  margin-bottom: 30px;
  -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
}

.card-body {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.25rem;
}

.pro-img {
  margin-top: -80px;
  margin-bottom: 20px;
}

.little-profile .pro-img img {
  width: 128px;
  height: 128px;
  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 100%;
}

html body .m-b-0 {
  margin-bottom: 0px;
}

h3 {
  line-height: 30px;
  font-size: 21px;
}

.btn-rounded.btn-md {
  padding: 12px 35px;
  font-size: 16px;
}

html body .m-t-10 {
  margin-top: 10px;
}

.btn-primary,
.btn-primary.disabled {
  background: #7460ee;
  border: 1px solid #7460ee;
  -webkit-box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14),
    0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
  box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14),
    0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
  -webkit-transition: 0.2s ease-in;
  -o-transition: 0.2s ease-in;
  transition: 0.2s ease-in;
}

.btn-rounded {
  border-radius: 60px;
  padding: 7px 18px;
}

.m-t-20 {
  margin-top: 20px;
}

.text-center {
  text-align: center !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #455a64;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
