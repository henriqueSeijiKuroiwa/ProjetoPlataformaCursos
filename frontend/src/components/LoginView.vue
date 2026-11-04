<template>
  <!-- Usando classes do Bootstrap para centralizar o formulário no meio da tela -->
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 400px;">

      <!-- Título dinâmico baseado no estado da variável isLogin -->
      <h2 class="text-center mb-4 text-primary fw-bold">
        {{ isLogin ? 'Acessar Conta' : 'Nova Assinatura' }}
      </h2>

      <!-- @submit.prevent impede a página de recarregar e chama a função submitForm -->
      <form @submit.prevent="submitForm">

        <!-- Campo Nome: Renderizado apenas se NÃO for login (v-if="!isLogin") -->
        <div v-if="!isLogin" class="mb-3">
          <label for="nome" class="form-label">Nome Completo</label>
          <input
              type="text"
              id="nome"
              v-model="form.nome"
              class="form-control"
              placeholder="Seu nome"
              required
          />
        </div>

        <!-- Campo Email: Comum para ambos -->
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-control"
              placeholder="aluno@facens.br"
              required
          />
        </div>

        <!-- Campo Senha: Comum para ambos -->
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input
              type="password"
              id="senha"
              v-model="form.senha"
              class="form-control"
              placeholder="••••••••"
              required
          />
        </div>

        <!-- Botão Dinâmico -->
        <button type="submit" class="btn btn-primary w-100 mb-3 fw-bold">
          {{ isLogin ? 'Entrar na Plataforma' : 'Criar Conta' }}
        </button>
      </form>

      <!-- Alternador de Telas (Toggle) -->
      <div class="text-center">
        <span class="text-muted">
          {{ isLogin ? 'Ainda não tem conta?' : 'Já possui uma conta?' }}
        </span>
        <a href="#" @click.prevent="toggleMode" class="text-decoration-none ms-1 fw-bold">
          {{ isLogin ? 'Cadastre-se aqui' : 'Faça login' }}
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// Permite navegar para outras telas após o login
const router = useRouter()

// Variável de controle: true = mostra Login | false = mostra Cadastro
const isLogin = ref(true)

// Objeto reativo que captura o que o usuário digita nos inputs (v-model)
const form = reactive({
  nome: '',
  email: '',
  senha: ''
})

// Função que alterna entre Login e Cadastro e zera os campos
const toggleMode = () => {
  isLogin.value = !isLogin.value
  form.nome = ''
  form.email = ''
  form.senha = ''
}

// Função executada ao clicar no botão
const submitForm = async () => {
  // Define a rota do Spring Boot dependendo do modo da tela
  const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/cadastrar'

  // Monta o JSON DTO. Se for login, não envia o campo nome.
  const payload = isLogin.value
      ? { email: form.email, senha: form.senha }
      : { nome: form.nome, email: form.email, senha: form.senha }

  try {
    // Faz a chamada passando pelo seu BFF
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      // Login ou Cadastro com sucesso: joga o aluno pra tela principal
      router.push('/dashboard')
    } else {
      const erro = await response.json()
      alert(erro.mensagem || 'Falha na autenticação. Verifique seus dados.')
    }
  } catch (error) {
    alert('Erro ao conectar com o servidor. O backend está rodando?')
  }
}
</script>
