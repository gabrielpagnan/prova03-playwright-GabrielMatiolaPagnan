# Prova 03 — Playwright, GitHub Actions e SonarCloud

[![Build and Tests](https://github.com/gabrielpagnan/prova03-playwright-GabrielMatiolaPagnan/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/gabrielpagnan/prova03-playwright-GabrielMatiolaPagnan/actions/workflows/node.js.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=gabrielpagnan_prova03-playwright-GabrielMatiolaPagnan&metric=alert_status)](https://sonarcloud.io/summary/overall?id=gabrielpagnan_prova03-playwright-GabrielMatiolaPagnan)

Autor: Gabriel Matiola Pagnan.

Aplicação testada: **[SauceDemo / Swag Labs](https://www.saucedemo.com/)**, loja de demonstração da Sauce Labs. As contas são públicas e a compra é fictícia, sem pagamento real. O alvo inicial seuimposto.com foi substituído com autorização do usuário porque não disponibilizava os fluxos necessários.

## Três casos de teste

| Caso                     | Ações                                                              | Resultado esperado                                                                                              |
| ------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| CT01 — Login válido      | Entrar com `standard_user`                                         | Catálogo Products com seis produtos e carrinho vazio                                                            |
| CT02 — Usuário bloqueado | Entrar com `locked_out_user`                                       | Erro de usuário bloqueado, permanecendo no login sem catálogo                                                   |
| CT03 — Compra completa   | Adicionar mochila, conferir carrinho e preencher checkout fictício | Uma Sauce Labs Backpack de US$ 29,99; imposto US$ 2,40; total US$ 32,39; confirmação do pedido e carrinho vazio |

A senha `secret_sauce` é uma credencial pública da aplicação de demonstração. O checkout usa somente os dados fictícios `Teste Automatizado` e CEP `00000`.

## Executar localmente

Requisito: **Node.js 22 ou superior**.

```sh
npm ci
npx playwright install --with-deps chromium
npm run ci
```

| Comando                           | Finalidade                                   |
| --------------------------------- | -------------------------------------------- |
| `npm test`                        | Executar os três testes em Chromium headless |
| `npm run scenario -- --grep CT03` | Executar somente a compra                    |
| `npm run typecheck`               | Verificar os tipos TypeScript                |
| `npm run verify`                  | Conferir formatação sem modificar arquivos   |
| `npm run format`                  | Aplicar formatação                           |
| `npm run ui`                      | Abrir a interface interativa do Playwright   |
| `npm run debug`                   | Abrir o Playwright Inspector                 |
| `npm run show-report`             | Abrir o relatório HTML                       |
| `npm run clean`                   | Remover artefatos locais                     |

## Uso do Playwright

- A fixture `page` cria um contexto isolado para cada teste; nenhum cenário depende da execução de outro.
- O Page Object `src/support/pages/SauceDemoPage.ts` concentra somente o login reutilizado.
- `baseURL` centraliza o endereço e `testIdAttribute: 'data-test'` usa os identificadores disponibilizados pela aplicação.
- Locators usam `getByRole`, `getByPlaceholder` e `getByTestId`; assertions usam `await expect` com espera automática.
- Não há sleeps, `force: true`, testes ignorados nem mocks substituindo a aplicação real.
- O CI impede `test.only`, usa um worker e até duas novas tentativas. Um teste flaky também reprova a execução.

## Pipeline e relatórios

O workflow `.github/workflows/node.js.yml` roda em pushes para `main`, PRs para `main` e execução manual.

O job **Run E2E Tests** executa `npm ci`, TypeScript, formatação, instalação de Chromium com dependências e os três cenários. A instalação usa a versão de navegador correspondente ao Playwright fixado no lockfile.

Os relatórios HTML (`artifacts/report/`) e JUnit (`artifacts/results.xml`) e as evidências de falhas (`artifacts/media/`) são disponibilizados no Actions como `playwright-report-<tentativa>`, por sete dias. Para abrir um trace baixado:

```sh
npx playwright show-trace caminho/trace.zip
```

O job **Run SonarCloud** usa a action oficial, checkout com histórico completo e `secrets.SONAR_TOKEN`. Aguarda o **Quality Gate** e falha se a análise ou o gate falhar. A análise roda em `main` e PRs; execução manual de outra branch não exige análise de branch paga.

O projeto existente usa `sonar.projectKey=gabrielpagnan_prova03-playwright-GabrielMatiolaPagnan` e organização `gabrielpagnan`. O token deve permanecer em **Settings → Secrets and variables → Actions → SONAR_TOKEN**. Em SonarCloud, a análise deve ser **CI-based**, com análise automática desativada para evitar conflito.

Todos os arquivos em `src/`, incluindo o Page Object, são classificados como testes no SonarCloud. Os arquivos de configuração são fontes e não entram na cobertura. Não é declarada cobertura de código do site externo: E2E e análise estática verificam aspectos diferentes.

## Estrutura

```text
.github/workflows/node.js.yml   # pipeline
src/scenarios/SauceDemo.spec.ts # CT01, CT02 e CT03
src/support/pages/SauceDemoPage.ts # login reutilizado
playwright.config.ts           # navegador, isolamento, relatórios
sonar-project.properties       # projeto e escopo da análise
```

## Documentação oficial

- [Boas práticas](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Page Objects](https://playwright.dev/docs/pom)
- [Playwright no GitHub Actions](https://playwright.dev/docs/ci-intro)
- [SonarCloud no GitHub Actions](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/github-actions-for-sonarcloud/)

O site de demonstração é externo; indisponibilidade ou alterações nele podem exigir atualização dos testes.
