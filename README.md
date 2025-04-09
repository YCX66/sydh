开发中词使用的提示词,发出来给予大家一点启发。



我现在要开发一个工具网站导航网站,你作为一个资深建站专家，请你运用你全部的能力进行开发，请根据提供的页面原型的截图，基于Vue3 + ElementPlus帮我制作 “实用导航网站” 的网页，要求如下:网站的的原型就像图片中这样，左侧是导航分类，右侧上方是一张大图片，下方是对应分类下的网址栅格单元，单元上有网站名，简介以及图标，点击单元就能跳转到对应网站，并且这个网站支持众包建设，网站有一个固定悬浮在右下角的加号按钮，每个人都可以点它，会弹出一个新建网站信息表，填好后这个新网站的栅格单元也会显示在网页中，在网站最底部有用户评论区，用户可以使用系统随机创建的身份发表评论


很好，但还需调整一下：1，网址栅格单元不光竖着排列，也有横着排列
2，点击右下角加号应该弹出一张新建网站表单，数据库的网址表单字段是这样设计的，你据此设计一下前端填写的表单：{  
  "category_id": 1,        // 必填，整数，关联的分类ID
  "website_name": "新网站名称", // 必填，字符串，网站名称
  "intro": "新网站简介",      // 可选，字符串，网站简介
  "icon_url": "图标URL",    // 可选，字符串，网站图标URL
  "link": "网站链接"         // 必填，字符串，网站跳转链接
}  


我要建立一个大学生实用资源导航网站，需要收集一些实用有趣的网站或文章或博主账号，把它们的链接放在我的网站上，涉及大学生衣食住行，找工作，办公，提高认知，意外处理等方方面面的知识，请你运用你丰富的知识库，先为我策划一下这些网站可以怎么分类，列出分类


还有一些地方需要调整1，网站有点空，你可以自己先填充一些示例网站,
2，左侧导航栏应该是悬浮的，不随页面滚动而改变位置，并且要设计成可折叠可展开的样式，3，右侧栅格单元太大了，改成一行有五个栅格单元，并且所用栅格单元都在一个长页面上，让使用者不用点击左侧分类，直接往下滑就可以看完所有栅格单元

再优化一下：1，增加网页顶栏，顶栏上居中写上网站名“实用导航”2，左侧栏的展开收起按钮的位置不太好，改到左侧导航栏顶上，并且做大一点

现在清除所有示例数据，开始调用后端数据库的数据，显示在网站上。前端要访问的服务端访问地址为:http://sydh.ns-s3k94e4s.svc.cluster.local:8080，

项目接口数据格式如下：

## 1. 导航分类接口

### 获取所有导航分类
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/categories`
- **请求参数**: 无
- **响应格式**:
```json
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "category_name": "设计工具",  
      "sort": 1  
    },  
    {  
      "id": 2,  
      "category_name": "AIGC工具",  
      "sort": 2  
    }  
  ]  
}  
```

## 2. 网站信息接口

### 获取分类下的网站列表
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/categories/{categoryId}/websites`
- **路径参数**: categoryId - 分类ID
- **响应格式**:
```json
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "category_id": 1,  
      "website_name": "IconFont",  
      "intro": "国内著名的图标搜索及管理平台",  
      "icon_url": "https://objectstorageapi.hzh.sealos.run/s3k94e4s-sydh/xxxx.png",  
      "link": "https://www.iconfont.cn"  
    }  
  ]  
}  
```

### 提交众包网站
- **URL**: `POST https://yliogqcydthm.sealoshzh.site/api/websites/submit`
- **Content-Type**: `multipart/form-data`
- **请求参数**:
  - `categoryId`: int, 必填，分类ID
  - `websiteName`: string, 必填，网站名称
  - `intro`: string, 必填，网站简介
  - `link`: string, 必填，网站链接
  - `iconFile`: file, 必填，网站图标文件
- **响应格式**:
```json
{  
  "code": 201,  
  "message": "提交成功"  
}  
```

## 3. 评论功能接口

### 获取评论列表
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/comments`
- **请求参数**: 无
- **响应格式**:
```json
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "content": "网站导航很实用！",  
      "random_identity": "创意小能手",  
      "create_time": "2023-06-15 12:00:00"  
    }  
  ]  
}  
```

### 提交评论
- **URL**: `POST https://yliogqcydthm.sealoshzh.site/api/comments`
- **Content-Type**: `application/json`
- **请求参数**:
```json
{  
  "content": "评论内容",  
  "random_identity": "系统生成的随机身份"  
}  
```
- **响应格式**:
```json
{  
  "code": 201,  
  "message": "评论发布成功"  
}  
```

## 4. 随机身份接口

### 获取随机用户身份
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/identities/random`
- **请求参数**: 无
- **响应格式**:
```json
{  
  "code": 200,  
  "data": {  
    "id": 1,  
    "nickname": "工具探索者",  
    "avatar_url": "https://example.com/avatar2.png"  
  }  
}  
```

## 错误响应格式
所有接口在出错时会返回统一格式的错误信息：
```json
{
  "code": 400,  // 或其他错误码
  "message": "错误信息描述"
}
```

再修改一下1,示例数据还是没有清除，你再检查一下2，左侧栏的的展开折叠按钮太小了，把点击范围改大一点3,网站右下角的加号按钮，点击后要弹出一个新建网站信息表，填好后这个新网站的栅格单元也会显示在网页中。前端要访问的服务端访问地址为:http://sydh.ns-s3k94e4s.svc.cluster.local:8080，

项目接口数据格式如下：

## 1. 导航分类接口

### 获取所有导航分类
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/categories`
- **请求参数**: 无
- **响应格式**:
```json
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "category_name": "设计工具",  
      "sort": 1  
    },  
    {  
      "id": 2,  
      "category_name": "AIGC工具",  
      "sort": 2  
    }  
  ]  
}  
```

## 2. 网站信息接口

### 获取分类下的网站列表
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/categories/{categoryId}/websites`
- **路径参数**: categoryId - 分类ID
- **响应格式**:
```json
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "category_id": 1,  
      "website_name": "IconFont",  
      "intro": "国内著名的图标搜索及管理平台",  
      "icon_url": "https://objectstorageapi.hzh.sealos.run/s3k94e4s-sydh/xxxx.png",  
      "link": "https://www.iconfont.cn"  
    }  
  ]  
}  
```

### 提交众包网站
- **URL**: `POST https://yliogqcydthm.sealoshzh.site/api/websites/submit`
- **Content-Type**: `multipart/form-data`
- **请求参数**:
  - `categoryId`: int, 必填，分类ID
  - `websiteName`: string, 必填，网站名称
  - `intro`: string, 必填，网站简介
  - `link`: string, 必填，网站链接
  - `iconFile`: file, 必填，网站图标文件
- **响应格式**:
```json
{  
  "code": 201,  
  "message": "提交成功"  
}  
```

## 3. 评论功能接口

### 获取评论列表
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/comments`
- **请求参数**: 无
- **响应格式**:
```json
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "content": "网站导航很实用！",  
      "random_identity": "创意小能手",  
      "create_time": "2023-06-15 12:00:00"  
    }  
  ]  
}  
```

### 提交评论
- **URL**: `POST https://yliogqcydthm.sealoshzh.site/api/comments`
- **Content-Type**: `application/json`
- **请求参数**:
```json
{  
  "content": "评论内容",  
  "random_identity": "系统生成的随机身份"  
}  
```
- **响应格式**:
```json
{  
  "code": 201,  
  "message": "评论发布成功"  
}  
```

## 4. 随机身份接口

### 获取随机用户身份
- **URL**: `GET https://yliogqcydthm.sealoshzh.site/api/identities/random`
- **请求参数**: 无
- **响应格式**:
```json
{  
  "code": 200,  
  "data": {  
    "id": 1,  
    "nickname": "工具探索者",  
    "avatar_url": "https://example.com/avatar2.png"  
  }  
}  
```

## 错误响应格式
所有接口在出错时会返回统一格式的错误信息：
```json
{
  "code": 400,  // 或其他错误码
  "message": "错误信息描述"
}
```



把这个导航网站所列出的所有网站信息提取给我，我要录入数据库，数据库的网站信息表的建表语句是
CREATE TABLE `website` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT COMMENT '关联分类表ID',
    `website_name` VARCHAR(255) NOT NULL COMMENT '网站名称',
    `intro` TEXT COMMENT '网站简介',
    `icon_url` VARCHAR(512) COMMENT '图标URL地址',
    `link` VARCHAR(512) NOT NULL COMMENT '网站跳转链接',
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




我正在开发一个AI工具导航网站，工具的分类我已经确定了，请你运用你丰富的知识库，为每个分类举例8个ai工具网站，分类：
AI热门工具
AI文本工具
AI图片工具
AI视频工具
AI音频工具
AI开发编程
AI营销工具
AI办公效率
AI设计工具
AI智能体平台
AI搜索工具
万能在线工具
其他AI工具
AI内容检测
Prompt提示词
AI算力租赁
AI聊天对话
AI翻译工具
AI法律助手
AI开放平台
AI插件大全
AI模型下载
AI大模型
AI客户端
ai api接口
AI开发框架
AI社区
AI学习平台
AI竞赛
IT AI资讯


点击右下角添加网站按钮后，应该弹出一个新建网站的表单，表单上需填写的字段请参照这个接口格式设计，
### 提交众包网站
- **URL**: `POST https://yliogqcydthm.sealoshzh.site/api/websites/submit`
- **Content-Type**: `multipart/form-data`
- **请求参数**:
  - `categoryId`: int, 必填，分类ID
  - `websiteName`: string, 必填，网站名称
  - `intro`: string, 必填，网站简介
  - `link`: string, 必填，网站链接
  - `iconFile`: file, 必填，网站图标文件
- **响应格式**:
```json
{  
  "code": 201,  
  "message": "提交成功"  
}  

/*现在对网站进行大幅美化，整体采用玻璃拟态的外观风格，并且加入高级丝滑的动态效果，鼠标点击要有特效，鼠标移动要有尾迹特效

再优化以下内容：1，网址栅格单元不需要展示网址2，当前页面停留在的分类要在左侧导航栏突出显示，3，美化顶栏，改成无边界的有粒子发散特效的天幕


再优化以下内容：1，左侧导航栏的各个分类可以排列得再紧密点，且收起折叠按钮要固定悬浮在顶端，且点击面积要和下面的分类标签的点击面积一样大2，把字体改成优雅一点的字体

mvn spring-boot:run


2，添加一个占良3，右侧主区域上方的大图片不需要了，改成有

再优化以下内容：1，把网站名改成”任意门“，简介改成”极客们都喜欢的AI导航网站“，顶栏标题改成”任意门--极客们都喜欢的AI导航网站“2，网页背景颜色要设计成渐变色彩变幻流动的动态背景

再优化以下内容：1，把顶栏标题改成”任意门--极客们都喜欢的AI导航网站“2，网页背景颜色要设计成渐变色彩变幻流动的动态背景，颜色要淡要轻盈要高级，不要花里胡哨的3，给鼠标移动增加移动时的拖尾特效

再优化以下内容：1，把网站背景颜色改成淡淡的青粉渐变色背景，其他地方也相应地统一为青粉色调2，右侧网站栅格单元离左测导航栏太远了，改紧凑一点3，点击右下角添加网站按钮后，弹出的新建网站表单太透明了，不好辨认，要增加可见性

刚才更改的效果我不满意，我已经撤销了，请你重新更改：把网站整体的背景颜色改成淡淡的青粉渐变色背景，其他地方也相应地统一为青粉色调，要清淡的颜色，不要太浓2，右侧网站栅格单元离左测导航栏太远了，要紧挨着才对3，点击右下角添加网站按钮后，弹出的新建网站表单太透明了，不好辨认，要增加可见性，增加不透明度

优化以下内容1，把顶栏标题改成”任意门--极客们都喜欢的AI导航网站“，并提高文字可见性，2，点击右下角添加网站按钮后，弹出的新建网站表单太透明了，不好辨认，要增加可见性，增加不透明度3，右侧上方的图片储存地址在https://objectstorageapi.hzh.sealos.run/s3k94e4s-sydh/AI 工具分类与举例 (1).png，把图片放上去

优化以下内容1，顶栏高度可以再多一点，把顶栏标题的字体改为黑色，并加粗2，当加载页面时，增加一个全屏流星划过的特效zzz最底下的用户评论区，把发表评论按钮上的字改成”使用随机身份发表评论“

优化以下内容1，顶栏高度可以再多一点，把顶栏标题的字体改为黑色，2，最底部的发表评论功能有问题，请修改，当用户在文本框输入评论并提交后，后端将把评论记录到数据库，评论的用户名是后端自动随机生成的，评论相关接口如下，评论功能接口
获取评论列表
URL: GET https://yliogqcydthm.sealoshzh.site/api/comments
请求参数: 无
响应格式:
{  
  "code": 200,  
  "data": [  
    {  
      "id": 1,  
      "content": "网站导航很实用！",  
      "random_identity": "创意小能手",  
      "create_time": "2023-06-15 12:00:00"  
    }  
  ]  
}  
提交评论
URL: POST https://yliogqcydthm.sealoshzh.site/api/comments
Content-Type: application/json
请求参数:
{  
  "content": "评论内容",  
  "random_identity": "系统生成的随机身份"  
}  
响应格式:
{  
  "code": 201,  
  "message": "评论发布成功"  
}  
4. 随机身份接口
获取随机用户身份
URL: GET https://yliogqcydthm.sealoshzh.site/api/identities/random
请求参数: 无
响应格式:
{  
  "code": 200,  
  "data": {  
    "id": 1,  
    "nickname": "工具探索者",  
    "avatar_url": "https://example.com/avatar2.png"  
  }  
}  
错误响应格式
所有接口在出错时会返回统一格式的错误信息：
{
  "code": 400,  // 或其他错误码
  "message": "错误信息描述"




修改以下内容：1，把评论区的”发表为：“三个字提示语改为“使用随机昵称发表评论：”2把新建网站表单的提示语由“网站图标（选填，PNG, JPG, GIF, SVG, ICO格式）”改成“可以不传或者用表情包替代”3，网址栅格单元长度不一，改为统一长度，使电脑端访问一排大概展示四个网址栅格单元，手机端访问大致一排展示两个栅格单元

修改以下内容：1，把新建网站表单的“请输入网站名称”提示语改为“填写链接，推荐工具，网站，文章，视频，或博主都可以”2，把评论区评论的排序顺序改为发布早的排在前面，并且不需要显示时分秒，精确到日期就行了

优化以下内容：1，优化手机端访问的体验，优化布局2，左侧导航栏的展开折叠按钮要有“折叠/按钮”文字提示，并且展开折叠过程太卡顿了，响应要快一点，3，展开导航栏时，要做到不光点击折叠按钮，点击右侧空白区域也能收起导航栏
}
*/

