var caminhoBase = "https://zn4.m2mcontrol.com.br/api/";
var caminhoBase2 = "http://zn4.m2mcontrol.com.br/api/";
var idEmpresa = 0;
var idLinhaMigracao;

//Ação executada ao mudar a linha
function mudouEmpresa(znParam, idEmpresaParam){
	idEmpresa = idEmpresaParam;
	caminhoBase = "https://zn"+znParam+".m2mcontrol.com.br/api/"
	caminhoBase2 = "http://zn"+znParam+".m2mcontrol.com.br/api/"
	
	//Limpa os selects
	$('#linha').empty();
	
    carregaLinhas(idEmpresa);

}

//Carrega o select de linhas do cliente
function carregaLinhas(idEmpresa) {
	$.getJSON(caminhoBase + "mapa/consultarLinhasPorCliente?idCliente="+idEmpresa, function (json) {
		$('#linha').empty();
        $('#linha').append($('<option>').text("Selecione uma linha"));
        $.each(json, function (i, obj) {
			$('#linha').append($('<option>')
			.text(obj.descr + (obj.toForecast ? '' : ' - Fora do app'))
			.attr('value', obj._id));
        });
    });
}

//Carrega o select de viagens
function carregaViagens(idLinha) {
	var date = new Date($('#data').val());
	date.setDate(date.getDate() + 1);
	
	if(date != null && idLinha != null){
		$.getJSON(caminhoBase + "mapaExterno/linha/"+idEmpresa+"/linha/"+idLinha, function (json) {
			$('#detalhehorario').text("");
			$.each(json.trajetos, function (i, obj) {
				if(obj.ativo){
					carregaHorarios(obj.id_migracao, date, obj.nome);
				}
			});
			$('#detalheoperacional').text("");
			$('#detalheoperacional').append("<b>Veículos alocados:<b> ");
			$.each(json.veiculos, function (i, obj) {
				$('#detalheoperacional').append(obj.prefixo + " ");
			});
			$('#detalheoperacional').append("<br>");
		});
	}else{
		alert("Data ou viagem inválida!");
	}
}

function carregaHorarios(idViagemMigracao, date, nome){
    $.ajax({
        type: "GET",
        url: caminhoBase2 + "forecast/lines/load/departure/" + idViagemMigracao + "/" + idEmpresa + "?date=" + date,
        dataType: "JSON",
        success: function (data) {			
			var tamanho = data[0] != null && data[0].partidas != null ? data[0].partidas.length : 0;
			
			var retorno = "";
			
			if(tamanho > 0){
				retorno = '<div class="ui fluid teal card">';
				retorno += '<div class="content">';
				retorno += '<div class="center aligned header">' + nome + '</div>';
				retorno += '<div class="center aligned description">';
				for (let index = 0; index < tamanho; index++) {
					retorno += data[0].partidas[index] + " ";
				}
				retorno += '</div></div></div>';
				$('#detalhehorario').append(retorno);
			}else{
				retorno = '<div class="ui fluid olive card">';
				retorno += '<div class="content"><div class="center aligned description">';
				retorno += "<span style='color:#b5cc18'>Não há horários para a viagem " + nome + "</span>";
				retorno += '</div></div></div>';
				$('#detalhehorario').append(retorno);
			}
        },
        error: function (request, status, error) {
			retorno = '<div class="ui fluid red card">';
			retorno += '<div class="content">';
            retorno += '<div class="center aligned description">' + request.responseText+ "</div>";
			retorno += '</div></div>';
			$('#detalhehorario').append(retorno);
        }
    });
}

//Função para limpar tudo.
function limpar() {
	$('#detalhehorario').text("");
}

//
function preencheData(){
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	$('#data').val(today);
}

//Quando tiver pronto o documento
$(document).ready(function () {
    //Do semantic UI
    $('#linha').dropdown();
	preencheData();
	
	//Carrega as empresas
	$('#empresa').append($('<option>').text("Selecione uma empresa"));
	$('#empresa').append($('<option>').text("108 - Aracajú (Grupo Progresso)").attr('value', 108).attr('zn', 4));
	$('#empresa').append($('<option>').text("114 - Ratrans ITZ").attr('value', 114).attr('zn', 5));
	$('#empresa').append($('<option>').text("154 - RMF (Vitória)").attr('value', 154).attr('zn', 4));
	$('#empresa').append($('<option>').text("195 - Macapá (Marco Zero)").attr('value', 195).attr('zn', 5));
	$('#empresa').append($('<option>').text("207 - Macapá (Amazontur / Capital Morena)").attr('value', 207).attr('zn', 5));
	$('#empresa').append($('<option>').text("217 - RMF (Via Metro)").attr('value', 217).attr('zn', 5));
	$('#empresa').append($('<option>').text("218 - RMF (FretCar)").attr('value', 218).attr('zn', 5));	
	$('#empresa').append($('<option>').text("235 - Macapá (SiãoThur)").attr('value', 235).attr('zn', 5));
	$('#empresa').append($('<option>').text("281 - Fortaleza (Eturfor)").attr('value', 281).attr('zn', 4));	
	$('#empresa').append($('<option>').text("396 - MOB (TAG / TCM)").attr('value', 396).attr('zn', 4));
	$('#empresa').append($('<option>').text("1178 - RMF (São Paulo / Penha)").attr('value', 1178).attr('zn', 5));	
	$('#empresa').append($('<option>').text("1228 - SMTT (Urbanas / Grapiuna SU)").attr('value', 1228).attr('zn', 5));
	$('#empresa').append($('<option>').text("1268 - MOB (Marina / Seta / SB / Viper)").attr('value', 1268).attr('zn', 4));
	
	
	
	$('select#empresa').change(function () {
        var idEmpresaParam = $('#empresa').val();
		var znParam = $("#empresa option:selected").attr("zn");
        mudouEmpresa(znParam, idEmpresaParam);
        limpar();
    });

    $('select#linha').change(function () {
        var idLinha = $('#linha').val();
		carregaViagens(idLinha);
        limpar();
    });
	
	$('#data').on('focusout keyup', function () {
		var idLinha = $('#linha').val();
		carregaViagens(idLinha);
        limpar();
    });

});