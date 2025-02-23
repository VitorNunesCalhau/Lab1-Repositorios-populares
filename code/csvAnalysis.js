const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, 'data.csv');
const repositories = [];

fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo CSV:', err);
    return;
  }

  const lines = data.split('\n');
  let currentRepo = {};

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Repository')) {
      if (Object.keys(currentRepo).length > 0) {
        repositories.push(currentRepo);
      }
      currentRepo = {};
    } else if (line.startsWith('Name:')) {
      currentRepo.name = line.split(': ')[1].replace(',', '');
    } else if (line.startsWith('Age:')) {
      currentRepo.age = parseInt(line.split(': ')[1].split(' ')[0]);
    } else if (line.startsWith('Pull requests:')) {
      currentRepo.pullRequests = parseInt(line.split(': ')[1]);
    } else if (line.startsWith('Releases:')) {
      currentRepo.releases = parseInt(line.split(': ')[1]);
    } else if (line.startsWith('Time since last commit:')) {
      currentRepo.timeSinceLastCommit = parseInt(line.split(': ')[1].split(' ')[0]);
    } else if (line.startsWith('Primary language:')) {
      currentRepo.primaryLanguage = line.split(': ')[1].replace(',', '');
    } else if (line.startsWith('Issue ratio:')) {
      currentRepo.issueRatio = parseFloat(line.split(': ')[1]);
    }
  });

  if (Object.keys(currentRepo).length > 0) {
    repositories.push(currentRepo);
  }

  console.log('CSV file successfully processed');
  analyzeData(repositories);
});

function analyzeData(repositories) {
  const totalRepos = repositories.length;

  // RQ 1
  const medianAge = calculateMedian(repositories.map(repo => repo.age));

  // RQ 2
  const medianPullRequests = calculateMedian(repositories.map(repo => repo.pullRequests));

  // RQ 3
  const medianReleases = calculateMedian(repositories.map(repo => repo.releases));

  // RQ 4
  const medianTimeSinceLastCommit = calculateMedian(repositories.map(repo => repo.timeSinceLastCommit));

  // RQ 5
  const languageCount = countByCategory(repositories.map(repo => repo.primaryLanguage));

  // RQ 6
  const medianIssueRatio = calculateMedian(repositories.map(repo => repo.issueRatio));

  console.log('RQ 1: Mediana da idade dos repositórios:', medianAge);
  console.log('RQ 2: Mediana de pull requests:', medianPullRequests);
  console.log('RQ 3: Mediana de releases:', medianReleases);
  console.log('RQ 4: Mediana do tempo desde última alteração:', medianTimeSinceLastCommit);
  console.log('RQ 5: Contagem de linguagem primária:', languageCount);
  console.log('RQ 6: Mediana do ratio de issues:', medianIssueRatio);

  // RQ bonus
  const languages = Object.keys(languageCount);
  languages.forEach(language => {
    const reposByLanguage = repositories.filter(repo => repo.primaryLanguage === language);
    const medianPullRequestsByLanguage = calculateMedian(reposByLanguage.map(repo => repo.pullRequests));
    const medianReleasesByLanguage = calculateMedian(reposByLanguage.map(repo => repo.releases));
    const medianTimeSinceLastCommitByLanguage = calculateMedian(reposByLanguage.map(repo => repo.timeSinceLastCommit));

    console.log(`Language: ${language}`);
    console.log(`  Mediana de pull requests: ${medianPullRequestsByLanguage}`);
    console.log(`  Mediana de releases: ${medianReleasesByLanguage}`);
    console.log(`  Mediana de tempo desde última alteração: ${medianTimeSinceLastCommitByLanguage}`);
  });
}

function calculateMedian(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

function countByCategory(items) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}