var SimpleDateFormat = {
    createNew:function (formatStyle) {
        var simpleDateFormat = {};
        simpleDateFormat.formatStyle = formatStyle;
        simpleDateFormat.type = "";


        simpleDateFormat.format = function (date) {
            var year = "";
            var month = "";
            var day = "";
            var hour = "";
            var minute = "";
            var second = "";
            var mseconds = "";
            if (simpleDateFormat.type == "GMT" || simpleDateFormat.type == "UTC") {
                year = date.getUTCFullYear();
                month = date.getUTCMonth();
                day = date.getUTCDate();
                hour = date.getUTCHours();
                minute = date.getUTCMinutes();
                second = date.getUTCSeconds();
                mseconds = date.getUTCMilliseconds();
            } else {
                year = date.getFullYear();
                month = date.getMonth();
                day = date.getDate();
                hour = date.getHours();
                minute = date.getMinutes();
                second = date.getSeconds();
                mseconds = date.getMilliseconds();
            }

            month = (month + 1).toString();
            month = month.length < 2 ? "0" + month : month;
            day = day.toString();
            day = day.length < 2 ? "0" + day : day;
            hour = hour.toString();
            hour = hour.length < 2 ? "0" + hour : hour;
            minute = minute.toString();
            minute = minute.length < 2 ? "0" + minute : minute;
            second = second.toString();
            second = second.length < 2 ? "0" + second : second;
            mseconds = mseconds.toString();

            var weekStr = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
            var weekStrCN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            var monthStr = ["Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sept", "Oct", "Nov", "Dec"];

            var week = date.getDay();

            var formatStyle = simpleDateFormat.formatStyle;

            formatStyle = formatStyle.replace("yyyy", year);
            formatStyle = formatStyle.replace("MMM", monthStr[date.getMonth()]);
            formatStyle = formatStyle.replace("MM", month);
            formatStyle = formatStyle.replace("dd", day);
            formatStyle = formatStyle.replace("HH", hour);
            formatStyle = formatStyle.replace("mm", minute);
            formatStyle = formatStyle.replace("ss", second);
            formatStyle = formatStyle.replace("SSSS", mseconds);
            formatStyle = formatStyle.replace("EEE_CN", weekStrCN[week]);
            formatStyle = formatStyle.replace("EEE", weekStr[week]);

            return formatStyle;
        };
        return simpleDateFormat;
    }
};
