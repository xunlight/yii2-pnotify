    window.PNotifyObj = {};

    PNotify.prototype.options.delay = 1000;
    
    window.PNotifyObj.info = function(title, text, type) {
        var animate_in = $('#animate_in').val(),
            animate_out = $('#animate_out').val();
        if(typeof type == 'undefined')
            type = 'info';
        window.PNotifyObj.ajaxProgress = new PNotify({
            title: title,
            text: text,
            type: type,
            animate: {
                animate: true,
                in_class: animate_in,
                out_class: animate_out
            }
        });
    },
    
    window.PNotifyObj.stack_modal = {"dir1": "down", "dir2": "right", "push": "top", "modal": true, "overlay_close": true};
    
    window.PNotifyObj.PNotifyAjaxProgress = function(title) {
        window.PNotifyObj.ajaxProgress = new PNotify({
            text: title,
            type: 'info',
            icon: 'fa fa-spinner fa-spin',
            hide: false,
            buttons: {
                closer: false,
                sticker: false
            },
            opacity: .75,
            shadow: false,
            width: "170px"
        });
    };
    //state can be success|error
    window.PNotifyObj.PNotifyAjaxProgressDone = function(state, message){
                var options = {
                    text: message
                };
                
                options.title = "Done!";
                options.type = state;
                options.hide = true;
                options.buttons = {
                    closer: true,
                    sticker: true
                };
                options.icon = (state=='success'?'fa fa-check':'fa fa-exclamation-triangle');
                options.opacity = 1;
                options.shadow = true;
                options.width = PNotify.prototype.options.width;
                
                window.PNotifyObj.ajaxProgress.update(options);
    };
    
    window.PNotifyObj.PNotifyLoading = function(title) {
        window.PNotifyObj.cur_value = 1;
        window.PNotifyObj.progress=null;

        // Make a loader.
        window.PNotifyObj.loader = new PNotify({
                title: title,
                text: '<div class="progress progress-striped active" style="margin:0">\
            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">\
                <span class="sr-only">0%</span>\
            </div>\
        </div>',
                // icon: 'fa fa-moon-o fa-spin',
                icon: 'fa fa-cog fa-spin',
                hide: false,
                type: 'info',
                // addclass: 'stack-modal',
                // stack: window.PNotifyObj.stack_modal,
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                },
                before_open: function(notice) {
                    window.PNotifyObj.progress = notice.get().find("div.progress-bar");
                    window.PNotifyObj.progress.width(window.PNotifyObj.cur_value + "%").attr("aria-valuenow", window.PNotifyObj.cur_value).find("span").html(window.PNotifyObj.cur_value + "%");
                    // Pretend to do something.
                    window.PNotifyObj.timer = setInterval(function() {
                    
                        // if (window.PNotifyObj.cur_value == 70) {
                        //     window.PNotifyObj.loader.update({
                        //         title: "Aligning discrete worms",
                        //         icon: "fa fa-circle-o-notch fa-spin"
                        //     });
                        // }
                        // if (window.PNotifyObj.cur_value == 80) {
                        //     window.PNotifyObj.loader.update({
                        //         title: "Connecting end points",
                        //         icon: "fa fa-refresh fa-spin"
                        //     });
                        // }
                        // if (window.PNotifyObj.cur_value == 90) {
                        //     window.PNotifyObj.loader.update({
                        //         title: "Dividing and conquering",
                        //         icon: "fa fa-spinner fa-spin"
                        //     });
                        // }
                        if (window.PNotifyObj.cur_value >= 100) {
                            // Remove the interval.
                            window.clearInterval(window.PNotifyObj.timer);
                            window.PNotifyObj.loader.remove();
                            return;
                        }
                        window.PNotifyObj.cur_value += 1;
                        window.PNotifyObj.progress.width(window.PNotifyObj.cur_value + "%").attr("aria-valuenow", window.PNotifyObj.cur_value).find("span").html(window.PNotifyObj.cur_value + "%");
                    }, 65);
                }
        });
    };