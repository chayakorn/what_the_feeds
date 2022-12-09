<script setup>
import {
  getDocs,
  Timestamp,
  collection,
  query,
  where,
  addDoc,
} from "@firebase/firestore";
import { computed, ref, onMounted } from "vue";
import db from "../firebase/init";
import { useUsers } from "../stores/user.js";
import CommentList from "../components/Commentlist.vue";

const myUser = useUsers();
const emits = defineEmits([
  "like",
  "unlike",
  "dislike",
  "undislike",
  "addComment",
  "hide-unhide",
]);
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const isShowComment = ref(false);

const countLike = computed(() =>
  props.post.like ? props.post.like.length : 0
);
const countDislike = computed(() =>
  props.post.dislike ? props.post.dislike.length : 0
);
const countComment = computed(() =>
  props.post.comments ? props.post.comments.length : 0
);

const user = ref();
const getUser = () => {
  if (props.post.user) {
    getDocs(
      query(collection(db, "users"), where("__name__", "==", props.post.user))
    ).then((snap) => {
      snap.forEach((doc) => {
        user.value = doc.data();
        user.value.id = doc.id;
      });
    });
  }
};

const containLike = () => {
  if (props.post.like) {
    return props.post.like.some((value) => {
      return value == myUser.currentUser.id;
    });
  }
  return false;
};

const containDislike = () => {
  if (props.post.dislike) {
    return props.post.dislike.some((value) => {
      return value == myUser.currentUser.id;
    });
  }
  return false;
};

const like = (e) => {
  if (containLike()) {
    emits("unlike", props.index, containDislike());
  } else {
    emits("like", props.index, containDislike());
  }
};
const dislike = (e) => {
  if (containDislike()) {
    emits("undislike", props.index, containLike());
  } else {
    emits("dislike", props.index, containLike());
  }
};

const showComment = () => {
  isShowComment.value = !isShowComment.value;
};

const addComment = (newComment) => {
  emits("addComment", newComment, props.index);
};

const hide = () => {
  emits("hide-unhide", props.index);
};

onMounted(() => {
  getUser();
});
</script>

<template>
  <div class="d-flex position-relative bg-light mt-3 text-dark p-3">
    <div style="width: 100%">
      <div class="d-flex">
        <div class="d-flex w-100">
          <img src="../assets/user-icon.png" alt="" width="60" height="60" />
          <div class="d-flex justify-content-between w-100">
            <div>
              <h5 class="mt-0 mx-3">
                {{ user ? `${user.firstname} ${user.lastname}` : "Anonymous" }}
              </h5>
              <p class="mt-0 mx-3">{{ post.postdate.toDate() }}</p>
            </div>
            <div>
              <div
                v-if="!props.post.ishide && $route.params.user"
                @click="hide"
                style="cursor: pointer"
              >
                <img src="../assets/eye.png" width="30" height="30" alt="" />
              </div>
              <div
                v-else-if="$route.params.user"
                @click="hide"
                style="cursor: pointer"
              >
                <img src="../assets/hide.png" width="30" height="30" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="m-3">
        <p>
          {{ post.body }}
        </p>
      </div>

      <div
        class="btn-group btn-group-sm"
        role="group"
        aria-label="Small button group"
      >
        <form>
          <input
            type="radio"
            class="btn-check"
            name="vbtn-radio"
            autocomplete="off"
            :disabled="!myUser.loginStatus"
            :checked="containLike()"
          />
          <label class="btn btn-outline-primary" @click="like">
            Like ({{ countLike }})</label
          >
          <input
            type="radio"
            class="btn-check"
            name="vbtn-radio"
            autocomplete="off"
            :disabled="!myUser.loginStatus"
            :checked="containDislike()"
          />
          <label class="btn btn-outline-danger" @click="dislike">
            Dislike ({{ countDislike }})</label
          >
          <input
            type="checkbox"
            class="btn-check"
            name="vbtn-radio"
            autocomplete="off"
            :checked="isShowComment"
          /><label class="btn btn-outline-dark" @click="showComment">
            Comment ({{ countComment }})</label
          >
        </form>
      </div>
      <CommentList
        v-if="isShowComment"
        @add-comment="addComment"
        :comments="post.comments"
      />
    </div>
  </div>
</template>

<style></style>
