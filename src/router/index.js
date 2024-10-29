import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import MessagesPage from '../views/MessagesPage.vue';
import CallsPage from '../views/CallsPage.vue';
import ChartsPage from '../views/ChartsPage.vue';
import ViewPage from '../views/ViewPage.vue';

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
    path: '/charts',
    name: 'ChartsPage',
    component: ChartsPage
  },
  {
    path: '/view',
    name: 'ViewPage',
    component: ViewPage
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