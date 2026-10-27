# Três testes Playwright e integração contínua

Objetivo: entregar exatamente três cenários E2E reais, com execução no GitHub Actions e análise no SonarCloud. O usuário autorizou escolher outro site porque seuimposto.com estava indisponível para os fluxos necessários.

Alvo escolhido: https://www.saucedemo.com/, loja pública de demonstração. O site oferece credenciais de teste e checkout sem transação financeira real. Usar os dados fictícios Teste Automatizado / 00000.

Cenários:

1. CT01: autenticar standard_user e verificar URL do catálogo, Products, seis produtos e carrinho vazio.
2. CT02: autenticar locked_out_user, verificar erro de bloqueio e permanência no login, sem catálogo.
3. CT03: autenticar standard_user, adicionar uma Sauce Labs Backpack, verificar quantidade 1 e preço $29.99 no carrinho, preencher checkout, conferir subtotal $29.99, imposto $2.40 e total $32.39, finalizar e verificar confirmação e carrinho vazio.

Arquitetura: manter TypeScript e Playwright Test, com um Page Object pequeno para o login. Cada teste recebe a fixture page isolada. Configurar data-test como testIdAttribute, usar roles/placeholders e assertions web-first. Não usar sleeps, seletores posicionais, respostas simuladas nem estado de outros testes.

Alternativas: Edge pré-instalado depende da imagem do runner; Chromium instalado pelo Playwright acompanha a versão da biblioteca e foi escolhido. Os exemplos antigos serão substituídos para que npm test execute exatamente os três casos solicitados.

CI: npm ci, typecheck, formatação sem alterar arquivos, instalação de Chromium, três testes e upload de HTML/JUnit/traces. Análise SonarCloud em main e PRs, com SONAR_TOKEN e espera obrigatória do Quality Gate. Testes e helpers são código de teste; configuração é código-fonte. Não declarar cobertura do site externo nem criar cobertura artificial.
