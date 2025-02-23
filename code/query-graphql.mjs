import fetch from 'node-fetch';
import fs from 'fs'; // Importando módulo para escrever em arquivos

const token = TOKEN; // Insira seu próprio token
const MAX_REPOSITORIES = 1000; // Defina o número máximo de repositórios a serem processados

const writeStream = fs.createWriteStream('data.csv');

let repoIndex = 1;

const fetchData = async (cursor = null, count = 0) => {
  if (count >= MAX_REPOSITORIES) {
    console.log('Limite de repositórios alcançado.');
    return;
  }

  const query = `
    query {
      search(query: "stars:>1", type: REPOSITORY, first: 5${cursor ? `, after: "${cursor}"` : ''}) {
        edges {
          node {
            ... on Repository {
              name
              createdAt
              url
              pullRequests(states: MERGED) {
                totalCount
              }
              releases {
                totalCount
              }
              updatedAt
              primaryLanguage {
                name
              }
              closedIssues: issues(states: CLOSED) {
                totalCount
              }
              totalIssues: issues {
                totalCount
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    committedDate
                  }
                }
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

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Erros no GraphQL:', result.errors);
      return;
    }

    const repos = result.data.search.edges.map(edge => edge.node);
    const { hasNextPage, endCursor } = result.data.search.pageInfo;

    repos.forEach(repo => {
      const now = new Date();
      const createdAt = new Date(repo.createdAt);
      const updatedAt = new Date(repo.updatedAt);
      const lastCommitDate = new Date(repo.defaultBranchRef?.target?.committedDate || repo.updatedAt);

      const age = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      const timeSinceLastUpdate = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
      const timeSinceLastCommit = Math.floor((now - lastCommitDate) / (1000 * 60 * 60 * 24));
      const issueRatio = repo.totalIssues.totalCount > 0 ? repo.closedIssues.totalCount / repo.totalIssues.totalCount : 0;

      writeStream.write(`Repository ${repoIndex}:\n`);
      writeStream.write(` Name: ${repo.name},\n`);
      writeStream.write(` Age: ${age} days,\n`);
      writeStream.write(` Pull requests: ${repo.pullRequests.totalCount},\n`);
      writeStream.write(` Releases: ${repo.releases.totalCount},\n`);
      writeStream.write(` Time since last update: ${timeSinceLastUpdate} days,\n`);
      writeStream.write(` Time since last commit: ${timeSinceLastCommit} days,\n`);
      writeStream.write(` Primary language: ${repo.primaryLanguage ? repo.primaryLanguage.name : 'None'},\n`);
      writeStream.write(` Issue ratio: ${issueRatio.toFixed(2)},\n`);
      writeStream.write(` Updated At: ${updatedAt},\n`);
      writeStream.write(` Last Commit Date: ${lastCommitDate}\n`);
      writeStream.write(` ------------------------------------------\n`);

      count++;
      repoIndex++;
    });

    if (hasNextPage && count < MAX_REPOSITORIES) {
      await fetchData(endCursor, count);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};

fetchData().then(() => {
  writeStream.end();
  console.log('Dados salvos no CSV com sucesso!');
});
