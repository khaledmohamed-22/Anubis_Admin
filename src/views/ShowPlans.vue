<template>
  <div class="plans-container py-5">
    <h2 class="text-center mb-5 gradient-text fw-bold">Subscription Plans</h2>

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

    <div class="row g-4" v-if="filteredPlans.length">
      <div
        v-for="plan in filteredPlans"
        :key="plan._id"
        class="col-md-6 col-lg-4"
      >
        <div class="card plan-card h-100">
          <div class="card-body text-center d-flex flex-column">
            <h4 class="plan-title mb-3">{{ plan.name }}</h4>
            <p class="price-tag">{{ plan.price }} {{ plan.currency }}</p>
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

            <div class="plan-buttons mt-4">
              <button class="btn btn-edit" @click="editPlan(plan._id)">
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
  </div>
</template>

<script>
import axios from "axios";

// ✅ NEW: API Base URL
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
      try {
        const response = await axios.get(API_BASE_URL);
        this.plans = response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    },

    // ✅ NEW: Edit Plan Method
    editPlan(planId) {
      // Navigates to the EditPlan page, which you've already created
      this.$router.push({ name: "EditPlanPage", params: { planId } });
    },

    // ✅ NEW: Delete Plan Method
    async deletePlan(planId) {
      if (confirm("Are you sure you want to delete this plan?")) {
        try {
          await axios.delete(API_BASE_URL + planId);
          // Remove the plan from the local array to update the UI
          this.plans = this.plans.filter((plan) => plan._id !== planId);
          alert("Plan deleted successfully!");
        } catch (error) {
          console.error("Error deleting plan:", error);
          alert("Error deleting plan.");
        }
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
  display: flex; /* Use flex to control children */
  flex-direction: column;
  flex-grow: 1; /* Makes card body fill space */
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
  flex-grow: 1; /* This makes the list grow, pushing buttons down */
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

/* ✅ NEW: Button Styles */
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
</style>
