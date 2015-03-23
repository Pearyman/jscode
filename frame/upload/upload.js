/*
 * ui-upload上传组件
 * params :
 *   selectNode : 选择节点
 *   uloadnode ： 上传节点 （不存在的话，selectnode选完上传文件后直接上传）
 *   action :　　 action url
 *   name :　 文件参数
 *   param ： name外别的参数
 *  afterSelect ： input选择完文件回调  return true 继续  return false 则终止
 *  beforeSend ：请求发送前回调
 *  complete ：请求发送成功后回调
 * */

define(['base', 'button'], function (base, button) {
  var HC = base,
    BTN = button;
  var UP = function () {
    this.init.apply(this, arguments);
  };
  UP.prototype = {
    /**
     * @method init
     * @static
     * @param configs {object}
     * @return none
     */
    init: function (configs) {
      var self = this,
        configs = configs;
      self.configs = {
        selectNode: configs.selectNode || '',
        uploadNode: configs.uploadNode || '',
        action: configs.action ? configs.action : '/wodfan/file/upload',
        name: configs.name || 'image',
        multiple: configs.multiple || null,
        param: configs.param || '',
        afterSelect : configs.afterSelect || null,
        beforeSend: configs.beforeSend || '',
        complete: configs.complete || ''
      };
      self.file = '';
      self.value = '';
      self.flag = true;
      self.advanced = typeof FormData === 'undefined' ? false : true;
      if (self.configs.selectNode.length > 0) {
        self.setTemplates();
      }
    },
    /**
     * @method setTemplates  insert form  to html
     * @static
     * @return none
     */
    setTemplates: function () {
      var self = this;
      var uploadArea = '<span class="HC-up-area" style="display:inline-block;"></span>';
      var inputfile = self.configs.multiple ? '<input type="file" name="' + self.configs.name + '" class="HC-up-file" multiple="multiple"/>' : '<input type="file" name="' + self.configs.name + '" class="HC-up-file"/>';
      var inputparams = '';
      if (self.configs.param) {
        $.each(self.configs.param, function (i, o) {
          inputparams += '<input type="hidden" name="' + i + '" value="' + o + '"/>';
        })
      }
      self.configs.selectNode.each(function (i, o) {
        var curT = $(this),
          iframeId = HC.lang.getRandom('iframe');
        var form = '<form method="post" style="display:inline-block;" enctype="multipart/form-data" target="' + iframeId + '" action="' + self.configs.action + '"></form>';
        var iframe = '<iframe style="display:none;" id="' + iframeId + '" name="' + iframeId + '"></iframe>';
        if (curT.prop('tagName') == 'INPUT') {
          curT.addClass('HC-up-file').attr('name', self.configs.name).wrap(form);
          curT.parent().wrap(uploadArea);
          curT.after(inputparams);
          if (!self.advanced) {
            curT.parents('.HC-up-area').append(iframe);
          }
        }
        else {
          curT.wrap(uploadArea);
          curT.after(!self.advanced ? form + iframe : form);
          curT.siblings('form').append(inputfile + inputparams);
          var width = curT.outerWidth(),
            height = curT.outerHeight(),
            margin = self.configs.selectNode.css('marginTop') +' ' +self.configs.selectNode.css('marginRight')+' '+self.configs.selectNode.css('marginBottom')+' ' + self.configs.selectNode.css('marginLeft');
          curT.parents('.HC-up-area').css({
            position: 'relative',
            width: width,
            height: height,
            lineHeight: height + 'px',
            margin: margin
          })
          curT.css({
            margin: 0
          })
          curT.siblings('form').find('.HC-up-file').css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: height,
            opacity: 0,
            cursor: 'default',
            'font-size': (width / 4) + 'px'
          })
        }
      })
      self.bindEvent();
    },
    /**
     * @method bindEvent  bind change,upload ... events
     * @static
     * @return none
     */
    bindEvent: function () {
      var self = this;
      self.configs.selectNode.each(function (i, o) {
        var curT = $(this);
        //如果是input类型
        if (curT.prop('tagName') == 'INPUT') {
          curT.off().on('change', function (e) {
            e.preventDefault();
            self.file = this;
            self.value = $(this).val();
            //如果没有上传节点 直接上传
            if (self.configs.uploadNode.length == 0 && self.value != '') {
              if(self.configs.afterSelect){
                self.flag = self.configs.afterSelect.apply(self,arguments);
              }
              if(self.flag) {
                if (self.advanced) {
                  self.formAjax(curT.parents('.HC-up-area').find('form'));
                }
                else {
                  self.configs.beforeSend && self.configs.beforeSend(self, curT);
                  curT.parents('.HC-up-area').find('form').submit();
                  curT.parents('.HC-up-area').find('iframe').off().load(function () {
                    var iframeId = curT.parents('.HC-up-area').find('iframe').attr('id');
                    var result = HC.util.getFrameContent(iframeId);
                    result = $.parseJSON(result);
                    self.configs.complete && self.configs.complete(result, curT);
                  })
                }
              }
            }
          })
          //如果有上传节点 绑定上传事件
          if (self.configs.uploadNode && self.configs.uploadNode.eq(i).length > 0) {
            BTN({
              container: self.configs.uploadNode.eq(i),
              eventHandle: function (btn) {
                if(self.configs.afterSelect){
                  self.flag = self.configs.afterSelect.apply(self,arguments);
                }
                if(self.flag) {
                  btn.disable();
                  if (!self.value) {
                    alert('请选择图片！');
                    btn.enable();
                    return;
                  }
                  if (self.advanced) {
                    self.formAjax(curT.parents('.HC-up-area').find('form'), curT, btn);
                  }
                  else {
                    self.configs.beforeSend && self.configs.beforeSend(self, curT);
                    curT.parents('.HC-up-area').find('form').submit();
                    curT.parents('.HC-up-area').find('iframe').load(function () {
                      var iframeId = curT.parents('.HC-up-area').find('iframe').attr('id');
                      var result = HC.util.getFrameContent(iframeId);
                      result = $.parseJSON(result);
                      btn.enable();
                      self.configs.complete && self.configs.complete(result, curT);
                    })
                  }
                }
              }
            })
          }
        }
        //如果不是input类型
        else {
          var uparea = curT.parents('.HC-up-area');
          uparea.find('.HC-up-file').off().change(function (e) {
            e.stopPropagation();
            e.preventDefault();
            self.file = this;
            self.value = $(this).val();
            if (self.configs.uploadNode.length == 0 && self.value != '') {
              if(self.configs.afterSelect){
                self.flag = self.configs.afterSelect.apply(self,arguments);
              }
              if(self.flag) {
                if (self.advanced) {
                  self.formAjax($(this).parents('form'), curT);
                }
                else {
                  self.configs.beforeSend && self.configs.beforeSend(self, curT);
                  $(this).parents('form').submit();
                  uparea.find('iframe').off().load(function () {
                    var iframeId = uparea.find('iframe').attr('id');
                    var result = HC.util.getFrameContent(iframeId);
                    result = $.parseJSON(result);
                    self.configs.complete && self.configs.complete(result, curT);
                  })
                }
              }
            }
          })
          if (self.configs.uploadNode && self.configs.uploadNode.eq(i).length > 0) {
            BTN({
              container: self.configs.uploadNode.eq(i),
              eventHandle: function (btn, node) {
                if(self.configs.afterSelect){
                  self.flag = self.configs.afterSelect.apply(self,arguments);
                }
                if(self.flag) {
                  btn.disable();
                  if (!self.value) {
                    alert('请选择图片！');
                    btn.enable();
                    return;
                  }
                  var uparea = curT.parents('.HC-up-area');
                  if (self.advanced) {
                    self.formAjax(uparea.find('form'), curT, btn);
                  }
                  else {
                    self.configs.beforeSend && self.configs.beforeSend(self, curT);
                    uparea.find('form').submit();
                    uparea.find('iframe').load(function () {
                      var iframeId = uparea.find('iframe').attr('id');
                      var result = HC.util.getFrameContent(iframeId);
                      result = $.parseJSON(result);
                      btn.enable();
                      self.configs.complete && self.configs.complete(result, self.currentTarget);
                    })
                  }
                }
              }
            })
          }
        }
      })
    },
    /**
     * @method formAjax  form submit ajax 高端浏览器使用
     * @static
     * @return none
     */
    formAjax: function (form, curT, btn) {
      var self = this,
        formdata = new FormData(form[0]);
      $.ajax({
        type: "post",
        url: self.configs.action,
        data: formdata,
        beforeSend: function (xhr) {
          self.xhr = xhr;
          self.configs.beforeSend && self.configs.beforeSend(self, curT)
        },
        contentType: false,
        processData: false,
        crossDomain: true,
        success: function (response) {
          $('.HC-up-file').val('');
          btn && btn.enable();
          var result = typeof response == 'object' ? response : $.parseJSON(response);
          self.configs.complete && self.configs.complete(result, curT);
        },
        error: function () {
          $('.HC-up-file').val('');
          btn && btn.enable();
          alert("服务器请求错误!");
        }
      })
    },
    /**
     * @method setconfigs  重设配置
     * @static
     * @return none
     */
    setconfigs: function (configs) {
      var self = this;
      self.configs = $.extend(self.configs, configs);
      var uparea = self.configs.selectNode.parents('.HC-up-area');
      uparea.find('form').attr('action', self.configs.action);
      uparea.find('input[type="hidden"]').remove();
      $.each(self.configs.param, function (i, o) {
        uparea.find('form').append('<input type="hidden" name="' + i + '" value="' + o + '" />');
      })
    }
  };
  var upload = function (configs) {
    return new UP(configs);
  }
  return upload;
})
