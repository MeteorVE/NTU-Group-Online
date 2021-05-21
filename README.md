# ntu-group-project


## Notice

後端使用 ``se_project-61317552730eb6a6213a4e50b44f166fbc42e45e``
5/20 那時的版本有 bug，所以我 trace 到這個 working tree
[se_project 6131755273](https://github.com/cty001996/se_project/tree/61317552730eb6a6213a4e50b44f166fbc42e45e)

## Todo

- [x] Login 後可以跳轉回 "前一個畫面"
    - ``this.$router.go(-1)``
- [ ] 每次進房間就會 call 一次 refresh token
- [x] Login 透過 ``getters.isAuth`` 控制出現
    - 用 mapGetters 讀入，不要在 template 內使用 store。
- [x] App.vue 綁的 token debug，F5 後會沒辦法得到值，不太對。
	- created 時 assign + 後續用 watch 監測來解決。
- [x] Navbar 上面，被選中的會變成黃色。但是如果直接 access Url，會無法觸發 selected 而改變被選中項
    - 原本想透過 computed 來 get router path，再套回 defaultIndex。但怎麼做都沒用。
    後來發現原本的方法又可行了，也許跟拿掉沒用到的 @select="handler" 有關。
- [ ]  在 homepage，點了 logout，他會再次 access homepage 但是卻不會讓房間消失。
- [ ]  Join Room Logic
- [ ]  Create Room Logic
- [ ]  UserPage
- [ ]  RoomShow (Room 內部排版)
- [ ]  Room Create 的 Warning 的 "點我登入" 連結，希望可以和 Warning text 同一行。



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

## Test Case

enter homepage test case: 
1. no token in state and localStorage
  - go to login
2. no token in state but in localStorage
  - state get localStorage info, and refresh, go to refresh testcase
3. both token in state and localStorage
  - refresh, go to refresh testcase

refresh test case:
1. Refresh Token is invalid or expired
  - error, should go to login page
    - it will log at .catch()
  - {"detail":"Token is invalid or expired","code":"token_not_valid"}
2. though token in localStorage but refresh_token miss 
  - backend: {"refresh":["This field may not be blank."]}
3. success

## Some useful info

button 套用 href
https://github.com/ElemeFE/element/issues/4018