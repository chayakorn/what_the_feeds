<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    reqired: true,
  },
});
</script>

<template>
  <h2>{{ title }}</h2>
  <ol>
    <div v-for="doc in data" :key="doc.id">
      <li v-if="doc.city">{{ doc.city ? doc.city : doc }}({{ doc.zip }})</li>
      <div v-else>{{ doc }}</div>
    </div>
  </ol>
</template>

<style scoped></style>
