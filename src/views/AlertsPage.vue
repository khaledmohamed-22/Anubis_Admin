<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="gradient-text fw-bold display-6">
        <i class="bi bi-bell-fill me-3"></i> Admin Alerts
      </h2>
    </div>

    <div class="card glass-card border-0 shadow-lg p-4 rounded-4 mb-5">
      <h4 class="fw-semibold mb-4 text-light">Create New Alert</h4>
      <form @submit.prevent="addAlert">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label text-light">Alert Title</label>
            <input
              v-model="newAlert.title"
              class="form-control custom-input"
              placeholder="e.g., Maintenance Notice"
              required
            />
          </div>
          <div class="col-md-5">
            <label class="form-label text-light">Message</label>
            <input
              v-model="newAlert.message"
              class="form-control custom-input"
              placeholder="Enter short message..."
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label text-light">Alert Type</label>
            <select v-model="newAlert.type" class="form-control custom-input">
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div class="text-center mt-4">
          <button type="submit" class="btn btn-gradient px-5 py-2 fw-semibold">
            <i class="bi bi-send-fill me-2"></i> Send Alert
          </button>
        </div>
      </form>
    </div>

    <div class="card glass-card border-0 shadow-lg p-4 rounded-4">
      <h4 class="fw-semibold mb-4 text-light">Sent Alerts</h4>

      <div v-if="alerts.length === 0" class="text-center text-muted py-4">
        No alerts have been sent yet.
      </div>

      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-center text-white">
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.title }}</td>
              <td class="text-start">{{ alert.message }}</td>
              <td>
                <span
                  class="badge rounded-pill px-3 py-2"
                  :class="getBadgeClass(alert.type)"
                >
                  {{ alert.type }}
                </span>
              </td>
              <td>{{ new Date(alert.id).toLocaleString() }}</td>
              <td>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteAlert(alert.id)"
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
import { ref, onMounted } from "vue";

const alerts = ref([]);
const newAlert = ref({
  title: "",
  message: "",
  type: "info",
});

// Load alerts from localStorage when component is mounted
onMounted(() => {
  const stored = localStorage.getItem("adminAlerts");
  if (stored) alerts.value = JSON.parse(stored);
});

// Save alerts to localStorage
const saveAlerts = () => {
  localStorage.setItem("adminAlerts", JSON.stringify(alerts.value));
};

// Add a new alert
const addAlert = () => {
  const alertToAdd = {
    id: Date.now(),
    ...newAlert.value,
  };
  alerts.value.unshift(alertToAdd); // Add to the top of the list
  saveAlerts();

  // Reset form
  newAlert.value = { title: "", message: "", type: "info" };
};

// Delete an alert
const deleteAlert = (id) => {
  if (confirm("Are you sure you want to delete this alert?")) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id);
    saveAlerts();
  }
};

// Helper function to get badge class based on alert type
const getBadgeClass = (type) => {
  if (type === "urgent") return "bg-danger";
  if (type === "warning") return "bg-warning text-dark";
  return "bg-info";
};
</script>

<style scoped>
/* Using the exact style from ActivateUser.vue and PostsPage.vue */
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

/* Make sure select dropdown has dark options */
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
</style>
