/**
 * 目前兼容三种播放
 * 1.iptv机顶盒原生播放器,需要使用 view1.0.0 之后的版本
 * 2.自定义Android播放器，需要对应的app壳子
 * 3.基于videojs的播放器，目前已兼容谷歌浏览器，
 *      默认静音，其他浏览器兼容情况未知，
 *      目前不支持ts格式的资源
 *      该播放器主要是为了方便功能调式，不能做其他播放器的兼容
 *      Q:音量加；W:音量减；E:静音
 *
 *  主要的属性、方法、监听器
 *  属性：
 *      var volume = player.nowVolume;//音量，Android端音量被原生处理
 *      var isPlaying = player.isPlaying;//是否正在播放
 *      var playInfo = player.playInfo;//播放信息对象，{playUrl:"",left:0,top:0,width:0,height:0}
 *      var totalTime = player.duration;//总时长，单位：秒
 *      var position = player.currentPosition;//当前进度，单位：秒
 *  方法：
 *      player.play(playUrl, startTime, left, top, width, height);//播放
 *      player.replay();//重新播放
 *      player.playByTime(time);//跳转到指定进度播放
 *      player.getCurrentPosition();//获取当前进度
 *      player.getDuration();//获取当前视屏总时长
 *      player.pause();//暂停
 *      player.resume()//暂停后，继续播放
 *      player.stop();//停止
 *      player.destroy();//销毁播放器
 *      player.setMuteFlag();//改变静音状态，静音->正常；正常->静音
 *
 *   设置监听器：
 *      setOnPositionChangeListener(listener);//设置进度改变监听，listener(position,duration)
 *      setOnVolumeChangeListener(listener);//音量变化监听listener(volume)
 *      setOnPlayEventListener(listener);//播放事件监听listener = {};
 *
 *   其他方法及属性不建议外部使用
 *
 *
 * version       data            description
 * 1.0.0        2020.09.07       新增webPlayer,完善其他两个播放器的方法
 *              2020.09.27       修复 销毁播放器时没有彻底释放
 * 1.1.0        2020.12.23       兼容iframe获取播放器参数，并为此新增playByCode方法，暂时只为新疆电信提供,实际上线并未使用
 *              2021.01.14       适配兼容新疆电信 华为EC6108V9 默认静音
 *              2021.01.27       兼容一些盒子获取播放进度和playByTime是String的问题
 *              2021.04.07       playByCode经陕西电信局限看验证可用
 * 1.1.1        2021.07.01       新增player.stbType，盒子型号
 *                               新增onPlayEventListener.onPlayByTime，快进监听
 *
 */


/**
 * 基于河北电竞2020.08.29版本优化修改
 * @type {{createNew: Player.createNew}}
 */

var Player = {

    version: "1.1.1",

    createNew: function () {
        try {
            var player = {};
            player.mp = new MediaPlayer();//播放器本尊
            player.instanceId = player.mp.getNativePlayerInstanceID();//播放器对应的id
            player.nowVolume = player.mp.getVolume();//当前音量
            player.preVolume = 5;//单次音量变化幅度
            player.totalVolume = 100;//总音量
            player.isPlaying = false;//播放中

            player.playInfo = {
                playUrl: "",
                left: 0,
                top: 0,
                width: 0,
                height: 0
            };

            /**
             * 当play_model，部分盒子 该状态更新不及时，所以无法使用这个判定播放器状态
             * 0->2:表示开始播放 调用player.onPlayEventListener.onPlayStart();
             * 2->2:跳转到指定进度
             * 2->1:暂停
             * 1->2:继续播放
             * *->0:停止 调用player.onPlayEventListener.onPlayStop();
             *
             * 切换视频时，状态会先切到停止，然后在播放
             * 基于之前踩的坑，有些播放器不会停止，造成切换视频异常，这时需要主动停止播放器
             */
            player.play_mode = 0;//播放模式 0：停止；1：暂停；2：播放

            player.duration = 0;//总时长，单位：秒
            player.currentPosition = 0;//当前进度，单位：秒
            player.timer = null;//刷新进度timer

            player.isOnStart = false;//是否开始播放

            player.stbType = "";//盒子型号

            /**
             * @param position 当前进度
             * @param duration 总时长
             * 播放进度变化监听
             */
            player.onPositionChangeListener = null;

            /**
             * @param volume 改变后的音量
             * 音量变化监听
             */
            player.onVolumeChangeListener = null;

            /**
             * 播放事件监听
             */
            player.onPlayEventListener = {
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

                },

                onPlayByTime: function (position) {

                }
            };

            /**
             * 播放视频
             * @param playUrl 播放地址
             * @param startTime 开始时间
             * @param left
             * @param top
             * @param width
             * @param height
             */
            player.play = function (playUrl, startTime, left, top, width, height) {
                if (player.mp == null) {//播放器未创建或已回收
                    return;
                }
                player.playInfo = {//缓存播放信息
                    playUrl: playUrl,
                    left: left,
                    top: top,
                    width: width,
                    height: height
                };
                var json = player.buildPlayJson(playUrl);
                player.initMediaPlay(left, top, width, height, json);

                //调用播放器开始播放的方法
                player.mp.playFromStart();

                setTimeout(function () {//此处为兼容
                    player.mp.playByTime(1, startTime, 1);
                }, 200);


                player.startRefreshCurrentPosition();
                player.isPlaying = true;

                player.isOnStart = false;
            };

            /**
             * 相同的内，位置，从头播
             */
            player.replay = function () {
                if (player.playInfo.playUrl) {
                    player.play(player.playInfo.playUrl,
                        0,
                        player.playInfo.left, player.playInfo.top,
                        player.playInfo.width, player.playInfo.height);
                }else if (player.playInfo.code) {
                    player.playByCode(player.playInfo.code, player.playInfo.epgdomain,
                        0,
                        player.playInfo.left, player.playInfo.top,
                        player.playInfo.width, player.playInfo.height);
                }

            };

            /**
             * 使用iframe获取播放字符串的方式进行播放
             * 地区：新疆电信
             * @param code
             * @param epgdomain 域名
             * @param startTime
             * @param left
             * @param top
             * @param width
             * @param height
             */
            player.playByCode = function (code, epgdomain, startTime, left, top, width, height) {
                if (player.mp == null) {//播放器未创建或已回收
                    return;
                }
                player.playInfo = {//缓存播放信息
                    code: code,
                    epgdomain:epgdomain,
                    left: left,
                    top: top,
                    width: width,
                    height: height
                };
                var callback = function(data){
                    var json = data;
                    player.initMediaPlay(left, top, width, height, json);

                    //调用播放器开始播放的方法
                    player.mp.playFromStart();

                    setTimeout(function () {//此处为兼容
                        player.mp.playByTime(1, startTime, 1);
                    }, 300);


                    player.startRefreshCurrentPosition();
                    player.isPlaying = true;

                    player.isOnStart = false;
                }
                IframePlayer.getSingleMedia(code, epgdomain, left, top, width, height, callback);

            };

            /**
             * 跳到指定位置播放
             * @param time
             */
            player.playByTime = function (time) {
                time = time - 0;//防止time类型为string
                player.mp.playByTime(1, time, 1);
                if(!player.isPlaying){
                    player.resume();
                }
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayByTime) {
                    player.onPlayEventListener.onPlayByTime(time);
                }
            };

            /**
             * 获取当前播放进度，单位：秒
             * @return {number}
             */
            player.getCurrentPosition = function () {
                return player.currentPosition - 0;//强转类型为number
            };

            /**
             * 获取当前视频总时长
             * @return {number|*}
             */
            player.getDuration = function () {
                player.duration = player.mp.getMediaDuration() - 0;
                return player.duration;
            };

            /**
             * 暂停
             */
            player.pause = function () {
                player.isPlaying = false;
                player.mp.pause();
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayPause) {
                    player.onPlayEventListener.onPlayPause();
                }
            };

            /**
             * 继续
             */
            player.resume = function () {
                player.isPlaying = true;
                player.mp.resume();
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayResume) {
                    player.onPlayEventListener.onPlayResume();
                }
            };

            player.stop = function () {
                player.isPlaying = false;
                player.mp.stop();
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayStop) {
                    player.onPlayEventListener.onPlayStop();
                }
            };

            /**
             * 销毁播放器
             */
            player.destroy = function () {
                if (player.timer) {
                    clearTimeout(player.timer);
                }
                player.isPlaying = false;
                player.mp.stop();	//停止播放
                //释放终端 MediaPlayer 的对象，结束对应MediaPlayer 的生命周期。
                setTimeout(function () {
                    player.mp.releaseMediaPlayer(player.instanceId);
                    player.mp = null;
                }, 10);
            };

            /**
             * 刷新进度的方法，不在外部调用
             */
            player.startRefreshCurrentPosition = function () {
                if (player.timer) {
                    clearTimeout(player.timer);
                }
                player.timer = setInterval(function () {
                    var currentPosition = player.mp.getCurrentPlayTime() - 0;
                    if (player.currentPosition == currentPosition) {
                        return;
                    }
                    player.currentPosition = currentPosition;
                    var duration = player.getDuration();
                    if (duration <= 0) {//还未载入
                        return;
                    }

                    if (!player.isOnStart) {
                        player.isOnStart = true;
                        if (player.onPlayEventListener && player.onPlayEventListener.onPlayStart) {
                            player.onPlayEventListener.onPlayStart();
                        }
                    }

                    if (player.onPositionChangeListener) {
                        player.onPositionChangeListener(player.currentPosition, duration);
                    }
                }, 1000);
            };

            /**
             * 增加音量
             */
            player.volumeUp = function () {
                player.nowVolume = player.mp.getVolume();
                player.nowVolume += player.preVolume;
                if (player.nowVolume >= player.totalVolume) {
                    player.nowVolume = player.totalVolume;
                }
                player.mp.setVolume(player.nowVolume);

                if (player.onVolumeChangeListener) {
                    player.onVolumeChangeListener(player.nowVolume);
                }
            };

            /**
             * 音量减
             */
            player.volumeDown = function () {
                player.nowVolume = player.mp.getVolume();
                player.nowVolume -= player.preVolume;
                if (player.nowVolume <= 0) {
                    player.mp.setMuteFlag(1);
                    player.nowVolume = 0;
                }
                player.mp.setVolume(player.nowVolume);

                if (player.onVolumeChangeListener) {
                    player.onVolumeChangeListener(player.nowVolume);
                }
            };

            /**
             * 静音
             */
            player.setMuteFlag = function () {
                var muteFlag = player.mp.getMuteFlag();
                if (muteFlag == 1) {//静音
                    player.mp.setMuteFlag(0);//关闭静音
                } else {
                    player.mp.setMuteFlag(1);
                }

                if (player.onVolumeChangeListener) {
                    muteFlag = player.mp.getMuteFlag();
                    player.onVolumeChangeListener(muteFlag == 1 ? 0 : player.nowVolume);
                }
            };

            /**
             * 设置进度变化监听器
             * @param onPositionChangeListener
             */
            player.setOnPositionChangeListener = function (onPositionChangeListener) {
                player.onPositionChangeListener = onPositionChangeListener;
            };

            /**
             * 设置音量变化监听器
             * @param onVolumeChangeListener
             */
            player.setOnVolumeChangeListener = function (onVolumeChangeListener) {
                if (!player.onVolumeChangeListener) {
                    var muteFlag = player.mp.getMuteFlag();
                    if (muteFlag == 1) {//静音
                        onVolumeChangeListener(0);
                    } else {
                        onVolumeChangeListener(player.nowVolume);
                    }
                }
                player.onVolumeChangeListener = onVolumeChangeListener;
            };

            /**
             * 设置播放事件监听器
             * @param onPlayEventListener
             */
            player.setOnPlayEventListener = function (onPlayEventListener) {
                player.onPlayEventListener = onPlayEventListener;
            };

            /**
             * 组装播放器参数
             * @param playurl
             * @return {string}
             */
            player.buildPlayJson = function (playurl) {
                //拼接json
                var json = '[{mediaUrl:"' + playurl + '",';
                json += 'mediaCode:"code1",';
                json += 'mediaType:2,';
                json += 'audioType:1,';
                json += 'videoType:1,';
                json += 'streamType:1,';
                json += 'drmType:1,';
                json += 'fingerPrint:0,';
                json += 'copyProtection:1,';
                json += 'allowTrickmode:1,'; //允许快进快退
                json += 'startTime:0,';
                json += 'endTime:20000,';
                json += 'entryID:"jsonentry1"}]';
                return json;
            };

            /**
             * 初始化播放器
             * @param left
             * @param top
             * @param width
             * @param height
             */
            player.initMediaPlay = function (left, top, width, height,json) {
                var playListFlag = 0;
                var videoDisplayMode = 0;
                var muteFlag = 0;
                var subtitleFlag = 0;
                var videoAlpha = 0;
                var cycleFlag = 0;
                var randomFlag = 0;
                var autoDelFlag = 0;
                var useNativeUIFlag = 0;
                player.mp.initMediaPlayer(player.instanceId, playListFlag, videoDisplayMode, height, width, left, top, muteFlag, useNativeUIFlag, subtitleFlag, videoAlpha, cycleFlag, randomFlag, autoDelFlag);
                player.mp.setNativeUIFlag(0);

                player.mp.setMuteUIFlag(0);//设置是否显示默认静音UI

                player.mp.setAudioVolumeUIFlag(0);//设置是否显示默认音量UI

                player.mp.setAudioTrackUIFlag(0);//设置音轨的本地UI显示标志 0:不允许 1：允许

                player.mp.setProgressBarUIFlag(0);//设置是否显示默认滚动条

                player.mp.setChannelNoUIFlag(0);//设置是否显示默认频道号UI
                //设置视频是否循环播放


                player.mp.setAllowTrickmodeFlag(0);//是否开启播放器暂停时移功能

                if ((width == 1280 && height == 720) || (width == 1920 && height == 1080)) {
                    player.mp.setVideoDisplayMode(1);//视频显示模式 全屏模式设置为1，0为窗口
                } else {
                    player.mp.setVideoDisplayArea(left, top, width, height);//窗口模式设置属性
                    player.mp.setVideoDisplayMode(0);//视频显示模式 全屏模式设置为1，0为窗口
                }

                //刷新视频显示模式
                player.mp.refreshVideoDisplay();
                //是单播还是组播
                player.mp.setSingleOrPlaylistMode(0);
                //为播放器加入播放字符串
                player.mp.setSingleMedia(json);
                player.mp.setCycleFlag(1);//1单次播放 0循环播放

                player.initVolume();		//初始化音量
            };
            /**
             * 初始化播放音量
             */
            player.initVolume = function () {
                var muteFlag = player.mp.getMuteFlag();
                if (muteFlag == 1) {//静音
                    player.mp.setMuteFlag(1);
                } else {
                    player.mp.setMuteFlag(0);//适配兼容新疆电信 华为EC6108V9 默认静音
                    if (player.nowVolume >= player.totalVolume) {
                        player.nowVolume = player.totalVolume;
                    }

                    player.mp.setVolume(player.nowVolume);
                }

            }

            /**
             * 播放开始监听
             */
            View.key.key_player_event = function (eventJson) {
                var typeStr = eventJson.type;
                switch (typeStr) {
                    case "EVENT_TVMS":
                    case "EVENT_TVMS_ERROR":
                        return;
                    case "EVENT_MEDIA_ERROR":
                        player.keyMediaErrorEvent();
                        return;
                    case "EVENT_MEDIA_END":
                        player.keyMediaEndEvent();
                        return;
                    case "EVENT_PLTVMODE_CHANGE":
                        return;
                    case "EVENT_PLAYMODE_CHANGE":
                        //播放模式改变，在switch外处理
                        break;
                    case "EVENT_MEDIA_BEGINING":
                        player.keyMediaBeginEvent();
                        return;
                    case "EVENT_GO_CHANNEL":
                        return;
                    default:
                        break;
                }
                player.play_mode = eventJson.new_play_mode;
                var old_play_mode = eventJson.old_play_mode;

                //log_view.e("new_play_mode:" + player.play_mode + ",old_play_mode:" + old_play_mode);

                if (player.play_mode == 2 && old_play_mode == 0) {//开始播放
                    if (!player.isOnStart) {
                        player.isOnStart = true;
                        if (player.onPlayEventListener && player.onPlayEventListener.onPlayStart) {
                            player.onPlayEventListener.onPlayStart();
                        }
                    }
                } else if (player.play_mode == 0 && old_play_mode == 2) {//停止播放

                }
            };

            /**
             * 播放开始监听
             */
            player.keyMediaBeginEvent = function () {
                if (!player.isOnStart) {
                    player.isOnStart = true;
                    if (player.onPlayEventListener && player.onPlayEventListener.onPlayStart) {
                        player.onPlayEventListener.onPlayStart();
                    }
                }
            };

            /**
             * 播放结束监听
             */
            player.keyMediaEndEvent = function () {
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayComplete) {
                    player.onPlayEventListener.onPlayComplete();
                }
            };

            /**
             * 播放异常监听
             */
            player.keyMediaErrorEvent = function () {
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayError) {
                    player.onPlayEventListener.onPlayError();
                }
            };

            /**
             * 音量加
             */
            View.key.key_volUp_event = function () {
                if (player) {
                    player.volumeUp();
                }
            };
            /**
             * 音量减
             */
            View.key.key_volDown_event = function () {
                if (player) {
                    player.volumeDown();
                }
            };

            /**
             * 静音键
             */
            View.key.key_mute_event = function () {
                if (player) {
                    player.setMuteFlag();
                }
            };

            return player;
        } catch (e) {
            var androidPlayer = AndroidPlayer.createNew();
            return androidPlayer;
        }

    }
}

/**
 * 新疆电信使用iframe获取播放字符串，基础播放器依旧是页面创建的MediaPlayer
 * @type {{}}
 */
var IframePlayer = {
    getSingleMedia: function (code, epgdomain, left, top, width, height, callback) {
        var url = IframePlayer.buildIframeUrl(code, epgdomain, left, top, width, height);

        var iframeId = "playerIframe";
        var dom = document.getElementById(iframeId);
        if(!dom){
            dom = document.createElement("iframe");
            dom.setAttribute("name","iframe");
            dom.setAttribute("frameborder","0");
            dom.setAttribute("scrolling","no");
            dom.zIndex = "-1";
            document.getElementsByTagName("body")[0].appendChild(dom);
        }
        dom.src = url;

        dom.onload = function () {
            dom.contentWindow.parent.focus();//主页面重新聚焦，避免页面无响应
            var mediaStr = "";
            try {
                mediaStr = dom.contentWindow.getMediastr(code);//如果code不对这里会报错
            } catch (error) {
                mediaStr = "";
                return;
            }
            callback(mediaStr);
        }

    },

    buildIframeUrl:function (code, epgdomain, left, top, width, height) {
        var host = "";//地址
        var platform = "";//平台
        var last = epgdomain.indexOf("/jsp/");
        if (last == -1) {
            last = epgdomain.lastIndexOf("/");
            host = epgdomain.substr(0,last);
            platform = "ZTE";
        } else {
            host = epgdomain.substr(0,last);
            platform = "HW";
        }
        var url = "";
        if (platform == "ZTE") {
            url = host + "/MediaService/SmallScreen";
        } else {
            url = host + "/MediaService/SmallScreen.jsp";
        }
        url += "?ContentID="+code +
            "&Left="+left+"&Top="+top +
            "&Width="+width+"&Height=" + height+
            "&CycleFlag=0&GetCntFlag=1";
        if (platform == "HW") {
            url += "&ReturnURL=" + encodeURIComponent(document.referrer);
        }
        return url;
    }
};

/**
 * Android 播放器，由内部开发的app
 * @type {{createNew: AndroidPlayer.createNew, player: null}}
 */
var AndroidPlayer = {

    player: null,

    createNew: function () {
        try {

            if (AndroidPlayer.player) {
                return AndroidPlayer.player;
            }

            var player = {};

            AndroidPlayer.player = player;

            player.isPlaying = marsee.isPlaying();//播放中

            player.duration = 0;//总时长，单位：秒
            player.currentPosition = 0;//当前进度，单位：秒
            player.timer = null;//刷新进度timer

            player.playInfo = {
                playUrl: "",
                left: 0,
                top: 0,
                width: 0,
                height: 0
            };

            player.stbType = "";//盒子型号

            /**
             * @param position 当前进度
             * @param duration 总时长
             * 播放进度变化监听
             */
            player.onPositionChangeListener = null;

            /**
             * @param volume 改变后的音量
             * 音量变化监听
             */
            player.onVolumeChangeListener = null;

            /**
             * 播放事件监听
             */
            player.onPlayEventListener = {
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

                },

                onPlayByTime: function (position) {

                }
            }

            /**
             * 播放视频
             * @param playUrl 播放地址
             * @param startTime 开始时间
             * @param left
             * @param top
             * @param width
             * @param height
             */
            player.play = function (playUrl, startTime, left, top, width, height) {
                player.playInfo = {
                    playUrl: playUrl,
                    left: left,
                    top: top,
                    width: width,
                    height: height
                };
                //log_view.i("android-play");
                if (player.duration > 0) {//表示现在有在播放，然后切换视频
                    player.onPlayEventListener.onPlayStop();
                }
                marsee.play(playUrl, startTime, left, top, width, height);
                player.startRefreshCurrentPosition();
            };

            /**
             * 相同的内，位置，从头播
             */
            player.replay = function () {
                if (!player.playInfo.playUrl) {
                    return;
                }
                player.play(player.playInfo.playUrl, 0, player.playInfo.left, player.playInfo.top, player.playInfo.width, player.playInfo.height);
            };

            /**
             * 跳到指定位置播放
             * @param time
             */
            player.playByTime = function (time) {
                marsee.playByTime(time);
                if(!player.isPlaying){
                    player.resume();
                }
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayByTime) {
                    player.onPlayEventListener.onPlayByTime(time);
                }
            };

            /**
             * 获取当前播放进度，单位：秒
             * @return {number}
             */
            player.getCurrentPosition = function () {
                return player.currentPosition;
            };

            /**
             * 获取当前视频总时长
             * @return {number|*}
             */
            player.getDuration = function () {
                player.duration = marsee.getPlayDuration() - 0;
                return player.duration;
            };

            /**
             * 暂停
             */
            player.pause = function () {
                player.isPlaying = false;
                marsee.pausePlay();
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayPause) {
                    player.onPlayEventListener.onPlayPause();
                }
            };

            /**
             * 继续
             */
            player.resume = function () {
                player.isPlaying = true;
                marsee.resumePlay();
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayResume) {
                    player.onPlayEventListener.onPlayResume();
                }
            };

            /**
             * 停止
             */
            player.stop = function () {
                marsee.stopPlay();
                if (player.onPlayEventListener && player.onPlayEventListener.onPlayStop) {
                    player.onPlayEventListener.onPlayStop();
                }
            };

            /**
             * 在Android中，播放器只停止，不销毁
             * 只会在退出整个专区时销毁
             */
            player.destroy = function () {
                marsee.stopPlay();
            };

            /**
             * 刷新进度的方法，不在外部调用
             */
            player.startRefreshCurrentPosition = function () {
                if (player.timer) {
                    clearTimeout(player.timer);
                }
                player.timer = setInterval(function () {
                    player.isPlaying = marsee.isPlaying();
                    var currentPosition = marsee.getPlayPosition() - 0;
                    if (player.currentPosition == currentPosition) {
                        return;
                    }
                    player.currentPosition = currentPosition;
                    var duration = player.getDuration();
                    if (duration <= 0) {//还未载入
                        return;
                    }
                    if (player.onPositionChangeListener) {
                        player.onPositionChangeListener(player.currentPosition, duration);
                    }
                }, 1000);
            };

            /**
             * 增加音量
             */
            player.volumeUp = function () {

            };

            /**
             * 音量减
             */
            player.volumeDown = function () {

            };

            /**
             * 静音
             */
            player.setMuteFlag = function () {

            };

            /**
             * 设置进度变化监听器
             * @param onPositionChangeListener
             */
            player.setOnPositionChangeListener = function (onPositionChangeListener) {
                player.onPositionChangeListener = onPositionChangeListener;
            };

            /**
             * 设置音量变化监听器
             * @param onVolumeChangeListener
             */
            player.setOnVolumeChangeListener = function (onVolumeChangeListener) {
                // player.onVolumeChangeListener = onVolumeChangeListener;
            };

            /**
             * 设置播放事件监听器
             * @param onPlayEventListener
             */
            player.setOnPlayEventListener = function (onPlayEventListener) {
                player.onPlayEventListener = onPlayEventListener;
            };

            return player;
        } catch (e) {
            var webPlayer = WebPlayer.createNew();
            return webPlayer;
        }

    }
};

var onPlayStart = function () {
    AndroidPlayer.player.onPlayEventListener.onPlayStart();
};

var onPlayComplete = function () {
    AndroidPlayer.player.onPlayEventListener.onPlayComplete();
};

var onPlayError = function () {
    AndroidPlayer.player.onPlayEventListener.onPlayError();
};

/**
 * web播放器，目前只兼容谷歌浏览器，其他浏览器效果未知
 * 基于videojs开发
 * @type {{createNew: WebPlayer.createNew}}
 */
var WebPlayer = {
    createNew: function () {
        var jsUrl = "../js/video.min.js";
        var cssUrl = "../css/video-js.min.css";
        WebPlayer.loadjscssfile(jsUrl, "js");
        WebPlayer.loadjscssfile(cssUrl, "css");

        videojs.options.flash.swf = "video-js.swf";//全局方式覆盖 SWF文件在Flash技术位置的位置

        var player = {};
        player.playerDom = document.createElement('video');//video
        player.playerDom.setAttribute('class', 'video-js');
        player.playerDom.setAttribute('controls', 'true');
        player.playerDom.setAttribute('preload', 'none');
        document.body.appendChild(player.playerDom);

        player.isPlaying = false;

        player.totalVolume = 100;
        player.nowVolume = 0;//当前音量
        player.preVolume = 5;//单次音量变化幅度

        player.duration = 0;//总时长，单位：秒
        player.currentPosition = 0;//当前进度，单位：秒
        player.timer = null;//刷新进度timer

        player.playInfo = {
            playUrl: "",
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };

        player.stbType = "";//盒子型号

        /**
         * @param position 当前进度
         * @param duration 总时长
         * 播放进度变化监听
         */
        player.onPositionChangeListener = null;

        /**
         * @param volume 改变后的音量
         * 音量变化监听
         */
        player.onVolumeChangeListener = null;

        player.onPlayEventListener = {
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

            },

            onPlayByTime: function (position) {

            }
        };


        player.video = videojs(player.playerDom, {
            muted: true,//
            controls: false,
            autoPlay: true,
            loop: false,
            autoSetup: false
        });

        /**
         * 开始加载视屏
         */
        player.video.on("loadstart", function () {
        });

        /**
         * 载入视屏
         */
        player.video.on("loadedmetadata", function () {
        });

        /**
         * 开始播放
         */
        player.video.on('loadeddata', function () {
            player.duration = Math.ceil(player.video.duration());
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayStart) {
                player.onPlayEventListener.onPlayStart();
            }
        });

        /**
         * 加载中
         */
        player.video.on('progress', function () {
        });

        /**
         * 音量变化
         */
        player.video.on('volumechange', function () {
            player.nowVolume = parseInt(player.video.volume() * 100);
            ;
            if (player.onVolumeChangeListener) {
                var muteFlag = player.video.muted();
                player.onVolumeChangeListener(muteFlag == 1 ? 0 : player.nowVolume);
            }
        });

        /**
         * 播放异常
         */
        player.video.on('error', function () {
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayError) {
                player.onPlayEventListener.onPlayError();
            }
        });

        /**
         * 播放结束
         */
        player.video.on('ended', function () {
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayComplete) {
                player.onPlayEventListener.onPlayComplete();
            }
        });

        player.play = function (playUrl, startTime, left, top, width, height) {
            player.playInfo = {
                playUrl: playUrl,
                left: left,
                top: top,
                width: width,
                height: height
            };

            player.duration = 0;//重置总时长
            player.playerDom.parentNode.style.left = left + "px";
            player.playerDom.parentNode.style.top = top + "px";
            player.playerDom.parentNode.style.zIndex = "-1";
            player.playerDom.parentNode.style.position = "absolute";
            // player.playerDom.style.top = top+"px";
            player.video.height(height);
            player.video.width(width);
            player.video.src([{src: playUrl}]);
            player.video.ready(player.onPlayerReady);
            player.video.currentTime(startTime);
            // player.playerDom.parentNode.style.background = "rgba(0,0,0,0)";
            player.nowVolume = player.video.volume();
            player.isPlaying = true;
        };

        /**
         * 相同的内，位置，从头播
         */
        player.replay = function () {
            if (!player.playInfo.playUrl) {
                return;
            }
            player.play(player.playInfo.playUrl, 0, player.playInfo.left, player.playInfo.top, player.playInfo.width, player.playInfo.height);
        };

        /**
         * 跳转到指定进度
         * @param time
         */
        player.playByTime = function (time) {
            player.video.currentTime(time);
            if(!player.isPlaying){
                player.resume();
            }
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayByTime) {
                player.onPlayEventListener.onPlayByTime(time);
            }
        };

        /**
         * 播放器准备好的回调
         */
        player.onPlayerReady = function () {
            // this.on("");
            player.video.play();
            // setTimeout(function () {
            //     player.video.muted(false);
            // },5000);
            if (player.timer) {
                clearTimeout(player.timer);
            }
            player.timer = setInterval(function () {
                var currentPosition = Math.ceil(player.video.currentTime());
                if (player.currentPosition == currentPosition) {
                    return;
                }
                player.currentPosition = currentPosition;
                var duration = player.getDuration();
                if (duration <= 0) {//还未载入
                    return;
                }

                if (player.onPositionChangeListener) {
                    player.onPositionChangeListener(player.currentPosition, player.duration);
                }

            }, 1000);
        };

        /**
         * 暂停播放
         */
        player.pause = function () {
            player.video.pause();
            player.isPlaying = false;
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayPause) {
                player.onPlayEventListener.onPlayPause();
            }
        };

        /**
         * 继续播放
         */
        player.resume = function () {
            player.video.play();
            player.isPlaying = true;
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayResume) {
                player.onPlayEventListener.onPlayResume();
            }
        };

        /**
         * 停止播放器
         * videojs没用停止方法，内部实现使用暂停代替
         */
        player.stop = function () {
            player.video.pause();//videojs没用停止方法，使用暂停代替
            player.isPlaying = false;
            if (player.onPlayEventListener && player.onPlayEventListener.onPlayStop) {
                player.onPlayEventListener.onPlayStop();
            }
        };

        /**
         * 销毁播放器
         */
        player.destroy = function () {
            player.isPlaying = false;
            player.video.dispose();
            if (player.timer) {
                clearTimeout(player.timer);
            }
        };

        /**
         * 获取总时长
         * @return {number}
         */
        player.getDuration = function () {
            return player.duration;
        };

        /**
         * 获取当前播放进度，单位：秒
         * @return {number}
         */
        player.getCurrentPosition = function () {
            player.currentPosition = Math.ceil(player.video.currentTime());
            return player.currentPosition;
        };

        /**
         * 增加音量
         */
        player.volumeUp = function () {
            player.video.muted(false);
            var volume = player.nowVolume + player.preVolume;
            if (volume >= player.totalVolume) {
                volume = player.totalVolume;
            }

            player.video.volume(volume / 100);
        };

        /**
         * 音量减
         */
        player.volumeDown = function () {
            player.video.muted(false);
            var volume = player.nowVolume - player.preVolume;
            if (volume <= 0) {
                volume = 0;
            }
            player.video.volume(volume / 100);
        };

        /**
         * 静音
         */
        player.setMuteFlag = function () {
            var muteFlag = player.video.muted();
            if (muteFlag) {//静音
                player.video.muted(false);
            } else {
                player.video.muted(true);
            }
        };

        /**
         * 设置音量变化监听器
         * @param onVolumeChangeListener
         */
        player.setOnVolumeChangeListener = function (onVolumeChangeListener) {
            if (!player.onVolumeChangeListener) {
                var muteFlag = player.video.muted();
                if (muteFlag) {//静音
                    onVolumeChangeListener(0);
                } else {
                    onVolumeChangeListener(player.nowVolume);
                }
            }
            player.onVolumeChangeListener = onVolumeChangeListener;
        };

        /**
         * 设置播放事件监听器
         * @param onPlayEventListener
         */
        player.setOnPositionChangeListener = function (onPositionChangeListener) {
            player.onPositionChangeListener = onPositionChangeListener;
        };

        /**
         * 设置播放事件监听器
         * @param onPlayEventListener
         */
        player.setOnPlayEventListener = function (onPlayEventListener) {
            player.onPlayEventListener = onPlayEventListener;
        };

        /**
         * 音量加
         */
        View.key.key_volUp_event = function () {
            if (player) {
                player.volumeUp();
            }
        };
        /**
         * 音量减
         */
        View.key.key_volDown_event = function () {
            if (player) {
                player.volumeDown();
            }
        };

        /**
         * 静音键
         */
        View.key.key_mute_event = function () {
            if (player) {
                player.setMuteFlag();
            }
        };


        return player;
    },


    /**
     * 同步加载js，一步加载css
     * @param url
     * @param filetype
     */
    loadjscssfile: function (url, filetype) {

        if (filetype == "js") {
            WebPlayer.ajaxGet(url, function (data) {
                var fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.text = data;
                document.getElementsByTagName("head")[0].appendChild(fileref);
            });
        } else if (filetype == "css") {
            var fileref = document.createElement('link');
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", url);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }

    },

    /**
     * 不同于XEPG中的方法，不去除字符串里的换行与回车
     * @param url
     * @param callBack
     * @return {string}
     */
    ajaxGet: function (url, callBack) {
        try {
            var xmlhttp = null;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (typeof (callBack) == "function") {
                        callBack(xmlhttp.responseText);
                    }
                }
            };
            xmlhttp.open("GET", url, false);
            xmlhttp.send();
        } catch (err) {
        }
    }
}

console.log("欢迎使用player_util工具\n" +
    "该工具主要面向使用浏览器承载内容的电视机顶盒\n" +
    "并且使用videojs兼容谷歌浏览器\n" +
    "当前版本：" + Player.version + "\n" +
    "\n" +
    "两个黄鹂鸣翠柳，一行白鹭上青天。\n" +
    "窗含西岭千秋雪，门泊东吴万里船。\n" +
    "\n");