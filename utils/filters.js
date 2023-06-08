export default {
    hideaddress(addr){
        return addr.slice(0,8) + '***' + addr.slice(-4)
    },
    fixednumber(num){
        return String(num).replace(/^(.*\..{4}).*$/,"$1") || 0;
    },
    formatTime(value, type){
        var dataTime = "";
        var data = new Date(+value * 1000);
        console.log(data);
    
        var year = data.getFullYear();
        var month_temp = data.getMonth() + 1;
        var month = month_temp < 10 ? '0' + month_temp : month_temp;
        var day = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
        var hour = data.getHours() < 10 ? '0' + data.getHours() : data.getHours();
        var minute = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();
        var second = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds();
        if (type == "YMD") {
            dataTime = year + "-" + month + "-" + day;
        } else if (type == "YMDHMS") {
            dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        } else if (type == "HMS") {
            dataTime = hour + ":" + minute + ":" + second;
        } else if (type == "YM") {
            dataTime = year + "-" + month;
        } else if (type == "HM") {
            dataTime = hour + ":" + minute;
        } else if (type == "HMDM") {
            dataTime = hour + ":" + minute + " " + month + "/" + day;
        } else if (type == "LL") {
            dataTime = year + "" + month + "" + day + hour + "" + minute + "" + second;
        }
        return dataTime; //将格式化后的字符串输出到前端显示
    }
}