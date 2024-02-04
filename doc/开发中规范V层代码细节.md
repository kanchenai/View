
##  V层代码

### 关于代码位置

| 全局变量/方法 | 顺序 | 备注                               |
| -------------- | ---- | ---------------------------------- |
| 地址栏中的参数 | 1    | 直观知道页面间的参数               |
| 控件定义       | 2    | 直接明了的表示页面有多少控件       |
| 工具定义       | 3    |                                    |
| timer定义      | 4    | timer尽量少,不要超过3个                        |
| 全局标识       | 5    | 最好没有                           |
| onload方法     | 6    | 新版本不写                         |
| 返回方法重写   | 7    | 第一个方法，代码定位简单           |
| initView方法   | 8    | 前面代码一般较少，较为方便寻找     |
| setView方法    | 9    | 紧跟initView，较为方便寻找         |
| 各种监听       | 10   | 大量的代码，响应逻辑               |
| 内部封装的方法 | 11   | 方法的堆叠                         |
| initUtil方法   | 12   | 倒数第二，查找较为方便           |
| V层            | 13   | P和V交互点，代码最后方便寻找、修改 |

#### 1.地址栏中的参数

```javascript
var g_param = XEpg.Util.parseUrl();
var firstFocus = g_param.currentId||"";//直接表示第一个焦点id
```

* 只写在js代码开头
  * 方便上一个页面传参和跳转到下一个页面返回参数保存
* 只获取使用和不修改
  * 页面间的参数，修改之后不利于维护



#### 2.控件定义

```javascript
var page_area = null;//整个页面
var first_area = null;//第一屏

var log_view = null;//打印控件
```

* 写在仅次于地址栏参数之后
  * 方便查看当前页面有多少控件
* log_view介于控件和工具，所以放在控件之后，工具之前



#### 3.工具定义

```javascript
var user_model = null;
var presenter = null;//无特殊请款一个页面只会存在一个presenter
var pageUtil = null;//页面跳转工具
var log_util = null;//探针工具
```

* 第三个顺序为工具

  * user_model最先，表示用户相关，

  * presenter业务相关

  * log_util探针相关

    

#### 4.timer定义

```javascript
var xxTimer = null;//页面需要几个定时器，xx表示具体功能
```

* 页面中有很多情况是存在定时操作的

  * timer的数量要控制住，数量越多越难维护

    

#### 5.全局标识

```javascript
var flag = 0;//全局标识能不用就不用
```

* 全局标识尽量少用

  * 标识越多越难维护

  * 标识越多逻辑越难整理

    

#### 6.onload方法

```javascript
//var window.onload = function(){
//    initView();
//    setView();
//    initUtil();
//}
```



* 最新版本中不写onload方法
  * 内部定义了流程，有特殊处理，更强的扩展性
  * 初始焦点可以定义父控件
* 如果是老版本兼容，可以保留



#### 7.返回方法重写

```javascript
View.key.key_back_event = function(){
    
}
```

​	onload或全局变量定义之后为返回重写方法

* 返回重写，在这个位置可以直观的表现返回逻辑
  * 便于寻找
* 返回重写，内部代码不宜太多
  * 返回操作应尽量简单
  * 弹窗控件返回由本身封装，不需要全局的返回



#### 8.initView方法

```java
var initView = function(){
    View.init(firstFocus);//初始化View，并定义第一个焦点id
    log_view = LogView.createNew("log_view");//创建打印控件
    log_view.show();//显示
    log_view.i("View版本："+View.version);//表示控件已显示，避免打印显示了，但是不明确
    
    page_area = AreaView.createNew("page_area");//整个页面
    page_area.addChilds(["first_area"]);
	first_area = AreaView.createNew("first_area");//第一屏
    //...
}
```

* initView是预定义操作的第一个方法，写在返回方法之后
  * 全局变量占据代码极少，写在这里便于寻找
* View.init()，初始化View，写第一行
  * 先初始化，在操作
* log_view其后
  * 表示当前页面是有打印控件的，避免打印控件难以寻找
* 普通控件创建
  * 普通控件较多，依次创建并初始属性
  * **<u>注意：先创建父控件，并添加子控件id，然后在创建子控件，这里有多重滚动的操作</u>**



#### 9.setView方法

```javascript
var setView = function(){
    //焦点变化设置
    //焦点变化修复
    
    
    //监听器也可以设置在标签中，以“view-”开头
    //滚动监听
    page_area.setOnScrollListener(onScrollListener);
    
    //焦点变化监听
    first_area.setOnChildFocusChangeListener(onChildFocusChangeListener);
    
    
    //点击监听
    first_area.setOnChildClickListener(onChildClickListener);
    
    //播放控件监听
   	//player_view.setOnPositionChangeListener(onPositionChangeListener);
}
```

* 这里的归纳，方便得知各个设置有哪些
* 顺序只是一个规范，没有特殊含义



#### 10.各种监听

```javascript
/**滚动监听*/
var onScrollListener = {
    onStartScroll:function(){},//开始滚动
    onScrolling:function(){},//滚动中
    onEndScroll:function(){}//滚动结束
};

/**子控件焦点变化监听*/
var onChildFocusChangeListener = function(view,hasFocus){
    
};

/**子控件点击监听*/
var onChildClickListener = function(view){
    
};
```

* 目前的项目结构中，监听的逻辑和代码会较多
* 这里的处理，不应该包含前文提到的设置



#### 11.代码封装

* 各个页面有各自封装，这里不列举



#### 12.initUtil方法

```javascript
var initUtil = function(){
    user_model = UserModel.createNew();
    pageUtil = PageUtil.createNew();
    presenter = XXPresenter.createNew();
    presenter.onload();
    log_util = LogUtil.createNew();
}
```

* user_model需要先创建，在P层中有可能用到user_model的属性
* presenter的创建和业务开始（presenter.onload()）要先于log_util的创建
  * 不能因为探针影响业务



#### 13.V层

```javascript
var XXView = {
    loadxx:function(data){
        if(!data){//数据校验
           return;
        }
    }
}
```

* 写在最后，方法代码定位，这里是业务交互的地方，会频繁改动
* <u>**注意：一个功能一个load，简单清晰**</u>

