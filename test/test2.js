const accessToken = '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';
const username = 'pulkitxm';

fetch(`https://api.github.com/user/repos?visibility=private`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/vnd.github.v3+json'
  }
})
.then(response => {
  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(repos => {
  console.log('Number of private repositories:', repos.length);
  if (repos.length === 0) {
    console.log('You have no private repositories.');
  } else {
    console.log('Your private repositories:');
    repos.forEach(repo => {
      console.log(`- ${repo.name}`);
    });
  }
})
.catch(error => {
  console.error('Error:', error.message);
  if (error.message.includes('401')) {
    console.error('This might be due to an invalid access token. Please check your token.');
  }
});