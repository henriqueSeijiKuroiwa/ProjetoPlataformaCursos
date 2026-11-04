# ==========================================
# ESTÁGIO 1: Build (Compilação do Vue/Vite)
# ==========================================
FROM node:22-alpine AS build
WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento, necessárias pro Vite)
RUN npm install

# Copia o restante do código-fonte (src, index.html, vite.config.js, etc.)
COPY . .

# Compila o projeto Vue. O Vite vai gerar os arquivos estáticos na pasta /app/dist
RUN npm run build


# ==========================================
# ESTÁGIO 2: Execução (Servidor BFF Express)
# ==========================================
FROM node:22-alpine
WORKDIR /app

# Copia apenas os arquivos de dependência novamente
COPY package*.json ./

# Instala APENAS as dependências de produção (como o Express), deixando a imagem mais leve
RUN npm install --omit=dev

# Copia o server.js do seu computador para o contêiner
COPY server.js .

# Traz a pasta /dist gerada no Estágio 1 para este contêiner final
COPY --from=build /app/dist ./dist

# Expõe a porta 3000 que configuramos no server.js
EXPOSE 3000

# Comando que mantém o contêiner de pé rodando o BFF
CMD ["node", "server.js"]