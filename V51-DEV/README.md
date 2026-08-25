# Smart Estoque V51 — DEV

## Objetivo
Nova geração do Smart Estoque, desenvolvida de forma independente da V50.6-STABLE.

## Regra de desenvolvimento
- V50.6-STABLE permanece congelada.
- `main` permanece como versão atual de produção.
- Toda evolução da V51 acontece na branch `V51-DEV`.
- A V51 não deve compartilhar dados de produção enquanto estiver em testes.

## Arquitetura planejada
- `frontend/` — interface operacional do operador.
- `backoffice/` — administração, catálogo, auditoria e relatórios.
- `shared/` — componentes e utilitários compartilhados somente quando necessário.
- `firebase/` — configuração/regras do ambiente de testes.
- `assets/` — recursos estáticos.

## Etapas
1. Criar estrutura isolada.
2. Preservar funcionalidades comprovadas da V50.6.
3. Separar HTML/CSS/JavaScript por responsabilidade.
4. Criar Front-end operacional.
5. Criar Back-office.
6. Configurar ambiente Firebase de testes.
7. Testar importação, pesquisa, scanner, contagem, sincronização e auditoria.
8. Somente após aprovação, considerar V51-STABLE.
