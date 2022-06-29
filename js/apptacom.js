//Documentação: https://leafletjs.com/examples.html
var map;
var coordenadas = [];

var intervalo;

var caminhoBase;

const proxyurl = "https://api.allorigins.win/raw?url=";

var map = L.map('map_canvas').setView([-2.5654715,-44.335838], 11);
var mapLink = '<a href="http://www.esri.com/">Esri</a>';
var wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

	
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);
	
    
var sat = L.tileLayer(
	'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: '&copy; '+mapLink+', '+wholink,
	maxZoom: 17,
});
	
var satelite = L.tileLayer('http://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'Dados cartográficos &copy;2020  Imagens ©2020 , CNES / Airbus, Maxar Technologies',
	maxZoom: 18
});    	

var baseMaps = {
	"Mapa": osm,
    "Satelite1": sat,
    "Satelite2": satelite,
};
    
var overlays =  {//add any overlays here   
};

L.control.layers(baseMaps,overlays, {position: 'topright'}).addTo(map);

var options = {
	tooltipTextFinish: 'Clique para <b>terminar a linha</b><br>',
    tooltipTextAdd: 'Pressione CTRL-key e clique para <b>adicionar um ponto</b>',
                                    // language dependend labels for point's tooltips
	tooltipTextMove: 'Clique e arraste para <b>mover o ponto</b><br>',
    measureControlTitleOn: 'Ativar PolylineMeasure',   // Title for the control going to be switched on
    measureControlTitleOff: 'Desativar PolylineMeasure' // Title for the control going to be switched off
}
L.control.polylineMeasure(options).addTo(map);

/*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ',
    id: 'mapbox.streets'
}).addTo(map);
*/
var markerGroupPontos = L.layerGroup().addTo(map);
var markerGroupOnibus = L.layerGroup().addTo(map);
var caminhoDaLinha = L.featureGroup().addTo(map);;

var iconeOnibusGreen = L.icon({
    iconUrl: 'images/busGreen.png',

    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor

});

var iconeOnibusRed = L.icon({
    iconUrl: 'images/busRed.png',

    iconSize: [20, 20], // size of the icon
    iconAnchor: [20, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor

});

var iconePessoa = L.icon({
    iconUrl: 'images/pessoa.png',

    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 30], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor

});

// placeholders for the L.marker and L.circle representing user's current position and accuracy    
var current_position, current_accuracy;

//relacted to colors used by m2m
var colors = [
        "#6D6D6D", //no color
        '#008E1D', //1
        '#009DE6', //2
        '#FF2839', //3
        '#FF8329', //4
        '#FFEF3F', //5
        '#9b59b6', //6
        '#0048D7', //7
        '#004163', //8
        '#000941', //9
        '#00906F', //10
        '#00E0AE', //11
        '#00D152', //12
        '#FF5C23', //13
        '#FFBF35', //14
        '#ff378d', //15
        '#FF006F', //16
        '#FF58C4', //17
        '#FF00C8'  //18
    ];

//-----------------------------------------------------------------------------------

//Carrega todos os pontos
function carregaTodosOsPontos() {

	limparMapa();
	
	$.ajax({
		type: "GET",
		url: caminhoBase + "/forecast/lines/load/allPoints/" + idEmpresa,
		dataType: "JSON",
		success: function (data) {
			for (let index = 0; index < data.length; index++) {
				manipulaPonto(data[index].latLng.lat, data[index].latLng.lng, data[index].name, data[index].id);
			}
		},
		error: function (request, status, error) {
			$('#detalhehorario').text(request.responseText);
		}

	});

}

//-----------------------------------------------------------------------------------
function mudouEmpresa(idEmpresa){
	if(idEmpresa <= 1){
		caminhoBase = "http://msl.citgis.com.br:6060/siumobile-ws-v01/rest/ws"
	}else 
	if(idEmpresa == 2){
		
		caminhoBase = "http://sfo.citgis.com.br:6060/siumobile-ws-v01/rest/ws"
	}else
	if(idEmpresa == 3){
		caminhoBase = "http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws"
	}else
	if(idEmpresa == 4){
		caminhoBase = "http://ec2-54-207-26-182.sa-east-1.compute.amazonaws.com:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 5){
		caminhoBase = "http://201.30.158.137:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 6){
		caminhoBase = "http://siumobile.teubilhete.com.br:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 7){
		caminhoBase = "http://trancid.ddns.net:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 8){
		caminhoBase = "http://siumobilews.mobigv.com.br:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 9){
		caminhoBase = "http://taguatur.citgis.com.br:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 10){
		caminhoBase = "http://mobile.araguarina.com.br:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 11){
		caminhoBase = "http://200.167.14.136:6060/siumobile-ws-v01/rest/ws"
	}
	else
	if(idEmpresa == 12){
		caminhoBase = "http://gdefloripamaisintegrada-citgis.tacom.srv.br:6060/siumobile-ws-v01/rest/ws"
	}
	//Limpa os selects
	$('#viagem').empty();
	$('#ponto').empty();
	//Limpa infos adicionais
	$('#detalhelinha').html("");
	$('#detalhedestino').html("");
	
	
    //Carrega todoas as linhas do cliente
	
	$.ajax({          
		url: caminhoBase + '/buscarLinhas/callback',
		type:  'GET',
		crossDomain: true,
		dataType: 'jsonp', 
		jsonpCallback: 'callback',
		async : true,
		timeout: 10000,
		cache: false,
		success: function (json) {
		var objeto = json.linhas[0].split('},{');
			$('#linha').empty();
			$('#linha').append($('<option>').text("Selecione uma linha"));
			$.each(objeto, function (i, obj) {
				$('#linha').append(
				$('<option>')
				.text(
					obj.split(',')[1].split(':')[1].replaceAll('\'', '') + " - " + 
					obj.split(',')[2].split(':')[1].replaceAll('\'', '') + " (" + 
					obj.split(',')[0].split(':')[1].replaceAll('\'', '') + ")"
				)
				.attr('value', obj.split(',')[0].split(':')[1].replaceAll('\'', '')))
			});
		},
        error: function (request, status, error) {
            $('#detalhehorario').text(request.responseText);
        }
	});
	
}

//Função que é chamada quando muda o select de linhas
function mudouLinha(idLinha, nomeLinha) {
    $('#detalhelinha').html("<b>Linha: </b>" + nomeLinha + "<br>");
    carregaViagens(idLinha);
}

//Carrega o select de viagens
function carregaViagens(idLinha) {
	$.ajax({          
		url: caminhoBase + '/buscarItinerariosLinha/' + idLinha + '/callback',
		type:  'GET',
		crossDomain: true,
		dataType: 'jsonp', 
		jsonpCallback: 'callback',
		async : true,
		timeout: 10000,
		cache: false,
		success: function (json) {
		var objeto = json.itinerarios;
			$('#viagem').empty();
			$('#viagem').append($('<option>').text("Selecione uma origem"));
			$.each(objeto, function (i, obj) {
				$('#viagem').append($('<option>').text(obj.descricao + " (" + obj.cod + ")").attr('value', obj.cod))
			});
		},
        error: function (request, status, error) {
            $('#detalhehorario').text(request.responseText);
        }
	});
	
    $('#ponto').empty();

}

function carregaPontos(idItinerario){
	$.ajax({          
		url: caminhoBase + '/buscarParadasPorItiComCoordenadas/'+idItinerario+'/1/callback',
		type:  'GET',
		crossDomain: true,
		dataType: 'jsonp', 
		jsonpCallback: 'callback',
		async : true,
		timeout: 10000,
		cache: false,
		success: function (json) {
			var dadosParadas = json.paradas
			var qtdPontos = Object.keys(dadosParadas).length;
			if (qtdPontos < 1) {
                $('#detalhedestino').append("<br><span style='color:red'>Não há pontos para esta viagem!</span>");
            } else {
				for (let i = 0; i < qtdPontos; i ++) {
					var dadoParada = dadosParadas[i];
					manipulaPonto(
						dadoParada.y, 
						dadoParada.x, 
						dadoParada.desc, 
						dadoParada.cod
					);
				}
			}
		},
        error: function (request, status, error) {
            $('#detalhehorario').text(request.responseText);
        }
	});
}


//Desenha a polyline no mapa e seta detalhes da viagem
function carregaTracado(idItinerario) {
    $.ajax({          
		url: caminhoBase + '/buscarItinerario/' + idItinerario +'/1/retornoJSONItinerario',
		type:  'GET',
		crossDomain: true,
		dataType: 'jsonp', 
		jsonpCallback: 'retornoJSONItinerario',
		async : true,
		timeout: 10000,
		cache: false,
		success: function (json) {
			var dadosItinerarios = json.itinerarios
			var qtdCoordenadas = Object.keys(dadosItinerarios).length;
   
			if (qtdCoordenadas < 1) {
                $('#detalhedestino').append("<br><span style='color:red'>Não há traçado para esta viagem!</span>");
            } else {	
				for (let i = 0; i < qtdCoordenadas; i ++) {                
					var linePoint = dadosItinerarios[i];
					coordenadas.push([parseFloat(linePoint.coordY), parseFloat(linePoint.coordX)]); 
				}
				polyline = L.polyline(coordenadas, { color: colors[1] }).addTo(caminhoDaLinha); 
				map.fitBounds(caminhoDaLinha.getBounds());
			}
		},
        error: function (request, status, error) {
            $('#detalhehorario').text(request.responseText);
        }
	});
}

function carregaHorarios(idLinha){
    $('#horarios').show();
    $('#detalhehorario').append("<center><b>HORÁRIOS PREVISTOS</b></center>");

    $.ajax({
       url: caminhoBase + '/retornaQroLinha/' + idLinha +'/1/retornoJSON',
		type:  'GET',
		crossDomain: true,
		dataType: 'jsonp', 
		jsonpCallback: 'retornoJSON',
		async : true,
		timeout: 10000,
		cache: false,
        success: function (json) {

            var dadosQRO = json.qros
			var qtdQROs = dadosQRO.length;
			
			var ultimaOrigem="";
			var tipoDiaAnterior="";

			if (qtdQROs < 1) {
                $('#detalhehorario').append("<span style='color:red'>Não há horários para esta viagem!</span>");
            }else{
				for (let i = 0; i < qtdQROs; i ++) {
					var dt = dadosQRO[i];
					
					if(dt.origem != ultimaOrigem){
						if(ultimaOrigem!=""){
							//txtSaida.push("</td></tr></table></div><br/><br/>")
						}
						
						ultimaOrigem = dt.origem;
						tipoDiaAnterior="";//zera o tipo de dia

						$('#detalhehorario').append("<div><b>Origem: "+ dt.origem +"</b></div>");
					}
					
					if(dt.tipoDia != tipoDiaAnterior){
						if(tipoDiaAnterior != ""){
							//txtSaida.push("</td></tr><tr><td class='titTipoDia'>")
						}
						$('#detalhehorario').append("<div><b>"+ dt.tipoDia +"</b></div>");
						tipoDiaAnterior = dt.tipoDia;
					}

					$('#detalhehorario').append(dt.horario + " ");
				}
			}
	
        },
        error: function (request, status, error) {
            $('#detalhehorario').append(request.responseText);
        }
    });
}

function onMarkerClick(e) {
    clearInterval(intervalo);
    $('.ui.dropdown select#ponto').dropdown('set selected', e.target._leaflet_id);
    map.panTo(e.target.getLatLng());
}

//Função para colocar pontos e movê-los no mapa
function manipulaPonto(lat, lng, nome, idPonto) {

    var contentString =
        '<h3 id="firstHeading" class="firstHeading">Informações</h3>' +
        '<div id="bodyContent">' +
        '<p><h7><b>Id: </b>' + idPonto + '</h7>' +
        '<p><h7><b>Nome: </b>' + nome + '</h7>' +
        '</div>';


    var markerLocal;

    markerLocal = L.marker([lat, lng], { opacity: 0.9 }).addTo(map);
    markerLocal.bindPopup(contentString);
    markerLocal.bindTooltip(nome);
    markerLocal.on('click', onMarkerClick);

    markerGroupPontos.getLayer(idPonto) != null ? markerGroupPontos.removeLayer(idPonto) : false;

    markerLocal._leaflet_id = idPonto;
    markerLocal.addTo(markerGroupPontos);

}

//Função para colocar ônibus e movê-los no mapa
function manipulaOnibus(lat, lng, id_ponto, cor) {
	var siteOB = 'https://onibusbrasil.com/empresa/cootraps/'
    var conteudoPopUp =
        '<h3 id="firstHeading" class="firstHeading">Informações</h3>' +
        '<div id="bodyContent">' +
        '<p>'+
		'<p><h7><b>Veículo: </b><a target="_blank" href=' + siteOB + id_ponto + '>' + id_ponto + '</a></h7><br>' +
        '<h7><b>Lat: </b>' + lat + '</h7><br>' +
		'<h7><b>Lng: </b>' + lng + '</h7><br>' +
        '</div>';

    var conteudoTooltip = id_ponto;

    var markerLocal;

    markerLocal = L.marker([lat, lng], { icon: cor == 1 ? iconeOnibusGreen : iconeOnibusRed }).addTo(map);
    markerLocal.bindPopup(conteudoPopUp);
    markerLocal.bindTooltip(conteudoTooltip, { permanent: true, direction: 'left', className: 'label-onibus', offset: [-10, 0] });
    
    markerGroupOnibus.getLayer(id_ponto) != null ? markerGroupOnibus.removeLayer(id_ponto) : false;
    
	markerLocal._leaflet_id = id_ponto;
    markerLocal.addTo(markerGroupOnibus);

}

//Função responsável por saber onde onde os ônibus estão a manipulação
function carregaOnibus(idItinerario) {
	var elem = document.getElementById("myBar");
	var width = 0;
	
    //Atualiza a cada 15 segundos
    intervalo = setInterval(function () {
        $.ajax({
            url: caminhoBase + '/retornaVeiculosMapa/' + idItinerario +'/1/retornoJSONVeiculos',
			type:  'GET',
			crossDomain: true,
			dataType: 'jsonp', 
			jsonpCallback: 'retornoJSONVeiculos',
			async : true,
			timeout: 10000,
			cache: false,
            success: function (json) {
                //Limpa a layer dos ônibus
                markerGroupOnibus.clearLayers();
				
				var dadosVeiculos = json.veiculos
				var qtdVeiculos = Object.keys(dadosVeiculos).length;
				
				if (qtdVeiculos < 1) {
					//$('#detalhedestino').append("<br><span style='color:red'>Não há pontos para esta viagem!</span>");
				} else {
					for (let i = 0; i < qtdVeiculos; i++) {
						manipulaOnibus(dadosVeiculos[i]['lat'], dadosVeiculos[i]['long'], dadosVeiculos[i]['numVeicGestor'], dadosVeiculos[i]['cor']);
					}
				}
            },
            error: function (request, status, error) {
                $('#detalhehorario').text(request.responseText);
            }
        });		
    }, 15 * 1000);
}

//Função para limpar tudo.
function limparMapa() {
    if (coordenadas.length > 1) {
        
        markerGroupPontos.clearLayers();
        markerGroupOnibus.clearLayers();
        caminhoDaLinha.clearLayers();

        //caminhoDaLinha != null && caminhoDaLinha.length >= 0 ? caminhoDaLinha.removeLayer(caminhoDaLinha) : false;
        // caminhoDaLinha[1] != null && caminhoDaLinha[1].length >= 0 ? map.removeLayer(caminhoDaLinha[1]) : false;
        // caminhoDaLinha[2] != null && caminhoDaLinha[2].length >= 0 ? map.removeLayer(caminhoDaLinha[2]) : false;
        // caminhoDaLinha[3] != null && caminhoDaLinha[3].length >= 0 ? map.removeLayer(caminhoDaLinha[3]) : false;
        
        coordenadas = [];

        $('#detalhedestino').text("");
        $('#detalhehorario').text("");
        $('#horarios').hide();

        clearInterval(intervalo);
    }
}

//Função de 0s a esquerda
function leftPad(value, length) { 
	return ('0'.repeat(length) + value).slice(-length); 
}

//Relacionado a minha localização atual ----------------------
function onLocationFound(e) {
    // if position defined, then remove the existing position marker and accuracy circle from the map
    if (current_position) {
        map.removeLayer(current_position);
        map.removeLayer(current_accuracy);
    }

    var radius = e.accuracy / 2;

    current_position = L.marker(e.latlng, { icon: iconePessoa }).addTo(map);

    current_accuracy = L.circle(e.latlng, { color: 'green', fillColor: 'green', fillOpacity: 0.1, radius })
        .addTo(map).bindPopup("Você está num raio de<br/>" + radius + " metros deste ponto.").openPopup();
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// wrap map.locate in a function    
function locate() {
    map.locate({ setView: true, maxZoom: 16 });
}

// call locate every 3 seconds... forever
// setInterval(locate, 3000);
//-------------------------------------------------------------


//Quando tiver pronto o documento
$(document).ready(function () {
    //locate();
    //Do semantic UI
    $('select.dropdown').dropdown();
    $('.ponto').hide();
    $('#horarios').hide();
	
	//Carrega as empresas
    $('#empresa').append($('<option>').text("Selecione uma empresa"));

    $('#empresa').append($('<option>').text("Expresso Trabalhador - MA").attr('value', 1));
	$('#empresa').append($('<option>').text("COOTRAPS - CE").attr('value', 2));
	$('#empresa').append($('<option>').text("Belo Horizonte - MG").attr('value', 3));
	$('#empresa').append($('<option>').text("Feira de Santana - BA").attr('value', 4));
	$('#empresa').append($('<option>').text("Teresina - PI").attr('value', 5));
	$('#empresa').append($('<option>').text("Porto Alegre - RS").attr('value', 6));
	$('#empresa').append($('<option>').text("Divinópolis - MG").attr('value', 7));
	$('#empresa').append($('<option>').text("Governador Valadares - MG").attr('value', 8));
	$('#empresa').append($('<option>').text("Taguatur - GO").attr('value', 9));
	$('#empresa').append($('<option>').text("Araguarina - GO").attr('value', 10));
	$('#empresa').append($('<option>').text("Salvador - BA").attr('value', 11));
	$('#empresa').append($('<option>').text("Gde Floripa - SC").attr('value', 12));
	
	$('select#empresa').change(function () {
        var idEmpresaParam = $('#empresa').val();
        mudouEmpresa(idEmpresaParam);
        limparMapa();
    });

    $('select#linha').change(function () {
        var idLinha = $('#linha').val();
        var nomeLinha = $('#linha option:selected').html();
        mudouLinha(idLinha, nomeLinha);
        limparMapa();
    });
	
	$('select#viagem').change(function () {
        var idLinha = $('#linha').val();
        var idTrajeto = $("#viagem").val();
        var nomeTrajeto = $('#viagem option:selected').html();

        limparMapa();

        carregaOnibus(idTrajeto);
		carregaTracado(idTrajeto);
        carregaPontos(idTrajeto);
        carregaHorarios(idLinha);

        $('#detalhedestino').html("<b>Origem: </b>" + nomeTrajeto);
        
    });

});
