## 图书与订单管理 API 文档

### 1. 基础信息

#### 1.1 接口基础URL

所有接口的基础URL为：

http://localhost:5173/api

#### 1.2 响应格式

所有API响应均使用JSON格式，基本结构如下：

```json
{
  "code": 200,      // 状态码，200表示成功，其他表示失败
  "message": "",    // 状态描述信息
  "data": {}        // 响应数据
}
```

#### 1.3 认证方式

本项目的认证采用基于 **HTTP Session 和 Cookie** 的机制，与用户管理模块一致。

对于需要用户身份的接口（如购物车、收藏、订单相关接口），客户端无需在请求头中手动添加认证信息。浏览器会自动在 HTTP 请求的 `Cookie` 头部中携带包含 Session ID 的 Cookie。服务器端通过解析 Session ID 来识别用户身份。

### 2. 书籍相关接口

#### 2.1 获取书籍列表

获取系统中的书籍列表，支持分页、搜索和分类过滤。

- **请求路径**：`/books`

- **请求方法**：`GET`

- **请求参数**：

  - `query`：(可选) 搜索关键词，搜索范围包括书名、作者和描述。
  - `category_id`：(可选) 分类ID过滤。
  - `page`：(可选) 页码，默认1。
  - `page_size`：(可选) 每页数量，默认12。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 28,
      "page": 1,
      "page_size": 12,
      "books": [
        {
          "id": 1,
          "title": "深入理解React",
          "author": "张三",
          "price": 79.9,
          "cover": "https://picsum.photos/id/24/300/400",
          "description": "这本书深入探讨了React的核心概念和高级用法...",
          "rating": 4.8,
          "category": {
            "id": 1,
            "name": "编程"
          },
        },
        // 更多书籍...
      ]
    }
  }
  ```

#### 2.2 获取书籍详情

根据书籍ID获取单本书籍的详细信息。

- **请求路径**：`/books/{id}`

- **请求方法**：`GET`

- **路径参数**：

  - `id`：书籍ID。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "title": "深入理解React",
      "author": "张三",
      "price": 79.9,
      "cover": "https://picsum.photos/id/24/300/400",
      "description": "这本书深入探讨了React的核心概念和高级用法，适合有一定基础的前端开发者阅读。内容包括React Hooks深度解析、性能优化策略、状态管理方案比较等。",
      "rating": 4.8,
      "category": {
        "id": 1,
        "name": "编程"
      },
      "is_favorite": false  // 当前用户是否已收藏，需要登录状态才能准确获取
    }
  }
  ```

#### 2.3 获取书籍分类列表

获取所有书籍分类信息。

- **请求路径**：`/categories`

- **请求方法**：`GET`

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "name": "编程"
      },
      {
        "id": 2,
        "name": "科技"
      },
      {
        "id": 3,
        "name": "数据科学"
      }
      // 更多分类...
    ]
  }
  ```

#### 2.4 添加图书（仅管理员）

- **请求路径**：`/books`
- **请求方法**：`POST`
- **权限要求**：仅管理员可用
- **请求头**：*浏览器自动携带 Session Cookie*
- **请求参数** (`application/json`)：

  ```json
  {
    "title": "书名",
    "author": "作者",
    "price": 79.9,
    "cover": "https://example.com/cover.jpg", // 可选
    "description": "书籍描述", // 可选
    "rating": 4.8, // 可选
    "category_id": 1
  }
  ```

- **响应示例**：

  ```json
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "id": 101,
      "title": "书名",
      "author": "作者",
      "price": 79.9,
      "cover": "https://example.com/cover.jpg",
      "description": "书籍描述",
      "rating": 4.8,
      "category": {
        "id": 1,
        "name": "编程"
      }
    }
  }
  ```

#### 2.5 修改图书信息（仅管理员）

- **请求路径**：`/books/{id}`
- **请求方法**：`PATCH`
- **权限要求**：仅管理员可用
- **请求头**：*浏览器自动携带 Session Cookie*
- **路径参数**：
  - `id`：书籍ID。
- **请求参数** (`application/json`)：

  ```json
  {
    "title": "新书名", // 可选
    "author": "新作者", // 可选
    "price": 99.9, // 可选
    "cover": "https://example.com/newcover.jpg", // 可选
    "description": "新描述", // 可选
    "rating": 4.9, // 可选
    "category_id": 2 // 可选
  }
  ```

- **响应示例**：

  ```json
  {
    "code": 200,
    "message": "修改成功",
    "data": {
      "id": 101,
      "title": "新书名",
      "author": "新作者",
      "price": 99.9,
      "cover": "https://example.com/newcover.jpg",
      "description": "新描述",
      "rating": 4.9,
      "category": {
        "id": 2,
        "name": "科技"
      }
    }
  }
  ```

#### 2.6 删除图书（仅管理员）

- **请求路径**：`/books/{id}`
- **请求方法**：`DELETE`
- **权限要求**：仅管理员可用
- **请求头**：*浏览器自动携带 Session Cookie*
- **路径参数**：
  - `id`：书籍ID。
- **响应示例**：

  ```json
  {
    "code": 200,
    "message": "删除成功",
    "data": null
  }
  ```

### 3. 购物车相关接口

这些接口需要用户处于登录状态。

#### 3.1 获取购物车列表

获取当前用户的购物车中的所有商品及总计信息。

- **请求路径**：`/cart`

- **请求方法**：`GET`

- **请求头**：*浏览器自动携带 Session Cookie*

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "items": [
        {
          "id": 1,
          "book": {
            "id": 1,
            "title": "深入理解React",
            "author": "张三",
            "price": 79.9,
            "cover": "https://picsum.photos/id/24/300/400"
          },
          "quantity": 2,
          "subtotal": 159.8
        },
        // 更多购物车项...
      ],
      "total_quantity": 5,
      "total_amount": 359.7
    }
  }
  ```

#### 3.2 添加到购物车

将指定书籍添加到当前用户的购物车。如果书籍已存在，则增加数量。

- **请求路径**：`/cart/items`

- **请求方法**：`POST`

- **请求头**：*浏览器自动携带 Session Cookie*

- **请求参数** (`application/json`)：

  json

  复制

  ```
  {
    "book_id": 1,
    "quantity": 2
  }
  ```

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "cart_item": {
        "id": 1,
        "book": {
          "id": 1,
          "title": "深入理解React",
          "author": "张三",
          "price": 79.9,
          "cover": "https://picsum.photos/id/24/300/400"
        },
        "quantity": 2,
        "subtotal": 159.8
      },
      "cart_total": {
        "total_quantity": 5,
        "total_amount": 359.7
      }
    }
  }
  ```

#### 3.3 更新购物车项数量

更新购物车中指定书籍的数量。

- **请求路径**：`/cart/items/{id}`

- **请求方法**：`PATCH`

- **请求头**：*浏览器自动携带 Session Cookie*

- **路径参数**：

  - `id`：购物车项ID。

- **请求参数** (`application/json`)：

  json

  复制

  ```
  {
    "quantity": 3
  }
  ```

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "cart_item": {
        "id": 1,
        "book": {
          "id": 1,
          "title": "深入理解React",
          "author": "张三",
          "price": 79.9,
          "cover": "https://picsum.photos/id/24/300/400"
        },
        "quantity": 3,
        "subtotal": 239.7
      },
      "cart_total": {
        "total_quantity": 6,
        "total_amount": 439.6
      }
    }
  }
  ```

#### 3.4 删除购物车项

从购物车中删除指定书籍。

- **请求路径**：`/cart/items/{id}`

- **请求方法**：`DELETE`

- **请求头**：*浏览器自动携带 Session Cookie*

- **路径参数**：

  - `id`：购物车项ID。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "删除成功",
    "data": {
      "cart_total": {
        "total_quantity": 3,
        "total_amount": 279.8
      }
    }
  }
  ```

#### 3.5 清空购物车

清空当前用户购物车中的所有商品。

- **请求路径**：`/cart/clear`

- **请求方法**：`POST`

- **请求头**：*浏览器自动携带 Session Cookie*

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "购物车已清空",
    "data": null
  }
  ```

### 4. 收藏相关接口

这些接口需要用户处于登录状态。

#### 4.1 获取收藏列表

获取当前用户收藏的所有书籍列表。

- **请求路径**：`/favorites`

- **请求方法**：`GET`

- **请求头**：*浏览器自动携带 Session Cookie*

- **请求参数**：

  - `page`：(可选) 页码，默认1。
  - `page_size`：(可选) 每页数量，默认12。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 5,
      "page": 1,
      "page_size": 12,
      "favorites": [
        {
          "id": 1,
          "book": {
            "id": 1,
            "title": "深入理解React",
            "author": "张三",
            "price": 79.9,
            "cover": "https://picsum.photos/id/24/300/400",
            "rating": 4.8,
            "category": {
              "id": 1,
              "name": "编程"
            }
          },
          "created_at": "2023-06-10T14:30:00Z"
        },
        // 更多收藏项...
      ]
    }
  }
  ```

#### 4.2 添加收藏

将指定书籍添加到当前用户的收藏列表。

- **请求路径**：`/favorites`

- **请求方法**：`POST`

- **请求头**：*浏览器自动携带 Session Cookie*

- **请求参数** (`application/json`)：

  json

  复制

  ```
  {
    "book_id": 1
  }
  ```

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "已成功收藏",
    "data": {
      "id": 1,
      "book": {
        "id": 1,
        "title": "深入理解React"
      },
      "created_at": "2023-06-14T09:12:34Z"
    }
  }
  ```

#### 4.3 取消收藏

从当前用户的收藏列表中移除指定书籍。

- **请求路径**：`/favorites/{book_id}`

- **请求方法**：`DELETE`

- **请求头**：*浏览器自动携带 Session Cookie*

- **路径参数**：

  - `book_id`：书籍ID。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "已取消收藏",
    "data": null
  }
  ```

#### 4.4 检查是否已收藏

检查当前用户是否已收藏指定书籍。

- **请求路径**：`/favorites/check/{book_id}`

- **请求方法**：`GET`

- **请求头**：*浏览器自动携带 Session Cookie*

- **路径参数**：

  - `book_id`：书籍ID。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "查询成功",
    "data": {
      "is_favorite": true
    }
  }
  ```

### 5. 订单相关接口

这些接口需要用户处于登录状态。

#### 5.1 创建订单

根据购物车内容或指定书籍列表创建新订单。

- **请求路径**：`/orders`

- **请求方法**：`POST`

- **请求头**：*浏览器自动携带 Session Cookie*

- **请求参数** (`application/json`)：

  json

  复制

  ```
  {
    "items": [
      {
        "book_id": 1,
        "quantity": 2
      },
      {
        "book_id": 3,
        "quantity": 1
      }
    ],
    "shipping_address": "上海市闵行区东川路800号",
    "contact_name": "张三",
    "contact_phone": "13800138000"
  }
  ```

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "订单创建成功",
    "data": {
      "order_id": 10001,
      "order_number": "ORD20230614001",
      "total_amount": 247.8,
      "status": "待支付", // 默认状态应为待支付
      "created_at": "2023-06-14T10:30:45Z"
    }
  }
  ```

  *注：根据数据库设计，订单状态默认应为'待支付'，响应示例已修正。*

#### 5.2 获取订单列表

获取当前用户的所有订单列表。

- **请求路径**：`/orders`

- **请求方法**：`GET`

- **请求头**：*浏览器自动携带 Session Cookie*

- **请求参数**：

  - `status`：(可选) 订单状态过滤。
  - `page`：(可选) 页码，默认1。
  - `page_size`：(可选) 每页数量，默认10。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 5,
      "page": 1,
      "page_size": 10,
      "orders": [
        {
          "id": 10001,
          "order_number": "ORD20230614001",
          "total_amount": 247.8,
          "status": "待支付",
          "created_at": "2023-06-14T10:30:45Z",
          "contact_name": "张三",
          "contact_phone": "13800138000",
          "shipping_address": "上海市闵行区东川路800号",
          "items_count": 3 // 订单项数量
        },
        // 更多订单...
      ]
    }
  }
  ```

#### 5.3 获取订单详情

根据订单ID获取单个订单的详细信息，包括订单项。

- **请求路径**：`/orders/{id}`

- **请求方法**：`GET`

- **请求头**：*浏览器自动携带 Session Cookie*

- **路径参数**：

  - `id`：订单ID。

- **响应示例**：

  json

  复制

  ```
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 10001,
      "order_number": "ORD20230614001",
      "status": "待支付",
      "total_amount": 247.8,
      "created_at": "2023-06-14T10:30:45Z",
      "shipping_info": {
        "contact_name": "张三",
        "contact_phone": "13800138000",
        "shipping_address": "上海市闵行区东川路800号"
      },
      "items": [
        {
          "id": 1,
          "book": {
            "id": 1,
            "title": "深入理解React",
            "author": "张三",
            "cover": "https://picsum.photos/id/24/300/400"
          },
          "quantity": 2,
          "price": 79.9,
          "subtotal": 159.8
        },
        {
          "id": 2,
          "book": {
            "id": 3,
            "title": "人工智能导论",
            "author": "王五",
            "cover": "https://picsum.photos/id/42/300/400"
          },
          "quantity": 1,
          "price": 88.0,
          "subtotal": 88.0
        }
      ]
    }
  }
  ```

#### 5.4 取消订单

将指定订单的状态从"待支付"修改为"已取消"。

- **请求路径**：`/api/orders/{id}/cancel`

- **请求方法**：`POST`

- **请求头**：*浏览器自动携带 Session Cookie*

- **路径参数**：
  - `id`：订单ID。

- **响应示例**：

```json
{
  "code": 200,
  "message": "订单已取消",
  "data": {
    "id": 10001,
    "order_number": "ORD20230614001",
    "status": "已取消",
    "total_amount": 247.8,
    "created_at": "2023-06-14T10:30:45Z"
  }
}
```

- **错误响应**：

```json
{
  "code": 400,
  "message": "只有待支付状态的订单才能取消",
  "data": null
}
```

或

```json
{
  "code": 404,
  "message": "订单不存在",
  "data": null
}
```

或

```json
{
  "code": 403,
  "message": "无权限操作此订单",
  "data": null
}
```

### 6. 数据库设计

#### 6.1 分类表 (categories)

| 字段名 | 类型        | 描述     | 约束                         |
| :----- | :---------- | :------- | :--------------------------- |
| id     | INT         | 分类ID   | 主键, 自增                   |
| name   | VARCHAR(64) | 分类名称 | 唯一(UNIQUE), 非空(NOT NULL) |

------

#### 6.2 书籍表 (books)

| 字段名      | 类型          | 描述        | 约束                                |
| :---------- | :------------ | :---------- | :---------------------------------- |
| id          | INT           | 书籍ID      | 主键, 自增                          |
| title       | VARCHAR(255)  | 书名        | 非空(NOT NULL)                      |
| author      | VARCHAR(255)  | 作者        | 非空(NOT NULL)                      |
| price       | DECIMAL(10,2) | 价格        | 非空(NOT NULL)                      |
| cover_url   | VARCHAR(512)  | 封面图片URL | 可空(NULL)                          |
| description | TEXT          | 详细描述    | 可空(NULL)                          |
| rating      | DECIMAL(3,1)  | 评分        | 默认0.0 (范围 0.0~5.0)              |
| category_id | INT           | 分类ID      | 外键(categories.id), 非空(NOT NULL) |

------

#### 6.3 购物车表 (cart_items)

| 字段名   | 类型 | 描述       | 约束                                     |
| :------- | :--- | :--------- | :--------------------------------------- |
| id       | INT  | 购物车项ID | 主键, 自增                               |
| user_id  | INT  | 用户ID     | 外键(users.id), 非空(NOT NULL)           |
| book_id  | INT  | 书籍ID     | 外键(books.id), 非空(NOT NULL)           |
| quantity | INT  | 数量       | 非空(NOT NULL), 默认1, CHECK(quantity>0) |
|          |      |            | 复合唯一约束: UNIQUE(user_id, book_id)   |

------

#### 6.4 收藏表 (favorites)

| 字段名     | 类型  | 描述   | 约束                         |
|:--------|:----|:-----|:---------------------------|
| id      | INT | 收藏ID | 主键, 自增                     |
| user_id | INT | 用户ID | 外键(users.id), 非空(NOT NULL) |
| book_id | INT | 书籍ID | 外键(books.id), 非空(NOT NULL) |

------

#### 6.5 订单表 (orders)

| 字段名              | 类型            | 描述    | 约束                                     |
|:-----------------|:--------------|:------|:---------------------------------------|
| id               | INT           | 订单ID  | 主键, 自增                                 |
| user_id          | INT           | 用户ID  | 外键(users.id), 非空(NOT NULL)             |
| total_amount     | DECIMAL(10,2) | 总金额   | 非空(NOT NULL), CHECK(total_amount >= 0) |
| status           | VARCHAR(20)   | 订单状态  | 非空(NOT NULL), 默认'待支付'                  |
| created_at       | DATETIME      | 创建时间  | 非空(NOT NULL), 默认CURRENT_TIMESTAMP      |
| contact_name     | VARCHAR(255)  | 收货人姓名 | 非空(NOT NULL)                           |
| contact_phone    | VARCHAR(64)   | 联系电话  | 非空(NOT NULL)                           |
| shipping_address | TEXT          | 收货地址  | 非空(NOT NULL)                           |

------

#### 6.6 订单项表 (order_items)

| 字段名   | 类型          | 描述       | 约束                                |
| :------- | :------------ | :--------- | :---------------------------------- |
| id       | INT           | 订单项ID   | 主键, 自增                          |
| order_id | INT           | 订单ID     | 外键(orders.id), 非空(NOT NULL)     |
| book_id  | INT           | 书籍ID     | 外键(books.id), 非空(NOT NULL)      |
| quantity | INT           | 数量       | 非空(NOT NULL), CHECK(quantity > 0) |
| price    | DECIMAL(10,2) | 购买时价格 | 非空(NOT NULL), CHECK(price >= 0)   |

------

#### 核心设计说明

1. 一对多关系
   - 购物车项(`cart_items`)和订单项(`order_items`)作为关联表，实现用户与书籍的多对多关系。
   - 每个用户可拥有多个购物车项，每个订单可包含多个订单项。
2. 数据完整性
   - 通过`CHECK`约束保证金额/数量非负。
   - 通过`UNIQUE`约束防止同一用户重复添加同一书籍到购物车。
   - 订单项中独立存储购买时的书籍价格，避免书籍价格变更影响历史订单总额。
3. 业务逻辑优化
   - 订单状态默认值设为'待支付'，符合电商流程。
   - 自动记录订单创建时间(`created_at`)。
   - 收藏表保留用户与书籍的长期关联关系。