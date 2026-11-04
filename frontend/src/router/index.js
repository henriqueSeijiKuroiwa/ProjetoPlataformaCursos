import { createRouter, createWebHistory } from 'vue-router'

// Importando as telas (Views)
// Nota: Pela imagem anterior, seu código de login estava no HelloWorld.vue.
// O ideal é renomeá-lo para LoginView.vue e movê-lo para uma pasta 'views'.
import LoginView from '../components/LoginView.vue'
import DashboardView from '../components/DashboardView.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView
    }
]

const router = createRouter({
    history: createWebHistory(), // Usa o histórico HTML5 (URLs limpas sem a #)
    routes
})

export default router