<template>
  <div class="app-container">
    <SideBar v-if="!$route.meta.hideSidebar" />

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideBar from "./components/SideBar.vue";

export default {
  components: { SideBar },
};
</script>

<style>
/* Global background style from your file */
body {
  margin: 0;
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
}

/* Layout styles for the app */
.app-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  /* This prevents the page from being cut off */
  min-height: 100vh;
}
</style>
