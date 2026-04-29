import { createRouter, createWebHistory } from 'vue-router'
import DemandesSearchView from '../views/DemandesSearchView.vue'
import DemandeDetailView from '../views/DemandeDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: DemandesSearchView },
    { path: '/demandes/:id', name: 'demande-detail', component: DemandeDetailView },
  ],
})

export default router
