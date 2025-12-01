<template>
  <!-- Only show form if currentPlan is loaded -->
  <div v-if="currentPlan" class="edit-plan-wrapper">
    <div class="edit-card shadow">
      <h2 class="title">
        <i class="bi bi-pencil-square me-2"></i> Edit Subscription Plan
      </h2>
      <p class="subtitle">
        Update your plan details and click save to confirm changes.
      </p>

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

        <!-- 3-Column Row -->
        <div class="form-row three-col">
          <div class="form-group">
            <label>Price (EGP)</label>
            <input
              v-model.number="currentPlan.price"
              type="number"
              class="form-control"
              placeholder="e.g. 200"
              required
            />
          </div>

          <!-- ✅ DISCOUNT FIELD -->
          <div class="form-group">
            <label>Discount (%)</label>
            <input
              v-model.number="currentPlan.discount_percent"
              type="number"
              min="0"
              max="100"
              class="form-control"
              placeholder="e.g. 10"
            />
          </div>

          <div class="form-group">
            <label>Duration (Days)</label>
            <input
              v-model.number="currentPlan.duration_days"
              type="number"
              class="form-control"
              placeholder="e.g. 30"
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

        <!-- Features Section -->
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

        <!-- Action Buttons -->
        <div class="buttons">
          <button type="submit" class="btn save-btn" :disabled="isSaving">
            <span
              v-if="isSaving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="bi bi-check2-circle me-2"></i>
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
          <button type="button" class="btn cancel-btn" @click="goBack">
            <i class="bi bi-arrow-left me-2"></i> Back
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="loading">
    <div class="spinner"></div>
    <p>Loading plan details...</p>
  </div>
</template>

<script>
import axios from "axios";

// ✅ API Base URL
const API_URL =
  "https://anubis-subscriptionplan.onrender.com/api/v2/subscription_plans/";

export default {
  name: "EditPlan",
  props: ["planId"],
  data() {
    return {
      currentPlan: null,
      features: [],
      isSaving: false,
    };
  },
  async created() {
    await this.fetchPlan();
  },
  methods: {
    // ✅ CRITICAL FIX: Fetch ALL plans first, then filter locally.
    // This bypasses the server's 500 Error on the single-fetch endpoint.
    async fetchPlan() {
      try {
        // 1. Get the full list (The link that works)
        const response = await axios.get(API_URL);
        const allPlans = response.data.data || response.data;

        // 2. Find the specific plan by ID from the list
        // We check both _id (MongoDB) and id just in case
        const foundPlan = allPlans.find(
          (p) =>
            String(p._id) === String(this.planId) ||
            String(p.id) === String(this.planId)
        );

        if (!foundPlan) {
          throw new Error("Plan not found in the list.");
        }

        // 3. Populate currentPlan
        this.currentPlan = {
          discount_percent: 0, // Default value
          ...foundPlan,
        };

        // Populate features array separately for the UI
        this.features = [...(this.currentPlan.features || [])];
      } catch (error) {
        console.error("Error fetching plan:", error);
        alert(
          "Failed to load plan details (Plan might not exist or server error)."
        );
        this.$router.push({ name: "showPlans" }); // Redirect on error
      }
    },

    addFeature() {
      this.features.push("");
    },

    removeFeature(index) {
      this.features.splice(index, 1);
    },

    // ✅ Update Plan via API
    async updatePlan() {
      this.isSaving = true;
      try {
        // 1. Update General Plan Details (PUT)
        const planPayload = {
          name: this.currentPlan.name,
          price: this.currentPlan.price,
          currency: "EGP", // Force currency or use this.currentPlan.currency
          support_level: this.currentPlan.support_level || "Basic",
          description: this.currentPlan.description || "No description",
          duration_days: this.currentPlan.duration_days,
          features: this.features.filter((f) => f.trim() !== ""), // Remove empty features
        };

        await axios.put(API_URL + this.planId, planPayload);

        // 2. Update Discount (Separate POST request)
        // Only call if there is a value
        if (
          this.currentPlan.discount_percent !== undefined &&
          this.currentPlan.discount_percent !== null
        ) {
          const discountPayload = {
            discount_percent: this.currentPlan.discount_percent,
          };
          // The specific endpoint for discount
          await axios.post(
            `${API_URL}${this.planId}/discount`,
            discountPayload
          );
        }

        alert("✅ Plan updated successfully!");
        this.$router.push({ name: "showPlans" }); // Go back to list
      } catch (error) {
        console.error("Error updating plan:", error);
        alert("Failed to update plan. Please try again.");
      } finally {
        this.isSaving = false;
      }
    },

    goBack() {
      this.$router.push({ name: "showPlans" });
    },
  },
};
</script>

<style scoped>
.edit-plan-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
  padding: 40px 20px;
}

/* Glass Card Style */
.edit-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 650px; /* Slightly wider for 3 columns */
  padding: 30px 40px;
  transition: all 0.3s ease;
}

.edit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(255, 65, 108, 0.2);
}

.title {
  font-size: 1.7rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ff0000, #8b0000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #ccc;
  margin-bottom: 25px;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group label {
  font-weight: 600;
  color: #ddd;
  margin-bottom: 5px;
  display: block;
}

/* Dark Input Style */
.form-control {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #ff3b3b;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: 0.3s;
}
.form-control::placeholder {
  color: #bbb;
}
.form-control:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  color: white;
  border-color: #ff0000;
  box-shadow: 0 0 10px #ff3b3b;
}

/* Ensure dropdown options are visible */
.form-control option {
  background: #111;
  color: white;
}

/* Grid for 3 items */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr; /* Stack on mobile */
  }
}

/* Feature Section */
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
  margin-top: 8px;
  width: 100%;
  border-radius: 10px;
  transition: 0.3s;
  padding: 10px;
  border: none;
  font-weight: 600;
}

.add-feature:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.remove-feature {
  background: #b30202;
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 8px;
  transition: 0.3s;
  border: none;
}

.remove-feature:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  gap: 15px;
}

.btn {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 12px 15px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.save-btn {
  background: linear-gradient(90deg, #ff0000, #8b0000);
  color: #fff;
}

.save-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
}

.cancel-btn {
  background: transparent;
  color: #ccc;
  border: 1px solid #ccc;
}

.cancel-btn:hover {
  background: #ccc;
  border-color: #ccc;
  color: #000000;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #2c3e50, #111);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ff416c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  margin-top: 15px;
  color: #ccc;
  font-size: 1.1rem;
}
</style>
