module.exports={
    verified:function(verifing,that) {
      var flag = false;
      if(!verifing||verifing.length==0){
          return true;
      }
      for (var i = 0; i < verifing.length; i++) {
        if(this[verifing[i].name].name=='isNumcode'){
          flag = this[verifing[i].name](verifing[i].content, verifing[i].tip,that,verifing[i].length);
          if (!flag) {
            break;
          }
        }
        if(this[verifing[i].name].name=='maxLength'){
          flag = this[verifing[i].name](verifing[i].content, verifing[i].tip,that,verifing[i].length);
          if (!flag) {
            break;
          }
        }
        if(this[verifing[i].name].name=='isrightdateRange'){
          flag = this[verifing[i].name](verifing[i].startDate,verifing[i].endDate,that);
          if (!flag) {
            break;
          }
        }
        else{
          flag = this[verifing[i].name](verifing[i].content, verifing[i].tip,that);
          console.log('verifing++++i',i,flag,verifing);
          if (!flag) {
            break;
          }
        }

      }
      return flag;
    },
    toast:function(that,tip,duration,type){
        duration=duration||2000;
        that.setData({
          showTips: true,
          tipsInfo: tip,
          toastType:type
        });
        setTimeout(()=>{
          that.setData({
            showTips: false,
          });
        }, duration)
    },
    isEmpty:function(input, tip,that) {
        if (input === '' || input === null||input===undefined ) {
            if (input === 0) {
                return true;
            }else {
              that.setData({
                showTips: true,
                tipsInfo: tip,
              });
              setTimeout(()=>{
                that.setData({
                  showTips: false,
                });
              }, 2000)
            }
        }else{
            return true;
        }
    },
    noLat:function(input, tip,that) {
        if (input === '' || input === null||input===undefined ) {
            if (input === 0) {
                return true;
            }else {
                if(tip){
                    tip(that);
                }
            }
        }else{
            return true;
        }
    },
    isNumcode:function (input,tip,that,length){
      if(input.length<length){
        that.setData({
          showTips: true,
          tipsInfo: tip,
        });
        setTimeout(()=>{
          that.setData({
            showTips: false,
          });
        }, 2000)
        return false;
      }
      else {
        return true;
      }
    },
    maxLength:function (input,tip,that,length){
      if(input.length>length){
        that.setData({
          showTips: true,
          tipsInfo: tip,
        });
        setTimeout(()=>{
          that.setData({
            showTips: false,
          });
        }, 2000)
        return false;
      }
      else {
        return true;
      }
    },
    isEmail:function(email, tip,that) {
        var reg = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$');
        if (!reg.test(email)) {
          that.setData({
            showTips: true,
            tipsInfo: '邮箱格式错误',
          });
          setTimeout(()=>{
            that.setData({
              showTips: false,
            });
          }, 2000)
        } else {
            return true;
        }
    },
    isrightdateRange:function(startDate,endDate,that){
      startDate+="";endDate+="";
      var startDate=parseInt(startDate.replace(/-/g,"")),endDate=parseInt(endDate.replace(/-/g,""));
      if (startDate<endDate) {
          return true;
      }else {
        that.setData({
          showTips: true,
          tipsInfo: '结束时间应大于开始时间',
        });
        setTimeout(()=>{
          that.setData({
            showTips: false,
          });
        }, 2000)
      }
    }
}
