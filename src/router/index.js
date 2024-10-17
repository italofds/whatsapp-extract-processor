import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import MessagesPage from '../views/MessagesPage.vue';
import CallsPage from '../views/CallsPage.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/messages',
    name: 'MessagesPage',
    component: MessagesPage
  },
  {
    path: '/calls',
    name: 'CallsPage',
    component: CallsPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;