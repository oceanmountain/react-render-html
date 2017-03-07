"use strict";

const htmlParser = require("parse5");
const React = require("react");
const convertAttr = require("react-attr-converter");
const styleParser = require("./lib/style-parser");
const uuidV4 = require("uuid/v4");

const renderNode = (node) => {
  if (node.nodeName === "#text" || node.nodeName = "#comment") {
    return node.value;
  }

  const key = uuidV4();
  const attr = node.attrs.reduce((result, attr) => {
    let name = convertAttr(attr.name);
    result[name] = name === "style" ? styleParser(attr.value) : attr.value;
    return result;
  }, {key: key});

  if (node.childNodes.length === 0) {
    return React.createElement(node.tagName, attr);
  }

  const children = node.childNodes.map(renderNode);
  return React.createElement(node.tagName, attr, children);
};

const renderHTML = (html) => {
  const htmlAST = htmlParser.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  const result = htmlAST.childNodes.map(renderNode);
  return result.length === 1 ? result[0] : result;
};

module.exports = renderHTML;
