# Mikhail Chekov

### Contacts: +79030168585, chekoff@list.ru
##### 32 years, Russia, Moscow

### About programmer way:
 I have been looking for my favourite busy for a long time and decided to stop at programming. I like it because I can invent something in my head and then implement it in code. I also like it because the result of my work can be useful to people. I want create app or something else what can somehow helps people, it motivates me to learn and improve skills in this direction.  
In addition to programming, I am interested in self-development, mainly psychology, a little Vedic culture, yoga meditation and self-knowledge. 
 
### My skills and completed projects
I have some experience in JavaScript(es6+), HTML5&CSS3, Sass/Less, React/Vue, Gulp/Webpack, Api, Ajax.
I used libs - bootstrap, material ui, jquery, jquery ui.
In the process of work I used gulp and webpack, also i used git but usually only push and commit commands.  

I have some experiece to creating game apps on react and vue js:
 - [snake game](https://mikhailchekov.github.io/snake-game-reactjs/)
 - [vue memory game](https://mikhailchekov.github.io/vue-memory-card-game/)
 
Also i created some css templates:
 - [bycicle](https://mikhailchekov.github.io/bicycle-theme-template/)
 - [lux-trader](https://mikhailchekov.github.io/lux-trader-template/index.html)

I made templates using the lessons from youtube, games i made by myself. 

My web development learning takes about 1.5 years, i usually use youtube video and read books. I also improve my English skills. Now my level is something like A2+. I read english articles, watch movie with subtitles and translate favourite songs, also i train skills with the android app - "Simpler".

### [My github](https://github.com/MikhailChekov/)  

And code example, hmm something like this: 

```
function duplicateCount(text) {
  let dupl = 0;
  let arr = [];
  text = text.split('').map(e => e.toLowerCase());
  text.forEach(e => {
    if ((text.join('').match(new RegExp(e, "g")) || []).length > 1 && !arr.includes(e)) {
      dupl++;
      arr.push(e);
    }
  })
  return dupl;
}
```