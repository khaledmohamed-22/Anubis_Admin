<template>
  <div class="trainees-container py-5">
    <h2 class="page-title fw-bold display-6">All Trainee Profiles</h2>

    <div v-if="isLoading" class="text-center py-5 text-light">
      <div
        class="spinner-border text-danger"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 fs-5">Fetching trainee data...</p>
    </div>

    <div v-else-if="error" class="text-center py-5 text-danger">
      <i class="bi bi-exclamation-triangle-fill fs-1"></i>
      <p class="mt-3 fs-5">Error loading data: {{ error }}</p>
    </div>

    <div v-else-if="trainees.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-person-x fs-1"></i>
      <p class="mt-3 fs-5">No trainee profiles found.</p>
    </div>

    <div v-else>
      <div class="card glass-card filter-card shadow-sm mb-5 p-4">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control search-input shadow-sm"
          placeholder=" Search by trainee name..."
        />
      </div>

      <transition-group
        name="fade"
        tag="div"
        class="row g-4 justify-content-center"
        v-if="filteredTrainees.length > 0"
      >
        <div
          v-for="trainee in filteredTrainees"
          :key="trainee._id"
          class="col-md-6 col-lg-4 d-flex"
        >
          <div class="card trainee-card h-100 shadow-lg p-3">
            <div class="d-flex align-items-center mb-3">
              <img
                :src="
                  trainee.profile_Image ||
                  'https://via.placeholder.com/100/1e2b34/ffffff?text=User'
                "
                alt="Profile Image"
                class="rounded-circle profile-img me-3"
              />
              <div>
                <h5 class="card-title mb-0 gradient-text">
                  {{ trainee.name.first_name }} {{ trainee.name.last_name }}
                </h5>
                <br />
                <span class="text-light small"
                  >{{ trainee.gender }} | Age: {{ trainee.age }}</span
                >
              </div>
            </div>

            <div class="card-body p-0">
              <ul class="list-unstyled detail-list">
                <li>
                  <i class="bi bi-star-fill me-2 text-warning"></i>
                  Effort Level: <strong>{{ trainee.effort_level }}</strong>
                </li>
                <li>
                  <i class="bi bi-calendar-check me-2 text-info"></i>
                  Attendance: <strong>{{ trainee.gone_Days || 0 }} days</strong>
                </li>
                <li v-if="trainee.SubscriptionPlan">
                  <i class="bi bi-lightning-charge-fill me-2 text-danger"></i>
                  Plan: <strong>{{ trainee.SubscriptionPlan.name }}</strong>
                </li>
                <li v-else>
                  <i class="bi bi-slash-circle me-2 text-secondary"></i>
                  Plan: <span class="text-danger">Not Assigned</span>
                </li>
              </ul>
            </div>
            <div class="card-footer bg-transparent border-0 pt-3 text-end">
              <button class="btn btn-sm btn-outline-light edit-btn me-2">
                <i class="bi bi-pencil"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </transition-group>

      <div v-else class="text-center py-5 text-muted">
        <i class="bi bi-search fs-1"></i>
        <p class="mt-3 fs-5">No trainees found matching your search.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"; // Import computed

const API_URL =
  "https://anubis-traineeprofile-services.onrender.com/api/v2/trainee_profile/";

const trainees = ref([]);
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref(""); // State for the search input

const fetchTrainees = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data (Status: ${response.status})`);
    }
    const data = await response.json();
    trainees.value = data.data || [];
  } catch (err) {
    console.error("Fetch Error:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Computed property to filter trainees based on search query
const filteredTrainees = computed(() => {
  if (!searchQuery.value) {
    return trainees.value;
  }
  return trainees.value.filter((trainee) => {
    const fullName =
      `${trainee.name.first_name} ${trainee.name.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.value.toLowerCase());
  });
});

onMounted(() => {
  fetchTrainees();
});
</script>
<style scoped>
.page-title {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
/* --- OLD Search Bar Style (Restored) --- */
.glass-card {
  background: none;
  backdrop-filter: blur(10px);
  color: white;
}

.filter-card {
  box-shadow: none;
}

.search-input {
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  color: #ffffff;
  border: 1px solid #ff3b3b;
  border-radius: 10px;
  transition: all 0.3s ease;
  padding: 12px 14px;
}

.search-input:focus {
  color: #ffffff;
  box-shadow: 0 0 10px #ff3b3b;
  border-color: #ff0000;
  background-color: #202020;
}

.search-input::placeholder {
  color: #bbb;
}

/* --- FIXED CARD SIZE --- */
.trainee-card {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;

  /* STATIC SIZE */
  width: 100%;
  max-width: 340px; /* ثابت */
  min-height: 430px; /* ثابت */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  margin: 0 auto;
}

.card-title {
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

/* Profile section */
.profile-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 3px solid #ff416c;
  border-radius: 50%;
  transition: 0.3s;
}

.trainee-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 35px rgba(255, 65, 108, 0.3);
  border-image-source: linear-gradient(90deg, #ff4b2b, #ff416c);
  border-image-slice: 1;
}

.trainee-card:hover .profile-img {
  transform: scale(1.07);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.5);
}

/* Details List */
.detail-list {
  margin-top: 15px;
}
.detail-list li {
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #d5d5d5;
  font-size: 0.95rem;
}

.detail-list li strong {
  color: #fff;
}

/* Ensure scrolling content doesn't break card height */
.trainee-card .card-body {
  flex-grow: 1;
  overflow: hidden;
}

/* Footer */
.card-footer {
  padding-top: 15px;
}

/* Edit Button */
.edit-btn {
  border-radius: 50px;
  font-weight: 600;
  transition: 0.3s;
}
.edit-btn:hover {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  border-color: #ff416c;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(255, 65, 108, 0.25);
}
</style>
