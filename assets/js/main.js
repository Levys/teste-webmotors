function ready(callbackFunc) {
    if (document.readyState !== 'loading') {
        // Se carregado, direto pra callback
        callbackFunc();
    } else if (document.addEventListener) {
        // Verifica novamente todos os navegadores modernos para registrem DOMContentLoaded
        document.addEventListener('DOMContentLoaded', callbackFunc);
    } else {
        // IE Morto
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
            callbackFunc();
            }
        });
    }
}
ready(function() {
    // Elementos Selects
    const resultadoBusca = document.querySelector("#resultadoBusca");
    const selectMarca = document.querySelector("#selectMarca");
    const selectModelo = document.querySelector("#selectModelo");
    const selectVersao  = document.querySelector("#selectVersao");
    const enviaBusca  = document.querySelector("#enviaBusca");
    var carros;
    // Api de marcas
    const api = 'http://desafioonline.webmotors.com.br/api/OnlineChallenge';
    // Options Headers
    const options = {
        method: 'GET',
        mode:  'cors',
        cache: 'default'
    }
    fetch(`${api+'/Make'}`, options)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
    })
    .then(json => {
        for(var i = 0; i < json.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = json[i].Name ;
            opt.value = json[i].ID ;
            selectMarca.appendChild(opt);
        }
    })
    .catch(error => console.log('Deu erro: '+ error));
    // Api Modelos
    const selectsForms = (select, ID) => {
        if (select == "/Model?MakeID=") {
            selectModelo.innerHTML = "";
        } else if (select == "/Version?ModelID=") {
            selectVersao.innerHTML = "";
        }
        fetch(`${api+select+ID}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
        .then(json => {
            for(var i = 0; i < json.length; i++) {
                if (select == "/Model?MakeID=") {
                    var opt = document.createElement('option');
                    opt.innerHTML = json[i].Name ;
                    opt.value = json[i].ID ;
                    selectModelo.appendChild(opt);
                } else if (select == "/Version?ModelID=") {
                    var opt = document.createElement('option');
                    opt.innerHTML = json[i].Name ;
                    opt.value = json[i].ID ;
                    selectVersao.appendChild(opt);                    
                } else {
                    console.log('Deu erro: '+ error);
                } 
            }
        })
        .catch(error => console.log('Deu erro: '+ error));
    }
    // Api Estoque
    fetch('http://desafioonline.webmotors.com.br/api/OnlineChallenge/Vehicles?Page=1', options)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
    })
    .then(json => {
        carros = json;
        for(let i = 0; i < json.length; i++) {
            let div = document.createElement('div');
            div.className = 'thumbCarros hide '+json[i].Model;
            div.dataset.modelo = json[i].Model;
            let h4 = document.createElement('h4');
            h4.textContent = json[i].Make+' '+json[i].Model;
            let img = document.createElement('img');
            img.src = json[i].Image;
            let p = document.createElement('p');
            p.innerHTML = `${json[i].Version+' <br /> '+json[i].KM+' <br /> '+json[i].Price+' <br /> '+ json[i].YearFab+'/'+json[i].YearModel+' <br /> '+json[i].Color}`;
            div.appendChild(img);
            div.appendChild(h4);
            div.appendChild(p);
            resultadoBusca.append(div);
        }
    })
    .catch(error => console.log('Deu erro: '+ error));
    // carrega os modelos a partir de marca
    selectMarca.addEventListener('change', (e) => {
        selectModelo.innerHTML = "";
        selectVersao.innerHTML = "";
        let str = '/Model?MakeID=';
        selectsForms(str,e.target.value);
    });
    // carrega as versões a partir do modelo
    selectModelo.addEventListener('change', (e) => {
        let str = '/Version?ModelID=';
        selectsForms(str,e.target.value);
    });
    // Faz uma busca na lista pré-carregada
    enviaBusca.addEventListener('click', (e) => {
        e.preventDefault();
        var thumbCarros = document.querySelectorAll('.thumbCarros');
        [].forEach.call(thumbCarros, function(el) {
            el.classList.add("hide");
        });        
        var elems = document.querySelectorAll('.resultadoBusca');
        [].forEach.call(elems, function(el) {
            el.classList.remove("hide");
        });        
        var str = selectModelo.options[selectModelo.selectedIndex].textContent;
        var modeloResult = [...document.querySelectorAll('[data-modelo]')].map((data, i, arr) => {
            let dt = data.dataset.modelo;
            var thumbEstoque = document.querySelectorAll("."+dt);
            var pResult = resultadoBusca.querySelector('.pResult');
            if (pResult !== null) {
                resultadoBusca.removeChild(pResult);
                // console.log("O elemento #filho existe em #pai");
              } else {
                console.log("O elemento #filho não existe em #pai");
              }
                
            if (dt == str) {
                [].forEach.call(thumbEstoque, function(el) {
                    el.classList.remove("hide");                    
                });    
            } else {
                if (arr.length - 1 === i) {
                    let p = document.createElement('p');
                    p.className = 'pResult';
                    p.textContent = 'Não encotramos nada em nosso estoque';
                    resultadoBusca.append(p);
                } 
            }
        });
        
    });
});





