<template>
  <div class="page-container">
    <div class="container py-5">
      <div class="text-center mb-5 anim-fade-in">
        <h2 class="fw-bold display-5 mb-2">
          <i class="bi bi-gem me-3 gradient-text"></i>
          <span class="gradient-text">Subscription Management</span>
        </h2>
      </div>

      <div class="card glass-card mb-5 anim-fade-up-1">
        <h4 class="fw-bold mb-4 text-white">
          <i class="bi bi-plus-circle-dotted me-2 gradient-icon"></i> Create New
          Plan
        </h4>

        <form @submit.prevent="savePlan">
          <div class="row g-4 mb-3">
            <div class="col-md-12">
              <label
                class="form-label text-white-50 small text-uppercase fw-bold"
                >Plan Name</label
              >
              <div class="input-group">
                <span class="input-group-text glass-input-group border-end-0">
                  <i class="bi bi-tag-fill text-muted"></i>
                </span>
                <input
                  v-model="currentPlan.name"
                  type="text"
                  class="form-control glass-input border-start-0 ps-0"
                  placeholder="e.g., Gold Membership"
                  required
                />
              </div>
            </div>
          </div>

          <div class="row g-4 mb-3">
            <div class="col-md-4">
              <label
                class="form-label text-white-50 small text-uppercase fw-bold"
                >Price (EGP)</label
              >
              <input
                v-model="currentPlan.price"
                type="number"
                class="form-control glass-input"
                placeholder="e.g., 299"
                required
              />
            </div>

            <div class="col-md-4">
              <label
                class="form-label text-white-50 small text-uppercase fw-bold"
                >Duration (Days)</label
              >
              <div class="input-group counter-group">
                <button
                  type="button"
                  class="btn btn-glass-control"
                  @click="adjustDuration(-1)"
                >
                  <i class="bi bi-dash-lg"></i>
                </button>
                <input
                  v-model="currentPlan.duration_days"
                  type="number"
                  class="form-control glass-input text-center no-spin"
                  placeholder="30"
                  required
                />
                <button
                  type="button"
                  class="btn btn-glass-control"
                  @click="adjustDuration(1)"
                >
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>

            <div class="col-md-4">
              <label
                class="form-label text-white-50 small text-uppercase fw-bold"
                >Support Level</label
              >
              <div class="select-wrapper">
                <select
                  v-model="currentPlan.support_level"
                  class="form-select glass-select"
                >
                  <option value="Basic">Basic Support</option>
                  <option value="Standard">Standard Support</option>
                  <option value="Premium">Premium Support</option>
                  <option value="24/7">24/7 Dedicated</option>
                </select>
                <i class="bi bi-caret-down-fill select-arrow"></i>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-white-50 small text-uppercase fw-bold"
              >Description</label
            >
            <textarea
              v-model="currentPlan.description"
              class="form-control glass-input"
              rows="2"
              placeholder="Brief description of the plan..."
            ></textarea>
          </div>

          <div class="mb-5">
            <label class="form-label text-white-50 small text-uppercase fw-bold"
              >Plan Features</label
            >
            <div class="d-flex gap-2 mb-3">
              <input
                v-model="newFeature"
                type="text"
                class="form-control glass-input"
                placeholder="Type a feature and press Enter..."
                @keydown.enter.prevent="addFeature"
              />
              <button
                type="button"
                @click="addFeature"
                class="btn btn-outline-light rounded-pill px-4"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(feature, index) in currentPlan.features"
                :key="index"
                class="badge feature-badge py-2 px-3 rounded-pill"
              >
                {{ feature }}
                <i
                  class="bi bi-x-circle-fill ms-2 remove-icon"
                  @click="removeFeature(index)"
                  role="button"
                ></i>
              </span>
            </div>
          </div>

          <div class="text-center">
            <button
              type="submit"
              class="btn btn-gradient btn-lg px-5"
              :disabled="isSaving"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isSaving ? "Saving..." : "Create Plan" }}
            </button>
          </div>
        </form>
      </div>

      <div class="card glass-card anim-fade-up-2">
        <h4 class="fw-bold mb-4 text-white">
          <i class="bi bi-collection me-2 gradient-icon"></i> Existing Plans
        </h4>

        <div v-if="isLoading" class="text-center py-5 text-muted">
          <div class="spinner-border text-danger" role="status"></div>
          <p class="mt-2">Loading plans...</p>
        </div>

        <div v-else-if="plans.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-clipboard-x fs-1 opacity-50"></i>
          <p class="mt-3">No plans found. Start forging your legacy above!</p>
        </div>

        <div v-else class="row g-4">
          <div v-for="plan in plans" :key="plan._id" class="col-md-6 col-lg-4">
            <div class="card plan-sub-card h-100">
              <div class="card-body d-flex flex-column text-center p-4">
                <h5 class="card-title fw-bold text-white mb-2">
                  {{ plan.name }}
                </h5>
                <div class="mb-3">
                  <span
                    class="badge bg-dark border border-secondary text-white-50"
                    >{{ plan.duration_days }} Days</span
                  >
                </div>

                <h3 class="gradient-text fw-bold mb-3 display-6">
                  {{ plan.price }} <small class="fs-6 text-white">EGP</small>
                </h3>

                <p class="small text-white-50 mb-4">{{ plan.description }}</p>

                <div class="flex-grow-1 text-start px-2 mb-4">
                  <ul class="list-unstyled small text-white-50">
                    <li
                      v-for="(feat, i) in plan.features"
                      :key="i"
                      class="mb-2 d-flex align-items-start"
                    >
                      <i
                        class="bi bi-check-circle-fill text-danger me-2 mt-1 gradient-icon"
                      ></i>
                      <span style="color: white">{{ feat }}</span>
                    </li>
                  </ul>
                </div>

                <div class="d-flex justify-content-center gap-3 mt-auto">
                  <button
                    @click="editPlan(plan._id)"
                    class="btn btn-glass-edit rounded-pill px-4 fw-semibold"
                  >
                    <i class="bi bi-pencil-square me-1"></i> Edit
                  </button>
                  <button
                    @click="deletePlan(plan._id)"
                    class="btn btn-glass-delete rounded-pill px-4 fw-semibold"
                    style="color: white"
                  >
                    <i class="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_URL =
  "https://anubis-subscriptionplan.onrender.com/api/v2/subscription_plans/";

export default {
  data() {
    return {
      currentPlan: {
        name: "",
        price: null,
        currency: "EGP",
        description: "",
        duration_days: 30, // Default value for counter
        support_level: "Basic",
        features: [],
      },
      newFeature: "",
      plans: [],
      isLoading: false,
      isSaving: false,
    };
  },
  created() {
    this.loadPlans();
  },
  methods: {
    // 🔥 NEW METHOD for Duration Counter
    adjustDuration(amount) {
      let newVal = (this.currentPlan.duration_days || 0) + amount;
      if (newVal < 1) newVal = 1; // Prevent negative or zero
      this.currentPlan.duration_days = newVal;
    },
    async loadPlans() {
      this.isLoading = true;
      try {
        const response = await axios.get(API_URL);
        this.plans = response.data.data || response.data;
      } catch (error) {
        console.error("Error loading plans:", error);
      } finally {
        this.isLoading = false;
      }
    },
    addFeature() {
      const feature = this.newFeature.trim();
      if (feature && !this.currentPlan.features.includes(feature)) {
        this.currentPlan.features.push(feature);
        this.newFeature = "";
      }
    },
    removeFeature(index) {
      this.currentPlan.features.splice(index, 1);
    },
    async savePlan() {
      this.isSaving = true;
      try {
        const payload = { ...this.currentPlan };
        payload.features = payload.features.filter((f) => f.trim() !== "");

        await axios.post(API_URL, payload);

        alert("✅ Plan saved successfully!");
        this.resetForm();
        this.loadPlans();
      } catch (error) {
        console.error("Error saving plan:", error);
        alert("Failed to save plan.");
      } finally {
        this.isSaving = false;
      }
    },
    async deletePlan(id) {
      if (confirm("Are you sure you want to delete this plan?")) {
        try {
          await axios.delete(API_URL + id);
          this.plans = this.plans.filter((p) => p._id !== id);
        } catch (error) {
          console.error("Error deleting plan:", error);
          alert("Failed to delete plan.");
        }
      }
    },
    editPlan(planId) {
      this.$router.push({ name: "EditPlanPage", params: { planId } });
    },
    resetForm() {
      this.currentPlan = {
        name: "",
        price: null,
        currency: "EGP",
        description: "",
        duration_days: 30,
        support_level: "Basic",
        features: [],
      };
      this.newFeature = "";
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap");

/* --- Core Theme --- */
.page-container {
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  color: #fff;
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
}

.gradient-text,
.gradient-icon {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- Glass Components --- */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* --- Standard Glass Inputs --- */
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}
.glass-input:focus {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.5);
  border-color: #ff416c;
  color: #fff;
}
.glass-input::placeholder {
  color: #6c757d;
}
.glass-input-group {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ------------------------------------------------ */
/* 🔥🔥 NEW: Enhanced Duration Counter Styling 🔥🔥 */
/* ------------------------------------------------ */

/* Remove default browser spin buttons */
.no-spin::-webkit-inner-spin-button,
.no-spin::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spin {
  -moz-appearance: textfield;
}

.counter-group {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.counter-group .glass-input {
  border: none;
  background: transparent;
  font-weight: 700;
  font-size: 1.1rem;
}
.counter-group .glass-input:focus {
  box-shadow: none;
}

.btn-glass-control {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 45px;
  border-radius: 10px !important;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-glass-control:hover {
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
  color: white;
  transform: scale(1.05);
}
.btn-glass-control:active {
  transform: scale(0.95);
}

/* ------------------------------------------------ */
/* 🔥🔥 NEW: Enhanced Dropdown (Select) Styling 🔥🔥 */
/* ------------------------------------------------ */

.select-wrapper {
  position: relative;
}

.glass-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  background-image: none; /* Remove default arrow */
}

.glass-select:focus {
  background-color: rgba(20, 20, 20, 0.9); /* Dark background on focus */
  box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.5);
  border-color: #ff416c;
  color: #fff;
}

/* Custom Options Styling (Browser Dependent, primarily for Firefox/Chrome on Dark Mode) */
.glass-select option {
  background-color: #1a1a1a;
  color: #fff;
  padding: 10px;
}

/* Custom Arrow Icon using absolute positioning */
.select-arrow {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: #ff416c; /* Brand Red */
  pointer-events: none; /* Let clicks pass through */
  z-index: 3;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.glass-select:focus + .select-arrow {
  transform: translateY(-50%) rotate(180deg);
}

/* --- Buttons & Lists (From previous steps) --- */
.btn-gradient {
  background: linear-gradient(90deg, #ff4b2b, #ff416c, #ff4b2b);
  background-size: 200% auto;
  border: none;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  transition: 0.4s;
}
.btn-gradient:hover:not(:disabled) {
  background-position: right center;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.4);
}

.btn-glass-edit,
.btn-glass-delete {
  border-radius: 50px;
  transition: 0.3s;
}
.btn-glass-edit {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
.btn-glass-edit:hover {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  border-color: transparent;
}
.btn-glass-delete {
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff4b2b;
}
.btn-glass-delete:hover {
  background: #d90429;
  color: white;
  border-color: transparent;
}

/* --- Plan Cards --- */
.plan-sub-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: 0.3s;
}
.plan-sub-card:hover {
  transform: translateY(-5px);
  border-color: #ff416c;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}
.feature-badge {
  background: #ffffff1a;
  border: 1px solid rgba(255, 65, 108, 0.3);
  color: #ffdde1;
}
.feature-badge:hover {
  background: rgba(255, 65, 108, 0.25);
}

/* --- Animations --- */
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
  animation: fadeInUp 0.8s 0.2s ease-out backwards;
}

/* Add subtle inner shadow for depth */
/* Add subtle inner shadow for depth */
.glass-select {
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.05);
}

/* Add hover effect for interactivity */
.glass-select:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: #ff4b2b;
}

/* Smooth transition for arrow rotation */
.select-arrow {
  transition: transform 0.3s ease, color 0.3s ease;
}

/* Arrow color change on focus for feedback */
.glass-select:focus + .select-arrow {
  color: #fff;
}

.glass-select:focus {
  animation: glowBorder 0.6s ease-out forwards;
}

@keyframes glowBorder {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 65, 108, 0.5);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.5);
  }
}
</style>
