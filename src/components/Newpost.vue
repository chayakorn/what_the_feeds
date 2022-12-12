<script setup>
import { ref } from "vue";
const emit = defineEmits(["addPost"]);
const newPost = ref("");
const file = ref("");

const addfile = (e) => {
  if (e.target.files[0] && e.target.files[0].size / 1024 / 1024 < 10) {
    file.value = e.target.files[0];
  } else alert("file is too big");
};
const addPost = (e) => {
  if (newPost.value) {
    e.preventDefault();
    emit("addPost", newPost.value, file.value);
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
            <div class="w-100">
              <textarea
                class="m-2 rounded"
                rows="2"
                style="width: 100%; resize: none"
                v-model="newPost"
                required
                placeholder="What's going on today ?"
              ></textarea>
              <div class="d-flex">
                <label style="cursor: pointer" for="fileinput"
                  ><img src="../assets/image-gallery.png" width="30" alt=""
                /></label>
                <div class="mx-3 opacity-75">
                  {{ file.name ? file.name : "Insert image" }}
                </div>
              </div>

              <input
                class="opacity-0"
                type="file"
                @change="addfile"
                accept="image/*"
                id="fileinput"
              />
            </div>
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
