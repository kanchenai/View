/**
 * 有着特殊效果的子view
 * 在一定的情景下可以复用
 *
 * 现有：
 * NoticeView：上下轮播文字
 * CarouselView：左右轮播图片
 * LogView:日志打印到页面
 * RotationView:显示多个的轮播，item
 * PlayerView:播放控件
 * Toast:提示组件
 *
 * version       data            description
 * 1.0.0        2020.02.21       修复CarouselView.isCarousel状态不正确
 * 1.1.0        2020.03.16       给NoticeView新增轮播监听器和轮播状态isNotice
 *              2020.05.22       NoticeView适配ScrollView。现象：不滚动;回滚logView，父类还是listView
 * 1.2.0        2020.12.04       新增RotationView控件，自动轮播，可以横纵向，start开启，数据填充和LisView相同
 * 1.3.0        2020.12.25       新增PlayerView控件，封装播放操作
 *                               CarouselView新增：carouselByIndex，轮播到指定index
 *                               修复NoticeView不需要跑马灯时，依旧执行
 *                               优化NoticeView的轮播效果
 *                               log_view的默认lineHeight改为16
 * 1.3.1        2021.07.01       PlayerView新增setStbType
 *                               修改版本号
 *                               将setBuildViewItem去除，改为setAdapter写法
 *              2021.07.06       修复NoticeView只能设置左对齐
 *              2021.07.12       新增playerView.isMute方法，是否静音，只对iptv播放器判断
 * 1.3.2        2021.12.03       播放器play方法支持指定坐标大小
 * 1.4.0        2022.03.23       新增Toast组件
 *                               支持多playerView调用
 *
 */

 var SpecialView = {
    version: "1.4.0（2022.03.23）"
}
console.log("SpecialView，版本号：" + SpecialView.version);
/**
 *
 * 基于ListView写的纵向轮播通知View
 * div必须要写overflow: hidden;无法上下滚动
 *
 * 去除冗余层级，首尾相接
 */
var NoticeView = {
    createNew: function (id) {
        var noticeView = ListView.createNew(id);
        noticeView.timer = null;//轮播timer
        noticeView.duration = 3;//切换间隔秒值
        noticeView.index = 0;//当前通知的位置
        noticeView.onItemChangeListener = null;
        noticeView.hasMarquee = true;//默认有跑马灯
        noticeView.isLoop = true;//如果需要首尾相接，isLoop必须是true
        noticeView.isCirculate = true;//默认首尾相接

        noticeView.isNotice = false;//是否轮播中

        noticeView.noticeData = [];//绑定的数据

        /**
         * 设置适配器
         */
        noticeView.setAdapter(function (idPrefix, index, data) {
            var height = noticeView.getHeight();
            var width = noticeView.getWidth();
            var className = noticeView.getDom().className;
            var div = '<div class="' + className + '" id="' + idPrefix + index + '" style="top: ' + (height * index) + 'px; left: 0px;">'
                + '<div class="' + className + '" id="' + idPrefix + "txt_" + index + '" style="top: 0px;left: 0px;">'
                + data
                + '</div>'
                + '</div>';
            return div;
        });

        noticeView.addNotice = function (noticeStr, data) {
            noticeView.data.push(noticeStr);
            noticeView.refresh();
            noticeView.noticeData.push(data);
        }

        /**
         * 开始轮播通知
         */
        noticeView.start = function () {
            if (!noticeView.data || noticeView.data.length <= 0) {
                return;
            }

            // if (!noticeView.itemViews || noticeView.itemViews.length <= 1) {
            //     noticeView.refresh();
            // }
            noticeView.isNotice = true;
            if (noticeView.hasMarquee) {
                setTimeout(function () {
                    noticeView.itemViews[noticeView.index].textView.marquee();
                }, 800);
            }
            if (noticeView.timer) {
                clearInterval(noticeView.timer);
            }

            noticeView.timer = setInterval(function () {
                if (!noticeView.itemViews || noticeView.itemViews.length <= 1) {
                    clearInterval(noticeView.timer);
                    return;
                }

                if (noticeView.isScrolling) {
                    return;
                }

                noticeView.itemViews[noticeView.index].textView.clearMarquee();

                if (noticeView.index >= noticeView.itemViews.length - 1) {
                    noticeView.index = 0;
                } else {
                    noticeView.index++;
                }

                noticeView.circulate();
                ListView.scrollVerticalToView(noticeView, noticeView.itemViews[noticeView.index]);

                if (noticeView.hasMarquee) {
                    setTimeout(function () {
                        noticeView.itemViews[noticeView.index].textView.marquee();
                    }, 800);
                }
                if (noticeView.onItemChangeListener) {
                    noticeView.onItemChangeListener(noticeView.index, noticeView.noticeData[noticeView.index]);
                }

            }, noticeView.duration * 1000);
        };

        /**
         * 停止轮播
         */
        noticeView.stop = function () {
            if (noticeView.timer) {
                clearInterval(noticeView.timer);
            }
            noticeView.isNotice = false;
        };

        /**
         * 清理内部数据
         */
        noticeView.clear = function () {
            noticeView.stop();
            noticeView.data = null;
            noticeView.noticeData = [];
            noticeView.setHtml("");
        };

        /**
         * 设置轮播监听
         * @param onItemChangeListener
         */
        noticeView.setOnItemChangeListener = function (onItemChangeListener) {
            noticeView.onItemChangeListener = onItemChangeListener;
        }

        return noticeView;
    }

};

/**
 * 图片轮播，横向
 * 必须写overflow:hidden
 * var carouselView = CarouselView.createNew(id) 创建
 * carouselView.addPic(pic,data) 添加图片绑定数据
 * carouselView.start() 开始轮播
 * carouselView.stop() 停止轮播
 * carouselView.setOnItemChangeListener(onItemChangeListener) 设置轮播切换监听
 * carouselView.duration = 10  改变切换间隔（单位：s）
 *
 * 去除冗余层级，增加首尾相接的效果
 */
var CarouselView = {

    createNew: function (id) {
        var carouselView = ListView.createNew(id);
        carouselView.timer = null;//轮播timer
        carouselView.duration = 3;//轮播间隔秒值
        carouselView.index = 0;//当前图片的位置
        carouselView.onItemChangeListener = null;//轮播监听
        carouselView.isCarousel = false;//是否轮播中
        carouselView.carouselData = [];//绑定的数据

        carouselView.scrollSpeed = 1;//滚动速度

        carouselView.orientation = 1;//横向，如果需要实现纵向，则需要重写适配器buildViewItem
        carouselView.isLoop = true;//首尾相接效果
        carouselView.isCirculate = true;//首尾相接效果

        /**
         * 设置适配器
         */
        carouselView.setAdapter(function (idPrefix, index, data) {
            var height = carouselView.getHeight();
            var width = carouselView.getWidth();
            var div = '<img id="' + idPrefix + index + '" src="' + data + '" ' +
                'style="position: absolute; left: ' + (width * index) + 'px; top: 0px; text-align: center; overflow: hidden; width: ' + width + 'px; height: ' + height + 'px;"/>';
            return div;
        });
        /**
         * 增加轮播图片
         * @param pic
         * @param data
         */
        carouselView.addPic = function (pic, data) {
            carouselView.data.push(pic);
            carouselView.refresh();
            carouselView.carouselData.push(data);
        };

        /**
         * 开始轮播
         */
        carouselView.start = function () {
            if (!carouselView.itemViews || carouselView.itemViews.length <= 1) {
                return;
            }

            carouselView.isCarousel = true;
            if (carouselView.timer) {
                clearInterval(carouselView.timer);
            }

            carouselView.timer = setInterval(function () {
                if (!carouselView.itemViews || carouselView.itemViews.length <= 1) {
                    clearInterval(carouselView.timer);
                    return;
                }

                if (carouselView.getDom() == null) {
                    return;
                }

                if (carouselView.isScrolling) {
                    return;
                }

                if (carouselView.index >= carouselView.itemViews.length - 1) {
                    carouselView.index = 0;
                } else {
                    carouselView.index++;
                }
                // console.log("carouselView.index:"+carouselView.index);
                carouselView.carouselByIndex(carouselView.index);

            }, carouselView.duration * 1000);
        }

        /**
         * 轮播到指定index
         * @param index 轮播当前index
         */
        carouselView.carouselByIndex = function (index) {
            carouselView.index = index;
            carouselView.circulate();
            ListView.scrollHorizontalToView(carouselView, carouselView.itemViews[index]);
            if (carouselView.onItemChangeListener) {
                carouselView.onItemChangeListener(index, carouselView.carouselData[index]);
            }
        }

        /**
         * 停止轮播
         */
        carouselView.stop = function () {
            if (carouselView.timer) {
                clearInterval(carouselView.timer);
            }

            carouselView.isCarousel = false;
        }

        /**
         * 清除数据
         */
        carouselView.clear = function () {
            carouselView.stop();
            carouselView.data = null;
            carouselView.carouselData = [];
            carouselView.setHtml("");
        }

        /**
         * 获取当前轮播位置
         * @returns {number}
         */
        carouselView.getIndex = function () {
            return carouselView.index;
        }

        /**
         * 获取当前轮播位的数据
         * @returns {*}
         */
        carouselView.getCurrentData = function () {
            return carouselView.carouselData[carouselView.index];
        }

        /**
         * 设置轮播监听
         * @param onItemChangeListener
         * position:序号
         * data:轮播到的数据
         */
        carouselView.setOnItemChangeListener = function (onItemChangeListener) {
            carouselView.onItemChangeListener = onItemChangeListener;
        }

        return carouselView;

    }

};

var LogView = {
    createNew: function (id) {
        var logView = ListView.createNew(id);
        logView.hide();
        logView.lineHeight = 16;//单行高度
        logView.hasMarquee = true;//最后一行是否跑马灯

        /**
         * 设置适配器
         */
        logView.setAdapter(function (idPrefix, index, data) {
            var height = logView.lineHeight;
            var logLeft = parseInt((logView.lineHeight * 0.8) * 7 + "");
            var width = logView.getDom().offsetWidth;
            var logWidth = width - logLeft;
            var single = index % 2 == 0;

            var color = "#00ff00";
            if (data.level == "i") {
                color = "#00ff00";
            } else if (data.level == "w") {
                color = "#ffff00";
            } else {
                color = "#ff0000";
            }

            var style = 'position: absolute; '
                + 'top: 0px; text-align: left; '
                + 'overflow: hidden; white-space: nowrap; '
                + 'line-height: ' + height + 'px; width: ' + logWidth + 'px;'
                + 'height:' + height + 'px;'
                + 'font-size: ' + parseInt(logView.lineHeight * 0.8 + "") + 'px;'
                + 'background:' + (single ? '#eeeeee;' : 'gray;');
            +'color:' + color + ';';

            var div = '<div id="' + idPrefix + index + '" style="position: absolute; top: ' + (height * index) + 'px;overflow: hidden;height: ' + height + 'px; width: ' + width + 'px;">'
                + '<div style="' + style + 'color:black;' + '">' + data.timeStr + '</div>'
                + '<div id="' + idPrefix + "txt_" + index + '" style="' + style
                + 'left:' + logLeft + 'px;' + 'color:' + color + ';' + '">'
                + data.log
                + '</div>'
                + '</div>';
            return div;
        });

        /**
         * 信息级别打印，字体绿色
         * @param log
         */
        logView.i = function (log) {
            var logMessage = {
                level: "i",
                timeStr: logView.formatDate(),
                log: log
            };
            logView.addLog(logMessage);
        };

        /**
         * 警告级别打印，字体黄色
         * @param log
         */
        logView.w = function (log) {
            var logMessage = {
                level: "w",
                timeStr: logView.formatDate(),
                log: log
            };
            logView.addLog(logMessage);
        };

        /**
         * 异常级别打印，字体红色
         * @param log
         */
        logView.e = function (log) {
            var logMessage = {
                level: "e",
                timeStr: logView.formatDate(),
                log: log
            };
            logView.addLog(logMessage);
        };

        logView.addLog = function (logMessage) {
            if (!logView.isShowing()) {
                return;
            }

            var maxNum = Math.ceil(logView.getDom().offsetHeight / logView.lineHeight);
            if (logView.data.length > maxNum + 1) {
                var data = logView.data.slice(logView.data.length - maxNum - 1, logView.data.length);

                logView.clear();
                logView.data = data;
                logView.data.push(logMessage);
            } else {
                logView.data.push(logMessage);
            }


            logView.refresh();

            if (logView.itemViews.length > maxNum + 1) {
                if (logView.scrollAnimation) {
                    logView.scrollAnimation = false;
                    ListView.scrollVerticalToView(logView, logView.itemViews[logView.itemViews.length - 2]);
                    logView.scrollVertical(-logView.lineHeight);
                    logView.scrollAnimation = true;
                } else {
                    logView.scrollAnimation = false;
                    ListView.scrollVerticalToView(logView, logView.itemViews[logView.itemViews.length - 2]);
                    logView.scrollVertical(-logView.lineHeight);
                }
            }


            ListView.scrollVerticalToView(logView, logView.itemViews[logView.itemViews.length - 1]);

            logView.itemViews[logView.itemViews.length - 1].textView.marquee();
        };

        logView.hide = function () {
            logView.getDom().style.display = "none";
            logView.bindData([]);
        }

        logView.formatDate = function () {
            var hour = "";
            var minute = "";
            var second = "";
            var mseconds = "";
            var date = new Date();
            hour = date.getHours();
            minute = date.getMinutes();
            second = date.getSeconds();
            mseconds = date.getMilliseconds();

            hour = hour.toString();
            hour = hour.length < 2 ? "0" + hour : hour;
            minute = minute.toString();
            minute = minute.length < 2 ? "0" + minute : minute;
            second = second.toString();
            second = second.length < 2 ? "0" + second : second;
            mseconds = mseconds.toString();
            if (mseconds.length < 2) {
                mseconds = "00" + mseconds;
            } else if (mseconds.length < 3) {
                mseconds = "0" + mseconds;
            }

            var format = "HH:mm:ss SSSS";

            format = format.replace("HH", hour);
            format = format.replace("mm", minute);
            format = format.replace("ss", second);
            format = format.replace("SSSS", mseconds);

            return format;
        };

        return logView;
    }
};

/**
 * 旋转控件
 * 自动旋转
 * 基于listView
 * @type {{createNew: (function(*=): *|{})}}
 */
var RotationView = {
    createNew: function (id) {
        var rotationView = ListView.createNew(id);

        rotationView.isRotating = false;
        rotationView.timer = null;
        rotationView.duration = 1;//轮播间隔秒值

        rotationView.isLoop = true;
        rotationView.isCirculate = true;

        rotationView.currentIndex = 0;//可见顶部的下标

        rotationView.start = function () {
            if (rotationView.isRotating) {
                return;
            }

            if (rotationView.timer) {
                clearTimeout(rotationView.timer);
            }

            if (!rotationView.data || rotationView.data.length <= 0) {
                return;
            }
            rotationView.isRotating = true;
            rotationView.timer = setInterval(function () {
                rotationView.currentIndex++;
                rotationView.currentIndex = rotationView.currentIndex % rotationView.data.length;
                rotationView.rotateByIndex(rotationView.currentIndex);
            }, rotationView.duration * 1000);
        };

        rotationView.stop = function () {
            rotationView.isRotating = false;
            if (rotationView.timer) {
                clearTimeout(rotationView.timer);
            }
        };

        rotationView.rotateByIndex = function (index) {
            if (!rotationView.itemViews || rotationView.itemViews.length <= 1) {
                clearInterval(rotationView.timer);
                return;
            }

            if (rotationView.getDom() == null) {
                return;
            }

            if (rotationView.isScrolling) {
                return;
            }

            // console.log("rotationView.index:"+rotationView.index);
            rotationView.circulate();
            if (rotationView.orientation == View.horizontal) {
                View.scrollHorizontalToView(rotationView, rotationView.itemViews[index], View.scrollStart);
            } else {
                View.scrollVerticalToView(rotationView, rotationView.itemViews[index], View.scrollStart);
            }

        };

        return rotationView;
    }
};

/**
 * 封装播放器的播放控件，简化播放器的使用
 * 具体的使用和player使用相似，信息的获取和设置、动作都是在player上操作
 * @type {{createNew: (function(*=): *|{})}}
 */
var PlayerView = {

    createNew: function (id) {
        var playerView = View.createNew(id);
        if (!window["Player"]) {
            console.log("error:播放器js文件未导入");
        }

        playerView.player = Player.createNew();

        playerView.cell = 5;//快进快退的单位时间

        playerView.onChangeTimeListener = null;
        playerView.changeDuration = 500;//快进快退的生效时间
        playerView.changeTime = -1;//-1表示未快进、快退
        playerView.changeTimer = null;//快进、快退的timer

        playerView.onPlayEventListener = null;
        playerView.onVolumeChangeListener = null;
        playerView.onPositionChangeListener = null;

        /**
         * 播放
         * @param playUrl
         * @param startTime
         */
        playerView.play = function (playUrl, startTime, left, top, width, height) {
            if(typeof (left) == "undefined"){
                var position = AreaView.getAbsolutePosition(playerView.id)//获取dom的宽高及left、top
                left = position.left;
                top = position.top;
                width = playerView.getWidth();
                height = playerView.getHeight();
            }

            playerView.player.setOnPlayEventListener(playerView.onPlayEventListener);
            playerView.player.setOnVolumeChangeListener(playerView.onVolumeChangeListener);
            playerView.player.setOnPositionChangeListener(playerView.onPositionChangeListener);

            playerView.player.play(playUrl, startTime, left, top, width, height);
        };

        /**
         * 播放
         * 新疆电信播放方式
         * @param playUrl
         * @param startTime
         */
        playerView.playByCode = function (code, epgdomain, startTime, left, top, width, height) {
            if(typeof (left) == "undefined"){
                var position = AreaView.getAbsolutePosition(playerView.id)//获取dom的宽高及left、top
                left = position.left;
                top = position.top;
                width = playerView.getWidth();
                height = playerView.getHeight();
            }

            playerView.player.playByCode(code, epgdomain, startTime, left, top, width, height);
        };

        /**
         * 快进到
         * @param startTime
         */
        playerView.playByTime = function (time) {
            if (time >= playerView.player.getDuration()) {
                time = playerView.player.getDuration() - 1;
            }

            playerView.player.playByTime(time);
        };

        /**
         * 点击
         */
        playerView.onClickListener = function () {
            if (playerView.isPlaying()) {
                playerView.pause();
            } else {
                playerView.resume();
            }
        };

        /**
         * 按右
         */
        playerView.nextRight = function () {
            if (playerView.player.getDuration() <= 0) {
                return;
            }
            if (playerView.changeTime < 0) {//正常播放到快进快退的第一次操作
                playerView.changeTime = playerView.player.getCurrentPosition();
            }

            playerView.changeTime = (playerView.changeTime - 0) + (playerView.cell - 0);
            if (playerView.changeTime >= playerView.player.getDuration()) {
                playerView.changeTime = playerView.player.getDuration() - 5;
            }

            if (playerView.onChangeTimeListener) {
                playerView.onChangeTimeListener(playerView.changeTime, playerView.player.getDuration());
            }

            if (playerView.changeTimer) {
                clearTimeout(playerView.changeTimer);
            }

            playerView.changeTimer = setTimeout(function () {
                playerView.playByTime(playerView.changeTime);
                playerView.changeTime = -1;
            }, playerView.changeDuration);


        };

        /**
         * 按左
         */
        playerView.nextLeft = function () {
            if (playerView.player.getDuration() <= 0) {
                return;
            }
            if (playerView.changeTime < 0) {//正常播放到快进快退的第一次操作
                playerView.changeTime = playerView.player.getCurrentPosition();
            }

            playerView.changeTime = (playerView.changeTime - 0) - (playerView.cell - 0);

            if (playerView.changeTime <= 0) {
                playerView.changeTime = 0;
            }

            if (playerView.onChangeTimeListener) {
                playerView.onChangeTimeListener(playerView.changeTime, playerView.player.getDuration());
            }

            if (playerView.changeTimer) {
                clearTimeout(playerView.changeTimer);
            }

            playerView.changeTimer = setTimeout(function () {
                playerView.playByTime(playerView.changeTime);
                playerView.changeTime = -1;
            }, playerView.changeDuration);
        };

        /**
         * 重新播放
         */
        playerView.replay = function () {
            playerView.player.replay();
        };

        /**
         * 获取当前进度
         * @return {number|void}
         */
        playerView.getCurrentPosition = function () {
            return playerView.player.getCurrentPosition();
        };

        /**
         * 获取当前视屏总时长
         * @return {获取当前视屏总时长|number|*}
         */
        playerView.getDuration = function () {
            return playerView.player.getDuration();
        };

        /**
         * 暂停
         */
        playerView.pause = function () {
            playerView.player.pause();
        };

        /**
         * 暂停后，继续播放
         */
        playerView.resume = function () {
            playerView.player.resume();
        };

        /**
         * 停止
         */
        playerView.stop = function () {
            playerView.player.stop();
        };

        /**
         * 销毁播放器
         */
        playerView.destroy = function () {
            playerView.player.destroy();
        };

        /**
         * 改变静音状态，静音->正常；正常->静音
         */
        playerView.setMuteFlag = function () {
            playerView.player.setMuteFlag();
        };

        /**
         * 是否静音
         * @return {boolean}
         */
        playerView.isMute = function () {
            var mute = false;
            if (playerView.player.mp) {
                mute = playerView.player.mp.getMuteFlag() == 1;
            }
            return mute;
        }

        /**
         * 获取是否正在播放
         */
        playerView.isPlaying = function () {
            return playerView.player.isPlaying;
        };

        /**
         * 获取播放信息
         */
        playerView.getPlayInfo = function () {
            return playerView.player.playInfo;
        };

        /**
         * 获取当前音量
         */
        playerView.getVolume = function () {
            return playerView.player.nowVolume;
        };

        playerView.setStbType = function (stbType) {
            playerView.player.stbType = stbType;
        };

        /**
         * 设置进度变化监听器
         * @param onPositionChangeListener
         */
        playerView.setOnPositionChangeListener = function (onPositionChangeListener) {
            playerView.onPositionChangeListener = onPositionChangeListener;
            // playerView.player.setOnPositionChangeListener(onPositionChangeListener);
        };

        /**
         * 设置音量变化监听器
         * @param onVolumeChangeListener
         */
        playerView.setOnVolumeChangeListener = function (onVolumeChangeListener) {
            playerView.onVolumeChangeListener = onVolumeChangeListener;
            // playerView.player.setOnVolumeChangeListener(onVolumeChangeListener);
        };

        /**
         * 设置播放事件监听器
         * @param onPlayEventListener
         */
        playerView.setOnPlayEventListener = function (onPlayEventListener) {
            playerView.onPlayEventListener = onPlayEventListener;
            // playerView.player.setOnPlayEventListener(onPlayEventListener);
        };

        /**
         * 设置播放快进快退到变化监听器
         * @param onPlayEventListener
         * 参数 time 现在快进的时间
         */
        playerView.setOnChangeTimeListener = function (onChangeTimeListener) {
            playerView.onChangeTimeListener = onChangeTimeListener;
        };

        return playerView;
    }


};

var Toast = {
    toast:null,

    short:1,
    normal:2,
    long:3,

    top:2,
    middle:1,
    bottom:0,

    list:[],

    timer:null,

    createNew:function () {
        var toast = View.createNew("toast");

        toast.locate = Toast.bottom;

        toast.dom = toast.getDom();
        if(!toast.dom){
            toast.dom = View.parseDom('<div view-1bda80 class="toast"></div>')[0];
            toast.bgDom = View.parseDom('<div view-1bda80 class="bg"><img src=""/></div>')[0];
            toast.txtDom = View.parseDom('<div view-1bda80 class="txt"></div>')[0];
            toast.dom.appendChild(toast.bgDom);
            toast.dom.appendChild(toast.txtDom);
        }else{
            toast.hide();
        }

        var fatherShow = toast.show;

        toast.isShowing = function (){
            var isS = false;
            if(document.body.contains(toast.dom)){
                var display = toast.getDom().style.display;
                var visible = toast.getDom().style.visibility;
                isS = display != "none" && visible != "hidden";
            }

            return isS;
        }

        toast.hide = function (){
            toast.getDom().style.visibility = "";
            toast.getDom().style.display = "none";

            if(Toast.timer){
                clearTimeout(Toast.timer);
            }
        }

        toast.show = function (info){
            if(!document.body.contains(toast.dom)){
                document.body.appendChild(toast.dom);
            }
            fatherShow();
            toast.txtDom.innerText = info;
            var txtWidth = View.getViewWidth(toast.txtDom);

            var height = toast.getHeight();

            width = txtWidth / 0.8;
            toast.bgDom.style.width = width + "px";
            toast.getDom().style.width = width + "px";
            toast.txtDom.style.left = width * 0.1 + "px";

            var bodyWidth = View.getViewWidth(document.body);
            var bodyHeight = View.getViewHeight(document.body);

            if(bodyWidth == 0){
                bodyWidth = 1280;//默认720p
            }

            if(bodyHeight == 0){
                bodyHeight = 720;
            }

            var left = (bodyWidth - width) / 2 ;
            toast.getDom().style.left = left + "px";

            var top = bodyHeight * 0.8 - height / 2;//默认底部
            if(toast.locate == Toast.top){
                top = bodyHeight * 0.2 - height / 2;
            }else if(toast.locate == Toast.middle){
                top = (bodyHeight - height) / 2;
            }

            toast.getDom().style.top = top + "px";
        }

        toast.getDom = function (){
            return toast.dom;
        }

        return toast;
    },

    show:function (info,duration,locate){
        var toast = Toast.toast;
        if(!toast){
            toast = Toast.createNew();
            Toast.toast = toast;
        }

        if(!duration){
            duration = Toast.normal;
        }

        if(!locate){
            locate = Toast.bottom;
        }

        if(!document.body.contains(toast.dom) || !toast.isShowing()){
            toast.locate = locate;
            toast.show(info);
        }else{
            Toast.list.push({info:info,duration:duration,locate:locate});
            return;
        }

        Toast.timer = setTimeout(function (){
            toast.hide();
            var list = Toast.list;
            if(!list || list.length == 0){
                return;
            }
            setTimeout(function (){
                var obj = list.pop();
                Toast.show(obj.info,obj.duration,obj.locate);
            },200);

        },duration * 1000);
    },


}