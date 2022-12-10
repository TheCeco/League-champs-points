export async function getSummoner(summonerURL) {
  const response = await fetch(summonerURL);
  const data = await response.json();

  return data;
}

export async function getChamps(championURL) {
  const response = await fetch(championURL);
  const data = await response.json();

  return data;
}

export async function getChampsInfo(championsUrl) {
  const response = await fetch(championsUrl);
  const data = await response.json();

  return data;
}
