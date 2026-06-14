
# 开发规范指南

为保证代码质量、可维护性、安全性与可扩展性，请在开发过程中严格遵循以下规范。

## 一、项目环境与配置

### 1. 工作环境
- **操作系统**：Windows 11
- **工作目录**：`E:\idea2026\9\law-study-system`
- **代码作者**：ASUS

### 2. 核心技术栈
- **开发语言**：Java
- **SDK版本**：Java 17.0.18 (注意：虽然 pom.xml 中配置了 source/target 为 9，但环境要求 JDK 17)
- **构建工具**：Maven
- **主框架**：Spring Boot

### 3. 核心依赖版本
- **Spring Boot**：2.7.14
- **MyBatis-Plus**：3.5.3.1
- **MySQL**：8.0.33
- **Redis**：Spring Boot Starter Data Redis
- **工具库**：
  - Lombok：1.18.30
  - Hutool：5.8.20
  - Fastjson：2.0.40

### 4. 目录结构
本项目采用前后端分离架构，后端代码位于 `law-study-system/src/main/java/com/backend/com/minzu` 下。

**后端目录树：**
```text
law-study-system/src/main/java/com/backend/com/minzu/
├── common/              # 通用工具类或拦截器
├── config/              # 配置类
├── controller/          # 控制器层
├── dto/                 # 数据传输对象
├── entity/              # 数据库实体类
├── mapper/              # MyBatis-Plus 数据访问层
└── service/             # 业务逻辑层
    └── impl/            # Service 实现类（需与接口在同一包或子包下）
```

**前端目录结构（仅供参考，非代码规范对象）：**
```text
frontend/
├── components/          # 公共组件
├── pages/               # 页面
├── utils/               # 工具函数
└── styles/              # 样式文件
```

## 二、分层架构规范

| 层级        | 职责说明                         | 开发约束与注意事项                                               |
|-------------|----------------------------------|------------------------------------------------------------------|
| **Controller** | 处理 HTTP 请求与响应，定义 API 接口 | 不得直接访问数据库，必须通过 Service 层调用；使用 `@Valid` 进行参数校验 |
| **Service**    | 实现业务逻辑、事务管理与数据校验   | 必须通过 Mapper 层访问数据库；返回 DTO 而非 Entity（除非必要）         |
| **Mapper**     | 数据库访问与持久化操作             | 继承 `com.baomidou.mybatisplus.core.mapper.BaseMapper`             |
| **Entity**     | 映射数据库表结构                   | 不得直接返回给前端（需转换为 DTO）；包名统一为 `entity`               |

### 接口与实现分离

- 所有业务逻辑通过接口定义（如 `UserService`），具体实现类需放在接口所在包下的 `impl` 子包中。

## 三、数据库与持久层规范

### MyBatis-Plus 配置遵循
根据项目 `application.yml` 配置，所有代码需遵循以下约定：
- **包名别名**：`com.backend.com.minzu.entity` (对应 `type-aliases-package`)
- **命名策略**：开启驼峰命名转换 (`map-underscore-to-camel-case: true`)，即 `user_id` 自动映射为 `userId`。
- **主键策略**：数据库主键自增 (`id-type: auto`)。
- **逻辑删除**：未在配置中显式定义逻辑删除字段，暂不强制要求使用逻辑删除，除非业务明确指定。

### 查询优化
- 避免在循环中进行数据库查询（N+1 问题）。
- 复杂查询建议在 Mapper XML 中编写或使用 MyBatis-Plus 的 Lambda 查询构建器。

## 四、安全与性能规范

### 输入校验
- **框架**：`spring-boot-starter-validation`
- **注解**：使用 `jakarta.validation.constraints.*` (如 `@NotBlank`, `@Size`, `@Email`)
- **禁止**：禁止手动拼接 SQL 字符串，防止 SQL 注入攻击。

### 事务管理
- `@Transactional` 注解仅用于 **Service 层**方法。
- 避免在循环中频繁提交事务，影响性能。

## 五、代码风格规范

### 命名规范
| 类型       | 命名方式             | 示例                  |
|------------|----------------------|-----------------------|
| 类名       | UpperCamelCase       | `UserServiceImpl`     |
| 方法/变量  | lowerCamelCase       | `saveUser()`          |
| 常量       | UPPER_SNAKE_CASE     | `MAX_LOGIN_ATTEMPTS`  |

### 注释规范
- **语言**：中文（ASUS 的第一语言）
- **内容**：所有类、方法、字段需添加 Javadoc 注释，说明其功能与参数。

### 类型命名规范（阿里巴巴风格）
| 后缀 | 用途说明                     | 示例         |
|------|------------------------------|--------------|
| DTO  | 数据传输对象                 | `UserDTO`    |
| DO   | 数据库实体对象               | `UserDO`     |
| BO   | 业务逻辑封装对象             | `UserBO`     |
| VO   | 视图展示对象                 | `UserVO`     |
| Query| 查询参数封装对象             | `UserQuery`  |

### 实体类简化工具
- 使用 Lombok 注解替代手动编写 getter/setter/构造方法：
  - `@Data`
  - `@NoArgsConstructor`
  - `@AllArgsConstructor`

## 六、扩展性与日志规范

### 接口优先原则
- 所有业务逻辑通过接口定义（如 `UserService`），具体实现放在 `impl` 包中（如 `UserServiceImpl`）。

### 日志记录
- 使用 `@Slf4j` 注解代替 `System.out.println`
- **日志级别**：
  - `ERROR`：系统错误
  - `WARN`：警告信息
  - `INFO`：一般信息
  - `DEBUG`：调试信息（开发阶段建议开启）

## 七、编码原则总结

| 原则       | 说明                                       |
|------------|--------------------------------------------|
| **SOLID**  | 高内聚、低耦合，增强可维护性与可扩展性     |
| **DRY**    | 避免重复代码，提高复用性                   |
| **KISS**   | 保持代码简洁易懂                           |
| **YAGNI**  | 不实现当前不需要的功能                     |
| **OWASP**  | 防范常见安全漏洞，如 SQL 注入、XSS 等      |
