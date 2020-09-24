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
        for(var i = 0; i < json.length; i++) {
            var div = document.createElement('div');
            div.className = 'thumbCarros hide '+json[i].Model;
            div.dataset.modelo = json[i].Model;
            var h4 = document.createElement('h4');
            h4.textContent = json[i].Make+' '+json[i].Model;
            var img = document.createElement('img');
            img.src = json[i].Image;
            var p = document.createElement('p');
            p.innerHTML = `${json[i].Version+' <br /> '+json[i].KM+' <br /> '+json[i].Price+' <br /> '+ json[i].YearFab+'/'+json[i].YearModel+' <br /> '+json[i].Color}`;
            div.appendChild(img);
            div.appendChild(h4);
            div.appendChild(p);
            resultadoBusca.append(div);
        }
    })
    .catch(error => console.log('Deu erro: '+ error));
    // Events
    selectMarca.addEventListener('change', (e) => {
        selectModelo.innerHTML = "";
        selectVersao.innerHTML = "";
        let str = '/Model?MakeID=';
        selectsForms(str,e.target.value);
    });
    selectModelo.addEventListener('change', (e) => {
        let str = '/Version?ModelID=';
        selectsForms(str,e.target.value);
    });
    
});





