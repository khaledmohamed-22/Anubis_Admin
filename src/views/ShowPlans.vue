<template>
  <div class="plans-container py-5">
    <h2 class="text-center mb-5 gradient-text fw-bold">Subscription Plans</h2>

    <!-- 🔍 Filter Section -->
    <div class="card shadow-sm mb-5 p-4 filter-card">
      <div class="row g-3 align-items-center">
        <div class="col-md-4">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control search-input shadow-sm"
            placeholder="Search by plan name..."
          />
        </div>

        <div class="col-md-3">
          <select
            v-model="selectedPriceFilter"
            class="form-select filter-select shadow-sm"
          >
            <option value="">Filter by Price</option>
            <option value="low">Low (&lt; 200)</option>
            <option value="medium">Medium (200 - 500)</option>
            <option value="high">High (&gt; 500)</option>
          </select>
        </div>

        <div class="col-md-3">
          <select
            v-model="selectedDurationFilter"
            class="form-select filter-select shadow-sm"
          >
            <option value="">Filter by Duration</option>
            <option value="short">Short (&lt; 15 days)</option>
            <option value="medium">Medium (15 - 30 days)</option>
            <option value="long">Long (&gt; 30 days)</option>
          </select>
        </div>

        <div class="col-md-2 text-end">
          <router-link to="/createplan" class="btn btn-gradient w-100">
            + Add Plan
          </router-link>
        </div>
      </div>
    </div>

    <!-- 💎 Plans List -->
    <div v-if="isLoading" class="text-center text-light py-5">
      <div class="spinner-border text-danger" role="status"></div>
      <p class="mt-2">Loading plans...</p>
    </div>

    <div v-else-if="error" class="text-center text-danger py-5">
      <i class="bi bi-exclamation-triangle fs-1"></i>
      <p class="mt-2">Error: {{ error }}</p>
    </div>

    <div class="row g-4" v-else-if="filteredPlans.length">
      <div
        v-for="plan in filteredPlans"
        :key="plan._id"
        class="col-md-6 col-lg-4"
      >
        <div class="card plan-card h-100">
          <div class="card-body text-center d-flex flex-column">
            <h4 class="plan-title mb-3">{{ plan.name }}</h4>
            <p class="price-tag">{{ plan.price }} {{ plan.currency }}</p>

            <div v-if="plan.discount_percent > 0" class="mb-2">
              <span class="badge bg-success"
                >{{ plan.discount_percent }}% OFF</span
              >
            </div>

            <p class="text-light small mb-3">
              Duration: <strong>{{ plan.duration_days }} days</strong>
            </p>

            <ul
              class="list-unstyled text-secondary small text-start mt-3 flex-grow-1"
            >
              <li
                v-for="(feature, i) in plan.features"
                :key="i"
                class="mb-1 border-bottom border-dark pb-1"
              >
                {{ feature }}
              </li>
            </ul>

            <!-- Action Buttons -->
            <div class="plan-buttons mt-4">
              <!-- ✅ CHANGED: Opens Modal -->
              <button class="btn btn-edit" @click="openEditModal(plan)">
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button class="btn btn-delete" @click="deletePlan(plan._id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted mt-5">
      <i class="bi bi-box2-heart fs-1 text-danger"></i>
      <p class="mt-3 fs-5 text-light">No subscription plans found.</p>
    </div>

    <!-- ========================================== -->
    <!-- 🛠️ EDIT PLAN MODAL -->
    <!-- ========================================== -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="edit-card shadow">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="title mb-0">Edit Subscription Plan</h3>
          <button
            class="btn-close btn-close-white"
            @click="closeEditModal"
          ></button>
        </div>

        <form @submit.prevent="updatePlan" class="form-area">
          <div class="form-group">
            <label>Plan Name</label>
            <input
              v-model="currentPlan.name"
              type="text"
              class="form-control"
              placeholder="Enter plan name"
              required
            />
          </div>

          <div class="form-row three-col">
            <div class="form-group">
              <label>Price (EGP)</label>
              <input
                v-model.number="currentPlan.price"
                type="number"
                class="form-control"
                required
              />
            </div>

            <div class="form-group">
              <label>Discount (%)</label>
              <input
                v-model.number="currentPlan.discount_percent"
                type="number"
                min="0"
                max="100"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Duration (Days)</label>
              <input
                v-model.number="currentPlan.duration_days"
                type="number"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Support Level</label>
            <select v-model="currentPlan.support_level" class="form-control">
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="24/7">24/7</option>
            </select>
          </div>

          <div class="form-group">
            <label>Features</label>
            <div class="features-list">
              <div
                v-for="(feature, index) in features"
                :key="index"
                class="feature-item"
              >
                <input
                  v-model="features[index]"
                  type="text"
                  class="form-control"
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  class="btn remove-feature"
                  @click="removeFeature(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button type="button" class="btn add-feature" @click="addFeature">
                <i class="bi bi-plus-lg"></i> Add Feature
              </button>
            </div>
          </div>

          <div class="buttons mt-3">
            <button type="submit" class="btn save-btn" :disabled="isSaving">
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isSaving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL =
  "https://anubis-subscriptionplan.onrender.com/api/v2/subscription_plans/";

export default {
  name: "ShowPlans",
  data() {
    return {
      plans: [],
      searchQuery: "",
      selectedPriceFilter: "",
      selectedDurationFilter: "",
      isLoading: false,
      error: null,

      // --- Edit Modal Data ---
      showEditModal: false,
      currentPlan: null,
      features: [],
      isSaving: false,
    };
  },
  async created() {
    await this.fetchPlans();
  },
  computed: {
    filteredPlans() {
      return this.plans.filter((plan) => {
        const matchesSearch = plan.name
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        const matchesPrice =
          this.selectedPriceFilter === "" ||
          (this.selectedPriceFilter === "low" && plan.price < 200) ||
          (this.selectedPriceFilter === "medium" &&
            plan.price >= 200 &&
            plan.price <= 500) ||
          (this.selectedPriceFilter === "high" && plan.price > 500);

        const matchesDuration =
          this.selectedDurationFilter === "" ||
          (this.selectedDurationFilter === "short" &&
            plan.duration_days < 15) ||
          (this.selectedDurationFilter === "medium" &&
            plan.duration_days >= 15 &&
            plan.duration_days <= 30) ||
          (this.selectedDurationFilter === "long" && plan.duration_days > 30);

        return matchesSearch && matchesPrice && matchesDuration;
      });
    },
  },
  methods: {
    async fetchPlans() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(API_BASE_URL);
        this.plans = response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching plans:", error);
        this.error = "Failed to load plans.";
      } finally {
        this.isLoading = false;
      }
    },

    async deletePlan(planId) {
      if (confirm("Are you sure you want to delete this plan?")) {
        try {
          await axios.delete(API_BASE_URL + planId);
          this.plans = this.plans.filter((plan) => plan._id !== planId);
          alert("Plan deleted successfully!");
        } catch (error) {
          console.error("Error deleting plan:", error);
          alert("Error deleting plan.");
        }
      }
    },

    // --- Edit Modal Logic ---
    openEditModal(plan) {
      // Deep copy the plan so edits don't affect the list view until saved
      this.currentPlan = JSON.parse(JSON.stringify(plan));
      // Initialize discount if missing
      if (this.currentPlan.discount_percent === undefined) {
        this.currentPlan.discount_percent = 0;
      }
      // Extract features to local array
      this.features = [...(this.currentPlan.features || [])];
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.currentPlan = null;
      this.features = [];
    },

    addFeature() {
      this.features.push("");
    },

    removeFeature(index) {
      this.features.splice(index, 1);
    },

    async updatePlan() {
      this.isSaving = true;
      try {
        const planId = this.currentPlan._id || this.currentPlan.id;

        // 1. Update General Data
        const planPayload = {
          name: this.currentPlan.name,
          price: this.currentPlan.price,
          currency: "EGP",
          support_level: this.currentPlan.support_level || "Basic",
          description: this.currentPlan.description || "No description",
          duration_days: this.currentPlan.duration_days,
          features: this.features.filter((f) => f.trim() !== ""),
        };

        await axios.put(API_BASE_URL + planId, planPayload);

        // 2. Update Discount (Separate API)
        if (
          this.currentPlan.discount_percent !== undefined &&
          this.currentPlan.discount_percent !== null
        ) {
          const discountPayload = {
            discount_percent: this.currentPlan.discount_percent,
          };
          await axios.PUT(`${API_BASE_URL}${planId}/discount`, discountPayload);
        }

        alert("✅ Plan updated successfully!");
        this.closeEditModal();
        await this.fetchPlans(); // Refresh the list
      } catch (error) {
        console.error("Error updating plan:", error);
        alert("Failed to update plan.");
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>

<style scoped>
.plans-container {
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  min-height: 100vh;
  color: #fff;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.gradient-text {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- Filter Card --- */
.filter-card {
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  backdrop-filter: blur(10px);
  border: 1px solid #2a2a2a;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.15);
  border-radius: 16px;
}

.search-input,
.filter-select {
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  color: #ffffff;
  border: 1px solid #ff3b3b;
  border-radius: 10px;
  transition: all 0.3s ease;
  padding: 10px 14px;
}

.search-input:focus,
.filter-select:focus {
  color: #ffffff;
  box-shadow: 0 0 10px #ff3b3b;
  border-color: #ff0000;
  background-color: #202020;
  outline: none;
}

.search-input::placeholder {
  color: #bbb;
}

.filter-select option {
  background-color: #1a1a1a;
  color: #fff;
}

/* --- Plan Card --- */
.plan-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05); /* Glass */
  backdrop-filter: blur(5px);
  border: 1px solid #ff0000;
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.plan-card .card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 40px rgba(255, 0, 0, 0.3);
}

.plan-title {
  color: #ff3b3b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price-tag {
  font-size: 1.6rem;
  color: #fff;
  background: linear-gradient(90deg, #ff0000, #8b0000);
  padding: 8px 20px;
  border-radius: 30px;
  display: inline-block;
  font-weight: 700;
}

/* --- Features List --- */
.list-unstyled {
  flex-grow: 1;
}
.list-unstyled li {
  padding: 6px 0;
  color: #ccc;
  font-size: 0.95rem;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

/* --- Add Plan Button --- */
.btn-gradient {
  background: linear-gradient(90deg, #ff0000, #8b0000);
  border: none;
  color: white;
  font-weight: 600;
  transition: 0.3s;
  border-radius: 12px;
  padding: 10px 14px;
}

.btn-gradient:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
}

/* --- Card Buttons --- */
.plan-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.plan-buttons .btn {
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.btn-edit {
  color: #ccc;
  border: 1px solid #ccc;
}
.btn-edit:hover {
  background: #ccc;
  border-color: #ccc;
  color: #000;
}
.btn-delete {
  color: #ff416c;
  border: 1px solid #ff416c;
}
.btn-delete:hover {
  background: #ff416c;
  border-color: #ff416c;
  color: #fff;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}

/* ========================= */
/* 🛠️ MODAL STYLES           */
/* ========================= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Darken background */
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.edit-card {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  border: 1px solid #ff416c;
  box-shadow: 0 0 30px rgba(255, 65, 108, 0.2);
  width: 100%;
  max-width: 650px;
  padding: 30px 40px;
  max-height: 90vh;
  overflow-y: auto;
}

.title {
  color: white;
  font-weight: bold;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  color: #ddd;
  margin-bottom: 5px;
  display: block;
  font-weight: 600;
}

.form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ff3b3b;
  color: white;
  border-radius: 10px;
}
.form-control:focus {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: none;
  border-color: #ff0000;
  color: white;
}
/* Dropdown options fix */
.form-control option {
  background: #222;
  color: white;
}

.form-row.three-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

@media (max-width: 768px) {
  .form-row.three-col {
    grid-template-columns: 1fr;
  }
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.feature-item {
  display: flex;
  gap: 10px;
  align-items: center;
}
.add-feature {
  background: linear-gradient(90deg, #ff0000, #8b0000);
  color: white;
  border: none;
  width: 100%;
  margin-top: 5px;
  border-radius: 8px;
  padding: 8px;
  font-weight: 600;
}
.remove-feature {
  background: #b30202;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
}

.save-btn {
  background: linear-gradient(90deg, #ff0000, #8b0000);
  color: white;
  width: 100%;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
}
.cancel-btn {
  background: transparent;
  color: #ccc;
  border: 1px solid #ccc;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
}
.cancel-btn:hover {
  background: #ccc;
  color: #000;
}
</style>
