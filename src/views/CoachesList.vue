<template>
  <div class="coaches-container py-5">
    <h2 class="page-title fw-bold display-6">💪 All Coach Profiles</h2>
    <p class="text-muted mb-5">Review and verify coach profiles.</p>

    <div v-if="isLoading" class="text-center py-5 text-light">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Fetching coach data...</p>
    </div>

    <div v-else-if="error" class="text-center py-5 text-danger">
      <i class="bi bi-exclamation-triangle-fill fs-1"></i>
      <p class="mt-3">Error loading data: {{ error }}</p>
    </div>

    <div v-else-if="coaches.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-person-x fs-1"></i>
      <p class="mt-3">No coach profiles found.</p>
    </div>

    <div v-else class="row g-4 justify-content-center">
      <div
        v-for="coach in coaches"
        :key="coach._id"
        class="col-md-6 col-lg-4 d-flex"
      >
        <div class="card coach-card h-100 shadow-lg p-3">
          <div class="d-flex align-items-center mb-3">
            <img
              :src="
                coach.profile_Image ||
                'https://via.placeholder.com/100/1e2b34/ffffff?text=Coach'
              "
              alt="Profile Image"
              class="rounded-circle profile-img me-3"
            />
            <div>
              <h5 class="card-title mb-0 gradient-text">
                {{ coach.name.first_name }} {{ coach.name.last_name }}
              </h5>
              <span class="text-light small">
                {{ coach.gender }} | Age: {{ coach.age }}
              </span>
            </div>
          </div>

          <div class="card-body p-0">
            <ul class="list-unstyled detail-list">
              <li>
                <i class="bi bi-star-fill me-2 text-warning"></i>
                Specialty: <strong>{{ coach.specialization || "N/A" }}</strong>
              </li>
              <li>
                <i class="bi bi-calendar-check me-2 text-info"></i>
                Experience:
                <strong>{{ coach.experience_years || 0 }} years</strong>
              </li>
              <li>
                <i
                  class="bi me-2"
                  :class="
                    coach.is_verified
                      ? 'bi-patch-check-fill text-success'
                      : 'bi-patch-exclamation-fill text-danger'
                  "
                ></i>
                Status:
                <strong>{{
                  coach.is_verified ? "Verified" : "Not Verified"
                }}</strong>
              </li>
            </ul>
          </div>

          <div class="card-footer bg-transparent border-0 pt-3 text-end">
            <button class="btn btn-sm btn-outline-light me-2">
              <i class="bi bi-pencil"></i> Edit Profile
            </button>

            <button
              v-if="!coach.is_verified"
              class="btn btn-sm btn-outline-success me-2"
              @click="verifyCoach(coach)"
              :disabled="isVerifying === coach._id"
            >
              <span
                v-if="isVerifying === coach._id"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <i v-else class="bi bi-check-circle"></i>
              Verify Coach
            </button>
            <span v-else class="btn btn-sm btn-success disabled">
              <i class="bi bi-patch-check-fill"></i> Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const GET_API_URL = "https://anubis-gym-2.onrender.com/api/v3/trainer_profile/";
const VERIFY_API_URL =
  "https://anubis-gym-2.onrender.com/api/v3/trainer_profile/verify/";

const coaches = ref([]);
const isLoading = ref(false);
const error = ref(null);
const isVerifying = ref(null);

// --- Fetch all coaches (GET) ---
const fetchCoaches = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetch(GET_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data (Status: ${response.status})`);
    }
    const data = await response.json();

    // Use the same logic as TraineesList to find the data array
    coaches.value = data.data || data || [];
  } catch (err) {
    console.error("Fetch Error:", err);
    error.value = err.message; // This will trigger the error message in the template
  } finally {
    isLoading.value = false;
  }
};

// --- Verify a coach (PUT) ---
const verifyCoach = async (coachToVerify) => {
  isVerifying.value = coachToVerify._id;
  try {
    const response = await fetch(VERIFY_API_URL + coachToVerify._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to verify (Status: ${response.status})`);
    }

    // Update local state
    const index = coaches.value.findIndex((c) => c._id === coachToVerify._id);
    if (index !== -1) {
      // ✅ THE FIX IS HERE
      coaches.value[index].is_verified = true;
    }
  } catch (err) {
    console.error("Verification Error:", err);
    alert(`Error verifying coach: ${err.message}`);
  } finally {
    isVerifying.value = null;
  }
};

onMounted(() => {
  fetchCoaches();
});
</script>
<style scoped>
/* These styles are identical to TraineesList.vue */
.coaches-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  color: #fff;
}
.page-title {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.coach-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
.coach-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}
.profile-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 3px solid #ff416c;
}
.detail-list li {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.95rem;
}
.gradient-text {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
