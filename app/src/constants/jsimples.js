/**
 * Constantes relacionadas à linguagem JSimples
 */

export const JSIMPLES_KEYWORDS = [
  'programa',
  'inicio',
  'fimprograma',
  '<-',
  'se',
  'entao',
  'senao',
  'fimse',
  'enquanto',
  'faca',
  'fimenquanto',
  'nao',
  'div',
  'escreva',
  'leia',
  'proc',
  'fimproc',
  'func',
  'fimfunc',
  'ref',
];

export const JSIMPLES_TYPES = [
  'inteiro',
  'logico',
];

export const JSIMPLES_DEFAULT_CODE =
  'programa teste\n' +
  '\tinteiro a b\n' +
  'inicio\n' +
  '\tleia a\n' +
  '\tleia b\n' +
  '\tenquanto a < b faca\n' +
  '\t\tescreva a\n' +
  '\t\ta <- a + 1\n' +
  '\tfimenquanto\n' +
  'fimprograma';
