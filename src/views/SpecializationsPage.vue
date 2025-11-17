<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="gradient-text fw-bold display-6">
        <i class="bi bi-star-fill me-3"></i> Manage Specializations
      </h2>
    </div>

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
            <input
              type="file"
              class="form-control custom-input"
              @change="onFileChange"
              ref="fileInput"
            />
            <small class="text-muted"
              >Upload a square icon for this specialization.</small
            >
          </div>

          <div v-if="previewImage" class="col-12 text-center">
            <img
              :src="previewImage"
              class="img-fluid rounded-4 shadow-sm mt-3"
              style="max-height: 150px; object-fit: cover"
            />
          </div>
        </div>
        <div class="text-center mt-4 d-flex gap-3">
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

    <div class="card glass-card border-0 shadow-lg p-4 rounded-4">
      <h4 class="fw-semibold mb-4 text-light">Existing Specializations</h4>

      <div
        v-if="specializations.length === 0"
        class="text-center text-muted py-4"
      >
        <p v-if="isLoading">Loading specializations...</p>
        <p v-else>No specializations found. Add one above!</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table align-middle table-hover text-center text-white">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="spec in specializations" :key="spec._id">
              <td>
                <img :src="spec.imageUrl" alt="icon" class="table-icon" />
              </td>
              <td>{{ spec.name }}</td>
              <td>{{ spec.description }}</td>
              <td>
                <button
                  class="btn btn-outline-primary btn-sm me-2"
                  @click="editItem(spec)"
                >
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteItem(spec._id)"
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
import axios from "axios"; // Using axios for easier form-data uploads

// --- API Endpoints ---
const IMAGE_UPLOAD_API =
  "https://anubis-gym-1.onrender.com/api/v3/images/specialization";
const SPECIALIZATION_API =
  "https://anubis-v3-specialization-service.onrender.com/api/v3/specializations/";
const GET_SPECIALIZATION_API =
  "https://anubis-gym.onrender.com/api/v3/specializations/";

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
const fileInput = ref(null); // Ref for the file input element

// --- Methods ---

// 1. Fetch all specializations (GET)
const fetchSpecializations = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(GET_SPECIALIZATION_API);
    specializations.value = response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching specializations:", error);
    alert("Failed to load specializations.");
  } finally {
    isLoading.value = false;
  }
};

// 2. Handle file selection
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 3. Handle main form submission
const handleSubmit = async () => {
  isUploading.value = true;

  // --- Step 1: Upload Image (if a new file is selected) ---
  if (selectedFile.value) {
    const formData = new FormData();
    // The key 'image' is based on your screenshot
    formData.append("image", selectedFile.value);

    try {
      const response = await axios.post(IMAGE_UPLOAD_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      newItem.value.imageUrl = response.data.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
      isUploading.value = false;
      return;
    }
  } else if (!isEditing.value) {
    alert("Please select an image for the new specialization.");
    isUploading.value = false;
    return;
  }

  // --- Step 2: Create or Update Specialization ---
  try {
    if (isEditing.value) {
      // UPDATE (PUT)
      await axios.put(SPECIALIZATION_API + newItem.value._id, newItem.value);
    } else {
      // CREATE (POST)
      await axios.post(SPECIALIZATION_API, newItem.value);
    }

    await fetchSpecializations(); // Refresh list
    resetForm();
  } catch (error) {
    console.error("Failed to save specialization:", error);
    alert("Failed to save specialization.");
  } finally {
    isUploading.value = false;
  }
};

// 4. Delete an item (DELETE)
const deleteItem = async (id) => {
  if (confirm("Are you sure you want to delete this specialization?")) {
    try {
      // NOTE: Assumes DELETE API uses ID in URL (e.g., /specializations/:id)
      await axios.delete(SPECIALIZATION_API + id);
      await fetchSpecializations(); // Refresh list
    } catch (error) {
      console.error("Failed to delete specialization:", error);
      alert("Failed to delete specialization.");
    }
  }
};

// 5. Populate form for editing
const editItem = (item) => {
  isEditing.value = true;
  newItem.value = { ...item };
  previewImage.value = item.imageUrl; // Show existing image
  selectedFile.value = null; // Clear file selection
  window.scrollTo(0, 0); // Scroll to top
};

// 6. Reset the form
const resetForm = () => {
  isEditing.value = false;
  newItem.value = { _id: null, name: "", description: "", imageUrl: "" };
  selectedFile.value = null;
  previewImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = ""; // Clear file input
  }
};

// Load data on page load
onMounted(fetchSpecializations);
</script>

<style scoped>
/* Copied directly from ActivateUser.vue for consistency */
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
}
.custom-input::placeholder {
  color: #bbb;
}
.table {
  color: #fff;
}
.table thead {
  background: rgba(255, 255, 255, 0.1);
}
.table td,
.table th {
  vertical-align: middle;
}

/* New style for icons in the table */
.table-icon {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
