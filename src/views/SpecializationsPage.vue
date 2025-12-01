<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="gradient-text fw-bold display-6">
        <i class="bi bi-star-fill me-3"></i> Manage Specializations
      </h2>
    </div>

    <!-- Form Section -->
    <div class="card glass-card border-0 shadow-lg p-4 rounded-4 mb-5">
      <h4 class="fw-semibold mb-4 text-light">
        {{ isEditing ? "Update Specialization" : "Create New Specialization" }}
      </h4>

      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-light">Specialization Name</label>
            <input
              v-model="newItem.name"
              class="form-control custom-input"
              placeholder="e.g., CrossFit"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label text-light">Description</label>
            <input
              v-model="newItem.description"
              class="form-control custom-input"
              placeholder="e.g., High-intensity fitness"
              required
            />
          </div>

          <div class="col-md-12">
            <label class="form-label text-light">Icon Image</label>
            <div class="custom-file-upload">
              <label for="fileInput" class="btn btn-outline-light">
                <i class="bi bi-upload me-2"></i> Choose Icon
              </label>
              <input
                type="file"
                id="fileInput"
                class="d-none"
                @change="onFileChange"
                ref="fileInput"
              />
            </div>
            <small class="text-muted" v-if="!isEditing">
              Upload a square icon for this specialization (Required).
            </small>
            <small class="text-muted" v-else>
              Upload new image to replace the current one (Optional).
            </small>
          </div>

          <!-- Image Preview -->
          <div v-if="previewImage" class="col-12 text-center">
            <img
              :src="previewImage"
              alt="Preview"
              class="img-fluid rounded-4 shadow-sm mt-3"
              style="max-height: 150px; object-fit: cover"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div
          class="text-center mt-4 d-flex flex-wrap justify-content-center gap-3"
        >
          <button
            type="submit"
            class="btn btn-gradient px-5 py-2 fw-semibold"
            :disabled="isUploading"
          >
            <span
              v-if="isUploading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isUploading ? "Saving..." : isEditing ? "Update" : "Save" }}
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

    <hr class="section-divider my-5" />

    <!-- Table Section -->
    <div class="card glass-card border-0 shadow-lg p-4 rounded-4">
      <h4 class="fw-semibold mb-4 text-light">Existing Specializations</h4>

      <div
        v-if="specializations.length === 0"
        class="text-center text-muted py-4"
      >
        <p v-if="isLoading">
          <span class="spinner-border spinner-border-sm me-2"></span>
          Loading specializations...
        </p>
        <p v-else>No specializations found. Add one above!</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-center text-white">
          <thead>
            <tr>
              <th style="color: white">Icon</th>
              <th style="color: white">Name</th>
              <th style="color: white">Description</th>
              <th style="color: white">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="spec in specializations"
              :key="spec._id"
              class="table-row-custom"
            >
              <td>
                <img :src="spec.imageUrl" alt="icon" class="table-icon" />
              </td>
              <td>{{ spec.name }}</td>
              <td>{{ spec.description }}</td>
              <td>
                <button
                  class="btn btn-outline-primary btn-sm me-2 btn-gradient"
                  @click="editItem(spec)"
                  title="Edit this specialization"
                >
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  class="btn btn-outline-danger btn-sm btn-gradient btn-glass-delete"
                  @click="deleteItem(spec._id)"
                  title="Delete this specialization"
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
import axios from "axios";

// --- API Endpoints ---
// const IMAGE_UPLOAD_API =
//   "https://anubis-gym-1.onrender.com/api/v3/images/specialization";
const MANAGE_SPECIALIZATION_API =
  "https://anubis-v3-specialization-service.onrender.com/api/v3/specializations/";
// ✅ Correct GET API
const GET_ALL_API =
  "https://anubis-v3-specialization-service.onrender.com/api/v3/specializations/";

// --- Component State ---
const specializations = ref([]);
const isLoading = ref(false);
const isUploading = ref(false);
const isEditing = ref(false);

const newItem = ref({
  _id: null,
  name: "",
  description: "",
  imageUrl: "",
});

const selectedFile = ref(null);
const previewImage = ref(null);
const fileInput = ref(null);

// --- Methods ---

// 1. Fetch all specializations
const fetchSpecializations = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(GET_ALL_API);
    // API بيرجع data داخل object => response.data.data
    specializations.value = response.data.data || [];
  } catch (error) {
    console.error("Error fetching specializations:", error);
    specializations.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 2. Handle file selection
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 3. Handle form submission
const handleSubmit = async () => {
  isUploading.value = true;

  try {
    // --- STEP 1: Upload image if selected ---
    if (selectedFile.value) {
      const formData = new FormData();
      formData.append("image", selectedFile.value);

      const uploadRes = await axios.post(
        "https://anubis-gym-1.onrender.com/api/v3/images/specialization",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Save the uploaded image URL
      newItem.value.imageUrl = uploadRes.data.data?.url || uploadRes.data.url;
    }

    // --- STEP 2: Check image exists ---
    if (!newItem.value.imageUrl) {
      alert("Please select an image for the specialization.");
      isUploading.value = false;
      return;
    }

    // --- STEP 3: Prepare payload for creating specialization ---
    const payload = {
      name: newItem.value.name,
      description: newItem.value.description,
      imageUrl: newItem.value.imageUrl,
    };

    // --- STEP 4: Create or Update ---
    if (isEditing.value) {
      await axios.put(
        `https://anubis-v3-specialization-service.onrender.com/api/v3/specializations/${newItem.value._id}`,
        payload
      );
      alert("Specialization updated successfully!");
    } else {
      await axios.post(
        "https://anubis-v3-specialization-service.onrender.com/api/v3/specializations/",
        payload
      );
      alert("Specialization created successfully!");
    }

    await fetchSpecializations(); // refresh table
    resetForm();
  } catch (err) {
    console.error(
      "Error creating/updating specialization:",
      err.response || err
    );
    alert(
      "Failed to save specialization. Check console for details. " +
        (err.response?.data?.message || "")
    );
  } finally {
    isUploading.value = false;
  }
};

// 4. Delete an item
const deleteItem = async (id) => {
  if (confirm("Are you sure you want to delete this specialization?")) {
    try {
      await axios.delete(MANAGE_SPECIALIZATION_API + id);
      specializations.value = specializations.value.filter((s) => s._id !== id);
      alert("Deleted successfully!");
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete specialization.");
    }
  }
};

// 5. Edit Item
const editItem = (item) => {
  isEditing.value = true;
  newItem.value = { ...item };
  previewImage.value = item.imageUrl;
  selectedFile.value = null;
  window.scrollTo(0, 0);
};

// 6. Reset Form
const resetForm = () => {
  isEditing.value = false;
  newItem.value = { _id: null, name: "", description: "", imageUrl: "" };
  selectedFile.value = null;
  previewImage.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

onMounted(fetchSpecializations);
</script>

<style scoped>
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
.btn-gradient:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
}
.glass-card {
  animation: fadeInUp 0.6s ease-out;
}

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

.custom-input {
  border-radius: 12px;
  border: none;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.custom-input:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  color: white;
  box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.5);
}
/* تحسين تصميم الجدول */
.table-responsive {
  border-radius: 15px;
  overflow: hidden;
}

.table {
  color: white;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.table thead th {
  padding: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.08) !important;
  border: none;
}

.table-row-custom {
  background: rgba(255, 255, 255, 0.05);
  transition: 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.table-row-custom:hover {
  background: rgba(49, 1, 1, 0.15);
  transform: scale(1.01);

  border-color: #ff416c;
}

.table td {
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 16px 12px !important;
  border: none !important;
}

.table-icon {
  width: 55px;
  height: 55px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
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
  color: #ffffff;
}
.btn-glass-delete:hover {
  background: #d90429;
  color: white;
  border-color: transparent;
}
</style>
