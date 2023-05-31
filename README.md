# ntu-group-project


## Demo

影片 Demo。(有做補禎轉換，所以可能有些地方會模糊掉)
直接點擊圖片就會跳轉了
或是造訪 http://www.youtube.com/watch?v=_uxVV6u9fK4

[![](https://i.imgur.com/HxtL4M1.jpg)
](http://www.youtube.com/watch?v=_uxVV6u9fK4 "DEMO")

## Screenshot

![](https://i.imgur.com/wBXpIqo.png)

![](https://i.imgur.com/ijerZBu.jpg)

![](https://i.imgur.com/UGjXiYX.png)

![](https://i.imgur.com/IqX70zz.png)

![](https://i.imgur.com/6R1IXnQ.png)

![](https://i.imgur.com/iqzoJ9d.png)


## Some Detail

![](https://i.imgur.com/R1Rhtaz.png)

![](https://i.imgur.com/HGOH77K.png)

- Depoly 結果 :　~~https://ntu-online-group.herokuapp.com/~~ 
  - 因為 Heroku 的機制，直接點進去可能無法看到畫面。
  - 另外，此平台需要有 NTU 的 Mail 才能進行註冊，首頁也必須要登入才能看到。
  - 2023 更新: 因為製作後端的同學已撤掉其服務，目前前端收不到資料，無法訪問
- 本地端執行需要新增 ``.env`` 檔案。
- 後端想寄 Mail 驗證，串接部分 : 使用 ``/verify-mail/`` ``forgetpwd`` 來當作觸發驗證信箱的頁面。
  - 範例 : 
    - ``http://FRONTEND_URL/verify-mail/MjU/anwhy8-c74b2a2e33d5e8e28355e2bfe3970ba3/``
    - ``http://FRONTEND_URL/forgetpwd/MjQ/anv2cs-5c8dae1703cf292a05db291ddbe5b2e4/``

- Dependence: 
  - [Backend Server : cty001996 / se_project](https://github.com/cty001996/se_project)
  - [Websocket Server : a6976933 / SE5-Backend-Websocket](https://github.com/a6976933/SE5-Backend-Websocket)
    - 亦感謝 a6976933 同學幫忙撰寫前端 websocket 部分程式碼

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

### Install Other Tools (if without backend, use this to test Restful API)
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


