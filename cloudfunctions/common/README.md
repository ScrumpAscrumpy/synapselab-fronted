# common

这里放各个云函数都会用到的公共方法。

比如：

- 参数校验
- 返回格式统一
- 错误处理

## 当前已有内容

- `response.js`：统一成功/失败返回格式
- `db.js`：CloudBase 数据库初始化入口
- `collections.js`：集合名称常量
- `mockData.js`：本地回退示例数据
- `repository.js`：数据库读写模板与 mock 回退层
