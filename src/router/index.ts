/*
 * @Author: TYW
 * @Date: 2022-02-22 18:05:50
 * @LastEditTime: 2022-03-08 19:52:11
 * @LastEditors: TYW
 * @Description:
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/Lesson001',
    name: 'Lesson001',
    component: () => import('../views/webgl/Lesson001/views/Lesson001.vue')
  },
  {
    path: '/Lesson002',
    name: 'Lesson002',
    component: () => import('../views/webgl/Lesson002/views/Lesson002.vue')
  },
  {
    path: '/Lesson003',
    name: 'Lesson003',
    component: () => import('../views/webgl/Lesson003/views/Lesson003.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
