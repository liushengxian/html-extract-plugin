// const template = `<main> <img src="./img/share.jpg" alt="" class="share-img"> Hello world </main>`;
const template = `<main>
<div class="top-nav">
  <ul>
    <li>hello world!</li>
    <li>Go home</li>
    <li>Cool style!</li>
  </ul>
  <div class="logo"></div>
</div>
<p class="greet">Hello world!</p>
<section class="home" :class="active?'true':'false'">
  <div class="slogan"></div>
  <div class="register-btn"></div>
</section>
<section class="news">
  <div class="news-banner"></div>
  <div class="news-pagi"></div>
  <div class="news-content-list">
    <div class="news-item">澳门首家DC上线啦！</div>
    <div class="news-item">哔哩哔哩 (゜-゜)つロ 干杯~</div>
    <div class="news-item">弘扬公司核心价值观</div>
    <div class="news-item">为社会主义建设添砖加瓦</div>
  </div>
</section>
</main>`;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const fragment = JSDOM.fragment(template);
const rootElement = fragment.childNodes[0];
console.log(rootElement.childNodes.length);


const parseDomObject = function(root){
  if(!root){return '';};
  //是否有子节点
  if(root.childNodes.length <= 0){
    if(root.classList){
      return `.${root.classList[0]}{}`;
    }else{
      return '';
    }
  }else{
    const array = Array.from(root.childNodes);
    if(!root.classList || root.classList.length <= 0){
      return `${array.reduce((sum,val)=>{
        return sum.concat(parseDomObject(val));
      },'')}`;
    }else{
      return `.${root.classList[0]}{${array.reduce((sum, val)=>{
        return sum.concat(parseDomObject(val));
      },'')} }`;
    }
  }
};

console.log(parseDomObject(rootElement));

// console.log(fragment.querySelector('main'));

// console.log((fragment.childNodes[0].childNodes.length));

// let text = `<template>
// <main>
//   <div class="top-nav">
//     <ul>
//       <li>hello world!</li>
//       <li>Go home</li>
//       <li>Cool style!</li>
//     </ul>
//     <div class="logo"></div>
//   </div>
//   <section class="home">
//     <div class="slogan"></div>
//     <div class="register-btn"></div>
//   </section>
//   <section class="news">
//     <div class="news-banner"></div>
//     <div class="news-pagi"></div>
//     <div class="news-content-list">
//       <div class="news-item">澳门首家线上D场上线啦！</div>
//       <div class="news-item">哔哩哔哩干杯</div>
//       <div class="news-item">弘扬公司核心价值观</div>
//       <div class="news-item">勿忘国耻九一八</div>
//     </div>
//   </section>
// </main>
// </template>
// `;

// let templateContext = text.match(/<template>([\s\S]*?)<\/template>/)[0];

// console.log(templateContext.replace('<template>','').replace('</template>',''));