<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [special_views开发文档](#special_views开发文档)
  - [前言](#前言)
  - [NoticeView-纵向通知类控件](#noticeview-纵向通知类控件)
  - [CarouselView-图片轮播控件](#carouselview-图片轮播控件)
  - [LogView-日志控件](#logview-日志控件)
  - [RotationView-通知类控件(循环滚动)](#rotationview-通知类控件循环滚动)
  - [PlayerView-播放控件](#playerview-播放控件)
    - [demo](#demo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# special_views开发文档

<p align="right">Author:李亚西</p>

## 前言

>该js主要为View补足在特殊使用场景下的特殊效果，基本上是view中效果的变形。如果在编写Special View过程中，发现具有比较通用场景的效果，可以整合进view，成为基础效果，为Special View提供更好的扩展。

## NoticeView-纵向通知类控件

1. NoticeView类

   1. 参数

        变量名|类型|说明
        --|:--:|:--:
        Id|String|传入document节点ID

   2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        createNew|String|textView|创建一个noticeView关联id的dom并返回|NoticeView.createNew(id)

2. NoticeView对象

    >创建noticeView:var noticeView = NoticeView.createNew(id);由于noticeView是继承listView，所以listView中的方法在noticeView都存在

    1. 变量

        方法名|参数类型|描述|用法
        --|:--:|:--:|:--:
        timer|Timer|切换timer|内部使用
        duration|Int|切换间隔,秒值|noticeView.duration = 3;
        index|Int|当前通知的位置|var index = noticeView.index;
        hasMarquee|boolean|默认有跑马灯，用法和listView相同|noticeView.hasMarquee = true;
        isLoop|boolean|是否循环|noticeView.isLoop = true;
        isCirculate|boolean|是否首尾相接|noticeView.isCirculate = true;
        noticeData|List\<Object>|绑定的数据|内部使用

    2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        addNotice|String,Object|无|添加通知|noticeView.addNotice(“通知1”，“数据1”)
        start| |无|开始轮播|noticeView.start()
        stop| |无|停止轮播|noticeView.stop()
        clear| |无|清除轮播数据|noticeView.clear()

3. 示例

    ``` html
        <body>
            <div class="notice_view" id="notice_view"></div>    
        </body>
    ```

    ```js
        notice_view = NoticeView.createNew('notice_view');
        notice_view.addNotice('das');
        notice_view.addNotice('2sadw');
        notice_view.start();//开始轮播
        notice_view.stop();// 停止轮播
        notice_view.clear();//清空数据
    ```

## CarouselView-图片轮播控件

1. CarouselView类

   1. 参数

        变量名|类型|说明
        --|:--:|:--:
        Id|String|传入document节点ID

   2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        createNew|String|textView|创建一个CarouselView关联id的dom并返回|CarouselView.createNew(id)

2. CarouselView对象

    >创建CarouselView:var CarouselView = CarouselView.createNew(id);由于CarouselView是继承listView，所以listView中的方法在CarouselView都存在

    1. 变量

        方法名|参数类型|描述|用法
        --|:--:|:--:|:--:
        timer|Timer|切换timer|内部使用
        duration|Int|切换间隔,秒值|CarouselView.duration = 3;
        index|Int|当前轮播位置初始值|var index = CarouselView.index;
        hasMarquee|boolean|默认有跑马灯，用法和listView相同|CarouselView.hasMarquee = true;
        isLoop|boolean|是否循环|CarouselView.isLoop = true;
        isCirculate|boolean|是否首尾相接|CarouselView.isCirculate = true;
        scrollSpeed|Number|滚动速度|CarouselView.scrollSpeed = 100;
        carouselData|List\<Object>|绑定的数据|内部使用

    2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        addPic|Url,data|无|添加pic|CarouselView.addPic(picUrl,data)
        start| |无|开始轮播|CarouselView.start()
        stop| |无|停止轮播|CarouselView.stop()
        clear| |无|清除轮播数据|CarouselView.clear()
        carouselByIndex|Number |无|设置起点|CarouselView.carouselByIndex(0)
        getIndex|null |无|获取当前index|CarouselView.getIndex()
        getCurrentData|null |无|获取当前轮播位的数据|CarouselView.getCurrentData()

3. 示例

    ``` html
        <body>
            <div class="carousel_view" id="carousel_view"></div>    
        </body>
    ```

    ```js
        carousel_view = CarouselView.createNew('carousel_view');
        for (var i = 0; i < 10; i++) {
            carousel_view.addPic('https://via.placeholder.com/272x12' + i)
            };
        carousel_view.start();//开始
        carousel_view.carouselByIndex(0)// 轮播当前index
        carousel_view.stop();//停止
        carousel_view.clear();//清空数据
        carousel_view.getIndex();//获取当前index
        carousel_view.getCurrentData();//获取当前index
    ```

## LogView-日志控件

1. LogView类

   1. 参数

        变量名|类型|说明
        --|:--:|:--:
        Id|String|传入document节点ID

   2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        createNew|String|textView|创建一个LogView关联id的dom并返回|LogView.createNew(id)

2. LogView对象

    >创建LogView:var LogView = LogView.createNew(id);由于LogView是继承listView，所以listView中的方法在LogView都存在

    1. 变量

        方法名|参数类型|描述|用法
        --|:--:|:--:|:--:
        lineHeight|Number|单行高度|logView.lineHeight = 16;
        hasMarquee|boolean|默认有跑马灯，用法和listView相同|LogView.hasMarquee = true;

    2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        i|String|无|信息级别打印，字体绿色|LogView.i("log msg")
        w|String |无|信息级别打印，字体绿色|LogView.w(“warning msg”)
        e|String |无|信息级别打印，字体绿色|LogView.stop("error msg")
        addLog|String |无|无级别打印|LogView.clear("msg")
        show| |无|显示|LogView.show()
        hide| |无|隐藏|LogView.hide()

3. 示例

    ``` html
        <body>
            <div class="log_view" id="log_view"></div>    
        </body>
    ```

    ```js
        log_view = LogView.createNew('log_view');
        log_view.i('das');
        log_view.w('2sadw');
        log_view.e('sda');//开始轮播
        log_view.show();// 停止轮播
        log_view.hide();//清空数据
    ```

## RotationView-通知类控件(循环滚动)

1. NoticeView类

   1. 参数

        变量名|类型|说明
        --|:--:|:--:
        Id|String|传入document节点ID

   2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        createNew|String|textView|创建一个RotationView关联id的dom并返回|RotationView.createNew(id)

2. RotationView对象

    >创建RotationView:var RotationView = RotationView.createNew(id);由于RotationView是继承listView，所以listView中的方法在RotationView都存在,RotationView实例化后需要setAdapter()创建节点，bindData绑定数据

    1. 变量

        方法名|参数类型|描述|用法
        --|:--:|:--:|:--:
        duration|Int|切换间隔,秒值|RotationView.duration = 3;
        isLoop|boolean|是否循环|RotationView.isLoop = true;
        isCirculate|boolean|是否首尾相接|RotationView.isCirculate = true;

    2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        start| |无|开始轮播|noticeView.start()
        stop| |无|停止轮播|noticeView.stop()

3. 示例

    ``` html
        <body>
            <div class="rotation_view" id="rotation_view"></div>    
        </body>
    ```

    ```js
        rotation_view = RotationView.createNew('rotation_view');
        rotation_view.setAdapter(function(idPrefix,index,data){
            var div = '<div class="item" style="top: '+ index*80+'px;" id="'+(idPrefix+index)+'">\n' +
                    '            <img src="../images/details/selection.png" />\n' +
                    '            <div class="focus"></div>\n' +
                    '            <div class="txt">'+(data)+'</div>\n' +
                    '  </div>';
            return div;
        })
        let data = [];
        for (let i = 0; i < 6; i++) {
            data.push(i);
        };
        rotation_view.bindData(data);
        rotation_view.start();
    ```

## PlayerView-播放控件

1. PlayerView类

   1. 参数

        变量名|类型|说明
        --|:--:|:--:
        Id|String|传入document节点ID

   2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        createNew|String|textView|创建一个PlayerView关联id的dom并返回|PlayerView.createNew(id)

2. PlayerView对象

    >创建PlayerView:var PlayerView = PlayerView.createNew(id);
    >调用PlayerView.play(url,time)播放视频，视频窗位置为实例化视频窗的节点(document.id)位置及大小
    >视频窗可上焦，上焦时左/右键可触发视频的快退/快进事件

    1. 变量

        方法名|参数类型|描述|用法
        --|:--:|:--:|:--:
        cell|Number|快进快推时间差|playerView.cell = 5

    2. 方法

        方法名|参数类型|返回|描述|用法
        --|:--:|:--:|:--:|:--:
        play|String,Number|无|播放方法|PlayerView.play(url,10)
        start| |无|开始播放|PlayerView.start()
        pause| |无|暂停播放|PlayerView.pause()
        resume| |无|继续轮播|PlayerView.resume()
        stop| |无|停止轮播|PlayerView.stop()
        destroy| |无|销毁播放|PlayerView.destroy()
        playByTime|Number |无|快进到|PlayerView.playByTime(10)
        onClickListener| |无|暂停/继续切换|PlayerView.onClickListener()
        nextRight| |无|快进|PlayerView.nextRight()
        nextLeft| |无|快退|PlayerView.nextLeft()
        replay| |无|重新播放|PlayerView.replay()
        setOnPlayEventListener| |无|播放事件监听|PlayerView.setOnPlayEventListener(function)
        getCurrentPosition| |无|获取当前进度|PlayerView.getCurrentPosition()
        getDuration| |无|获取总进度|PlayerView.getDuration()
        setMuteFlag| |无|获取总进度|PlayerView.setMuteFlag()
        isPlaying| |Boolean|判断是否播放|PlayerView.isPlaying;
        getPlayInfo| |无|获取播放信息|PlayerView.getPlayInfo()
        getVolume| |无|获取音量|PlayerView.getVolume()
        setOnPositionChangeListener| |无|进度变化监听|PlayerView.setOnPositionChangeListener(function)
        setOnVolumeChangeListener| |无|音量变化监听|PlayerView.setOnVolumeChangeListener(function)

3. 示例

    ``` html
        <body>
            <div class="player_view" id="player_view"></div>    
        </body>
    ```

    ```js
        player_view = PlayerView.createNew('player_view');
        player_view.start();//开始轮播
        player_view.pause();//暂停
        player_view.resume();//继续
        player_view.stop();// 停止轮播
        player_view.destroy();//销毁
        player_view.playByTime(10);//从time开始播放
        player_view.onClickListener();//暂停/继续切换
        player_view.nextRight();//快进
        player_view.nextLeft();//快退
        player_view.replay();//从头开始
        player_view.setOnPlayEventListener(onPlayEventListener);
        player_view.getCurrentPosition();//获取当前进度
        player_view.getDuration();//获取总进度
        player_view.setMuteFlag();
        player_view.isPlaying;//是否播放中
        player_view.getPlayInfo();//获取播放信息
        player_view.getVolume();//获取音量
        player_view.setOnPositionChangeListener(onPositionChangeListener);//进度监听事件
        player_view.setOnVolumeChangeListener(onVolumeChangeListener);//音量监听事件
        var onPlayEventListener = {
            /**
             * 开始播放
             */
            onPlayStart: function () {
                
            },

            /**
             * 播放完成
             */
            onPlayComplete: function () {
                
            },

            /**
             * 暂停播放
             */
            onPlayPause: function () {
                
            },

            /**
             * 继续播放
             */
            onPlayResume: function () {
                
            },

            /**
             * 播放停止
             */
            onPlayStop: function () {
                
            },

            /**
             * 播放异常
             */
            onPlayError: function () {
                
            }
        }
        var onPositionChangeListener = function (position,duration) {
            // position当前进度
            // duration总进度
            TODO
        }
        var onVolumeChangeListener = function (volume) {
            // volume当前音量
            TODO
        }
    ```

### [demo](../Demo/page/test_sp.html)
