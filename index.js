const handleImgs = require('./getImgs')
const http = require('http')
const config = require('./config')
const ejs = require('ejs')
const fs = require('fs')

function getImgs() {
  // console.log('1')
  handleImgs(config.url)
  .then(imgs => {
    // console.log(imgs)
    let data = {
      imgs
    }
    // console.log(data)
    const template = ejs.compile(fs.readFileSync(__dirname+'/index.ejs','utf8'))
    const index = template(data)
    const server = http.createServer((req, res) => {
      // console.log('2')
      // console.log(imgs)
      res.writeHead(200, {'content-type': 'text/html'})
      res.write(index)
      res.end()
    })
    
    server.listen(8000, () => {
      console.log('监听8000中...')
    })
  })
  .catch((err)=>{
    console.log(err)
  })
}

getImgs()




