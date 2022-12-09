<script setup>
import { ref, onMounted, watch } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  getCountFromServer,
  orderBy,
} from "firebase/firestore";
import db from "../firebase/init.js";
import Documents from "../components/Documents.vue";
import { useRoute } from "vue-router";

const zips = ref([]);
const title = ref("");
const route = useRoute();
const agg = ref(undefined);
const aggType = ref(undefined);

async function getQuery() {
  let qryId = route.params.id;
  zips.value = [];
  agg.value = undefined;
  aggType.value = undefined;
  let qry = null;
  let qry2 = null;
  if (qryId == 1) {
    title.value = "Cities with population > 100000";
    const zipsRef = collection(db, "zips");
    qry = query(zipsRef, where("pop", ">", 100000));
  } else if (qryId == 2) {
    title.value = "Cities in New York";
    const zipsRef = collection(db, "zips");
    qry = query(zipsRef, where("state", "==", "NY"), limit(10));
  } else if (qryId == 3) {
    title.value = "List zips in DC with population > 40000";
    const zipsRef = collection(db, "zips");
    qry = query(
      zipsRef,
      where("state", "==", "DC"),
      where("pop", ">", 40000),
      limit(10)
    );
  } else if (qryId == 4) {
    title.value = "Count zips in DC (state).";
    const zipsRef = collection(db, "zips");
    qry = query(zipsRef, where("state", "==", "DC"));
    agg.value = await getCountFromServer(qry);
    aggType.value = "count";
  } else if (qryId == 5) {
    title.value = "List zips in DC or cities with population > 100000.";
    const zipsRef = collection(db, "zips");
    qry = query(zipsRef, where("state", "==", "DC"));
    qry2 = query(zipsRef, where("pop", ">", 100000));
  } else if (qryId == 6) {
    title.value = "List zips in DC and sort the data by population.";
    const zipsRef = collection(db, "zips");
    qry = query(zipsRef, where("state", "==", "DC"), orderBy("pop"));
  } else if (qryId == 7) {
    title.value = "Show the total population in DC (state).";
    const zipsRef = collection(db, "zips");
    qry = query(zipsRef, where("state", "==", "DC"));
    aggType.value = "total";
  }

  const querySnap = await getDocs(qry);
  const querySnap2 = qry2 ? await getDocs(qry2) : "";
  querySnap.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    zips.value.push(data);
  });
  if (qry2) {
    let count = 0;
    querySnap2.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      if (data.id != zips.value[count].id) {
        zips.value.push(data);
      }
      count++;
    });
  }

  if (aggType.value == "count") {
    zips.value = [];
    zips.value.push(agg.value.data().count);
  }
  if (aggType.value == "total") {
    let total = zips.value.reduce((pre, curr) => pre + curr.pop, 0);
    zips.value = [];
    zips.value.push(total);
  }
}

watch(() => route.params.id, getQuery);

onMounted(() => {
  getQuery();
});
</script>
<template>
  <Documents :title="title" :data="zips" />
</template>

<style></style>
