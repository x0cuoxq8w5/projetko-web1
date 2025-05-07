function addSection() {
    const caixa = document.getElementById('caixa');
    if(caixa.classList.contains('hidden')) {
        document.querySelector('#caixa').classList.add('visible');
        document.querySelector('#caixa').classList.remove('hidden');
        document.getElementById("overlay").classList.add("visible");
        document.getElementById("overlay").classList.remove("hidden");
        document.getElementById("container").style.zIndex = 0;
    } else {
        window.alert('Uma seção já está sendo adicionada')
    }
}