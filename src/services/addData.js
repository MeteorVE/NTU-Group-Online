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
    var roomId = 2
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

