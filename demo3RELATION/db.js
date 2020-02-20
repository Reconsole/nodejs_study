const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mongo-relation', { useNewUrlParser: true, useUnifiedTopology: true })
const CategorySchma = new mongoose.Schema({
  name: { type: String }
}, {
  toJSON: { virtuals: true }
})
CategorySchma.virtual('posts', {
  //本地的键名
  localField: '_id',
  //关联模型
  ref: 'Post',
  //关联的键名
  foreignField: 'categories',
  justOne: false
})
const Category = mongoose.model('Category', CategorySchma)
const Post = mongoose.model('Post', new mongoose.Schema({
  title: { type: String },
  body: { type: String },
  category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
  //属于多个分类
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
}))
const main = async () => {
  // await Category.insertMany([
  //   { name: 'vuejs' },
  //   { name: 'nodejs' },
  // ])
  // 查关联名称

  const posts = await Post.find().populate('category').lean() //.lean() 输出json数据
}
main()