const cherrio = require('cheerio')
const config = require('./config')
const req = require('request')
const path = require('path')
const fs = require('fs')

// 获取图片并返回数据
function handleImgs(url) {
  let imgs = new Promise(function(resolve, reject){
    req(url, (err, res, body) => {
      console.log('imgReptile is running......')
      // console.log(body)
      if (err) {
        console.log('error...')
      } 
      else if (!res) {
        console.log('there is nothing...')
      }
      else {
        let imgs = getImgs(body) // 获取处理过后的图片链接
        imgs.map((item, index) => { // 遍历保存图片到本地
          let ext = item.split('.').pop() // 提取后缀名
          let writeStream = fs.createWriteStream(path.join(config.imgSrc, index+'.'+ext))
          req(item).on('err', () => {
            console.log('error....')
          }).pipe(writeStream, {
            'encoding': 'utf8'
          })
        })
        resolve(imgs)
      }
    })
  })
  return imgs
}

// 处理网页img标签，dom为网页dom结构
function getImgs(dom) {
  let $ = cherrio.load(dom)
  let data = []
  $('img').each(function(index, item) {
    let imgSrc = 'http:'+$(this).attr('src')
    data.push(imgSrc)
  })
  return data
}

module.exports = handleImgs