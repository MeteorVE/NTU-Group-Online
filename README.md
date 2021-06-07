# ntu-group-project


## Notice

Mail 串接 : 使用 ``/verify-mail/`` ``forgetpwd`` 來當作觸發驗證信箱的頁面。
範例 : 
``http://localhost:8080/verify-mail/MjU/anwhy8-c74b2a2e33d5e8e28355e2bfe3970ba3/``
``http://localhost:8080/forgetpwd/MjQ/anv2cs-5c8dae1703cf292a05db291ddbe5b2e4/``



## Todo

### General

- [x] Login 後可以跳轉回 "前一個畫面"
    - ``this.$router.go(-1)``
- [x] 每次進房間就會 call 一次 refresh token
- [x] Login 透過 ``getters.isAuth`` 控制出現
    - 用 mapGetters 讀入，不要在 template 內使用 store。
- [x] App.vue 綁的 token debug，F5 後會沒辦法得到值，不太對。
	- created 時 assign + 後續用 watch 監測來解決。
- [x] Navbar 上面，被選中的會變成黃色。但是如果直接 access Url，會無法觸發 selected 而改變被選中項
    - 原本想透過 computed 來 get router path，再套回 defaultIndex。但怎麼做都沒用。
    後來發現原本的方法又可行了，也許跟拿掉沒用到的 @select="handler" 有關。
- [x]  Join Room Logic (but 有些東西可能沒測到)
- [x]  在 homepage，點了 logout，他會再次 access homepage 但是卻不會讓房間消失。
  - 現在會強制導向 login page
- [x] Create Room Logic
  - 會遇到的正常錯誤: nickname blank 或 title blank，會跳錯誤訊息。
  - 另外兩種可能 : 沒登入、refresh 過期、其他欄位 key 沒 mapping，會被 handle。
- [x] 還沒測試 RoomCreate 硬刪掉 token 會怎樣
  - 可以成功跳轉
- [x] ElMessage 替換成 this.message
- [x] Room Create 的 Warning 的 "點我登入" 連結，希望可以和 Warning text 同一行。
  - 直接導向 login
- [x] 如果在 Login 頁面登入失敗，進 401，然後會出現 this.$router undefine
  - 是 service.js 內的 import 未引入 router 導致
- [x] Forgot pwd 的頁面測試 
- [x] Register 頁面
- [ ] 很多地方的 if then 可以改寫
- [ ] UserPage

### RoomCreate

- [x] 創完房間要 redirect 直接進房
- [x] 我時間有給對但是紀錄是錯的 QQ
  - 房內可以正確顯示
- [ ] 如果創建失敗要跳出相對應訊息，例如某某某沒填。
  - switch case
  - 目前使用遞迴展示 dictionary 解決，不確定後端會不會改中文
  - 還有一個問題 : 一個人的創房間上限有沒有 error message ?

- [ ] url 可以是空的，後端在 init 的時候可以不用預設，或是預設 ``''``
  - issued

### Register
- [ ] 如果創建失敗要跳出相對應訊息，例如某某某沒填。
  - 目前使用遞迴展示 dictionary 解決，不確定後端會不會改中文


### Homepage

- [x] 根據使用者狀態顯示 "進入房間" 或是 "加入房間"
- [x] 加入房間要 redirect 直接進房
- [x] 加入房間的 dialog 要排版
  - 分類 置左 --> 排好了
  - line-height 已經透過多種方法設置還是沒用，暫時無解
- [x] DB: 要新增 image 欄位(type: 網址 = String)
  - 前端如果沒有  會用 el-skeleton-item 去填充
  - 做好了 ! 而且完美 handle url failed 情況，還在 create 自動推薦 !
- [ ] 左邊 SideBar 的 category 是寫死的
  - 目前可以讀取 imageList 但是並非跟後端溝通得到的，不好。
- [ ] Join Room 失敗不會跳錯誤訊息
  - 現在會了，但是是英文
- [x] Homepage 暱稱不會自動載入預設的
  - 現在會了，但是要經過兩次的 /GET，it is so inefficient but I have done my best.
- [x] Homepage 按 Enter 會 jumpout 不是直接觸發 submit
  - 偶然發生過一次而已，目前沒有出現此問題

### RoomShow (聊天室內部)

- [x] 離開房間
- [x] 我沒有想過如果 admin remove 自己。
  - 相關按鈕透過篩選 admin id 來擋住。
- [x] RoomCard 超過固定字數就要強迫壓縮
- [x] RoomShow 內部超過字數問題
- [x] RoomShow 內部的排版
- [x] 前端想想 is_verify 驗證
- [x] 移除修改暱稱
- [x] 如果是不存在的房間得 redirect
- [ ] 如果我在房間內，navbar 會 active 在很奇怪的位置
- [ ] 每個操作都得 refresh Room Record --> Ws notfiy 'xxx-List'
  - priority 稍微一點點  等後端 (還有其他更多事情得先完成)
- [ ] 房內前端得改學號
  - blockList 沒給，其他都改好了
- [ ] invitation
  - 理論上是 user page 要做
- [ ] notification 
- [ ] 非法 access 房間時，blockList, memberList, roomRecord 都能被看到

- [x] 關閉房間沒做出來
  - 關掉 for_dev 就能了
- [ ] 一些操作是否可以改成 403 ? 401 是 invalid token / 登入失敗在用的
- [ ] Moderator 不能被 Admin 給 Remove ?
- [ ] 如果 ws server 在啟動後使用者才加入房間，會無法正確讀取 member list

引述自 https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status
> 403 Forbidden
> 用戶端並無訪問權限，例如未被授權，所以伺服器拒絕給予應有的回應。
> 不同於 401，伺服端知道用戶端的身份。


1. 前端 chatting 時，假設 ws 的資訊會是 { msg, token } 給後端去紀錄，再同步給其他人
  (欄位不能用 uid 或是學號之類的，必須是 token，後端再去反查)
  後端搭配 Channel 的 boardcast server 必須推送 { msg, uid, nickname, time } 這樣的 obj
2. 後端必須再給 access_level, nickname，原因是每次 enter room 的場景並不一定會有那些繼承下來的參數
  或是做一個 GET 版本的 /room/:id/join_room，回傳可以和 POST Res 200 的格式一樣。
3. admin 按鈕是否顯示，用 isAdmin 去管理。
4. admin 有 "刪除房間"、"修改房間" 可以按。(block 相關按鈕還沒考慮進去)
5. Member List 上面有幾個小按鈕 : 
  - Remove, Block，點擊後都會跳出 Popconfirm 問是否確認執行。
  - **都要填寫 Reason** // 後端有沒有 因為 reason is null so response error
6. Block List 上面有幾個小按鈕 : 
  - Delete (解封)，點擊後會有 Popconfirm 問是否確認執行。
7. 上面兩個 Table 可以使用 Collapse 做摺疊，讓版面更好看。
8. 上面的 table 也可以透過 Drawer 讓網頁更潮，但有個細節是需要 call ``$ref``
  - https://zhuanlan.zhihu.com/p/369448926
  - https://blog.csdn.net/m0_38010595/article/details/112763444
9. 進 Room 的時候房間總共需要做以下事情 : 
  - ``/GET /room/:id`` 可以拿到 roomId, title, introduction, create_time, valid_time, room_type, room_category, people_limit
  - ``/GET /room/:id/join_room`` 先假想這個 API 存在，可以拿到自己的 access_level, nickname
  - ``/GET /room/:id/member_list`` 可以拿到大家的 access_level, nickname, uid (不一定是學號)
  - ``/GET /room/:id/block_list``  可以拿到 blocked_user_id, block_manager_id, reason 的 Array
  - ``/GET /room/:id/invitation`` 可以拿到 ... 不確定。
10. 在有 Channel 的協助下，保證時間還有效的情況下，token 不會 invalid, 所以其餘動作不會去 refresh token。
    如果有 invalid 的情況，代表已經和 Channel 斷開連結，連線不上聊天室，那操作就不該給他成功。
11. 重拿 memberList -> local 更新 user(filter memberId) -> watch user 變更再更新 isAdmin
  - 那，哪些情況會重拿 memberList ? 
12. pesudo operation : 廣播更新。
  - 假設為了 loading 著想，接收到廣播時可以只透過前端進行 userList 的增減，而非所有 List 重新 /GET 一次。
  - 但邏輯寫起來也許會有點麻煩。還沒寫到，不確定
13. 修改權限後，local data 要自己 read memberList, 算算看自己是不是 admin。


getMemberList
getBlockList
// getRemoveList
Room Modify
InvitingList
InvitedList
RoomRecord


### RoomShow 內部事件連動

1. 進入房間 
  - 成員列表刷新 getMemberList
  - 如果是非法成員  他還是會 access url 但是房間會顯示一些錯誤訊息 (無法連線到正確房間)
2. 有人主動離開房間 (被廣播通知)
  - 成員列表刷新 getMemberList
3. 有人被 remove (被廣播通知)
  - 成員列表刷新 getMemberList
4. 有人被 block (被廣播通知)
  - 成員列表刷新 getMemberList
  - block List 刷新
5. 某A對某B發出邀請 
  - 邀請中列表刷新 getInvitationList
6. 某B接受某A的邀請，進房間了
  - 邀請中列表刷新 getInvitationList
  - 成員列表刷新 getMemberList
7. 修改房間資訊, 有人修改了 blockList，有人修改了權限
  - 房間資訊刷新 (commit -> 其他人刷新)(上述三個各別刷新，剛好都沒有額外關聯誰)


### Test Case

#### In Room 

1. 點擊編輯房間，編輯房間後，前端能正確顯示，後端也有被改變。並且要能被廣播
2. Remove 和 Block 如果沒有填寫 Reason，無法送出 request
3. Remove 或是 Block 了一個人，他會被踢出 channel, 也會被移除列表，也會被廣播。
4. 每個使用者要可以編輯自己的 nickname，而 admin 擁有另一個編輯按鈕。
5. 在沒有登入的情況下進入頁面會如何。


## Some useful info

- button 套用 href
  - https://github.com/ElemeFE/element/issues/4018

- Json Beautify
  - https://jsonformatter.curiousconcept.com/

- Promise
  - https://www.796t.com/article.php?id=224627
  - https://wcc723.github.io/development/2020/02/16/all-new-promise/
  - 哪些 function 可以使用 ``.then()`` ? 
    - https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

- Axios 搭配 Promise
  - https://segmentfault.com/a/1190000016680014

- CORS 之 
```
Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request.
```
--> 注意有沒有少``/``,
ex: ``apiDjango.post('/room', renamedRoom)`` --> ``apiDjango.post('/room/', renamedRoom)``


- 如果想要做彈窗資訊 (點一個按鈕，背景變暗，然後有個提示框出現)
  - 簡單的，可以參考 ``El-MessageBox ``
  - 如果要做的複雜一點，請改用 ``Dialog ``，不要自找麻煩 QQ

- 如果不知道有哪些 API 可以用，可以直接 access ``http://localhost:8000/
``

-  parent 傳給 子孫(不論幾層)，在 vue3 有個有趣的作法: provide & inject
  - 但要注意，parent 傳的時候是 send by value, 若想要隨時更新要自己加上 computed 屬性
  - 定位像是能跨越多層的 props

- vue 中，``val = ref(0)`` --> 讓這個 val 可以直接呼叫 ++ 來被 increment

- slot 用法
![](https://book.vue.tw/assets/img/2-4-slot.d9af1f25.png)

- ``el-menu`` 的 index 如果是數字，請轉成 String。否則會**瘋狂**報錯。

```html
<el-menu-item
  v-for="(item, index) in sideBarList"
  :key="index"
  :index="index.toString()"
>
```

- input 搭配動態按鈕更改
  - https://www.jianshu.com/p/f1dd60cacfb5

- Vue 3 使 element UI 失效的一些部分
  - https://segmentfault.com/a/1190000038164296

```
<template v-slot:prop="childProps">
</template>
```

- 如果想要任意的透過滑鼠拉動 div 邊界然後改變他的大小
  - https://stackoverflow.com/questions/43411103/resize-div-vertical-or-horizontal

- 很有趣的 object 隨意托動 example : http://jsfiddle.net/singram/E29Af/

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

