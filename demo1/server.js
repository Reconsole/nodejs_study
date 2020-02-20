const express = require('express')
const app = express()
const port = 3000
// 解决跨域问题 use使用中间件
app.use(require('cors')())

//解析 传来的json数据
app.use(express.json())

// 连接数据库
const mongoose = require('mongoose')
//默认端口27017   之前的连接方式过时了 更换连接方式
mongoose.connect('mongodb://localhost:27017/express-test', { useUnifiedTopology: true, useNewUrlParser: true })
//创建模型 Product 模型名称 new mongoose.Schema({}) 定义模型字段
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String
}))
// insertMany 插入多条数据
// Product.insertMany([ // 插入数据
//   { title: '产品12' },
//   { title: '产品13' },
//   { title: '产品14' },
//   { title: '产品15' },
//   { title: '产品16' },
//   { title: '产品17' },
//   { title: '产品18' },
//   { title: '产品19' },
//   { title: '产品20' },
//   { title: '产品21' },
//   { title: '产品23' },
//   { title: '产品22' },
//   { title: '产品24' },
//   { title: '产品25' },
//   { title: '产品26' },
//   { title: '产品27' },
//   { title: '产品28' },
//   { title: '产品29' },
//   { title: '产品30' },
//   { title: '产品31' },
// ])
app.get('/products', async (req, res) => {
  //find方法查找  limit限制信息条数 skip跳过信息条数
  // const data = await Product.find().skip(req.query.page).limit(5)
  const data = await Product.find().sort({ _id: -1 })
  // const data = await Product.find().where({ // where条件查询
  //   title:'产品2'
  // })

  res.send(data)
})
// 动态路由
app.get('/products/:id', async (req, res) => {
  const data = await Product.findById(req.params.id)
  res.send(data)
})


app.post('/products', async (req, res) => {
  const data = req.body
  console.log(data)
  const product = await Product.create(data)
  res.send(product)
})


app.put('/products/:id', async (req, res) => {
  // 查找
  const product = await Product.findById(req.params.id)
  //修改
  product.title = req.body.title
  // 保存
  await product.save()
  res.send(product)
})
app.delete('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  await product.remove()
  res.send({
    success: true
  })
})
// public文件夹可以直接被访问
app.use('/', express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`))