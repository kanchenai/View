# 起步
## 入门
   本框架名称view，是按键监听是复用xepg.min.js。在xepg中适配过的盒子在view中都可以完美继承。
   在view中规范的使用封装式写法，来对焦点的变化做出处理，所以绝大部分的功能都可以封装在view
   内部，可以使外部逻辑简洁规范，基本只需要编写对业务表现及处理相关的逻辑。
   目前最新版为1.2.5

## 引入所需文件

   ```javascript
    <script src="../js/xepg.min.js"></script>  //剩余未迁移的方法
    <script src="../js/view_utils.js"></script>
   ```
## 必要的初始化
在window.onload中，使用view功能之前加上代码View.init(id);

```
var firstFocus = "view_0";//初始焦点id
window.onload = function(){
    View.init(firstFocus);//firstFocus对应的View执行上焦操作
}
```

## 组件
* View-基础视图
* ScrollView-滚动视图
* TextView-文本框
* Dialog-弹窗
* ListView-列表
* GridView-网格列表
* AreaView-区域视图
* RecycleView-可回收视图
* RecycleViewM-可回收视图,单个组件有多焦点 （用法和RecycleView相似）
* Key-按键事件

目前在special_views.js提供的特殊组件

* NoticeView-通知栏
* CarouselView-轮播图
* LogView-log输出
## 组件基本使用方法

### View-基础视图
* 创建：	
    ```javascript
      var view = View.createNew(id);
    ```

* 焦点变化设置：
    ```javascript
      view.setFocusChange(view_1, view_2, view_3, function(){
        view_4.requestFocus();//view_4上焦
      });//参数分别对应的是上下左右
      view.setFocusToUp(view_1);//按键向上
      view.setFocusToDown(view_2);//按键向下
      view.setFocusToLeft(view_3);//按键向左
      view.setFocusToRight(view_4);//按键向右
    ```

* 直接上焦：
    ```javascript
      view.requestFocus();
    ```
* 点击监听设置：
    ```javascript
      view.setOnClickListener(onClickListener);
      var onClickListener = function(view){
        //TODO 这里补上点击的处理
        console.log(view.id+"被点击");
      }
    ```
* 焦点变化监听设置：
    ```javascript
      view.setOnFocusChangeListener(onFocusChangeListener);
      var onFocusChangeListener = function (view, hasFocus) {
             console.log(hasFocus?"上焦":"失焦");
       };
    ```
* 滚动监听设置：
    ```javascript
      view.setOnScrollListener(onScrollListener);
      var onScrollListener = {
            onStartScroll: function (view, x, y) {
               // console.log("开始滚动：view.id:" + view.id + ",x:" + x + ",y:" + y);
            },
            onEndScroll: function (view, x, y) {
               // console.log("结束滚动：view.id:" + view.id + ",x:" + x + ",y:" + y);
            },
            onScrolling: function (view, x, y) {
               // console.log("滚动中view.id:" + view.id + ",x:" + x + ",y:" + y);
            }
        };
    ```
* 数据绑定：
    ```javascript
      view.bindData(obj);
    ```
* 绑定TextView:
    ```javascript
      view.bindTextView(textView);//textView实例
    ```
* 显示：
    ```javascript
      view.show();
    ```
* 隐藏：
    ```javascript
      view.hide();
    ```
* 显示状态：
    ```javascript
      view.isShowing();
    ```
* 只改变样式，但是不触发实际逻辑的方法：
    ```javascript
      view.setFocusStyle();//改成上焦样式
      view.setSelectStyle();//改成驻留样式
      view.setUnFocusStyle();//改成失焦样式
    ```
* 获取view对应的节点：
    ```javascript
      view.getDom();
    ```
* 滚动方法：
    ```javascript
        view.scrollHorizontal(x);//横向滚动x的距离，x>0:向左滚动；x<0:向右滚动；x==0:不滚动
        view.scrollVertical(y);//纵向滚动y的距离，y>0:向上滚动；y<0:向下滚动；y==0:不滚动
        view.scrollVerticalTo(y);//纵向滚动到y的坐标，y表示隐藏在顶部的高度，y>=0
        view.scrollHorizontalTo(x);//横向向滚动到x的坐标，x表示隐藏在左部的宽度，x>=0
        view.startScrollVerticalTo(y,scrollSpeed);//速度为scrollSpeed,纵向滚动到y,一般在内部使用，在外使用时注意是否在执行滚动
        view.startScrollHorizontalTo(x,scrollSpeed);//速度为scrollSpeed,纵向滚动到x，一般在内部使用，在外使用时注意是否在执行滚动
    ```
* 滚动提示：

  需要滚动的view宽高一定要设置准确，view的滚动只能在支持滚动的盒子上执行，在部分的3.0盒子上滚动被关闭，在0.8的版本中修改滚动执行底层实现，使用滚动器方法，在后续版本中那建议使用ScrollView执行滚动。

* 获取和设置属性的方法
    ```javascript
        view.setHtml(html);//设置内部标签
        view.getWidth();//获取宽
        view.getHeight();//获取高
        view.getLeft();//获取横向坐标
        view.getTop();//获取纵向坐标
        view.getScrollLeft();//获取横向滚动距离
        view.getScrollTop();//获取纵向滚动距离
        view.getScrollHeight();//获取滚动高度
        view.getScrollWidth();//获取滚动宽度
        view.getDom();//获取对应的节点
    ```

* 不用创建view，可以直接使用的方法
    ```javascript
        View.$$(id);//获取id对应的节点
        View.getViewWidth(dom);//获取dom的显示宽度，子节点超过部分不计算在内
        View.getViewHeight(dom);//获取dom的显示高度，子节点超过部分不计算在内
        View.getLeft(dom);//获取dom的横向坐标
        View.getTop(dom);//获取dom的纵向坐标
        View.getScrollTop(dom);//获取dom的纵向滚动距离
        View.setScrollTop(dom,scrollTop);//设置dom的纵向滚动距离
        View.getScrollLeft(dom);//获取dom的横向滚动距离
        View.setScrollLeft(dom,scrollLeft);//设置横向滚动距离
        View.getScrollHeight(dom);//获取dom的滚动高度
        View.getScrollWidth(dom);//获取dom的滚动宽度
        View.next(view或funciton);//view上焦或执行function
        View.scrollVerticalToView(fatherView, childView, scrollLocate);//fatherView纵向滑动到子view
        View.scrollHorizontalToView(fatherView, childView, scrollLocate);//fatherView横向滑动到childView
        View.viewUp();//默认的按上处理
        View.viewDown();//默认的按下处理
        View.viewLeft();//默认的按左处理
        View.viewRight();//默认的按右处理
        View.ViewClick();//默认的确定处理
    ```
* 全局方法:
    ```javascript
        getViewById(id);//获取id对应的已创建的View或子View,如果未创建返回null
    ```
## ScrollView-滚动器

* 创建

  ```javascript
  var scrollView = ScrollView.createNew(id);
  ```

* 重写view的部分获取设置方法，兼容部分3.0盒子关闭滚动属性

  ```javascript
  	scrollView.setHtml(html);//设置内部标签
  	scrollView.getScrollTop();//获取scrollView的纵向滚动距离
  	scrollView.setScrollTop(scrollTop);//设置scrollView的纵向滚动距离
  	scrollView.getScrollLeft();//获取scrollView的横向滚动距离
  	scrollView.setScrollLeft(scrollLeft);//设置横向滚动距离
  	scrollView.getScrollHeight();//获取scrollView的滚动高度
  	scrollView.getScrollWidth();//获取scrollView的滚动宽度
  ```

### TextView-文本框

* 创建：
	
	```javascript
	var textView = TextView.createNew(id);
	```
* 设置文字：
    ```javascript
	 textView.setText("这里是文字");//如果需要跑马灯的情况，设置的文字超过宽度时，会有跑马灯
	```
* 执行跑马灯：
    ```javascript
	 textView.marquee();//主动执行跑马灯
	```
* 清楚跑马灯：
    ```javascript
	 textView.clearMarquee();//主动清除跑马灯
    ```
### Dialog-弹窗

* 创建：
    ```javascript
	var dialog = Dialog.createNew(id);//创建时会把id对应的节点隐藏
	```
	
* 弹出dialog:
    ```javascript
    dialog.show();//dialog（弹窗）显示时会记录弹出之前的焦点，当弹窗隐藏时会自动上焦到记录的焦点；当然也可以主动修改记录焦点
    ```
    
* 隐藏dialog
	
	```javascript
	dialog.hide();//隐藏弹窗，记忆焦点上焦
	```
	
* 显示监听：

    ```javascript
    dialog.setOnVisibleChangeListener(onVisibleChangeListener);
    var onVisibleChangeListener = function(dialog,isShowing){
        //isShowing:true:显示，false:隐藏
    };
    ```

    

### ListView-列表

* 创建：
	
	```javascript
	var listView = ListView.createNew(id);
	```
	
* 属性值：
	
	```javascript
	//在bindData([])方法前调用
	listView.orientation = View.vertical;//View.vertical:纵向列表；View.horizontal:横向列表
	listView.isLoop = true;//边界循环
	listView.isCirculate = false;//首尾相接效果
	listView.isFocusCenter = false;//列表item上焦时居中效果
	listView.hasMarquee = false;//列表item存在跑马灯
	```

* 绑定数据:
	
	```javascript
	listView.bindData([]);//绑定数据，在方法内部紧接着就会构建列表
	```
	
* 刷新列表：
	
	```javascript
	listView.refresh();//一般在listView.bindData([]);内使用
	```
	
* 清理列表：
	
	```javascript
	listView.clear();//清楚数据，置空listView.itemViews;
	```
	
* 重写的方法:
	
```javascript
	listView.requestFocus();//重写view中的requestFocus，做出特定的上焦操作
```

	还有点击监听、焦点变化监听、滚动监听，由于监听在listView中需要做一些操作，所以重新定义了这些监听

* 获取当前焦点在列表中的位置：
	
	```javascript
	listView.getCurrentIndex();//返回-1:表示当前焦点未在该列表中；>=0:指定位置
	```
	
* 子元素点击监听设置：
	
	```javascript
	listView.setOnItemClickListener(onItemClickListener);
	var onItemClickListener = function(position,view,data){
		console.log("被点击的item序号："+position+",id:"+view.id+",数据："+data);
	}
	```
	
* 子元素焦点变化监听：
	
	```javascript
	listView.setOnItemFocusChangeListener(onItemFocusChangeListener);
	var onItemFocusChangeListener = function(position,view,hasFocus){
		console.log("焦点变化的item序号："+position+",id:"+view.id+(hasFocus?"上焦":"失焦"));
	}
	```
	
* 列表滚动监听设置：
	
	```javascript
	listView.setOnListScrollListener(onListScrollListener);//onListScrollListener内部的方法参考view的滚动监听器
	```
	
* 适配器设置：
	
	```javascript
  listView.setAdapter(adapter);//
  var adapter = function (idPrefix, index, data) {
       var div = '';//div的结构参考demo
       return div;
  };
  ```
  
### GridView-网格列表

* 创建：
	
	```javascript
	var gridView = GridView.createNew(id);
	```
	
* 适配器的设置：
gridView的适配器与listView不同，存在row(行)、col(列)属性，

	```javascript
	gridView.setGridAdapter(gridAdapter);
	var gridAdapter= function (idPrefix, index, row, col, data) {
		var div = '';//div的构架参考demo
	    return div;
	}
	```
	
* 继承：
  girdView的绝大功能都是继承listView，换句话说，listView的绝大多数功能gridView都可以使用

### AreaView-区域视图

* 创建：
	
	```javascript
	var areaView = AraeView.createNew(id);
	```
	
* 重写方法
	
```javascript
areaView.requestFocus();//重写方法，特殊处理
```


​	
​	还有内部焦点移动也在内部重写，在外只需要设置areaView的焦点变化规则，不用考虑内部的焦点变化。
​	还有内部焦点变化监听，内部子元素的点击监听都被统一，使用一个监听器监听，当然也可以单独设置，但是单独设置会覆盖统一监听器对单独设置的子元素的监听。

* 添加子元素
	
	```javascript
	areaView.addChild(id);//添加一个子元素
	areaView.addChilds([id_0,id_1]);//添加多个子元素
	```
	
	

areaView.addChild或areaView.addChilds时，areaView必须是显示的，否则会出现offset相关数据异常情况，导致焦点变化异常。
解决办法：在areaView显示后再添加子元素（执行上述方法）

* 子元素焦点变化监听器设置：
	
	```javascript
	areaView.setOnChildChangeListener(onChildFocusChangeListener);//onChildFocusChangeListener用法与view的焦点变化监听器相同
	areaView.setOnChildClickListener(onChildClickListener);//onChildClickListener用法与view的点击监听相同
	```
	
	
	
* 不创建areaView，就能使用的方法

  ```javascript
  var position = AreaView.getPosition(childId,fatherId);//获取childId的节点相对于fatherId的坐标
  ```

  position的结构：{left:0,top:0}

  ```javascript
  var distance = AreaView.getDistance(position_0,position_1);//计算两个点之间的距离，返回的时距离的平方
  ```

  

  ```javascript
  /**
   * @param view 从哪个view
   * @param areaView 到指定areaView
   * @param action AreaView.fromUp,AreaView.fromDown,AreaView.fromLeft,AreaView.fromRight  从上、下、左、右进入区域
     */
     AreaView.viewToArea(view,areaView,action);//提供方法，从view进入araView，可以实现跨区域的就近原则
  ```

  

  ```javascript
  var position = AreaView.getAbsolutePosition(id);//获取id节点相对于屏幕的坐标
  ```

  

### RecycleView-可回收视图

该视图可用于单行单列的列表，也可用于多行多列的网格；相比gridView，recycleView可首尾相接循环方式。
相比listView和gridView，recycleView创建的子节点数量可在内部控制，避免过长的数据导致列表节点过多造成的渲染压力，
在上焦时，也没有使用驻留焦点，除非不是按键上焦，直接执行recycleView.requestFocus(),才会有驻留效果
    

* 创建
  
    ```javascript
    var recycleView = RecycleView.createNew(id);
    ```
    
    
    
* 重写方法
  
     ```javascript
     recycleView.addChildView(childId);
     recycleView.onFocusChangeListener(view, hasFocus);
     recycleView.addChild(childId);
     ```
     
     
     
* 子元素监听器使用父类areaView的

    

* 设置适配器
  
    ```javascript
    recycleView.setAdapter(adapter);
    ```
    使用方法和listView的setAdapter、gridView的setGridAdapter基本相同。
    
    
    
* 与listView、gridView不同的使用方法
  
    ```javascript
    recycleView.focusByIndex(index);//给指定的index的子view上焦
    recycleView.getChildViewByIndex(index);//获取指定index的子view
    ```



### Key-按键事件

* 创建

  ```javascript
  var key = Key.createNew();
  ```

* 按键触发的事件

  可重写这个事件，实现自定义的操作

  ```javascript
  key.key_ok_event();//确定
  key.key_up_event();//上
  key.key_down_event();//下
  key.key_left_event();//左
  key.key_right_event();//右
  key.key_number_event(number);//数字
  key.key_back_event();//返回
  key.key_pageUp_event();//上翻页
  key.key_pageDown_event();//下翻页
  key.key_mute_event();//静音
  key.key_del_event();//删除
  key.key_volUp_event();//音量加
  key.key_volDown_event();//音量减
  key.key_red_event();//红
  key.key_green_event();//绿
  key.key_yellow_event();//黄
  key.key_blue_event();//蓝
  key.key_default_event(keyCode);//其他键
  key.key_player_event(player_event);//播放器状态
  key.key_back_opt();//默认的返回方法，内部使用的是XEpg的调用
  ```

  Key会在加载js时创建，然后赋值给View.key

### special_views
<font color=red>由于special_views中是具体的功能组件，所以不在这里具体说明</font>

## 事件
下述事件在view或子view中都会存在，只能在不同view内部有不同的触发及实现
*  createNew(id)
view及子view的创建：创建一个对象，包含着对应功能
# 核心概念
## 基础
焦点的变化效果主要是对节点的样式改变，比较通用的是className从item变化到item item_focus,但是这只是样式的改变并没有内部逻辑的改变，所以当前框架是对内部逻辑的处理。
## 与页面之间的交互
页面通过view的上焦、点击等操作触发内部逻辑，通过监听器反馈给页面一个监听到的状态，页面通过监听状态来处理响应的逻辑，以达到操作页面触发数据业务，省去中间逻辑的效果。
## 组件化
在view框架使用过程中可以发现，不同的功能模块需要调用对应的view或子view，但是对于一些不是非常普遍但是可以复用的子view可以封装在special_views中，已到达之后有相同或相似的需求时，快速高效的复用。
## 监听器
主要的监听器：点击监听、焦点变化监听及滚动监听，目前使用的是这三种主要监听器，如果有业务需要，例如我们也可以定义view显示监听之类的监听器。这些监听器可以实时监听对应的变化状态，以达到外部可以只写对不同状态的处理逻辑，而不用写什么使用调用处理逻辑。
#与xepg.min.js差异
二次开发的原因主要是由于在使用xepg的过程中，虽然能够满足现有的开发需求，并且功能也比较全面，
但是实现的功能都比较基础，没有统一的前置要，对代码的编写也没有强制规范，导致代码风格出现较大
的差异，造成复用率低，重复编写相同的逻辑功能的代码。并且xepg的基础功能也需要构建，导致基础的
页面操作代码占用非常高的比例。特别是对瀑布流类、列表类的焦点处理。
#API文档
<font color=red>参见《View API.docx》</font>
#兼容情况

## 兼容
view是基于es5，及css2样式，可以兼容绝大多数Android浏览器和Linux系统的浏览器，如果盒子可以支持css3的样式，view也可以接入css3。

缺陷：在实际的项目及demo中发现

滚动效果在Android浏览器中略差于电脑端的浏览器，直观的感受就是不是非常流畅，特别是大距离滚动时；
在Linux系统浏览器中，由于刷新频率较低，滚动效果基本是不能接受的，所以建议适配Linux系统浏览器时，关闭滚动效果，或者调整滚动速度。

由于当前框架开始开发时间在2019年8月左右，实际运用的项目、专区较少。

<font color=#ff0000>如果有新的适配落地的项目、专区，欢迎在下表中补充。</font>

实际落地兼容的运营商如下：

平台 | view版本 | 支持情况
:-:|:-:|:-:
湖南电信|0.6.2|是
甘肃移动|0.2|是
甘肃电信|0.6.2|是
江苏移动|0.6.4|是
浙江新媒体|1.0.2|是
河北移动|0.9.0（少儿大厅）、1.0.0（电竞2.0）|是
山东电信|0.8.0|是
青海电信|0.9.0|是
海南电信|0.6.2|是
新疆电信|1.1.0|是
江西移动|1.0.0|是
辽宁联通|0.9.0|是
湖南移动|1.0.1|是
云南电信|0.8.0|是
天津联通|0.6.2|是
云南移动|0.9.0（叮当小镇）、1.0.0（乐享电竞）|是
## 落地案例
平台 | 产品
:-:|:-:
湖南电信|随心看
甘肃移动|黄冈教育
甘肃电信|芒果专区
江苏移动|芒果TV
浙江新媒体|随心看2.0、叮当小镇、少儿大厅
河北移动|少儿大厅、电竞2.0
山东电信|生活大爆炸
青海电信|淘淘玩具屋
海南电信|华数专区
新疆典型|芒果综艺、趣味课堂、动漫前线
江西移动|AI互动
辽宁联通|少儿大厅
湖南移动|随心看
云南电信|生活
天津联通|聚享看
云南移动|叮当小镇、乐享电竞

## 在建案例
平台 | 产品
-|-
陕西电信|聚享看
新疆移动|酷喵
安徽电信|影视
湖南电信|随心看2.0
贵州新媒体（电信侧）|叮当小镇
贵州新媒体（移动侧）|爱家教育

# 项目架构建议
建议使用MVP项目结构来构建项目。
MVP中V层可以比较完美适用当前框架，在这里就不展开了。
