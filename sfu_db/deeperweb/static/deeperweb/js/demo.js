$(document).ready(function () {
    switch_button_init();
    api_choose();
    schema_matching();
    upload_csv();
    popup_news_init();
    smart_crawl();
    init_table();
    re_enrich();
    download_csv();
    record_replace();
});

/*switch button*/
function switch_button_init() {
    $('.bootstrap-switch#format input').bootstrapSwitch({
        onText: 'Table',
        offText: 'Text',
        onColor: 'primary',
        offColor: 'info',
        labelText: 'Format',
        state: false,
        onSwitchChange: function (event, data) {
            var switch_typos = $('.bootstrap-switch#typos input');
            if (data) {
                text2table();
            } else {
                switch_typos.bootstrapSwitch('state', false);
                table2text();
            }
            switch_typos.bootstrapSwitch('toggleDisabled');
        }
    });

    $('.bootstrap-switch#typos input').bootstrapSwitch({
        onText: 'On',
        offText: 'Off',
        onColor: 'primary',
        offColor: 'warning',
        labelText: 'Typos',
        state: false,
        disabled: true,
        onSwitchChange: function (event, data) {
            if (data) {
                add_typos();
            } else {
                remove_typos();
            }
        }
    });

    $('.bootstrap-switch#example input').bootstrapSwitch({
        onText: 'On',
        offText: 'Off',
        onColor: 'primary',
        offColor: 'warning',
        labelText: 'Example'
    });
}

/*choose api*/
function api_choose() {
    $("div#api ul li").click(function () {
        $('div#api ul li').removeClass();
        $(this).addClass("active");
        $("a#hidden_button").nextAll().remove();
        $("button#upload a").text("Upload csv");

        var hidden_schema = $("div#hidden_schema");

        if ($(this).parent().is($("ul#dblp"))) {
            if ($(this).text() === 'Publ API') {
                var dblp_publ_schema = ['info.key', 'info.title', 'info.authors.author.*', '@score', 'info.url', 'info.venue', 'info.volume', 'info.year', 'info.type', '@id', 'url'];
                $.each(dblp_publ_schema, function (index, element) {
                    hidden_schema.append("<a class='tag'>" + element + "</a>");
                    if (index < 3) {
                        hidden_schema.find("a:last").css({
                            'color': '#ffffff',
                            'background': '#237dc8',
                            'border-color': '#237dc8'
                        });
                        hidden_schema.find("a:last").append("<span class='badge'>" + index + "</span>");
                    }
                });
                if ($('.bootstrap-switch#example input').bootstrapSwitch('state')) {
                    $("div#text_input textarea").val(dblp_publ_text);
                }
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Sorry, this api is not supported now.");
            }
        } else if ($(this).parent().is($("ul#yelp"))) {
            if ($(this).text() === 'Search API') {
                var yelp_search_schema = ['id', 'name', 'location.display_address.*', 'rating', 'review_count', 'transactions.*', 'url', 'price', 'distance', 'coordinates.latitude', 'coordinates.longitude', 'phone', 'image_url', 'categories.*.alias', 'categories.*.title', 'display_phone', 'is_closed', 'location.city', 'location.country', 'location.address2', 'location.address3', 'location.state', 'location.address1', 'location.zip_code'];
                $.each(yelp_search_schema, function (index, element) {
                    hidden_schema.append("<a class='tag'>" + element + "</a>");
                    if (index < 3) {
                        hidden_schema.find("a:last").css({
                            'color': '#ffffff',
                            'background': '#237dc8',
                            'border-color': '#237dc8'
                        });
                        hidden_schema.find("a:last").append("<span class='badge'>" + index + "</span>");
                    }
                });
                if ($('.bootstrap-switch#example input').bootstrapSwitch('state')) {
                    $("div#text_input textarea").val(yelp_search_text);
                }
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Sorry, this api is not supported now.");
            }
        } else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p").html("Sorry, this api is not supported now.");
        }

        $('.bootstrap-switch#typos input').bootstrapSwitch('state', false);
        if ($('.bootstrap-switch#format input').bootstrapSwitch('state')) {
            if ($('.bootstrap-switch#example input').bootstrapSwitch('state')) {
                text2table();
            } else {
                $("div#text_input").hide();
                $("div#table_input").show();
            }
        } else {
            $("div#text_input").show();
            $("div#table_input").hide();
        }
    });
}

/*typos operation*/
function add_typos() {
    var table_input = $('div#table_input table');
    var header_num = $('div#table_input table thead tr th').length;
    var typos = ["&*^%#", "SIGMOD", "VLDB", "ICDE", "2018", "Database", "Journal", "Conference", "Vancouver", "Seattle"];
    var temp;
    var temp_array;
    $.each(table_input.find('tbody tr'), function (index, element) {
        temp = $(element).find('td:eq(' + Math.floor(Math.random() * header_num) + ')');
        typo = "<span style=\"color:Red\">" + typos[Math.floor(Math.random() * typos.length)] + "</span>";
        if (temp.text().indexOf(' ') !== -1) {
            temp_array = temp.text().split(' ');
            temp_array.splice(Math.floor(Math.random() * (temp_array.length + 1)), 0, typo);
            temp.html(temp_array.join(' '));
        } else if (temp.text().indexOf('/') !== -1) {
            temp_array = temp.text().split('/');
            temp_array.splice(Math.floor(Math.random() * (temp_array.length + 1)), 0, typo);
            temp.html(temp_array.join('/'));
        }
    });
}

function remove_typos() {
    $('div#table_input table tbody tr td span').remove();
    $.each($('div#table_input table tbody tr td'), function (index, element) {
        if ($(element).text().indexOf(' ') !== -1) {
            temp_array = $(element).text().split(' ');
            for (var i = 0; i < temp_array.length; i++) {
                if (temp_array[i].length === 0) {
                    temp_array.splice(i, 1);
                }
            }
            $(element).html(temp_array.join(' '));
        } else if ($(element).text().indexOf('/') !== -1) {
            temp_array = $(element).text().split('/');
            for (var i = 0; i < temp_array.length; i++) {
                if (temp_array[i].length === 0) {
                    temp_array.splice(i, 1);
                }
            }
            $(element).html(temp_array.join('/'));
        }
    });
}

/*schema matching*/
function schema_matching() {
    /*local schema*/
    $("div#local_schema").delegate("a.tag", "click", function () {
        if ($(this).attr("style")) {
            $(this).removeAttr("style");
            $(this).children("span").remove();
        } else {
            $("div#local_schema").append($(this));
            if ($("div#local_schema a[style]").length) {
                $("div#local_schema a[style]:last").after($(this));
            } else {
                $("a#local_button").after($(this));
            }
            $(this).css({'color': '#ffffff', 'background': '#237dc8', 'border-color': '#237dc8'});
            $(this).append("<span class='badge'></span>");
        }
        var active_tags = $("div#local_schema a[style]");
        for (var i = 0; i < active_tags.length; i++) {
            active_tags.eq(i).find("span").text(i);
        }
    });

    /*hidden schema*/
    $("div#hidden_schema").delegate("a.tag", "click", function () {
        if ($(this).attr("style")) {
            $(this).removeAttr("style");
            $(this).children("span").remove();
            $("div#hidden_schema").append($(this));
        } else {
            if ($("div#hidden_schema a[style]").length) {
                $("div#hidden_schema a[style]:last").after($(this));
            } else {
                $("a#hidden_button").after($(this));
            }
            $(this).css({'color': '#ffffff', 'background': '#237dc8', 'border-color': '#237dc8'});
            $(this).append("<span class='badge'></span>");
        }
        var active_tags = $("div#hidden_schema a[style]");
        for (var i = 0; i < active_tags.length; i++) {
            active_tags.eq(i).find("span").text(i);
        }
    });

    /*join schema*/
    $("div#join_schema").delegate("a.tag", "click", function () {
        if ($(this).attr("style")) {
            $(this).removeAttr("style");
            $('table thead tr').find('th:eq(' + $(this).index() + ')').hide();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').hide();
        } else {
            $(this).css({'color': '#ffffff', 'background': '#237dc8', 'border-color': '#237dc8'});
            $('table thead tr').find('th:eq(' + $(this).index() + ')').show();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').show();
        }
    });
}

/*upload csv*/
function upload_csv() {
    /*simulate click*/
    $("button#upload").click(function () {
        $('#fileupload').click();
    });
    /*upload csv*/
    $('#fileupload').fileupload({
        url: "/uploadCSV/",
        type: "POST",
        autoUpload: false,
        add: function (e, data) {
            var name_list = data.files[0].name.split('.');
            if (name_list[name_list.length - 1] === 'csv') {
                if (data.files[0].size >= 5 * 1024 * 1024) {
                    alert("Maximum file size is 5MB");
                    data = undefined;
                } else {
                    $("button#upload").attr("disabled", true);
                    $("button#upload a").text("Wait");
                    data.submit();
                    data = undefined;
                }
            } else {
                alert("Only csv are allowed.");
                data = undefined;
            }
        },
        always: function (e, data) {
            var local_thead = "";
            var local_tbody = "";
            $.each(data.result['csv_input'], function (index, element) {
                if (index === 0) {
                    local_thead += "<tr>";
                    for (var i = 0; i < element.length; i++) {
                        local_thead += "<th>" + element[i] + "</th>";
                    }
                    local_thead += "</tr>";
                } else {
                    local_tbody += "<tr>";
                    for (var i = 0; i < element.length; i++) {
                        local_tbody += "<td>" + element[i] + "</td>";
                    }
                    local_tbody += "</tr>";
                }
            });
            $("div#text_input").hide();
            $("div#table_input table thead").html(local_thead);
            $("div#table_input table tbody").html(local_tbody);
            $("div#table_input").show();
            $("button#upload").attr("disabled", false);
            $("button#upload a").text("Upload csv");
            $('.bootstrap-switch#format input').bootstrapSwitch('state', true);
        }
    });
}

//News popup
function popup_news_init() {
    $("button#try").on("click", function () {
        $(".news-popup").addClass("open");
        if ($("div#text_input").is(':visible')) {
            textarea_detection();
        } else if ($("div#table_input").is(':visible')) {
            table_detection();
        }
    });
    $(".news-popup .close-button").on("click", function () {
        $(".news-popup").removeClass("open");
    })
}

/*smartcrawl*/
function smart_crawl() {
    $("#msg_submit").click(function () {
        /*get the message of schema and api*/
        var local_schema = $('div#local_schema').children('a.tag');
        var local_match = [];
        $(local_schema).each(function () {
            if ($(this).attr("style")) {
                local_match.push($(this).text().substring(0, $(this).text().length - $(this).children('span').text().length));
            }
        });
        var hidden_schema = $('div#hidden_schema').children('a.tag');
        var hidden_match = [];
        $(hidden_schema).each(function () {
            if ($(this).attr("style")) {
                hidden_match.push($(this).text().substring(0, $(this).text().length - $(this).children('span').text().length));
            }
        });
        var api = $('div#api ul li.active');
        var api_msg = api.parent().attr('id') + ' ' + api.text();
        /*judge the correctness of schema and api*/
        if (local_match.length !== hidden_match.length) {
            alert("Please match the schema correctly.");
            return false;
        }
        if (api_msg === "dblp Publ API") {
            if ($.inArray("info.title", hidden_match) === -1) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("info.title is necessary.");
                return false;
            }
        } else if (api_msg === "yelp Search API") {
            if ($.inArray("name", hidden_match) === -1 || $.inArray("location.display_address.*", hidden_match) === -1) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("name and location.display_address.* is necessary.");
                return false;
            }
        } else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p").html("Sorry, this api is not supported now.");
            return false;
        }
        /*pre-process the local record*/
        if ($("div#text_input").is(":visible")) {
            var original_data = $("div#text_input textarea").val();
            if (original_data.length > 5242880) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Maximum file size is 5MB");
                return false;
            }
            if (original_data.split('\n').length > 20000) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Maximum number of rows for file is 20000");
                return false;
            }
        } else {
            var table_input = $('div#table_input table').find('tr');
            var original_data = [];
            $(table_input).each(function (index, element) {
                if (index === 0) {
                    var header = [];
                    var table_header = $(element).children('th');
                    for (var i = 0; i < table_header.length; i++) {
                        header.push(table_header.eq(i).text());
                    }
                    original_data[index] = header;
                } else {
                    var row = [];
                    var table_row = $(element).children('td');
                    for (var i = 0; i < table_row.length; i++) {
                        row.push(table_row.eq(i).text());
                    }
                    original_data[index] = row;
                }
            });
            original_data = JSON.stringify(original_data)
        }

        $(".news-popup").removeClass("open");
        $("table#table_result").hide();
        $("div#topLoader").show();
        location.hash = "#";
        location.hash = "#topLoader";
        $("#topLoader").children().remove();
        timer();

        $.ajax({
            url: "/smartcrawl/",
            type: "POST",
            dataType: "json",
            data: {
                'original_data': original_data,
                'local_match': local_match,
                'hidden_match': hidden_match,
                'api_msg': api_msg
            },
            success: function (response) {
                var join_keys = "";
                var join_tbody = "";
                var join_thead = "<tr>";
                $.each(response['local_header'], function (index, element) {
                    join_thead += "<th>" + element + "</th>";
                    join_keys += "<a class='tag'>" + element + "</a>";
                });
                $.each(response['hidden_header'], function (index, element) {
                    join_thead += "<th>" + element + "</th>";
                    join_keys += "<a class='tag'>" + element + "</a>";
                });
                join_thead += "</tr>";

                $.each(response['record'], function (index, element) {
                    var local_record = "";
                    for (var i = 0; i < element[0].length; i++) {
                        local_record += "<td>" + element[0][i] + "</td>";
                    }

                    join_tbody += "<tr>" + local_record;
                    for (var j = 0; j < element[1].length; j++) {
                        join_tbody += "<td>" + element[1][j] + "</td>";
                    }

                    if (element.length > 2) {
                        join_tbody += "<td style='cursor: pointer;'><div class='table-expandable-arrow'></div></td></tr>";
                        for (var m = 2; m < element.length; m++) {
                            join_tbody += "<tr style='display: none'>" + local_record;
                            for (var n = 0; n < element[m].length; n++) {
                                join_tbody += "<td>" + element[m][n] + "</td>";
                            }
                            join_tbody += "<td style='cursor: pointer;'><span class=\"glyphicon glyphicon-retweet\"></span></td></tr>";
                        }
                    } else {
                        join_tbody += "<td><div></div></td></tr>";
                    }
                });
                var join_schema = $("div#join_schema");
                join_schema.children().remove();
                join_schema.append(join_keys);

                $("table#table_result thead").html(join_thead);
                $("table#table_result tbody").html(join_tbody);

                $('table#table_result thead tr th').hide();
                $('table#table_result tbody tr td').hide();

                $(hidden_match).each(function (index, element) {
                    $(join_schema.children('a.tag')).each(function () {
                        if ($(this).text() === element) {
                            $(this).css({'color': '#ffffff', 'background': '#237dc8', 'border-color': '#237dc8'});
                            $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').show();
                            $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').show();
                        }
                    });
                });
                $(local_match).each(function (index, element) {
                    $(join_schema.children('a.tag')).each(function () {
                        if ($(this).text() === element) {
                            $(this).css({'color': '#ffffff', 'background': '#237dc8', 'border-color': '#237dc8'});
                            $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').show();
                            $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').show();
                        }
                    });
                });
                $('table#table_result tbody tr').find('td:last').show();
                $("div#topLoader").hide();
                $("table#table_result").show();

                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("SmartCrawl   Queries: 4   Cover: " + response['record'].length);
                $(".alert-popup p:last").html("NaiveCrawl   Queries: 4   Cover: 4");
            },
            error: function () {
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Incorrect Format.");
            }
        });
    });
}

/*init table*/
function init_table() {
    $("table#table_result tbody").delegate("tr td div.table-expandable-arrow", "click", function () {
        var element = $(this).closest('tr');
        element.find(".table-expandable-arrow").toggleClass("up");
        temp = element.next('tr');
        while (!temp.find("td:last div").length) {
            temp.toggle('fast');
            temp = temp.next('tr');
        }
    });
}

/*re-enrich*/
function re_enrich() {
    $("button#re-enrich").click(function () {
        var table_input = $('div#table_input table');
        table_input.find('thead tr').remove();
        table_input.find('tbody tr').remove();
        var join_schema = $("div#join_schema");
        $(join_schema.children('a.tag')).each(function () {
            if (!$(this).attr("style")) {
                $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').remove();
                $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').remove();
                $(this).remove();
            }
        });
        table_input.find('thead').append($('table#table_result thead tr'));
        table_input.find('tbody').append($('table#table_result tbody tr'));
        location.hash = "#api";
        join_schema.children().remove();
        $('.bootstrap-switch#example input').bootstrapSwitch('state', false);
    });
}

/*export csv from html table*/
function download_csv() {
    $("button#download").click(function () {
        if ($('table#table_result tbody tr').length > 0) {
            var table_result = $('table#table_result').find('tr');
            var original_data = [];
            $(table_result).each(function (index, element) {
                if (index === 0) {
                    var header = [];
                    var table_header = $(element).children('th');
                    for (var i = 0; i < table_header.length; i++) {
                        header.push(table_header.eq(i).text());
                    }
                    original_data[index] = header;
                } else {
                    var row = [];
                    var table_row = $(element).children('td');
                    for (var i = 0; i < table_row.length; i++) {
                        row.push(table_row.eq(i).text());
                    }
                    original_data[index] = row;
                }
            });
            $.ajax({
                url: "/importTable/",
                type: "POST",
                dataType: "json",
                data: {'original_data': JSON.stringify(original_data)},
                success: function (response) {
                    window.location.href = "/exportCSV/"
                },
                error: function () {
                    $(".alert-popup").addClass("open");
                    $(".alert-popup p").html("Download Error.");
                }
            });
        } else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p").html("Empty Table.");
        }
    });
}

/*timer*/
function timer() {
    var $topLoader = $("#topLoader").percentageLoader({
        width: 356, height: 356, controllable: true, progress: 0.0,
        onProgressUpdate: function (val) {
            $topLoader.setValue(Math.round(val * 100.0));
        }
    });
    var topLoaderRunning = false;

    countdown = function () {
        if (topLoaderRunning) {
            return;
        }
        topLoaderRunning = true;
        $topLoader.setProgress(0);
        $topLoader.setValue('0ms');
        var ms = 0;
        var totalMs = 20000;

        var animateFunc = function () {
            ms += 25;
            $topLoader.setProgress(ms / totalMs);
            $topLoader.setValue(ms.toString() + 'ms');
            if (ms < totalMs) {
                setTimeout(animateFunc, 25);
            } else {
                topLoaderRunning = false;
            }
        };
        setTimeout(animateFunc, 25);
    };

    countdown();
}

function textarea_detection() {
    var str = $("div#text_input textarea").val();
    var header = str.split("\n")[0];
    var schema = header.split(",");
    var local_keys = "";
    for (var i = 0; i < schema.length; i++) {
        local_keys += "<a class='tag'>" + schema[i] + "</a>";
    }
    $("a#local_button").nextAll().remove();
    $("div#local_schema").append(local_keys);
}

function table_detection() {
    var local_keys = "";
    $("div#table_input table thead tr th").each(function (index, element) {
        local_keys += "<a class='tag'>" + $(element).text() + "</a>";
    });
    $("a#local_button").nextAll().remove();
    $("div#local_schema").append(local_keys);
}

function text2table() {
    var text_input = $("div#text_input");
    var rows = text_input.find("textarea").val().split("\n");
    var local_thead = "";
    var local_tbody = "";
    var element = null;
    var reg = new RegExp(",\\s", "g");

    for (var i = 0; i < rows.length; i++) {
        if (!rows[i].length)
            continue;
        element = rows[i].replace(reg, " ").split(",");
        if (i === 0) {
            local_thead += "<tr>";
            for (var jh = 0; jh < element.length; jh++) {
                local_thead += "<th>" + element[jh] + "</th>";
            }
            local_thead += "</tr>";
        } else {
            local_tbody += "<tr>";
            for (var jb = 0; jb < element.length; jb++) {
                local_tbody += "<td>" + element[jb] + "</td>";
            }
            local_tbody += "</tr>";
        }
    }

    text_input.hide();
    $("div#table_input table thead").html(local_thead);
    $("div#table_input table tbody").html(local_tbody);
    $("div#table_input").show();
}

function table2text() {
    var text_input = $("div#text_input");
    var local_text = "";
    $("div#table_input table thead tr th").each(function (index, element) {
        local_text += $(element).text() + ",";
    });
    local_text = local_text.substring(0, local_text.length - 1) + "\n";

    $("div#table_input table tbody tr").each(function () {
        $(this).find("td").each(function (index, element) {
            local_text += $(element).text().replace("\n", " ") + ",";
        });
        local_text = local_text.substring(0, local_text.length - 1) + "\n";
    });
    $("div#table_input").hide();
    text_input.find("textarea").val(local_text);
    text_input.show();
}

function record_replace() {
    $("table#table_result tbody").delegate("tr td span.glyphicon", "click", function () {
        var alter_row = $(this.closest('tr'));
        var current_row = alter_row.prev('tr');
        while (!current_row.find("td:last div").length) {
            current_row = current_row.prev('tr');
        }
        alter_row.find("td:last").html("<div class='table-expandable-arrow'></div>");
        current_row.find("td:last").html("<span class=\"glyphicon glyphicon-retweet\"></span>");
        current_row.before(alter_row);
        alter_row.find(".table-expandable-arrow").toggleClass("up");
    });
}

var dblp_publ_text = "ID,title,author\n" +
    "conf/tapp/2017,9th USENIX Workshop on the Theory and Practice of Provenance, TaPP 2017, Seattle, WA, USA, June 23, 2017,Adam M. Bates and Bill Howe\n" +
    "conf/sigmod/2017,Proceedings of the 2017 ACM International Conference on Management of Data, SIGMOD Conference 2017, Chicago, IL, USA, May 14-19, 2017,Semih Salihoglu and Wenchao Zhou and Rada Chirkova and Jun Yang and Dan Suciu\n" +
    "conf/pods/Suciu17,Communication Cost in Parallel Query Evaluation: A Tutorial,Dan Suciu\n" +
    "conf/cidr/ChuWWC17,Cosette: An Automated Prover for SQL,Shumo Chu and Chenglong Wang and Konstantin Weitz and Alvin Cheung\n" +
    "conf/cikm/YanCYL17,Understanding Database Performance Inefficiencies in Real-world Web Applications,Cong Yan and Alvin Cheung and Junwen Yang and Shan Lu\n" +
    "conf/pldi/ChuWCS17,HoTTSQL: proving query rewrites with univalent SQL semantics,Shumo Chu and Konstantin Weitz and Alvin Cheung and Dan Suciu\n" +
    "conf/pldi/WangCB17,Synthesizing highly expressive SQL queries from input-output examples,Chenglong Wang and Alvin Cheung and Rastislav Bodik\n" +
    "conf/acl/IyerKCKZ17,Learning a Neural Semantic Parser from User Feedback,Srinivasan Iyer and Ioannis Konstas and Alvin Cheung and Jayant Krishnamurthy and Luke Zettlemoyer\n" +
    "conf/ssdbm/PingSH17,DataSynthesizer: Privacy-Preserving Synthetic Datasets,Haoyue Ping and Julia Stoyanovich and Bill Howe\n" +
    "conf/usenix/WangB17,Elastic Memory Management for Cloud Data Analytics,Jingjing Wang and Magdalena Balazinska\n" +
    "conf/www/HoweLGYW17,Deep Mapping of the Visual Literature,Bill Howe and Po-Shen Lee and Maxim Grechkin and Sean T. Yang and Jevin D. West\n" +
    "conf/damon/FurstOH17,Profiling a GPU database implementation: a holistic view of GPU resource utilization on TPC-H queries,Emily Furst and Mark Oskin and Bill Howe\n" +
    "conf/icde/HoweFHKU17,Data Science Education: We're Missing the Boat, Again,Bill Howe and Michael J. Franklin and Laura M. Haas and Tim Kraska and Jeffrey D. Ullman\n" +
    "conf/pods/KetsmanS17,A Worst-Case Optimal Multi-Round Algorithm for Parallel Computation of Conjunctive Queries,Bas Ketsman and Dan Suciu\n" +
    "conf/pods/Khamis0S17,What Do Shannon-type Inequalities, Submodular Width, and Disjunctive Datalog Have to Do with One Another?,Mahmoud Abo Khamis and Hung Q. Ngo and Dan Suciu\n" +
    "conf/sigmod/AhmadC17,Optimizing Data-Intensive Applications Automatically By Leveraging Parallel Data Processing Frameworks,Maaz Bin Safeer Ahmad and Alvin Cheung\n" +
    "conf/sigmod/WangCB17,Interactive Query Synthesis from Input-Output Examples,Chenglong Wang and Alvin Cheung and Rastislav Bodik\n" +
    "conf/sigmod/ChuLWCS17,Demonstration of the Cosette Automated SQL Prover,Shumo Chu and Daniel Li and Chenglong Wang and Alvin Cheung and Dan Suciu\n" +
    "journals/cacm/LiLMS17,A theory of pricing private data,Chao Li and Daniel Yang Li and Gerome Miklau and Dan Suciu\n" +
    "journals/pvldb/OrrSB17,Probabilistic Database Summarization for Interactive Data Exploration,Laurel Orr and Dan Suciu and Magdalena Balazinska\n" +
    "journals/ftdb/BroeckS17,Query Processing on Probabilistic Data: A Survey,Guy Van den Broeck and Dan Suciu\n" +
    "journals/jacm/BeameKS17,Communication Steps for Parallel Query Processing,Paul Beame and Paraschos Koutris and Dan Suciu\n" +
    "journals/tkdd/BaeHWRH17,Scalable and Efficient Flow-Based Community Detection for Large-Scale Graph Analysis,Seung-Hee Bae and Daniel Halperin and Jevin D. West and Martin Rosvall and Bill Howe\n" +
    "conf/sigmod/HaynesMBCC17,VisualCloud Demonstration: A DBMS for Virtual Reality,Brandon Haynes and Artem Minyaylov and Magdalena Balazinska and Luis Ceze and Alvin Cheung\n" +
    "journals/tods/Beame0RS17,Exact Model Counting of Query Expressions: Limitations of Propositional Methods,Paul Beame and Jerry Li and Sudeepa Roy and Dan Suciu\n" +
    "conf/sigmod/HutchisonHS17,LaraDB: A Minimalist Kernel for Linear and Relational Algebra Computation,Dylan Hutchison and Bill Howe and Dan Suciu\n" +
    "journals/mst/KoutrisMRS17,Answering Conjunctive Queries with Inequalities,Paraschos Koutris and Tova Milo and Sudeepa Roy and Dan Suciu\n" +
    "conf/chi/WongsuphasawatQ17,Voyager 2: Augmenting Visual Analysis with Partial View Specifications,Kanit Wongsuphasawat and Zening Qu and Dominik Moritz and Riley Chang and Felix Ouk and Anushka Anand and Jock D. Mackinlay and Bill Howe and Jeffrey Heer\n" +
    "conf/cidr/BalazinskaCCCS17,A Visual Cloud for Virtual Reality Applications,Magdalena Balazinska and Luis Ceze and Alvin Cheung and Brian Curless and Steven M. Seitz\n" +
    "journals/pvldb/SalimiCPS17,ZaliQL: Causal Inference from Observational Data at Scale,Babak Salimi and Corey Cole and Dan R. K. Ports and Dan Suciu\n" +
    "conf/cidr/WangBBHHHHJMMMM17,The Myria Big Data Management and Analytics System and Cloud Services,Jingjing Wang and Tobin Baker and Magdalena Balazinska and Daniel Halperin and Brandon Haynes and Bill Howe and Dylan Hutchison and Shrainik Jain and Ryan Maas and Parmita Mehta and Dominik Moritz and Brandon Myers and Jennifer Ortiz and Dan Suciu and Andrew Whitaker and Shengliang Xu\n" +
    "conf/ssdbm/StoyanovichHAMS17,Fides: Towards a Platform for Responsible Data Science,Julia Stoyanovich and Bill Howe and Serge Abiteboul and Gerome Miklau and Arnaud Sahuguet and Gerhard Weikum\n" +
    "journals/vldb/GatterbauerS17,Dissociation and propagation for approximate lifted inference with standard relational database management systems,Wolfgang Gatterbauer and Dan Suciu\n" +
    "conf/sigmod/GudmundsdottirS17,A Demonstration of Interactive Analysis of Performance Measurements with Viska,Helga Gudmundsdottir and Babak Salimi and Magdalena Balazinska and Dan R. K. Ports and Dan Suciu\n" +
    "journals/pvldb/MehtaDZKCBRCVA17,Comparative Evaluation of Big-Data Systems on Scientific Image Analytics Workloads,Parmita Mehta and Sven Dorkenwald and Dongfang Zhao and Tomer Kaftan and Alvin Cheung and Magdalena Balazinska and Ariel Rokem and Andrew J. Connolly and Jacob VanderPlas and Yusra AlSayyad\n" +
    "conf/www/LeeWH16,VizioMetrix: A Platform for Analyzing the Visual Information in Big Scholarly Data,Po-Shen Lee and Jevin D. West and Bill Howe\n" +
    "conf/dlog/Suciu16,Lifted Inference in Probabilistic Databases,Dan Suciu\n" +
    "conf/acl/IyerKCZ16,Summarizing Source Code using a Neural Attention Model,Srinivasan Iyer and Ioannis Konstas and Alvin Cheung and Luke Zettlemoyer\n" +
    "conf/icde/JainMH16,High variety cloud databases,Shrainik Jain and Dominik Moritz and Bill Howe\n" +
    "conf/sigmod/WangB16,Toward elastic memory management for cloud data analytics,Jingjing Wang and Magdalena Balazinska\n" +
    "conf/ismir/HyrkasH16,MusicDB: A Platform for Longitudinal Music Analytics,Jeremy Hyrkas and Bill Howe\n" +
    "conf/pldi/KamilCIS16,Verified lifting of stencil computations,Shoaib Kamil and Alvin Cheung and Shachar Itzhaky and Armando Solar-Lezama\n" +
    "conf/pods/KhamisNS16,Computing Join Queries with Functional Dependencies,Mahmoud Abo Khamis and Hung Q. Ngo and Dan Suciu\n" +
    "conf/aaai/GribkoffS16,SlimShot: Probabilistic Inference for Web-Scale Knowledge Bases,Eric Gribkoff and Dan Suciu\n" +
    "conf/cloud/HaynesCB16,PipeGen: Data Pipe Generator for Hybrid Analytics,Brandon Haynes and Alvin Cheung and Magdalena Balazinska\n" +
    "conf/icdt/KoutrisBS16,Worst-Case Optimal Algorithms for Parallel Query Processing,Paraschos Koutris and Paul Beame and Dan Suciu\n" +
    "conf/sigmod/OrtizLB16,PerfEnforce Demonstration: Data Analytics with Performance Guarantees,Jennifer Ortiz and Brendan Lee and Magdalena Balazinska\n" +
    "conf/tapp/SalimiBSB16,Quantifying Causal Effects on Query Answering in Databases,Babak Salimi and Leopoldo E. Bertossi and Dan Suciu and Guy Van den Broeck\n" +
    "journals/pvldb/YanC16,Leveraging Lock Contention to Improve OLTP Application Performance,Cong Yan and Alvin Cheung\n" +
    "conf/sigmod/JainMHHL16,SQLShare: Results from a Multi-Year SQL-as-a-Service Experiment,Shrainik Jain and Dominik Moritz and Daniel Halperin and Bill Howe and Ed Lazowska\n" +
    "journals/corr/AhmadC16,Leveraging Parallel Data Processing Frameworks with Verified Lifting,Maaz Bin Safeer Ahmad and Alvin Cheung\n" +
    "journals/ftpl/CheungS16,Computer-Assisted Query Formulation,Alvin Cheung and Armando Solar-Lezama\n" +
    "conf/hpec/HutchisonKGH16,From NoSQL Accumulo to NewSQL Graphulo: Design and utility of graph algorithms inside a BigTable database,Dylan Hutchison and Jeremy Kepner and Vijay Gadepally and Bill Howe\n" +
    "journals/tods/CheungMS16,Sloth: Being Lazy Is a Virtue (When Issuing Database Queries),Alvin Cheung and Samuel Madden and Armando Solar-Lezama\n" +
    "journals/pvldb/GribkoffS16,SlimShot: In-Database Probabilistic Inference for Knowledge Bases,Eric Gribkoff and Dan Suciu\n" +
    "journals/sigmod/KoutrisS16,A Guide to Formal Analysis of Join Processing in Massively Parallel Systems,Paraschos Koutris and Dan Suciu\n" +
    "journals/pvldb/UpadhyayaBS16,Price-Optimal Querying with Data APIs,Prasang Upadhyaya and Magdalena Balazinska and Dan Suciu\n" +
    "conf/sigmod/WongsuphasawatM16,Towards a general-purpose query language for visualization recommendation,Kanit Wongsuphasawat and Dominik Moritz and Anushka Anand and Jock D. Mackinlay and Bill Howe and Jeffrey Heer\n" +
    "conf/sigcomm/SivaramanCBKABV16,Packet Transactions: High-Level Programming for Line-Rate Switches,Anirudh Sivaraman and Alvin Cheung and Mihai Budiu and Changhoon Kim and Mohammad Alizadeh and Hari Balakrishnan and George Varghese and Nick McKeown and Steve Licking\n" +
    "journals/cacm/AbadiAABBCCDDFG16,The Beckman report on database research,Daniel Abadi and Rakesh Agrawal and Anastasia Ailamaki and Magdalena Balazinska and Philip A. Bernstein and Michael J. Carey and Surajit Chaudhuri and Jeffrey Dean and AnHai Doan and Michael J. Franklin and Johannes Gehrke and Laura M. Haas and Alon Y. Halevy and Joseph M. Hellerstein and Yannis E. Ioannidis and H. V. Jagadish and Donald Kossmann and Samuel Madden and Sharad Mehrotra and Tova Milo and Jeffrey F. Naughton and Raghu Ramakrishnan and Volker Markl and Christopher Olston and Beng Chin Ooi and Christopher Re and Dan Suciu and Michael Stonebraker and Todd Walter and Jennifer Widom\n" +
    "journals/tvcg/WongsuphasawatM16,Voyager: Exploratory Analysis via Faceted Browsing of Visualization Recommendations,Kanit Wongsuphasawat and Dominik Moritz and Anushka Anand and Jock D. Mackinlay and Bill Howe and Jeffrey Heer\n" +
    "journals/sigmod/AbiteboulABBCDH16,Research Directions for Principles of Data Management (Abridged),Serge Abiteboul and Marcelo Arenas and Pablo Barcelo and Meghyn Bienvenu and Diego Calvanese and Claire David and Richard Hull and Eyke Hullermeier and Benny Kimelfeld and Leonid Libkin and Wim Martens and Tova Milo and Filip Murlak and Frank Neven and Magdalena Ortiz and Thomas Schwentick and Julia Stoyanovich and Jianwen Su and Dan Suciu and Victor Vianu and Ke Yi\n" +
    "journals/bioinformatics/HyrkasCRHAH16,Scalable clustering algorithms for continuous environmental flow cytometry,Jeremy Hyrkas and Sophie Clayton and Francois Ribalet and Daniel Halperin and E. Virginia Armbrust and Bill Howe\n" +
    "books/sp/16/CetintemelAABBCHMMRRSTXZ16,The Aurora and Borealis Stream Processing Engines,Ugur Cetintemel and Daniel J. Abadi and Yanif Ahmad and Hari Balakrishnan and Magdalena Balazinska and Mitch Cherniack and Jeong-Hyon Hwang and Samuel Madden and Anurag Maskey and Alexander Rasin and Esther Ryvkina and Mike Stonebraker and Nesime Tatbul and Ying Xing and Stan Zdonik\n" +
    "conf/sc/BaeH15,GossipMap: a distributed community detection algorithm for billion-edge directed graphs,Seung-Hee Bae and Bill Howe\n" +
    "conf/cloud/2015,Proceedings of the Sixth {ACM} Symposium on Cloud Computing, SoCC 2015, Kohala Coast, Hawaii, USA, August 27-29, 2015,Shahram Ghandeharizadeh and Sumita Barahmand and  Magdalena Balazinska and  Michael J. Freedman\n" +
    "conf/cidr/Howe15,Big Data Science Needs Big Data Middleware,Bill Howe\n" +
    "conf/edbt/Suciu15,Communication Cost in Parallel Query Processing,Dan Suciu\n" +
    "conf/cidr/Cheung15,Towards Generating Application-Specific Data Management Systems,Alvin Cheung\n" +
    "conf/icpram/LeeH15,Dismantling Composite Visualizations in the Scientific Literature,Po-Shen Lee and Bill Howe\n" +
    "phd/ndltd/Cheung15,Rethinking the application-database interface,Alvin Cheung\n" +
    "conf/cidr/OrtizAB15,Changing the Face of Database Cloud Services with Personalized Service Level Agreements,Jennifer Ortiz and Victor Teixeira de Almeida and Magdalena Balazinska\n" +
    "conf/icpram/LeeH15a,Detecting and Dismantling Composite Visualizations in the Scientific Literature,Po-Shen Lee and Bill Howe\n" +
    "conf/sigmod/ChuBS15,From Theory to Practice: Efficient Join Query Evaluation in a Parallel Database System,Shumo Chu and Magdalena Balazinska and Dan Suciu\n" +
    "conf/aaai/HyrkasHH15,Time-Varying Clusters in Large-Scale Flow Cytometry,Jeremy Hyrkas and Daniel Halperin and Bill Howe\n" +
    "conf/pods/AfratiNS15,The ACM PODS Alberto O. Mendelzon Test-of-Time Award 2015,Foto N. Afrati and Frank Neven and Dan Suciu\n" +
    "conf/pods/BeameBGS15,Symmetric Weighted First-Order Model Counting,Paul Beame and Guy Van den Broeck and Eric Gribkoff and Dan Suciu\n" +
    "conf/snapl/CheungKS15,Bridging the Gap Between General-Purpose and Domain-Specific Compilers with Synthesis,Alvin Cheung and Shoaib Kamil and Armando Solar-Lezama\n" +
    "conf/vldb/MaasHTBCH15,Gaussian Mixture Models Use-Case: In-Memory Analysis with Myria,Ryan Maas and Jeremy Hyrkas and Olivia Grace Telford and Magdalena Balazinska and Andrew J. Connolly and Bill Howe\n" +
    "conf/icdt/KoutrisMRS15,Answering Conjunctive Queries with Inequalities,Paraschos Koutris and Tova Milo and Sudeepa Roy and Dan Suciu\n" +
    "conf/sigmod/ReABCJKR15,Machine Learning and Databases: The Sound of Things to Come or a Cacophony of Hype?,Christopher Re and Divy Agrawal and Magdalena Balazinska and Michael J. Cafarella and Michael I. Jordan and Tim Kraska and Raghu Ramakrishnan\n" +
    "conf/vldb/WilliamsBD15,Automated Analysis of Muscle X-ray Diffraction Imaging with MCMC,C. David Williams and Magdalena Balazinska and Thomas L. Daniel\n" +
    "journals/pvldb/RoyOS15,Explaining Query Answers with Explanation-Ready Databases,Sudeepa Roy and Laurel Orr and Dan Suciu\n" +
    "conf/ssdbm/SoroushBKC15,Efficient iterative processing in the SciDB parallel array engine,Emad Soroush and Magdalena Balazinska and K. Simon Krughoff and Andrew J. Connolly\n" +
    "journals/pvldb/WangBH15,Asynchronous and Fault-Tolerant Recursive Datalog Evaluation in Shared-Nothing Engines,Jingjing Wang and Magdalena Balazinska and Daniel Halperin\n" +
    "conf/ssdbm/AlawiniMTHN15,Towards automated prediction of relationships among scientific datasets,Abdussalam Alawini and David Maier and Kristin Tufte and Bill Howe and Rashmi Nandikur\n" +
    "journals/cgf/MoritzHHH15,Perfopticon: Visual Query Analysis for Distributed Databases,Dominik Moritz and Daniel Halperin and Bill Howe and Jeffrey Heer\n" +
    "journals/mst/AfratiKSU15,Parallel Skyline Queries,Foto N. Afrati and Paraschos Koutris and Dan Suciu and Jeffrey D. Ullman\n" +
    "conf/sigmod/UpadhyayaBS15,Automatic Enforcement of Data Use Policies with DataLawyer,Prasang Upadhyaya and Magdalena Balazinska and Dan Suciu\n" +
    "journals/jacm/KoutrisUBHS15,Query-Based Data Pricing,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "journals/pvldb/Balazinska15,Front Matter,Magdalena Balazinska\n" +
    "journals/pvldb/Balazinska15a,Big Data Research: Will Industry Solve all the Problems?,Magdalena Balazinska\n" +
    "journals/pvldb/GatterbauerS15,Approximate Lifted Inference with Probabilistic Databases,Wolfgang Gatterbauer and Dan Suciu\n" +
    "journals/pvldb/ElmoreDSBCGHHKK15,A Demonstration of the BigDAWG Polystore System,Aaron J. Elmore and Jennie Duggan and Mike Stonebraker and Magdalena Balazinska and Ugur Cetintemel and Vijay Gadepally and Jeffrey Heer and Bill Howe and Jeremy Kepner and Tim Kraska and Samuel Madden and David Maier and Timothy G. Mattson and Stavros Papadopoulos and Jeff Parkhurst and Nesime Tatbul and Manasi Vartak and Stan Zdonik\n" +
    "journals/sigmod/DugganESBHKMMMZ15,The BigDAWG Polystore System,Jennie Duggan and Aaron J. Elmore and Michael Stonebraker and Magdalena Balazinska and Bill Howe and Jeremy Kepner and Sam Madden and David Maier and Tim Mattson and Stanley B. Zdonik\n" +
    "conf/hpdc/Cheung14,Rethinking the application-database interface,Alvin Cheung\n" +
    "conf/sigmod/RoyS14,A formal approach to finding explanations for database queries,Sudeepa Roy and Dan Suciu\n" +
    "conf/icdt/BeameLRS14,Counting of Query Expressions: Limitations of Propositional Methods,Paul Beame and Jerry Li and Sudeepa Roy and Dan Suciu\n" +
    "conf/icdt/KoutrisS14,A Dichotomy on the Complexity of Consistent Query Answering for Atoms with Simple Keys,Paraschos Koutris and Dan Suciu\n" +
    "conf/uai/GribkoffBS14,Understanding the Complexity of Lifted Inference and Asymmetric Weighted Model Counting,Eric Gribkoff and Guy Van den Broeck and Dan Suciu\n" +
    "journals/tods/LiLMS14,A Theory of Pricing Private Data,Chao Li and Daniel Yang Li and Gerome Miklau and Dan Suciu\n" +
    "conf/aaai/GribkoffBS14,Understanding the Complexity of Lifted Inference and Asymmetric Weighted Model Counting,Eric Gribkoff and Guy Van den Broeck and Dan Suciu\n" +
    "conf/sigmod/CheungMS14,Sloth: being lazy is a virtue (when issuing database queries),Alvin Cheung and Samuel Madden and Armando Solar-Lezama\n" +
    "conf/sigmod/HoweFFFKR14,Should we all be teaching \"intro to data science\" instead of \"intro to databases\"?,Bill Howe and Michael J. Franklin and Juliana Freire and James Frew and Tim Kraska and Raghu Ramakrishnan\n" +
    "conf/ssdbm/AlawiniMTH14,Helping scientists reconnect their datasets,Abdussalam Alawini and David Maier and Kristin Tufte and Bill Howe\n" +
    "conf/vldb/UpadhyayaUBSH14,Affordable Analytics on Expensive Data,Prasang Upadhyaya and Martina Unutzer and Magdalena Balazinska and Dan Suciu and Hakan Hacigumus\n" +
    "journals/is/LetchnerBRP14,Approximation trade-offs in a Markovian stream warehouse: An empirical study,Julie Letchner and Magdalena Balazinska and Christopher Re and Matthai Philipose\n" +
    "journals/pvldb/MeliouRS14,Causality and Explanations in Databases,Alexandra Meliou and Sudeepa Roy and Dan Suciu\n" +
    "journals/debu/CheungMSAM14,Using Program Analysis to Improve Database Applications,Alvin Cheung and Samuel Madden and Armando Solar-Lezama and Owen Arden and Andrew C. Myers\n" +
    "journals/debu/GribkoffSB14,Lifted Probabilistic Inference: A Guide for the Database Researcher,Eric Gribkoff and Dan Suciu and Guy Van den Broeck\n" +
    "journals/pvldb/MortonBGM14,Support the Data Enthusiast: Challenges for Next-Generation Data-Analysis Systems,Kristi Morton and Magdalena Balazinska and Dan Grossman and Jock D. Mackinlay\n" +
    "journals/sigmod/MortonBGKM14,Public Data and Visualizations: How are Many Eyes and Tableau Public Used for Collaborative Analytics?,Kristi Morton and Magdalena Balazinska and Dan Grossman and Robert Kosara and Jock D. Mackinlay\n" +
    "journals/tods/GatterbauerS14,Oblivious bounds on the probability of boolean functions,Wolfgang Gatterbauer and Dan Suciu\n" +
    "conf/sigmod/LoebmanOCOAHBQG14,Big-Data Management Use-Case: A Cloud Service for Creating and Analyzing Galactic Merger Trees,Sarah Loebman and Jennifer Ortiz and Lee Lee Choo and Laurel Orr and Lauren Anderson and Daniel Halperin and Magdalena Balazinska and Thomas Quinn and Fabio Governato\n" +
    "journals/sigmod/BalazinskaHS14,The database group at the University of Washington,Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "conf/sigmod/HalperinACCKMORWWXBHS14,Demonstration of the Myria big data management service,Daniel Halperin and Victor Teixeira de Almeida and Lee Lee Choo and Shumo Chu and Paraschos Koutris and Dominik Moritz and Jennifer Ortiz and Vaspol Ruamviboonsuk and Jingjing Wang and Andrew Whitaker and Shengliang Xu and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "journals/sigmod/AbadiAABBCCDDFGHHHIJKMMMNRMOORSSWW14,The Beckman Report on Database Research,Daniel J. Abadi and Rakesh Agrawal and Anastasia Ailamaki and Magdalena Balazinska and Philip A. Bernstein and Michael J. Carey and Surajit Chaudhuri and Jeffrey Dean and AnHai Doan and Michael J. Franklin and Johannes Gehrke and Laura M. Haas and Alon Y. Halevy and Joseph M. Hellerstein and Yannis E. Ioannidis and H. V. Jagadish and Donald Kossmann and Samuel Madden and Sharad Mehrotra and Tova Milo and Jeffrey F. Naughton and Raghu Ramakrishnan and Volker Markl and Christopher Olston and Beng Chin Ooi and Christopher Re and Dan Suciu and Michael Stonebraker and Todd Walter and Jennifer Widom\n" +
    "conf/ssdbm/2013,Conference on Scientific and Statistical Database Management, SSDBM '13, Baltimore, MD, USA, July 29 - 31, 2013,Alex Szalay and Tamas Budavari and Magdalena Balazinska and Alexandra Meliou and Ahmet Sacan\n" +
    "conf/icdt/LiLMS13,A theory of pricing private data,Chao Li and Daniel Yang Li and Gerome Miklau and Dan Suciu\n" +
    "conf/bncod/Suciu13,Big Data Begets Big Database Theory,Dan Suciu\n" +
    "conf/icdm/BaeHWRH13,Scalable Flow-Based Community Detection for Large-Scale Network Analysis,Seung-Hee Bae and Daniel Halperin and Jevin D. West and Martin Rosvall and Bill Howe\n" +
    "conf/pods/BeameKS13,Communication steps for parallel query processing,Paul Beame and Paraschos Koutris and Dan Suciu\n" +
    "conf/uai/BeameLRS13,Lower Bounds for Exact Model Counting and Applications in Probabilistic Databases,Paul Beame and Jerry Li and Sudeepa Roy and Dan Suciu\n" +
    "journals/mst/JhaS13,Knowledge Compilation Meets Database Theory: Compiling Queries to Decision Diagrams,Abhay Kumar Jha and Dan Suciu\n" +
    "conf/icde/SoroushB13,Time travel in a scientific array database,Emad Soroush and Magdalena Balazinska\n" +
    "conf/pldi/CheungSM13,Optimizing database-backed applications with query synthesis,Alvin Cheung and Armando Solar-Lezama and Samuel Madden\n" +
    "conf/vldb/MyersHHH13,Compiled Plans for In-Memory Path-Counting Queries,Brandon Myers and Jeremy Hyrkas and Daniel Halperin and Bill Howe\n" +
    "conf/vldb/MyersHHH13a,Compiled Plans for In-Memory Path-Counting Queries,Brandon Myers and Jeremy Hyrkas and Daniel Halperin and Bill Howe\n" +
    "conf/cidr/CheungAMSM13,StatusQuo: Making Familiar Abstractions Perform Using Program Analysis,Alvin Cheung and Owen Arden and Samuel Madden and Armando Solar-Lezama and Andrew C. Myers\n" +
    "conf/apsys/CheungR0MB13,Mobile applications need targeted micro-updates,Alvin Cheung and Lenin Ravindranath and Eugene Wu and Samuel Madden and Hari Balakrishnan\n" +
    "conf/sigmod/CheungAMM13,Speeding up database applications with Pyxis,Alvin Cheung and Owen Arden and Samuel Madden and Andrew C. Myers\n" +
    "journals/cse/HoweHRCA13,Collaborative Science Workflows in SQL,Bill Howe and Daniel Halperin and Francois Ribalet and Sagar Chitnis and E. Virginia Armbrust\n" +
    "journals/debu/KwonRBH13,Managing Skew in Hadoop,YongChul Kwon and Kai Ren and Magdalena Balazinska and Bill Howe\n" +
    "journals/pvldb/RenKBH13,Hadoop's Adolescence,Kai Ren and YongChul Kwon and Magdalena Balazinska and Bill Howe\n" +
    "conf/sigmod/JoslynCHHNO13,Massive scale cyber traffic analysis: a driver for graph database research,Cliff Joslyn and Sutanay Choudhury and David Haglin and Bill Howe and Bill Nickless and Bryan Olsen\n" +
    "conf/sigmod/KoutrisUBHS13,Toward practical query pricing with QueryMarket,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "conf/ssdbm/BalazinskaDHL13,Education and career paths for data scientists,Magdalena Balazinska and Susan B. Davidson and Bill Howe and Alexandros Labrinidis\n" +
    "conf/ssdbm/HalperinRWSHA13,Real-time collaborative analysis with (almost) pure SQL: a case study in biogeochemical oceanography,Daniel Halperin and Francois Ribalet and Konstantin Weitz and Mak A. Saito and Bill Howe and E. Virginia Armbrust\n" +
    "conf/cidr/UpadhyayaABHKRS13,Stop That Query! The Need for Managing Data Use,Prasang Upadhyaya and Nick R. Anderson and Magdalena Balazinska and Bill Howe and Raghav Kaushik and Ravishankar Ramamurthy and Dan Suciu\n" +
    "conf/sigmod/UpadhyayaABHKRS13,The power of data use management in action,Prasang Upadhyaya and Nick R. Anderson and Magdalena Balazinska and Bill Howe and Raghav Kaushik and Ravishankar Ramamurthy and Dan Suciu\n" +
    "journals/debu/VanderPlasSKB13,Squeezing a Big Orange into Little Boxes: The AscotDB System for Parallel Processing of Data on a Sphere,Jacob VanderPlas and Emad Soroush and K. Simon Krughoff and Magdalena Balazinska\n" +
    "journals/pvldb/MoyersSWKVBC13,A Demonstration of Iterative Parallel Array Processing in Support of Telescope Image Analysis,Matthew Moyers and Emad Soroush and Spencer Wallace and K. Simon Krughoff and Jake VanderPlas and Magdalena Balazinska and Andrew J. Connolly\n" +
    "conf/birthday/BalazinskaHKSU13,A Discussion on Pricing Relational Data,Magdalena Balazinska and Bill Howe and Paraschos Koutris and Dan Suciu and Prasang Upadhyaya\n" +
    "conf/amw/2012,Proceedings of the 6th Alberto Mendelzon International Workshop on Foundations of Data Management, Ouro Preto, Brazil, June 27-30, 2012,Juliana Freire and Dan Suciu\n" +
    "conf/icdt/JhaS12,On the tractability of query compilation and bounded treewidth,Abhay Kumar Jha and Dan Suciu\n" +
    "conf/sc/RenGKBH12,Abstract: Hadoop's Adolescence; A Comparative Workloads Analysis from Three Research Clusters,Kai Ren and Garth Gibson and YongChul Kwon and Magdalena Balazinska and Bill Howe\n" +
    "conf/chi/HoweKPA12,VizDeck: a card game metaphor for fast visual data exploration,Bill Howe and Alicia Key and Daniel Perry and Cecilia R. Aragon\n" +
    "conf/sc/RenGKBH12a,Poster: Hadoop's Adolescence; A Comparative Workloads Analysis from Three Research Clusters,Kai Ren and Garth Gibson and YongChul Kwon and Magdalena Balazinska and Bill Howe\n" +
    "journals/cse/Howe12,Virtual Appliances, Cloud Computing, and Reproducible Research,Bill Howe\n" +
    "journals/tods/ReS12,Understanding cardinality estimation using entropy maximization,Christopher Re and Dan Suciu\n" +
    "conf/cikm/CheungSM12,Using program synthesis for social recommendations,Alvin Cheung and Armando Solar-Lezama and Samuel Madden\n" +
    "conf/sigmod/KeyHPA12,VizDeck: self-organizing dashboards for visual analytics,Bill Howe and Alicia Key and Daniel Perry and Cecilia R. Aragon\n" +
    "conf/ssdbm/ShawDBS12,A Dataflow Graph Transformation Language and Query Rewriting System for RDF Ontologies,Marianne Shaw and Landon Detwiler and James F. Brinkley and Dan Suciu\n" +
    "conf/icdt/AfratiKSU12,Parallel skyline queries,Foto N. Afrati and Paraschos Koutris and Dan Suciu and Jeffrey D. Ullman\n" +
    "conf/sigmod/KwonBHR12,SkewTune: mitigating skew in mapreduce applications,YongChul Kwon and Magdalena Balazinska and Bill Howe and Jerome A. Rolia\n" +
    "conf/sigmod/MeliouS12,Tiresias: the database oracle for how-to queries,Alexandra Meliou and Dan Suciu\n" +
    "journals/cacm/Suciu12,SQL on an encrypted database: technical perspective,Dan Suciu\n" +
    "journals/debu/HoweH12,Advancing Declarative Query in the Long Tail of Science,Bill Howe and Daniel Halperin\n" +
    "journals/pvldb/JhaS12,Probabilistic Databases with MarkoViews,Abhay Kumar Jha and Dan Suciu\n" +
    "journals/vldb/BuHBE12,The HaLoop approach to large-scale iterative data analysis,Yingyi Bu and Bill Howe and Magdalena Balazinska and Michael D. Ernst\n" +
    "conf/apsys/WangCCJZK12,Undefined behavior: what happened to my code?,Xi Wang and Haogang Chen and Alvin Cheung and Zhihao Jia and Nickolai Zeldovich and M. Frans Kaashoek\n" +
    "conf/datalog/ShawKHS12,Optimizing Large-Scale Semi-Naive Datalog Evaluation in Hadoop,Marianne Shaw and Paraschos Koutris and Bill Howe and Dan Suciu\n" +
    "conf/sigmod/MeliouSS12,Tiresias: a demonstration of how-to queries,Alexandra Meliou and Yisong Song and Dan Suciu\n" +
    "journals/jacm/DalviS12,The dichotomy of probabilistic inference for unions of conjunctive queries,Nilesh N. Dalvi and Dan Suciu\n" +
    "conf/pods/KoutrisUBHS12,Query-based data pricing,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "conf/cloud/AfratiBSHSU12,Designing good algorithms for MapReduce and beyond,Foto N. Afrati and Magdalena Balazinska and Anish Das Sarma and Bill Howe and Semih Salihoglu and Jeffrey D. Ullman\n" +
    "journals/pvldb/KwonBHR12,SkewTune in Action: Mitigating Skew in MapReduce Applications,YongChul Kwon and Magdalena Balazinska and Bill Howe and Jerome A. Rolia\n" +
    "journals/pvldb/CheungAMM12,Automatic Partitioning of Database Applications,Alvin Cheung and Owen Arden and Samuel Madden and Andrew C. Myers\n" +
    "journals/pvldb/KoutrisUBHS12,QueryMarket Demonstration: Pricing for Online Data Markets,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu}\n" +
    "journals/pvldb/UpadhyayaBS12,How to Price Shared Optimizations in the Cloud,Prasang Upadhyaya and Magdalena Balazinska and Dan Suciu\n" +
    "journals/pvldb/KhoussainovaBS12,PerfXplain: Debugging MapReduce Job Performance,Nodira Khoussainova and Magdalena Balazinska and Dan Suciu\n" +
    "conf/icdt/JhaS11,Knowledge compilation meets database theory: compiling queries to decision diagrams,Abhay Kumar Jha and Dan Suciu\n" +
    "conf/icdt/Suciu11,Tractability in probabilistic databases,Dan Suciu\n" +
    "conf/edbt/2011array,Proceedings of the 2011 EDBT/ICDT Workshop on Array Databases, Uppsala, Sweden, March 25, 2011,Peter Baumann and Bill Howe and Kjell Orsborn and Silvia Stefanova\n" +
    "conf/edbt/SoroushB11,Hybrid merge/overlap execution technique for parallel array processing,Emad Soroush and Magdalena Balazinska\n" +
    "conf/pods/KoutrisS11,Parallel evaluation of conjunctive queries,Paraschos Koutris and Dan Suciu\n" +
    "conf/tapp/MeliouGS11,Bringing Provenance to Its Full Potential Using Causal Reasoning,Alexandra Meliou and Wolfgang Gatterbauer and Dan Suciu\n" +
    "conf/ldav/VoBSCFHPS11,Parallel visualization on large clusters using MapReduce,Huy T. Vo and Jonathan Bronson and Brian Summa and Joao Luiz Dihl Comba and Juliana Freire and Bill Howe and Valerio Pascucci and Claudio T. Silva\n" +
    "conf/sigmod/HoweCKB11,Automatic example queries for ad hoc databases,Bill Howe and Garrett Cole and Nodira Khoussainova and Leilani Battle\n" +
    "conf/sensys/CheungTM11,Automatically generating interesting events with LifeJoin,Alvin Cheung and Arvind Thiagarajan and Samuel Madden\n" +
    "conf/mobide/LetchnerB11,Lineage for Markovian stream event queries,Julie Letchner and Magdalena Balazinska\n" +
    "conf/sigmod/MeliouGNS11,Tracing data errors with view-conditioned causality,Alexandra Meliou and Wolfgang Gatterbauer and Suman Nath and Dan Suciu\n" +
    "conf/sigmod/SoroushBW11,ArrayStore: a storage manager for complex parallel array processing,Emad Soroush and Magdalena Balazinska and Daniel L. Wang\n" +
    "conf/sigsoft/CheungSM11,Partial replay of long-running applications,Alvin Cheung and Armando Solar-Lezama and Samuel Madden\n" +
    "conf/ssdbm/HoweCSKKKB11,Database-as-a-Service for Long-Tail Science,Bill Howe and Garrett Cole and Emad Souroush and Paraschos Koutris and Alicia Key and Nodira Khoussainova and Leilani Battle\n" +
    "journals/jbi/ShawDNBS11,vSPARQL: A view definition language for the semantic web,Marianne Shaw and Landon Fridman Detwiler and Natalya Fridman Noy and James F. Brinkley and Dan Suciu\n" +
    "journals/jcss/DalviRS11,Queries and materialized views on probabilistic databases,Nilesh N. Dalvi and Christopher Re and Dan Suciu\n" +
    "conf/cidr/GatterbauerS11,Managing Structured Collections of Community Data,Wolfgang Gatterbauer and Dan Suciu\n" +
    "conf/sigmod/UpadhyayaKB11,A latency and fault-tolerance optimizer for online parallel query plans,Prasang Upadhyaya and YongChul Kwon and Magdalena Balazinska\n" +
    "conf/tapp/GatterbauerMS11,Default-all is dangerous!,Wolfgang Gatterbauer and Alexandra Meliou and Dan Suciu\n" +
    "eries/synthesis/2011Suciu,Probabilistic Databases,Dan Suciu and Dan Olteanu and Christopher Re and Christoph Koch\n" +
    "journals/pvldb/MeliouGS11,Reverse Data Management,Alexandra Meliou and Wolfgang Gatterbauer and Dan Suciu\n" +
    "conf/ssdbm/AlSayyadKHCBJ11,Towards Efficient and Precise Queries over Ten Million Asteroid Trajectory Models,Yusra AlSayyad and K. Simon Krughoff and Bill Howe and Andrew J. Connolly and Magdalena Balazinska and Lynne Jones\n" +
    "journals/pvldb/MeliouGMS11,The Complexity of Causality and Responsibility for Query Answers and non-Answers,Alexandra Meliou and Wolfgang Gatterbauer and Katherine F. Moore and Dan Suciu\n" +
    "journals/pvldb/BalazinskaHS11,Data Markets in the Cloud: An Opportunity for the Database Community,Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "conf/ssdbm/KhoussainovaKLBGS11,Session-Based Browsing for More Effective Query Reuse,Nodira Khoussainova and YongChul Kwon and Wei-Ting Liao and Magdalena Balazinska and Wolfgang Gatterbauer and Dan Suciu\n" +
    "conf/pods/ReS10,Understanding cardinality estimation using entropy maximization,Christopher Re and Dan Suciu\n" +
    "conf/edbt/JhaOS10,Bridging the gap between intensional and extensional query evaluation in probabilistic databases,Abhay Kumar Jha and Dan Olteanu and Dan Suciu\n" +
    "conf/edbtw/Suciu10,Definitions matter: reconciling differential and adversarial privacy: invited talk,Dan Suciu\n" +
    "conf/nips/JhaGMS10,Lifted Inference Seen from the Other Side : The Tractable Features,Abhay Kumar Jha and Vibhav Gogate and Alexandra Meliou and Dan Suciu\n" +
    "conf/pods/DalviSS10,Computing query probability with incidence algebras,Nilesh N. Dalvi and Karl Schnaitter and Dan Suciu\n" +
    "conf/cloud/KwonBHR10,Skew-resistant parallel processing of feature-extracting scientific user-defined functions,YongChul Kwon and Magdalena Balazinska and Bill Howe and Jerome A. Rolia\n" +
    "conf/mud/MeliouGMS10,WHY SO? or WHY NO? Functional Causality for Explaining Query Answers,Alexandra Meliou and Wolfgang Gatterbauer and Katherine F. Moore and Dan Suciu\n" +
    "conf/icde/MortonFBG10,Estimating the progress of MapReduce pipelines,Kristi Morton and Abram L. Friesen and Magdalena Balazinska and Dan Grossman\n" +
    "conf/sigmod/MortonBG10,ParaTimer: a progress indicator for MapReduce DAGs,Kristi Morton and Magdalena Balazinska and Dan Grossman\n" +
    "conf/ssdbm/KwonNGBHL10,Scalable Clustering Algorithm for N-Body Simulations in a Shared-Nothing Cluster,YongChul Kwon and Dylan Nunley and Jeffrey P. Gardner and Magdalena Balazinska and Bill Howe and Sarah Loebman\n" +
    "journals/pvldb/BuHBE10,HaLoop: Efficient Iterative Data Processing on Large Clusters,Yingyi Bu and Bill Howe and Magdalena Balazinska and Michael D. Ernst\n" +
    "conf/icde/LetchnerRBP10,Approximation trade-offs in Markovian stream processing: An empirical study,Julie Letchner and Christopher Re and Magdalena Balazinska and Matthai Philipose\n" +
    "journals/pvldb/HayRMS10,Boosting the Accuracy of Differentially Private Histograms Through Consistency,Michael Hay and Vibhor Rastogi and Gerome Miklau and Dan Suciu\n" +
    "conf/mud/GatterbauerJS10,Dissociation and Propagation for Efficient Query Evaluation over Probabilistic Databases,Wolfgang Gatterbauer and Abhay Kumar Jha and Dan Suciu\n" +
    "conf/sigmod/GatterbauerS10,Data conflict resolution using trust mappings,Wolfgang Gatterbauer and Dan Suciu\n" +
    "journals/debu/MeliouGHKMS10,Causality in Databases,Alexandra Meliou and Wolfgang Gatterbauer and Joseph Y. Halpern and Christoph Koch and Katherine F. Moore and Dan Suciu\n" +
    "conf/pervasive/WelbourneBBF10,Specification and Verification of Complex Location Events with Panoramic,Evan Welbourne and Magdalena Balazinska and Gaetano Borriello and James Fogarty\n" +
    "journals/pvldb/KhoussainovaKBS11,SnipSuggest: Context-Aware Autocompletion for SQL,Nodira Khoussainova and YongChul Kwon and Magdalena Balazinska and Dan Suciu\n" +
    "conf/ssdbm/GrochowHSBL10,Client + Cloud: Evaluating Seamless Architectures for Visual Data Analytics in the Ocean Sciences,Keith Grochow and Bill Howe and Mark Stoermer and Roger S. Barga and Edward D. Lazowska\n" +
    "conf/eScience/GrochowSFLHL10,COVE: A Visual Environment for Multidisciplinary Ocean Science Collaboration,Keith Grochow and Mark Stoermer and James Fogarty and Charlotte Lee and Bill Howe and Edward D. Lazowska\n";

var yelp_search_text = "business_id,name,full_address\n" +
    "C59Gr3A35GMqKs593mfxVA,Grand Canyon University,3300 W Camelback Rd Phoenix, AZ 85017\n" +
    "z9RjkAPe-00LGoBJjQadOw,Princess Pro Nail,13216 N 7th St Phoenix, AZ 85022\n" +
    "BMjggIgOghBMEXPo8q7q3w,LaBella Pizzeria and Restaurant,6505 N 7th St Phoenix, AZ 85014\n" +
    "BPi1Q5wX0_o5VlO_XRyYuQ,Pizzeria Bianco,4743 N 20th St Phoenix, AZ 85016\n" +
    "DmuvQmligwF6sJc81DoioA,Mindy Nails,18413 N Cave Creek Rd Phoenix, AZ 85032\n" +
    "zDBSgJJIGKKS8XDaE6Ycfw,Automatic Transmission Experts,4422 N 7th Ave Phoenix, AZ 85013\n" +
    "Fj73x68afXtA388ajOe3qw,US Egg,2957 W Bell Rd Phoenix, AZ 85053\n" +
    "4kV8BO6FHQTrxf9txJBt-Q,D & W Auto Service,3039 E Thomas Rd Phoenix, AZ 85008\n" +
    "7R8De0e3-pv6D-HhWlLRFA,Polished Nail Spa,10243 N Scottsdale Rd Ste 1 Scottsdale, AZ 85253\n" +
    "xI_iG7X6BcdLtj57bkUOqQ,Sun Valley Stereo,2809 E Thomas Rd Phoenix, AZ 85016\n" +
    "dSQh1Hx2BiSrYog4ad740A,Starbucks,3110 N Central Ave Ste 185 Phoenix, AZ 85012\n" +
    "VsgKeTyebDemed6V2N28GQ,Network Alignment & Brakes,12639 N Cave Creek Rd Phoenix, AZ 85022\n" +
    "sBgB9OLYOOewtw2RdHitzQ,Johnston's Automotive,3445 N 24th St Phoenix, AZ 85016\n" +
    "6-O63QoQA7mCVVAH-MMtuA,Wild Tuna Sushi and Spirits,805 E Thunderbird Rd Phoenix, AZ 85022\n" +
    "y24OBeSMK8MwOrpGtIJWpg,602 Auto Sports,331 N 16th St Phoenix, AZ 85006\n" +
    "NR_8LIX-oG50jUQpziBnWQ,Steak 44,5101 N 44th St Phoenix, AZ 85018\n" +
    "3DMvGD8ZmlMQmhwV66hdSA,China Village,2710 E Indian School Rd Phoenix, AZ 85016\n" +
    "LrPG6AgIomIrSNTcwJU5Hw,World Class Car Wash,3232 E McDowell Rd Phoenix, AZ 85008\n" +
    "DOx9ahD39IA8blUwF1fEhQ,Base Pizzeria,3115 E Lincoln Dr Phoenix, AZ 85016\n" +
    "RyUIcbNgIjzTE01rguyXUg,Chic Nails,4290 E Indian School Rd Phoenix, AZ 85018\n" +
    "BM0-dgPJMBMmcmO9PVCJfQ,Los Compadres Mexican Food,4414 N 7th Ave Phoenix, AZ 85013\n" +
    "IvLEvpC0oZHj7E0XHhxWMQ,Nails Trend,515 N 35th Ave Ste 127 Phoenix, AZ 85009\n" +
    "iJPG0GPcIirjOMlmzZWxBQ,Casa Filipina Bakeshop & Restaurant,3531 W Thunderbird Rd Phoenix, AZ 85053\n" +
    "eYwTptN9P3D_qagXxTOv-A,Sole Serenity,7024 E Osborn Rd Ste C-5 Scottsdale, AZ 85251\n" +
    "vvMR0jgDoBA-g1XgZy8sEg,Tryst Cafe,21050 N Tatum Blvd Phoenix, AZ 85050\n" +
    "DOGkXmX-okozRen6p2gURg,Superior Nails,2620 83rd Ave Ste 106 Phoenix, AZ 85043\n" +
    "8o-NLKy_XfbJtqljX9XLCA,Mrs White's Golden Rule Cafe,808 E Jefferson St Phoenix, AZ 85034\n" +
    "e9QRvkzssPNRmBLlDem9ZQ,Zookz Sandwiches,100 E Camelback Rd Phoenix, AZ 85012\n" +
    "dMLMz_lTNNFwCLzAl8j7WQ,Starbucks,125 N 2nd St Phoenix, AZ 85004\n" +
    "-HK-Lh9UIHjCnKAAePr7GQ,3D Nails and Spa,9620 N Metro Pkwy W Ste 25 Phoenix, AZ 85051\n" +
    "5jqqVt-A8bwwJDj7Ii7tvw,Mad Hatter Mufflers & Brakes,525 E Dunlap Ave Phoenix, AZ 85020\n" +
    "1Atqla4KsuE-YpaCKaSS_g,Tammy's La Nails,731 E Union Hills Dr Phoenix, AZ 85024\n" +
    "e1OD-zIxBjJXPlnYQvhdpw,Jack's Auto Alignment & Brakes,2902 E Thomas Rd Phoenix, AZ 85016\n" +
    "fFPJHOV1pTGoK-Gqf5QBSQ,WY Market,1819 W Buckeye Rd Phoenix, AZ 85007\n" +
    "QdcVJJhIG8MX6I4tIqpzgQ,Exclusive Nails,8808 N Central Ave Ste 258 Phoenix, AZ 85020\n" +
    "DkSFrA_iU97PmBdjLnIwqA,Kona 13 Coffee & Tea,1845 E University Dr Tempe, AZ 85281\n" +
    "UimUu5Q1m2mYEmAvreZQig,Welcome Chicken + Donuts,1535 E Buckeye Rd Phoenix, AZ 85034\n" +
    "T-AAN0CizEBOTtHinTuvrQ,Dunkin' Donuts,4130 E Thomas Rd Phoenix, AZ 85018\n" +
    "VapdXuC8X-Q3T_wgA6yCAg,Pizza People Pub,1326 N Central Ave Phoenix, AZ 85004\n" +
    "b9Cx4-vn8S8-OnYTfFcMzQ,US Nails,5243 W Indian School Rd Phoenix, AZ 85031\n" +
    "bOWm_Du7AN2j1Mdti38lcg,Above and Beyond Nails,4707 E Bell Rd Ste 2 Phoenix, AZ 85032\n" +
    "0IZjvddcvjEG09doKiFYAQ,Donut Parlor,1245 W Elliot Rd Ste 103 Tempe, AZ 85284\n" +
    "pcoaUpxsgtMuiGzNm2Ashw,Munich Motors,4809 N 7th Ave Phoenix, AZ 85013\n" +
    "Ax11wyp-FudujeU9nejQbw,Phoenix Public Market,14 E Pierce St Phoenix, AZ 85004\n" +
    "IoFggnoj1P4EcmNEP2K6Ng,Xtreme Bean Coffee,1707 E Southern Ave Tempe, AZ 85282\n" +
    "9SBU0aZbR2Tr3QTklUbbyg,Sweet Sunshine Nails,6990 E Shea Blvd Scottsdale, AZ 85254\n" +
    "SfVsLCVap7VlF3GLUI8PlQ,RBG Bar & Grill,427 N 44th St Phoenix, AZ 85008\n" +
    "QVMpwcjWzC01q_wZDI07cw,Smooth Brew Coffee,1447 E Mcdowell Rd Phoenix, AZ 85006\n" +
    "7WDzDGiWeAN9CdsC1nIGeA,Capitol Collision,5154 N 27th Ave Phoenix, AZ 85017\n" +
    "qJVECj6MCPaioYUae1a9gA,The Auto Shop,901 N Central Ave Phoenix, AZ 85004\n" +
    "MiajUnwoG7RGoaolO1rPaw,Ranch House Grille,5618 E Thomas Rd Phoenix, AZ 85018\n" +
    "iHpkhFcy7MwbDLB_joqPPQ,Kream Coffee,5102 N Central Ave Phoenix, AZ 85012\n" +
    "bA_5N0pODfQr1gnpO8RqQg,Elevens' Paint & Fiber,4131 E University Dr Phoenix, AZ 85034\n" +
    "TgxDGx7L_JICWbuBUCGVqw,Fajitas A Sizzlin Celebration,9841 N Black Canyon Hwy Phoenix, AZ 85021\n" +
    "_5HeuYqf2pEYFkjEI_dvKQ,Community Tire Pros & Auto Repair,123 E Durango St Phoenix, AZ 85004\n" +
    "PmPOuRvuN3CoNOi1nBj_TQ,Pappadeaux Seafood Kitchen,11051 N Black Canyon Hwy Phoenix, AZ 85029\n" +
    "zj0BkAi54BGU_AK6AyvJDQ,Rusconi's American Kitchen,10637 N Tatum Blvd Phoenix, AZ 85028\n" +
    "33zsO72VkYVnW2l5ZA16Cg,Mine Nails,7827 N 19th Ave Phoenix, AZ 85021\n" +
    "CCInhPbQLOBRHOYfFAZ4GA,Tag The Auto Guy,1401 E Camelback Rd Phoenix, AZ 85014\n" +
    "-_jLCD1NWODEXfgEAKfUAg,La Pi帽ata,5521 N 7th Ave Phoenix, AZ 85013\n" +
    "4zitC1IPRLvHfQVinRSKew,Johnnie's Chicago Style Pizza,15443 N Cave Creek Rd Phoenix, AZ 85034\n" +
    "lnX2gaGdO0fNtykyFrp1AA,Mel's Diner,1747 Grand Ave Phoenix, AZ 85007\n" +
    "4YjDL9M47wdfBWzSOrR1Vg,Independent Automotive Services,3800 N 7th St Phoenix, AZ 85014\n" +
    "qXQ3ZBdwI3GlbR5-eYWqNA,Saba's Mediterranean Kitchen,4747 E Bell Rd Phoenix, AZ 85032\n" +
    "e2oXHln1dux2ACR0QQGoeQ,Ingo's Tasty Food,4502 N 40th St Phoenix, AZ 85018\n" +
    "Hgbxen9iKGL4AH6kKgC8YQ,Cartel Coffee Lab,7124 E 5th Ave Scottsdale, AZ 85251\n" +
    "ZRJwVLyzEJq1VAihDhYiow,Spinato's Pizzeria,4848 E Chandler Blvd Phoenix, AZ 85044\n" +
    "bzDs0u8I-z231QVdIQWkrA,Los Reyes De La Torta,9230 N 7th St Phoenix, AZ 85020\n" +
    "A1_MJ2Z7yBGG2vHYw7fphw,We Buy Cars For Cash,2942 N 24th St Ste 114 Phoenix, AZ 85016\n" +
    "1vl4-5il_LGtDRxUCy9ldw,Vovomeena,1515 N 7th Ave Ste 170 Phoenix, AZ 85003\n" +
    "WfW8DbPRfd0bzjBDCfXEqw,Kt's Nails & Spa,7607 E Mcdowell Rd Ste 104 Scottsdale, AZ 85257\n";