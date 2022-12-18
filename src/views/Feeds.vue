<script setup>
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  doc,
  where,
  Timestamp,
  addDoc,
  orderBy,
  updateDoc,
  limit,
  startAfter,
} from "@firebase/firestore";
import { getStorage, uploadBytes, ref as stRef } from "firebase/storage";
import { ref, onMounted } from "vue";
import Post from "../components/Post.vue";
import NewPost from "../components/Newpost.vue";
import db from "../firebase/init";

import { useUsers } from "../stores/user";

const myUser = useUsers();
const posts = ref([]);
const postRef = collection(db, "postFeeds");
const last = ref({});
const getPosts = async (bool) => {
  const qry = query(
    postRef,
    where("ishide", "==", false),
    limit(10),
    orderBy("postdate", "desc")
  );
  if (bool) {
    getDocs(
      query(
        postRef,
        where("ishide", "==", false),
        orderBy("postdate", "desc"),
        startAfter(last.value),
        limit(10)
      )
    ).then((snap) => {
      last.value = snap.docs[snap.docs.length - 1];
      snap.forEach((doc) => {
        let data = { id: doc.id, comments: [], ...doc.data() };
        getDocs(
          query(
            collection(db, "postFeeds", doc.id, "comments"),

            orderBy("cmtdate", "asc")
          )
        )
          .then((snap) => {
            snap.forEach((doc1) => {
              let data1 = doc1.data();
              data1.id = doc1.id;
              data.comments.push(data1);
            });
          })
          .then(() => {
            posts.value.push(data);
          });
      });
    });
  } else
    getDocs(qry).then((snap) => {
      posts.value = [];
      snap.forEach((doc) => {
        last.value = snap.docs[snap.docs.length - 1];
        let data = { id: doc.id, comments: [], ...doc.data() };
        getDocs(
          query(
            collection(db, "postFeeds", doc.id, "comments"),
            orderBy("cmtdate", "asc")
          )
        )
          .then((snap) => {
            snap.forEach((doc1) => {
              let data1 = doc1.data();
              data1.id = doc1.id;
              data.comments.push(data1);
            });
          })
          .then(() => {
            posts.value.push(data);
          });
      });
    });
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

const allcollection = () => {
  getDocs(query(collection(db, "options"))).then((snap) => {
    posts.value = [];
    snap.forEach(async (doc) => {
      let data = { id: doc.id, ...doc.data() };
      posts.value.push(data);
    });
  });
};

const addPost = async (newPost, img) => {
  const dbStorage = getStorage();
  const ImgRef = stRef(dbStorage, "postImg/" + img.name);
  await uploadBytes(ImgRef, img);
  const post = {
    body: newPost,
    dislike: [],
    like: [],

    ishide: false,
    user: myUser.currentUser.id ? myUser.currentUser.id : "",
    postdate: new Date(),
  };
  if (img) {
    post.img =
      "https://firebasestorage.googleapis.com/v0/b/int305fb017.appspot.com/o/postImg%2F" +
      img.name +
      "?alt=media&token=a677e011-df18-4cc0-9ec3-6ce55ff0043f";
  }

  addDoc(collection(db, "postFeeds"), post).then((e) => {
    post.id = e.id;
    post.postdate = Timestamp.fromDate(post.postdate);
    posts.value.unshift(post);
  });
};

const fun = () => {
  console.log(JSON.stringify(posts.value));
};
onMounted(() => {
  getPosts();
  // allcollection();
});
</script>

<template>
  <div>
    <!-- <button @click="fun">asdfs</button> -->
    <NewPost @addPost="addPost" />
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
    />
    <div v-if="last" class="justify-content-center d-flex">
      <div class="text-center fs-3 btn mt-3" @click="getPosts(true)">
        Get more post...
      </div>
    </div>
  </div>
</template>

<style></style>
