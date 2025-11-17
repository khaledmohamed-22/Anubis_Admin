<template>
  <div class="container py-5">
    <!-- Header -->
    <div class="text-center mb-5">
      <h2 class="gradient-text fw-bold display-6">
        <i class="bi bi-boxes me-3"></i> Equipment Inventory
      </h2>
    </div>

    <!-- Stats Bar -->
    <div class="row g-3 mb-5">
      <div class="col-md-4">
        <div class="card stat-card glass-card text-center p-3">
          <h5 class="stat-title text-light">Total Item Types</h5>
          <p class="stat-value display-5 fw-bold text-white">
            {{ totalItems }}
          </p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card glass-card text-center p-3">
          <h5 class="stat-title text-light">Total Quantity</h5>
          <p class="stat-value display-5 fw-bold text-white">
            {{ totalQuantity }}
          </p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card glass-card text-center p-3">
          <h5 class="stat-title text-light">Items Needing Repair</h5>
          <p class="stat-value display-5 fw-bold text-danger">
            {{ needsRepair }}
          </p>
        </div>
      </div>
    </div>

    <!-- Add / Edit Equipment Form -->
    <div class="card glass-card border-0 shadow-lg p-4 rounded-4 mb-5">
      <h4 class="fw-semibold mb-4 text-light">
        <i class="bi bi-pencil-square me-2"></i>
        {{ isEditing ? "Update Equipment" : "Add New Equipment" }}
      </h4>
      <form @submit.prevent="saveItem">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-light">Equipment Name</label>
            <input
              v-model="newItem.name"
              class="form-control custom-input"
              placeholder="e.g., Treadmill XM-500"
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label text-light">Category</label>
            <select
              v-model="newItem.category"
              class="form-control custom-input"
            >
              <option>Cardio</option>
              <option>Weights</option>
              <option>Machines</option>
              <option>Maintenance</option>
              <option>Other</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-light">Quantity</label>
            <input
              v-model.number="newItem.quantity"
              type="number"
              min="0"
              class="form-control custom-input"
              placeholder="e.g., 5"
              required
            />
          </div>
          <div class="col-md-12">
            <label class="form-label text-light">Condition</label>
            <div class="d-flex flex-wrap gap-2">
              <label
                v-for="condition in conditions"
                :key="condition"
                class="btn-radio-label"
              >
                <input
                  type="radio"
                  class="btn-check"
                  v-model="newItem.condition"
                  :value="condition"
                  :id="'cond-' + condition"
                />
                <label
                  class="btn btn-sm"
                  :class="getConditionClass(condition)"
                  :for="'cond-' + condition"
                  >{{ condition }}</label
                >
              </label>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 d-flex gap-3">
          <button type="submit" class="btn btn-gradient px-5 py-2 fw-semibold">
            <i
              class="bi me-2"
              :class="
                isEditing ? 'bi-check-circle-fill' : 'bi-plus-circle-fill'
              "
            ></i>
            {{ isEditing ? "Update Item" : "Add Item" }}
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

    <!-- Inventory List -->
    <div class="card glass-card border-0 shadow-lg p-4 rounded-4">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4"
      >
        <h4 class="fw-semibold text-light">Current Inventory</h4>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="Search by name..."
          style="max-width: 300px"
        />
      </div>

      <div
        v-if="filteredInventory.length === 0"
        class="text-center text-muted py-4"
      >
        No equipment found. Add one above!
      </div>

      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-center text-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Condition</th>
              <th>Last Checked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredInventory" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <span
                  class="badge rounded-pill px-3 py-2"
                  :class="getConditionBadge(item.condition)"
                >
                  {{ item.condition }}
                </span>
              </td>
              <td>{{ formatDate(item.lastChecked) }}</td>
              <td>
                <button
                  class="btn btn-primary btn-sm me-2"
                  @click="editItem(item)"
                >
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteItem(item.id)"
                >
                  <i class="bi bi-trash"></i> Delete
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
import { ref, onMounted, computed } from "vue";

const STORAGE_KEY = "gymInventory";
const inventory = ref([]);
const searchQuery = ref("");
const isEditing = ref(false);
const conditions = ["New", "Good", "Fair", "Needs Repair"];

const newItem = ref({
  id: null,
  name: "",
  quantity: 1,
  category: "Machines",
  condition: "Good",
  lastChecked: null,
});

// --- Lifecycle & Storage ---
onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) inventory.value = JSON.parse(stored);
});

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory.value));
};

// --- CRUD Operations ---
const saveItem = () => {
  if (isEditing.value) {
    // Update existing item
    const index = inventory.value.findIndex((i) => i.id === newItem.value.id);
    if (index !== -1) {
      inventory.value[index] = { ...newItem.value, lastChecked: new Date() };
    }
  } else {
    // Add new item
    inventory.value.unshift({
      ...newItem.value,
      id: Date.now(),
      lastChecked: new Date(),
    });
  }
  saveToStorage();
  resetForm();
};

const editItem = (item) => {
  isEditing.value = true;
  newItem.value = { ...item }; // Clone item to form
  window.scrollTo(0, 0); // Scroll to top to see the form
};

const deleteItem = (id) => {
  if (confirm("Are you sure you want to delete this item?")) {
    inventory.value = inventory.value.filter((item) => item.id !== id);
    saveToStorage();
  }
};

const resetForm = () => {
  isEditing.value = false;
  newItem.value = {
    id: null,
    name: "",
    quantity: 1,
    category: "Machines",
    condition: "Good",
    lastChecked: null,
  };
};

// --- Computed Properties ---
const filteredInventory = computed(() => {
  return inventory.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalItems = computed(() => inventory.value.length);
const totalQuantity = computed(() =>
  inventory.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
);
const needsRepair = computed(
  () => inventory.value.filter((i) => i.condition === "Needs Repair").length
);

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const getConditionBadge = (condition) => {
  switch (condition) {
    case "New":
      return "bg-success";
    case "Good":
      return "bg-info";
    case "Fair":
      return "bg-warning text-dark";
    case "Needs Repair":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

const getConditionClass = (condition) => {
  switch (condition) {
    case "New":
      return "btn-outline-success";
    case "Good":
      return "btn-outline-info";
    case "Fair":
      return "btn-outline-warning";
    case "Needs Repair":
      return "btn-outline-danger";
    default:
      return "btn-outline-secondary";
  }
};
</script>
<style scoped>
/* Copied directly from your other pages for perfect consistency */
.gradient-text {
  background: linear-gradient(
    90deg,
    #ff6a00,
    #ee0979
  ); /* Style from ActivateUser */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-gradient {
  background: linear-gradient(
    90deg,
    #ff6a00,
    #ee0979
  ); /* Style from ActivateUser */
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
  background: rgba(255, 255, 255, 0.05); /* Style from ActivateUser */
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
}

.custom-input {
  border-radius: 12px;
  border: none;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.1); /* Style from ActivateUser */
  color: white;
}
.custom-input:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  color: white;
}
.custom-input::placeholder {
  color: #bbb;
}
.custom-input option {
  background-color: #1a1a1a;
  color: #fff;
}

.table {
  color: #fff; /* Style from ActivateUser */
}
.table thead {
  background: rgba(255, 255, 255, 0.1);
}
.table td,
.table th {
  vertical-align: middle;
}

/* New styles for this page */
.stat-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.stat-title {
  color: #ccc;
  font-size: 1rem;
  font-weight: 600;
}
.stat-value {
  line-height: 1.1;
}

/* --- ENHANCED Radio Button Styling --- */
.btn-radio-label .btn {
  /* Add a transition for the pop effect */
  transition: all 0.2s ease-in-out;
  border-radius: 10px; /* Match other inputs */
  padding: 6px 14px;
  font-weight: 600;
  border-width: 1.5px;
}

.btn-check:checked + .btn {
  /* Pop effect */
  transform: scale(1.05);
  z-index: 1;
  /* Make the shadow match the button color for a "glow" */
}

/* Specific glow colors for each state */
.btn-check:checked + .btn-outline-success {
  box-shadow: 0 0 15px rgba(25, 135, 84, 0.7);
}
.btn-check:checked + .btn-outline-info {
  box-shadow: 0 0 15px rgba(13, 202, 240, 0.7);
}
.btn-check:checked + .btn-outline-warning {
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.7);
}
.btn-check:checked + .btn-outline-danger {
  box-shadow: 0 0 15px rgba(220, 53, 69, 0.7);
}
</style>
