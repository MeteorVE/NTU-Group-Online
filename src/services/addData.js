const axios = require('axios')
var fs = require('fs');


join_url = 'http://localhost:8000/room/1/join_room'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const apiDjango = axios.create({
  baseURL: `http://localhost:8000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiDjango.interceptors.response.use(
  (res) => {
    return Promise.resolve(res)
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          console.log('登入無效(帳密錯誤或用戶不存在?)')
          break
        case 404:
          console.log('找不到該頁面')
          break
        case 500:
          console.log('伺服器出錯')
          break
        case 503:
          console.log('服務失效')
          break
        default:
          console.log(`連接錯誤${err.response.status}`)
      }
    } else {
      console.log('連接到服務器失敗')
    }
    return Promise.reject(err.response)
  }
)

function readAccount(){
  var text = fs.readFileSync('../assets/testData.txt', 'utf8')
  text = text.split('\n')
  let ret = []
  for (var e of text) {
    ret.push(e.split(' '))
  }
  return ret
}
var accs = readAccount()
console.log(accs)

const getValue = async (u) => {
  return apiDjango
    .post('/token/', {
      email: u[0],
      password: u[1],
    })
    .then((res) => {
      
      return res.data.access
    })
}

const executeQueryAndExtractData = async () => {
  var tokens = []
  for (var d of accs) {
    var myData = await getValue(d)
    tokens.push(myData)
    console.log(myData)
  }

  for(var i in tokens){
    var roomId = 6
    apiDjango
      .post(
        '/room/' + roomId + '/join_room/',
        {
          nickname: 'nickname' + i,
        },
        { headers: { Authorization: 'Bearer ' + tokens[i] } }
      )
      .then((res) => {
        return res.data.access
      })
      .catch()
  }

//  console.log(ts)
  return tokens
}
executeQueryAndExtractData()

//console.log(tokens)



// for (var u of accs) {
//   var t = 
//   tokens.push(t) 
// }
// console.log(tokens);

// for(var i in tokens){
//   var roomId = 1
//   apiDjango.post(
//     '/room/' + roomId + '/join_room/',
//     {
//       nickname: 'nickname'+i,
//     },
//     { headers: { Authorization: 'Bearer ' + tokens[i] } }
//   )
// }

