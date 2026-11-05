import express from 'express';
import path from 'path';

const app = express();
// Aponta para o seu Spring Boot (via Docker ou local)
const API = process.env.API_URL || 'http://localhost:8080';

app.use(express.json());

// 1. Serve os arquivos estáticos gerados pelo Vite (pasta dist)
app.use(express.static(path.resolve('dist')));

// 2. Proxy para a API (Usar app.use intercepta tudo que começa com /api)
app.use('/api', async (req, res) => {
    try {
        const options = {
            method: req.method,
            headers: { 'Content-Type': 'application/json' }
        };

        // Adiciona o corpo (body) apenas se não for um método GET/HEAD
        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
            options.body = JSON.stringify(req.body);
        }

        // O req.originalUrl mantém o caminho completo (ex: /api/auth/login)
        const response = await fetch(`${API}${req.originalUrl}`, options);
        const data = await response.text();
        res.status(response.status).send(data);
    } catch (error) {
        console.error('Erro de conexão BFF -> Backend:', error);
        res.status(500).json({ erro: 'Falha ao conectar com o backend Spring Boot' });
    }
});

// 3. Fallback do Vue Router: Como está no final do arquivo, captura qualquer
// requisição GET (como /dashboard) que não caiu no /api, devolvendo o Vue.
app.use((req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
});

// 4. Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log(`BFF rodando na porta 3000 -> Conectado à API em ${API}`);
});