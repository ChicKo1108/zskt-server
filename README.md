## Sequelize



### 入门

#### 安装

`npm install sequelize -S`

`npm install mysql -S`

`npm install mysql2 `s`

#### 连接数据库

```js
const sequelize = new Sequelize('database', 'username', 'password', {
    // config
    host: 'localhost',
    dialect: 'mysql',
})
```

#### 测试连接

你可以使用 `.authenticate()` 函数测试连接是否正常：

```js
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
```

#### 关闭连接

`sequelize.close()` 这是一个异步方法，返回一个promise。



### Model Basics 模型基础

模型是Sequelize的本质，是数据库中表的抽象。在Sequelize中，它是一个Model的扩展类。它将告诉Sequelize有关它代表的实体的几件事情，如表名称以及具有的列（及其数据类型）。

模型有一个名称，此名称不必与数据库中表的名字相同。通常模型具有单数名称（`User`）而表具有复数名称（`Users`）。

#### 定义模型

- 调用`sequelize.define(medelName, attributes, options)`
- 扩展`Model`并调用`init(attributes, options)`

定义模型后，可以通过其模型名称在`sequelize.models`中使用该模型。

##### 使用 [`sequelize.define`](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-define):

```js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  // 在这里定义模型属性
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull 默认为 true
  }
}, {
  // 这是其他模型参数
});

// `sequelize.define` 会返回模型
console.log(User === sequelize.models.User); // true
```

##### 扩展 [Model](https://sequelize.org/master/class/lib/model.js~Model.html)

```js
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');

class User extends Model {}

User.init({
  // 在这里定义模型属性
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull 默认为 true
  }
}, {
  // 这是其他模型参数
  sequelize, // 我们需要传递连接实例
  modelName: 'User' // 我们需要选择模型名称
});

// 定义的模型是类本身
console.log(User === sequelize.models.User); // true
```

在内部,`sequelize.define` 调用 `Model.init`,因此两种方法本质上是等效的.

#### 模型同步

Sequelize模型将同步数据库表，它通过model.sync(options)（这是一个一步函数，返回一个promise）来实现。通过这个方法Sequelize将自动对数据库执行SQL查询。注意，这仅更改数据库中的表，而不更改Js端的模型。

- `User.sync()` - 如果表不存在，则创建该表（如果已经存在，则不执行任何操作）
- `User.sync({ force: true })` - 将创建表,如果表已经存在,则将其首先删除
- `User.sync({ alter: true })` - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.

示例:

```js
await User.sync({ force: true });
console.log("用户模型表刚刚(重新)创建！");
```

#### 时间戳

默认情况下,Sequelize 使用数据类型 `DataTypes.DATE` 自动向每个模型添加 `createdAt` 和 `updatedAt` 字段. 这些字段会自动进行管理 - 每当你使用Sequelize 创建或更新内容时,这些字段都会被自动设置. `createdAt` 字段将包含代表创建时刻的时间戳,而 `updatedAt` 字段将包含最新更新的时间戳.



### Model Instance 模型实例

模型就是类，类的实例表示该模型中的一个对象（映射到数据库表中的一行）。模型实例就是DAO。

假定以下设置 ：

```js
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
});

(async () => {
  await sequelize.sync({ force: true });
  // 这里是代码
})();
```

#### 创建实例

尽管模型是一个类，但是你不应该直接使用`new`运算符来创建实例。相反，应该使用`build`方法：

```js
const jane = User.build({ name: "Jane" });
console.log(jane instanceof User); // true
console.log(jane.name); // "Jane"
```

通过`build`创建的对象并不能与数据库通信，而且它也不是异步方法。`build`创建的对象仅表示*可以* 映射到数据库的数据。为了将实例真正保存在数据库中，应使用`save`方法。

```js
await jane.save();
console.log('Jane 已保存到数据库!');
```

请注意,从上面代码段中的 `await` 用法来看,`save` 是一种异步方法. 实际上,几乎每个 Sequelize 方法都是异步的. `build` 是极少数例外之一.

**语法糖：`create`方法**

Sequelize提供了 [`create`](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-create) 方法,该方法将上述的 `build` 方法和 `save` 方法合并为一个方法：

```js
const jane = await User.create({ name: "Jane" });
// Jane 现在存在于数据库中！
console.log(jane instanceof User); // true
console.log(jane.name); // "Jane"
```

