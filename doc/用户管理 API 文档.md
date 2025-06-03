# 用户管理 API 文档

## 1. 基础信息

使用JPA完成

### 1.1 接口基础URL

```
 http://localhost:5173/api/
```

### 1.2 响应格式

所有API响应均使用JSON格式，基本结构如下：

json

```
{
  "code": 200,      // 状态码，200表示成功，其他表示失败
  "message": "",    // 状态描述信息
  "data": {}        // 响应数据
}
```

### 1.3 认证方式

采用基于 **HTTP Session 和 Cookie** 的认证机制：

1. **用户登录**：用户通过登录接口提供用户名和密码。
2. **服务器验证**：服务器验证凭据。
3. **创建 Session**：如果验证成功，服务器会为该用户创建一个 Session，并将 Session ID 通过 HTTP `Set-Cookie` 头部发送给客户端。
4. **客户端存储 Cookie**：浏览器会自动存储这个 Cookie (通常包含 Session ID)。
5. **后续请求**：对于后续的每一个请求，浏览器会自动在 HTTP 请求的 `Cookie` 头部中携带这个 Session ID。
6. **服务器识别用户**：服务器根据接收到的 Session ID 从其 Session 存储中查找对应的用户会话信息，从而识别用户并判断其登录状态。
7. **用户登出**：用户请求登出接口，服务器会使其 Session 失效，并可能清除客户端的 Session Cookie。
8. "记住我"选项会让后端将token持久化到数据库中。

## 2. 用户管理接口

### 2.1 用户登录

**请求路径**：`/auth/login`

**请求方法**：`POST`

复制

```
{
  "username": "admin",
  "password": "admin"
}
```

**响应示例 (成功)**：
 *登录成功后，服务器会在响应的 `Set-Cookie` 头部设置 Session ID。*

json

复制

```
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "avatar": "https://picsum.photos/id/42/300/400",
      "role": "admin",
      "email": "admin@sjtu.edu.cn",
      "bio": "欢迎来到交大！"
    }
  }
}
```

### 2.2 用户登出

**请求路径**：`/auth/logout`

**请求方法**：`POST`

**请求参数**：无特定请求体参数，依赖 Session 进行用户识别。

**响应示例 (成功)**：
 *服务器会使当前用户的 Session 失效。*

json

复制

```
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

### 2.3 获取当前用户信息

**请求路径**：`/users/current`

**请求方法**：`GET`

**请求头**：
 *浏览器会自动携带包含 Session ID 的 `Cookie`。*

**响应示例 (成功)**：

json

复制

```
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员",
    "avatar": "https://picsum.photos/id/42/300/400",
    "role": "admin",
    "email": "admin@sjtu.edu.cn",
    "bio": "欢迎来到交大！"
  }
}
```

### 2.4 用户注册

**请求路径**：`/auth/register`

**请求方法**：`POST`

**请求参数 (application/json)**：

json

复制

```
{
  "username": "newuser",
  "password": "password123",
  "name": "新用户",
  "email": "newuser@example.com"
}
```

**响应示例 (成功)**：

json

复制

```
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 3,
    "username": "newuser",
    "name": "新用户",
    "email": "newuser@example.com",
    "role": "user" // 默认角色
  }
}
```

*说明：注册成功后，用户应引导至登录流程以建立会话。*

### 2.5 更新用户信息

**请求路径**：`/users/{id}`

**请求方法**：`PATCH`

**请求头**：
 *浏览器会自动携带包含 Session ID 的 `Cookie`。*

**请求参数 (application/json)**：

json

复制

```
{
  "name": "更新的名字",
  "email": "updated@example.com",
  "bio": "这是更新后的个人简介"
}
```

**响应示例 (成功)**：

json

复制

```
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "更新的名字",
    "avatar": "https://picsum.photos/id/42/300/400",
    "role": "admin",
    "email": "updated@example.com",
    "bio": "这是更新后的个人简介"
  }
}
```

### 2.6 上传用户头像

**请求路径**：`/users/{id}/avatar`

**请求方法**：`POST`

**请求头**：
 *浏览器会自动携带包含 Session ID 的 `Cookie`。*
 `Content-Type: multipart/form-data`

**请求参数**：

- `avatar`: 文件数据（图片文件）

**响应示例 (成功)**：

json

复制

```
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "avatarUrl": "http://localhost:5173/api/avatars/user_1_timestamp.jpg"
  }
}
```

### 2.7 修改密码

**请求路径**：`/users/{id}/password`

**请求方法**：`PATCH`

**请求头**：
 *浏览器会自动携带包含 Session ID 的 `Cookie`。*

**请求参数 (application/json)**：

json

复制

```
{
  "oldPassword": "admin123",
  "newPassword": "newPassword123"
}
```

**响应示例 (成功)**：

json

复制

```
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

### 2.8 获取全部用户（仅管理员）

**请求路径**：`/admin/users`

**请求方法**：`GET`

**权限要求**：仅管理员（role=admin）可用

**请求参数**：无

**响应示例**：

```
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "avatar": "https://picsum.photos/id/42/300/400",
      "role": "admin",
      "email": "admin@sjtu.edu.cn",
      "bio": "欢迎来到交大！",
      "status": "active"
    },
    {
      "id": 2,
      "username": "user",
      "name": "普通用户",
      "avatar": "https://picsum.photos/id/43/300/400",
      "role": "user",
      "email": "user@sjtu.edu.cn",
      "bio": "普通用户简介",
      "status": "active"
    }
  ]
}
```

### 2.9 删除用户（仅管理员）

**请求路径**：`/admin/users/{id}`

**请求方法**：`DELETE`

**权限要求**：仅管理员（role=admin）可用

**请求参数**：无

**响应示例**：

```
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 2.10 修改用户信息（仅管理员）

**请求路径**：`/admin/users/{id}`

**请求方法**：`PATCH`

**权限要求**：仅管理员（role=admin）可用

**请求参数 (application/json)**：

```
{
  "name": "新名字",
  "email": "new@example.com",
  "bio": "新的简介",
  "role": "user", // 可选，修改用户角色
  "status": "active" // 可选，修改用户状态
}
```

**响应示例**：

```
{
  "code": 200,
  "message": "修改成功",
  "data": {
    "id": 2,
    "username": "user",
    "name": "新名字",
    "avatar": "https://picsum.photos/id/43/300/400",
    "role": "user",
    "email": "new@example.com",
    "bio": "新的简介",
    "status": "active"
  }
}
```

### 2.11 禁用用户（仅管理员）

**请求路径**：`/admin/users/{id}/disable`

**请求方法**：`POST`

**权限要求**：仅管理员（role=admin）可用

**请求参数**：无

**响应示例**：

```
{
  "code": 200,
  "message": "用户已禁用",
  "data": {
    "id": 2,
    "username": "user",
    "status": "disabled"
  }
}
```

## 3. 数据库设计

### 3.1 用户表 (users)

| 字段名   | 类型         | 描述              | 约束                                 |
| -------- | ------------ | ----------------- | ------------------------------------ |
| id       | INT          | 用户ID            | 主键, 自增                           |
| username | VARCHAR(64)  | 用户名            | 唯一, 非空                           |
| name     | VARCHAR(64)  | 用户昵称/真实姓名 | 非空                                 |
| avatar   | VARCHAR(255) | 头像URL           | 默认值 `https://postimg.cc/gXywKMWd` |
| role     | VARCHAR(20)  | 用户角色          | 默认 'user'。允许 'admin', 'user'    |
| email    | VARCHAR(64)  | 电子邮箱          | 唯一, 非空                           |
| bio      | TEXT         | 个人简介          | 可为空                               |

### 3.2 令牌储存（persistent_logins）

| 字段名    | 类型        | 描述          | 约束      |
| --------- | ----------- | ------------- | --------- |
| username  | VARCHAR(64) | 用户名        | 非空 外键 |
| series    | VARCHAR(64) | 序列号 (主键) | 主键      |
| token     | VARCHAR(64) | 令牌值        | 非空      |
| last_used | TIMESTAMP   | 最后使用时间  | 非空      |

### 3.3 用户认证 （user_auth）

| 字段名   | 类型        | 描述   | 约束      |
| -------- | ----------- | ------ | --------- |
| username | VARCHAR(64) | 用户名 | 非空 外键 |
| password | VARCHAR(64) | 密码   | 非空      |
