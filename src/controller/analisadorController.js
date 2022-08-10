
var fs = require('fs')

var operadores = require('../node/operadores')
var palavrasReservadas = require('../node/palavrasReservadas')
var delimitadores = require('../node/delimitadores')

//var codigo = fs.readFileSync('data/imputCode.js', 'utf8')




module.exports = {

     async le_Token(request, response) {

          const { codigo } = request.body;

          var saida = ''


          var tipo = "nada";         // Identifica o tipo de char do token atual
          var atual_token = "";     // Guarda o conjunto de caracteres do token atual
          var verificaBloco = "";      // String auxiliar para encontrar o fim de um bloco de comentário
          var comentarioLinha = false;    // Identificador de comentário de linha
          var comentarioBloco = false;   // Identificador de comentário em bloco
          var abre_aspas = false;    // Identificador de abertura de aspas
          var tipo_abre_aspas = ""   // Identifica qual tipo de aspa abriu o literal
          var barraInvertida = true;       // Auxiliar pra identificar o uso de uma barra invertifa em uma string

          for (char of codigo) {
               if (abre_aspas) {
                    atual_token += char;

                    if (!barraInvertida && char == tipo_abre_aspas) {
                         abre_aspas = !abre_aspas;
                         tipo = "literal";
                         atual_token = checkToken(atual_token);
                    }

                    if (!barraInvertida && char == '\\')
                         barraInvertida = true;
                    else
                         barraInvertida = false;

                    tipo = "delimitador";

               } else if (comentarioBloco) {
                    if (char == "*") {
                         verificaBloco = "*";
                    } else {
                         verificaBloco += char;
                    }

                    atual_token += char;
                    if (verificaBloco == '*/') {
                         comentarioBloco = false;
                         tipo = "comentario";
                         atual_token = checkToken(atual_token);
                    }

               } else if (comentarioLinha) {
                    if (char == "\n" || char == "\r") {
                         comentarioLinha = false;
                         tipo = "comentario";
                         atual_token = checkToken(atual_token);
                    } else {
                         atual_token += char;
                    }

               } else if (char == "\n" || char == "\r") {

               } else {
                    if (!e_espaco(char)) {

                         if (!e_operador(char)) {

                              if (!e_delimitador(char)) {

                                   if (!e_numero(char)) {
                                        if (char == "." && e_numero(atual_token)) {
                                             atual_token += char;
                                             tipo = "constante";
                                        } else {
                                             if (tipo != "letra")
                                                  atual_token = checkToken(atual_token);

                                             atual_token += char;
                                             tipo = "letra";
                                        }

                                   } else if (e_numero(atual_token[0]) && e_numero(char)) {
                                        atual_token += char;
                                        tipo = "constante";

                                   } else {
                                        atual_token = checkToken(atual_token);
                                        atual_token += char;
                                        tipo = "constante";

                                   }

                              } else {
                                   if (char == '"' || char == '\'') {
                                        tipo_abre_aspas = char;
                                        atual_token = char;
                                        abre_aspas = !abre_aspas;
                                   } else {
                                        atual_token = checkToken(atual_token);
                                        atual_token += char;
                                        tipo = "delimitador";
                                        atual_token = checkToken(atual_token);
                                   }

                              }

                         } else if (operadores.includes(atual_token[0])) {
                              atual_token += char;
                              tipo = "operador";
                              if (e_comentarioLinha())
                                   comentarioLinha = true;
                              if (e_comentarioBloco())
                                   comentarioBloco = true;

                         } else {
                              atual_token = checkToken(atual_token);
                              atual_token += char;
                              tipo = "operador";

                         }

                    } else {
                         atual_token = checkToken(atual_token);
                         tipo = "nada";
                    }

               }

          }

          if (atual_token != '')
               checkToken(atual_token);





          // Funções
          function checkToken(atual_token) {
               if (atual_token != '') {
                    switch (tipo) {
                         case "nada":
                              break;

                         case "comentario":
                              inserir(atual_token, 'Comentário');
                              break;

                         case "letra":
                              if (palavrasReservadas.includes(atual_token)) {
                                   inserir(atual_token, 'Palavra Reservada');
                              } else if (atual_token != "\n") {
                                   inserir(atual_token, 'Identificador');
                              }
                              break;

                         case "operador":
                              if (atual_token == '=')
                                   inserir(atual_token, 'Atribuição');
                              else
                                   inserir(atual_token, 'Operador');
                              break;

                         case "constante":
                              inserir(atual_token, 'Constante Numérica');
                              break;

                         case "literal":
                              inserir(atual_token, 'Constante Literal');
                              break;

                         case "delimitador":
                              if (atual_token == ',')
                                   inserir(atual_token, 'Separador');
                              else if (atual_token == ';')
                                   inserir(atual_token, 'Terminador');
                              else if (atual_token == '(' || atual_token == '{' || atual_token == '[')
                                   inserir(atual_token, 'Delimitador - Abertura');
                              else if (atual_token == ')' || atual_token == '}' || atual_token == ']')
                                   inserir(atual_token, 'Delimitador - Fechamento');
                              else
                                   inserir(atual_token, 'Delimitador');
                              break;

                    }
               }

               return '';
          }

          function inserir(id, token_type) {
               var token = "";
               switch (token_type) {
                    case 'Identificador':
                    case 'Constante Numérica':
                    case 'Constante Literal':
                         token = `${id} >`;
                         break;

                    case 'Comentário':
                         token = `${id} >`;
                         id = 'Comentário';
                         break;

                    default:
                         token = `${id} >`;
                         break;
               }

               saida += `${token} ${token_type}\n`;

          }

          function e_espaco(char) {
               return char === ' ';
          }

          function e_comentarioLinha() {
               return atual_token === '//';
          }

          function e_comentarioBloco() {
               return atual_token === '/*';
          }

          function e_operador(char) {
               return operadores.includes(char);
          }

          function e_delimitador(char) {
               return delimitadores.includes(char)
          }

          function e_numero(char) {
               var n = parseInt(char);
               return Number.isInteger(n);
          }



          return response.json(saida);


     },





}