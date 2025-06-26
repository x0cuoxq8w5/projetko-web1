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

async function addS() {
    hideBox(document.getElementById('addSBox'));
    let sectionBoxBGColor = getComputedStyle(document.getElementById('addSBox')).backgroundColor;
    sectionBoxBGColor = rgbStringToHex(sectionBoxBGColor);
    const sectionName = document.getElementById('SectionName').value;
    if(sectionName.trim() == "" || sectionName == null){
        window.alert('Nome inválido!');
        return;
    }
    const newSectionData = {
        name : sectionName,
        color : sectionBoxBGColor,
    }
    await fetch('http://localhost:8080/section', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSectionData)
    })
    .then(response => {
        console.log('Seção adicionada com sucesso!');
        closeAddSectionBox();
        updateAll();
    })
    .catch(error => {
        console.error('Erro na requisição ou ao adicionar a seção:', error);
        window.alert(`Erro ao adicionar seção: ${error.message || 'Não foi possível conectar ao servidor.'}`);
    })
}

async function addC(sectionId) {
    const card_create_url = `http://localhost:8080/section/${sectionId}/card`;
    hideBox(document.getElementById('addCBox'));
    const cardBoxBGColor = getComputedStyle(document.getElementById('addCBox')).backgroundColor;
    const cardName = document.getElementById('CardName').value;
    const cardDesc = document.getElementById('CardDesc').value;
    if(cardName.trim() == "" || cardName == null){
        window.alert('Nome inválido!');
        return;
    }

    let newCardData = {
            name: cardName,
            description: cardDesc,
            color: cardBoxBGColor,
        };
    
    await fetch(card_create_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCardData)
    })
    .then(response => {
        console.log('Card criado com sucesso!');
        closeAddCardBox();
        updateAll();
    })
    .catch(error => {
        console.error('Erro na criação do card:', error);
    });
}

async function changeC(sectionId, cardId) {
    const card_update_url = `http://localhost:8080/section/${sectionId}/card/${cardId}`;
    hideBox(document.getElementById('editCBox'));
    const newCardBoxBGColor = getComputedStyle(document.getElementById('editCBox')).backgroundColor;
    const newCardName = document.getElementById('NewCardName').value;
    const newCardDesc = document.getElementById('NewCardDesc').value;
    if(newCardName.trim() == "" || newCardName == null){
        window.alert('Nome inválido!');
        return;
    }

    let changedCardData = {
            name: newCardName,
            description: newCardDesc,
            color: newCardBoxBGColor,
        };
    
    await fetch(card_update_url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedCardData),
    })
    .then(response => {
        console.log('Card alterado com sucesso!');
        hideBox(document.getElementById('editCBox'));
        updateAll();
    })
    .catch(error => {
        console.error('Erro na edição do card:', error);
    });
}

async function delC(parentSectionId, cardId) {
    const card_url_to_delete = `http://localhost:8080/section/${parentSectionId}/card/${cardId}`
    const section = await getSectionById(parentSectionId);
    if(!section) return;
    await fetch(card_url_to_delete, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response =>{
        console.log('Card de id', cardId,'deletado com sucesso!');
        updateAll();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

async function delS(sectionID) {
    const section_url_to_delete = `http://localhost:8080/section/${sectionID}`;
    const section = await getSectionById(sectionID);
    const sections = await getSections();
    if(!section) return;

    if(section.cards.length > 0){
        for(c in section.cards){
            await delC(section.id, section.cards[c].id);
        }
    }

    fetch(section_url_to_delete, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Section de id', sectionID,'deletado com sucesso!');
        updateAll();
        if(sections.length == 1) location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

async function updateAll() {
    const sectionsDiv = document.getElementById('sections-div');
    const sections = await getSections();

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
                    delC(section.id, card.id);
                });

                editButton.addEventListener('click', (e) => {
                    const caixa = document.getElementById('editCBox');
                    const caixaButton = document.getElementById('editCButton');
                    document.getElementById('NewCardName').value = card.name;
                    document.getElementById('NewCardName').style.backgroundColor = hexColor
                    document.getElementById('NewCardDesc').value = card.description;
                    document.getElementById('NewCardDesc').style.backgroundColor = shadeColor(hexColor, 30);
                    document.getElementById('editCBox').style.backgroundColor = hexColor;
                    document.getElementById('ECClose').style.backgroundColor = veryDarkCColor;
                    showBox(caixa);
                    caixaButton.onclick = () => {
                        changeC(section.id, card.id);
                    }
                });

                let rightArrow = document.createElement('img');
                let leftArrow = document.createElement('img');
                rightArrow.style.backgroundColor = veryDarkCColor;
                leftArrow.style.backgroundColor = veryDarkCColor;

                if(sections.length > 1){
                    let sectionsToArrow = await getSections();
                    if(findIdIndex(sections, section.id) == 0) {
                        cardClickDiv.style.transform = 'none';
                        cardClickDiv.style.left = '0';
                        cardClickDiv.style.width = '80%';
                        rightArrow.src = 'images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                sectionsToArrow,
                                card
                            );
                        });
                        leftArrow.className = 'hidden';
                    } else if(findIdIndex(sections, section.id) == (sections.length)-1) {
                        cardClickDiv.style.transform = 'none';
                        cardClickDiv.style.right = '0';
                        cardClickDiv.style.width = '80%';
                        leftArrow.src = 'images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                sectionsToArrow,
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
                                sectionsToArrow,
                                card
                            );
                        });
                        leftArrow.src = 'images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                sectionsToArrow,
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
    let date = collectDate(card.creationDate);
    cardInfos.id = 'cardBoxInfos';
    cardDate.className = 'date';
    cardDate.innerHTML = `Card criado em ${date.day} de ${month[date.month]} de ${date.year} às ${date.hour}:${date.minute}`;

    cardInfos.appendChild(cardDate);

    cardBox.appendChild(cardName);
    cardBox.appendChild(cardDesc);
    cardBox.appendChild(cardInfos);
    showBox(cardBox);
}

async function goRight(sections, card) {
    let index = 0;
    let response;
    do {
        console.log(sections[index].id, card.id);
        if(index == sections.length){
            console.error('Card não pôde ser movido');
            return;
        }
        response = await fetch(`http://localhost:8080/section/${sections[index++].id}/card/${card.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    } while(!response.ok);
    const url = `http://localhost:8080/section/${sections[index-1].id}/card/${card.id}/move/${sections[index].id}`;
    let response2 = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    if(!response2.ok){
        console.error('Erro ao mover o card!');
        return;
    }
    console.log('Card movido!');
    updateAll();
}

async function goLeft(sections, card) {
    let index = sections.length-1;
    let response;
    do {
        console.log(sections[index].id, card.id);
        if(index == -1){
            console.error('Card não pôde ser movido');
            return;
        }
        response = await fetch(`http://localhost:8080/section/${sections[index--].id}/card/${card.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    } while(!response.ok);
    const url = `http://localhost:8080/section/${sections[index+1].id}/card/${card.id}/move/${sections[index].id}`;
    let response2 = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    if(!response2.ok){
        console.error('Erro ao mover o card!');
        return;
    }
    console.log('Card movido!');
    let newSections = await getSections();
    console.log(newSections);
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

function selectECColor(color) {
    let editCBox = document.getElementById('editCBox');
    let nameBox = document.getElementById('NewCardName');
    let descBox = document.getElementById('NewCardDesc');
    let closeBt = document.getElementById('ECClose');
    editCBox.style.backgroundColor = colors[color];
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
        if(object.id == idObject) return parseInt(i);
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

async function getSections() {
    const response = await fetch('http://localhost:8080/section/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if(!response.ok){
        const errorData = await response.json();
        console.error('Erro ao buscar as seções:', response.status, errorData);
        return null;
    }
    const sections = await response.json();
    console.log('Seções carregadas com sucesso!');
    return sections;
}

async function getSectionById(id) {
    const section_url = `http://localhost:8080/section/${id}`;
    const response = await fetch(section_url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if(!response.ok){
        const errorData = await response.json();
        console.error('Erro ao buscar a seção:', response.status, errorData);
        return null;
    }
    const section = await response.json();
    console.log('Seção de id', id, 'carregado com sucesso!');
    return section;
}

async function getCard(parentId, id){
    const card_url = `http://localhost:8080/section/${parentId}/card/${id}`;
    const response = await fetch(card_url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if(!response.ok){
        const errorData = await response.json();
        console.error('Erro ao buscar o card:', response.status, errorData);
        return null;
    }
    const card = await response.json();
    console.log('Card de id', id, 'da seção de id', parentId, 'carregado com sucesso!');
    return card;
}

function collectDate(date) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    let hour = date.substring(11, 13);
    let minute = date.substring(14, 16);
    return {
        year: year,
        month: month-1,
        day: day,
        hour: hour,
        minute: minute
    }
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