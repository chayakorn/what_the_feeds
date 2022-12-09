<script setup>
import { ref } from "vue";

const emit = defineEmits(["addComment"]);
defineProps({
  comments: {
    type: Object,
    required: true,
  },
});

const newComment = ref("");

const addComment = (e) => {
  e.preventDefault();
  emit("addComment", newComment.value);
  newComment.value = "";
};
</script>

<template>
  <div class="p-3">
    <div class="card mt-3">
      <div class="card-body">
        <form @submit="addComment">
          <div class="d-flex">
            <img
              src="../assets/user-icon.png"
              class="m-3"
              alt=""
              width="50"
              height="50"
            />
            <div class="border w-100 rounded p-3">
              <div class="d-flex justify-content-between">
                <textarea
                  name=""
                  id=""
                  rows="3"
                  style="width: 100%; resize: none"
                  required
                  v-model="newComment"
                  placeholder="What do you think ?"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end mt-2">
            <button type="submit" class="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
    <h3 class="mt-3">Comment:</h3>
    <div v-for="comment in comments" :key="comment.id" class="card mt-3">
      <div class="card-body">
        <div class="d-flex">
          <img
            src="../assets/user-icon.png"
            class="m-3"
            alt=""
            width="50"
            height="50"
          />
          <div class="border w-100 rounded p-3">
            <div class="d-flex justify-content-between">
              <h5 class="card-title">
                {{
                  comment.firstname
                    ? `${comment.firstname} ${comment.lastname}`
                    : "Anonymous"
                }}
              </h5>
              <p class="card-title">{{ comment.cmtdate.toDate() }}</p>
            </div>
            <p class="card-text">{{ comment.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
