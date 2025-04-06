// 电子书城数据
const books = [
  {
    id: 1,
    title: '深入理解React',
    author: '张三',
    price: 79.9,
    cover: 'https://picsum.photos/id/24/300/400',
    description: '这本书深入探讨了React的核心概念和高级用法，适合有一定基础的前端开发者阅读。内容包括React Hooks深度解析、性能优化策略、状态管理方案比较等。',
    rating: 4.8,
    category: '编程',
    publishDate: '2023-01-15',
    pages: 358
  },
  {
    id: 2,
    title: 'JavaScript高级程序设计',
    author: '李四',
    price: 99.0,
    cover: 'https://picsum.photos/id/20/300/400',
    description: '本书是JavaScript领域的经典之作，全面介绍了JavaScript语言的核心概念、DOM操作、事件处理、Ajax技术等内容，并详细解释了ES6+的新特性。',
    rating: 4.9,
    category: '编程',
    publishDate: '2022-09-10',
    pages: 720
  },
  {
    id: 3,
    title: '人工智能导论',
    author: '王五',
    price: 88.0,
    cover: 'https://picsum.photos/id/42/300/400',
    description: '本书介绍了人工智能的基本概念、发展历程和主要应用领域，深入讲解了机器学习、深度学习和自然语言处理等核心技术，适合AI入门者阅读。',
    rating: 4.6,
    category: '科技',
    publishDate: '2023-03-22',
    pages: 450
  },
  {
    id: 4,
    title: '设计模式与软件架构',
    author: '赵六',
    price: 85.5,
    cover: 'https://picsum.photos/id/48/300/400',
    description: '该书详细讲解了23种设计模式及其在实际项目中的应用，同时介绍了常见的软件架构模式，帮助开发者编写更加健壮和可维护的代码。',
    rating: 4.7,
    category: '编程',
    publishDate: '2022-11-30',
    pages: 400
  },
  {
    id: 5,
    title: '数据分析实战',
    author: '钱七',
    price: 76.8,
    cover: 'https://picsum.photos/id/36/300/400',
    description: '本书从实际案例出发，讲解了数据分析的完整流程，包括数据获取、清洗、分析和可视化等环节，并介绍了Python数据分析的主要工具和库。',
    rating: 4.5,
    category: '数据科学',
    publishDate: '2023-02-05',
    pages: 380
  },
  {
    id: 6,
    title: '云计算与微服务架构',
    author: '孙八',
    price: 92.0,
    cover: 'https://picsum.photos/id/60/300/400',
    description: '本书深入浅出地介绍了云计算的基本概念、主流云平台和微服务架构设计，同时提供了大量实战案例，帮助读者快速掌握云原生应用开发。',
    rating: 4.4,
    category: '云计算',
    publishDate: '2023-04-18',
    pages: 420
  },
  {
    id: 7,
    title: '网络安全攻防实践',
    author: '周九',
    price: 89.9,
    cover: 'https://picsum.photos/id/65/300/400',
    description: '本书系统介绍了网络安全攻防技术，包括渗透测试、漏洞挖掘、防火墙配置和加密技术等内容，并结合实际案例进行分析，适合安全从业者阅读。',
    rating: 4.7,
    category: '网络安全',
    publishDate: '2022-12-15',
    pages: 390
  },
  {
    id: 8,
    title: '区块链技术与应用',
    author: '吴十',
    price: 78.5,
    cover: 'https://picsum.photos/id/68/300/400',
    description: '本书详细介绍了区块链的技术原理、共识机制和智能合约，并探讨了区块链在金融、供应链和政务等领域的创新应用，同时分析了发展趋势。',
    rating: 4.3,
    category: '区块链',
    publishDate: '2023-01-08',
    pages: 340
  },
  {
    id: 9,
    title: '移动应用UI设计指南',
    author: '郑十一',
    price: 68.0,
    cover: 'https://picsum.photos/id/76/300/400',
    description: '本书汇集了移动应用UI设计的最佳实践和设计原则，详细讲解了界面布局、配色方案、交互设计和用户体验优化等内容，配有大量案例和示例。',
    rating: 4.6,
    category: '设计',
    publishDate: '2022-10-25',
    pages: 320
  },
  {
    id: 10,
    title: '大数据处理与分析',
    author: '陈十二',
    price: 94.5,
    cover: 'https://picsum.photos/id/91/300/400',
    description: '本书系统介绍了大数据处理的核心技术和框架，包括Hadoop、Spark和Flink等，同时讲解了数据仓库设计、ETL流程和数据可视化等相关内容。',
    rating: 4.8,
    category: '大数据',
    publishDate: '2023-05-10',
    pages: 480
  },
  {
    id: 11,
    title: 'DevOps实践指南',
    author: '林十三',
    price: 86.0,
    cover: 'https://picsum.photos/id/96/300/400',
    description: '本书介绍了DevOps的核心理念和实践方法，包括持续集成、持续部署、自动化测试和监控等内容，并提供了多个成功案例分析，帮助读者理解如何在团队中落地DevOps。',
    rating: 4.5,
    category: '运维',
    publishDate: '2022-08-20',
    pages: 360
  },
  {
    id: 12,
    title: '产品经理实战手册',
    author: '黄十四',
    price: 72.0,
    cover: 'https://picsum.photos/id/100/300/400',
    description: '本书从实际工作出发，详细讲解了产品经理的职责、技能和工作方法，涵盖了需求分析、产品规划、原型设计和项目管理等方面，适合产品新人学习。',
    rating: 4.4,
    category: '产品',
    publishDate: '2023-03-05',
    pages: 330
  }
];

// 用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    avatar: 'https://picsum.photos/id/42/300/400',
    role: 'admin',
    email: 'admin@sjtu.edu.cn',
    bio: '欢迎来到交大！',
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    name: 'Squidward Tentacles',
    avatar: '..\\..\\images\\Squidward.jpg',
    role: 'user',
    email: 'Squidward@sjtu.edu.cn',
    bio: '再见海绵宝宝 ，我会想念你的。',
  }
];

// 购物车数据结构
const defaultCart = [];

// 订单数据结构
const defaultOrders = [];

export { books, users, defaultCart, defaultOrders }; 