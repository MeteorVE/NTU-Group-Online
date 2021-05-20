# ntu-group-project


## Todo

- [ ] Login 後可以跳轉回 "前一個畫面"
- [ ] 每次進房間就會 call 一次 refresh token
- [x] Login 透過 ``getters.isAuth`` 控制出現
    - 用 mapGetters 讀入，不要在 template 內使用 store。
- [x] App.vue 綁的 token debug，F5 後會沒辦法得到值，不太對。
	- created 時 assign + 後續用 watch 監測來解決。
- [x] Navbar 上面，被選中的會變成黃色。但是如果直接 access Url，會無法觸發 selected 而改變被選中項
    - 原本想透過 computed 來 get router path，再套回 defaultIndex。但怎麼做都沒用。
    後來發現原本的方法又可行了，也許跟拿掉沒用到的 @select="handler" 有關。
- [ ]  在 homepage，點了 logout，他會再次 access homepage 但是卻不會讓房間消失。



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Install Other Tools
```
npm install -g json-server
```

### Recommnad Install Some plugin in VSC

(可以在 VSC 右邊 Market 下載)

Search :

- Vetur 
  - ![](https://i.imgur.com/YzADcQl.png)
- Eslint
  - ![](https://i.imgur.com/dtGQufJ.png)
- Prettier
  - ![](https://i.imgur.com/2BeSIVt.png) 
- Copy Relative Path
- Snippests Suite
  - 要搜尋 sarah.drasner

#### User Setting

根據上面做一些調整
```json
  // I want my default to be 4, but JavaScript/JSON to be 2
    "editor.tabSize": 4,
    "[javascript]": {
        "editor.tabSize": 2
    },
    "[json]": {
        "editor.tabSize": 2
    },

    // Setting eslint
    "eslint.validate": [
        "vue",
        "html",
        "javascript"
    ],
    
    // Setting for Vetur's Emmet Function
    "emmet.includeLanguages": {
      "vue-html": "html",
      "vue": "html"
    },
```

### Json Server

```
json-server --watch db.json
```