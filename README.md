
 Almoxarifado Inteligente

Sistema web para controle de produtos e estoque.

Tecnologias

- HTML
- CSS
- JavaScript
- Node.js
- Express
 Executar localmente

1. Instale o Node.js 20 ou superior.
2. Abra um terminal na pasta do projeto.
3. Execute:

```bash
npm install
npm start
```

4. Acesse http://localhost:3000

 API

- GET /api/health — verifica o servidor
- GET /api/state — consulta os dados
- PUT /api/state — restaura um backup
- GET /api/products — lista produtos
- POST /api/products — cadastra produto
- PUT /api/products/:id — edita produto
- DELETE /api/products/:id — exclui produto
- GET /api/movements — lista movimentações
- POST /api/movements — registra movimentação
- GET /api/notes — lista anotações
- POST /api/notes — salva anotação

 Importante

Esta versão inicial mantém os dados na memória do servidor.
Para uso real, conecte um banco de dados persistente e implemente
autenticação e autorização antes de disponibilizar o sistema publicamente.