<template>
  <div class="login-container">
    <div class="login-card glass-card">
      <img
        src="../assets/Logo.jpg"
        alt="Anubis Gym Logo"
        class="logo shadow-lg"
      />
      <h2 class="title gradient-text">Anubis Gym</h2>
      <p class="subtitle">Admin Dashboard</p>

      <form @submit.prevent="handleLogin" class="form-area">
        <div class="form-group">
          <i class="bi bi-person-fill form-icon"></i>
          <input
            v-model="username"
            type="text"
            class="form-control custom-input"
            placeholder="Username"
            required
          />
        </div>

        <div class="form-group">
          <i class="bi bi-lock-fill form-icon"></i>
          <input
            v-model="password"
            type="password"
            class="form-control custom-input"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" class="btn btn-gradient w-100 fw-bold py-2 mt-3">
          Login
        </button>

        <div class="text-center mt-3">
          <a href="#" class="forgot-link">Forgot Password?</a>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");

const handleLogin = () => {
  // ---
  // In a real app, you would add your API authentication logic here
  // ---

  console.log("Logging in with:", username.value, password.value);

  // ✅ FIX: Redirect to the "/home" dashboard, not "/"
  router.push("/home");
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  padding: 20px;
}

/* --- Card Style --- */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
}

/* --- Logo & Title --- */
.logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #ff416c;
  margin-bottom: 1rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.gradient-text {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #ccc;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

/* --- Form --- */
.form-area {
  text-align: left;
}

.form-group {
  position: relative;
  margin-bottom: 1.25rem;
}

.form-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: #bbb;
  font-size: 1.1rem;
}

.custom-input {
  border-radius: 12px;
  border: 1px solid #ff3b3b;
  padding: 12px 14px 12px 2.8rem; /* Left padding for icon */
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
}

.custom-input:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  color: white;
  border-color: #ff0000;
  box-shadow: 0 0 10px #ff3b3b;
}

.custom-input::placeholder {
  color: #bbb;
}

/* --- Button & Link --- */
.btn-gradient {
  background: linear-gradient(90deg, #ff0000, #8b0000);
  border: none;
  color: white;
  transition: 0.3s;
  border-radius: 12px;
  font-size: 1.1rem;
}

.btn-gradient:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
}

.forgot-link {
  color: #ccc;
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.3s;
}

.forgot-link:hover {
  color: #ff416c;
}
</style>
