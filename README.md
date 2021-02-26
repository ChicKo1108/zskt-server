[TOC]

 # 准时课堂-server

项目启动前： `npm install`

数据库及数据库名： `mysql`-`zskt`（运行项目会自动建表）

项目启动： `npm start`



## Sequelize简介

### 入门

#### 安装

`npm install sequelize -S`

`npm install mysql -S`

`npm install mysql2 `

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



### Model Querying 模型查询

#### 简单Insert查询

```js
const jane = await User.create({name: "Jane"});
console.log("Jane's ID:", jane.id);
```

[`Model.create()`](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-create) 方法是使用 [`Model.build()`](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-build) 构建未保存实例并使用 [`instance.save()`](https://sequelize.org/master/class/lib/model.js~Model.html#instance-method-save) 保存实例的简写形式.

也可以定义在 `create` 方法中的属性. 如果你基于用户填写的表单创建数据库条目,这将特别有用. 例如,使用它可以允许你将 `User` 模型限制为仅设置用户名和地址,而不设置管理员标志：

```js
const user = await User.create({
  username: 'alice123',
  isAdmin: true
}, { fields: ['username'] });
// 假设 isAdmin 的默认值为 false
console.log(user.username); // 'alice123'
console.log(user.isAdmin); // false
```

#### 简单Select查询

你可以使用 [`findAll`](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll) 方法从数据库中读取整个表：

```js
// 查询所有用户
const users = await User.findAll();
console.log(users.every(user => user instanceof User)); // true
console.log("All users:", JSON.stringify(users, null, 2));
// 相当于sql中
SELECT * FROM 'User';
```

#### Select查询特定属性

选择某些特定属性，可以使用`attributes`参数：

```js
User.findAll({
    attributes: ['id','name','avatar',['phone', 'tel']] // 使用嵌套数组进行重命名
});
// 相当于sql中
SELECT id, name, avatar, phone AS tel FROM 'USER';
```

可以使用`sequelize.fn()`进行聚合（count）

```js
Model.findAll({
  attributes: [
    'id',
    'foo',
    [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],
    'bar'，
    'baz',
    'qux',
    'hats',
  ]
});
// 相当于sql中
SELECT id, foo, bar, baz, qux, hats, COUNT(hats) AS n_hats FROM ...

// 上面的方法等价于这个，这个更短,并且更不易出错. 如果以后在模型中添加/删除属性,它仍然可以正常工作
Model.findAll({
  attributes: {
    include: [
      [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats']
    ]
  }
});
```

可以排除某些属性

```js
Model.findAll({
  attributes: { exclude: ['baz'] }
});
-- Assuming all columns are 'id', 'foo', 'bar', 'baz' and 'qux'
SELECT id, foo, bar, qux FROM ...
```

#### 应用Where子句

`where`参数用于过滤查询。where有很多运算符，可以从`Op`中以Symbols的形式使用。

##### 基础

```js
const {op} = require('sequelize');
User.findAll({
    where: {
        id: 2
  	}
})
// SELECT * fROM User WHERE id = 2;

// 等同于
User.findAll({
    where: {
        id: {
            [op.eq]: 2
        }
    }
})
```

可以传递多个校验：

```js
Post.findAll({
  where: {
    authorId: 12
    status: 'active'
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';

// 等同于
const { Op } = require("sequelize");
Post.findAll({
  where: {
    [Op.and]: [
      { authorId: 12 },
      { status: 'active' }
    ]
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';
```

`OR`字段可以通过以下方式执行：

```js
const { Op } = require("sequelize");
Post.findAll({
  where: {
    [Op.or]: [
      { authorId: 12 },
      { authorId: 13 }
    ]
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
```

由于以上的 `OR` 涉及相同字段 ,因此 Sequelize 允许你使用稍有不同的结构,该结构更易读并且作用相同：

```js
const { Op } = require("sequelize");
Post.destroy({
  where: {
    authorId: {
      [Op.or]: [12, 13]
    }
  }
});
// DELETE FROM post WHERE authorId = 12 OR authorId = 13;
```

Sequelize 提供了多种运算符.

```js
const { Op } = require("sequelize");
Post.findAll({
  where: {
    [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) AND (b = 6)
    [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) OR (b = 6)
    someAttribute: {
      // 基本
      [Op.eq]: 3,                              // = 3
      [Op.ne]: 20,                             // != 20
      [Op.is]: null,                           // IS NULL
      [Op.not]: true,                          // IS NOT TRUE
      [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

      // 使用方言特定的列标识符 (以下示例中使用 PG):
      [Op.col]: 'user.organization_id',        // = "user"."organization_id"

      // 数字比较
      [Op.gt]: 6,                              // > 6
      [Op.gte]: 6,                             // >= 6
      [Op.lt]: 10,                             // < 10
      [Op.lte]: 10,                            // <= 10
      [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
      [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

      // 其它操作符

      [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

      [Op.in]: [1, 2],                         // IN [1, 2]
      [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

      [Op.like]: '%hat',                       // LIKE '%hat'
      [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
      [Op.startsWith]: 'hat',                  // LIKE 'hat%'
      [Op.endsWith]: 'hat',                    // LIKE '%hat'
      [Op.substring]: 'hat',                   // LIKE '%hat%'
      [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (仅 MySQL/PG)
      [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (仅 MySQL/PG)
    }
  }
});
```

#### `Op.in` 的简写语法

直接将数组参数传递给 `where` 将隐式使用 `IN` 运算符：

```
Post.findAll({
  where: {
    id: [1,2,3] // 等同使用 `id: { [Op.in]: [1,2,3] }`
  }
});
// SELECT ... FROM "posts" AS "post" WHERE "post"."id" IN (1, 2, 3);
```

#### 简单Update查询

Update 查询也接受 `where` 参数,就像上面的读取查询一样.

```js
// 将所有没有姓氏的人更改为 "Doe"
await User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
});
```

#### 简单Delete查询

Delete 查询也接受 `where` 参数,就像上面的读取查询一样.

```
// 删除所有名为 "Jane" 的人 
await User.destroy({
  where: {
    firstName: "Jane"
  }
});
```

要销毁所有内容,可以使用 `TRUNCATE` SQL：

```
// 截断表格
await User.destroy({
  truncate: true
});
```

#### 排序

`order` 参数采用一系列 *项* 来让 sequelize 方法对查询进行排序. 这些 *项* 本身是 `[column, direction]` 形式的数组. 该列将被正确转义,并且将在有效方向列表中进行验证(例如 `ASC`, `DESC`, `NULLS FIRST` 等).

```
Subtask.findAll({
  order: [
    // 将转义 title 并针对有效方向列表进行降序排列
    ['title', 'DESC'],

    // 将按最大年龄进行升序排序
    sequelize.fn('max', sequelize.col('age')),

    // 将按最大年龄进行降序排序
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],

    // 将按 otherfunction(`col1`, 12, 'lalala') 进行降序排序
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

    // 将使用模型名称作为关联名称按关联模型的 createdAt 排序.
    [Task, 'createdAt', 'DESC'],

    // 将使用模型名称作为关联名称通过关联模型的 createdAt 排序.
    [Task, Project, 'createdAt', 'DESC'],

    // 将使用关联名称按关联模型的 createdAt 排序.
    ['Task', 'createdAt', 'DESC'],

    // 将使用关联的名称按嵌套的关联模型的 createdAt 排序.
    ['Task', 'Project', 'createdAt', 'DESC'],

    // 将使用关联对象按关联模型的 createdAt 排序. (首选方法)
    [Subtask.associations.Task, 'createdAt', 'DESC'],

    // 将使用关联对象按嵌套关联模型的 createdAt 排序. (首选方法)
    [Subtask.associations.Task, Task.associations.Project, 'createdAt', 'DESC'],

    // 将使用简单的关联对象按关联模型的 createdAt 排序.
    [{model: Task, as: 'Task'}, 'createdAt', 'DESC'],

    // 将由嵌套关联模型的 createdAt 简单关联对象排序.
    [{model: Task, as: 'Task'}, {model: Project, as: 'Project'}, 'createdAt', 'DESC']
  ],

  // 将按最大年龄降序排列
  order: sequelize.literal('max(age) DESC'),

  // 如果忽略方向,则默认升序,将按最大年龄升序排序
  order: sequelize.fn('max', sequelize.col('age')),

  // 如果省略方向,则默认升序, 将按年龄升序排列
  order: sequelize.col('age'),

  // 将根据方言随机排序(但不是 fn('RAND') 或 fn('RANDOM'))
  order: sequelize.random()
});

Foo.findOne({
  order: [
    // 将返回 `name`
    ['name'],
    // 将返回 `username` DESC
    ['username', 'DESC'],
    // 将返回 max(`age`)
    sequelize.fn('max', sequelize.col('age')),
    // 将返回 max(`age`) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],
    // 将返回 otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],
    // 将返回 otherfunction(awesomefunction(`col`)) DESC, 这种嵌套可能是无限的!
    [sequelize.fn('otherfunction', sequelize.fn('awesomefunction', sequelize.col('col'))), 'DESC']
  ]
});
```

#### 限制和分页

使用 `limit` 和 `offset` 参数可以进行 限制/分页：

```js
// 提取10个实例/行
Project.findAll({ limit: 10 });

// 跳过8个实例/行
Project.findAll({ offset: 8 });

// 跳过5个实例,然后获取5个实例
Project.findAll({ offset: 5, limit: 5 });
```

通常这些与 `order` 参数一起使用.

#### `count`

`count` 方法仅计算数据库中元素出现的次数.

```js
console.log(`这有 ${await Project.count()} 个项目`);

const amount = await Project.count({
  where: {
    id: {
      [Op.gt]: 25
    }
  }
});
console.log(`这有 ${amount} 个项目 id 大于 25`);
```

#### `max`, `min` 和 `sum`

Sequelize 还提供了 max,min 和 sum 便捷方法.

假设我们有三个用户,分别是10、5和40岁.

```js
await User.max('age'); // 40
await User.max('age', { where: { age: { [Op.lt]: 20 } } }); // 10
await User.min('age'); // 5
await User.min('age', { where: { age: { [Op.gt]: 5 } } }); // 10
await User.sum('age'); // 55
await User.sum('age', { where: { age: { [Op.gt]: 5 } } }); // 50
```



## 页面功能及对应API

### 教师端

#### 首页

`/api/getMainPage`

- 作用：获取首页内容，包括`我的班级(classVo)` `消息通知(noticeVo)` `正在进行的考勤信息(punchVo)` `我的个人信息(myUserInfo)`

#### 考勤首页

`/api/getMyClassList`

- 作用：获取班级列表，其中应该区分是否有正在考勤的班级

`/api/getPunchingClass`

- 作用：获取正在考勤的班级

`/api/beginPunch`

- 作用：开始一次考勤

`/api/stopPunch`

- 作用：提前结束本次考勤（修改结束时间即可）

`/api/punch/delete`

- 作用：删除某次打卡





### Schema 表结构

#### `User` 用户表

```js
 User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  realName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sno: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "学号，老师没有此信息"
  }
});
```

#### `Class` 班级表

```js
Class = sequelize.define("Class", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  className: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})
```

#### `ClassMember` 班级成员表

```js
ClassMember = sequelize.define("ClassMember", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
```



#### `Punch` 考勤表

```js
Punch = sequelize.define("Punch", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "创建考勤时的纬度",
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "创建考勤时的精度",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
```

#### `PunchRecord` 考勤记录表

```js
PunchRecord = sequelize.define("PunchRecord", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  punchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});
```

#### `Message` 私聊消息表

```js
Message = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    revoke: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "撤回"
    }
});

```

#### `ClassMessage` 班级消息表

```js
ClassMessage = sequelize.define("ClassMessage", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    ClassId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    revoke: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "撤回"
    }
});

```

#### `ClassMessageTime` 班级消息时刻表

```js
ClassMessgaeTime = sequelize.define("ClassMessageTime", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lastViewTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    }
});
```

#### `Apply` 申请表

```js
Apply = sequelize.define("Apply", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isPass: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "LOADING",
        comment: "LOADING | PASS | REJECT"
    }
});
```



### Model 模型（操作数据库）

#### `UserModel`

- `createUser`创建用户
- `findUserById` 根据Id查找用户
- `findUserByPhone` 根据手机号查询



### Controller 控制器（逻辑控制）

#### `UserController`

- `createUser` 创建用户