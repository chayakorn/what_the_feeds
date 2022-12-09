<script setup>
import { ref } from "vue";
const emit = defineEmits(["addPost"]);
const newPost = ref("");

const addPost = (e) => {
  if (newPost.value) {
    e.preventDefault();
    emit("addPost", newPost.value);
    newPost.value = "";
  }
};
</script>

<template>
  <div>
    <div class="d-flex position-relative bg-light mt-3 text-dark p-3">
      <div style="width: 100%">
        <form @submit="addPost">
          <div class="d-flex">
            <img src="../assets/user-icon.png" alt="" width="60" height="60" />
            <textarea
              class="m-2 rounded"
              rows="2"
              style="width: 100%; resize: none"
              v-model="newPost"
              required
              placeholder="What's going on today ?"
            ></textarea>
          </div>
          <div class="d-flex justify-content-end px-2 pt-2">
            <button type="submit" class="btn btn-primary">Post</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style></style>
