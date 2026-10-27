# SauceDemo e CI Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** entregar três cenários E2E do SauceDemo e pipeline verificada.

**Architecture:** Playwright Test com Chromium e fixtures isoladas, Page Object somente para login; jobs E2E e SonarCloud.

**Tech Stack:** TypeScript, Node.js 22, Playwright Test, GitHub Actions e SonarCloud.

**Spec:** `docs/superpowers/specs/2026-10-27-playwright-ci-design.md`

## Global Constraints

- Exatamente três testes, sem skip, mocks de página ou esperas fixas.
- Usar somente credenciais públicas e dados fictícios do ambiente de demonstração.
- Usar lockfile, navegador gerenciado pelo Playwright e secrets do Actions.

## Review Focus

- Cada teste deve rodar sem depender de sessão/carrinho anterior.
- Checkout deve validar produto, quantidade, subtotal, imposto, total e conclusão.
- Login bloqueado deve verificar erro e impedir acesso ao catálogo.
- Falhas de teste/scanner/Quality Gate devem falhar o workflow.
- Relatórios/traces de falha devem continuar disponíveis como artefatos.

### Task 1: cenários e configuração

- [x] Inspecionar repositório, site real e documentação oficial.
- [x] Escrever CT01, CT02 e CT03 antes do Page Object; typecheck falhou pelo módulo ausente.
- [x] Implementar `SauceDemoPage.login(username: string): Promise<void>`.
- [x] Configurar baseURL/data-test, Chromium, relatório HTML/JUnit e traces na falha.
- [x] Remover os cenários e suporte antigos e as dependências sem uso.
- [x] Verificar typecheck, formatação e descoberta de exatamente três testes.
- [ ] Executar os três cenários no runner e inspecionar os resultados.

### Task 2: integração contínua e entrega

- [x] Atualizar workflow para npm ci, checks, instalação do navegador, E2E e upload.
- [x] Configurar classificação correta de código de teste e Quality Gate no SonarCloud.
- [ ] Revisar alterações e corrigir eventuais problemas.
- [ ] Publicar PR e acompanhar os jobs até conclusão.
- [ ] Registrar evidências e instruções no README.
