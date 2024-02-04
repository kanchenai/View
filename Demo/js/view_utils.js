/**
 * 基类view，焦点移动、点击
 * View.init(firstFocus)
 * getViewById(id)  获取已创建的控件
 * View.$$(id) 获取div  类似java 静态方法
 * View.getViewWidth(id) 获取宽度
 * View.getViewHeight(id) 获取高度
 *
 * var view = View.createNew(id)  创建view,并绑定id  类似java的new
 * view.bindData(data)  绑定数据
 * view.bindTextView(textView) 绑定textView,view上焦或失焦或执行textView的跑马灯开始或停止
 * view.setFocusChange() 设置上下左右移动方法或移动规则
 *      setFocusToUp 向上
 *      setFocusToDown 向下
 *      setFocusToLeft 向左
 *      setFocusToRight 向右
 * view.requestFocus()  上焦，同时会将之前的焦点下焦  触发上焦失焦监听
 * view.requestUnFocus()  失焦， 触发下焦监听
 *
 * view.setOnFocusChangeListener(onFocusChangeListener) 设置焦点变化监听
 * view.setOnClickListener(onClickListener)  设置点击监听
 *
 * 如果需要改变样式，必须在焦点操作之前设置样式
 * view.focusStyle = "item item_focus"; 上焦样式默认值，  改变样式直接设置
 * view.unFocusStyle = "item";失焦状态 默认值，  改变样式直接设置
 * view.selectStyle = "item_select";驻留状态，  改变样式直接设置
 *
 * 滚动动画，true:有滚动效果；false:直接到位置，没有滚动效果， 当盒子性能出现问题时，可以减少控件的滚动效果，以控制性能消耗及卡顿体验
 * view.scrollAnimation = true;
 * view.scrollHorizontal 横向滚动多少距离
 * view.scrollHorizontalTo 横向滚动到x
 *
 * view.scrollVertical纵向滚动多少距离
 * view.scrollVerticalTo滚动到y
 * version       date            description
 *  0.2       ---.--.--      新增dialog控件，用以弹窗
 *  0.3       ---.--.--      新增listView控件，用以列表，横向纵向
 *  0.3.1     2019.10.16     增加NoticeView和CarouselView滚动效果开关，去除滚动效果选择
 *                           优化NoticeView和CarouselView滚动效果，不需要填height和width保证滚动效果
 *  0.4       2019.10.17     新增GridView控件，用以网格列表,横向或纵向
 *                           修复ListView子元素需要写height或width（现在不用写了）
 *                           修复listView焦点移动设置方法报错，无法执行问题
 * 0.4.1      2019.10.18     优化ListView滚动位置算法，当焦点view在显示范围内不滚动
 *                           修复GridView纵向最后一行，横向最后一列循环报错
 * 0.4.2      2019.10.19     优化requestFocus,当上焦的view的dom不存在时,不切换焦点
 * 0.4.3      2019.10.20     优化CarouselView的id重复，修复内部img的top值，可以存在多个
 * 0.4.4      2019.10.22     在View中新增前置焦点；优化初始焦点在列表上的上焦情况,log打印提示改为中文
 * 0.4.5      2019.10.23     优化NoticeView的id重复，可以存在多个
 *                           在ListView新增子元素焦点变化监听
 * 0.4.6      2019.10.24     修复GridView在纵向最后一行，向下焦点变化异常
 * 0.4.7      2019.10.30     修复横纵滚动距离会出现误差
 *                           新增滚动监听
 *                           修复横纵滚动到方法超过滚动范围，无限滚动
 * 0.4.8      2019.10.31     ListView新增首尾相接循环效果，开关isCirculate = true或者false，默认关闭；
 *                              效果有局限，滚动过快会失去效果，必须超过父布局两个间距,
 *                              提示：如果在过短的列表中要实现该效果，可以将数据复制多份以达到要求
 *                           修复textView中text值不对应，在setText时，未更新text
 *                           修复ListView：初始焦点在ListView中，动画scrollAnimation无法关闭
 *                           适配华为v9c clientHeight数值异常，改为offsetHeight,宽类同,之前在0.4.6中修复，但是没有同步到当前文件
 *                           carouselView.getData方法名改成carouselView.getCurrentData，更加贴合方法功能
 * 0.4.9      2019.11.11     优化textView跑马灯
 *                           优化gridView边界移动，主要是优化数据小于单行、列时，焦点变化
 *                           修复ListView新增首尾相接循环效果滚动过快会失去效果，但是非常快（比如一直按着改变焦点）时的效果还是存在缺陷
 * 0.5.0      2019.11.11     删除noticeView和carouselView，因为这两个子view可以基于listView实现，不足以成为基础view
 *                              这两个子view在special_views.js中实现
 * 0.5.1      2019.11.13     去除未调用View.init时，默认创建的第一个view为View.FocusView,此时的焦点不起做用
 *                           优化相同id的TextView重复createNew。每次创建都清除跑马灯效果
 *                           修复listView清除数据时（bindData([])）跑马灯执行异常
 *                           新增listView.clear()方法
 *                           优化setOnFocusChangeListener方法
 * 0.6        2019.12.5      新增AreaView控件，区域焦点控件
 * 0.6.1      2019.12.5      修复scrollHorizontalToView、scrollVerticalToView 的top、left值为""时异常
 *                           新增AreaView控件滚动功能
 *                           新增AreaView子控件点击监听和焦点变化监听
 *                           修复AreaView滚动异常
 *                           修复scrollHorizontalToView、scrollVerticalToView 的top、left的获取方式(使用offsetTop,offsetLeft)，避免值为"",造成数值异常
 *                           优化AreaView.viewToArea方法，在显示范围外区域内子控件不在移动中上焦
 *                           修复view中的滚动异常，当滚动到的位置和当前位置相同时，view.isScrolling状态无法恢复成false
 *                           新增View.getViewById方法，获取已创建的view
 *                           删除areaView.getChildViewById方法，该方法可用getViewById替代
 *                           修改AreaView.createNewChild，将子控件在创建时于父控件绑定
 *                           优化计算修改areaView.getPositionBy相对坐标和绝对坐标AreaView.getAbsolutePosition
 *                           将View.getViewById从View取出，之后直接getViewById(id);
 *                           修复listView.getCurrentIndex异常，当View.FocusView不存在时
 *                           优化两个方法：View.getViewWidth(id) 获取宽度、View.getViewHeight(id) 获取高度
 * 0.6.2      2019.12.17     修复列表上焦异常，初始焦点在列表上时，执行两次上焦动作
 *                           修复ListView.scrollVerticalToView,子控件高度大于父控件时，一直执行滚动方法；横向同理
 *                           优化ListView.scrollVerticalToView和ListView.scrollHorizontalToView方法
 *                           新增滚动方向属性
 *                           优化/修复areaView滚动效果
 *                           优化AreaView.viewToArea中dom层级导致的计算错误
 *                           listView中，给子控件绑定数据
 *                           新增listView焦点居中功能，该功能开关为listView.isFocusCenter
 * 0.6.3      2020.01.07     优化区域就近原则规则
 *            2020.01.16     新增listView设置列表滚动方法，原本有列表滚动监听，只是未提供方法设置
 *            2020.01.29     新增areaView.getChildViewById方法，该方法比getViewById更加快速
 *            2020.02.20     areaView.addChild或areaView.addChilds时，areaView必须是显示的，否则会出现offset**异常情况，导致焦点变化异常
 *            2020.02.21     重写areaView.bindData方法，参数为数组，顺序对应addChild执行顺序。
 *                           修复listView改绑数据后记忆焦点不重置或不存在
 *            2020.02.25     areaView新增为子view绑定textView方法,分别为areaView.bindTextView和areaView.bindTextViews
 *            2020.02.28     修复初始焦点在areaView中，设置监听后，未监听到初始的焦点变化；
 *                           优化初始焦点在listView，监听器必须在调用bindData之前
 *                           优化listView中只有一个子view时，存在当前焦点切换当前焦点的情况
 * 0.6.4      2020.03.11     优化进入区域的实现，使用view.setFocusChange方法时参数可以是areaView，也可以实现就近原则
 *                              新增方向属性，在上焦方法执行完后重置，可以在焦点变化监听中使用
 *                           AreaView实现AreaView套AreaView功能，AreaView可以有子AreaView。
 *                              注意点：区域间的跳转由区域位置决定，于当前的焦点位置没有决定性的关系
 *            2020.03.16     AreaView修复子view隐藏时，焦点移动异常
 *            2020.03.18     修复ListView:初始焦点在列表上，isFocusCenter不生效
 *            2020.03.20     修复AreaView的bindTextViews方法参数textViewIds长度小于childViews的长度，出现的异常
 *                           新增View.scrollVerticalToView和View.scrollHorizontalToView方法，用法和ListView同方法名方法相同，
 *                              有第三个参数，滚动的位置:开始，结束，居中，无（只显示）
 *            2020.03.24     修复问题：区域中的子区域间焦点切换时，由于只能触发子区域中的焦点监听，所以无法触发子区域的滚动的问题
 *                              并封装areaView.scrollToChild方法
 *                           在areaView中新增scrollLocate属性，用以定位滚动位置
 *            2020.03.25     优化areaView的子view的类型，现在可以支持areaView中套listView或gridView
 *                           在listView和gridView，为子view新增fatherView属性，用以标识所属
 *            2020.03.28     修复两个笔误，造成的影响，在纵向同一线上按上时有概率不遵循就近，在横向同一线上按右时有概率不遵循就近
 *                           修复当前焦点对应的dom不存在时依旧处理失焦动作
 *            2020.03.29     view中新增width和height属性，意味着所有控件都有宽高
 * 0.7.0      2020.04.01     新增RecycleView，子view的节点数为定值，减少渲染上的消耗，该控件以AreaView为父类，具备AreaView的大部分功能，其中一部分功能被重写
 *            2020.04.02     规范适配器命名，同时兼容老版本写法
 *            2020.04.07     修复初始焦点在view上，绑定得textView不执行跑马灯
 *                           修复适配器由于规范命名引起的问题
 *                           修复初始焦点在areaView的子view中，不执行滚动到子view
 *                           注意：areaView套areaView时，需要先执行父areaView的addChild方法，再设置子areaView
 * 0.7.1      2020.04.08     在各个控件中新增识别控件的属性viewType;修复listView二层套用时，外层滚动没有调用
 *                           修复从其他控件上焦到recycleView时异常；解决方法：当dom不存在时不对比
 *                           修复recycleView中子view未绑定数据
 *                           新增recycleView.scrollByIndex方法，只滚动到，不上焦
 *            2020.04.09     修复recycleView在数据过短时，出现的异常
 *            2020.04.11     优化areaView在焦点变化，在计算位置时实时刷新宽高
 *            2020.04.12     修复listView子控件只有一个时，焦点切换异常
 *                              注意：recycleView中滚动到指定序号的子view暂时存在算法上的不足，所以无法提供方法，也不支持，有思路的可以交流
 *            2020.04.13     修复2020.04.12中提到的不足：recycleView中滚动到指定序号的子view暂时存在算法上的不足
 *                              目前可以滚动到指定的index
 *            2020.04.16     修复recycleView.scrollByIndex方法
 *                           修复初始焦点recycleView内部时，上焦位置异常
 * 0.7.2      2020.04.21     修复recycleView的问题，优化循环效果
 *                           修复listView上焦时，未设置前置焦点frontView
 *                           待优化：当焦点切换足够快时，滚动效果会出现生硬情况，但不影响功能
 *            2020.04.23     修复recycleView.clear未重置recycleView内一些变量的状态，导致重新绑定数据时出现异常
 *            2020.04.27     修复areaView的子view有recycleView时，出现内部上焦方法执行异常
 *                           修复areaView的isLoop==true,单行单列时焦点循环异常
 *            2020.05.06     修复recycleView数据子view数据绑定异常
 * 0.8.0      2020.05.11     新增ScrollView,兼容部分盒子关闭滚动属性，还需要兼容TextView
 * 0.8.1      2020.05.12     兼容TextView,兼容部分盒子关闭滚动属性
 *            2020.05.22     修复textView在text-align不是left，并且停止跑马灯时，显示异常
 *                           修复ScrollView重复创建时，在某些场景中滚动异常。比如ScrollView对应的节点没写class,导致没有position
 * 0.9.0      2020.05.22     重写弹窗控件Dialog，更加方便使用
 * 1.0.0      2020.05.25     按键从xepg剥离，整合进view，减少xepg中的事件绑定，优化操作，由于将键值相关的事件重写，会影响到播放事件触发的使用
 *                              在使用播放事件过程中注意这个方面的改动
 *            2020.05.27     修复recycleView中最后第二行或列，焦点变化异常
 *            2020.05.28     修复textView复用时，text缓存，造成何实际数据不符
 *            2020.06.03     兼容scrollView获取属性时，left、top是number类型时，取值异常
 *                           添加：没有动画时，触发开始、结束滚动监听，但是依旧不处罚滚动中监听
 *                           修复取消滚动效果，当滚动位置小于0时，异常
 *            2020.06.28     修改view.hide实现：由不渲染改为渲染不显示
 *                           新增view.gone:不渲染
 *                           优化scrollView的scroller的样式
 *                           新增dialog.gone重写方法
 *                           修复scrollView在节点重新渲染时，scroller对应的节点不存在
 * 1.0.1       2020.06.29    删除gone方法，该方法存在很多效果上的不可控
 *                           修复控件显示隐藏时，宽高计算异常导致的功能异常
 *                           优化listView和areaView不显示时，按键操作改为不上焦
 *                           修复TextView在某种场景滚动异常
 *             2020.07.11    修复areaView中子areaView相互跳转时方向判断错误，导致就近规则概率错误
 *             2020.07.23    适配创维E900V21C盒子，hide方法不隐藏
 *             2020.08.20    dialog、scrollView设置viewType
 *             2020.08.21    修复gridView横向时，最后第二行（列），有概率焦点规则异常
 *             2020.08.24    修复TextView对应节点的父节点visibility为hidden，创建TextView获取不到text
 *             2020.09.02    修复gridView横向时，倒数第二列按右，在某些场景焦点变化异常
 *             2020.09.03    修复recycleView执行bindData时，滚动距离为重置
 *             2020.09.17    修复recycleView纵向2列时,初始焦点在recycleView上，数据只有1个或4个时，数据显示异常
 *             2020.10.13    弃用View.scrollNull，启动View.scrollNormal,两个值相同，只是调整命名
 * 1.0.2       2020.10.14    增加按键间隔，默认间隔150毫秒
 * 1.1.0       2020.10.24    新增标签设置控件属性
 *                           修复recycleView在bindData时焦点监听触发异常（对同一个view先监听到失焦在上焦）
 *                           recycleView.startIndex存在scrollByIndex和getVerticalStartIndex(getHorizontalStartIndex)
 *                              不同的计算方式，在会出现两种计算结果不同的情况，对于后期扩展有一定的影响，需要在后期使用一种方式计算(已在1.2新增recycleViewM中优化)，
 *                              这里引发绑定textView内部节点异常（在textView兼容）
 *             2020.11.13    修复listView、GridView再次绑定数据时，滚动位置未归零
 *             2020.11.25    修复AreaView.viewToArea中一屏的距离为1280，导致1080p的页面有概率焦点变化不起作用
 *             2020.12.03    优化listView和recycleView的clear方法，使clear方法具有重置滚动位置功能
 *                           修复listView和recycleView的bindData方法不传参数时报错
 *             2020.12.09    修复textView跑马灯执行时有几率报错，执行中检查节点状态
 *                           修复删除recycleView最后一个子控件时，清除跑马灯报错
 *             2020.12.24    去除scrollNull内部使用
 *                           自定义页面流程：将initView，setView，initUtil固有方法进行封装（注释在1.2.1更新）
 * 1.1.1       2021.01.13    新增VMap(Map),VStack(Stack栈)，用法与java中的Map及栈相似具体用法参考代码或文档
 *                           新增View.parseDom：将html代码转成Dom
 *                           将getAbsolutePositionBy、setAbsolutePositionBy两个方法从RecycleView迁移到View
 *                           删除View.viewType,舍弃自主创建页面计划
 *                           新增：View.scrollVerticalToDom:纵向滚动到内部指定节点
 *                           新增：View.scrollHorizontalToDom:横向滚动到内部指定节点
 *                           删除listView中onListScrollListener，改功能和View中的滚动监听相同
 *                           优化控件缓存：从viewList改为viewMap
 *                           新增view.remove：将view本身从控件缓存空间中移除
 *                           优化listView、recycleView的clear方法，clear时，将子控件从控件缓存中删除
 *                           优化areaView.scrollToChildDom滚动，可支持斜滚动
 * 1.2.0       2021.01.13    新增RecycleViewM(RecycleViewMultiple简写),功能用法与RecycleView相似，单个组件可以有多个可上焦的
 *                              内部算法比原来的RecycleView更完善，扩展更强，缺点是：可循环的最小个数比原来的更多,没有初始偏移量（第一个必须从最左或最上的位置）
 *                           新增多层滚动，原本只支持两层
 *                           优化内部页面创建流程：使用内部页面创建，可以使AreaView的addChild方法没有强制顺序；
 *                           去掉页面创建过程中滚动动画
 *                              使用方式：删掉在页面的window.onload方法，其他不变
 *             2021.01.15    为listView、gridView、areaView、recycleView、recycleViewM新增焦点离开驻留效果
 *                              控件属性needSelect:true为需要，false为不需要
 *                              标签属性值view-select：1或true为需要，其他为不需要
 *                           修复scrollAnimation默认开启
 * 1.2.1       2021.01.18    新增:初始焦点id允许父控件id,但是必须内部内部定义页面创建。
 *                           新增:RecycleViewM的bindData第二个参数position，position生效在当前焦点为recycleViewM的子控件
 *                           为TextView重写remove方法
 * 1.2.2       2021.01.27    新增View.getVisibleSize:获取节点实际的显示大小
 *                           优化：ScrollView的scroller的计算大小，并兼容由该优化引发TextView的取消跑马灯异常
 *                           优化：去除AreaView的布局限制
 *                           补充：RecycleViewM的跑马灯，1.2.0中为遗漏的功能,如果单组件有多控件，那么这个跑马灯默认绑在第一个控件上
 *                           优化内部页面创建
 *             2021.02.22    修复areaView.requestFocus在needSelect时，未上焦到selectView
 *                           新增横向标签可支持h:横向
 *                           修复RecycleViewM绑定数据会调用父控件滚动
 *                           兼容滚动被异常调用，导致同一个控件同时存在两个滚动事件
 *                           兼容未调用View.init时创建控件异常
 *                           修复scrollHorizontalToDom方法，当scrollLocate：scrollEnd时，left错写成top
 *                           修复scrollToIndexNoAnimation方法定位存在误差
 *             2021.04.06    修复当scrollAnimation为false时，原地滚动依旧会触发滚动开始异常
 *             2021.04.07    修复移除view时，移除了当前焦点导致列表重新绑定异常
 *                           修复RecycleViewM存在前缀部分相同时候，getCurrentIndex方法异常
 *             2021.04.23    优化RecycleViewM纵向刷新算法
 *                           修复RecycleViewM的横向刷新算法及笔误
 *             2021.04.24    新增View.getCurrentStyle(dom):获取dom的当前实际的样式
 *                           优化View.getVisibleSize内部属性使用View.getCurrentStyle(dom)获取
 *             2021.05.10    修复陕西盒子RecycleViewM重影；原因：removeChild[i].remove();不生效问题，无法删除节点
 *             2021.05.14    修复AreaView绑定数据时，只给子控件绑定数据
 * 1.2.3       2021.05.19    新增队列VQueue，push入队，pop出队
 *                           兼容Android浏览器默认返回，导致返回异常
 *             2021.05.20    修复VMap、VStack、VQueue关键字new时,内部属性使用错误
 *                           优化按键：只对预处理的按键事件拦截，其他的以key_default_event返回为准
 *             2021.05.25    优化居中滚动时，滚动位置未改变，任然触发滚动监听
 *             2021.05.28    修复节点不存在时设置样式，主要在节点被回收时触发
 *             2021.06.01    修复计算滚动宽高小于本身时，textView的text-align不生效
 *             2021.06.07    新增RecycleViewM的addData：新增数据，并相应刷新
 *             2021.06.09    修复RecycleViewM的bindData 数据为空时报错
 *                           修复RecycleViewM的bindData时，焦点越界问题
 * 1.2.4       2021.06.15    去除key.key_back_opt的实现
 *             2021.07.09    修复初始焦点在父控件时，父控件有失焦动作
 *                           修复ListView在首尾相接效果开启时，数据数量小于可见数量时，上焦后显示异常
 *             2021.07.14    修复element.remove方法为undefined时异常
 *             2021.07.15    优化RecycleViewM的refreshChildView方法，使addComponent执行次数为最小次数
 *             2021.07.16    兼容dialog无法某些盒子隐藏，原因：先display:none,然后visibility:"",会导致display改变为block
 *             2021.08.16    修复初始焦点不显示时，不上焦
 *             2021.08.17    修复初始焦点不在view类型的控件上时异常
 *                           修复初始焦点隐藏时，异常
 *             2021.09.10    修复关闭滚动，横向滚动时滚动监听中滚动结束不触发
 *             2021.09.17    修复按右进入AreaView时，计算位置错误
 * 1.2.5       2021.09.28    新增上下左右标签属性，可填控件id，也可填方法名
 *             2021.10.26    修复AreaView的子控件，方向标签不生效
 *             2021.11.04    修复scrollView.measure，刷新大小时，在特殊情况下偏大
 *             2022.01.19    新增scrollToChild、scrollByIndex的currentScroll参数，currentScroll为true时只滚动当前控件
 *             2022.03.03    修复AreaView中点横向水平时，判断异常
 *
 */
var View = {
    version: "1.2.5(2022.03.03)",//版本号

    key: null,//View的静态变量,按键事件

    viewMap: null,//控件缓存空间

    isViewCreating: false,//是否使用内部定义页面创建中
    firstFocusId: "",//页面初始焦点id

    //类似java静态变量
    FocusView: null,

    vertical: 0,//纵向
    horizontal: 1,//横向

    keyUp: 0,
    keyDown: 1,
    keyLeft: 2,
    keyRight: 3,
    keyNull: -1,
    keyDirection: -1,//在执行焦点变化前赋值方向，执行完之后置空，按键方向:keyUp,keyDown,keyLeft,keyRight

    /**@deprecated*/
    scrollNull: 0,//舍弃,滚动到,只显示出，不在乎位置
    scrollNormal: 0,//滚动到,只显示出，不在乎位置
    scrollStart: 1,//滚动到开始，横向为最左边，纵向为最上边
    scrollCenter: 2,//滚动到中间
    scrollEnd: 3,//滚动到结束，横向为最右边，纵向为最下边

    //自定义key，在标签属性中
    attributeKey: {
        //方向
        up: "view-up",//上
        down: "view-down",//下
        left: "view-left",//左
        right: "view-right",//右

        //监听器
        click: "view-click",//点击
        focusChange: "view-focus",//焦点变化
        scroll: "view-scroll",//滚动
        visibleChange: "view-visible",//显示变化

        //适配器
        adapter: "view-adapter",//适配器

        //属性值
        animation: "view-animation",//滚动是否开启
        orientation: "view-orientation",//方向
        isLoop: "view-loop",//焦点是否循环
        isCirculate: "view-circulate",//首尾相接
        scrollLocate: "view-locate",//焦点滚动居中
        row: "view-row",//行
        col: "view-col",//列
        hasMarquee: "view-marquee",//含有跑马灯
        needSelect: "view-select"//驻留效果
    },

    /**
     * 定义当前页面的第一个焦点，如果不调用，初始焦点的上焦监听无法触发
     * @param {*} firstFocusId
     */
    init: function (firstFocusId) {
        console.log("欢迎使用view_utils工具\n" +
            "该工具主要面向使用浏览器承载内容的电视机顶盒\n" +
            "当前版本：" + View.version + "\n" +
            "\n" +
            "白日依山尽，黄河入海流。\n" +
            "欲穷千里目，更上一层楼。\n" +
            "\n");
        View.viewMap = new VMap();
        if (View.isViewCreating) {
            View.firstFocusId = firstFocusId;
        } else {
            View.FocusView = View.createNew(firstFocusId);
            View.FocusView.focus();
        }


    },

    createNew: function (id) {
        //避免重复创建id相同，但对象不同的view
        if (!View.viewMap) {
            View.viewMap = new VMap();
        }
        if (View.viewMap.get(id)) {
            return View.viewMap.get(id);
        }
        if (!View.$$(id)) {
            console.log("warn:" + id + "对应的dom不存在");
        }


        var view = {};
        View.viewMap.put(id, view);
        // if (!View.FocusView) {//如果没有init，将创建的第一个设置为FocusView.   之后发现虽然FocusView！=null但是依旧有问题
        //     View.FocusView = view;
        // }
        view.id = id;//view的id
        view.viewType = "view";//当前控件的名称
        view.focusStyle = "item item_focus";//上焦的className
        view.selectStyle = "item item_select";//选中的className
        view.unFocusStyle = "item";//失焦的className
        view.data = null;//view绑定的数据

        view.textView = null;//view绑定的textView，view上焦时，会自动执行跑马灯，失焦时，会自动清除

        view.nextUp = null;//焦点向上的view或方法
        view.nextDown = null;//焦点向下的view或方法
        view.nextLeft = null;//焦点向左的view或方法
        view.nextRight = null;//焦点向右的view或方法

        view.isScrolling = false;//是否正在滚动
        view.scrollOrientation = -1;//-1:未滚动 vertical(0):纵向，horizontal(1)：横向

        view.onFocusChangeListener = null;//焦点变化监听方式，主要参数view:变化的view，hasFocus:上焦或失焦
        view.onClickListener = null;//点击监听

        view.scrollSpeed = 1;//单位时间滚动的距离
        view.scrollCell = 10;//单位时间（毫秒值）

        view.scrollAnimation = true;//滚动的补间动画是否执行

        view.frontView = null;//view的前置view

        //滚动监听器，其中有三个方法
        view.onScrollListener = {
            /**
             * 开始滚动
             * @param view 被监听的view
             * @param x 当前横坐标
             * @param y 当前纵坐标
             */
            onStartScroll: function (view, x, y) {
                // console.log("开始滚动：view.id:" + view.id + ",x:" + x + ",y:" + y);
            },
            /**
             * 结束滚动
             * @param view
             * @param x
             * @param y
             */

            onEndScroll: function (view, x, y) {
                // console.log("结束滚动：view.id:" + view.id + ",x:" + x + ",y:" + y);
            },
            /**
             * 滚动中
             * @param view
             * @param x
             * @param y
             */
            onScrolling: function (view, x, y) {
                // console.log("滚动中view.id:" + view.id + ",x:" + x + ",y:" + y);
            }
        };

        /**
         * 显示view
         */
        view.show = function () {
            view.getDom().style.visibility = "";
            view.getDom().style.display = "block";
        };

        /**
         * 隐藏view
         */
        view.hide = function () {
            view.getDom().style.visibility = "";
            view.getDom().style.display = "none";
        };


        /**
         * 是否显示
         * @returns {boolean}
         */
        view.isShowing = function () {
            var display = view.getDom().style.display;
            var visible = view.getDom().style.visibility;
            var isS = display != "none" && visible != "hidden";
            return isS;
        }

        /**
         * 绑定数据
         * @param data
         */
        view.bindData = function (data) {
            view.data = data;
        };

        /**
         * 绑定textView
         * @param textView
         */
        view.bindTextView = function (textView) {
            if (textView.viewType == "textView") {//viewType
                view.textView = textView;
                if (View.FocusView == view && !view.textView.isMarquee) {
                    view.textView.marquee();
                }
            }
        }

        /**
         * 设置焦点移动，上、下、左、右
         */
        view.setFocusChange = function (nextUp, nextDown, nextLeft, nextRight) {
            view.setFocusToUp(nextUp);
            view.setFocusToDown(nextDown);
            view.setFocusToLeft(nextLeft);
            view.setFocusToRight(nextRight);
        };

        /**
         * 单独设置焦点移动，上
         */
        view.setFocusToUp = function (nextUp) {
            view.nextUp = nextUp;
        };

        /**
         * 单独设置焦点移动，下
         */
        view.setFocusToDown = function (nextDown) {
            view.nextDown = nextDown;
        };


        /**
         * 单独设置焦点移动，左
         */
        view.setFocusToLeft = function (nextLeft) {
            view.nextLeft = nextLeft;
        };

        /**
         * 单独设置焦点移动，右
         */
        view.setFocusToRight = function (nextRight) {
            view.nextRight = nextRight;
        };

        view.setFocusChange(null, null, null, null);//先初始化按键

        /**
         * 请求上焦,先对当前焦点的失焦，然后再对view上焦
         */
        view.requestFocus = function () {
            if (!view || !view.id) {//无view或id
                return;
            }
            if (!view.getDom()) {//没有对应的dom
                console.log("error:" + view.id + "没有对应的dom");
                return;
            }
            if (!view.isShowing() && View.FocusView) {//有焦点时，不给隐藏控件上焦
                return;
            }

            if (View.FocusView) {
                View.FocusView.requestUnFocus();
            }
            view.frontView = View.FocusView;//记录前置焦点

            view.focus();
        };

        /**
         * 上焦
         */
        view.focus = function () {
            View.FocusView = view;
            if (!View.$$(view.id)) {
                console.log("error:" + view.id + "没有对应的dom,上焦异常");
                return;
            }
            View.$$(view.id).className = view.focusStyle;

            if (view.textView) {
                if (!view.textView.isMarquee) {
                    view.textView.marquee();
                }
            }
            if (view.onFocusChangeListener) {
                view.onFocusChangeListener(view, true);
            }


        }

        /**
         * 请求失焦
         */
        view.requestUnFocus = function () {
            if (view)
                view.unFocus();
        };

        /**
         * 失焦
         */
        view.unFocus = function () {
            if (!View.$$(view.id)) {
                return;
            }
            View.$$(view.id).className = view.unFocusStyle;
            if (view.onFocusChangeListener) {
                view.onFocusChangeListener(view, false);
            }
            if (view.textView) {
                view.textView.clearMarquee();
            }
        };

        /**
         * 自己移除自己是不允许的
         */
        view.remove = function () {
            if (view.textView) {
                view.textView.remove();
            }
            if (View.FocusView != view) {//当前焦点不能被回收
                View.viewMap.remove(view.id);//从控件缓存中删除view
                view = null;
            }

        };

        /**
         * className改为上焦状态，只改动className
         */
        view.setFocusStyle = function () {
            View.$$(view.id).className = view.focusStyle;
        };

        /**
         * className改为选中状态，只改动className
         */
        view.setSelectStyle = function () {
            var dom = View.$$(view.id);
            if (dom) {
                dom.className = view.selectStyle;
            }
        };

        /**
         * className改为失焦状态，只改动className
         */
        view.setUnFocusStyle = function () {
            var dom = View.$$(view.id);
            if (dom) {
                dom.className = view.unFocusStyle;
            }
        };

        /**
         * 设置内部节点
         * @param html
         */
        view.setHtml = function (html) {
            view.getDom().innerHTML = html;
        };

        /**
         * 统一获取宽，便于兼容
         * @return {*|number} idth
         */
        view.getWidth = function () {
            return View.getViewWidth(view.getDom());
        };

        /**
         * 统一获取高，便于兼容
         * @return {*|number} height
         */
        view.getHeight = function () {
            return View.getViewHeight(view.getDom());
        };

        /**
         * 统一获取横向坐标
         * @return {*|number}
         */
        view.getLeft = function () {
            return View.getLeft(view.getDom());
        };

        /**
         * 统一获取纵向坐标
         * @return {*|number}
         */
        view.getTop = function () {
            return View.getTop(view.getDom());
        };

        /**
         * 统一获取滚动属性，便于兼容
         * @return {*|number} scrollLeft
         */
        view.getScrollLeft = function () {
            return View.getScrollLeft(view.getDom());
        };

        /**
         * 统一设置滚动属性，便于兼容
         * @param scrollLeft
         */
        view.setScrollLeft = function (scrollLeft) {
            // console.log(view.id + ",scrollLeft:" + scrollLeft);
            View.setScrollLeft(view.getDom(), scrollLeft);
        };

        /**
         * 统一获取滚动属性，便于兼容
         * @return {*|number} scrollTop
         */
        view.getScrollTop = function () {
            return View.getScrollTop(view.getDom());
        };

        /**
         * 统一设置滚动属性，便于兼容
         * @param scrollTop
         */
        view.setScrollTop = function (scrollTop) {
            // console.log(view.id + ",scrollTop:" + scrollTop);
            View.setScrollTop(view.getDom(), scrollTop);
        };

        /**
         * 统一获取滚动属性，便于兼容
         * @return {*|number} scrollHeight
         */
        view.getScrollHeight = function () {
            return View.getScrollHeight(view.getDom());
        };

        /**
         * 统一获取滚动属性，便于兼容
         * @return {*|number} scrollWidth
         */
        view.getScrollWidth = function () {
            return View.getScrollWidth(view.getDom());
        };

        /**
         * 设置焦点变化监听
         */
        view.setOnFocusChangeListener = function (onFocusChangeListener) {
            if (view.onFocusChangeListener) {
                view.onFocusChangeListener = onFocusChangeListener;
            } else {
                view.onFocusChangeListener = onFocusChangeListener;
                if (!view.onFocusChangeListener) {//置空
                    return;
                }
                if (!View.isViewCreating) {//外部页面创建流程
                    //给当前焦点设置焦点变化监听，view.getDom().className==view.focusStyle表示创建并已上焦，否则为上焦动作在创建view之前
                    if (View.FocusView == view && view.getDom().className == view.focusStyle) {
                        view.onFocusChangeListener(view, true);
                    }
                }

            }


        };

        /**
         * 设置点击监听
         */
        view.setOnClickListener = function (onClickListener) {
            view.onClickListener = onClickListener;
        };

        /**
         * 设置滚动监听
         * @param onScrollListener
         */
        view.setOnScrollListener = function (onScrollListener) {
            if (onScrollListener.onStartScroll && onScrollListener.onEndScroll && onScrollListener.onScrolling) {
                view.onScrollListener = onScrollListener;
            } else {
                console.log("error:onScrollListener中缺少必要的方法！");
            }
        };

        /**
         * 获取view的dom节点
         * @returns {*|HTMLElement}
         */
        view.getDom = function () {
            return View.$$(view.id);
        }

        /**
         * 只有当view超过父布局才会执行,注意宽度的影响，还有overflow
         * 使用滚动到方法，可以完美使用
         */
        view.scrollHorizontal = function (scrollX) {

            var scrollLeft = view.getScrollLeft();
            view.scrollHorizontalTo(scrollLeft + scrollX);

        };

        /**
         * 只有当view超过父布局才会执行，注意高度的影响，还有overflow
         * 使用滚动到方法，可以完美使用
         */
        view.scrollVertical = function (scrollY) {

            var scrollTop = view.getScrollTop();
            view.scrollVerticalTo(scrollTop + scrollY);
        };

        /**
         * 只有当view超过父布局才会执行，注意高度的影响，还有overflow
         */
        view.scrollVerticalTo = function (y) {
            if (view.getScrollTop() == y) {
                return;
            }

            if (view.isScrolling || view.scrollVerticalTimer) {
                view.isScrolling = false;
                view.scrollOrientation = -1;
                clearTimeout(view.scrollVerticalTimer);
            }

            if (y < 0) {
                y = 0;
            }

            if (!view.scrollAnimation || View.isViewCreating) {//关闭滚动效果或页面创建中
                view.onScrollListener.onStartScroll(view, 0, view.getScrollTop());
                view.setScrollTop(y);
                view.onScrollListener.onEndScroll(view, 0, y);
                return;
            }

            if (y > view.getScrollHeight() - view.getHeight()) {
                y = view.getScrollHeight() - view.getHeight();
            }

            var speed = view.scrollSpeed;
            if (Math.abs(view.getScrollTop() - y) > 30 * speed) {
                speed = Math.abs(view.getScrollTop() - y) / 30 + 1;
                speed = parseInt(speed);
            }
            // console.log("纵向滚动速度：" + speed);

            if (!view.isScrolling) {
                view.onScrollListener.onStartScroll(view, 0, view.getScrollTop());
            }

            view.startScrollVerticalTo(y, speed);
        };

        /**
         * 只有当view超过父布局才会执行，注意款度的影响，还有overflow
         */
        view.scrollHorizontalTo = function (x) {
            if (view.getScrollLeft() == x) {
                return;
            }

            if (view.isScrolling || view.scrollHorizontalTimer) {
                view.isScrolling = false;
                view.scrollOrientation = -1;
                clearTimeout(view.scrollHorizontalTimer);
            }

            if (x < 0) {
                x = 0;
            }

            if (!view.scrollAnimation || View.isViewCreating) {//关闭滚动效果或页面创建中
                view.onScrollListener.onStartScroll(view, view.getScrollLeft(), 0);
                view.setScrollLeft(x);
                view.onScrollListener.onEndScroll(view, x, 0);
                return;
            }

            if (x > view.getScrollWidth() - view.getWidth()) {
                x = view.getScrollWidth() - view.getWidth();
            }

            var speed = view.scrollSpeed;
            if (Math.abs(view.getScrollLeft() - x) > 30 * speed) {
                speed = Math.abs(view.getScrollLeft() - x) / 30 + 1;
                speed = parseInt(speed);
            }
            // console.log("横向向滚动速度：" + speed);
            if (!view.isScrolling) {
                view.onScrollListener.onStartScroll(view, view.getScrollLeft(), 0);
            }

            view.startScrollHorizontalTo(x, speed);
        };

        /**
         * 开始纵向滚动到
         * @param y
         * @param scrollSpeed
         */
        view.startScrollVerticalTo = function (y, scrollSpeed) {
            var top = view.getScrollTop();
            if (Math.abs(top - y) < scrollSpeed) {
                view.isScrolling = false;
                view.setScrollTop(y);
                view.onScrollListener.onEndScroll(view, 0, view.getScrollTop());
                return;
            }
            view.isScrolling = true;
            view.scrollOrientation = View.vertical;

            var scrollTop = 0;

            if (y > top) {
                scrollTop = top + scrollSpeed;
            } else {
                scrollTop = top - scrollSpeed;
            }

            view.setScrollTop(scrollTop);

            view.onScrollListener.onScrolling(view, 0, view.getScrollTop());

            view.scrollVerticalTimer = setTimeout(function () {
                if (view) {//因为view可被删除，所以这里需要判断
                    view.startScrollVerticalTo(y, scrollSpeed);
                }
            }, view.scrollCell);
        };

        /**
         * 开始横向滚动到
         * @param x
         * @param scrollSpeed
         */
        view.startScrollHorizontalTo = function (x, scrollSpeed) {
            var left = view.getScrollLeft();
            if (Math.abs(left - x) < scrollSpeed) {
                view.isScrolling = false;
                view.setScrollLeft(x);
                view.onScrollListener.onEndScroll(view, view.getScrollLeft(), 0);
                return;
            }
            view.isScrolling = true;
            view.scrollOrientation = View.horizontal;

            var scrollLeft = 0;
            if (x > left) {
                scrollLeft = left + scrollSpeed;
            } else {
                scrollLeft = left - scrollSpeed;
            }

            view.setScrollLeft(scrollLeft);

            view.onScrollListener.onScrolling(view, view.getScrollLeft(), 0);

            view.scrollHorizontalTimer = setTimeout(function () {
                if (view) {//因为view可被删除，所以这里需要判断
                    view.startScrollHorizontalTo(x, scrollSpeed);
                }
            }, view.scrollCell);
        };

        /**
         * 获取标签中的属性，并设置
         */
        view.setAttributeParam = function () {
            var dom = view.getDom();
            if (!dom) {
                return;
            }

            //方向
            var nextUp = dom.getAttribute(View.attributeKey.up);
            if (nextUp) {
                view.setFocusToUp(function () {
                    var view = getViewById(nextUp);
                    if (view) {
                        view.requestFocus();
                    } else {
                        if (window[nextUp]) {
                            window[nextUp]();
                        } else {
                            console.log("warn:view-up设置错误");
                        }
                    }
                });
            }

            var nextDown = dom.getAttribute(View.attributeKey.down);
            if (nextDown) {
                view.setFocusToDown(function () {
                    var view = getViewById(nextDown);
                    if (view) {
                        view.requestFocus();
                    } else {
                        if (window[nextDown]) {
                            window[nextDown]();
                        } else {
                            console.log("warn:view-down设置错误");
                        }
                    }
                });
            }

            var nextLeft = dom.getAttribute(View.attributeKey.left);
            if (nextLeft) {
                view.setFocusToLeft(function () {
                    var view = getViewById(nextLeft);
                    if (view) {
                        view.requestFocus();
                    } else {
                        if (window[nextLeft]) {
                            window[nextLeft]();
                        } else {
                            console.log("warn:view-left设置错误");
                        }
                    }
                });
            }

            var nextRight = dom.getAttribute(View.attributeKey.right);
            if (nextRight) {
                view.setFocusToRight(function () {
                    var view = getViewById(nextRight);
                    if (view) {
                        view.requestFocus();
                    } else {
                        if (window[nextRight]) {
                            window[nextRight]();
                        } else {
                            console.log("warn:view-right设置错误");
                        }
                    }
                });
            }

            //点击监听
            var onClickLister = dom.getAttribute(View.attributeKey.click);
            if (onClickLister) {
                view.setOnClickListener(window[onClickLister]);
            }

            //焦点变化监听
            var onFocusChangeListener = dom.getAttribute(View.attributeKey.focusChange);
            if (onFocusChangeListener) {
                view.setOnFocusChangeListener(window[onFocusChangeListener]);
            }

            //滚动监听
            var onScrollListener = dom.getAttribute(View.attributeKey.scroll);
            if (onScrollListener) {
                view.setOnScrollListener(window[onScrollListener]);
            }

            //动画开启
            var animation = dom.getAttribute(View.attributeKey.animation);
            if (animation == "0" || animation == "false") {//0或false为关闭动画
                view.scrollAnimation = false;
            } else if (animation == "1" || animation == "true") {//开启,默认不处理
                view.scrollAnimation = true;
            }
        };
        //设置
        view.setAttributeParam();

        return view;
    },

    /**
     * 获取div
     * @param {} id
     */
    $$: function (id) {
        return document.getElementById(id);
    },

    /**
     * 获取宽
     * @param {} id
     */
    getViewWidth: function (dom) {
        var w = 0;
        if (dom) {
            w = dom.offsetWidth;
        }
        return w;
    },

    /**
     * 获取高度
     * @param {} id
     */
    getViewHeight: function (dom) {
        var h = 0;
        if (dom) {
            h = dom.offsetHeight;
        }

        return h;
    },

    /**
     * 获取横向坐标
     * @param id
     * @return {number}
     */
    getLeft: function (dom) {
        var l = 0;
        if (dom) {
            l = dom.offsetLeft;
        }
        return l;
    },

    /**
     * 获取纵向坐标
     * @param id
     * @return {number}
     */
    getTop: function (dom) {
        var t = 0;
        if (dom) {
            t = dom.offsetTop;
        }
        return t;
    },

    /**
     * 获取纵向滚动距离
     * @param id
     * @return {number}
     */
    getScrollTop: function (dom) {
        //兼容不支持滚动属性的盒子获取
        var scrollTop = dom.scrollTop;

        return scrollTop;
    },

    /**
     * 设置纵向滚动距离
     * @param id
     * @param scrollTop
     */
    setScrollTop: function (dom, scrollTop) {
        //兼容不支持滚动属性的盒子获取
        dom.scrollTop = scrollTop;
    },

    /**
     * 获取横向滚动距离
     * @param id
     * @return {number}
     */
    getScrollLeft: function (dom) {
        //兼容不支持滚动属性的盒子获取
        var scrollLeft = dom.scrollLeft;

        return scrollLeft;
    },

    /**
     * 设置横向滚动距离
     * @param id
     * @param scrollLeft
     */
    setScrollLeft: function (dom, scrollLeft) {
        //容不支持滚动属性的盒子获取
        // console.log("scrollLeft:" + scrollLeft);
        dom.scrollLeft = scrollLeft;
    },

    /**
     * 获取内部子控件所占据的高度值
     * @param id
     * @return {number}
     */
    getScrollHeight: function (dom) {
        //兼容不支持滚动属性的盒子获取
        var scrollHeight = dom.scrollHeight;

        return scrollHeight;
    },

    /**
     * 获取内部子控件所占据的宽度值
     * @param id
     * @return {number}
     */
    getScrollWidth: function (dom) {
        //兼容不支持滚动属性的盒子获取
        var scrollWidth = dom.scrollWidth;

        return scrollWidth;
    },

    /**
     * 获取dom的当前样式
     * @param dom
     * @return {null|*|CSSStyleDeclaration|string}
     */
    getCurrentStyle: function (dom) {
        if (!dom instanceof Element) {
            return null;
        }
        var style = getComputedStyle(dom) || dom.currentStyle || dom.style;
        return style;
    },

    /**
     * 获取节点显示大小
     * 不计算class带有item的节点的子节点
     * @param dom
     * @return {{width: number, height: number}|null}
     */
    getVisibleSize: function (dom) {
        if (!dom instanceof Element) {
            return null;
        }
        var size = {
            width: dom.offsetWidth,
            height: dom.offsetHeight
        }
        var children = dom.children;

        if (dom.className.indexOf("item") > -1 || View.getCurrentStyle(dom).overflow == "hidden") {
            return size;
        }
        if (children.length == 0) {
            return size;
        }

        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (View.getCurrentStyle(child).display == "none" || View.getCurrentStyle(child).visibility == "hidden") {
                continue;
            }
            //获取子节点占位
            var position = {
                left: child.offsetLeft,
                top: child.offsetTop
            }

            var childSize = View.getVisibleSize(child);
            if (!childSize) {
                continue;
            }

            var seatSize = {
                width: childSize.width + position.left,
                height: childSize.height + position.top
            }

            if (seatSize.width > size.width) {
                size.width = seatSize.width;
            }

            if (seatSize.height > size.height) {
                size.height = seatSize.height;
            }

        }

        return size;
    },

    /**
     * 执行next,next可以是方法，或者view
     * @param {*} next
     */
    next: function (next) {
        if (!!!next) {
            return;
        }
        if (next instanceof Function) {
            // view.requestUnFocus();
            (next)();
        } else if (typeof (next) == "object" && next.requestFocus) {
            next.requestFocus();
        }
    },

    /**
     * 把html转成节点
     * @param html
     * @return {HTMLCollection}
     */
    parseDom: function (html) {
        var ele = document.createElement("div");
        ele.innerHTML = html;
        return ele.children;
    },

    /**
     * 获取childId对应的节点对于fatherId对应的节点左上角的绝对距离
     * @param childId
     * @param fatherView
     * @returns {*|{top: number, left: number}}
     */
    getAbsolutePositionBy: function (childId, fatherView) {
        var position = AreaView.getPositionBy(childId, fatherView);

        position.left -= fatherView.getScrollLeft();
        position.top -= fatherView.getScrollTop();

        return position;
    },

    /**
     * 将childId对应的节点对于fatherId对应的节点左上角的绝对距离设置成position
     * @param childId
     * @param fatherView
     * @param position
     * @returns {*}
     */
    setAbsolutePositionBy: function (childId, fatherView, position) {
        var realPosition = AreaView.getPositionBy(childId, fatherView);//获取id对应的节点对于fatherId对应的节点布局距离

        fatherView.setScrollLeft(realPosition.left - (position.left - 0));//避免
        fatherView.setScrollTop(realPosition.top - (position.top - 0));

        return position;
    },

    /**
     * fatherView纵向滑动到子view
     * @param {*} fatherView
     * @param {*} childView
     * @param {*} scrollLocate
     * 提示：也可以用在普通的View滚动到内部的某个子view
     */
    scrollVerticalToView: function (fatherView, childView, scrollLocate) {
        var childDom = childView.getDom();
        View.scrollVerticalToDom(fatherView, childDom, scrollLocate);
    },

    /**
     * fatherView纵向滑动到childDom
     * @param {*} fatherView
     * @param {*} childDom
     * @param {*} scrollLocate
     * 提示：也可以用在普通的View滚动到内部的某个dom
     */
    scrollVerticalToDom: function (fatherView, childDom, scrollLocate) {
        if (fatherView.getHeight() < View.getViewHeight(childDom)) {
            var top = AreaView.getPositionByDom(childDom, fatherView.getDom()).top;
            fatherView.scrollVerticalTo(top);
            return;
        }

        if (scrollLocate == View.scrollCenter) {
            var position = AreaView.getPositionByDom(childDom, fatherView.getDom());
            var fatherHeight = fatherView.getHeight();
            var childHeight = View.getViewHeight(childDom);
            var scrollHeight = fatherView.getScrollHeight();
            var scrollTop = position.top - (fatherHeight - childHeight) / 2;
            if (scrollTop + childHeight > scrollHeight) {
                scrollTop = scrollHeight - childHeight;
            }
            scrollTop = scrollTop < 0 ? 0 : scrollTop;

            fatherView.scrollVerticalTo(scrollTop);
            return;
        }

        if (scrollLocate == View.scrollStart) {
            var position = AreaView.getPositionByDom(childDom, fatherView.getDom());
            var scrollTop = position.top;
            fatherView.scrollVerticalTo(scrollTop);
            return;
        }

        if (scrollLocate == View.scrollEnd) {
            var position = AreaView.getPositionByDom(childDom, fatherView.getDom());
            var scrollTop = position.top - fatherView.getHeight() + View.getViewHeight(childDom);
            fatherView.scrollVerticalTo(scrollTop);
            return;
        }

        var height = fatherView.getHeight();
        if (height == 0) {
            console.log("warn:" + fatherView.id + "已隐藏、高度未设置或内部数据长度为0！");
            return;
        }

        var top = AreaView.getPositionByDom(childDom, fatherView.getDom()).top;
        var num = top - height;

        var itemHeight = View.getViewHeight(childDom);

        var scrollTop = fatherView.getScrollTop();
        if (top - scrollTop <= 0) {
            fatherView.scrollVerticalTo(top);
            // console.log("向上滚动");
        }
        if (top - scrollTop >= height - itemHeight) {
            // console.log("向下滚动");
            fatherView.scrollVerticalTo(num + itemHeight);
        } else {
            // console.log("不滚动");
        }
    },

    /**
     * fatherView横向滑动到childView
     * @param {*} fatherView
     * @param {*} childView
     * 提示：也可以用在普通的View滚动到内部的某个子view
     */
    scrollHorizontalToView: function (fatherView, childView, scrollLocate) {
        var childDom = childView.getDom();
        View.scrollHorizontalToDom(fatherView, childDom, scrollLocate);
    },

    /**
     * fatherView横向滑动到childDom
     * @param {*} fatherView
     * @param {*} childDom
     * 提示：也可以用在普通的View滚动到内部的某个dom
     */
    scrollHorizontalToDom: function (fatherView, childDom, scrollLocate) {
        if (fatherView.getWidth() < View.getViewWidth(childDom)) {
            var left = AreaView.getPositionByDom(childDom, fatherView.getDom()).left;
            fatherView.scrollHorizontalTo(left);
            return;
        }

        if (scrollLocate == View.scrollCenter) {
            var position = AreaView.getPositionByDom(childDom, fatherView.getDom());
            var fatherWidth = fatherView.getWidth();
            var childWidth = View.getViewWidth(childDom);
            var scrollWidth = fatherView.getScrollWidth();
            var scrollLeft = position.left - (fatherWidth - childWidth) / 2;
            if (scrollLeft + childWidth > scrollWidth) {
                scrollLeft = scrollWidth - childWidth;
            }
            scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
            fatherView.scrollHorizontalTo(scrollLeft);
            return;
        }

        if (scrollLocate == View.scrollStart) {
            var position = AreaView.getPositionByDom(childDom, fatherView.getDom());
            var scrollLeft = position.left;
            fatherView.scrollHorizontalTo(scrollLeft);
            return;
        }

        if (scrollLocate == View.scrollEnd) {
            var position = AreaView.getPositionByDom(childDom, fatherView.getDom());
            var scrollLeft = position.left - fatherView.getWidth() + View.getViewWidth(childDom);
            fatherView.scrollHorizontalTo(scrollLeft);
            return;
        }

        var width = fatherView.getWidth();
        if (width == 0) {
            console.log("error:" + fatherView.id + "已隐藏或内部数据长度为0！");
        }

        var left = AreaView.getPositionByDom(childDom, fatherView.getDom()).left;
        var num = left - width;

        var itemWidth = View.getViewWidth(childDom);

        var scrollLeft = fatherView.getScrollLeft();
        if (left - scrollLeft <= 0) {
            fatherView.scrollHorizontalTo(left);
            // console.log("向右滚动");
        }
        if (left - scrollLeft >= width - itemWidth) {
            // console.log("向左滚动");
            fatherView.scrollHorizontalTo(num + itemWidth);
        } else {
            // console.log("不滚动");
        }
    },

    viewUp: function () {
        var view = View.FocusView;
        if (view) {
            View.keyDirection = View.keyUp;
            View.next(view.nextUp);
            View.keyDirection = View.keyNull;
        }
    },

    viewDown: function () {
        var view = View.FocusView;
        if (view) {
            View.keyDirection = View.keyDown;
            View.next(view.nextDown);
            View.keyDirection = View.keyNull;
        }
    },

    viewLeft: function () {
        var view = View.FocusView;
        if (view) {
            View.keyDirection = View.keyLeft;
            View.next(view.nextLeft);
            View.keyDirection = View.keyNull;
        }
    },

    viewRight: function () {
        var view = View.FocusView;
        if (view) {
            View.keyDirection = View.keyRight;
            View.next(view.nextRight);
            View.keyDirection = View.keyNull;
        }
    },

    viewClick: function () {
        var view = View.FocusView;
        if (view && view.onClickListener) {
            view.onClickListener(view);
        }
    }
};

/**
 * 通过id获取已创建的
 * 如果已创建，返回之前创建的view或其他控件
 * 如果未创建，则返回null
 * @param id
 * @returns {null|*}
 */
var getViewById = function (id) {
    if (View.viewMap.get(id)) {
        return View.viewMap.get(id);
    }
    // console.log("warn:"+id+"未被创建");
    return null;
}

/**
 * 滚动视图
 * 该控件存在的意义时兼容部分机顶盒不支持scrollTop和scrollLeft
 * 加强对滚动的控制
 */
var ScrollView = {
    createNew: function (id) {
        var scrollView = View.createNew(id);
        scrollView.viewType = "scrollView";
        if (scrollView.scroller && scrollView.scroller.getDom()) {
            return scrollView;
        }

        scrollView.scroller_id = id + "_scroller";
        scrollView.scroller = null;//在createScroller方法中创建

        //创建滚动视图的滚动器，并设置属性
        ScrollView.createScroller(scrollView);

        //将view中的获取滚动属性的方法重写
        /**
         * 获取滚动top值
         * @return {number}
         */
        scrollView.getScrollTop = function () {
            var top = scrollView.scroller.getDom().style.top + "";
            top = top.replace("px", "");
            top = 0 - parseInt(top);
            return top;
        };

        /**
         * 设置滚动top值
         */
        scrollView.setScrollTop = function (scrollTop) {
            // console.log(scrollView.id+",scrollTop:"+scrollTop);
            if (scrollTop > scrollView.getScrollHeight() - scrollView.getHeight()) {
                scrollTop = scrollView.getScrollHeight() - scrollView.getHeight();
            }
            scrollView.scroller.getDom().style.top = "-" + scrollTop + "px";
        };

        /**
         * 获取滚动left值
         * @return {number}
         */
        scrollView.getScrollLeft = function () {
            var left = scrollView.scroller.getDom().style.left + "";
            left = left.replace("px", "");
            left = 0 - parseInt(left);
            return left;
        };

        /**
         * 设置滚动left值
         */
        scrollView.setScrollLeft = function (scrollLeft) {
            // console.log(scrollView.id+",scrollLeft:"+scrollLeft);
            if (scrollLeft > scrollView.getScrollWidth() - scrollView.getWidth()) {
                scrollLeft = scrollView.getScrollWidth() - scrollView.getWidth();
            }
            scrollView.scroller.getDom().style.left = "-" + scrollLeft + "px";
        };

        /**
         * 计算滚动高度值
         */
        scrollView.getScrollHeight = function () {

            var height = scrollView.scroller.getDom().style.height + "";
            height = height.replace("px", "");
            var scrollHeight = parseInt(height);

            if (scrollHeight <= 0) {//如果滚动高度为0，重新计算；有可能是原本时隐藏的，再显示
                scrollView.measure();
                height = scrollView.scroller.getDom().style.height + "";
                height = height.replace("px", "");
                scrollHeight = parseInt(height);
            }

            return scrollHeight;
        };

        /**
         * 计算滚动宽度值
         */
        scrollView.getScrollWidth = function () {

            var width = scrollView.scroller.getDom().style.width + "";
            width = width.replace("px", "");
            var scrollWidth = parseInt(width);

            if (scrollWidth <= 0) {//如果滚动宽度为0，重新计算；有可能是原本时隐藏的，再显示
                scrollView.measure();
                width = scrollView.scroller.getDom().style.width + "";
                width = width.replace("px", "");
                scrollWidth = parseInt(width);
            }
            return scrollWidth;
        };

        //设置内部视图的方法
        scrollView.setHtml = function (html) {
            if (!scrollView.scroller.getDom()) {//当html重新生成时会出现scroller的dom不存在的情况
                ScrollView.createScroller(scrollView);
            }
            scrollView.scroller.getDom().innerHTML = html;
            scrollView.measure();
        };

        scrollView.show = function () {
            scrollView.getDom().style.display = "block";
            scrollView.getDom().style.visibility = "";

            scrollView.scroller.getDom().style.display = "block";
            scrollView.scroller.getDom().style.visibility = "";
        };

        /**
         * 测量滚动器的宽高
         */
        scrollView.measure = function () {
            var width = scrollView.getWidth();
            var height = scrollView.getHeight();
            scrollView.scroller.getDom().style.width = width + "px";//重置滚动器宽
            scrollView.scroller.getDom().style.height = height + "px";//重置滚动器高

            var scrollerSize = View.getVisibleSize(scrollView.scroller.getDom());//使用实际显示大小

            width = width > scrollerSize.width ? width : scrollerSize.width;
            height = height > scrollerSize.height ? height : scrollerSize.height;

            scrollView.scroller.getDom().style.width = width + "px";
            scrollView.scroller.getDom().style.height = height + "px";
        };

        scrollView.measure();

        /**
         * 获取标签中的属性，并设置
         */
        scrollView.setAttributeParam = function () {
            var dom = scrollView.getDom();
            if (!dom) {
                return;
            }
            //点击监听,在View中处理
            //焦点变化监听,在View中处理,一般滚动控件不上焦
            //滚动监听,在View中处理
        };
        //设置
        scrollView.setAttributeParam();

        return scrollView;
    },

    /**
     * 为scrollView创建滚动器
     * @param scrollView
     */
    createScroller: function (scrollView) {
        var scroller_dom = document.createElement("div");
        scroller_dom.className = scrollView.getDom().className;
        scroller_dom.style.position = "absolute";
        scroller_dom.style.left = "0px";
        scroller_dom.style.top = "0px";
        scroller_dom.style.overflow = "visible";
        scroller_dom.style.background = "transparent";
        scroller_dom.style.display = "block";
        scroller_dom.style.visibility = "";
        scroller_dom.id = scrollView.scroller_id;

        var innerHtml = scrollView.getDom().innerHTML;

        scrollView.getDom().innerHTML = "";
        scrollView.getDom().appendChild(scroller_dom);

        scroller_dom.innerHTML = innerHtml;
        scrollView.scroller = View.createNew(scrollView.scroller_id);
    }

}

/**
 * 主要用来跑马灯效果
 * scrollSpeed滚动单位 跑马灯速度值，越大越快
 * 如果需要节省性能，scrollCell 滚动一个单位的时间，越小越耗性能，速度越快；越大反之
 */
var TextView = {
    createNew: function (id) {
        var textView = ScrollView.createNew(id);
        textView.viewType = "textView";
        textView.text = View.$$(id).innerText;
        textView.scrollCell = 20;
        textView.scrollSpeed = 1;

        //在使用过程中，会存在反复createNew，当textView在view池中已创建，则不初始化属性
        textView.isMarquee = textView.isMarquee || false;//是否在执行跑马灯
        textView.needMarquee = textView.needMarquee || false;//是否需要执行跑马灯

        textView.scrollTimer = textView.scrollTimer || null;//跑马灯的timer
        textView.txtObj = textView.txtObj || null;//textView的dom节点

        /**设置文字 */
        textView.setText = function (txt) {
            textView.setHtml(txt);
            textView.text = txt;
            if (textView.needMarquee) {
                textView.clearMarquee();
                textView.marquee();
            }
        }

        /**
         * 执行跑马灯
         */
        textView.marquee = function () {
            textView.needMarquee = true;
            if (textView.isMarquee) {
                return;
            }

            if (!textView.text) {
                textView.text = View.$$(id).innerText;
            }

            if (textView.scrollTimer) {
                clearTimeout(textView.scrollTimer);
            }
            TextView.marquee(textView);
        };

        /**
         * 清除跑马灯
         */
        textView.clearMarquee = function () {
            textView.needMarquee = false;
            if (textView.isMarquee) {
                TextView.clearMarquee(textView);
                textView.isMarquee = false;
            }

        };

        textView.remove = function () {
            if (textView.isMarquee) {
                textView.clearMarquee();
            }
            View.viewMap.remove(textView.id);//从空间缓存中删除view的textView
            textView = null;
        };

        if (textView.isMarquee) {//如果创建的textView是之前创建过并且正在执行跑马灯
            textView.clearMarquee();//清除跑马灯
        }

        return textView;
    },

    //不建议直接调用marquee方法

    //文字跑马灯效果,代码begin
    marquee: function (textView) {
        TextView.textScroll(textView);
    },

    /**
     * 文字跑马灯效果调用这个方法<BEGIN>滚动
     * @param textView
     */
    textScroll: function (textView) {
        var htmlStr = '<span id="' + textView.id + '_txt">' + textView.text + '</span><span id="' + textView.id + '_copy"></span>';
        textView.setHtml(htmlStr);
        textView.txtObj = textView.getDom();
        if (textView.getScrollWidth() > textView.getWidth()) {
            View.$$(textView.id + '_copy').innerHTML = '　    ' + textView.text;
            textView.measure();
            TextView.startScroll(textView); //父元素向左循环移动(设置父元素scrollleft)
            textView.isMarquee = true;
        } else {
            textView.setHtml(textView.text);
            textView.isMarquee = false;
        }
    },

    /**
     * 父元素向左循环移动(设置父元素scrollLeft)
     */
    startScroll: function (textView) {
        var copy = View.$$(textView.id + '_copy');
        if (!copy && textView.isMarquee) {//兼容textView正在只执行跑马灯，但节点被异常修改的问题
            TextView.marquee(textView);
            return;
        }
        var a = copy.offsetWidth;
        if (textView.getScrollLeft() >= a) {
            textView.setScrollLeft(1);
        } else {
            var left = textView.getScrollLeft();
            textView.setScrollLeft(left + textView.scrollSpeed);
        }
        textView.scrollTimer = setTimeout(function () {
            if (!textView.getDom()) {
                textView.needMarquee = false;
                textView.isMarquee = false;
                return;
            }
            TextView.startScroll(textView);
        }, textView.scrollCell);
    },

    clearMarquee: function (textView) {
        TextView.clearTextStyle(textView);
    },

    /**
     * 清除滚动
     * @param textView
     */
    clearTextStyle: function (textView) {
        clearTimeout(textView.scrollTimer); //清除定时器

        textView.getDom().innerHTML = textView.text;
        // textView.setScrollLeft(0);
    }
    //文字跑马灯效果,代码end
};

/**
 *
 * 全局的返回键重写必须在Dialog.createNew之前执行，否则会有返回键触发异常
 * 父类是areaView
 */
var Dialog = {

    createNew: function (id) {
        View.$$(id).style.visibility = "";
        View.$$(id).style.display = "none";

        //然后创建
        var dialog = AreaView.createNew(id);//areaView的子类
        dialog.viewType = "dialog";
        //父类中定义的方法
        dialog.fatherFunction = {
            hide: dialog.hide,
            show: dialog.show
        };

        dialog.globalKeyBack = null;//全局的返回键方法

        dialog.requestFocus = function () {
            if (dialog.childViews.length >= 0) {
                dialog.childViews[0].requestFocus();//默认第一个子view为默认焦点
            } else {
                if (!View.FocusView) {
                    View.FocusView = dialog;
                }
            }
        }

        /**
         * 显示隐藏监听器
         * @param dialog
         * @param isShowing 现在的显示状态
         */
        dialog.onVisibleChangeListener = function (dialog, isShowing) {

        };

        //显示、隐藏，弹窗效果
        /**
         * 显示
         * @param id显示dialog时上焦的id,如果不传，则默认为第一个子控件
         */
        dialog.show = function (id) {
            if (dialog.isShowing()) {
                return;
            }

            dialog.visible(id);
        };

        /**
         * 隐藏动作
         */
        dialog.hide = function () {
            if (!dialog.isShowing()) {
                return;
            }

            dialog.invisible();
        };

        /**
         * 显示
         * @param id显示dialog时上焦的id
         */
        dialog.visible = function (id) {
            dialog.fatherFunction.show();
            if (dialog.onVisibleChangeListener) {
                dialog.onVisibleChangeListener(dialog, true);
            }

            dialog.frontView = View.FocusView;

            dialog.globalKeyBack = View.key.key_back_event;//这里赋值返回方法，为了兼容返回方法不是再全局定义的
            View.key.key_back_event = dialog.keyBack;//显示时拦截返回事件
            if (id) {
                var child = dialog.getChildViewById(id);
                if (child) {
                    child.requestFocus();
                    return;
                }
            }
            if (dialog.childViews.length > 0) {
                dialog.childViews[0].requestFocus();//默认上焦第一个子控件
            }
        };

        /**
         * 隐藏
         */
        dialog.invisible = function () {
            dialog.fatherFunction.hide();
            if (dialog.onVisibleChangeListener) {
                dialog.onVisibleChangeListener(dialog, false);
            }

            if (dialog.frontView && dialog.frontView != View.FocusView) {//焦点返回弹窗显示前的焦点
                dialog.frontView.requestFocus();
            }

            View.key.key_back_event = dialog.globalKeyBack;//隐藏后恢复返回事件
        };

        dialog.keyBack = function () {
            dialog.hide();
        };

        dialog.setOnVisibleChangeListener = function (onVisibleChangeListener) {
            dialog.onVisibleChangeListener = onVisibleChangeListener;
        }

        /**
         * 获取标签中的属性，并设置
         */
        dialog.setAttributeParam = function () {
            var dom = dialog.getDom();
            if (!dom) {
                return;
            }
            //child点击监听,areaView中处理
            //child焦点变化监听,areaView中处理

            //显示监听
            var onVisibleChangeListener = dom.getAttribute(View.attributeKey.visibleChange);
            if (onVisibleChangeListener) {
                dialog.setOnVisibleChangeListener(window[onVisibleChangeListener]);
            }

            //滚动监听,在父控件中处理

        };
        //设置
        dialog.setAttributeParam();

        return dialog;
    }

}


/**
 * listView.orientation方向字段,0:纵向，1：横向
 * 列表的子元素，如果需要跑马灯，id的必须是 listView.id+"_txt_"+index,hasMarquee=true可以不用外部操作
 * 所有在外部修改的方法，都需要在bindData之前调用
 * 如果需要修改按键规则，重写verticalKey（纵向）或horizontalKey（横向）内部某个或者整个
 * 注意：初始焦点尽量不能是列表id，如果需要给子元素上焦，子元素id是id+"_"+index
 */
var ListView = {

    createNew: function (id) {
        var listView = ScrollView.createNew(id);
        listView.viewType = "listView";
        listView.orientation = View.vertical;//0:纵向，1：横向
        listView.isLoop = true;//是否循环
        listView.isCirculate = false;//首尾相接循环开关,默认关
        listView.isFocusCenter = false;
        listView.data = [];//数据列表
        listView.idPrefix = id + "_";//子元素前置id
        listView.itemViews = [];//子元素view列表

        listView.selectView = null;//记忆view
        listView.needSelect = false;//失焦时显示驻留效果
        listView.hasMarquee = false;//每个子元素view中是否需要跑马灯
        listView.needMarqueeIdPrefix = listView.idPrefix + "txt_";//跑马灯的前缀

        listView.onItemClickListener = null;//子元素点击监听
        listView.onItemFocusChangeListener = null;//子元素焦点变化监听

        /**
         * 重写绑定数据方法
         * @param data
         */
        listView.bindData = function (data) {
            listView.clear();
            if (!data) {
                data = [];
            }
            listView.data = data;
            listView.refresh();
            if (View.FocusView == listView) {
                listView.itemViews[0].focus();
            }
        }

        /**
         * 刷新列表，重新构建listView
         */
        listView.refresh = function () {
            if (!listView.data || listView.data.length <= 0) {
                if (View.FocusView.id.indexOf(listView.idPrefix) == 0) {
                    if (listView.frontView) {
                        listView.frontView.focus();//前置焦点上焦
                        console.log("error:当前焦点在" + listView.id + "的子view上，由于" + listView.id + "没有子view,frontView：" + listView.frontView.id + " 上焦！");
                    } else {
                        console.log("error:" + listView.id + " is empty,frontView为空! ");
                    }
                }
                var htmlStr = "";
                listView.setHtml(htmlStr);
                return;
            }

            var divs = [];
            for (var i = 0; i < listView.data.length; i++) {
                var div = listView.adapter(listView.idPrefix, i, listView.data[i]);
                if (div == "") {
                    return;
                }
                divs.push(div);
            }

            var htmlStr = divs.join("");
            listView.setHtml(htmlStr);

            if (listView.isLoop && listView.isCirculate && listView.data.length >= 2) {
                if (listView.orientation == View.vertical) {//纵向
                    listView.distance = parseInt(View.$$(listView.idPrefix + "1").style.top) - parseInt(View.$$(listView.idPrefix + "0").style.top);
                } else {//横向
                    listView.distance = parseInt(View.$$(listView.idPrefix + "1").style.left) - parseInt(View.$$(listView.idPrefix + "0").style.left);
                }
            }

            listView.itemViews = [];

            for (var i = 0; i < listView.data.length; i++) {
                var itemView = View.createNew(listView.idPrefix + i);
                itemView.fatherView = listView;
                itemView.bindData(listView.data[i]);
                itemView.setOnFocusChangeListener(listView.itemFocusChange);//设置焦点变化监听
                itemView.setOnClickListener(listView.itemClickListener);//设置子元素点击监听
                if (listView.hasMarquee) {
                    try {
                        itemView.bindTextView(TextView.createNew(listView.needMarqueeIdPrefix + i));//绑定textView
                    } catch (e) {
                        console.log("bindTextView error：" + listView.id + "适配器的绑定TextView的id不规范或者不存在！");
                    }

                }

                var key = listView.orientation == View.vertical ? listView.verticalKey : listView.horizontalKey;//选择按键
                itemView.setFocusChange(key.up, key.down, key.left, key.right);
                listView.itemViews.push(itemView);
            }

            var index = listView.getCurrentIndex();
            if (index >= 0) {
                var animation = listView.scrollAnimation;
                if (listView.scrollAnimation) {
                    listView.scrollAnimation = false;
                }

                if (index >= listView.itemViews.length - 1) {
                    listView.itemViews[listView.itemViews.length - 1].focus();
                } else {
                    View.FocusView.focus();
                }

                console.log("info:" + View.FocusView.id + "上焦，处理初始焦点view没有对应的dom");

                if (animation) {
                    listView.scrollAnimation = true;
                }
            }
        };

        /**
         * 清楚列表中的数据及子view
         */
        listView.clear = function () {
            listView.data = [];//清除数据
            //取消跑马灯
            if (listView.hasMarquee) {
                for (var i = 0; i < listView.itemViews.length; i++) {
                    listView.itemViews[i].remove();
                }
            }
            listView.itemViews = [];
            listView.selectView = null;
            var htmlStr = "";
            listView.setHtml(htmlStr);

            if (listView.orientation == View.horizontal) {
                listView.setScrollLeft(0);
            } else {
                listView.setScrollTop(0);
            }
        }

        listView.requestFocus = function () {
            if (!listView.isShowing()) {
                return;
            }
            listView.frontView = View.FocusView;//记录前置焦点
            if (listView.selectView) {
                listView.selectView.requestFocus();
            } else {
                if (listView.itemViews.length <= 0) {
                    if (!View.FocusView) {
                        View.FocusView = listView;
                    } else {
                        console.log("error:" + listView.id + "数据为空或者适配器未重写！");
                    }
                } else {
                    listView.itemViews[0].requestFocus();
                }
            }

        }

        /**覆盖View中的方法*/
        listView.unFocus = function () {
        }

        /**
         * 子元素焦点变化后执行的
         */
        listView.itemFocusChange = function (view, hasFocus) {
            // console.log("view:"+view.id+",上焦："+hasFocus);
            if (listView.onItemFocusChangeListener) {
                listView.onItemFocusChangeListener(listView.getCurrentIndex(), view, hasFocus);
            }
            if (hasFocus) {
                //二层套用时，滚动
                if (listView.fatherView) {
                    if (listView.fatherView.viewType == "listView" || listView.fatherView.viewType == "gridView") {//列表套列表
                        var scrollLocate = listView.fatherView.isFocusCenter ? View.scrollCenter : View.scrollNormal;
                        if (listView.orientation == View.vertical) {
                            View.scrollVerticalToView(listView.fatherView, listView, scrollLocate)//滚动到listView
                        } else {
                            View.scrollHorizontalToView(listView.fatherView, listView, scrollLocate)//滚动到listView
                        }
                    } else if (listView.fatherView.viewType.indexOf("areaView") > -1 || listView.fatherView.viewType.indexOf("recycleView") > -1) {//区域套列表
                        listView.fatherView.scrollToChild(listView);
                    }
                }

                if (listView.selectView && listView.selectView != View.FocusView && listView.needSelect) {
                    listView.selectView.setUnFocusStyle();
                }

                listView.selectView = view;
                listView.circulate();//在滚动前计算位置
                if (listView.isFocusCenter) {
                    if (listView.orientation == View.vertical) {
                        View.scrollVerticalToView(listView, view, View.scrollCenter);
                    } else {
                        View.scrollHorizontalToView(listView, view, View.scrollCenter);
                    }
                } else {
                    if (listView.orientation == View.vertical) {
                        View.scrollVerticalToView(listView, view, View.scrollNormal);
                    } else {
                        View.scrollHorizontalToView(listView, view, View.scrollNormal);
                    }
                }
            } else {
                if (listView.needSelect) {
                    view.setSelectStyle();
                }

            }
        };

        /**
         * 实现循环滚动效果
         * 实现方式：改变坐标，将首item放置于尾，实现首尾相接
         *          在创建列表和滚动结束后，计算子元素
         *          所以当滚动结束前，首位子元素不会刷新，过快滚动造成首尾相接计算来不及
         * 注意：当滚动不停止，焦点切换频率过快时，循环效果会失效
         */
        listView.circulate = function () {
            if (listView.orientation == View.horizontal) {
                listView.circulateHorizontal();
            } else {
                listView.circulateVertical();
            }
        }

        /**
         * 横向循环，计算坐标已达到效果
         */
        listView.circulateHorizontal = function () {
            if (!listView.isLoop || !listView.isCirculate) {
                return;
            }
            var scrollWidth = listView.getScrollWidth();//滚动宽度
            var offsetWidth = listView.getWidth();//显示宽度
            var scrollLeft = listView.getScrollLeft();//滚动距离
            var distance = listView.distance;//每个字元素间距
            if (scrollWidth >= offsetWidth + 2 * distance) {//滚动宽度大于显示宽度与2倍间距之和
                var visibleNum = Math.ceil(offsetWidth / distance);
                // var index = listView.getCurrentIndex();
                var firstVisibleViewIndex = 0;//第一个显示的序号
                var minLeft = scrollWidth;
                for (var i = 0; i < listView.itemViews.length; i++) {
                    var itemView = listView.itemViews[i];
                    var left = parseInt(itemView.getDom().style.left);
                    if (left >= scrollLeft && left < scrollLeft + scrollWidth) {//计算出第一个显示的子元素
                        if (left < minLeft) {
                            firstVisibleViewIndex = i;
                            minLeft = left;
                        }
                        continue;
                    }
                }

                var sL = parseInt(listView.itemViews[firstVisibleViewIndex].getDom().style.left) - scrollLeft;

                if (listView.itemViews.length <= visibleNum) {
                    return;
                }

                // console.log("firstVisibleViewIndex:"+firstVisibleViewIndex+",visibleNum:"+visibleNum+",scrollLeft:"+scrollLeft);
                var leftNum = parseInt((listView.itemViews.length - visibleNum) / 2);//左边隐藏的子元素个数
                var rightNum = listView.itemViews.length - leftNum - visibleNum;//右边隐藏的子元素个数

                //显示左方的leftView
                for (var i = 0; i < leftNum; i++) {
                    var LI = firstVisibleViewIndex - (leftNum - i);
                    LI = LI < 0 ? LI + listView.itemViews.length : LI;
                    listView.itemViews[LI].getDom().style.left = distance * i + "px";
                    // console.log("LI index:"+LI/*+",left:"+listView.itemViews[LI].getDom().style.left*/);
                }

                //显示的view,visibleView
                for (var i = 0; i < visibleNum; i++) {
                    var VI = firstVisibleViewIndex + i;
                    VI = VI >= listView.itemViews.length ? VI - listView.itemViews.length : VI;
                    listView.itemViews[VI].getDom().style.left = distance * (leftNum + i) + "px";
                    // console.log("VI index:"+VI/*+",left:"+listView.itemViews[VI].getDom().style.left*/);
                }

                //显示右方的rightView
                for (var i = 0; i < rightNum; i++) {
                    var RI = firstVisibleViewIndex + visibleNum + i;
                    RI = RI >= listView.itemViews.length ? RI - listView.itemViews.length : RI;
                    listView.itemViews[RI].getDom().style.left = distance * (leftNum + visibleNum + i) + "px";
                    // console.log("RI index:"+RI/*+",left:"+listView.itemViews[RI].getDom().style.left*/);
                }

                var toScrollLeft = parseInt(listView.itemViews[firstVisibleViewIndex].getDom().style.left) - sL;
                listView.setScrollLeft(toScrollLeft);

                // console.log("scrollLeft:"+listView.getScrollLeft());
            }
        };

        /**
         * 纵向循环，计算坐标已达到效果
         */
        listView.circulateVertical = function () {
            if (!listView.isLoop || !listView.isCirculate) {
                return;
            }
            var scrollHeight = listView.getScrollHeight();//滚动宽度
            var offsetHeight = listView.getHeight();//显示宽度
            var scrollTop = listView.getScrollTop();//滚动距离
            var distance = listView.distance;//每个字元素间距
            if (scrollHeight >= offsetHeight + 2 * distance) {//滚动宽度大于显示宽度与2倍间距之和
                var visibleNum = Math.ceil(offsetHeight / distance);
                // var index = listView.getCurrentIndex();
                var firstVisibleViewIndex = 0;//第一个显示的序号
                var minTop = scrollHeight;
                for (var i = 0; i < listView.itemViews.length; i++) {
                    var itemView = listView.itemViews[i];
                    var top = parseInt(itemView.getDom().style.top);
                    if (top >= scrollTop && top < scrollTop + scrollHeight) {//计算出第一个显示的子元素
                        if (top < minTop) {
                            firstVisibleViewIndex = i;
                            minTop = top;
                        }
                        continue;
                    }
                }

                var sT = parseInt(listView.itemViews[firstVisibleViewIndex].getDom().style.top) - scrollTop;

                if (listView.itemViews.length <= visibleNum) {
                    return;
                }

                var topNum = parseInt((listView.itemViews.length - visibleNum) / 2);//上边隐藏的子元素个数
                var bottomNum = listView.itemViews.length - topNum - visibleNum;//下边隐藏的子元素个数

                //显示上方的topView
                for (var i = 0; i < topNum; i++) {
                    var TI = firstVisibleViewIndex - (topNum - i);
                    TI = TI < 0 ? TI + listView.itemViews.length : TI;
                    listView.itemViews[TI].getDom().style.top = distance * i + "px";
                }

                //显示的view，visibleView
                for (var i = 0; i < visibleNum; i++) {
                    var VI = firstVisibleViewIndex + i;
                    VI = VI >= listView.itemViews.length ? VI - listView.itemViews.length : VI;
                    listView.itemViews[VI].getDom().style.top = distance * (topNum + i) + "px";
                }

                //显示下方的bottomView
                for (var i = 0; i < bottomNum; i++) {
                    var BI = firstVisibleViewIndex + visibleNum + i;
                    BI = BI >= listView.itemViews.length ? BI - listView.itemViews.length : BI;
                    listView.itemViews[BI].getDom().style.top = distance * (topNum + visibleNum + i) + "px";
                }

                var toScrollTop = parseInt(listView.itemViews[firstVisibleViewIndex].getDom().style.top) - sT;
                listView.setScrollTop(toScrollTop);

            }
        };

        /**
         * 子元素点击监听
         * @param view
         */
        listView.itemClickListener = function (view) {
            if (listView.onItemClickListener) {
                var index = listView.getCurrentIndex();
                listView.onItemClickListener(index, view, listView.data[index]);
            }

        };
        /**
         * 纵向列表的按键
         */
        listView.verticalKey = {
            up: function () {
                if (listView.itemViews.length <= 1 && listView.isLoop) {
                    return;
                }
                var index = listView.getCurrentIndex();
                if (index == 0) {
                    if (listView.isLoop) {
                        listView.itemViews[listView.itemViews.length - 1].requestFocus();
                    } else {
                        View.next(listView.nextUp);
                    }

                } else {
                    listView.itemViews[index - 1].requestFocus();
                }
            },
            down: function () {
                if (listView.itemViews.length <= 1 && listView.isLoop) {
                    return;
                }
                var index = listView.getCurrentIndex();
                if (index == listView.itemViews.length - 1) {
                    if (listView.isLoop) {
                        listView.itemViews[0].requestFocus();
                    } else {
                        View.next(listView.nextDown);
                    }

                } else {
                    listView.itemViews[index + 1].requestFocus();
                }
            },
            left: function () {
                View.next(listView.nextLeft);
            },
            right: function () {
                View.next(listView.nextRight);
            }
        };

        /**
         * 横向列表的按键
         */
        listView.horizontalKey = {
            up: function () {
                View.next(listView.nextUp);
            },
            down: function () {
                View.next(listView.nextDown);
            },
            left: function () {
                if (listView.itemViews.length <= 1 && listView.isLoop) {
                    return;
                }
                var index = listView.getCurrentIndex();
                if (index == 0) {
                    if (listView.isLoop) {//是否循环，是：首位相接
                        listView.itemViews[listView.itemViews.length - 1].requestFocus();
                    } else {//否listView的左边焦点
                        View.next(listView.nextLeft);
                    }
                } else {
                    listView.itemViews[index - 1].requestFocus();
                }
            },
            right: function () {
                if (listView.itemViews.length <= 1 && listView.isLoop) {
                    return;
                }
                var index = listView.getCurrentIndex();
                if (index == listView.itemViews.length - 1) {
                    if (listView.isLoop) {
                        listView.itemViews[0].requestFocus();
                    } else {
                        View.next(listView.nextRight);
                    }
                } else {
                    listView.itemViews[index + 1].requestFocus();
                }
            }
        };

        /**
         * 获取当前的焦点序号
         */
        listView.getCurrentIndex = function () {
            var index = -1;
            if (View.FocusView && View.FocusView.id.indexOf(listView.idPrefix) == 0) {
                index = parseInt(View.FocusView.id.substring(listView.idPrefix.length), 10);
            }
            return index;
        };
        /**
         * 设置子元素监听
         * onItemClickListener参数
         * position:点击的序号
         * view:点击的子view
         * data:点击的子view对应的数据
         */
        listView.setOnItemClickListener = function (onItemClickListener) {
            listView.onItemClickListener = onItemClickListener;
        };

        /**
         * 设置子元素焦点变化监听
         * setOnItemFocusChangeListener参数
         * position:序号
         * view:焦点变化子view
         * hasFocus:是否上焦
         */
        listView.setOnItemFocusChangeListener = function (onItemFocusChangeListener) {
            if (listView.onItemFocusChangeListener) {
                listView.onItemFocusChangeListener = onItemFocusChangeListener;
            } else {
                listView.onItemFocusChangeListener = onItemFocusChangeListener;
                if (!listView.onItemFocusChangeListener) {//监听器置空
                    return;
                }
                var currentIndex = listView.getCurrentIndex();
                if (currentIndex > -1 && View.FocusView.getDom() && View.FocusView.getDom().className == View.FocusView.focusStyle) {
                    listView.onItemFocusChangeListener(currentIndex, View.FocusView, true);
                }
            }

        };


        /**
         * listView适配器
         * @param idPrefix
         * @param index
         * @param data
         * @returns {string}
         * 由于前期未想到适配器概念，方法命名上存在与用法上的差异，0.7.0功能和命名统一
         */
        listView.adapter = function (idPrefix, index, data) {
            console.log(listView.id + "适配器未重写,listView.adapter 必须在listView.bindData前调用");
            return "";
        };

        /**
         * 设置适配器
         */
        listView.setAdapter = function (adapter) {
            listView.adapter = adapter;
        };

        /**
         * 兼容老版本
         * 设置适配器,现已规范命名，建议使用setAdapter
         * @deprecated
         */
        listView.setBuildViewItem = function (buildViewItem) {
            listView.adapter = buildViewItem;
        };

        /**
         * 获取标签中的属性，并设置
         */
        listView.setAttributeParam = function () {
            var dom = listView.getDom();
            if (!dom) {
                return;
            }
            //item点击监听
            var onClickLister = dom.getAttribute(View.attributeKey.click);
            if (onClickLister) {
                listView.setOnItemClickListener(window[onClickLister]);
            }

            //item焦点变化监听
            var onFocusChangeListener = dom.getAttribute(View.attributeKey.focusChange);
            if (onFocusChangeListener) {
                listView.setOnItemFocusChangeListener(window[onFocusChangeListener]);
            }

            //滚动监听,在父控件中处理

            //适配器设置
            var adapter = dom.getAttribute(View.attributeKey.adapter);
            if (adapter) {
                listView.setAdapter(window[adapter]);
            }

            //属性设置
            //方向
            var orientation = dom.getAttribute(View.attributeKey.orientation);
            if (orientation == (View.horizontal + "") || orientation == "horizontal" || orientation == "h") {//1、h或horizontal为横向其他为纵向
                listView.orientation = View.horizontal;
            } else {
                listView.orientation = View.vertical;
            }
            //焦点是否循环
            var isLoop = dom.getAttribute(View.attributeKey.isLoop);
            if (isLoop == "0" || isLoop == "false") {//0或false为焦点不循环
                listView.isLoop = false;
            } else {//默认开启
                listView.isLoop = true;
            }
            //焦点是否循环
            var isCirculate = dom.getAttribute(View.attributeKey.isCirculate);
            if (isCirculate == "1" || isCirculate == "true") {//1或true为首位效果循环
                listView.isCirculate = true;
            } else {//默认不开启
                listView.isCirculate = false;
            }
            //焦点位置
            var scrollLocate = dom.getAttribute(View.attributeKey.scrollLocate);
            if (scrollLocate == "center") {//center为居中
                listView.isFocusCenter = true;
            } else {//默认不开启
                listView.isFocusCenter = false;
            }
            //跑马灯
            var hasMarquee = dom.getAttribute(View.attributeKey.hasMarquee);
            if (hasMarquee == "1" || hasMarquee == "true") {//1或true表示有跑马灯
                listView.hasMarquee = true;
            } else {//默认不开启
                listView.hasMarquee = false;
            }

            //驻留效果
            var needSelect = dom.getAttribute(View.attributeKey.needSelect);
            if (needSelect == "1" || needSelect == "true") {//1或true表示有驻留效果
                listView.needSelect = true;
            } else {//默认不开启
                listView.needSelect = false;
            }

        };
        //设置
        listView.setAttributeParam();

        return listView;
    },

    /**
     * listView纵向滑动到itemView
     * @param {*} listView
     * @param {*} itemView
     *
     * 该方法实现已移动到View中，保留该方法兼容老版本
     * @deprecated
     */
    scrollVerticalToView: function (listView, itemView) {
        View.scrollVerticalToView(listView, itemView, View.scrollNormal);
    },

    /**
     * listView横向滑动到itemView
     * @param {*} listView
     * @param {*} itemView
     *
     * 该方法实现已移动到View中，保留该方法兼容老版本
     * @deprecated
     */
    scrollHorizontalToView: function (listView, itemView) {
        View.scrollHorizontalToView(listView, itemView, View.scrollNormal);
    }

};
/**
 * orientation方向字段,0:纵向，1：横向
 * 由于是ListView的子类，基本用法相似
 */

var GridView = {

    createNew: function (id) {
        var gridView = ListView.createNew(id);
        gridView.viewType = "gridView";
        gridView.col = 3;//列数，只在orientation=View.vertical，生效
        gridView.row = 3;//行数，只在orientation=View.horizontal，生效

        /**
         * 重写listView中的适配器，计算gridView适配所需要的数据
         * @param idPrefix
         * @param index
         * @param data
         * @returns {string|*}
         */
        gridView.adapter = function (idPrefix, index, data) {
            var row = 0;
            var col = 0;
            if (gridView.orientation == View.vertical) {
                row = parseInt(index / gridView.col);
                col = index % gridView.col;
            } else {
                row = index % gridView.row;
                col = parseInt(index / gridView.row);
            }
            var div = gridView.gridAdapter(idPrefix, index, row, col, data);
            return div;
        };

        /**
         * gridView的适配器
         * @param idPrefix
         * @param index
         * @param row
         * @param col
         * @param data
         * @returns {string}
         */
        gridView.gridAdapter = function (idPrefix, index, row, col, data) {
            console.log(gridView.id + "适配器未重写,buildGridViewItem 必须在bindData前调用");
            return "";
        }


        /**
         * 设置gridView适配器
         * @param gridAdapter
         */
        gridView.setGridAdapter = function (gridAdapter) {
            gridView.gridAdapter = gridAdapter;
        }

        /**
         * 兼容老版本
         * 设置gridView适配器,现在规范命名，建议使用setGridAdapter
         * @param buildGridViewItem
         * @deprecated
         */
        gridView.setBuildGridViewItem = function (buildGridViewItem) {
            gridView.gridAdapter = buildGridViewItem;
        }

        /**
         * 纵向列表的按键
         */
        gridView.verticalKey = {
            up: function () {
                var index = gridView.getCurrentIndex();
                if (index < gridView.col) {
                    if (gridView.isLoop) {
                        if (gridView.itemViews.length <= gridView.col) {
                            return;
                        }
                        var row = Math.ceil(gridView.itemViews.length / gridView.col);
                        var toIndex = (row - 1) * gridView.col + index;
                        toIndex = toIndex >= gridView.itemViews.length - 1 ? gridView.itemViews.length - 1 : toIndex;
                        gridView.itemViews[toIndex].requestFocus();
                    } else {
                        View.next(gridView.nextUp);
                    }
                } else {
                    gridView.itemViews[index - gridView.col].requestFocus();
                }
            },
            down: function () {
                var index = gridView.getCurrentIndex();
                if (index + gridView.col > gridView.itemViews.length - 1) {
                    if (gridView.isLoop) {
                        if (gridView.itemViews.length <= gridView.col) {
                            return;
                        }
                        var col = index % gridView.col;
                        gridView.itemViews[col].requestFocus();
                    } else {
                        View.next(gridView.nextDown);
                    }

                } else {
                    gridView.itemViews[index + gridView.col].requestFocus();
                }
            },
            left: function () {
                var index = gridView.getCurrentIndex();
                if (index % gridView.col == 0) {
                    View.next(gridView.nextLeft);
                } else {
                    gridView.itemViews[index - 1].requestFocus();
                }
            },
            right: function () {
                var index = gridView.getCurrentIndex();
                if (index % gridView.col == gridView.col - 1 || index == gridView.itemViews.length - 1) {
                    View.next(gridView.nextRight);
                } else {
                    gridView.itemViews[index + 1].requestFocus();
                }
            }
        };

        /**
         * 横向列表的按键
         */
        gridView.horizontalKey = {
            up: function () {
                var index = gridView.getCurrentIndex();
                if (index % gridView.row != 0) {
                    gridView.itemViews[index - 1].requestFocus();
                } else {
                    View.next(gridView.nextUp);
                }
            },
            down: function () {
                var index = gridView.getCurrentIndex();
                if (index % gridView.row != gridView.row - 1 && index != gridView.itemViews.length - 1) {
                    gridView.itemViews[index + 1].requestFocus();
                } else {
                    View.next(gridView.nextDown);
                }
            },
            left: function () {
                var index = gridView.getCurrentIndex();
                if (index < gridView.row) {
                    if (gridView.isLoop) {
                        if (gridView.itemViews.length <= gridView.row) {
                            return;
                        }
                        var col = Math.ceil(gridView.itemViews.length / gridView.row);//总共的列数
                        var toIndex = (col - 1) * gridView.row + index;
                        toIndex = toIndex >= gridView.itemViews.length - 1 ? gridView.itemViews.length - 1 : toIndex;
                        gridView.itemViews[toIndex].requestFocus();
                    } else {
                        View.next(gridView.nextLeft);
                    }
                } else {
                    gridView.itemViews[index - gridView.row].requestFocus();
                }
            },
            right: function () {
                var index = gridView.getCurrentIndex();
                if (index + gridView.row > gridView.itemViews.length - 1) {
                    if (gridView.isLoop) {
                        if (gridView.itemViews.length <= gridView.row) {
                            return;
                        }
                        var row = index % gridView.row;
                        gridView.itemViews[row].requestFocus();
                    } else {
                        View.next(gridView.nextRight);
                    }

                } else {
                    gridView.itemViews[index + gridView.row].requestFocus();
                }
            }
        };

        /**
         * 网格循环实现方式与列表实现方式不同，在这里覆盖成空方法
         */
        gridView.circulate = function () {

        };

        /**
         * 获取标签中的属性，并设置
         */
        gridView.setAttributeParam = function () {
            var dom = gridView.getDom();
            if (!dom) {
                return;
            }
            //item点击监听 listView中处理

            //item焦点变化监听 listView中处理

            //滚动监听,在父控件中处理

            //适配器设置,listView中设置的adapter会在gridView创建过程中被覆盖
            var adapter = dom.getAttribute(View.attributeKey.adapter);
            if (adapter) {
                gridView.setGridAdapter(window[adapter]);
            }

            //属性设置
            //方向，listView中处理
            //焦点是否循环，listView中处理
            //焦点是否循环，listView中处理
            //焦点是否循环，listView中处理
            //跑马灯，listView中处理
            //驻留效果，listView中处理
            //行
            var row = dom.getAttribute(View.attributeKey.row);
            if (row) {
                try {
                    gridView.row = parseInt(row + "");
                } catch (e) {
                    console.log("error:gridView " + gridView.id + " row值类型错误，应该填数字");
                }
            }

            //列
            var col = dom.getAttribute(View.attributeKey.col);
            if (col) {
                try {
                    gridView.col = parseInt(col + "");
                } catch (e) {
                    console.log("error:gridView " + gridView.id + " col值类型错误，应该填数字");
                }
            }


        };
        //设置
        gridView.setAttributeParam();

        return gridView;
    },

};

/**
 * 注意点：子view的宽高必须准确，否则会影响就近原则移动
 * @type {{
 * getDistance: (function(*, *): number),
 * getPositionBy: AreaView.getPositionBy,
 * viewToArea: AreaView.viewToArea,
 * createNewChild: (function(*=): (*|*|{})),
 * createNew: (function(*=): (*|*|{})),
 * getAbsolutePosition: AreaView.getAbsolutePosition
 * }}
 */
var AreaView = {
    //从外部进入当前区域时
    fromUp: 0,//从上方进入
    fromDown: 1,//从下方进入
    fromLeft: 2,//从左边进入
    fromRight: 3,//从右边进入

    createNew: function (id) {
        var areaView = ScrollView.createNew(id);
        areaView.viewType = "areaView";
        areaView.data = [];
        areaView.onChildFocusChangeListener = null;
        areaView.onChildClickListener = null;
        areaView.childViews = [];
        areaView.selectView = null;
        areaView.needSelect = false;
        areaView.scrollLocate = View.scrollNormal;

        /**
         * 默认上焦方法，重写为给第一个子控件上焦
         */
        areaView.requestFocus = function () {
            if (!areaView.isShowing()) {
                return;
            }
            if (areaView.childViews.length <= 0) {
                if (!View.FocusView) {
                    View.FocusView = areaView;
                }
                return;
            }

            if (areaView.needSelect) {
                if (areaView.selectView) {
                    areaView.selectView.requestFocus();
                    return;
                }
            }

            var fromDirection = -1;
            if (View.keyDirection == View.keyUp) {
                fromDirection = AreaView.fromDown;
            } else if (View.keyDirection == View.keyDown) {
                fromDirection = AreaView.fromUp;
            } else if (View.keyDirection == View.keyLeft) {
                fromDirection = AreaView.fromRight;
            } else if (View.keyDirection == View.keyRight) {
                fromDirection = AreaView.fromLeft;
            }

            areaView.frontView = View.FocusView;//记录前置焦点
            if (fromDirection < 0) {
                if (areaView.selectView) {
                    areaView.selectView.requestFocus();
                } else {
                    areaView.childViews[0].requestFocus();
                }
            } else {
                AreaView.viewToArea(View.FocusView, areaView, fromDirection);
            }
        };

        /**覆盖View中的方法*/
        areaView.unFocus = function () {
        }

        /**
         * 给子view绑定数据
         * @param data
         */
        areaView.bindData = function (data) {
            if (!data || data.length < 1) {
                return;
            }

            areaView.data = data;

            for (var i = 0; i < areaView.childViews.length; i++) {
                areaView.childViews[i].bindData(data[i]);
            }

        };

        /**
         * areaView内部特殊处理的焦点向上方法
         */
        areaView.childNextUp = function (childView) {
            var nextUp = AreaView.getMinUpDistanceChild(areaView, childView);

            if (!nextUp) {
                nextUp = areaView.nextUp;
            }
            View.next(nextUp);
        };

        /**
         * areaView内部特殊处理的焦点向下方法
         */
        areaView.childNextDown = function (childView) {
            var nextDown = AreaView.getMinDownDistanceChild(areaView, childView);
            if (!nextDown) {
                nextDown = areaView.nextDown;
            }
            View.next(nextDown);
        };

        /**
         * areaView内部特殊处理的焦点向左方法
         */
        areaView.childNextLeft = function (childView) {
            var nextLeft = AreaView.getMinLeftDistanceChild(areaView, childView);
            if (!nextLeft) {
                nextLeft = areaView.nextLeft;
            }
            View.next(nextLeft);
        };

        /**
         * areaView内部特殊处理的焦点向右方法
         */
        areaView.childNextRight = function (childView) {
            var nextRight = AreaView.getMinRightDistanceChild(areaView, childView);
            if (!nextRight) {
                nextRight = areaView.nextRight;
            }

            View.next(nextRight);
        };

        /**
         * 添加单个子控件id
         * @param childId
         */
        areaView.addChild = function (childId) {
            var childView = AreaView.createNewChild(childId, areaView);
            areaView.childViews.push(childView);
            childView.setFocusChange(
                childView.nextUp || function () {
                    areaView.childNextUp(childView);
                },
                childView.nextDown || function () {
                    areaView.childNextDown(childView);
                },
                childView.nextLeft || function () {
                    areaView.childNextLeft(childView);
                },
                childView.nextRight || function () {
                    areaView.childNextRight(childView);
                });

            if (!childView.onFocusChangeListener) {//保留子控件的焦点变化监听
                childView.setOnFocusChangeListener(areaView.onAreaFocusChangeListener);
            }

            if (!childView.onClickListener) {//保留子控件的点击监听
                childView.setOnClickListener(areaView.onClickListener);
            }
        };

        /**
         * 添加多个子空间
         * @param childIds
         */
        areaView.addChilds = function (childIds) {
            for (var i = 0; i < childIds.length; i++) {
                areaView.addChild(childIds[i]);
            }
        };

        /**
         * 给指定子控件绑定textView
         * @param childId
         * @param textViewId id
         */
        areaView.bindTextView = function (childId, textViewId) {
            if (!childId || !textViewId) {
                return;
            }
            var childView = areaView.getChildViewById(childId);
            if (childView) {
                childView.bindTextView(TextView.createNew(textViewId));
            } else {
                console.log("warn:" + childId + "对应的子view还未创建");
            }

        };

        /**
         * 给所有子控件绑定textView
         * @param textViewIds
         */
        areaView.bindTextViews = function (textViewIds) {
            if (!textViewIds || textViewIds.length < 1) {
                return;
            }

            for (var i = 0; i < areaView.childViews.length && i < textViewIds.length; i++) {
                if (!textViewIds[i]) {
                    continue;
                }
                areaView.childViews[i].bindTextView(TextView.createNew(textViewIds[i]));
            }
        };

        areaView.getChildViewById = function (childId) {
            for (var i = 0; i < areaView.childViews.length; i++) {
                if (areaView.childViews[i].id == childId) {
                    return areaView.childViews[i];
                }
            }
        };

        /**
         * areaView内部处理的焦点变化监听，由于原先的被使用，会重新暴露一个焦点变化监听
         * @param view
         * @param hasFocus
         */
        areaView.onAreaFocusChangeListener = function (view, hasFocus) {
            if (areaView.onChildFocusChangeListener)
                areaView.onChildFocusChangeListener(view, hasFocus);
            if (hasFocus) {
                if (areaView.selectView && areaView.selectView != View.FocusView && areaView.needSelect) {
                    areaView.selectView.setUnFocusStyle();
                }
                areaView.selectView = view;
                areaView.scrollToChild(view);//滚动到view
            } else {
                if (areaView.needSelect) {
                    view.setSelectStyle();
                }
            }
        };

        /**
         * 滚动到子view
         * @param childView
         * @param scrollLocate 滚动位置
         */
        areaView.scrollToChild = function (childView, scrollLocate, currentScroll) {
            if (!areaView.getChildViewById(childView.id)) {//childView不在areaView中
                return;
            }
            areaView.scrollToChildDom(childView.getDom(), scrollLocate, currentScroll);
        };

        /**
         * 滚动到子Dom
         * @param childDom
         * @param scrollLocate 滚动位置
         * @param currentScroll 是否只滚动当前控件
         */
        areaView.scrollToChildDom = function (childDom, scrollLocate, currentScroll) {
            if (!childDom) {
                return;
            }
            if (typeof (scrollLocate) == "undefined") {
                scrollLocate = areaView.scrollLocate;
            }

            View.scrollVerticalToDom(areaView, childDom, scrollLocate);
            View.scrollHorizontalToDom(areaView, childDom, scrollLocate);

            if (!currentScroll && areaView.fatherView) {//实现多层滚动
                areaView.fatherView.scrollToChildDom(areaView.getDom());//滚动到areaView
            }
        };

        /**
         * 重新暴露的一个焦点变化监听
         * @param onChildFocusChangeListener
         */
        areaView.setOnChildFocusChangeListener = function (onChildFocusChangeListener) {
            if (areaView.onChildFocusChangeListener) {
                areaView.onChildFocusChangeListener = onChildFocusChangeListener;
            } else {
                areaView.onChildFocusChangeListener = onChildFocusChangeListener;
                if (!areaView.onChildFocusChangeListener) {//检点变化监听器置空
                    return;
                }
                if (!View.FocusView) {//兼容初始焦点不存在时
                    return;
                }
                var focusChild = areaView.getChildViewById(View.FocusView.id);
                //给当前焦点设置焦点变化监听，view.getDom().className==view.focusStyle表示创建并已上焦，否则为上焦动作在创建view之前
                if (focusChild && focusChild.getDom().className == focusChild.focusStyle) {
                    areaView.onChildFocusChangeListener(focusChild, true);
                }
            }
        };

        /**
         * 整合暴漏的点击监听，也可以直接对子控件单独设置（View.getViewById(id).setOnClickListener(func)），但是必须在addChild执行之后
         * @param view
         */
        areaView.onClickListener = function (view) {
            if (areaView.onChildClickListener)
                areaView.onChildClickListener(view);
        };

        areaView.setOnChildClickListener = function (onChildClickListener) {
            areaView.onChildClickListener = onChildClickListener;
        };

        /**
         * 获取标签中的属性，并设置
         */
        areaView.setAttributeParam = function () {
            var dom = areaView.getDom();
            if (!dom) {
                return;
            }
            //child点击监听
            var onClickLister = dom.getAttribute(View.attributeKey.click);
            if (onClickLister) {
                areaView.setOnChildClickListener(window[onClickLister]);
            }

            //child焦点变化监听
            var onFocusChangeListener = dom.getAttribute(View.attributeKey.focusChange);
            if (onFocusChangeListener) {
                areaView.setOnChildFocusChangeListener(window[onFocusChangeListener]);
            }

            //滚动监听,在父控件中处理

            //焦点位置
            var scrollLocate = dom.getAttribute(View.attributeKey.scrollLocate);

            if (scrollLocate == "center") {//center为居中
                areaView.scrollLocate = View.scrollCenter;
            } else if (scrollLocate == "start") {//center为居中
                areaView.scrollLocate = View.scrollStart;
            } else if (scrollLocate == "end") {//center为居中
                areaView.scrollLocate = View.scrollEnd;
            }

            //驻留效果
            var needSelect = dom.getAttribute(View.attributeKey.needSelect);
            if (needSelect == "1" || needSelect == "true") {//1或true表示有驻留效果
                areaView.needSelect = true;
            } else {//默认不开启
                areaView.needSelect = false;
            }

        };
        //设置
        areaView.setAttributeParam();

        return areaView;
    },

    /**
     * 创建areaView的子控件，一般在内部使用，在外部使用须详细了解areaView的机制
     * @param id
     * @returns {*|*|{}}
     */
    createNewChild: function (id, fatherView) {
        var areaChildView = View.createNew(id);
        areaChildView.viewType = "areaChildView";
        areaChildView.fatherView = fatherView;
        areaChildView.fatherId = fatherView.id;

        /**
         *  获取相对于父控件的坐标
         * @returns {*|{top, left}}
         */
        areaChildView.getPositionByFather = function () {
            return AreaView.getPositionBy(areaChildView.id, areaChildView.fatherView);
        }

        /**
         * 获取上边框中点坐标
         * @returns {{top: number, left: number}}
         */
        areaChildView.getUpMiddlePosition = function () {
            areaChildView.refreshPosition();//由于存在滚动情况，刷新当前的坐标

            var left = areaChildView.left + areaChildView.getWidth() / 2;
            var top = areaChildView.top;
            return {"left": left, "top": top};
        };

        /**
         * 获取下边框中点坐标
         * @returns {{top: number, left: number}}
         */
        areaChildView.getDownMiddlePosition = function () {
            areaChildView.refreshPosition();//由于存在滚动情况，刷新当前的坐标

            var left = areaChildView.left + areaChildView.getWidth() / 2;
            var top = areaChildView.top + areaChildView.getHeight();
            return {"left": left, "top": top};
        };

        /**
         * 获取左边框中点坐标
         * @returns {{top: number, left: number}}
         */
        areaChildView.getLeftMiddlePosition = function () {
            areaChildView.refreshPosition();//由于存在滚动情况，刷新当前的坐标

            var left = areaChildView.left;
            var top = areaChildView.top + areaChildView.getHeight() / 2;
            return {"left": left, "top": top};
        };

        /**
         * 获取右边框中点坐标
         * @returns {{top: number, left: number}}
         */
        areaChildView.getRightMiddlePosition = function () {
            areaChildView.refreshPosition();//由于存在滚动情况，刷新当前的坐标

            var left = areaChildView.left + areaChildView.getWidth();
            var top = areaChildView.top + areaChildView.getHeight() / 2;
            return {"left": left, "top": top};
        };

        /**
         * 刷新当前的坐标
         */
        areaChildView.refreshPosition = function () {
            if (!areaChildView.getDom()) {
                console.log("error:" + areaChildView.id + "的dom不存在，无法正确计算宽高及坐标！");
                return;
            }
            var position = areaChildView.getPositionByFather();//相对于fatherId的坐标
            areaChildView.left = position.left;
            areaChildView.top = position.top;

        }


        return areaChildView;
    },

    getPositionByDom: function (childDom, fatherDom) {
        if (!childDom) {
            return {"left": 0, "top": 0};
        }
        var left = childDom.offsetLeft;
        var top = childDom.offsetTop;

        if (!fatherDom) {
            return {"left": left, "top": top};
        }

        while (true) {
            var fDom = childDom.parentNode;
            var fatherDom_1 = childDom.offsetParent;
            if (!fatherDom_1 || fatherDom_1 == fatherDom) {
                break;
            }
            if (fatherDom_1.id.indexOf("_scroller") < 0) {//该节点不是滚动器
                // left += fDom.offsetLeft;
                // top += fDom.offsetTop;
                left += View.getLeft(fDom) - fDom.scrollLeft;
                top += View.getTop(fDom) - fDom.scrollTop;
            }

            childDom = fDom;

        }

        return {"left": left, "top": top};
    },

    /**
     * 获取相对于fatherId的childId坐标
     * @param childId
     * @param fatherView
     * @returns {{top: number, left: number}}
     */
    getPositionBy: function (childId, fatherView) {
        var childDom = View.$$(childId);
        var position = AreaView.getPositionByDom(childDom, fatherView.getDom());

        return position;
    },

    /**
     * 计算两个点直接距离的平方
     * 不开平方：实际距离会出现小数
     * @param position_0
     * @param position_1
     */
    getDistance: function (position_0, position_1) {
        var l = position_0.left - position_1.left;
        var t = position_0.top - position_1.top;
        return l * l + t * t;
    },

    /**
     * 获取区域内向上最近的子view，如果返回null，表示到达边界
     * @param areaView
     * @param currentChild
     * @returns {*}
     */
    getMinUpDistanceChild: function (areaView, currentChild) {
        var upMiddlePosition = currentChild.getUpMiddlePosition();

        var nextUp = null;

        var distance = 1920 * 1920 * 4;//超过二屏的距离
        for (var i = 0; i < areaView.childViews.length; i++) {
            var child = areaView.childViews[i];

            if (!child.getDom()) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            var nextUpMiddle = child.getUpMiddlePosition();
            if (upMiddlePosition.top <= nextUpMiddle.top) {//在当前的下方
                continue;
            }

            if (!child.isShowing()) {
                continue;
            }

            var nextDownMiddle = child.getDownMiddlePosition();

            if (nextUp && nextDownMiddle.left == nextUp.getDownMiddlePosition().left) {//中点在同一垂直线时
                if (nextDownMiddle.top > nextUp.getDownMiddlePosition().top) {//越靠下的优先级越高
                    nextUp = child;
                    distance = AreaView.getDistance(upMiddlePosition, nextDownMiddle);
                }
            } else {
                var distance_1 = AreaView.getDistance(upMiddlePosition, nextDownMiddle);
                if (distance_1 < distance) {
                    nextUp = child;
                    distance = distance_1;
                }
            }
        }

        return nextUp;

    },

    /**
     * 获取区域内向下最近的子view，如果返回null，表示到达边界
     * @param areaView
     * @param currentChild
     * @returns {*}
     */
    getMinDownDistanceChild: function (areaView, currentChild) {
        var downMiddlePosition = currentChild.getDownMiddlePosition();

        var nextDown = null;

        var distance = 1920 * 1920;//超过一屏的距离
        for (var i = 0; i < areaView.childViews.length; i++) {
            var child = areaView.childViews[i];

            if (!child.getDom()) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.isShowing()) {
                continue;
            }

            var nextDownMiddle = child.getDownMiddlePosition();
            if (downMiddlePosition.top >= nextDownMiddle.top) {//在当前的上方
                continue;
            }

            var nextUpMiddle = child.getUpMiddlePosition();

            if (nextDown && nextUpMiddle.left == nextDown.getUpMiddlePosition().left) {//中点在同一垂直线时，越靠上的优先级越高
                if (nextUpMiddle.top < nextDown.getUpMiddlePosition().top) {
                    nextDown = child;
                    distance = AreaView.getDistance(downMiddlePosition, nextUpMiddle);
                }
            } else {//中点不在同一垂直线
                var distance_1 = AreaView.getDistance(downMiddlePosition, nextUpMiddle);

                if (distance_1 < distance) {
                    nextDown = child;
                    distance = distance_1;
                }
            }


        }

        return nextDown;
    },

    /**
     * 获取区域内向左最近的子view，如果返回null，表示到达边界
     * @param areaView
     * @param currentChild
     * @returns {*}
     */
    getMinLeftDistanceChild: function (areaView, currentChild) {
        var leftMiddlePosition = currentChild.getLeftMiddlePosition();

        var nextLeft = null;

        var distance = 1920 * 1920;//超过一屏的距离
        for (var i = 0; i < areaView.childViews.length; i++) {
            var child = areaView.childViews[i];

            if (!child.getDom()) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.isShowing()) {
                continue;
            }

            var nextLeftMiddle = child.getLeftMiddlePosition();
            if (leftMiddlePosition.left <= nextLeftMiddle.left) {//在当前的右边
                continue;
            }

            var nextRightMiddle = child.getRightMiddlePosition();

            if (nextLeft && nextRightMiddle.top == nextLeft.getRightMiddlePosition().top) {//中点在同一水平线时
                if (nextRightMiddle.left > nextLeft.getRightMiddlePosition().left) {//越靠右的优先级越高
                    nextLeft = child;
                    distance = AreaView.getDistance(leftMiddlePosition, nextRightMiddle);
                }
            } else {
                var distance_1 = AreaView.getDistance(leftMiddlePosition, nextRightMiddle);
                if (distance_1 < distance) {
                    nextLeft = child;
                    distance = distance_1;
                }
            }

        }

        return nextLeft;

    },

    /**
     * 获取区域内向右最近的子view，如果返回null，表示到达边界
     * @param areaView
     * @param currentChild
     * @returns {*}
     */
    getMinRightDistanceChild: function (areaView, currentChild) {
        var rightMiddlePosition = currentChild.getRightMiddlePosition();

        var nextRight = null;

        var distance = 1920 * 1920;//超过一屏的距离
        for (var i = 0; i < areaView.childViews.length; i++) {
            var child = areaView.childViews[i];

            if (!child.getDom()) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.isShowing()) {
                continue;
            }

            var nextRightMiddle = child.getRightMiddlePosition();
            if (rightMiddlePosition.left >= nextRightMiddle.left) {//在当前的左边
                continue;
            }

            var nextLeftMiddle = child.getLeftMiddlePosition();

            if (nextRight && nextRightMiddle.top == nextRight.getLeftMiddlePosition().top) {//中点在同一水平线时
                if (nextLeftMiddle.left < nextRight.getLeftMiddlePosition().left) {//越靠左的优先级越高
                    nextRight = child;
                    distance = AreaView.getDistance(rightMiddlePosition, nextLeftMiddle);
                }
            } else {
                var distance_1 = AreaView.getDistance(rightMiddlePosition, nextLeftMiddle);
                if (distance_1 < distance) {
                    nextRight = child;
                    distance = distance_1;
                }
            }

        }

        return nextRight;

    },

    /**
     *
     * @param view 从哪个view
     * @param areaView 到指定areaView
     * @param action AreaView.fromUp,AreaView.fromDown,AreaView.fromLeft,AreaView.fromRight  从上、下、左、右进入区域
     */
    viewToArea: function (view, areaView, action) {
        if (!view) {
            console.log("error:view为空！");
            return;
        }

        if (!areaView) {
            console.log("error:areaView为空");
            return;
        }

        if (areaView.childViews.length <= 0) {
            console.log("error:areaView内部没有子view");
            return;
        }

        var next = null;
        var fromMiddle = null;
        switch (action) {
            case 0:
                fromMiddle = AreaView.getAbsolutePosition(view.id);
                fromMiddle.left = fromMiddle.left + view.getWidth() / 2;
                break;
            case 1:
                fromMiddle = AreaView.getAbsolutePosition(view.id);
                fromMiddle.left = fromMiddle.left + view.getWidth() / 2;
                fromMiddle.top = fromMiddle.top + view.getHeight();
                break;
            case 2:
                fromMiddle = AreaView.getAbsolutePosition(view.id);
                fromMiddle.left = fromMiddle.left + view.getWidth();
                fromMiddle.top = fromMiddle.top + view.getHeight() / 2;
                break;
            case 3:
                fromMiddle = AreaView.getAbsolutePosition(view.id);
                fromMiddle.left = fromMiddle.left + view.getWidth();
                fromMiddle.top = fromMiddle.top + view.getHeight() / 2;
                break;
            default:
                console.log("error:action值异常！");
                return;
        }

        var distance = 1920 * 1920;//超过一屏的距离

        for (var i = 0; i < areaView.childViews.length; i++) {
            var child = areaView.childViews[i];

            var childDom = child.getDom();
            if (!childDom) {
                continue;
            }

            if(!child.isShowing()){//不显示
                continue;
            }

            var position = AreaView.getPositionBy(child.id, areaView);

            if (position.top + childDom.offsetHeight / 2 - areaView.getScrollTop() >= areaView.getHeight()) {//在显示范围下
                // console.log(child.id+"超过一半在显示范围下");
                continue;
            }

            if (position.top - childDom.offsetHeight / 2 + childDom.offsetHeight <= areaView.getScrollTop()) {//在显示范围上
                // console.log(child.id+"超过一半在显示范围上");
                continue;
            }

            if (position.left + childDom.offsetWidth / 2 - areaView.getScrollLeft() >= areaView.getWidth()) {//在显示范围右
                // console.log(child.id+"超过一半在显示范围右");
                continue;
            }

            if (position.left - childDom.offsetWidth / 2 + childDom.offsetWidth <= areaView.getScrollLeft()) {//在显示范围上
                // console.log(child.id+"超过一半在显示范围左");
                continue;
            }

            var toMiddle = null;
            switch (action) {
                case 0:
                    toMiddle = AreaView.getAbsolutePosition(child.id);
                    toMiddle.left = toMiddle.left + child.getWidth() / 2;
                    break;
                case 1:
                    toMiddle = AreaView.getAbsolutePosition(child.id);
                    toMiddle.left = toMiddle.left + child.getWidth() / 2;
                    toMiddle.top = toMiddle.top + child.getHeight();
                    break;
                case 2:
                    toMiddle = AreaView.getAbsolutePosition(child.id);
                    toMiddle.top = toMiddle.top + child.getHeight() / 2;
                    break;
                case 3:
                    toMiddle = AreaView.getAbsolutePosition(child.id);
                    toMiddle.left = toMiddle.left + child.getWidth();
                    toMiddle.top = toMiddle.top + child.getHeight() / 2;
                    break;
                default:
                    console.log("error:action值异常！");
                    return;
            }

            var distance_1 = AreaView.getDistance(fromMiddle, toMiddle);
            if (distance_1 < distance) {
                next = child;
                distance = distance_1;
            }

        }

        View.next(next);
    },

    /**
     * 获取相对于整个屏幕左上角的坐标
     * @param id
     * @returns {{top: number, left: number}}
     */
    getAbsolutePosition: function (id) {
        if (!id) {
            return {"left": 0, "top": 0};
        }
        var left = View.$$(id).offsetLeft;
        var top = View.$$(id).offsetTop;

        var childDom = View.$$(id);
        while (true) {
            var fatherDom = childDom.parentNode;
            var fatherDom_1 = childDom.offsetParent;
            if (!fatherDom_1) {
                break;
            }

            if (fatherDom_1.id.indexOf("_scroller") < 0) {//该节点是滚动器
                left += fatherDom.offsetLeft - fatherDom.scrollLeft;
                top += fatherDom.offsetTop - fatherDom.scrollTop;
            } else {
                left += View.getLeft(fatherDom);
                top += View.getTop(fatherDom);
            }

            childDom = fatherDom;

        }

        return {"left": left, "top": top};
    }

};

/**
 * 基于recycleView的列表或网格视图
 * @type {{createNew: (function(*=): (*|*|{}))}}
 */
var RecycleView = {
    createNew: function (id) {
        var recycleView = AreaView.createNew(id);
        recycleView.viewType = "recycleView";
        recycleView.orientation = View.vertical;//默认纵向

        recycleView.idPrefix = id + "_";//子元素前置id
        recycleView.needMarqueeIdPrefix = recycleView.idPrefix + "txt_";//跑马灯的前缀

        //一行一列效果和recycleView相同,多行多列和gridView效果相同
        recycleView.col = 1;//默认1列，该参数在纵向时生效
        recycleView.row = 1;//默认1行，该参数在横向时生效

        // recycleView.scrollLocate 在areaView中处理，暂时只支持scrollCenter，其他值为scrollNormal

        recycleView.isLoop = true;//是否循环
        recycleView.isCirculate = false;//首尾相接循环开关,默认关
        recycleView.hasMarquee = false;//存在跑马灯

        recycleView.distance = 0;//间距，横向的为横向间距，纵向的为纵向间距
        recycleView.childWidth = 0;//子view的宽
        recycleView.childHeight = 0;//子view的高
        recycleView.minLayoutNum = 0;//循环时，最少数量

        recycleView.startIndex = 0;//开始布局的数据序号

        /**
         * 适配器
         * @param idPrefix
         * @param index 获取数据或子view使用，不可用于计算坐标
         * @param row 行数
         * @param col 列数
         * @param data
         */
        recycleView.adapter = function (idPrefix, index, row, col, data) {
            console.log("warn:" + recycleView.id + "适配器未重写, adapter必须在bindData前重写");
            return "";
        };

        /**
         * 重写绑定数据方法
         * @param data
         */
        recycleView.bindData = function (data) {
            recycleView.clear();
            if (!data) {
                data = [];
            }
            recycleView.data = data;
            recycleView.scrollLocate = recycleView.scrollLocate == View.scrollCenter ? View.scrollCenter : View.scrollNormal;//滚动位置强制改变
            //数据长度未超过纵向1行或横向1列时，不循环
            if (recycleView.orientation == View.horizontal && recycleView.data.length > recycleView.row) {
                recycleView.getLayoutNum();//计算
            } else if (recycleView.orientation == View.vertical && recycleView.data.length > recycleView.col) {
                recycleView.getLayoutNum();//计算
            } else {
                recycleView.minLayoutNum = recycleView.data.length + 1;//不足纵向1行或横向1列时，设置一个最小值，跳过循环
            }

            recycleView.refresh(true);

            if (View.FocusView == recycleView && recycleView.childViews.length > 0) {
                recycleView.focusByIndex(0);
            }
        };

        recycleView.clear = function () {
            recycleView.startIndex = 0;
            recycleView.selectView = null;
            recycleView.data = [];
            for (var i = 0; i < recycleView.childViews.length; i++) {
                recycleView.childViews[i].remove();
            }
            recycleView.childViews = [];
            var htmlStr = "";
            recycleView.setHtml(htmlStr);

            if (recycleView.orientation == View.horizontal) {
                recycleView.setScrollLeft(0);
            } else {
                recycleView.setScrollTop(0);
            }
        }

        /**
         * 刷新列表，重新构建recycleView
         * isBindData  true:表示bindData执行布局；false:表示其他情况布局
         */
        recycleView.refresh = function (isBindData) {
            //计算子控件实际布局数量
            var minLayoutNum = recycleView.minLayoutNum;
            var lastIndex = (minLayoutNum - 1 + recycleView.startIndex) % recycleView.data.length;
            if (recycleView.orientation == View.vertical) {
                if (lastIndex + recycleView.col >= recycleView.data.length) {//最后一行,有缺口是正常的

                } else {
                    var remainder = lastIndex % recycleView.col;//余数
                    if (remainder == lastIndex % recycleView.col - 1) {//表示没有缺口的行

                    } else {
                        minLayoutNum = minLayoutNum + recycleView.col - 1 - remainder;
                    }
                }

            } else {
                if (lastIndex + recycleView.row >= recycleView.data.length) {//最后一列,有缺口是正常的

                } else {
                    var remainder = lastIndex % recycleView.row;//余数
                    if (remainder == lastIndex % recycleView.row - 1) {//表示没有缺口的列

                    } else {
                        minLayoutNum = minLayoutNum + recycleView.row - 1 - remainder;
                    }
                }
            }

            recycleView.layout(minLayoutNum);//布局dom
            //添加子控件
            for (var i = 0; i < recycleView.data.length && i < minLayoutNum; i++) {
                var index = (i + recycleView.startIndex) % recycleView.data.length;
                var childView = recycleView.getChildViewById(recycleView.idPrefix + index);
                if (!childView) {
                    recycleView.addChild(recycleView.idPrefix + index);
                    childView = recycleView.getChildViewById(recycleView.idPrefix + index);
                }
                childView.bindData(recycleView.data[index]);
            }
            if (isBindData) {
                var index = recycleView.getCurrentIndex();
                if (index >= 0) {
                    var animation = recycleView.scrollAnimation;
                    if (recycleView.scrollAnimation) {
                        recycleView.scrollAnimation = false;
                    }

                    var toIndex = 0;
                    if (index >= recycleView.data.length - 1) {
                        toIndex = recycleView.data.length - 1;
                    } else {
                        toIndex = index;
                    }

                    recycleView.scrollByIndex(toIndex);
                    var childView = recycleView.getChildViewById(recycleView.idPrefix + toIndex);
                    childView.focus();

                    console.log("info:" + View.FocusView.id + "上焦，处理初始焦点view没有对应的dom或是重新构建子控件");

                    if (animation) {
                        recycleView.scrollAnimation = true;
                    }
                }

            }

        };

        /**
         * recycleView重写areaView内部处理的焦点变化监听，相较areaView只有略微调整
         * @param view
         * @param hasFocus
         */
        recycleView.onRecycleFocusChangeListener = function (view, hasFocus) {
            if (recycleView.onChildFocusChangeListener)
                recycleView.onChildFocusChangeListener(view, hasFocus);
            if (hasFocus) {
                if (recycleView.selectView && recycleView.selectView != View.FocusView && recycleView.needSelect) {
                    recycleView.selectView.setUnFocusStyle();
                }
                recycleView.selectView = view;
                recycleView.scrollToChild(view);//滚动到view
                recycleView.recycle();
            } else {
                if (recycleView.needSelect) {
                    view.setSelectStyle();
                }
            }

        };

        /**
         * 布局，最后呈现在页面中的排布
         * @param startIndex
         */
        recycleView.layout = function (minLayoutNum) {
            var divs = [];
            for (var i = 0; i < recycleView.data.length && i < minLayoutNum; i++) {


                if (!recycleView.isLoop || !recycleView.isCirculate) {
                    if (i + recycleView.startIndex >= recycleView.data.length) {
                        continue;
                    }
                }

                var index = (i + recycleView.startIndex) % recycleView.data.length;//数据序号
                var row = 0;//行
                var col = 0;//列
                if (recycleView.orientation == View.vertical) {
                    col = index % recycleView.col;
                    var totalRow = Math.ceil(recycleView.data.length / recycleView.col);//总行数
                    var startRow = parseInt(recycleView.startIndex / recycleView.col);//startIndex的行
                    var indexRow = parseInt(index / recycleView.col);//当前行

                    row = (indexRow + totalRow - startRow) % totalRow;//实际行
                } else {
                    row = index % recycleView.row;//行
                    var totalCol = Math.ceil(recycleView.data.length / recycleView.row);//总列数
                    var startCol = parseInt(recycleView.startIndex / recycleView.row);//startIndex的列
                    var indexCol = parseInt(index / recycleView.row);//当前列

                    col = (indexCol + totalCol - startCol) % totalCol;//实际列
                }

                var div = recycleView.adapter(recycleView.idPrefix, index, row, col, recycleView.data[index]);
                if (div == "") {
                    return;
                }
                divs.push(div);
            }

            var htmlStr = divs.join("");
            recycleView.setHtml(htmlStr);

        };

        /**
         * 设置适配器，listView、GridView的setBuildItemView相同，命名为符合功能的方法名
         * @param adapter
         */
        recycleView.setAdapter = function (adapter) {
            recycleView.adapter = adapter;
        };

        /**
         * 添加单个子控件id
         * @param childId
         */
        recycleView.addChild = function (childId) {
            var childView = AreaView.createNewChild(childId, recycleView);
            childView.setFocusChange(
                function () {
                    var index = recycleView.getCurrentIndex();
                    if (recycleView.isLoop && !recycleView.isCirculate && recycleView.orientation == View.vertical) {
                        if (index < recycleView.col) {
                            var totalRow = Math.ceil(recycleView.data.length / recycleView.col);//总行数
                            var col = index % recycleView.col;//列
                            recycleView.focusByIndex((totalRow - 1) * recycleView.col + col);
                            return;
                        }
                    }
                    if (!childView.getDom()) {//在执行scrollByIndex后，存在当前焦点dom不存在的情况
                        recycleView.scrollByIndex(index);
                    }

                    recycleView.childNextUp(childView);
                },
                function () {
                    var index = recycleView.getCurrentIndex();
                    if (recycleView.isLoop && !recycleView.isCirculate && recycleView.orientation == View.vertical) {
                        var lastRow = (Math.ceil(recycleView.data.length / recycleView.col) - 1) * recycleView.col;//最后一行，第一个
                        if (index >= lastRow) {
                            var col = index % recycleView.col;//行
                            recycleView.focusByIndex(col);
                            return;
                        }
                    }

                    if (!childView.getDom()) {//在执行scrollByIndex后，存在当前焦点dom不存在的情况
                        recycleView.scrollByIndex(index);
                    }
                    recycleView.childNextDown(childView);
                },
                function () {
                    var index = recycleView.getCurrentIndex();
                    if (recycleView.isLoop && !recycleView.isCirculate && recycleView.orientation == View.horizontal) {
                        if (index < recycleView.row) {
                            var totalCol = Math.ceil(recycleView.data.length / recycleView.row);//总列数
                            var row = index % recycleView.row;//行
                            recycleView.focusByIndex((totalCol - 1) * recycleView.row + row);
                            return;
                        }
                    }

                    if (!childView.getDom()) {//在执行scrollByIndex后，存在当前焦点dom不存在的情况
                        recycleView.scrollByIndex(index);
                    }
                    recycleView.childNextLeft(childView);
                },
                function () {
                    var index = recycleView.getCurrentIndex();
                    if (recycleView.isLoop && !recycleView.isCirculate && recycleView.orientation == View.horizontal) {
                        var lastCol = (Math.ceil(recycleView.data.length / recycleView.row) - 1) * recycleView.row;//最后一列，第一个
                        if (index >= lastCol) {
                            var row = index % recycleView.row;//行
                            recycleView.focusByIndex(row);
                            return;
                        }
                    }

                    if (!childView.getDom()) {//在执行scrollByIndex后，存在当前焦点dom不存在的情况
                        recycleView.scrollByIndex(index);
                    }
                    recycleView.childNextRight(childView);
                });
            childView.setOnFocusChangeListener(recycleView.onRecycleFocusChangeListener);
            childView.setOnClickListener(recycleView.onClickListener);

            if (recycleView.hasMarquee) {
                try {
                    var textViewId = childId.replace(recycleView.idPrefix, recycleView.needMarqueeIdPrefix);
                    childView.bindTextView(TextView.createNew(textViewId));//绑定textView
                } catch (e) {
                    console.log("bindTextView error：" + recycleView.id + "适配器的绑定TextView的id不规范或者不存在！");
                }

            }

            recycleView.childViews.push(childView);
        };

        /**
         * 实现循环
         * 改变子view，但不改变效果
         * 并滚动到需要上焦的view
         */
        recycleView.recycle = function () {
            if (recycleView.data.length < recycleView.minLayoutNum) {//数量不足以循环
                return;
            }

            var position = View.getAbsolutePositionBy(View.FocusView.id, recycleView);

            recycleView.refreshStartIndex();//刷新布局
            View.setAbsolutePositionBy(View.FocusView.id, recycleView, position);
            View.FocusView.setFocusStyle();
            recycleView.scrollToChild(View.FocusView);
        }

        /**
         * 计算distance和minLayoutNum
         */
        recycleView.getLayoutNum = function () {
            var divs = [];

            var div_0 = recycleView.adapter(recycleView.idPrefix, 0, 0, 0, recycleView.data[0]);
            divs.push(div_0);
            var row = 0;//行
            var col = 0;//列
            var index = 0;
            if (recycleView.orientation == View.vertical) {
                row = 1;
                col = 0;
                index = recycleView.col;
            } else {
                row = 0;
                col = 1;
                index = recycleView.row;
            }

            var div_next = recycleView.adapter(recycleView.idPrefix, index, row, col, recycleView.data[0]);
            divs.push(div_next);

            var htmlStr = divs.join("");
            recycleView.setHtml(htmlStr);

            if (recycleView.orientation == View.vertical) {//纵向
                if (recycleView.data.length > recycleView.col) {
                    recycleView.distance = parseInt(View.$$(recycleView.idPrefix + index).style.top) - parseInt(View.$$(recycleView.idPrefix + "0").style.top);
                }
            } else {//横向
                if (recycleView.data.length > recycleView.row) {
                    recycleView.distance = parseInt(View.$$(recycleView.idPrefix + index).style.left) - parseInt(View.$$(recycleView.idPrefix + "0").style.left);
                }
            }

            recycleView.childWidth = View.getViewWidth(View.$$(recycleView.idPrefix + index));
            recycleView.childHeight = View.getViewHeight(View.$$(recycleView.idPrefix + index));

            if (!recycleView.distance) {//没有distance时，表示数量较少或未布局
                return;
            }

            if (recycleView.orientation == View.vertical) {//纵向
                var H = recycleView.getHeight();
                var h = recycleView.childHeight;
                //最少布局行数
                var layoutRow = Math.ceil((H - h) / recycleView.distance);
                if (recycleView.scrollLocate == View.scrollCenter) {
                    // layoutRow += 4;//把计算时未计算的加上，再预留3行
                    layoutRow = Math.ceil((layoutRow + 1) * 1.5);//预留出一半，用在居中滚动
                } else {
                    layoutRow += 4;//把计算时未计算的加上，再预留3行，尝试更少的数量，但是都无法完美的适应
                }


                //最少的子view数量
                recycleView.minLayoutNum = layoutRow * recycleView.col;

            } else {
                var W = recycleView.getWidth();
                var w = recycleView.childWidth;
                //最少布局行数
                var layoutCol = Math.ceil((W - w) / recycleView.distance);
                if (recycleView.scrollLocate == View.scrollCenter) {
                    // layoutCol += 4;//把计算时未计算的加上，再预留3行
                    layoutCol = Math.ceil((layoutCol + 1) * 1.5);//预留出一半，用在居中滚动
                } else {
                    layoutCol += 4;//把计算时未计算的加上，再预留3列，尝试更少的数量，但是都无法完美的适应
                }

                //最少的子view数量
                recycleView.minLayoutNum = layoutCol * recycleView.row;
            }
            if (recycleView.minLayoutNum > recycleView.data.length) {
                console.log("info:" + recycleView.id + "最少布局" + recycleView.minLayoutNum + "个子view才能循环");
            }

        };

        /**
         * 刷新开始的序号
         */
        recycleView.refreshStartIndex = function () {
            var startIndex = 0;
            if (recycleView.orientation == View.horizontal) {
                startIndex = recycleView.getHorizontalStartIndex();
                if (startIndex == recycleView.startIndex) {
                    return;
                } else {
                    recycleView.startIndex = startIndex;
                    recycleView.refresh(false);
                }
            } else {
                startIndex = recycleView.getVerticalStartIndex();
                if (startIndex == recycleView.startIndex) {
                    return;
                } else {
                    recycleView.startIndex = startIndex;
                    recycleView.refresh(false);
                }
            }
        };

        /**
         * 刷新横向开始的序号
         */
        recycleView.getHorizontalStartIndex = function () {

            var startIndex = recycleView.startIndex;

            var position = AreaView.getPositionBy(View.FocusView.id, recycleView);

            var dataLen = recycleView.data.length;
            var row = recycleView.row;

            if (recycleView.scrollLocate == View.scrollCenter) {
                var missLeftWidth = recycleView.getWidth() / 2 - (position.left + recycleView.childWidth / 2);
                var addNumLeft = Math.ceil(missLeftWidth / recycleView.childWidth);
                if (missLeftWidth > 0) {//左方没有足够的位置滚动到居中
                    if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex == 0) {
                        //不处理
                    } else {
                        startIndex = (recycleView.startIndex + (dataLen - addNumLeft * row)) % dataLen;
                    }

                } else {
                    var missRightWidth = position.left + recycleView.getWidth() / 2 + recycleView.childWidth / 2 - recycleView.getScrollWidth();
                    var addNumRight = Math.ceil(missRightWidth / recycleView.childWidth);
                    if (missRightWidth > 0) {//右方不存在
                        if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex + recycleView.minLayoutNum >= dataLen) {
                            //不处理
                        } else {
                            startIndex = (recycleView.startIndex + addNumRight * row) % dataLen;
                        }

                    }
                }
            } else {
                if (position.left >= recycleView.distance) {//左方 存在
                    if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex + recycleView.minLayoutNum >= dataLen) {
                        //不处理
                    } else {
                        if (recycleView.getScrollWidth() < position.left + recycleView.childWidth + recycleView.distance) {//下方不存在
                            startIndex = (recycleView.startIndex + row) % dataLen;
                        }
                    }
                } else {//左方不存在
                    if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex == 0) {
                        //不处理
                    } else {
                        startIndex = (recycleView.startIndex + (dataLen - row)) % dataLen;
                    }
                }
            }

            if (recycleView.orientation == View.horizontal) {
                startIndex = parseInt(startIndex / recycleView.row) * recycleView.row;
            } else {
                startIndex = parseInt(startIndex / recycleView.col) * recycleView.col;
            }

            return startIndex;
        };

        /**
         * 刷新纵向开始的序号
         */
        recycleView.getVerticalStartIndex = function () {

            var startIndex = recycleView.startIndex;

            var position = AreaView.getPositionBy(View.FocusView.id, recycleView);//相对recycleView滚动顶部左上角的坐标

            var dataLen = recycleView.data.length;
            var col = recycleView.col;

            //高度计算
            if (recycleView.scrollLocate == View.scrollCenter) {
                var missUpHeight = recycleView.getHeight() / 2 - (position.top + recycleView.childHeight / 2);
                var addNumUp = Math.ceil(missUpHeight / recycleView.childHeight);
                if (missUpHeight > 0) {//上方没有足够的位置滚动到居中
                    if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex == 0) {
                        //不处理
                    } else {
                        startIndex = (recycleView.startIndex + (dataLen - addNumUp * col)) % dataLen;
                    }

                } else {
                    var missDownHeight = position.top + recycleView.getHeight() / 2 + recycleView.childHeight / 2 - recycleView.getScrollHeight();
                    var addNumDown = Math.ceil(missDownHeight / recycleView.childHeight);
                    if (missDownHeight > 0) {//下方不存在
                        if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex + recycleView.minLayoutNum >= dataLen) {
                            //不处理
                        } else {
                            startIndex = (recycleView.startIndex + addNumDown * col) % dataLen;
                        }

                    }
                }
            } else {
                if (position.top >= recycleView.distance) {//上方的存在
                    if (recycleView.getScrollHeight() < position.top + recycleView.childHeight + recycleView.distance) {//下方不存在
                        if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex + recycleView.minLayoutNum >= dataLen) {
                            //不处理
                        } else {
                            startIndex = (recycleView.startIndex + col) % dataLen;
                        }

                    }
                } else {//上方不存在
                    if (!(recycleView.isCirculate && recycleView.isLoop) && startIndex == 0) {
                        //不处理
                    } else {
                        startIndex = (recycleView.startIndex + (dataLen - col)) % dataLen;
                    }

                }
            }

            if (recycleView.orientation == View.horizontal) {
                startIndex = parseInt(startIndex / recycleView.row) * recycleView.row;
            } else {
                startIndex = parseInt(startIndex / recycleView.col) * recycleView.col;
            }

            return startIndex;
        };

        /**
         * 滚动到指定index
         * @param index
         */
        recycleView.scrollByIndex = function (index, currentScroll) {

            if (!recycleView.data || recycleView.data.length <= 0) {
                return;
            }

            var childView = recycleView.getChildViewById(recycleView.idPrefix + index);
            if (childView && childView.getDom() && recycleView.scrollLocate != View.scrollCenter) {
                recycleView.scrollToChild(childView, currentScroll);
                return;
            }

            var childExist = false;
            var position = null;
            if (childView && childView.getDom()) {
                childExist = true;
                position = View.getAbsolutePositionBy(recycleView.idPrefix + index, recycleView);
            }

            if (recycleView.getCurrentIndex() >= 0) {
                if (View.FocusView.getDom() && View.FocusView.textView && View.FocusView.textView.isMarquee) {
                    View.FocusView.textView.clearMarquee();
                }
            }

            var dataLen = recycleView.data.length;
            if (index >= dataLen) {
                console.log("error:index越界");
                return;
            }

            //获取当前显示的其中一个子view，获取该view序号
            var offsetView = null;
            for (var i = 0; i < recycleView.data.length; i++) {
                var childView = recycleView.getChildViewByIndex(i);
                if (!childView) {
                    continue;
                }
                if (!childView.getDom()) {
                    continue;
                }

                var _position = AreaView.getPositionBy(childView.id, recycleView);
                var top = _position.top;
                var left = _position.left
                if (top >= recycleView.getScrollTop() && left >= recycleView.getScrollLeft()) {//在显示范围
                    offsetView = childView;
                    break;
                }
            }

            //计算startIndex
            //刷新
            var offsetIndex = 0;
            if (offsetView) {
                offsetIndex = parseInt(offsetView.id.substring(recycleView.idPrefix.length), 10);
            } else {
                return;
            }

            //计算startIndex
            if (recycleView.scrollLocate == View.scrollCenter) {
                if (recycleView.isCirculate && recycleView.isLoop) {
                    recycleView.startIndex = (index - parseInt(recycleView.minLayoutNum / 2) + dataLen) % dataLen;
                } else {
                    recycleView.startIndex = (index - recycleView.minLayoutNum) % dataLen;
                    if (recycleView.startIndex <= 0) {
                        recycleView.startIndex = 0;
                    } else {
                        if (recycleView.orientation == View.horizontal) {
                            recycleView.startIndex = parseInt(recycleView.startIndex / recycleView.row + 1) * recycleView.row;
                        } else {
                            recycleView.startIndex = parseInt(recycleView.startIndex / recycleView.col + 1) * recycleView.col;
                        }
                    }
                }
            } else {
                if (recycleView.isCirculate && recycleView.isLoop) {
                    if (offsetIndex < index) {
                        recycleView.startIndex = (index - recycleView.minLayoutNum + 1) % dataLen;
                    } else if (offsetIndex > index) {
                        recycleView.startIndex = index;
                    } else {

                    }
                } else {
                    if (offsetIndex < index) {
                        recycleView.startIndex = (index - recycleView.minLayoutNum + 1) % dataLen;
                        if (recycleView.orientation == View.horizontal) {
                            recycleView.startIndex = recycleView.startIndex + recycleView.row;
                            recycleView.startIndex = recycleView.startIndex > dataLen - recycleView.minLayoutNum + recycleView.row ? dataLen - recycleView.minLayoutNum + recycleView.row : recycleView.startIndex;
                        } else {
                            recycleView.startIndex = recycleView.startIndex + recycleView.col;
                            recycleView.startIndex = recycleView.startIndex > dataLen - recycleView.minLayoutNum + recycleView.col ? dataLen - recycleView.minLayoutNum + recycleView.col : recycleView.startIndex;
                        }
                    } else if (offsetIndex > index) {
                        if (recycleView.orientation == View.horizontal) {
                            recycleView.startIndex = parseInt(index / recycleView.row) * recycleView.row;
                        } else {
                            recycleView.startIndex = parseInt(index / recycleView.col) * recycleView.col;
                        }
                    } else {

                    }
                }

            }

            //刷新
            recycleView.refresh(false);
            if (childExist && position) {
                View.setAbsolutePositionBy(recycleView.idPrefix + index, recycleView, position);
            } else {
                if (offsetIndex < index) {
                    var position = {left: 0, top: 0};
                    View.setAbsolutePositionBy(recycleView.idPrefix + recycleView.startIndex, recycleView, position);
                } else {
                    var i = recycleView.startIndex + recycleView.minLayoutNum - 1;
                    i = i % dataLen;
                    var position = {
                        left: recycleView.getWidth() - recycleView.childWidth,
                        top: recycleView.getHeight() - recycleView.childHeight
                    };
                    View.setAbsolutePositionBy(recycleView.idPrefix + i, recycleView, position);
                }
            }

            recycleView.scrollToChild(recycleView.getChildViewById(recycleView.idPrefix + index), currentScroll);

            if (recycleView.getCurrentIndex() >= 0 && View.FocusView.getDom()) {
                View.FocusView.setFocusStyle();
                if (View.FocusView.textView) {
                    View.FocusView.textView.marquee();
                }
            }
        };

        /**
         * 给指定index的子view上焦，并滚动到
         * @param index
         */
        recycleView.focusByIndex = function (index) {
            index = index >= recycleView.data.length ? recycleView.data.length - 1 : index;
            recycleView.scrollByIndex(index);

            var childView = recycleView.getChildViewById(recycleView.idPrefix + index);
            childView.requestFocus();
        };

        /**
         * 获取指定index的子view
         * @param index
         * @returns {*}
         */
        recycleView.getChildViewByIndex = function (index) {
            return recycleView.getChildViewById(recycleView.idPrefix + index);
        };

        /**
         * 获取当前的焦点序号
         */
        recycleView.getCurrentIndex = function () {
            if (View.FocusView && View.FocusView.id.indexOf(recycleView.idPrefix) == 0) {
                var index = parseInt(View.FocusView.id.substring(recycleView.idPrefix.length), 10);
                return index;
            } else {
                return -1;
            }
        };

        /**
         * 滚动到childView
         * 重写areaView的方法，相较areaView内部逻辑有略微调整
         * @param childView
         */
        recycleView.scrollToChild = function (childView, currentScroll) {
            if (!childView) {
                return;
            }
            if (!recycleView.getChildViewById(childView.id)) {//childView不在recycleView中
                return;
            }

            recycleView.scrollLocate = recycleView.scrollLocate == View.scrollCenter ? View.scrollCenter : View.scrollNormal;

            recycleView.scrollToChildDom(childView.getDom(), recycleView.scrollLocate, currentScroll);
        };

        /**
         * 获取标签中的属性，并设置
         */
        recycleView.setAttributeParam = function () {
            var dom = recycleView.getDom();
            if (!dom) {
                return;
            }
            //child点击监听,在areaView中处理

            //child焦点变化监听,在areaView中处理
            //驻留效果,areaView处理

            //滚动监听,在父控件中处理

            //适配器设置
            var adapter = dom.getAttribute(View.attributeKey.adapter);
            if (adapter) {
                recycleView.setAdapter(window[adapter]);
            }

            //属性设置
            //方向
            var orientation = dom.getAttribute(View.attributeKey.orientation);
            if (orientation == (View.horizontal + "") || orientation == "horizontal" || orientation == "h") {//1、h或horizontal为横向其他为纵向
                recycleView.orientation = View.horizontal;
            } else {
                recycleView.orientation = View.vertical;
            }
            //焦点是否循环
            var isLoop = dom.getAttribute(View.attributeKey.isLoop);
            if (isLoop == "0" || isLoop == "false") {//0或false为焦点不循环
                recycleView.isLoop = false;
            } else {//默认开启
                recycleView.isLoop = true;
            }
            //焦点是否循环
            var isCirculate = dom.getAttribute(View.attributeKey.isCirculate);
            if (isCirculate == "1" || isCirculate == "true") {//1或true为首位效果循环
                recycleView.isCirculate = true;
            } else {//默认不开启
                recycleView.isCirculate = false;
            }
            //焦点位置，areaView中处理

            //行
            var row = dom.getAttribute(View.attributeKey.row);
            if (row) {
                try {
                    recycleView.row = parseInt(row + "");
                } catch (e) {
                    console.log("error:recycleView " + recycleView.id + " row值类型错误，应该填数字");
                }
            }

            //列
            var col = dom.getAttribute(View.attributeKey.col);
            if (col) {
                try {
                    recycleView.col = parseInt(col + "");
                } catch (e) {
                    console.log("error:recycleView " + recycleView.id + " col值类型错误，应该填数字");
                }
            }
            //跑马灯
            var hasMarquee = dom.getAttribute(View.attributeKey.hasMarquee);
            if (hasMarquee == "1" || hasMarquee == "true") {//1或true表示有跑马灯
                recycleView.hasMarquee = true;
            } else {//默认不开启
                recycleView.hasMarquee = false;
            }
        };
        //设置
        recycleView.setAttributeParam();

        return recycleView;
    }
};

/**
 * 数据过短时，强制循环未实现
 * RecycleViewMultiple简写RecycleViewM：单个组件可以有多个可上焦的
 * @type {{createNew: (function(*=): *|{})}}
 */
var RecycleViewM = {
    createNew: function (id) {
        var recycleView = AreaView.createNew(id);
        recycleView.viewType = "recycleViewM";
        recycleView.orientation = View.vertical;//方向，默认纵向

        recycleView.componentIdList = [];//存放组件内控件id

        recycleView.idPrefix = id + "_";//子元素前置id
        recycleView.needMarqueeIdPrefix = recycleView.idPrefix + "txt_";//跑马灯的前缀
        //一行一列效果和listView相同,多行多列和gridView效果相同
        recycleView.col = 1;//默认1列，该参数在纵向时生效
        recycleView.row = 1;//默认1行，该参数在横向时生效

        recycleView.isLoop = true;//是否循环
        recycleView.isCirculate = false;//首尾相接循环开关,默认关
        recycleView.hasMarquee = false;//存在跑马灯

        //---------start 计算值--------
        recycleView.distance = 0;//适配器component行/列间距
        recycleView.componentWidth = 0;//适配器component宽
        recycleView.componentHeight = 0;//适配器component高
        recycleView.layoutRow = 0;//最小行数
        recycleView.layoutCol = 0;//最小列数
        recycleView.visibleRow = 0;//可见行数
        recycleView.visibleCol = 0;//可见列数
        recycleView.startRow = -1;//起始行
        recycleView.startCol = -1;//起始列
        recycleView.isSingle = true;//true：adapter内只有一个子控件，false:有多个子控件
        //---------end 计算值--------

        recycleView.scrollRow = 0;//当前滚动的行
        recycleView.scrollCol = 0;//当前滚动的列
        recycleView.children = null;//子控件对应的节点

        /**
         * 适配器
         * @param idPrefix
         * @param index 获取数据或子view使用，不可用于计算坐标
         * @param row 行数
         * @param col 列数
         * @param data
         */
        recycleView.adapter = function (idPrefix, index, row, col, data) {
            console.log("warn:" + recycleView.id + "适配器未重写, adapter必须在bindData前重写");
            return "";
        };

        /**
         *
         * @param data
         * @param position 设置焦点显示的位置 {left: 0, top: 0}
         */
        recycleView.bindData = function (data, position) {
            if (recycleView.data && recycleView.data.length > 0) {
                recycleView.clear();
            }
            if (!data) {
                data = [];
            }

            if (data.length == 0) {
                return;
            }

            recycleView.data = data;
            if (recycleView.data.length <= 0) {
                return;//不渲染
            }

            var index = recycleView.getCurrentIndex();
            if (View.FocusView == recycleView) {
                recycleView.scrollByIndex(0, View.scrollStart, true);
                var childView = null;
                if (recycleView.isSingle) {
                    childView = recycleView.getChildViewById(recycleView.componentIdList[0]);
                } else {
                    childView = recycleView.getChildViewById(recycleView.componentIdList[0][0]);
                }
                childView.focus();
            } else {
                if (index < 0) {
                    recycleView.scrollByIndex(0, View.scrollStart, true);
                } else {
                    recycleView.scrollByIndex(index, View.scrollStart, true);
                    if (index >= data.length) {//兼容焦点越界，多用于删除操作
                        index = data.length - 1;
                        var childView = null;
                        if (recycleView.isSingle) {
                            childView = recycleView.getChildViewById(recycleView.componentIdList[index]);
                        } else {
                            childView = recycleView.getChildViewById(recycleView.componentIdList[index][0]);
                        }
                        childView.focus();
                    } else {
                        View.FocusView.focus();
                    }
                    if (position) {
                        View.setAbsolutePositionBy(View.FocusView.id, recycleView, position);
                    }
                }
            }

        };

        /**
         * 新增数据
         * @param data
         */
        recycleView.addData = function (data) {
            if (!recycleView.data || recycleView.data.length == 0) {
                recycleView.bindData(data);
                return;
            }

            var index = recycleView.getSelectIndex();
            if (index < 0) {
                index = 0;
            }
            recycleView.data = recycleView.data.concat(data);

            recycleView.refresh(index, recycleView.scrollLocate, true);
        }

        /**
         * 清除数据及子控件
         */
        recycleView.clear = function () {
            recycleView.startRow = -1;//起始行
            recycleView.startCol = -1;//起始列
            recycleView.scrollRow = 0;//当前滚动的行
            recycleView.scrollCol = 0;//当前滚动的列
            recycleView.children = null;//子控件对应的节点
            recycleView.selectView = null;
            recycleView.data = [];
            for (var i = 0; i < recycleView.childViews.length; i++) {
                recycleView.childViews[i].remove();//从缓存中移除该空间
            }
            recycleView.childViews = [];
            var htmlStr = "";
            recycleView.setHtml(htmlStr);

            if (recycleView.orientation == View.horizontal) {
                recycleView.setScrollLeft(0);
            } else {
                recycleView.setScrollTop(0);
            }
        };

        /**
         * 刷新布局
         */
        recycleView.refresh = function (index, scrollLocate, forceRefresh) {
            if (!recycleView.data || recycleView.data.length <= 0) {
                return;
            }
            if (recycleView.distance <= 0) {//老的版本中，由于没有计算准确，所以需要每次刷新数据时，刷新参数
                recycleView.refreshParam();//刷新param
            }

            var childId = recycleView.idPrefix + index;
            var position = View.getAbsolutePositionBy(childId, recycleView);//获取当前位置
            var scrollDirection = "";//滚动方向，只有在childId未渲染时存在
            if (!View.$$(childId)) {//目标控件未渲染
                scrollDirection = recycleView.getScrollDirection(index);
            }
            var needLayout = recycleView.refreshStartIndex(index, scrollLocate);//渲染的数据起点

            if (needLayout || forceRefresh) {
                // console.log("info: " + (recycleView.orientation == View.vertical ?
                //     ("startRow:" + recycleView.startRow) : ("startCol:" + recycleView.startCol)) + ",刷新");
                var isBindData = false;
                if (recycleView.scroller.getDom().children.length <= 0) {//是否是绑定数据
                    isBindData = true;
                }
                recycleView.layout();//布局
                recycleView.refreshChildView();//刷新childViews
                recycleView.correctPosition(childId, scrollDirection, position);//校准布局
                if (isBindData) {//是绑定数据，则直接定位到
                    console.log("info: 绑定数据");
                    recycleView.scrollToIndexNoAnimation(index, scrollLocate);
                }
            }
        };

        /**
         * 子控件上焦监听,内部使用
         * @param view
         * @param hasFocus
         */
        recycleView.onRecycleFocusChangeListener = function (view, hasFocus) {
            if (recycleView.onChildFocusChangeListener)
                recycleView.onChildFocusChangeListener(view, hasFocus);

            if (hasFocus) {
                if (recycleView.selectView && recycleView.selectView != View.FocusView && recycleView.needSelect) {
                    recycleView.selectView.setUnFocusStyle();
                }
                recycleView.selectView = view;
                var index = recycleView.getCurrentIndex();
                recycleView.refresh(index);//刷新
                var childDom = View.$$(recycleView.idPrefix + index);
                recycleView.scrollToChildDom(childDom);
            } else {
                if (recycleView.needSelect) {
                    view.setSelectStyle();
                }
            }

        };

        /**
         * 滚动到指定index
         * @param index
         * @param currentScroll 是否只滚动当前控件
         */
        recycleView.scrollByIndex = function (index, scrollLocate, currentScroll) {
            if (index >= recycleView.data.length) {
                index = recycleView.data.length - 1;
            }
            recycleView.refresh(index, scrollLocate);
            var childDom = View.$$(recycleView.idPrefix + index);
            recycleView.scrollToChildDom(childDom, scrollLocate, currentScroll);
            var currentIndex = recycleView.getCurrentIndex();
            if (currentIndex >= 0 && View.FocusView.getDom()) {
                View.FocusView.setFocusStyle();
            }
        };

        /**
         * 指定index上焦
         * @param index
         */
        recycleView.focusByIndex = function (index, scrollLocate) {
            index = index >= recycleView.data.length ? recycleView.data.length - 1 : index;
            recycleView.scrollByIndex(index, scrollLocate);

            var childView = null;
            if (recycleView.isSingle) {
                childView = recycleView.getChildViewById(recycleView.componentIdList[index]);
            } else {
                childView = recycleView.getChildViewById(recycleView.componentIdList[index][0]);
            }

            childView.requestFocus();
        };

        /**
         * 刷新子控件childViews,把未加的childView加到childViews中
         */
        recycleView.refreshChildView = function () {
            var startIndex = 0;
            var totalNum = 0;//需要渲染的总行数
            if (recycleView.orientation == View.vertical) {
                startIndex = recycleView.startRow * recycleView.col;
                totalNum = recycleView.layoutRow * recycleView.col;
            } else {
                startIndex = recycleView.startCol * recycleView.row;
                totalNum = recycleView.layoutCol * recycleView.row;
            }

            //添加子控件,addComponent执行次数必然会小于数据长度
            for (var i = 0; i < totalNum && i < recycleView.data.length; i++) {
                var index = (i + startIndex) % recycleView.data.length;
                recycleView.addComponent(index);
            }
        };

        /**
         * 把index组件中的子控件添加进childViews中
         * @param index
         */
        recycleView.addComponent = function (index) {
            if (recycleView.isSingle) {
                var id = recycleView.componentIdList[index];
                var childView = recycleView.getChildViewById(id);
                if (!childView) {
                    recycleView.addChild(id);
                    childView = recycleView.getChildViewById(id);
                    childView.setOnFocusChangeListener(recycleView.onRecycleFocusChangeListener);
                }
                childView.bindData(recycleView.data[index]);
                if (recycleView.hasMarquee) {//绑定跑马灯
                    try {
                        var textViewId = childView.id.replace(recycleView.idPrefix, recycleView.needMarqueeIdPrefix);
                        childView.bindTextView(TextView.createNew(textViewId));//绑定textView
                    } catch (e) {
                        console.log("bindTextView error：" + recycleView.id + "适配器的绑定TextView的id不规范或者不存在！");
                    }
                }
            } else {
                var ids = recycleView.componentIdList[index];
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    var childView = recycleView.getChildViewById(ids[i]);
                    if (!childView) {
                        recycleView.addChild(id);
                        childView = recycleView.getChildViewById(id);
                        childView.setOnFocusChangeListener(recycleView.onRecycleFocusChangeListener);
                    }
                    childView.bindData(recycleView.data[index]);
                    if (recycleView.hasMarquee && i == 0) {//绑定跑马灯,默认绑在第一个
                        try {
                            var textViewId = recycleView.needMarqueeIdPrefix + index;
                            childView.bindTextView(TextView.createNew(textViewId));//绑定textView
                        } catch (e) {
                            console.log("bindTextView error：" + recycleView.id + "适配器的绑定TextView的id不规范或者不存在！");
                        }
                    }
                }
            }

        };

        /**
         * 刷新属性
         * 组件宽高
         * 组件行列间距
         * 组件最小布局数
         */
        recycleView.refreshParam = function () {
            recycleView.pre_layout();//预先渲染最少的可以计算param
            recycleView.refreshDistance();//刷新distance
            recycleView.refreshComponentParam();//刷新组件的宽高
            recycleView.refreshMinLayout();//计算最小布局
            recycleView.setHtml("");//清除预布局节点
        };

        /**
         * 预布局，用于计算param
         */
        recycleView.pre_layout = function () {
            var divs = [];
            var obj = recycleView.adapter(recycleView.idPrefix, 0, 0, 0, recycleView.data[0]);//用0号数据布局第一个
            if (typeof (obj) == "object") {
                if (obj.div) {
                    recycleView.isSingle = false;//内部不是单一节点
                    divs.push(obj.div);
                } else {
                    console.log("error:" + recycleView.id + "的adapter_obj中的div值错误");
                    return;
                }
            } else if (typeof (obj) == "string") {
                recycleView.isSingle = true;//内部是单一节点
                divs.push(obj)
            } else {
                return;
            }
            var row = 0;//行
            var col = 0;//列
            var index = 0;
            if (recycleView.orientation == View.vertical) {
                row = 1;
                col = 0;
                index = recycleView.col;
            } else {
                row = 0;
                col = 1;
                index = recycleView.row;
            }

            var obj_next = recycleView.adapter(recycleView.idPrefix, index, row, col, recycleView.data[0]);//用0号数据布局第index个
            if (typeof (obj_next) == "object") {
                if (obj_next.div) {
                    divs.push(obj_next.div);
                } else {
                    console.log("error:" + recycleView.id + "的adapter_obj中的div值错误");
                    return;
                }
            } else if (typeof (obj_next) == "string") {
                divs.push(obj_next)
            } else {
                return;
            }

            var htmlStr = divs.join("");
            recycleView.setHtml(htmlStr);
        };

        /**
         * 改方法只能在pre_layout方法之后执行
         */
        recycleView.refreshDistance = function () {
            var children = recycleView.scroller.getDom().children;
            //adapter设置时只允许一个dom
            var position_0 = AreaView.getPositionByDom(children[0], recycleView.getDom());
            var position_1 = AreaView.getPositionByDom(children[1], recycleView.getDom());
            if (recycleView.orientation == View.vertical) {//纵向
                recycleView.distance = Math.abs(position_0.top - position_1.top);
            } else {//横向
                recycleView.distance = Math.abs(position_0.left - position_1.left);
            }
        }

        /**
         * 组件宽高
         */
        recycleView.refreshComponentParam = function () {
            var children = recycleView.scroller.getDom().children;
            var componentSize = View.getVisibleSize(children[0]);
            recycleView.componentWidth = componentSize.width;
            recycleView.componentHeight = componentSize.height;
        };

        /**
         * 刷新最小布局数量(layoutRow/layoutCol)
         */
        recycleView.refreshMinLayout = function () {
            if (recycleView.orientation == View.vertical) {//纵向
                var H = recycleView.getHeight();
                var h = recycleView.componentHeight;
                var layoutRow = Math.ceil((H - h) / recycleView.distance) + 1;//可见行
                recycleView.visibleRow = layoutRow;
                recycleView.layoutRow = 2 * layoutRow + 2; //最少布局行数

            } else {
                var W = recycleView.getWidth();
                var w = recycleView.componentWidth;
                var layoutCol = Math.ceil((W - w) / recycleView.distance) + 1;//可见列
                recycleView.visibleCol = layoutCol;
                recycleView.layoutCol = 2 * layoutCol + 2; //最少布局列数
            }
        };

        /**
         *
         * @param index 目的下标
         * @param scrollLocate
         * @return {*}
         */
        recycleView.refreshStartIndex = function (index, scrollLocate) {
            if (typeof (scrollLocate) == "undefined") {
                scrollLocate = recycleView.scrollLocate;
            }
            if (!index) {
                index = 0;
            }
            var needLayout = false;
            //计算index所在行/列
            if (recycleView.orientation == View.vertical) {
                needLayout = recycleView.refreshVerticalStartIndex(index, scrollLocate);
            } else {
                needLayout = recycleView.refreshHorizontalStartIndex(index, scrollLocate);
            }

            return needLayout;
        };

        recycleView.refreshVerticalStartIndex = function (index, scrollLocate) {
            var startRow = recycleView.startRow;//起始行
            var indexRow = parseInt(index / recycleView.col) + 1;//目标行
            var visibleRow = recycleView.visibleRow;//可见行数
            var totalRenderRow = recycleView.layoutRow;//需要渲染的总行数
            var upInvisibleRow = Math.ceil(visibleRow / 2) + 1;//上方不可见的行数
            var totalRow = Math.ceil(recycleView.data.length / recycleView.col);//总行数
            if (scrollLocate == View.scrollStart) {
                startRow = indexRow - upInvisibleRow;
            } else if (scrollLocate == View.scrollCenter) {
                startRow = indexRow - Math.ceil((totalRenderRow - 1) / 2);
            } else if (scrollLocate == View.scrollEnd) {
                startRow = indexRow - (upInvisibleRow + visibleRow - 1);
            } else {
                if (!View.$$(recycleView.idPrefix + index)) {
                    startRow = indexRow - (upInvisibleRow + visibleRow - 1);
                } else {
                    var absoluteTop = View.getAbsolutePositionBy(recycleView.idPrefix + index, recycleView).top;
                    if (absoluteTop > 0 && (absoluteTop + recycleView.componentHeight) < recycleView.getHeight()) {//无动作
                        // console.log("info:无动作");
                    } else {
                        if (recycleView.isLoop && recycleView.isCirculate) {
                            var forwardDisRow = (indexRow - recycleView.scrollRow + totalRow) % totalRow;
                            var rewindDisRow = (recycleView.scrollRow - indexRow + totalRow) % totalRow;
                            if (rewindDisRow < forwardDisRow) {//等同scrollStart
                                startRow = indexRow - upInvisibleRow;
                            } else if (rewindDisRow >= forwardDisRow) {//等同scrollEnd
                                startRow = indexRow - (upInvisibleRow + visibleRow - 1);
                            }
                        } else {
                            if (indexRow < recycleView.scrollRow) {//等同scrollStart
                                startRow = indexRow - upInvisibleRow;
                            } else if (indexRow > recycleView.scrollRow) {//等同scrollEnd
                                startRow = indexRow - (upInvisibleRow + visibleRow - 1);
                            }
                        }

                    }
                }

            }

            if (recycleView.isLoop && recycleView.isCirculate //首位循环效果
                && recycleView.data.length >= totalRenderRow * recycleView.col) {//并且数据长度大于最小渲染长度
                startRow = (startRow + totalRow) % totalRow;
            } else {
                if (startRow + totalRenderRow > totalRow) {//渲染的行越界
                    startRow = totalRow - totalRenderRow;
                }
                if (startRow < 0) {
                    startRow = 0;
                }
            }

            if (startRow == recycleView.startRow) {
                return false;
            } else {
                recycleView.scrollRow = indexRow;
                recycleView.startRow = startRow;
                return true;
            }
        };

        recycleView.refreshHorizontalStartIndex = function (index, scrollLocate) {
            var startCol = recycleView.startCol;//起始行
            var indexCol = parseInt(index / recycleView.row) + 1;//目标行
            var visibleCol = recycleView.visibleCol;//可见行数
            var totalRenderCol = recycleView.layoutCol;//需要渲染的总行数
            var upInvisibleCol = Math.ceil(visibleCol / 2) + 1;//上方不可见的行数
            var totalCol = Math.ceil(recycleView.data.length / recycleView.row);//总行数
            if (scrollLocate == View.scrollStart) {
                startCol = indexCol - upInvisibleCol;
            } else if (scrollLocate == View.scrollCenter) {
                startCol = indexCol - Math.ceil((totalRenderCol - 1) / 2);
            } else if (scrollLocate == View.scrollEnd) {
                startCol = indexCol - (upInvisibleCol + visibleCol - 1);
            } else {
                if (!View.$$(recycleView.idPrefix + index)) {
                    startCol = indexCol - (upInvisibleCol + visibleCol - 1);
                } else {
                    var absoluteLeft = View.getAbsolutePositionBy(recycleView.idPrefix + index, recycleView).left;
                    if (absoluteLeft > 0 && (absoluteLeft + recycleView.componentWidth) < recycleView.getWidth()) {//无动作
                        // console.log("info:无动作");
                    } else {
                        if (recycleView.isLoop && recycleView.isCirculate) {
                            var forwardDisCol = (indexCol - recycleView.scrollCol + totalCol) % totalCol;
                            var rewindDisCol = (recycleView.scrollCol - indexCol + totalCol) % totalCol;
                            if (rewindDisCol < forwardDisCol) {//等同scrollStart
                                startCol = indexCol - upInvisibleCol;
                            } else if (rewindDisCol >= forwardDisCol) {//等同scrollEnd
                                startCol = indexCol - (upInvisibleCol + visibleCol - 1);
                            }
                        } else {
                            if (indexCol < recycleView.scrollCol) {//等同scrollStart
                                startCol = indexCol - upInvisibleCol;
                            } else if (indexCol > recycleView.scrollCol) {//等同scrollEnd
                                startCol = indexCol - (upInvisibleCol + visibleCol - 1);
                            }
                        }

                    }
                }

            }

            if (recycleView.isLoop && recycleView.isCirculate //首位循环效果
                && recycleView.data.length >= totalRenderCol * recycleView.row) {//并且数据长度大于最小渲染长度
                startCol = (startCol + totalCol) % totalCol;
            } else {
                if (startCol + totalRenderCol > totalCol) {//渲染的行越界
                    startCol = totalCol - totalRenderCol;
                }
                if (startCol < 0) {
                    startCol = 0;
                }
            }

            if (startCol == recycleView.startCol) {
                return false;
            } else {
                recycleView.scrollCol = indexCol;
                recycleView.startCol = startCol;
                return true;
            }
        };


        recycleView.layout = function () {
            var retainDomIndexList = recycleView.retainDom();//把需要保留的留下，其他的删除

            //计算index所在行/列
            if (recycleView.orientation == View.vertical) {
                recycleView.layoutVertical(retainDomIndexList);
            } else {
                recycleView.layoutHorizontal(retainDomIndexList);
            }
            recycleView.children = recycleView.scroller.getDom().children;
            recycleView.measure();
        }


        recycleView.layoutVertical = function (retainDomIndexList) {
            if (recycleView.distance <= 0) {
                return;
            }

            var renderNum = recycleView.layoutRow * recycleView.col;//渲染数量
            renderNum = renderNum > recycleView.data.length ? recycleView.data.length : renderNum;
            var startIndex = recycleView.startRow * recycleView.col;//起始渲染的下标
            var startRow = recycleView.startRow;//起始行
            var data = recycleView.data;
            for (var i = 0; i < renderNum; i++) {
                var index = i + startIndex//数据序号
                if (!recycleView.isCirculate && index >= recycleView.data.length) {
                    break;
                } else {
                    index = index % recycleView.data.length;
                }

                var col = index % recycleView.col;//实际列
                var totalRow = Math.ceil(data.length / recycleView.col);//总行数
                var indexRow = parseInt(index / recycleView.col);//当前行
                var row = (indexRow + totalRow - startRow) % totalRow;//实际行

                if (retainDomIndexList.length >= 0 && retainDomIndexList.indexOf(index) > -1) {//index这个为已存在的节点
                    var top = row * recycleView.distance;
                    View.$$(recycleView.idPrefix + index).style.top = top + "px";
                    // console.log("info:已有：" + index);
                } else {
                    var obj = recycleView.adapter(recycleView.idPrefix, index, row, col, recycleView.data[index]);
                    var dom = null;
                    if (typeof (obj) == "object") {
                        if (obj.div) {
                            dom = View.parseDom(obj.div);
                            recycleView.componentIdList[index] = obj.ids;
                        } else {
                            console.log("error:" + recycleView.id + "的adapter_obj中的div值错误");
                            return;
                        }
                    } else if (typeof (obj) == "string") {
                        dom = View.parseDom(obj);
                        recycleView.componentIdList[index] = recycleView.idPrefix + index;
                    } else {
                        return;
                    }
                    if (dom.length == 1) {
                        // console.log("info:新增：" + index);
                        var width = View.getViewWidth(dom[0]);
                        var height = View.getViewHeight(dom[0]);
                        //判断实际的子控件宽高（显示的真是宽高）和节点的设置宽高的大小，以大的为准
                        if (width < recycleView.componentWidth) {
                            dom[0].style.width = recycleView.componentWidth + "px";
                        }
                        if (height < recycleView.componentHeight) {
                            dom[0].style.height = recycleView.componentHeight + "px";
                        }
                        recycleView.scroller.getDom().appendChild(dom[0]);
                    } else {
                        console.log("error:" + recycleView.id + "的adapter内部有两个同级节点");
                    }
                }

            }
        };

        recycleView.layoutHorizontal = function (retainDomIndexList) {
            if (recycleView.distance <= 0) {
                return;
            }

            var renderNum = recycleView.layoutCol * recycleView.row;//渲染数量
            renderNum = renderNum > recycleView.data.length ? recycleView.data.length : renderNum;
            var startIndex = recycleView.startCol * recycleView.row;//起始渲染的下标
            var startCol = recycleView.startCol;//起始行
            var data = recycleView.data;
            for (var i = 0; i < renderNum; i++) {
                var index = i + startIndex//数据序号
                if (!recycleView.isCirculate && index >= recycleView.data.length) {
                    break;
                } else {
                    index = index % recycleView.data.length;
                }

                var row = index % recycleView.row;//实际列
                var totalCol = Math.ceil(data.length / recycleView.row);//总行数
                var indexCol = parseInt(index / recycleView.row);//当前行
                var col = (indexCol + totalCol - startCol) % totalCol;//实际行

                if (retainDomIndexList.length >= 0 && retainDomIndexList.indexOf(index) > -1) {//index这个为已存在的节点
                    var left = col * recycleView.distance;
                    View.$$(recycleView.idPrefix + index).style.left = left + "px";
                    // console.log("info:已有：" + index);
                } else {
                    var obj = recycleView.adapter(recycleView.idPrefix, index, row, col, recycleView.data[index]);
                    var dom = null;
                    if (typeof (obj) == "object") {
                        if (obj.div) {
                            dom = View.parseDom(obj.div);
                            recycleView.componentIdList[index] = obj.ids;
                        } else {
                            console.log("error:" + recycleView.id + "的adapter_obj中的div值错误");
                            return;
                        }
                    } else if (typeof (obj) == "string") {
                        dom = View.parseDom(obj);
                        recycleView.componentIdList[index] = recycleView.idPrefix + index;
                    } else {
                        return;
                    }
                    if (dom.length == 1) {
                        // console.log("info:新增：" + index);
                        var width = View.getViewWidth(dom[0]);
                        var height = View.getViewHeight(dom[0]);
                        //判断实际的子控件宽高（显示的真是宽高）和节点的设置宽高的大小，以大的为准
                        if (width < recycleView.componentWidth) {
                            dom[0].style.width = recycleView.componentWidth + "px";
                        }
                        if (height < recycleView.componentHeight) {
                            dom[0].style.height = recycleView.componentHeight + "px";
                        }
                        recycleView.scroller.getDom().appendChild(dom[0]);
                    } else {
                        console.log("error:" + recycleView.id + "的adapter内部有两个同级节点");
                    }
                }

            }
        };

        /**
         * 设置适配器，listView、GridView的setBuildItemView相同，命名为符合功能的方法名
         * @param adapter
         */
        recycleView.setAdapter = function (adapter) {
            recycleView.distance = 0;//强制刷新计算值
            recycleView.adapter = adapter;
        };

        /**
         * 获取当前的焦点序号
         */
        recycleView.getCurrentIndex = function () {
            if (View.FocusView && View.FocusView.id.indexOf(recycleView.idPrefix) == 0) {
                var str = View.FocusView.id.substring(recycleView.idPrefix.length);
                var index = -1;
                try {
                    if (str.indexOf("_") > -1) {
                        index = parseInt(str.substring(str.indexOf("_") + 1), 10);
                    } else {
                        index = parseInt(str, 10);
                    }
                } catch (e) {
                    index = -1;
                }
                if (!index && index != 0) {
                    index = -1;
                }
                return index;
            } else {
                return -1;
            }
        };

        /**
         * 获取驻留的下标
         * @return {number}
         */
        recycleView.getSelectIndex = function () {
            if (!recycleView.selectView) {
                return -1;
            }

            var str = recycleView.selectView.id.substring(recycleView.idPrefix.length);
            var index = -1;
            try {
                if (str.indexOf("_") > -1) {
                    index = parseInt(str.substring(str.indexOf("_") + 1), 10);
                } else {
                    index = parseInt(str, 10);
                }
            } catch (e) {
                index = -1;
            }
            if (!index && index != 0) {
                index = -1;
            }
            return index;
        }

        /**
         * 保留需要保留的
         * @return {[]}
         */
        recycleView.retainDom = function () {

            if (!recycleView.children || recycleView.children.length <= 0) {
                return [];
            }

            var startIndex = 0;
            var renderNum = 0;
            if (recycleView.orientation == View.vertical) {
                startIndex = recycleView.startRow * recycleView.col;
                renderNum = recycleView.layoutRow * recycleView.col;
            } else {
                startIndex = recycleView.startCol * recycleView.row;
                renderNum = recycleView.layoutCol * recycleView.row;
            }
            var retainDomIndexList = [];
            for (var i = startIndex; i < startIndex + renderNum; i++) {
                var index = i % recycleView.data.length;
                var id = recycleView.idPrefix + index;
                if (View.$$(id)) {//存在
                    retainDomIndexList.push(index);
                }
            }
            var children = recycleView.children;
            var removeChild = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var index = parseInt(child.id.substring(recycleView.idPrefix.length), 10);
                if (retainDomIndexList.indexOf(index) < 0) {
                    // console.log("info:删除：" + child.id);
                    removeChild.push(child);
                }
            }

            for (var i = 0; i < removeChild.length; i++) {
                if (removeChild[i].remove) {
                    removeChild[i].remove();
                }
                if (removeChild[i] && View.$$(removeChild[i].id)) {//兼容removeChild[i].remove();不生效问题
                    recycleView.scroller.getDom().removeChild(removeChild[i]);
                }
            }

            return retainDomIndexList;
        };

        /**
         * 重写areaView内部特殊处理的焦点向上方法
         */
        recycleView.childNextUp = function (childView) {
            var nextUp = AreaView.getMinUpDistanceChild(recycleView, childView);
            if (!nextUp) {//到达上边界
                if (recycleView.isLoop && recycleView.orientation == View.vertical) {
                    var index = recycleView.getCurrentIndex();
                    var col = index % recycleView.col;
                    var toIndex = (Math.ceil(recycleView.data.length / recycleView.col) - 1) * recycleView.col + col;
                    recycleView.focusByIndex(toIndex);
                } else {
                    nextUp = recycleView.nextUp;
                    View.next(nextUp);
                }
            } else {
                View.next(nextUp);
            }
        };

        /**
         * 重写areaView内部特殊处理的焦点向下方法
         */
        recycleView.childNextDown = function (childView) {
            var nextDown = AreaView.getMinDownDistanceChild(recycleView, childView);
            if (!nextDown) {//到达下边界
                if (recycleView.isLoop && recycleView.orientation == View.vertical) {
                    var index = recycleView.getCurrentIndex();
                    var toIndex = index % recycleView.col;
                    recycleView.focusByIndex(toIndex);
                } else {
                    nextDown = recycleView.nextDown;
                    View.next(nextDown);
                }
            } else {
                View.next(nextDown);
            }
        };

        /**
         * 重写areaView内部特殊处理的焦点向左方法
         */
        recycleView.childNextLeft = function (childView) {
            var nextLeft = AreaView.getMinLeftDistanceChild(recycleView, childView);
            if (!nextLeft) {//到达左边界
                if (recycleView.isLoop && recycleView.orientation == View.horizontal) {
                    var index = recycleView.getCurrentIndex();
                    var row = index % recycleView.row;
                    var toIndex = (Math.ceil(recycleView.data.length / recycleView.row) - 1) * recycleView.row + row;
                    recycleView.focusByIndex(toIndex);
                } else {
                    nextLeft = recycleView.nextLeft;
                    View.next(nextLeft);
                }
            } else {
                View.next(nextLeft);
            }
        };

        /**
         * 重写areaView内部特殊处理的焦点向右方法
         */
        recycleView.childNextRight = function (childView) {
            var nextRight = AreaView.getMinRightDistanceChild(recycleView, childView);
            if (!nextRight) {//到达右边界
                if (recycleView.isLoop && recycleView.orientation == View.horizontal) {
                    var index = recycleView.getCurrentIndex();
                    var toIndex = index % recycleView.row;
                    recycleView.focusByIndex(toIndex);
                } else {
                    nextRight = recycleView.nextRight;
                    View.next(nextRight);
                }
            } else {
                View.next(nextRight);
            }
        };

        /**
         * 当滚动距离过大，超出已渲染节点
         * 获取滚动方向
         * @param index
         * @return {string}
         */
        recycleView.getScrollDirection = function (index) {
            var scrollDirection = "";
            if (recycleView.orientation == View.vertical) {
                var indexRow = Math.ceil(index / recycleView.col);//目标行
                if (recycleView.scrollRow < indexRow) {
                    scrollDirection = "vertical-end-start";
                } else {
                    scrollDirection = "vertical-start-end";
                }
            } else {
                var indexCol = Math.ceil(index / recycleView.row);//目标列
                if (recycleView.scrollCol < indexCol) {
                    scrollDirection = "horizontal-end-start";
                } else {
                    scrollDirection = "horizontal-start-end";
                }
            }
            return scrollDirection;
        };

        /**
         * @param childId 目的子控件id
         * @param scrollDirection 滚动方向
         * @param position 目的位置
         */
        recycleView.correctPosition = function (childId, scrollDirection, position) {
            if (scrollDirection) {//有滚动方向时，表示无法准确校准，改变position到一个较为合理的位置
                if (scrollDirection.indexOf("vertical") > -1) {
                    if (scrollDirection.indexOf("start-end") > -1) {//TODO 计算值有问题
                        position.top = recycleView.getScrollHeight() - recycleView.getHeight();
                    } else {
                        position.top = 0;
                    }
                    childId = recycleView.idPrefix + (recycleView.startRow * recycleView.col);
                } else {
                    if (scrollDirection.indexOf("start-end") > -1) {
                        position.left = recycleView.getScrollWidth() - recycleView.getWidth();
                    } else {
                        position.left = 0;
                    }
                    childId = recycleView.idPrefix + (recycleView.startCol * recycleView.row);
                }

            }
            View.setAbsolutePositionBy(childId, recycleView, position);//位置校准
        };

        /**
         * 无动画滚动到指定index，如果index节点为渲染则无变化
         * @param index
         */
        recycleView.scrollToIndexNoAnimation = function (index, scrollLocate) {
            if (index >= recycleView.data.length) {
                index = recycleView.data.length - 1;
            }
            recycleView.refresh(index, scrollLocate);
            var childDom = View.$$(recycleView.idPrefix + index);
            if (typeof (scrollLocate) == "undefined") {
                scrollLocate = recycleView.scrollLocate;
            }

            var animation = recycleView.scrollAnimation;
            if (recycleView.scrollAnimation) {
                recycleView.scrollAnimation = false;
            }

            recycleView.scrollToChildDom(childDom, scrollLocate, true);
            if (animation) {
                recycleView.scrollAnimation = true;
            }

            var currentIndex = recycleView.getCurrentIndex();
            if (currentIndex >= 0 && View.FocusView.getDom()) {
                View.FocusView.setFocusStyle();
            }
        };

        /**
         * 获取标签中的属性，并设置
         */
        recycleView.setAttributeParam = function () {
            var dom = recycleView.getDom();
            if (!dom) {
                return;
            }
            //child点击监听,在areaView中处理
            //child焦点变化监听,在areaView中处理
            //驻留效果,areaView处理
            //滚动监听,在父控件中处理

            //适配器设置
            var adapter = dom.getAttribute(View.attributeKey.adapter);
            if (adapter) {
                recycleView.setAdapter(window[adapter]);
            }

            //属性设置
            //方向
            var orientation = dom.getAttribute(View.attributeKey.orientation);
            if (orientation == (View.horizontal + "") || orientation == "horizontal" || orientation == "h") {//1、h或horizontal为横向其他为纵向
                recycleView.orientation = View.horizontal;
            } else {
                recycleView.orientation = View.vertical;
            }
            //焦点是否循环
            var isLoop = dom.getAttribute(View.attributeKey.isLoop);
            if (isLoop == "0" || isLoop == "false") {//0或false为焦点不循环
                recycleView.isLoop = false;
            } else {//默认开启
                recycleView.isLoop = true;
            }
            //焦点是否循环
            var isCirculate = dom.getAttribute(View.attributeKey.isCirculate);
            if (isCirculate == "1" || isCirculate == "true") {//1或true为首位效果循环
                recycleView.isCirculate = true;
            } else {//默认不开启
                recycleView.isCirculate = false;
            }
            //焦点位置，areaView中处理

            //行
            var row = dom.getAttribute(View.attributeKey.row);
            if (row) {
                try {
                    recycleView.row = parseInt(row + "");
                } catch (e) {
                    console.log("error:recycleView " + recycleView.id + " row值类型错误，应该填数字");
                }
            }

            //列
            var col = dom.getAttribute(View.attributeKey.col);
            if (col) {
                try {
                    recycleView.col = parseInt(col + "");
                } catch (e) {
                    console.log("error:recycleView " + recycleView.id + " col值类型错误，应该填数字");
                }
            }
            //跑马灯
            var hasMarquee = dom.getAttribute(View.attributeKey.hasMarquee);
            if (hasMarquee == "1" || hasMarquee == "true") {//1或true表示有跑马灯
                recycleView.hasMarquee = true;
            } else {//默认不开启
                recycleView.hasMarquee = false;
            }
        };
        //设置
        recycleView.setAttributeParam();

        return recycleView;
    },

    /**
     * 一个适配器有多个可上焦的控件
     * 适配器return格式
     */
    component_object: {
        div: '',//适配器布局
        ids: []//每个组件内部的子控件id数组,格式idPrefix+'xxx_'+index
    }
};


var Key = {
    KEY_BACK: 8, //返回键
    KEY_SPACE: 32,//电脑空格键，用作浏览器返回
    KEY_BACK_CLOUD: 45,//云平台返回
    KEY_BACK_FENGHUO: 1249,//烽火盒子返回

    KEY_OK: 13,//确定键

    KEY_LEFT: 37, //左键
    KEY_UP: 38, //上键
    KEY_RIGHT: 39, //右键
    KEY_DOWN: 40, //下键

    //ipanel 特殊键值
    KEY_BACK_IPANEL: 340,//ipanel 返回
    KEY_LEFT_IPANEL: 3, //ipanel 左键
    KEY_UP_IPANEL: 1, //ipanel 上键
    KEY_RIGHT_IPANEL: 4, //ipanel 右键
    KEY_DOWN_IPANEL: 2, //ipanel 下键


    KEY_PAGEUP: 33,//上翻页键
    KEY_PAGEDOWN: 34, //下翻页键

    //数字键 0~9
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,

    KEY_VOLUP: 259, //音量加
    KEY_VOLDOWN: 260, //音量减
    KEY_MUTE: 261, //静音键
    KEY_DEL: 46,//海信 删除键

    // 四色键
    KEY_RED: 275,
    KEY_GREEN: 276,
    KEY_YELLOW: 277,
    KEY_BLUE: 278,

    //兼容华为EC6108V9A悦盒
    KEY_RED_EC: 1108,
    KEY_GREEN_EC: 1110,
    KEY_YELLOW_EC: 1109,
    KEY_BLUE_EC: 1112,

    KEY_MPEVENT: 768,//播放事件键值
    createNew: function () {
        //单例，只创建一次
        if (View.key) {
            return View.key;
        }

        var key = {};
        View.key = key;//避免重复创建key

        //按键间隔数据
        key.interval = {
            time: 150,//毫秒值
            lastTime: 0//最近一次按键时间戳
        };

        key.isOnkeydown = false;
        key.isOnkeypress = false;

        //重写系统按键，在View.init调用
        key.init = function () {
            window.document.onkeydown = key.onkeydownKeyEvent;
            window.document.onkeypress = key.onkeypressKeyEvent;
        };

        /**
         * @function onkeypressKeyEvent
         * @param {object} event 按键事件
         * @description 按键按下松开处理
         */
        key.onkeypressKeyEvent = function (event) {
            //如果执行了onkeypress则不再执行onkeydown
            if (key.isOnkeydown) {
                key.isOnkeydown = false; //用过一次后，需要还原
                return;
            }
            if (!key.isOnkeypress) {
                key.isOnkeypress = true;
            }
            var keyCode = event.which ? event.which : event.keyCode;
            var dispatch = key.keyHandle(keyCode);

            if (keyCode == 340) //禁止华数ipanel盒子自动返回
                return 0;  //兼容ipannel 返回
            return dispatch;
        };

        /**
         * @function onkeydownKeyEvent
         * @param {object} event 按键事件
         * @description 按键按下处理
         */
        key.onkeydownKeyEvent = function (event) {
            //如果执行了onkeypress则不再执行onkeydown
            if (key.isOnkeypress) {
                key.isOnkeypress = false; //用过一次后，需要还原，防止烽火盒子确定键只发一个
                return;
            }
            if (!key.isOnkeydown) {
                key.isOnkeydown = true;
            }
            var keyCode = event.which ? event.which : event.keyCode;
            var dispatch = key.keyHandle(keyCode);

            //禁止华数ipanel盒子自动返回,上，下，左,右,自动返回执行
            if (keyCode === 1 || keyCode === 2 || keyCode === 3
                || keyCode === 4 || keyCode === 340 || keyCode === 37
                || keyCode === 38 || keyCode === 39 || keyCode === 40) {
                return 0;//兼容ipannel 返回
            }
            return dispatch;
        };

        key.keyHandle = function (keyCode) {
            var now = new Date().getTime();
            if (now - key.interval.lastTime < key.interval.time) {//小于间隔时间
                return;
            }
            key.interval.lastTime = now;

            switch (keyCode) {
                case Key.KEY_0:
                case Key.KEY_1:
                case Key.KEY_2:
                case Key.KEY_3:
                case Key.KEY_4:
                case Key.KEY_5:
                case Key.KEY_6:
                case Key.KEY_7:
                case Key.KEY_8:
                case Key.KEY_9:
                    key.key_number_event(keyCode - 48);
                    break;
                case Key.KEY_UP_IPANEL:  //ipannel
                case Key.KEY_UP:
                    key.key_up_event();
                    break;
                case Key.KEY_DOWN_IPANEL:  //ipannel
                case Key.KEY_DOWN:
                    key.key_down_event();
                    break;
                case Key.KEY_LEFT_IPANEL:  //ipannel
                case Key.KEY_LEFT:
                    key.key_left_event();
                    break;
                case Key.KEY_RIGHT_IPANEL:  //ipannel
                case Key.KEY_RIGHT:
                    key.key_right_event();
                    break;
                case Key.KEY_OK:
                    key.key_ok_event();
                    break;
                case Key.KEY_SPACE: //空格键
                case Key.KEY_BACK_CLOUD: //兼容云平台
                case Key.KEY_BACK_IPANEL: //ipannel 返回
                case Key.KEY_BACK_FENGHUO: //兼容烽火盒子
                case Key.KEY_BACK:
                    key.key_back_event();
                    break;
                case Key.KEY_PAGEUP:
                    key.key_pageUp_event();
                    break;
                case Key.KEY_PAGEDOWN:
                    key.key_pageDown_event();
                    break;
                case Key.KEY_DEL:
                    key.key_del_event();
                    break;
                case Key.KEY_VOLUP:
                case 81://...
                    key.key_volUp_event();
                    break;
                case Key.KEY_VOLDOWN:
                case 87://...
                    key.key_volDown_event();
                    break;
                case Key.KEY_MUTE:
                case 69://...
                    key.key_mute_event();
                    break;
                case Key.KEY_RED:
                case Key.KEY_RED_EC: //兼容华为EC6108V9A悦盒
                    key.key_red_event();
                    break;
                case Key.KEY_GREEN:
                case Key.KEY_GREEN_EC: //兼容华为EC6108V9A悦盒
                    key.key_green_event();
                    break;
                case Key.KEY_YELLOW:
                case Key.KEY_YELLOW_EC: //兼容华为EC6108V9A悦盒
                    key.key_yellow_event();
                    break;
                case Key.KEY_BLUE:
                case Key.KEY_BLUE_EC: //兼容华为EC6108V9A悦盒
                    key.key_blue_event();
                    break;
                case Key.KEY_MPEVENT:
                    //播放事件处理
                    eval("eventJson=" + Utility.getEvent());
                    key.key_player_event(eventJson);
                    break;
                default:
                    var dispatch = key.key_default_event(keyCode);
                    if (typeof (dispatch) == "undefined") {
                        dispatch = true;
                    }
                    return dispatch;
                    break;

            }
            return false;
        };

        //确定
        key.key_ok_event = function () {
            View.viewClick();
        };
        //上下左右
        key.key_up_event = function () {
            View.viewUp();
        };

        key.key_down_event = function () {
            View.viewDown();
        };

        key.key_left_event = function () {
            View.viewLeft();
        };

        key.key_right_event = function () {
            View.viewRight();
        };
        //数字
        key.key_number_event = function (number) {

        };
        //返回

        key.key_back_event = function () {
            key.key_back_opt();
        };

        key.key_pageUp_event = function () {

        };

        key.key_pageDown_event = function () {

        };

        key.key_mute_event = function () {

        };

        //删除
        key.key_del_event = function () {

        };

        //音量增减
        key.key_volUp_event = function () {

        };

        key.key_volDown_event = function () {

        };

        //四色
        key.key_red_event = function () {

        };

        key.key_green_event = function () {

        };

        key.key_yellow_event = function () {

        };

        key.key_blue_event = function () {

        };

        //其他
        key.key_default_event = function (keyCode) {

        };

        /**
         * 播放事件,
         * @param player_event 播放的具体信息
         */
        key.key_player_event = function (player_event) {

        };

        key.init();//执行初始化按键

        key.key_back_opt = function () {
        };

        return key;
    }
};
Key.createNew();//创建按键事件

/**
 * 使用数组实现的栈
 * View中自定义的栈，只有简单基础的功能
 * @constructor
 */
var VStack = function () {
    var prototype = this;

    prototype.data = [];//数据实体

    /**
     * 入栈
     */
    prototype.push = function (data) {
        this.data.push(data);
    };

    /**
     * 出栈
     */
    prototype.pop = function () {
        var len = this.size();
        if (len <= 0) {
            return null;
        }
        var obj = this.data.splice(len - 1, 1)[0];
        return obj;
    };

    /**
     * 获取栈顶元素，不出栈
     */
    prototype.peek = function () {
        if (this.size() > 0) {
            return this.data[this.size() - 1];
        } else {
            return null;
        }
    };

    /**
     * 栈中数量
     */
    prototype.size = function () {
        if (this.data) {
            return this.data.length;
        } else {
            return 0;
        }
    };
};

/**
 * 使用对象实现的map
 * View中自定义实现的map，只有简单基础功能
 * @constructor
 */
var VMap = function () {
    var prototype = this;

    prototype.data = {};//数据实体


    /**
     * map 添加数据
     * @param key
     * @param value
     */
    prototype.put = function (key, value) {
        this.data[key] = value;
    };

    /**
     * 获取数据
     * @param key
     * @return {*}
     */
    prototype.get = function (key) {
        return this.data[key];
    };

    /**
     * 删除key对应的键值对
     * @param key
     * @return {*}
     */
    prototype.remove = function (key) {
        var value = this.get(key);
        delete this.data[key];
        return value;
    }

    /**
     * map大小
     * @return {number}
     */
    prototype.size = function () {
        return this.keys().length;
    }

    /**
     * key的集合
     * 用于遍历
     * @return {string[]}
     */
    prototype.keys = function () {
        return Object.keys(this.data);
    }
};

/**
 * 使用数组实现的队列
 * View中自定义的队列，只有简单基础的功能
 * @constructor
 */
var VQueue = function () {
    var prototype = this;

    prototype.data = [];//数据实体

    /**
     * 入队
     */
    prototype.push = function (data) {
        this.data.push(data);
    };

    /**
     * 出队
     */
    prototype.pop = function () {
        var len = this.size();
        if (len <= 0) {
            return null;
        }
        var obj = this.data.splice(0, 1)[0];
        return obj;
    };

    /**
     * 栈中数量
     */
    prototype.size = function () {
        if (this.data) {
            return this.data.length;
        } else {
            return 0;
        }
    };
};

//--------------------页面主流程-start----------------//
window.onload = function () {//如果在其他js中重写，那不会执行内部创建流程
    View.isViewCreating = true;//内部页面创建
    initView();//初始化控件
    setView();//设置控件监听，焦点规则
    //主要是为了让焦点监听在页面创建完成后触发
    if (View.isViewCreating && View.firstFocusId) {//内部页面创建流程
        var view = getViewById(View.firstFocusId);
        if (view) {
            view.requestFocus();
        } else {
            View.FocusView = View.createNew(View.firstFocusId);
        }
    }
    View.isViewCreating = false;//如果初始焦点未创建，这里置false，可在创建时触发
    initUtil();
};

var initView = function () {
};

var setView = function () {
};

var initUtil = function () {
};
//--------------------页面主流程-end----------------//
