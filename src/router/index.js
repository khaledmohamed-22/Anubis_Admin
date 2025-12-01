import { createRouter, createWebHashHistory } from "vue-router";
import PublicHome from "@/views/PublicHome.vue";
import LoginPage from "@/views/LoginPage.vue";
import HomeView from "../views/HomeView.vue";
import SubscriptionPage from "@/views/SubscriptionPage.vue";
import CreatePlan from "@/views/CreatePlan.vue";
import EditPlan from "@/views/EditPlan.vue";
import ShowPlans from "@/views/ShowPlans.vue";
import PostsPage from "@/views/PostsPage.vue";
import ActivateUser from "@/views/ActivateUser.vue";

// Imports for New Pages
import MembersPage from "@/views/MembersPage.vue";
import TraineesList from "@/views/TraineesList.vue";
import EquipmentInventory from "@/views/EquipmentInventory.vue";
import AlertsPage from "@/views/AlertsPage.vue";
import CoachesList from "@/views/CoachesList.vue";
import SpecializationsPage from "@/views/SpecializationsPage.vue";
import PaymentMethods from "@/views/PaymentMethods.vue";

const routes = [
  {
    path: "/", // This is now the first page
    name: "PublicHome",
    component: PublicHome,
    meta: { hideSidebar: true }, // Hides admin sidebar
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { hideSidebar: true }, // Hides admin sidebar
  },

  {
    path: "/payment",
    name: "Payment",
    component: PaymentMethods,
  },

  {
    path: "/home", // This is the admin dashboard
    name: "home",
    component: HomeView,
    // No meta tag, so sidebar will show
  },
  {
    path: "/notifications",
    name: "AlertsPage",
    component: AlertsPage,
  },
  {
    path: "/specializations",
    name: "SpecializationsPage",
    component: SpecializationsPage,
  },
  {
    path: "/inventory",
    name: "EquipmentInventory",
    component: EquipmentInventory,
  },
  {
    path: "/subscription",
    name: "subscription",
    component: SubscriptionPage,
  },
  {
    path: "/createplan",
    name: "createPlan",
    component: CreatePlan,
  },
  {
    path: "/posts",
    name: "PostsPage",
    component: PostsPage,
  },
  {
    path: "/activate",
    name: "ActivateUser",
    component: ActivateUser,
  },
  {
    path: "/showplans",
    name: "showPlans",
    component: ShowPlans,
  },
  {
    path: "/editplan/:planId",
    name: "EditPlanPage",
    component: EditPlan,
    props: true,
  },

  // --- MEMBERS ROUTES ---
  {
    path: "/members",
    name: "members",
    component: MembersPage,
  },
  {
    path: "/members/trainees",
    name: "traineesList",
    component: TraineesList,
  },
  // ✅ FIXED: This is the single, correct route for coaches
  {
    path: "/members/coaches",
    name: "CoachesList",
    component: CoachesList,
  },
  // ✅ FIXED: Removed the duplicate, incorrect coaches route
  // --- END MEMBERS ROUTES ---

  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
