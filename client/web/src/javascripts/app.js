/*!
 * Orion
 * Copyright 2014 Vox Populi
 */

!function() {
  var Orion = {};
  // ..........................................................

  // Variáveis vindas do PHP
  Orion.php = {
    publicVarExample: 'yey'
  };
  // Todo o JavaScript da aplicação
  var privateVarExample = 'Não dá pra ver do console'; // TODO-->> deletar essa linha

  // Private vars

  // File: genericFormWizard.tpl
  Orion.startGenericFormWizard = function startGenericFormWizard() {
    console.log("Start: Orion.startGenericFormWizard");
    var urlConfimar = Orion.php.urlConfimar;
    FormEmpresa.init();
    // validacao.init();
    ComponentsPickers.init();
    var form = $('#submit_form');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    $('.form').on('click', '.button-submit', function(event) {
      $.ajax({
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(data) {
          App.blockUI({
            message: 'processando',
            target: '.portlet-body'
          });
        },
        success: function(data) {
          console.log(data);
          error.hide();
          if (!data.error) {
            success.show();
            $('#form_wizard_1').find('.button-submit').hide();
            var pathname = window.location.pathname;
            $('#form_wizard_1').find('.button-previous').attr('href', pathname);
            setTimeout(function() {
              console.log(urlConfimar);
              $(window.document.location).attr('href', urlConfimar);
            }, 500);
          } else {
            error.text(data.msg);
            error.show();
            App.unblockUI('.portlet-body');
          }
        },
        error: function(data) {
          App.unblockUI('.portlet-body');
          console.log(data);
          success.hide();
          error.show();
        },
        complete: function(data) {
          //App.unblockUI('#form_wizard_1');
        }
      });
    });
  }
// End file: genericFormWizard.tpl


// Start file: startPortletArrastavel.tpl
  Orion.startPortletArrastavel = function startPortletArrastavel() {
    console.log("Start: Orion.startPortletArrastavel");
    var source = $("#selectBlocos").html(),
            template = Handlebars.compile(source);

    $(document).on('click', '#btn-visualizar', function(event) {
      var idQuestionario = $("[type=hidden][name=quest]").attr("value");
      window.location.href = "/survey/questionarioView.php?id=" + idQuestionario;
    });

    $(document).on('click', '.btn-salto-simples', function(event) {
      var idQuestao = $(this).data("idquestao");
      var codigo = $(this).data("codigo");
      var idQuestionario = $("[type=hidden][name=quest]").attr("value");
      var dados = {name: "saltoSimples", idquestionario: idQuestionario};
      console.log(idQuestao);
      console.log(codigo);
      $.ajax({
        url: null,
        type: 'POST',
        dataType: 'json',
        data: dados
      }).then(function(data) {

        data.idQuestao = idQuestao;
        data.codigo = codigo;
        data.classe = "select" + data.idQuestao + data.codigo;
        var html = template(data);
        $('#form' + idQuestao + codigo).append(html);

        $('#select' + idQuestao + codigo).select2({
          formatResult: TC.formatSelect2,
          formatSelection: TC.formatSelect2,
          allowClear: true
        });

        console.log(data);
      }, function(data) {
        console.log("ERRO no startPortletArrastavel");
        console.log(data);
      });
      $(this).remove(); // remove botão
      event.preventDefault();
    });
    //$('#teste').append(html);

    PortletDraggable.init();
    //Editar nome de quadros e blocos
    $(document).ready(function() {
//toggle `popup` / `inline` mode
      $.fn.editable.defaults.mode = 'inline';
      //make username editable
      $('.bloco').editable(
              {
                url: 'questaoTable.php',
                emptytext: 'Nome indefinido',
                type: 'text',
                send: 'always',
                dataType: 'json',
                success: function(data) {

                  if (!data.error) {
                    console.log("Sucesso");
                    console.log(data);
                  } else {
                    console.log("Erro");
                  }
                },
                error: function(data) {
                  console.log("Erro Ajax");
                  console.log(data);
                }
              });
      $('.quadro').editable(
              {
                url: 'questaoTable.php',
                emptytext: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                type: 'text',
                send: 'always',
                dataType: 'json',
                success: function(data) {

                  if (!data.error) {
                    console.log("Sucesso");
                    console.log(data);
                  } else {
                    console.log("Erro");
                  }
                },
                error: function(data) {
                  console.log("Erro Ajax");
                  console.log(data);
                }
              });
    });
    $(document).on('change ', '.select2me', function(event) {
      var tipo = $(this).find(":selected").data("tipo");
      var idDestino = $(this).find(":selected").data("destino");
      var idQuestao = $(this).data("idquestao");
      var codigo = $(this).data("codigo");
      var idSalto = $(this).data("idsalto");
      var select = $(this);
      var action;
      var dados;
      var isSelecionado = $(this).find(":selected").val();
      if (isSelecionado) {

        if (idSalto) {
          action = "alterar";
        } else {
          action = "inserir";
        }

        dados = {name: "saltoSimples", tipo: tipo, idDestino: idDestino, idQuestao: idQuestao, codigo: codigo, action: action, idsalto: idSalto};
      } else {
        action = "remover";
        dados = {name: "saltoSimples", action: action, idsalto: idSalto};
      }


      $.ajax({
        url: null,
        type: 'POST',
        dataType: 'json',
        data: dados,
        success: function(data) {

          console.log(data);
          if (data.idsalto) {
            idsalto = data.idsalto;
            $(select).data("idsalto", data.idsalto);
          } else {
            $(select).data("idsalto", "");
          }
        },
        error: function(data) {
          console.log("ERRO no startPortletArrastavel");
          console.log(data);
        }
      });
    });
//Adcionar itens aos grupos
    $('.portlet-title').on('click', '.btn-add-item', function(event) {
      var grupo = $(this).closest('.externo');
      var tamItem = grupo.find('.form-horizontal').find('.row').size();
      if (tamItem === 0) {// não tem nenhum item ainda
        var gItem = $('.grupo-item-base');
        var newgItem = gItem.clone();
        newgItem.removeClass('grupo-item-base');
        newgItem.find('.row').removeClass('row-item-base');
        grupo.find('.sortable_portletsQuestion').after(newgItem.show());
      } else {
        var item = $('.row-item-base');
        var newItem = item.clone();
        newItem.removeClass('row-item-base');
        grupo.find('.row').last().after(newItem.show());
        //grupo.find('.item-label').last().replaceWith("<label class='control-label col-md-3'> Item " + 5 + ":</label>");
      }


      event.preventDefault();
    });
    $(document).on('change', 'input[type=text]', function() {
      var texto = $(this).val();
      var pk = $(this).data("pk");
      var name = $(this).data("name");
      var action = $(this).data("action");
      var pathname = window.location.href;
      var link = $(this).closest('.row').find('a');
      var form = $(this);
      var grupoId = $(this).closest('.externo').attr('id');
      var allInputs = $(this).closest('.row').find('input[type=text]');
      var dados = {name: name, pk: pk, texto: texto, action: action, grupoId: grupoId};
      $.ajax({
        url: pathname,
        type: 'POST',
        dataType: 'json',
        data: dados,
        success: function(data) {

          if (!data.error) {
            console.log("Sucesso");
            console.log(data);
            $(allInputs).each(function() {
              $(this).attr("data-pk", data.pk);
            });
            if (data.pk) {
              link.replaceWith("<a href='#' class='btn red btn-sm btn-rm-item' data-name='item0' data-pk='" + data.pk + "' data-action='2'><i class='fa fa-plus'></i> remover</a> ");
            }
          } else {
            console.log("Erro");
          }
        },
        error: function(data) {
          console.log("Erro Ajax");
          console.log(data);
        }
      });
    });
    $(document).on('click', '.btn-rm-item', function(event) {

      var pk = $(this).data("pk");
      var name = $(this).data("name");
      var pathname = window.location.href;
      var action = $(this).data("action");
      var row = $(this).closest('.row');
      var item = $(this).closest('.sortable_portletsItens');
      var totalRows = item.find('.row').size();
      var dados = {name: name, pk: pk, action: action};
      $.ajax({
        url: pathname,
        type: 'POST',
        dataType: 'json',
        data: dados,
        success: function(data) {

          if (!data.error) {
            console.log("Sucesso");
            console.log(data);
            if (totalRows > 1) {// existe mais de um item
              row.remove();
            } else {// é o ultimo item 
              item.remove();
            }

          } else {
            console.log("Erro");
            if (totalRows > 1) {// existe mais de um item
              row.remove();
            } else {// é o ultimo item 
              item.remove();
            }
          }
        },
        error: function(data) {
          console.log("Erro Ajax");
          console.log(data);
        }
      });
      event.preventDefault();
    });
    //SALTO
    $('.portlet-title').on('click', '.btn-add-salto', function(event) {

      var quadro = $(this).closest("[id]");
      var idquadro = quadro.attr('id');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      window.location.href = "/survey/saltoForm.php?idgrupo=" + idquadro + "&idquestionario=" + idQuest;
      event.preventDefault();
    });
    $('.row').on('click', '.btn.btn-sm.btn-salto-quadro', function(event) {
      var bloco = $(this).closest("[id]");
      var idbloco = bloco.attr('id');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      window.location.href = "/survey/saltoForm.php?idbloco=" + idbloco + "&idquestionario=" + idQuest;
      event.preventDefault();
    });
    $('.row').on('click', '.btn-editar-salto', function(event) {
      var questao = $(this).closest("[id]");
      var acao = $(this).data('action');
      var id = questao.attr('id');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      window.location.href = "/survey/saltoForm.php?idquestao=" + id + "&acao=" + acao + "&idquestionario=" + idQuest;
      event.preventDefault();
    });
    //QUADROS e BLOCOS
    $('.row').on('click', '.btn.btn-sm.btn-quadro', function(event) {
      var bloco = $(this).closest("[id]");
      var idbloco = bloco.attr('id');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      window.location.href = "/survey/questaoForm.php?bloco=" + idbloco + "&quest=" + idQuest;
      event.preventDefault();
    });
    $('.row').on('click', '.btn.btn-sm.btn-questao', function(event) {

      var quadro = $(this).closest("[id]");
      var idquadro = quadro.attr('id');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      window.location.href = "/survey/questaoForm.php?grupo=" + idquadro + "&quest=" + idQuest;
      event.preventDefault();
    });
    $("#btnqst").click(function(event) {
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      $(window.document.location).attr('href', "/survey/questaoForm.php?quest=" + idQuest);
      event.preventDefault();
    });
    $('.row').on('click', '.btn-editar', function(event) {
      var questao = $(this).closest("[id]");
      var acao = $(this).data('action');
      var id = questao.attr('id');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      window.location.href = "/survey/questaoForm.php?id=" + id + "&acao=" + acao + "&quest=" + idQuest;
      event.preventDefault();
    });
    $('.row').on('click', '.btn.red.btn-sm.quadro', function() {
      var grupo = $(this).closest(".grupo");
      $(grupo).remove();
    });
    //MODAL
    $("a[href$='#static']").click(function() {
      var myId = ($(this).closest('.portlet')).attr('id');
      var name = ($(this).closest('.portlet')).data('name');
      var idQuest = $("[name$='quest'],input[type=hidden]").attr("value");
      var pathname = window.location.href;
      var acao = ($(this).closest('.portlet')).data('action');
      $(".modal-body p").html("Tem certeza que deseja deletar <b>" + name + "</b> ?");
      $(".modal-footer .btn.red").click(function() {
        var dados = {id: myId, acao: acao, idquest: idQuest};
        $.ajax({
          url: pathname,
          type: 'POST',
          dataType: 'json',
          data: dados,
          success: function(data) {

            if (!data.error) {
              console.log("Sucesso");
              console.log(data);
              setTimeout(function() {
                $(window.document.location.reload());
              }, 500);
            } else {
              console.log("Erro");
            }
          },
          error: function(data) {
            console.log("Erro Ajax");
            console.log(data);
          }
        });
      });
    });
  };
  // End file: startPortletArrastavel.tpl

  // Start file: startBasicForm.tpl
  Orion.startBasicForm = function startBasicForm() {
    console.log("Start: Orion.startBasicForm");

    var source = $("#expansivel").html(),
            template = Handlebars.compile(source);
    $(document).bind('ready DOMSubtreeModified', function() {

      if ($('.btn.red.btn-sm').last().html() === undefined) {
        $('.mdtexto').show();
      } else {
        $('.mdtexto').hide();
      }
    });

    $(".select2me").bind('change', function() {
      selecionaModoResposta();
    }
    );

    $(document).ready(function() {

      $('.ckeditor:not(.editaveisInline)').each(function() {
        var name = $(this).attr('name');
        console.log("outline " + name);
        TC.configCKEditor(name);

      });

      $('.editaveisInline').each(function() {
        var name = $(this).attr('name');
        console.log("inline " + name);
        TC.configCKEditorSimplificado(name);
      });


    });

    $(window).load(function() {
      selecionaModoResposta();
    });


    var atualizaID = function atualizaID() {
      var numero = 0;
      $('.make-switch').each(function(index) {
        numero++;
        var name = nomeCampoExapansivel + "Aberta-" + numero;
        console.log($(this).attr('name', name));
      });

    };

    var atualizaNomesCk = function atualizaNomesCk() {
      var INLINE = 3;
      var numero = 0;

      for (var instanceName in CKEDITOR.instances) {// remove todos ckeditor inline
        var instance = CKEDITOR.instances[instanceName];
        if (instance.elementMode === INLINE) {
          instance.destroy();
        }
      }

      $('.editaveisInline').each(function(index) {//recria os ckeditors inline
        var name = $(this).attr('name');
        numero++;
        var name = nomeCampoExapansivel + "Texto_" + numero;
        $(this).attr('name', name);
        $(this).attr('id', name)
        console.log(name);
        TC.configCKEditorSimplificado(name);
      });

    };

    var selecionaModoResposta = function selecionaModoResposta() {
      var selecionado;
      selecionado = $("[name='tipo'] option:selected");
      selecionado.attr('value');
      var valor = selecionado.attr('value');
      switch (parseInt(valor)) {
        case TIPO_TITULO:
        case TIPO_NUMERICA:
        case TIPO_VIDEOAUDIO:
          $('.respostas').hide();
          $("[name='idEscala']").closest('.form-group').hide();
          break;
        case TIPO_FECHADA_ESCALAR:
          $('.respostas').hide();
          $("[name='idEscala']").closest('.form-group').show();
          break;
        default:
          $('.respostas').show();
          $("[name='idEscala']").closest('.form-group').hide();
          break;
      }
    };

    $('.mdtexto').one('click', function() {
      $(".modal-body").html("<textarea class='form-control md-area' rows='7' name='md-texto' \n\
                                                                        placeholder='Entre com as respostas no formato código - texto da Resposta (1 por linha)'></textarea>");
      $(".modal-title").html("Modo Texto");
      $(".modal-footer .btn").click(function() {
        var dados = $('.md-area').attr('value').split('\n');
        var symbol;
        var valores = new Array();
        for (var i = 0; i < dados.length; i++) {
          var symbol = "";
          var first = TC.replaceAll(dados[i], " ", "");
          for (var j = 0; j < first.length; j++) {
            if (isNaN(parseInt(first[j]))) {
              while (!TC.isAlphaNumeric(first[j])) {
                symbol = symbol + first[j];
                j++;
              }
              break;
            }
          }
          // tira linhas vazias
          if (dados[i].length > 0) {
            valores.push(dados[i].split(symbol));
          }
        }

        for (var i = 0; i < valores.length; i++) {

          // na primeira resposta
          if (i === 0) {
            $('.first-codigo').val(valores[i][0].trim());
            $('.first-resposta').append(valores[i][1].trim());
          } else {

            var codeValue = valores[i][0].trim();
            var textValue = valores[i][1].trim();

            var numero = $('.make-switch').size();
            numero++;
            var name = nomeCampoExapansivel + "Aberta-" + numero;
            var data = {nome: nomeCampoExapansivel, checkNome: nomeCampoExapansivel + "Aberta-" + numero, codigo: codeValue, texto: textValue};
            var html = template(data);
            
            //necessario para inserir apos o ultimo botaum vermelho
            if ($('.btn.red.btn-sm').last().html() === undefined) {
              var grupo = $(".respostas");
              grupo.after(html);
              // grupo.after("<div class=\"form-group\">" + html + "</div>");
            } else {
              var btn = $('.btn.red.btn-sm').last();
              grupo = $(btn).closest(".form-group");
              grupo.after(html);
              //  grupo.after("<div class=\"form-group\">" + html + "</div>");
            }
          }
          $('[name=' + name + ']').bootstrapSwitch();
        }
        atualizaNomesCk();
      });
    });

    $(".btn-adcionar").click(function(event) {
      var grupo = $('.codigo');
      var maxCodigo = 1;
      grupo.each(function() {
        if ($(this).attr('value') > maxCodigo)
          maxCodigo = parseInt($(this).attr('value'));
      });
      maxCodigo++;

      var numero = $('.make-switch').size();
      numero++;
      var name = nomeCampoExapansivel + "Aberta-" + numero;
      var nameCK = nomeCampoExapansivel + "Texto_" + numero;
      var data = {nome: nomeCampoExapansivel, checkNome: name, ckNome: nameCK, codigo: maxCodigo, texto: ""};
      var html = template(data);


      //necessario para inserir apos o ultimo botaum vermelho
      if ($('.btn.red.btn-sm').last().html() === undefined) {
        var grupo = $(this).closest(".form-group");
        grupo.after(html);
      } else {
        var btn = $('.btn.red.btn-sm').last();
        grupo = $(btn).closest(".form-group");
        grupo.after(html);
      }
      $('[name=' + name + ']').bootstrapSwitch();
      TC.configCKEditorSimplificado(nameCK);
      event.preventDefault();

    });
    $('.form').on('click', '.btn-remover', function(event) {

      var url = window.location.pathname;
      var grupo = $(this).closest(".form-group");
      var idResposta = $(this).data('id');
      var acao = $(this).data('action');
      if (idResposta) {
        var dados = {idResposta: idResposta, acao: acao};
        $.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          data: dados}).then(function(data) {

          if (!data.error) {
            console.log(data);
            $(grupo).remove();
            $(".alert.alert-success").show(400);
            setTimeout(function() {
              $(window.document.location).attr('href', data.href);
            }, 500);

          } else {
            console.log(data);
            $(".alert.alert-danger").text(data.msg);
            $(".alert.alert-danger").show(400);
          }
          atualizaID();
          atualizaNomesCk();
          console.log(data);
        }, function(data) {
          $(".alert.alert-danger").text(data.msg);
          console.log(data);
        });

      } else {
        $(grupo).remove();
        atualizaID();
        atualizaNomesCk();
      }

      event.preventDefault();
    });
    $(".salvar").click(function(event) {


      var dados = {};
      $('.editaveisInline, .ckeditor').each(function(index) {
        var name = $(this).attr('name');
        //TC.configCKEditorSimplificado(name);
        var comando = "CKEDITOR.instances." + name + ".getData()";
        texto = eval(comando);
        dados[name] = texto;
      });

      var parametros = $.param(dados);
      // faz com que o ck editor de  seja obrigatorio
      var name = $('.ckeditor:not(.editaveisInline)').attr('name');

      var url = null;
      //alert('Salvar ajax');
      var form = $('#submit_form');
      if (form.valid() == false || TC.isCKEditorEmpty(name)) {
        $(".alert.alert-danger").show(400);
        return false;
      }

      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: form.serialize() + "&" + parametros,
        beforeSend: function(data) {
          App.blockUI({
            message: 'processando',
            target: '.form-body'
          });
        },
        success: function(data) {
          console.log(data);
          if (!data.error) {
            $(".alert.alert-success").show(400);
            setTimeout(function() {
              $(window.document.location).attr('href', data.href);
            }, 500);
          } else {
            $(".alert.alert-danger").text(data.msg.mensagem);
            $(".alert.alert-danger").show(400);
          }
        },
        error: function(data) {
          $(".alert.alert-danger").text(data.msg);
          console.log(data);
        },
        complete: function(data) {
          App.unblockUI('.form-body');
        }
      });
    });


    $('.btn-cancelar').click(function() {
      var url = null;
      var dados = {cancelar: 'true'};
      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados,
        success: function(data) {
          $(window.document.location).attr('href', data.href);
        },
        error: function(data) {

          $(".alert.alert-danger").text(data.msg);
          console.log(data);
        }

      });
    });
  }
// End file: startBasicForm.tpl


  window.start = function start() {

  };
  // ..........................................................

  if (typeof define === 'function' && define.amd) {
    define(Orion);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = Orion;
  } else {
    this.Orion = Orion;
  }
}();


				