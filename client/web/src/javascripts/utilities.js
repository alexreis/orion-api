/*!
 * Orion - Utilities functions
 * Copyright 2014 Vox Populi
 */

!function() {
  var TC = {};

  // ..........................................................

  TC.replaceAll = function replaceAll(string, token, newtoken) {
    string = string.trim();
    while (string.indexOf(token) !== -1) {
      string = string.replace(token, newtoken);
    }
    return string;
  };

  TC.isAlphaNumeric = function isAlphaNumeric(xStr) {
    var regEx = /^[a-zA-ZÀ-ÿ0-9]+$/;
    return regEx.test(xStr);
  };

  TC.removeAccents = function removeAccents(newStringComAcento) {
    var string = newStringComAcento;
    var mapaAcentosHex = {
      a: /[\xE0-\xE6]/g,
      e: /[\xE8-\xEB]/g,
      i: /[\xEC-\xEF]/g,
      o: /[\xF2-\xF6]/g,
      u: /[\xF9-\xFC]/g,
      c: /\xE7/g,
      n: /\xF1/g
    };

    for (var letra in mapaAcentosHex) {
      var expressaoRegular = mapaAcentosHex[letra];
      string = string.replace(expressaoRegular, letra);
    }

    return string;
  };

  TC.formatSelect2 = function format(item) {
    return item.text;
  };

  TC.isCKEditorEmpty = function isCKEditorEmpty(name) {
    console.log("START FUCTION:isCKEditorEmpty");
    var comando = "CKEDITOR.instances." + name + ".getData()";

    if (eval(comando) == '') {
      return true;
    }

    return false;
  };

  TC.configCKEditor = function configCKEditor(name) {

    CKEDITOR.replace(name, {
      /*
       * Ensure that htmlwriter plugin, which is required for this sample, is loaded.
       */
      extraPlugins: 'htmlwriter',
      /*
       * 
       * 
       * Style sheet for the contents
       */

      toolbar: [
        ['Undo', 'Redo', 'Paste', 'Copy'],
        ['SpellCheck', 'mkField'],
        ['FontSize', 'Font'],
        ['Find', 'Replace', 'SelectAll'],
        ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList', 'Outdent', 'Indent'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Source']
      ],
      contentsCss: 'body {color:#000; background-color#FFF; font-family: Arial; font-size:80%;} p, ol, ul {margin-top: 0px; margin-bottom: 0px;}',
      /*
       * Quirks doctype
       */
      docType: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
      /*
       * Core styles.
       */
      coreStyles_bold: {element: 'b'},
      coreStyles_italic: {element: 'i'},
      coreStyles_underline: {element: 'u'},
      /*
       * Font face.
       */

      // Define the way font elements will be applied to the document. The "font"
      // element will be used.
      font_style: {
        element: 'font',
        attributes: {'face': '#(family)'}
      },
      /*
       * Font sizes.
       */

      // The CSS part of the font sizes isn't used by Flash, it is there to get the
      // font rendered correctly in CKEditor.
      fontSize_sizes: '8/8;9/9;10/10;11/11;12/12;14/14;16/16;18/18;20/20;22/22;24/24;26/26;28/28;36/36;48/48;72/72',
      fontSize_style: {
        element: 'font',
        attributes: {'size': '#(size)'},
        styles: {'font-size': '#(size)px'}
      },
      /*
       * Font colors.
       */
      colorButton_enableMore: true,
      colorButton_foreStyle: {
        element: 'font',
        attributes: {'color': '#(color)'}
      },
      colorButton_backStyle: {
        element: 'font',
        styles: {'background-color': '#(color)'}
      },
      on: {'instanceReady': configureFlashOutput}
    });

    /*
     * Adjust the behavior of the dataProcessor to match the
     * requirements of Flash
     */
    function configureFlashOutput(ev) {
      var editor = ev.editor,
              dataProcessor = editor.dataProcessor,
              htmlFilter = dataProcessor && dataProcessor.htmlFilter;

      // Out self closing tags the HTML4 way, like <br>.
      dataProcessor.writer.selfClosingEnd = '>';

      // Make output formatting match Flash expectations
      var dtd = CKEDITOR.dtd;
      for (var e in CKEDITOR.tools.extend({}, dtd.$nonBodyContent, dtd.$block, dtd.$listItem, dtd.$tableContent)) {
        dataProcessor.writer.setRules(e, {
          indent: false,
          breakBeforeOpen: false,
          breakAfterOpen: false,
          breakBeforeClose: false,
          breakAfterClose: false
        });
      }
      dataProcessor.writer.setRules('br', {
        indent: false,
        breakBeforeOpen: false,
        breakAfterOpen: false,
        breakBeforeClose: false,
        breakAfterClose: false
      });

      // Output properties as attributes, not styles.
      htmlFilter.addRules({
        elements: {
          $: function(element) {
            var style, match, width, height, align;

            // Output dimensions of images as width and height
            if (element.name == 'img') {
              style = element.attributes.style;

              if (style) {
                // Get the width from the style.
                match = (/(?:^|\s)width\s*:\s*(\d+)px/i).exec(style);
                width = match && match[1];

                // Get the height from the style.
                match = (/(?:^|\s)height\s*:\s*(\d+)px/i).exec(style);
                height = match && match[1];

                if (width) {
                  element.attributes.style = element.attributes.style.replace(/(?:^|\s)width\s*:\s*(\d+)px;?/i, '');
                  element.attributes.width = width;
                }

                if (height) {
                  element.attributes.style = element.attributes.style.replace(/(?:^|\s)height\s*:\s*(\d+)px;?/i, '');
                  element.attributes.height = height;
                }
              }
            }

            // Output alignment of paragraphs using align
            if (element.name == 'p') {
              style = element.attributes.style;

              if (style) {
                // Get the align from the style.
                match = (/(?:^|\s)text-align\s*:\s*(\w*);?/i).exec(style);
                align = match && match[1];

                if (align) {
                  element.attributes.style = element.attributes.style.replace(/(?:^|\s)text-align\s*:\s*(\w*);?/i, '');
                  element.attributes.align = align;
                }
              }
            }

            if (element.attributes.style === '')
              delete element.attributes.style;

            return element;
          }
        }
      });
    }
  };


  TC.configCKEditorSimplificado = function configCKEditorSimplificado(name) {

    CKEDITOR.inline(name, {
      /*
       * Ensure that htmlwriter plugin, which is required for this sample, is loaded.
       */
      extraPlugins: 'htmlwriter',
      /*
       * 
       * 
       * Style sheet for the contents
       */

      toolbar: [
        ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat'],
        ['TextColor']
      ],
      contentsCss: 'body {color:#000; background-color#FFF; font-family: Arial; font-size:100%;} p, ol, ul {margin-top: 0px; margin-bottom: 0px;}',
      /*
       * Quirks doctype
       */
      docType: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
      /*
       * Core styles.
       */
      coreStyles_bold: {element: 'b'},
      coreStyles_italic: {element: 'i'},
      coreStyles_underline: {element: 'u'},
      /*
       * Font face.
       */

      // Define the way font elements will be applied to the document. The "font"
      // element will be used.
      font_style: {
        element: 'font',
        attributes: {'face': '#(family)'}
      },
      /*
       * Font sizes.
       */

      // The CSS part of the font sizes isn't used by Flash, it is there to get the
      // font rendered correctly in CKEditor.
      fontSize_sizes: '8/8;9/9;10/10;11/11;12/12;14/14;16/16;18/18;20/20;22/22;24/24;26/26;28/28;36/36;48/48;72/72',
      fontSize_style: {
        element: 'font',
        attributes: {'size': '#(size)'},
        styles: {'font-size': '#(size)px'}
      },
      /*
       * Font colors.
       */
      colorButton_enableMore: true,
      colorButton_foreStyle: {
        element: 'font',
        attributes: {'color': '#(color)'}
      },
      colorButton_backStyle: {
        element: 'font',
        styles: {'background-color': '#(color)'}
      },
      on: {'instanceReady': configureFlashOutput}
    });

    /*
     * Adjust the behavior of the dataProcessor to match the
     * requirements of Flash
     */
    function configureFlashOutput(ev) {
      var editor = ev.editor,
              dataProcessor = editor.dataProcessor,
              htmlFilter = dataProcessor && dataProcessor.htmlFilter;

      // Out self closing tags the HTML4 way, like <br>.
      dataProcessor.writer.selfClosingEnd = '>';

      // Make output formatting match Flash expectations
      var dtd = CKEDITOR.dtd;
      for (var e in CKEDITOR.tools.extend({}, dtd.$nonBodyContent, dtd.$block, dtd.$listItem, dtd.$tableContent)) {
        dataProcessor.writer.setRules(e, {
          indent: false,
          breakBeforeOpen: false,
          breakAfterOpen: false,
          breakBeforeClose: false,
          breakAfterClose: false
        });
      }
      dataProcessor.writer.setRules('br', {
        indent: false,
        breakBeforeOpen: false,
        breakAfterOpen: false,
        breakBeforeClose: false,
        breakAfterClose: false
      });

      // Output properties as attributes, not styles.
      htmlFilter.addRules({
        elements: {
          $: function(element) {
            var style, match, width, height, align;

            // Output dimensions of images as width and height
            if (element.name == 'img') {
              style = element.attributes.style;

              if (style) {
                // Get the width from the style.
                match = (/(?:^|\s)width\s*:\s*(\d+)px/i).exec(style);
                width = match && match[1];

                // Get the height from the style.
                match = (/(?:^|\s)height\s*:\s*(\d+)px/i).exec(style);
                height = match && match[1];

                if (width) {
                  element.attributes.style = element.attributes.style.replace(/(?:^|\s)width\s*:\s*(\d+)px;?/i, '');
                  element.attributes.width = width;
                }

                if (height) {
                  element.attributes.style = element.attributes.style.replace(/(?:^|\s)height\s*:\s*(\d+)px;?/i, '');
                  element.attributes.height = height;
                }
              }
            }

            // Output alignment of paragraphs using align
            if (element.name == 'p') {
              style = element.attributes.style;

              if (style) {
                // Get the align from the style.
                match = (/(?:^|\s)text-align\s*:\s*(\w*);?/i).exec(style);
                align = match && match[1];

                if (align) {
                  element.attributes.style = element.attributes.style.replace(/(?:^|\s)text-align\s*:\s*(\w*);?/i, '');
                  element.attributes.align = align;
                }
              }
            }

            if (element.attributes.style === '')
              delete element.attributes.style;

            return element;
          }
        }
      });
    }
  };

  // ..........................................................

  if (typeof define === 'function' && define.amd) {
    define(TC);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = TC;
  } else {
    this.TC = TC;
  }
}();
