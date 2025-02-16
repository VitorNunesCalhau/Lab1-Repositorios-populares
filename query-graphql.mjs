import fetch from "node-fetch";
import fs from "fs"; // Importando módulo para escrever em arquivos

const GITHUB_TOKEN = 'TOKEN';
const URL = "https://api.github.com/graphql";

// Função para fazer a requisição GraphQL com suporte a paginamento
async function fetchGitHubData() {
  let allRepositories = [];
  let hasNextPage = true;
  let endCursor = null;
  let reposFetched = 0;

  while (hasNextPage && reposFetched < 100) { // Limita a 100 repositórios
    const query = `
    {
      search(query: "stars:>1000", type: REPOSITORY, first: 5, after: "${endCursor || ""}") {
        edges {
          node {
            ... on Repository {
              name
              owner {
                login
              }
              createdAt
              updatedAt
              primaryLanguage {
                name
              }
              pullRequests {
                totalCount
              }
              releases {
                totalCount
              }
              issues {
                totalCount
              }
              closedIssues: issues(states: CLOSED) {
                totalCount
              }
              stargazers {
                totalCount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    `;

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (response.ok) {
      const repositories = data.data.search.edges;
      
      // Adiciona índice numerado aos repositórios
      const repositoriesWithIndex = repositories.map((repo, index) => ({
        index: reposFetched + index + 1, // Índice numérico
        ...repo.node // Adiciona os dados do repositório
      }));
      
      allRepositories = [...allRepositories, ...repositoriesWithIndex];
      reposFetched += repositories.length; // Contagem de repositórios recuperados
      hasNextPage = data.data.search.pageInfo.hasNextPage;
      endCursor = data.data.search.pageInfo.endCursor;
    } else {
      console.error("❌ Erro na requisição:", data);
      break;
    }
  }

  console.log("✅ Dados obtidos com sucesso!");
  return allRepositories;
}

// Função para salvar os dados em um arquivo JSON
async function saveDataToFile() {
  const repositories = await fetchGitHubData();

  // Salvar em arquivo
  fs.writeFileSync("repositorios_populares.json", JSON.stringify(repositories, null, 2));

  console.log("✅ Dados salvos em 'repositorios_populares.json'");
}

// Executar e salvar os dados
saveDataToFile();
