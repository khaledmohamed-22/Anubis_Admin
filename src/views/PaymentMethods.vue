<template>
  <div class="container py-5">
    <!-- Header -->
    <div class="text-center mb-5">
      <h2 class="gradient-text fw-bold display-6">
        <i class="bi bi-credit-card-2-front-fill me-3"></i> Payment Methods
      </h2>
    </div>

    <!-- Create / Edit Form Card -->
    <div class="card glass-card border-0 shadow-lg p-4 rounded-4 mb-5">
      <h4 class="fw-semibold mb-4 text-light">
        <i
          class="bi"
          :class="isEditing ? 'bi-pencil-square' : 'bi-plus-circle'"
        ></i>
        {{ isEditing ? "Update Payment Method" : "Add New Method" }}
      </h4>

      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <!-- Name -->
          <div class="col-md-4">
            <label class="form-label text-light">Method Name</label>
            <input
              v-model="currentMethod.name"
              class="form-control custom-input"
              placeholder="e.g., Vodafone Cash"
              required
            />
          </div>

          <!-- Provider (Number/ID) -->
          <div class="col-md-4">
            <label class="form-label text-light">Provider Number / ID</label>
            <input
              v-model="currentMethod.Provider"
              class="form-control custom-input"
              placeholder="e.g., 010xxxxxxx"
              required
            />
          </div>

          <!-- Type -->
          <div class="col-md-4">
            <label class="form-label text-light">Type</label>
            <select
              v-model="currentMethod.type"
              class="form-control custom-input"
            >
              <option value="wallet">Wallet</option>
              <option value="card">Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="text-center mt-4 d-flex gap-3 justify-content-center">
          <button
            type="submit"
            class="btn btn-gradient px-5 py-2 fw-semibold"
            :disabled="isSaving"
          >
            <span
              v-if="isSaving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{
              isSaving
                ? "Saving..."
                : isEditing
                ? "Update Method"
                : "Save Method"
            }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            class="btn btn-outline-secondary px-4 py-2"
            @click="resetForm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Methods List -->
    <div class="card glass-card border-0 shadow-lg p-4 rounded-4">
      <h4 class="fw-semibold mb-4 text-light">Active Payment Providers</h4>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-5 text-light">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="mt-2">Loading payment methods...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="methods.length === 0" class="text-center text-muted py-4">
        <i class="bi bi-wallet2 fs-1"></i>
        <p class="mt-3">No payment methods found.</p>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-center text-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Provider Detail</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="method in methods" :key="method._id">
              <td class="fw-bold">{{ method.name }}</td>
              <td>{{ method.Provider }}</td>
              <td>
                <span
                  class="badge bg-dark border border-secondary text-light text-uppercase"
                >
                  {{ method.type }}
                </span>
              </td>
              <td>
                <!-- Toggle Status Button -->
                <button
                  class="btn btn-sm"
                  :class="
                    method.status === 'active' ? 'btn-success' : 'btn-secondary'
                  "
                  @click="toggleStatus(method)"
                  :disabled="isToggling === method._id"
                >
                  <span
                    v-if="isToggling === method._id"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span v-else>
                    {{ method.status === "active" ? "Active" : "Inactive" }}
                  </span>
                </button>
              </td>
              <td>
                <button
                  class="btn btn-outline-primary btn-sm me-2 btn-gradient"
                  @click="editMethod(method)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-sm btn-gradient"
                  @click="deleteMethod(method._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ API Base URL
const API_URL =
  "https://anubis-gym-paymentprovider.onrender.com/api/v3/payment-provider/";

const methods = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const isToggling = ref(null); // Stores ID of item currently toggling
const isEditing = ref(false);

const currentMethod = ref({
  _id: null,
  name: "",
  Provider: "",
  type: "wallet",
});

// --- 1. Fetch All Methods (GET) ---
const fetchMethods = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL);
    // Handle different response structures (data.data or just data)
    methods.value = response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching methods:", error);
    // Optional: alert("Failed to load payment methods.");
  } finally {
    isLoading.value = false;
  }
};

// --- 2. Create or Update (POST / PUT) ---
const handleSubmit = async () => {
  isSaving.value = true;
  try {
    const payload = {
      name: currentMethod.value.name,
      Provider: currentMethod.value.Provider,
      type: currentMethod.value.type,
    };

    if (isEditing.value) {
      // Update (PUT)
      await axios.put(API_URL + currentMethod.value._id, payload);
      alert("✅ Payment method updated!");
    } else {
      // Create (POST)
      await axios.post(API_URL, payload);
      alert("✅ Payment method created!");
    }

    resetForm();
    await fetchMethods(); // Refresh list
  } catch (error) {
    console.error("Error saving method:", error);
    alert("Failed to save payment method.");
  } finally {
    isSaving.value = false;
  }
};

// --- 3. Delete Method (DELETE) ---
const deleteMethod = async (id) => {
  if (confirm("Are you sure you want to delete this payment method?")) {
    try {
      await axios.delete(API_URL + id);
      methods.value = methods.value.filter((m) => m._id !== id); // Optimistic update
      alert("Method deleted successfully.");
    } catch (error) {
      console.error("Error deleting method:", error);
      alert("Failed to delete method.");
    }
  }
};

// --- 4. Toggle Status (PATCH) ---
const toggleStatus = async (method) => {
  if (!method._id) return alert("Invalid method ID.");

  isToggling.value = method._id;

  // Optimistic UI toggle
  const oldStatus = method.status;
  method.status = method.status === "active" ? "inactive" : "active";

  try {
    const statusUrl = `${API_URL}status/${method._id}`;

    await axios.patch(statusUrl, {
      status: method.status === "active", // send boolean
    });
  } catch (error) {
    console.error("Error changing status:", error);
    method.status = oldStatus; // revert on failure
    alert("Failed to update status.");
  } finally {
    isToggling.value = null;
  }
};
// --- Helper Methods ---
const editMethod = (method) => {
  isEditing.value = true;
  currentMethod.value = { ...method }; // Clone data
  window.scrollTo(0, 0);
};

const resetForm = () => {
  isEditing.value = false;
  currentMethod.value = { _id: null, name: "", Provider: "", type: "wallet" };
};

onMounted(() => {
  fetchMethods();
});
</script>

<style scoped>
/* --- Shared Styles (Matching your project theme) --- */
.gradient-text {
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-gradient {
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  color: white;
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
}
.btn-gradient:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
}

/* Custom Input Styling */
.custom-input {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: 0.3s;
}
.custom-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: #ee0979;
  outline: none;
  color: white;
  box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.5);
}
.custom-input::placeholder {
  color: #bbb;
}
/* Fix dropdown options visibility */
.custom-input option {
  background-color: #1a1a1a;
  color: white;
}

/* Table Styling */
/* === Anubis Gym Table Style (Dark Red Theme) === */
/* === Anubis Gym Table Style (Dark Red Theme) === */
.table {
  background: rgba(0, 0, 0, 0.35);
  border-collapse: separate;
  border-spacing: 0 12px;
  color: #fff;
}

/* Header */
.table thead tr {
  color: white;
  background: rgba(0, 0, 0, 0.35);
}

.table thead th {
  background: rgba(0, 0, 0, 0.35);
  padding: 15px;
  font-weight: 700;
  text-transform: uppercase;
  color: #fdfdfd; /* Bright Anubis Red */
  border: none;
  letter-spacing: 1px;
}

/* Rows */
.table tbody tr {
  backdrop-filter: blur(6px);
  border-radius: 14px;
  transition: 0.25s;
}

.table tbody tr:hover {
  background: rgba(49, 1, 1, 0.15);
  transform: scale(1.015);
}

.table tbody td {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 18px 14px;
  border: none !important;
  color: #f2f2f2;
}

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

/* Status Buttons */
.btn-success {
  background: linear-gradient(90deg, #b30000, #8b0000) !important;
  border: none;
  border-radius: 10px;
  font-weight: 600;
}

.btn-success:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: #2b2b2b !important;
  border: 1px solid #555 !important;
  border-radius: 10px;
  font-weight: 600;
}

/* Action Buttons */
.btn-outline-primary {
  border-color: #ff1a1a !important;
  color: #f9f9f9 !important;
}

.btn-outline-primary:hover {
  background: #ff1a1a !important;
  color: #ffffff !important;
}

.btn-outline-danger {
  border-color: #b30000 !important;
  color: #ffffff !important;
}

.btn-outline-danger:hover {
  background: #b30000 !important;
  color: #fff !important;
}
</style>
