<template>
  <div class="landing-container">
    <nav class="navbar navbar-dark shadow-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="../assets/Logo.jpg" alt="Anubis Gym Logo" class="logo" />
          <span class="brand-title gradient-text">Anubis Gym</span>
        </a>
        <button class="btn btn-gradient" @click="goToLogin">
          <i class="bi bi-box-arrow-in-right me-2"></i>
          Admin Login
        </button>
      </div>
    </nav>

    <header class="hero-section text-center text-white">
      <div class="hero-overlay">
        <h1 class="display-3 fw-bold anim-fade-up-1">FORGE YOUR LEGACY</h1>
        <p class="lead col-md-8 mx-auto anim-fade-up-2">
          Welcome to Anubis Gym: the Biggest GYM In Aswan. Where strength meets
          legacy. We are not just a gym; we are a community dedicated to
          building the best version of you.
        </p>
        <button class="btn btn-gradient btn-lg anim-fade-up-3">Join Now</button>
      </div>
    </header>

    <section class="features-section py-5">
      <div class="container">
        <h2 class="text-center gradient-text fw-bold mb-5 anim-fade-in">
          WHY CHOOSE ANUBIS?
        </h2>
        <div class="row g-4">
          <div class="col-md-4 anim-feature-card-1">
            <div class="card feature-card glass-card h-100">
              <i class="bi bi-boxes card-icon"></i>
              <h4 class="fw-semibold">Premium Equipment</h4>
              <p>
                State-of-the-art machinery for every workout, from cardio to
                heavy lifting.
              </p>
            </div>
          </div>
          <div class="col-md-4 anim-feature-card-2">
            <div class="card feature-card glass-card h-100">
              <i class="bi bi-star-fill card-icon"></i>
              <h4 class="fw-semibold">Expert Coaches</h4>
              <p>
                Certified, professional coaches dedicated to your goals and
                specialized in various disciplines.
              </p>
            </div>
          </div>
          <div class="col-md-4 anim-feature-card-3">
            <div class="card feature-card glass-card h-100">
              <i class="bi bi-shield-lock-fill card-icon"></i>
              <h4 class="fw-semibold">24/7 Secure Access</h4>
              <p>
                Train on your schedule. Our facility is open all day, every day,
                with top-tier security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="text-center py-4">
      <div class="social-icons mb-3">
        <i class="bi bi-facebook"></i>
        <i class="bi bi-instagram"></i>
        <i class="bi bi-twitter-x"></i>
        <i class="bi bi-youtube"></i>
      </div>
      <p class="text-muted">&copy; 2025 Anubis Gym. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
/* --- Font Import (from SideBar.vue) --- */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap");

/* --- Main Container & Navbar --- */
.landing-container {
  background: linear-gradient(135deg, #000000, #1a1a1a, #111);
  color: #fff;
  font-family: "Montserrat", sans-serif;
}

/* ENHANCED: Sticky Navbar */
.navbar {
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent base */
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ff416c;
  position: sticky; /* Stick to top */
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
}

.logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #ff416c;
}
.brand-title {
  font-size: 1.8rem;
  font-weight: 700;
}
.gradient-text {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- ENHANCED Button Style (from previous step) --- */
.btn-gradient {
  background: linear-gradient(90deg, #ff4b2b, #ff416c, #ff4b2b);
  background-size: 200% auto;
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 12px;
  padding: 0.5rem 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
}
.btn-gradient:hover {
  background-position: right center;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.4);
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  /* Adjust padding to account for sticky nav height */
  padding: 10rem 2rem 8rem 2rem;
  background: url("../assets/pexels-victorfreitas-841131.jpg") no-repeat center
    center;
  background-size: cover;
  background-attachment: fixed; /* Parallax effect */
}
.hero-overlay {
  position: relative;
  z-index: 2;
  /* ENHANCED: Gradient overlay */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.8)
  );
  padding: 3rem;
  border-radius: 20px;
}
.hero-section .display-3 {
  font-weight: 900; /* Bolder font */
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}
.hero-section .btn-lg {
  padding: 0.8rem 2.5rem;
  font-size: 1.2rem;
  margin-top: 1rem;
}

/* --- Features Section --- */
.features-section {
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
}
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  /* ENHANCED: Subtle border by default */
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-5px);
  /* ENHANCED: "Ignite" border on hover */
  border-image-source: linear-gradient(90deg, #ff4b2b, #ff416c);
  border-image-slice: 1;
  box-shadow: 0 0 30px rgba(255, 65, 108, 0.3);
}

.card-icon {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}
/* ENHANCED: Icon pops on hover */
.glass-card:hover .card-icon {
  transform: scale(1.1);
}

.feature-card h4 {
  color: #fff;
  margin-bottom: 1rem;
}
.feature-card p {
  color: #ccc;
  font-size: 0.95rem;
}

/* --- ENHANCED: Footer --- */
footer {
  background-color: #111;
  border-top: 1px solid #2a2a2a;
}
.social-icons i {
  font-size: 1.5rem;
  margin: 0 1rem;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}
.social-icons i:hover {
  color: #ff416c;
  transform: scale(1.2) translateY(-2px);
}
footer p {
  font-size: 0.9rem;
}

/* --- ANIMATIONS --- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.anim-fade-in {
  animation: fadeIn 1s ease-out;
}
.anim-fade-up-1 {
  animation: fadeInUp 0.8s ease-out;
}
.anim-fade-up-2 {
  animation: fadeInUp 1s 0.2s ease-out backwards; /* 'backwards' fills in 0 opacity before anim */
}
.anim-fade-up-3 {
  animation: fadeInUp 1s 0.4s ease-out backwards;
}
.anim-feature-card-1 {
  animation: fadeInUp 0.8s 0.2s ease-out backwards;
}
.anim-feature-card-2 {
  animation: fadeInUp 0.8s 0.4s ease-out backwards;
}
.anim-feature-card-3 {
  animation: fadeInUp 0.8s 0.6s ease-out backwards;
}
</style>
