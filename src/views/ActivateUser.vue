<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="gradient-text fw-bold display-6">User Activation Panel</h2>
      <p class="text-white-50">
        Manage trainee subscriptions and verify payment proofs.
      </p>
    </div>

    <div class="card glass-card border-0 shadow-lg p-4 rounded-4">
      <h4 class="fw-semibold mb-4">Payment & Subscription Requests</h4>

      <div v-if="requests.length === 0" class="text-center text-muted py-4">
        No pending requests found.
      </div>

      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-white">
          <thead>
            <tr class="text-white-50">
              <th>Trainee</th>
              <th>Personal Info</th>
              <th>Payment Details</th>
              <th>Proof</th>
              <th>Sub Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in requests" :key="req.payment._id">
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img
                    :src="req.payment.trainee_data.profile_Image"
                    alt="Profile"
                    class="rounded-circle border border-2 border-white"
                    style="width: 50px; height: 50px; object-fit: cover"
                  />
                  <div>
                    <div class="fw-bold">
                      {{ req.payment.trainee_data.name.first_name }}
                      {{ req.payment.trainee_data.name.last_name }}
                    </div>
                    <small class="text-white-50"
                      >ID:
                      {{ req.payment.trainee_data._id.slice(-6) }}...</small
                    >
                  </div>
                </div>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span
                    ><i class="bi bi-person-badge me-1"></i> Age:
                    {{ req.payment.trainee_data.age }}</span
                  >
                  <span class="text-capitalize"
                    ><i class="bi bi-gender-ambiguous me-1"></i>
                    {{ req.payment.trainee_data.gender }}</span
                  >
                </div>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-warning"
                    >{{ req.payment.amount }} EGP</span
                  >
                  <small class="text-white-50">{{
                    formatDate(req.payment.createdAt)
                  }}</small>
                  <span
                    class="badge bg-dark border border-secondary mt-1"
                    style="width: fit-content"
                  >
                    {{ req.payment.status }}
                  </span>
                </div>
              </td>

              <td>
                <a
                  :href="req.payment.payment_proof"
                  target="_blank"
                  class="btn btn-sm btn-outline-info rounded-pill"
                >
                  <i class="bi bi-image me-1"></i> View Receipt
                </a>
              </td>

              <td>
                <span
                  class="badge rounded-pill px-3 py-2"
                  :class="
                    req.payment.trainee_data.is_Subscribed
                      ? 'bg-success'
                      : 'bg-secondary'
                  "
                >
                  {{
                    req.payment.trainee_data.is_Subscribed
                      ? "Active"
                      : "Inactive"
                  }}
                </span>
              </td>

              <td class="text-end">
                <button
                  v-if="!req.payment.trainee_data.is_Subscribed"
                  class="btn btn-success btn-sm px-3 rounded-pill shadow-sm"
                  @click="toggleSubscription(req.payment._id, true)"
                >
                  <i class="bi bi-check-circle me-1"></i> Activate
                </button>

                <button
                  v-else
                  class="btn btn-danger btn-sm px-3 rounded-pill shadow-sm"
                  @click="toggleSubscription(req.payment._id, false)"
                >
                  <i class="bi bi-x-circle me-1"></i> Deactivate
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
import { ref } from "vue";

// MOCK DATA: Initialized with the structure you provided
const requests = ref([
  {
    message: "Payment completed successfully",
    payment: {
      _id: "691cb96fc987fa1355620587",
      Trainee_Profile: "69009a037bf91df00abc5632",
      trainee_data: {
        _id: "69009a037bf91df00abc5632",
        name: {
          first_name: "ziad",
          last_name: "assem",
          middle_name: "ziad",
        },
        date_of_birth: "2008-03-03T00:00:00.000Z",
        age: 17,
        is_Subscribed: false, // This is what we toggle
        gender: "male",
        effort_level: "Moderate",
        gone_Days: 5,
        __v: 0,
        profile_Image:
          "https://res.cloudinary.com/dz4ujk3p1/image/upload/v1761647159/Anubis/Trainee%20Profile/Profile%20Image/riacu6wmw4xramsxlr5a.jpg",
      },
      SubscriptionPlan: "691c895f849e0e3a174ad1d9",
      amount: 300,
      payment_provider: "691c9b66d6cf4b531d56e05c",
      status: "completed",
      payment_proof: "https://via.placeholder.com/150", // Placeholder for demo
      createdAt: "2025-11-18T18:22:39.902Z",
      updatedAt: "2025-11-18T18:24:32.091Z",
      __v: 0,
      paid_at: "2025-11-18T18:24:32.090Z",
    },
  },
  // Duplicate entry for visualization purposes as per your prompt example
  {
    message: "Payment completed successfully",
    payment: {
      _id: "691cb96fc987fa1355620588", // Changed ID slightly to avoid key conflict
      Trainee_Profile: "69009a037bf91df00abc5632",
      trainee_data: {
        _id: "69009a037bf91df00abc5632",
        name: {
          first_name: "Ahmed",
          last_name: "Ali",
          middle_name: "Samir",
        },
        date_of_birth: "2005-03-03T00:00:00.000Z",
        age: 20,
        is_Subscribed: true, // Example of an already active user
        gender: "male",
        effort_level: "High",
        gone_Days: 12,
        __v: 0,
        profile_Image:
          "https://ui-avatars.com/api/?name=Ahmed+Ali&background=random",
      },
      SubscriptionPlan: "691c895f849e0e3a174ad1d9",
      amount: 500,
      payment_provider: "691c9b66d6cf4b531d56e05c",
      status: "completed",
      payment_proof: "https://via.placeholder.com/150",
      createdAt: "2025-11-19T10:00:00.000Z",
      updatedAt: "2025-11-19T10:05:00.000Z",
      __v: 0,
      paid_at: "2025-11-19T10:05:00.000Z",
    },
  },
]);

// Toggle Function
const toggleSubscription = (paymentId, status) => {
  const req = requests.value.find((r) => r.payment._id === paymentId);
  if (req) {
    req.payment.trainee_data.is_Subscribed = status;
    // Here you would typically make an API call to backend
    // await api.post('/activate-user', { id: req.payment.trainee_data._id, status })
    console.log(
      `User ${req.payment.trainee_data.name.first_name} is now ${
        status ? "Subscribed" : "Unsubscribed"
      }`
    );
  }
};

// Helper to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.table {
  --bs-table-bg: transparent;
  --bs-table-color: white;
  --bs-table-hover-bg: rgba(255, 255, 255, 0.05);
  --bs-table-hover-color: white;
}

.table thead th {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

/* Smooth transition for buttons */
.btn {
  transition: all 0.3s ease;
}
.btn:hover {
  transform: translateY(-1px);
}
</style>
