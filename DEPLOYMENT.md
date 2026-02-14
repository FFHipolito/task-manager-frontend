# 🚀 Deployment do Frontend na Vercel

Guia passo a passo para fazer deploy do frontend Next.js.

## Pré-requisitos

- Repositório no GitHub
- Conta no Vercel

## 🎯 Deployment Rápido

### 1. Conecte ao Vercel

```bash
# Opção A: Via GitHub (recomendado)
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Conecte sua conta GitHub
4. Selecione o repositório `task-manager-frontend`

# Opção B: Via Vercel CLI
npm i -g vercel
vercel
```

### 2. Configure as variáveis

Na página do projeto no Vercel:
**Settings → Environment Variables**

Adicione:
```
NEXT_PUBLIC_API_URL = https://seu-backend.vercel.app
```

⚠️ **Importante:** Prefixo `NEXT_PUBLIC_` é obrigatório para variáveis acessíveis no navegador!

### 3. Deploy

```bash
# Automático: Cada push para main dispara o deploy
git push origin main

# Manual:
vercel --prod
```

## 📋 Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Vercel conectado ao GitHub
- [ ] `NEXT_PUBLIC_API_URL` configurada
- [ ] Backend já deployado
- [ ] `npm run build` passa sem erros localmente
- [ ] Nenhuma variável sensível no `.env` (máximo `.env.local`)
- [ ] `next.config.js` correto
- [ ] Tailwind CSS buildando corretamente

## 🔍 Verificação pós-deploy

### Teste a aplicação
1. Acesse a URL do frontend
2. Tente fazer login
3. Crie uma tarefa
4. Atualize uma tarefa
5. Delete uma tarefa

### Verifique os logs
**Vercel Dashboard → Deployments → Seu deployment → Logs**

### Erro comum: "Can't reach API"
```bash
# Verifique a URL
curl https://seu-backend.vercel.app/auth/me
# Deve retornar erro 401 (sem token), não erro 0

# Adicione logs
console.log('Calling API:', process.env.NEXT_PUBLIC_API_URL);
```

## 🔄 Atualizações

### Para atualizar o frontend em produção:

```bash
# 1. Faça suas mudanças
git add .
git commit -m "feat: descrição das mudanças"

# 2. Push para main dispara deploy automático
git push origin main

# 3. Vercel fará o deploy automaticamente
```

## 🐛 Troubleshooting

### Erro: Build failing
```
Error: Build failed with ...
```
**Solução:**
1. Execute `npm run build` localmente
2. Verifique o console para erros específicos
3. Fixe o erro e faça push novamente

### Erro: CORS error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solução:**
1. Verifique `FRONTEND_URL` no backend
2. Verifique CORS configurado no backend
3. Reinicie o deploy do backend

### Erro: Token inválido
```
Unauthorized: invalid token
```
**Solução:**
1. Limpe localStorage: `localStorage.clear()`
2. Faça logout e login novamente
3. Verifique se `JWT_SECRET` é igual em dev e prod

### Página em branco
**Solução:**
1. Abra DevTools (F12) → Console
2. Verifique os erros
3. Consulte os logs do Vercel

## ⚡ Otimizações

### Para melhorar performance:

```javascript
// next.config.js
const nextConfig = {
  // Habilite cache
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // Otimize images
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
  },
};
```

### Monitorar performance
- Vercel Analytics (gratuito)
- Google Lighthouse
- Chrome DevTools

## 📊 Métricas esperadas

- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 2s
- **Cumulative Layout Shift:** < 0.1

## 🔐 Segurança pós-deploy

- [ ] JWT_SECRET é strong (32+ chars aleatórios)
- [ ] DATABASE_URL não está em código
- [ ] Sem API keys no frontend
- [ ] HTTPS habilitado (Vercel faz isso)
- [ ] CORS restritivo (apenas seu domínio)

## 📞 Suporte

Problemas? Consulte:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Status](https://www.vercel-status.com/)

---

**Pronto para produção! 🎉**
