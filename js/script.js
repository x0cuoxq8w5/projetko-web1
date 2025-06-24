// PARA EU VER NO FUTURO, O PROBLEMA Q VOU RESOLVER É:
// AJEITAR A ORGANIZAÇÃO DOS IDs (OU EU FAÇO OS IDS SE ORGANIZAREM TODA
// VEZ QUE UMA AÇÃO É FEITA, OU EU SÓ CRIO NO LOCALSTORAGE UM ID FIXO.
// PENSEI TAMBÉM EM FAZER UMA KEY NO LOCALSOTRAGE QUE GUARDA O ÚLTIMO
// ID EXISTENTE E, SE UM CARD FOR DELETADO, ESSE ID FICA RESERVADO EM
// UMA KEY DE "IDs LIBERADOS". ESSA IDEIA AINDA ESTÁ EM STANDBY)

const overlay = document.getElementById('overlay');

const colors = {
    purple : "#faa4ff",
    red : "#ffa4a4",
    yellow : "#fffca4",
    orange : "#ffcfa4",
    blue : "#a4b3ff",
    pink : "#ffa4fa",
    green : "#d1ffa4",
    brown : "#ffd7a4",
    cyan : "#a4fffa",
    grey : "#d6d6d6",
    s_purple: "#c622f5",
    s_red: "#f52222",
    s_yellow: "#f5e422",
    s_orange: "#f59422",
    s_blue: "#2245f5",
    s_pink: "#f522d5",
    s_green: "#4ff522",
    s_brown: "#f59422",
    s_cyan: "#22f3f5",
    s_grey: "#a0a0a0"
}

const month = {
    0 : "Janeiro",
    1 : "Fevereiro",
    2 : "Março",
    3 : "Abril",
    4 : "Maio",
    5 : "Junho",
    6 : "Julho",
    7 : "Agosto",
    8 : "Setembro",
    9 : "Outubro",
    10 : "Novembro",
    11 : "Dezembro"
}

function ini(){
    updateAll();
    if(JSON.parse(localStorage.getItem("IDc")) === null){
        localStorage.setItem("IDc", JSON.stringify(0));
    }
    if(JSON.parse(localStorage.getItem("IDcFree")) === null){
        localStorage.setItem("IDcFree", JSON.stringify([]));
    }
    if(JSON.parse(localStorage.getItem("IDs")) === null){
        localStorage.setItem("IDs", JSON.stringify(0));
    }
    closeAddSectionBox();
    closeAddCardBox();
    closeCardBox();
}

function addSection() {
    const caixa = document.getElementById('addSBox');
    if(caixa.classList.contains('hidden')) {
        caixa.classList.replace('hidden', 'visible');
        overlay.classList.replace('hidden', 'visible');
    } else {
        window.alert('Uma seção já está sendo adicionada');
    }
}

function closeBoxes() {
    const caixas = document.getElementsByClassName('box');
    for (c in caixas){
        let caixa = caixas[c];
        if(caixa.classList.contains('visible')){
            hideBox(caixa);
            break;
        }
    }
}

function addS() {
    hideBox(document.getElementById('addSBox'));
    let sectionBoxBGColor = getComputedStyle(document.getElementById('addSBox')).backgroundColor;
    sectionBoxBGColor = rgbStringToHex(sectionBoxBGColor);
    const sectionName = document.getElementById('SectionName').value;
    if(sectionName.trim() == "" || sectionName == null){
        window.alert('Nome inválido!');
        return;
    }
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let sectionId = JSON.parse(localStorage.getItem('IDs')) || 0;
    let section = {
        id : sectionId++,
        name : sectionName,
        color : sectionBoxBGColor,
        cards : []
    }
    sections.push(section);
    localStorage.setItem('sections', JSON.stringify(sections));
    localStorage.setItem('IDs', JSON.stringify(sectionId));
    updateAll();
}

function addC(sectionId) {
    hideBox(document.getElementById('addCBox'));
    const cardBoxBGColor = getComputedStyle(document.getElementById('addCBox')).backgroundColor;
    const cardName = document.getElementById('CardName').value;
    const cardDesc = document.getElementById('CardDesc').value;
    const cardDate = new Date();
    if(cardName.trim() == "" || cardName == null){
        window.alert('Nome inválido!');
        return;
    }
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let freeIdArray = JSON.parse(localStorage.getItem('IDcFree')) || [];
    let card = {
            parentId : sectionId,
            id : 0,
            name: cardName,
            description: cardDesc,
            color: cardBoxBGColor,
            date: {
                day: cardDate.getDate(),
                month: cardDate.getMonth(),
                year: cardDate.getFullYear(),
                hour: cardDate.getHours(),
                minutes: cardDate.getMinutes()
            }
        };
    if(freeIdArray.length !== 0){
        let freeId = freeIdArray.pop();
        card.id = freeId;
        localStorage.setItem('IDcFree', JSON.stringify(freeIdArray));
    } else{
        let cardId = JSON.parse(localStorage.getItem('IDc')) || 0;
        card.id = cardId++;
        localStorage.setItem('IDc', JSON.stringify(cardId));
    }
    sections[sectionId].cards.push(card);
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function delC(parentSectionId, card) {
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let idFree = JSON.parse(localStorage.getItem('IDcFree')) || [];
    if(!sections[parentSectionId]) return;
    sections[parentSectionId].cards = sections[parentSectionId].cards.filter(x => x.id !== card.id);
    idFree.push(card.id);
    localStorage.setItem('sections', JSON.stringify(sections));
    localStorage.setItem('IDcFree', JSON.stringify(idFree));
    updateAll();
}

function delS(sectionID) {
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    if(!sections[sectionID]) return;
    let ids = JSON.parse(localStorage.getItem('IDs')) || 0;
    let sectionToDelete = sections[sectionID];
    if(sectionToDelete.cards.length != 0){
        for(c in sectionToDelete.cards){
            delC(sectionToDelete.cards[c].parentId, sectionToDelete.cards[c]);
        }
    }
    sections = sections.filter(x => x.id !== sectionID);
    reorderIDs(sections);
    ids--;
    localStorage.setItem('sections', JSON.stringify(sections));
    localStorage.setItem('IDs', ids);
    updateAll();
    if(ids === 0) location.reload();
}

function updateAll() {
    const sectionsDiv = document.getElementById('sections-div');
    const sections = JSON.parse(localStorage.getItem('sections')) || [];
    document.getElementById('SectionName').value = '';
    document.getElementById('CardName').value = '';
    if(sections.length > 0){
        sectionsDiv.innerHTML = "";
        for(i in sections){
            let section = sections[i];
            let color = section.color;
            let darkColor = shadeColor(section.color, -15);
            let veryDarkColor = shadeColor(section.color, -35)
            let sectionDiv = document.createElement('div');
            sectionDiv.style.backgroundColor = color;
            let sectionDelButton = document.createElement('button');
            let sectionName = document.createElement('h2');
            let addCardButton = document.createElement('button');
            sectionDelButton.style.backgroundColor = veryDarkColor;
            sectionDelButton.className = 'del';
            sectionDelButton.innerHTML = 'X';
            sectionDelButton.addEventListener('click', (e) => {
                delS(section.id);
            });
            addCardButton.style.backgroundColor = darkColor;
            addCardButton.innerHTML = 'Adicionar Card +';
            addCardButton.addEventListener('click', (e) => {
                const caixa = document.getElementById('addCBox');
                const caixaButton = document.getElementById('addCButton');
                showBox(caixa);
                caixaButton.onclick = () => {
                    addC(parseInt(e.target.parentElement.id));
                }
            });
            sectionName.style.backgroundColor = darkColor;
            sectionName.innerHTML = section.name;
            sectionDiv.id = section.id;
            sectionDiv.className = 'section';
            sectionDiv.appendChild(sectionDelButton);
            sectionDiv.appendChild(sectionName);

            let cards = section.cards
            for(c in cards) {
                let card = cards[c];
                let cardDiv = document.createElement('div');
                let cardClickDiv = document.createElement('div');
                let cardName = document.createElement('p');
                cardDiv.className = 'card';
                cardDiv.style.backgroundColor = card.color;
                cardClickDiv.className = 'card-click';
                cardClickDiv.addEventListener('click', (e) => {
                    openCardInfos(card);
                });
                cardName.innerHTML = card.name;

                let hexColor = rgbStringToHex(card.color);
                let darkCColor = shadeColor(hexColor, 0);
                let veryDarkCColor = shadeColor(hexColor, -15);
                let delButton = document.createElement('button');
                let editButton = document.createElement('button');
                delButton.className = 'side-bt delete';
                delButton.innerHTML = 'Del';
                delButton.style.backgroundColor = darkCColor;
                editButton.className = 'side-bt edit';
                editButton.innerHTML = 'Edit';
                editButton.style.backgroundColor = darkCColor;

                delButton.addEventListener('click', (e) =>{
                    delC(card.parentId, card);
                });

                let rightArrow = document.createElement('img');
                let leftArrow = document.createElement('img');
                rightArrow.style.backgroundColor = veryDarkCColor;
                leftArrow.style.backgroundColor = veryDarkCColor;

                if(sections.length > 1){
                    if(card.parentId == 0) {
                        cardClickDiv.style.transform = 'none';
                        cardClickDiv.style.left = '0';
                        cardClickDiv.style.width = '80%';
                        rightArrow.src = 'images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        leftArrow.className = 'hidden';
                    } else if(card.parentId == (sections.length)-1) {
                        cardClickDiv.style.transform = 'none';
                        cardClickDiv.style.right = '0';
                        cardClickDiv.style.width = '80%';
                        leftArrow.src = 'images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        rightArrow.className = 'hidden';
                    } else {
                        cardClickDiv.style.transform = 'translate(-50%)';
                        cardClickDiv.style.left = '50%';
                        cardClickDiv.style.width = '62%';
                        rightArrow.src = 'images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        leftArrow.src = 'images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                    }
                } else {
                    rightArrow.className = 'hidden';
                    leftArrow.className = 'hidden';
                    cardClickDiv.style.width = '100%'
                }

                cardDiv.appendChild(cardClickDiv);
                cardDiv.appendChild(leftArrow);
                cardDiv.appendChild(cardName);
                cardDiv.appendChild(rightArrow);
                cardDiv.appendChild(delButton);
                cardDiv.appendChild(editButton);
                sectionDiv.appendChild(cardDiv);
            }

            sectionDiv.appendChild(addCardButton);
            sectionsDiv.appendChild(sectionDiv);
        }
    }
}

function showBox(box) {
    box.classList.replace('hidden', 'visible');
    overlay.classList.replace('hidden', 'visible');
}

function hideBox(box) {
    box.classList.replace('visible', 'hidden');
    overlay.classList.replace('visible', 'hidden');
}

function closeAddSectionBox() {
    let box = document.getElementById('addSBox');
    document.getElementById('SectionName').value = '';
    document.getElementById('SectionName').style.backgroundColor = colors.s_grey;
    document.getElementById('SClose').style.backgroundColor = shadeColor(colors.s_grey, -20);
    box.style.backgroundColor = colors.s_grey;
    if(box.classList.contains('visible')){
        hideBox(box);
    }
}

function closeAddCardBox() {
    let box = document.getElementById('addCBox');
    document.getElementById('CardName').value = '';
    document.getElementById('CardName').style.backgroundColor = colors.grey;
    document.getElementById('CardDesc').value = '';
    document.getElementById('CardDesc').style.backgroundColor = shadeColor(colors.grey, 30);
    document.getElementById('CClose').style.backgroundColor = shadeColor(colors.grey, -20);
    box.style.backgroundColor = colors.grey;
    if(box.classList.contains('visible')){
        hideBox(box);
    }
}

function closeCardBox() {
    let box = document.getElementById('cardBox');
    let closeBt = document.createElement('button');
    closeBt.innerHTML = 'X';
    closeBt.id = 'CBClose';
    closeBt.className = 'close-bt';
    closeBt.addEventListener('click', (e) => {
        closeCardBox();
    });
    box.innerHTML = '';
    box.appendChild(closeBt);
    if(box.classList.contains('visible')){
        hideBox(box);
    }
}

function openCardInfos(card) {
    let cardBox = document.getElementById('cardBox');
    let cardName = document.createElement('h2');
    let cardDesc = document.createElement('p');
    cardName.innerHTML = card.name;
    cardDesc.innerHTML = card.description;

    let cardInfos = document.createElement('div');
    let cardDate = document.createElement('p');
    cardInfos.id = 'cardBoxInfos';
    cardDate.className = 'date';
    cardDate.innerHTML = `Card criado em ${card.date.day} de ${month[card.date.month]} de ${card.date.year} às ${card.date.hour}:${card.date.minutes}`

    cardInfos.appendChild(cardDate);

    cardBox.appendChild(cardName);
    cardBox.appendChild(cardDesc);
    cardBox.appendChild(cardInfos);
    showBox(cardBox);
}

function goRight(sections, card) {
    let sectionsAmount = sections.length;
    for(let s=0; s<sectionsAmount; s++){
        let section = sections[s];
        if(section.id === card.parentId){
            section.cards.splice(findIdIndex(section.cards, card), 1);
            card.parentId++;
            sections[s+1].cards.push(card);
            break;
        }
    }
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function goLeft(sections, card) {
    let sectionsAmount = sections.length;
    for(let s=0; s<sectionsAmount; s++){
        let section = sections[s];
        if(section.id === card.parentId){
            section.cards.splice(findIdIndex(section.cards, card), 1);
            card.parentId--;
            sections[s-1].cards.push(card);
            break;
        }
    }
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function reorderIDs(array) {
    let count = 0;
    for(i in array) {
        array[i].id = count++;
    }
}

function selectCColor(color) {
    let addCBox = document.getElementById('addCBox');
    let nameBox = document.getElementById('CardName');
    let descBox = document.getElementById('CardDesc');
    let closeBt = document.getElementById('CClose');
    addCBox.style.backgroundColor = colors[color];
    nameBox.style.backgroundColor = colors[color];
    descBox.style.backgroundColor = shadeColor(colors[color], 30);
    closeBt.style.backgroundColor = shadeColor(colors[color], -20);
}

function selectSColor(color) {
    let addSBox = document.getElementById('addSBox');
    let nameBox = document.getElementById('SectionName');
    let closeBt = document.getElementById('SClose');
    addSBox.style.backgroundColor = colors[color];
    nameBox.style.backgroundColor = colors[color];
    closeBt.style.backgroundColor = shadeColor(colors[color], -20);
}

function findIdIndex(array, idObject) {
    for(i in array) {
        let object = array[i];
        if(object.id == idObject.id) return parseInt(i);
    }
}

function shadeColor(hex, percent) {
    hex = hex.replace(/^#/, '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, r + (r * percent / 100)));
    g = Math.min(255, Math.max(0, g + (g * percent / 100)));
    b = Math.min(255, Math.max(0, b + (b * percent / 100)));

    return '#' +
        Math.round(r).toString(16).padStart(2, '0') +
        Math.round(g).toString(16).padStart(2, '0') +
        Math.round(b).toString(16).padStart(2, '0');
}

function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map(valor => valor.toString(16).padStart(2, "0"))
            .join("")
    );
}

function rgbStringToHex(rgbString) {
    const [r, g, b] = rgbString
        .match(/\d+/g)
        .map(Number);
    return rgbToHex(r, g, b);
}

document.getElementById("addSForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita qualquer ação de envio ou outra
    }
});

document.getElementById("addCForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita qualquer ação de envio ou outra
    }
});