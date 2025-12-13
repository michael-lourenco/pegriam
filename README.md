# Contos de Pegriam - Sistema Editorial Avançado

Sistema editorial completo para "Contos de Pegriam", narrado por Pegriam, o Bardo Multiversal.

## 🏗️ Arquitetura

Este projeto segue **Clean Architecture** com separação clara de camadas:

- **Domain**: Entidades, Value Objects, Interfaces de Repositórios
- **Application**: Use Cases, DTOs
- **Infrastructure**: Implementações (Firebase, Supabase)
- **Presentation**: Next.js, React Components

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase** (Autenticação)
- **Supabase** (Dados Narrativos)
- **Tailwind CSS**
- **Radix UI**

## 📁 Estrutura do Projeto

```
src/
├── domain/           # Camada de Domínio
├── application/      # Camada de Aplicação
├── infrastructure/    # Camada de Infraestrutura
├── presentation/      # Camada de Apresentação
└── shared/           # Código Compartilhado
```

## 🔐 Autenticação

- **Admin**: `kontempler@gmail.com`
- **Firebase Auth** para autenticação
- **RBAC** simples para controle de acesso

## 📚 Documentação

Ver `historias-guardadas/documentacao/analise-arquitetural.md` para análise completa da arquitetura.

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Type checking
npm run type-check
```

## 📝 Licença

Privado - Contos de Pegriam


