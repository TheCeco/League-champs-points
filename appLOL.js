import { html, render } from "./node_modules/lit-html/lit-html.js";
import { getSummoner, getChamps, getChampsInfo } from "./api/api.js";

const summonerName = document.getElementById("summoner-name");
document.querySelector("button").addEventListener("click", onSubmit);

const apiKey = "";

const container = document.querySelector(".container");

async function onSubmit(event) {
  event.preventDefault();

  let champsNames = {};

  const summonerURL = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName.value}?api_key=${apiKey}`;
  const summoner = await getSummoner(summonerURL);

  const allChampsURL = `https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner.id}?api_key=${apiKey}`;
  const allChamps = await getChamps(allChampsURL);

  const champsInfoURL = `http://ddragon.leagueoflegends.com/cdn/12.23.1/data/en_US/champion.json`;
  let championsInfo = await getChampsInfo(champsInfoURL);
  championsInfo = championsInfo.data;

  const len = Object.values(championsInfo).length;

  for (let i = 0; i < len; i++) {
    let currentChampInfo = Object.values(championsInfo)[i];

    for (let j = 0; j < allChamps.length; j++) {
      let currentChampionId = allChamps[j];
      if (Number(currentChampInfo.key) === currentChampionId.championId) {
        champsNames[currentChampInfo.key] = {
          champName: currentChampInfo.name,
          champTitle: currentChampInfo.title,
          champImage: currentChampInfo.image.full,
          champLevel: currentChampionId.championLevel,
          champPoints: currentChampionId.championPoints,
          champChest: currentChampionId.chestGranted,
        };
      }
    }
  }

  champsNames = Object.values(champsNames).sort(
    (a, b) => a.champPoints - b.champPoints
  );
  champsNames = champsNames.reverse();

  summonerTemp(summoner, champsNames);
  summonerName.value = "";
}

function summonerTemp(summoner, champs) {
  const pSummoner = html`
    <p>Name: ${summoner.name}</p>
    <p>Level: ${summoner.summonerLevel}</p>
  `;

  let pChamps = Object.values(champs).map((champ) => champTemp(champ));

  render(pSummoner, container);
  render(pChamps, container);
}

function champTemp(champ) {
  const img = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champ.champImage}`;
  return html`
    <div class="champDiv">
      <p>${champ.champName}</p>
      <p>${champ.champTitle}</p>
      <img src=${img} />
      <p>Champion Level: ${champ.champLevel}</p>
      <p>Champion Points: ${champ.champPoints}</p>
      ${champ.champChest
        ? html`<p>Champion Chest: Unavailable</p>`
        : html`<p>Champion Chest: Available</p>`}
    </div>
  `;
}
