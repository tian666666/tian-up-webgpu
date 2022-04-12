/*
 * @Author: TYW
 * @Date: 2022-02-22 18:05:50
 * @LastEditTime: 2022-04-05 09:38:27
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
    path: '/Lesson001',
    name: 'Lesson001',
    component: () => import('../views/webgpu/Lesson001/views/Lesson001.vue')
  },
  {
    path: '/Lesson002',
    name: 'Lesson002',
    component: () => import('../views/webgpu/Lesson002/views/Lesson002.vue')
  },
  {
    path: '/Lesson003',
    name: 'Lesson003',
    component: () => import('../views/webgpu/Lesson003/views/Lesson003.vue')
  },
  {
    path: '/Lesson004',
    name: 'Lesson004',
    component: () => import('../views/webgpu/Lesson004/views/Lesson004.vue')
  },
  {
    path: '/Lesson005',
    name: 'Lesson005',
    component: () => import('../views/webgpu/Lesson005/views/Lesson005.vue')
  },
  {
    path: '/Lesson006',
    name: 'Lesson006',
    component: () => import('../views/webgpu/Lesson006/views/Lesson006.vue')
  },
  {
    path: '/Lesson007',
    name: 'Lesson007',
    component: () => import('../views/webgpu/Lesson007/views/Lesson007.vue')
  },
  {
    path: '/Lesson008',
    name: 'Lesson008',
    component: () => import('../views/webgpu/Lesson008/views/Lesson008.vue')
  },
  {
    path: '/Lesson009',
    name: 'Lesson009',
    component: () => import('../views/webgpu/Lesson009/views/Lesson009.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
