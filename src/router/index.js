import { createRouter, createWebHistory } from "vue-router";
/*import Component*/
import Home from "../views/Home.vue";
import RoomCreate from '@/views/RoomCreate.vue'
//import RoomList from './views/RoomList.vue'
import RoomShow from '@/views/RoomShow.vue'
import LoginPage from '@/views/Login.vue'
import UserPage from '@/views/UserPage.vue'
import MailRedirect from '@/views/MailRedirect.vue'
import CommonRedirect from '@/views/CommonRedirect.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/room/create',
    name: 'room-create',
    component: RoomCreate,
  },
  {
    path: '/room/:id',
    name: 'room-show',
    component: RoomShow,
    props: true,
  },
  {
    path: '/about',
    name: 'about',
    // lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/forgotpwd/:mailToken',
    name: 'mail-verify',
    component: MailRedirect,
    props: true,
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserPage,
  },
  {
    path: '/:type',
    name: 'unknow-redirect',
    component: CommonRedirect,
    props: true,
  },
  {
    path: '/:type/:token',
    name: 'verify-mail',
    component: CommonRedirect,
    props: true,
  },
]

const router = createRouter({
  /* mode: 'history', */
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
