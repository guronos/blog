import Vue from "vue";
import VueRouter from "vue-router";
import MainPage from "@/components/MainPage";
import BlogPage from "@/components/BlogPage";
import RegistrationUsers from "@/components/RegistrationUsers/";
import SiteAuthorization from "@/components/SiteAuthorization";
import FeedBack from "@/components/FeedBack";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: MainPage,
  },
  {
    path: "/blog",
    name: "blog",
    component: BlogPage,
  },
  {
    path: "/registration",
    name: "registration",
    component: RegistrationUsers,
  },
  {
    path: "/authorization",
    name: "authorization",
    component: SiteAuthorization,
  },
  {
    path: "/feedback",
    name: "feedback",
    component: FeedBack,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
