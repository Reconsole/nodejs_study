const express = require('express')
const app = express()
app.use(express.json())
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'asdfjklqewrzgdskjfd'
const { User } = require('./model')

app.get('/api', async (req, res) => {
  const users = await User.find()
  res.send(users)
})
app.post('/api/register', async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
})
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      message: '用户不存在'
    })
  }
  // 解析 散列
  const isPasswordValid = require('bcrypt').compareSync(
    req.body.password,
    user.password
  )
  if (!isPasswordValid) return res.status(422).send({ message: '密码错误' })
  // 设置token传回
  const token = jwt.sign({
    id: String(user._id)
  }, SECRET_KEY)
  res.send({
    user,
    token,
  })
})
const authMiddleWare = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(' ').pop()
  //解析token
  const { id } = jwt.verify(raw, SECRET_KEY)
  req.user = await User.findById(id)
  next()
}
app.get('/api/profile', authMiddleWare, async (req, res) => {

  res.send(req.user)
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})