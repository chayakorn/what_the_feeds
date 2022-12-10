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
} from "@firebase/firestore";
import { ref, onMounted } from "vue";
import Post from "../components/Post.vue";
import NewPost from "../components/Newpost.vue";
import db from "../firebase/init";

import { useUsers } from "../stores/user";

const myUser = useUsers();
const posts = ref([]);
const postRef = collection(db, "postFeeds");
const getPosts = async () => {
  const qry = query(
    postRef,
    where("ishide", "==", false),
    orderBy("postdate", "desc")
  );
  //   onSnapshot(qry, (snap) => {
  //     posts.value = [];
  //     snap.forEach((doc) => {
  //       let data = doc.data();
  //       data.id = doc.id;
  //       data.comments = [];
  //       getDocs(query(collection(db, "postFeeds", doc.id, "comments")))
  //         .then((snap) => {
  //           snap.forEach((doc1) => {
  //             let data1 = doc1.data();
  //             data1.id = doc1.id;
  //             data.comments.push(data1);
  //           });
  //         })
  //         .then(() => {
  //           posts.value.push(data);
  //         });
  //     });
  //   });
  getDocs(qry).then((snap) => {
    posts.value = [];
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
    posts.value.unshift(post);
  });
};

onMounted(() => {
  getPosts();
});
</script>

<template>
  <div>
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
  </div>
</template>

<style></style>
