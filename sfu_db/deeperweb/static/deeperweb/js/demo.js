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
        } else if ($(this).parent().is($("ul#aminer"))) {
            if ($(this).text() === 'Publ API') {
                var aminer_search_schema = ['id', 'title', 'authors.*.name', 'issn', 'num_citation', 'urls.*', 'venue.name', 'venue.id', 'year'];
                $.each(aminer_search_schema, function (index, element) {
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
    var typos = ["SIGMOD", "VLDB", "ICDE", "2018", "Database", "Journal", "Conference", "Vancouver", "Seattle"];
    var temp;
    var temp_array;
    $.each(table_input.find('tbody tr'), function (index, element) {
        if (index >= 10) {
            return false;
        }
        if (!(index % 3)) {
            temp = $(element).find('td:eq(1)');
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
        } else if (api_msg === "aminer Publ API") {
            if ($.inArray("title", hidden_match) === -1) {
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
                        row.push(table_row.eq(i).html());
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
                $(".alert-popup p:last").html("NaiveCrawl   Queries: 4   Cover: " + response['naive']);
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
        $("table#table_result tbody tr td span.glyphicon").each(function () {
            $(this).closest("tr").addClass('bg-sand')
        });
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
        var join_schema = $("div#join_schema");
        var result_head = $('table#table_result thead tr');
        var result_body = $('table#table_result tbody tr');
        $(join_schema.children('a.tag')).each(function () {
            if (!$(this).attr("style")) {
                result_head.find('th:eq(' + $(this).index() + ')').remove();
                result_body.find('td:eq(' + $(this).index() + ')').remove();
                $(this).remove();
            }
        });
        join_schema.children().remove();
        $(result_body).each(function () {
            if ($(this).find("td:last div").length) {
                $(this).find("td:last").remove();
            } else {
                $(this).remove();
            }
        });

        $('.bootstrap-switch#example input').bootstrapSwitch('state', false);
        $('.bootstrap-switch#format input').bootstrapSwitch('state', true);
        var table_input = $('div#table_input table');
        table_input.find('thead tr').remove();
        table_input.find('tbody tr').remove();
        table_input.find('thead').append(result_head);
        table_input.find('tbody').append(result_body);
        location.hash = "#api";
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
                    for (var i = 0; i < table_row.length - 1; i++) {
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
        var totalMs = 8000;

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
        current_row.addClass('bg-sand');
        alter_row.removeClass('bg-sand');
        alter_row.find(".table-expandable-arrow").toggleClass("up");
    });
}

var dblp_publ_text = "ID,title,author\n" +
    "0,QueryMarket Demonstration: Pricing for Online Data Markets,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu}\n" +
    "1,Elastic Memory Management for Cloud Data Analytics,Jingjing Wang and Magdalena Balazinska\n" +
    "2,Profiling a GPU database implementation: a holistic view of GPU resource utilization on TPC-H queries,Emily Furst and Mark Oskin and Bill Howe\n" +
    "3,Sloth: Being Lazy Is a Virtue (When Issuing Database Queries),Alvin Cheung and Samuel Madden and Armando Solar-Lezama\n" +
    "4,Query-Based Data Pricing,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "5,Managing Skew in Hadoop,YongChul Kwon and Kai Ren and Magdalena Balazinska and Bill Howe\n" +
    "6,A theory of pricing private data,Chao Li and Daniel Yang Li and Gerome Miklau and Dan Suciu\n" +
    "7,Toward elastic memory management for cloud data analytics,Jingjing Wang and Magdalena Balazinska\n" +
    "8,Big Data Science Needs Big Data Middleware,Bill Howe\n" +
    "9,Worst-Case Optimal Algorithms for Parallel Query Processing,Paraschos Koutris and Paul Beame and Dan Suciu\n" +
    "10,Communication Steps for Parallel Query Processing,Paul Beame and Paraschos Koutris and Dan Suciu\n" +
    "11,Tiresias: the database oracle for how-to queries,Alexandra Meliou and Dan Suciu\n" +
    "12,Dissociation and propagation for approximate lifted inference with standard relational database management systems,Wolfgang Gatterbauer and Dan Suciu\n" +
    "13,Lifted Inference in Probabilistic Databases,Dan Suciu\n" +
    "14,Communication Cost in Parallel Query Processing,Dan Suciu\n" +
    "15,From Theory to Practice: Efficient Join Query Evaluation in a Parallel Database System,Shumo Chu and Magdalena Balazinska and Dan Suciu\n" +
    "16,Approximate Lifted Inference with Probabilistic Databases,Wolfgang Gatterbauer and Dan Suciu\n" +
    "17,A formal approach to finding explanations for database queries,Sudeepa Roy and Dan Suciu\n" +
    "18,Understanding the Complexity of Lifted Inference and Asymmetric Weighted Model Counting,Eric Gribkoff and Guy Van den Broeck and Dan Suciu\n" +
    "19,Should we all be teaching \"intro to data science\" instead of \"intro to databases\"?,Bill Howe and Michael J. Franklin and Juliana Freire and James Frew and Tim Kraska and Raghu Ramakrishnan\n" +
    "20,Causality and Explanations in Databases,Alexandra Meliou and Sudeepa Roy and Dan Suciu\n" +
    "21,Lifted Probabilistic Inference: A Guide for the Database Researcher,Eric Gribkoff and Dan Suciu and Guy Van den Broeck\n" +
    "22,Knowledge Compilation Meets Database Theory: Compiling Queries to Decision Diagrams,Abhay Kumar Jha and Dan Suciu\n" +
    "23,A Discussion on Pricing Relational Data,Magdalena Balazinska and Bill Howe and Paraschos Koutris and Dan Suciu and Prasang Upadhyaya\n" +
    "24,The Myria Big Data Management and Analytics System and Cloud Services,Jingjing Wang and Tobin Baker and Magdalena Balazinska and Daniel Halperin and Brandon Haynes and Bill Howe and Dylan Hutchison and Andrew Whitaker and Shengliang Xu\n" +
    "25,Automatic example queries for ad hoc databases,Bill Howe and Garrett Cole and Nodira Khoussainova and Leilani Battle\n" +
    "26,Tracing data errors with view-conditioned causality,Alexandra Meliou and Wolfgang Gatterbauer and Suman Nath and Dan Suciu\n" +
    "27,Queries and materialized views on probabilistic databases,Nilesh N. Dalvi and Christopher Re and Dan Suciu\n" +
    "28,A latency and fault-tolerance optimizer for online parallel query plans,Prasang Upadhyaya and YongChul Kwon and Magdalena Balazinska\n" +
    "29,The Complexity of Causality and Responsibility for Query Answers and non-Answers,Alexandra Meliou and Wolfgang Gatterbauer and Katherine F. Moore and Dan Suciu\n" +
    "30,Lifted Inference Seen from the Other Side : The Tractable Features,Abhay Kumar Jha and Vibhav Gogate and Alexandra Meliou and Dan Suciu\n" +
    "31,Communication Cost in Parallel Query Evaluation: A Tutorial,Dan Suciu\n" +
    "32,WHY SO? or WHY NO? Functional Causality for Explaining Query Answers,Alexandra Meliou and Wolfgang Gatterbauer and Katherine F. Moore and Dan Suciu\n" +
    "33,Causality in Databases,Alexandra Meliou and Wolfgang Gatterbauer and Joseph Y. Halpern and Christoph Koch and Katherine F. Moore and Dan Suciu\n" +
    "34,Client + Cloud: Evaluating Seamless Architectures for Visual Data Analytics in the Ocean Sciences,Keith Grochow and Bill Howe and Mark Stoermer and Roger S. Barga and Edward D. Lazowska\n" +
    "35,9th USENIX Workshop on the Theory and Practice of Provenance, TaPP 2017, Seattle, WA, USA, June 23, 2017,Adam M. Bates and Bill Howe\n" +
    "36,Proceedings of the 2017 ACM International Conference on Management of Data, SIGMOD Conference 2017, Chicago, IL, USA, May 14-19, 2017,Semih Salihoglu and Wenchao Zhou and Rada Chirkova and Jun Yang and Dan Suciu\n" +
    "37,Cosette: An Automated Prover for SQL,Shumo Chu and Chenglong Wang and Konstantin Weitz and Alvin Cheung\n" +
    "38,Understanding Database Performance Inefficiencies in Real-world Web Applications,Cong Yan and Alvin Cheung and Junwen Yang and Shan Lu\n" +
    "39,HoTTSQL: proving query rewrites with univalent SQL semantics,Shumo Chu and Konstantin Weitz and Alvin Cheung and Dan Suciu\n" +
    "40,Synthesizing highly expressive SQL queries from input-output examples,Chenglong Wang and Alvin Cheung and Rastislav Bodik\n" +
    "41,Learning a Neural Semantic Parser from User Feedback,Srinivasan Iyer and Ioannis Konstas and Alvin Cheung and Jayant Krishnamurthy and Luke Zettlemoyer\n" +
    "42,DataSynthesizer: Privacy-Preserving Synthetic Datasets,Haoyue Ping and Julia Stoyanovich and Bill Howe\n" +
    "43,Deep Mapping of the Visual Literature,Bill Howe and Po-Shen Lee and Maxim Grechkin and Sean T. Yang and Jevin D. West\n" +
    "44,Data Science Education: We're Missing the Boat, Again,Bill Howe and Michael J. Franklin and Laura M. Haas and Tim Kraska and Jeffrey D. Ullman\n" +
    "45,A Worst-Case Optimal Multi-Round Algorithm for Parallel Computation of Conjunctive Queries,Bas Ketsman and Dan Suciu\n" +
    "46,What Do Shannon-type Inequalities, Submodular Width, and Disjunctive Datalog Have to Do with One Another?,Mahmoud Abo Khamis and Hung Q. Ngo and Dan Suciu\n" +
    "47,Optimizing Data-Intensive Applications Automatically By Leveraging Parallel Data Processing Frameworks,Maaz Bin Safeer Ahmad and Alvin Cheung\n" +
    "48,Interactive Query Synthesis from Input-Output Examples,Chenglong Wang and Alvin Cheung and Rastislav Bodik\n" +
    "49,Demonstration of the Cosette Automated SQL Prover,Shumo Chu and Daniel Li and Chenglong Wang and Alvin Cheung and Dan Suciu\n" +
    "50,Probabilistic Database Summarization for Interactive Data Exploration,Laurel Orr and Dan Suciu and Magdalena Balazinska\n" +
    "51,Query Processing on Probabilistic Data: A Survey,Guy Van den Broeck and Dan Suciu\n" +
    "52,Scalable and Efficient Flow-Based Community Detection for Large-Scale Graph Analysis,Seung-Hee Bae and Daniel Halperin and Jevin D. West and Martin Rosvall and Bill Howe\n" +
    "53,VisualCloud Demonstration: A DBMS for Virtual Reality,Brandon Haynes and Artem Minyaylov and Magdalena Balazinska and Luis Ceze and Alvin Cheung\n" +
    "54,Exact Model Counting of Query Expressions: Limitations of Propositional Methods,Paul Beame and Jerry Li and Sudeepa Roy and Dan Suciu\n" +
    "55,LaraDB: A Minimalist Kernel for Linear and Relational Algebra Computation,Dylan Hutchison and Bill Howe and Dan Suciu\n" +
    "56,Answering Conjunctive Queries with Inequalities,Paraschos Koutris and Tova Milo and Sudeepa Roy and Dan Suciu\n" +
    "57,Voyager 2: Augmenting Visual Analysis with Partial View Specifications,Kanit Wongsuphasawat and Zening Qu and Dominik Moritz and Riley Chang and Felix Ouk and Anushka Anand and Jock D. Mackinlay and Bill Howe and Jeffrey Heer\n" +
    "58,A Visual Cloud for Virtual Reality Applications,Magdalena Balazinska and Luis Ceze and Alvin Cheung and Brian Curless and Steven M. Seitz\n" +
    "59,ZaliQL: Causal Inference from Observational Data at Scale,Babak Salimi and Corey Cole and Dan R. K. Ports and Dan Suciu\n" +
    "60,Fides: Towards a Platform for Responsible Data Science,Julia Stoyanovich and Bill Howe and Serge Abiteboul and Gerome Miklau and Arnaud Sahuguet and Gerhard Weikum\n" +
    "61,A Demonstration of Interactive Analysis of Performance Measurements with Viska,Helga Gudmundsdottir and Babak Salimi and Magdalena Balazinska and Dan R. K. Ports and Dan Suciu\n" +
    "62,Comparative Evaluation of Big-Data Systems on Scientific Image Analytics Workloads,Parmita Mehta and Sven Dorkenwald and Dongfang Zhao and Tomer Kaftan and Alvin Cheung and Magdalena Balazinska and Ariel Rokem and Andrew J. Connolly and Jacob VanderPlas and Yusra AlSayyad\n" +
    "63,VizioMetrix: A Platform for Analyzing the Visual Information in Big Scholarly Data,Po-Shen Lee and Jevin D. West and Bill Howe\n" +
    "64,Summarizing Source Code using a Neural Attention Model,Srinivasan Iyer and Ioannis Konstas and Alvin Cheung and Luke Zettlemoyer\n" +
    "65,High variety cloud databases,Shrainik Jain and Dominik Moritz and Bill Howe\n" +
    "66,MusicDB: A Platform for Longitudinal Music Analytics,Jeremy Hyrkas and Bill Howe\n" +
    "67,Verified lifting of stencil computations,Shoaib Kamil and Alvin Cheung and Shachar Itzhaky and Armando Solar-Lezama\n" +
    "68,Computing Join Queries with Functional Dependencies,Mahmoud Abo Khamis and Hung Q. Ngo and Dan Suciu\n" +
    "69,SlimShot: Probabilistic Inference for Web-Scale Knowledge Bases,Eric Gribkoff and Dan Suciu\n" +
    "70,PipeGen: Data Pipe Generator for Hybrid Analytics,Brandon Haynes and Alvin Cheung and Magdalena Balazinska\n" +
    "71,PerfEnforce Demonstration: Data Analytics with Performance Guarantees,Jennifer Ortiz and Brendan Lee and Magdalena Balazinska\n" +
    "72,Quantifying Causal Effects on Query Answering in Databases,Babak Salimi and Leopoldo E. Bertossi and Dan Suciu and Guy Van den Broeck\n" +
    "73,Leveraging Lock Contention to Improve OLTP Application Performance,Cong Yan and Alvin Cheung\n" +
    "74,SQLShare: Results from a Multi-Year SQL-as-a-Service Experiment,Shrainik Jain and Dominik Moritz and Daniel Halperin and Bill Howe and Ed Lazowska\n" +
    "75,Leveraging Parallel Data Processing Frameworks with Verified Lifting,Maaz Bin Safeer Ahmad and Alvin Cheung\n" +
    "76,Computer-Assisted Query Formulation,Alvin Cheung and Armando Solar-Lezama\n" +
    "77,From NoSQL Accumulo to NewSQL Graphulo: Design and utility of graph algorithms inside a BigTable database,Dylan Hutchison and Jeremy Kepner and Vijay Gadepally and Bill Howe\n" +
    "78,SlimShot: In-Database Probabilistic Inference for Knowledge Bases,Eric Gribkoff and Dan Suciu\n" +
    "79,A Guide to Formal Analysis of Join Processing in Massively Parallel Systems,Paraschos Koutris and Dan Suciu\n" +
    "80,Price-Optimal Querying with Data APIs,Prasang Upadhyaya and Magdalena Balazinska and Dan Suciu\n" +
    "81,Towards a general-purpose query language for visualization recommendation,Kanit Wongsuphasawat and Dominik Moritz and Anushka Anand and Jock D. Mackinlay and Bill Howe and Jeffrey Heer\n" +
    "82,Packet Transactions: High-Level Programming for Line-Rate Switches,Anirudh Sivaraman and Alvin Cheung and Mihai Budiu and Changhoon Kim and Mohammad Alizadeh and Hari Balakrishnan and George Varghese and Nick McKeown and Steve Licking\n" +
    "83,The Beckman report on database research,Daniel Abadi and Rakesh Agrawal and Anastasia Ailamaki and Magdalena Balazinska and Philip A. Bernstein and Michael J. Carey and Dan Suciu and Michael Stonebraker and Todd Walter and Jennifer Widom\n" +
    "84,Voyager: Exploratory Analysis via Faceted Browsing of Visualization Recommendations,Kanit Wongsuphasawat and Dominik Moritz and Anushka Anand and Jock D. Mackinlay and Bill Howe and Jeffrey Heer\n" +
    "85,Research Directions for Principles of Data Management (Abridged),Serge Abiteboul and Marcelo Arenas and Pablo Barcelo and Meghyn Bienvenu and Diego Calvanese and Claire David and Richard Hull and Dan Suciu and Victor Vianu and Ke Yi\n" +
    "86,Scalable clustering algorithms for continuous environmental flow cytometry,Jeremy Hyrkas and Sophie Clayton and Francois Ribalet and Daniel Halperin and E. Virginia Armbrust and Bill Howe\n" +
    "87,The Aurora and Borealis Stream Processing Engines,Ugur Cetintemel and Daniel J. Abadi and Yanif Ahmad and Hari Balakrishnan and Magdalena Balazinska and Mitch Cherniack and Ying Xing and Stan Zdonik\n" +
    "88,GossipMap: a distributed community detection algorithm for billion-edge directed graphs,Seung-Hee Bae and Bill Howe\n" +
    "89,Proceedings of the Sixth {ACM} Symposium on Cloud Computing, SoCC 2015, Kohala Coast, Hawaii, USA, August 27-29, 2015,Shahram Ghandeharizadeh and Sumita Barahmand and  Magdalena Balazinska and  Michael J. Freedman\n" +
    "90,Towards Generating Application-Specific Data Management Systems,Alvin Cheung\n" +
    "91,Dismantling Composite Visualizations in the Scientific Literature,Po-Shen Lee and Bill Howe\n" +
    "92,Rethinking the application-database interface,Alvin Cheung\n" +
    "93,Changing the Face of Database Cloud Services with Personalized Service Level Agreements,Jennifer Ortiz and Victor Teixeira de Almeida and Magdalena Balazinska\n" +
    "94,Detecting and Dismantling Composite Visualizations in the Scientific Literature,Po-Shen Lee and Bill Howe\n" +
    "95,Time-Varying Clusters in Large-Scale Flow Cytometry,Jeremy Hyrkas and Daniel Halperin and Bill Howe\n" +
    "96,The ACM PODS Alberto O. Mendelzon Test-of-Time Award 2015,Foto N. Afrati and Frank Neven and Dan Suciu\n" +
    "97,Symmetric Weighted First-Order Model Counting,Paul Beame and Guy Van den Broeck and Eric Gribkoff and Dan Suciu\n" +
    "98,Bridging the Gap Between General-Purpose and Domain-Specific Compilers with Synthesis,Alvin Cheung and Shoaib Kamil and Armando Solar-Lezama\n" +
    "99,Gaussian Mixture Models Use-Case: In-Memory Analysis with Myria,Ryan Maas and Jeremy Hyrkas and Olivia Grace Telford and Magdalena Balazinska and Andrew J. Connolly and Bill Howe\n" +
    "100,Machine Learning and Databases: The Sound of Things to Come or a Cacophony of Hype?,Christopher Re and Divy Agrawal and Magdalena Balazinska and Michael J. Cafarella and Michael I. Jordan and Tim Kraska and Raghu Ramakrishnan\n" +
    "101,Automated Analysis of Muscle X-ray Diffraction Imaging with MCMC,C. David Williams and Magdalena Balazinska and Thomas L. Daniel\n" +
    "102,Explaining Query Answers with Explanation-Ready Databases,Sudeepa Roy and Laurel Orr and Dan Suciu\n" +
    "103,Efficient iterative processing in the SciDB parallel array engine,Emad Soroush and Magdalena Balazinska and K. Simon Krughoff and Andrew J. Connolly\n" +
    "104,Asynchronous and Fault-Tolerant Recursive Datalog Evaluation in Shared-Nothing Engines,Jingjing Wang and Magdalena Balazinska and Daniel Halperin\n" +
    "105,Towards automated prediction of relationships among scientific datasets,Abdussalam Alawini and David Maier and Kristin Tufte and Bill Howe and Rashmi Nandikur\n" +
    "106,Perfopticon: Visual Query Analysis for Distributed Databases,Dominik Moritz and Daniel Halperin and Bill Howe and Jeffrey Heer\n" +
    "107,Parallel Skyline Queries,Foto N. Afrati and Paraschos Koutris and Dan Suciu and Jeffrey D. Ullman\n" +
    "108,Automatic Enforcement of Data Use Policies with DataLawyer,Prasang Upadhyaya and Magdalena Balazinska and Dan Suciu\n" +
    "109,Front Matter,Magdalena Balazinska\n" +
    "110,Big Data Research: Will Industry Solve all the Problems?,Magdalena Balazinska\n" +
    "111,A Demonstration of the BigDAWG Polystore System,Aaron J. Elmore and Jennie Duggan and Mike Stonebraker and Magdalena Balazinska and Ugur Cetintemel and Vijay Gadepally and Nesime Tatbul and Manasi Vartak and Stan Zdonik\n" +
    "112,The BigDAWG Polystore System,Jennie Duggan and Aaron J. Elmore and Michael Stonebraker and Magdalena Balazinska and Bill Howe and Jeremy Kepner and Sam Madden and David Maier and Tim Mattson and Stanley B. Zdonik\n" +
    "113,Counting of Query Expressions: Limitations of Propositional Methods,Paul Beame and Jerry Li and Sudeepa Roy and Dan Suciu\n" +
    "114,A Dichotomy on the Complexity of Consistent Query Answering for Atoms with Simple Keys,Paraschos Koutris and Dan Suciu\n" +
    "115,Helping scientists reconnect their datasets,Abdussalam Alawini and David Maier and Kristin Tufte and Bill Howe\n" +
    "116,Affordable Analytics on Expensive Data,Prasang Upadhyaya and Martina Unutzer and Magdalena Balazinska and Dan Suciu and Hakan Hacigumus\n" +
    "117,Approximation trade-offs in a Markovian stream warehouse: An empirical study,Julie Letchner and Magdalena Balazinska and Christopher Re and Matthai Philipose\n" +
    "118,Using Program Analysis to Improve Database Applications,Alvin Cheung and Samuel Madden and Armando Solar-Lezama and Owen Arden and Andrew C. Myers\n" +
    "119,Support the Data Enthusiast: Challenges for Next-Generation Data-Analysis Systems,Kristi Morton and Magdalena Balazinska and Dan Grossman and Jock D. Mackinlay\n" +
    "120,Public Data and Visualizations: How are Many Eyes and Tableau Public Used for Collaborative Analytics?,Kristi Morton and Magdalena Balazinska and Dan Grossman and Robert Kosara and Jock D. Mackinlay\n" +
    "121,Oblivious bounds on the probability of boolean functions,Wolfgang Gatterbauer and Dan Suciu\n" +
    "122,Big-Data Management Use-Case: A Cloud Service for Creating and Analyzing Galactic Merger Trees,Sarah Loebman and Jennifer Ortiz and Lee Lee Choo and Laurel Orr and Lauren Anderson and Daniel Halperin and Magdalena Balazinska and Thomas Quinn and Fabio Governato\n" +
    "123,The database group at the University of Washington,Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "124,Demonstration of the Myria big data management service,Daniel Halperin and Victor Teixeira de Almeida and Lee Lee Choo and Shumo Chu and Paraschos Koutris and Dominik Moritz and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "125,Conference on Scientific and Statistical Database Management, SSDBM '13, Baltimore, MD, USA, July 29 - 31, 2013,Alex Szalay and Tamas Budavari and Magdalena Balazinska and Alexandra Meliou and Ahmet Sacan\n" +
    "126,Big Data Begets Big Database Theory,Dan Suciu\n" +
    "127,Scalable Flow-Based Community Detection for Large-Scale Network Analysis,Seung-Hee Bae and Daniel Halperin and Jevin D. West and Martin Rosvall and Bill Howe\n" +
    "128,Lower Bounds for Exact Model Counting and Applications in Probabilistic Databases,Paul Beame and Jerry Li and Sudeepa Roy and Dan Suciu\n" +
    "129,Time travel in a scientific array database,Emad Soroush and Magdalena Balazinska\n" +
    "130,Optimizing database-backed applications with query synthesis,Alvin Cheung and Armando Solar-Lezama and Samuel Madden\n" +
    "131,Compiled Plans for In-Memory Path-Counting Queries,Brandon Myers and Jeremy Hyrkas and Daniel Halperin and Bill Howe\n" +
    "132,StatusQuo: Making Familiar Abstractions Perform Using Program Analysis,Alvin Cheung and Owen Arden and Samuel Madden and Armando Solar-Lezama and Andrew C. Myers\n" +
    "133,Mobile applications need targeted micro-updates,Alvin Cheung and Lenin Ravindranath and Eugene Wu and Samuel Madden and Hari Balakrishnan\n" +
    "134,Speeding up database applications with Pyxis,Alvin Cheung and Owen Arden and Samuel Madden and Andrew C. Myers\n" +
    "135,Collaborative Science Workflows in SQL,Bill Howe and Daniel Halperin and Francois Ribalet and Sagar Chitnis and E. Virginia Armbrust\n" +
    "136,Hadoop's Adolescence,Kai Ren and YongChul Kwon and Magdalena Balazinska and Bill Howe\n" +
    "137,Massive scale cyber traffic analysis: a driver for graph database research,Cliff Joslyn and Sutanay Choudhury and David Haglin and Bill Howe and Bill Nickless and Bryan Olsen\n" +
    "138,Toward practical query pricing with QueryMarket,Paraschos Koutris and Prasang Upadhyaya and Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "139,Education and career paths for data scientists,Magdalena Balazinska and Susan B. Davidson and Bill Howe and Alexandros Labrinidis\n" +
    "140,Real-time collaborative analysis with (almost) pure SQL: a case study in biogeochemical oceanography,Daniel Halperin and Francois Ribalet and Konstantin Weitz and Mak A. Saito and Bill Howe and E. Virginia Armbrust\n" +
    "141,Stop That Query! The Need for Managing Data Use,Prasang Upadhyaya and Nick R. Anderson and Magdalena Balazinska and Bill Howe and Raghav Kaushik and Ravishankar Ramamurthy and Dan Suciu\n" +
    "142,The power of data use management in action,Prasang Upadhyaya and Nick R. Anderson and Magdalena Balazinska and Bill Howe and Raghav Kaushik and Ravishankar Ramamurthy and Dan Suciu\n" +
    "143,Squeezing a Big Orange into Little Boxes: The AscotDB System for Parallel Processing of Data on a Sphere,Jacob VanderPlas and Emad Soroush and K. Simon Krughoff and Magdalena Balazinska\n" +
    "144,A Demonstration of Iterative Parallel Array Processing in Support of Telescope Image Analysis,Matthew Moyers and Emad Soroush and Spencer Wallace and K. Simon Krughoff and Jake VanderPlas and Magdalena Balazinska and Andrew J. Connolly\n" +
    "145,Proceedings of the 6th Alberto Mendelzon International Workshop on Foundations of Data Management, Ouro Preto, Brazil, June 27-30, 2012,Juliana Freire and Dan Suciu\n" +
    "146,On the tractability of query compilation and bounded treewidth,Abhay Kumar Jha and Dan Suciu\n" +
    "147,Abstract: Hadoop's Adolescence; A Comparative Workloads Analysis from Three Research Clusters,Kai Ren and Garth Gibson and YongChul Kwon and Magdalena Balazinska and Bill Howe\n" +
    "148,VizDeck: a card game metaphor for fast visual data exploration,Bill Howe and Alicia Key and Daniel Perry and Cecilia R. Aragon\n" +
    "149,Poster: Hadoop's Adolescence; A Comparative Workloads Analysis from Three Research Clusters,Kai Ren and Garth Gibson and YongChul Kwon and Magdalena Balazinska and Bill Howe\n" +
    "150,Virtual Appliances, Cloud Computing, and Reproducible Research,Bill Howe\n" +
    "151,Understanding cardinality estimation using entropy maximization,Christopher Re and Dan Suciu\n" +
    "152,Using program synthesis for social recommendations,Alvin Cheung and Armando Solar-Lezama and Samuel Madden\n" +
    "153,VizDeck: self-organizing dashboards for visual analytics,Bill Howe and Alicia Key and Daniel Perry and Cecilia R. Aragon\n" +
    "154,A Dataflow Graph Transformation Language and Query Rewriting System for RDF Ontologies,Marianne Shaw and Landon Detwiler and James F. Brinkley and Dan Suciu\n" +
    "155,SkewTune: mitigating skew in mapreduce applications,YongChul Kwon and Magdalena Balazinska and Bill Howe and Jerome A. Rolia\n" +
    "156,SQL on an encrypted database: technical perspective,Dan Suciu\n" +
    "157,COVE: A Visual Environment for Multidisciplinary Ocean Science Collaboration,Keith Grochow and Mark Stoermer and James Fogarty and Charlotte Lee and Bill Howe and Edward D. Lazowska\n" +
    "158,Advancing Declarative Query in the Long Tail of Science,Bill Howe and Daniel Halperin\n" +
    "159,Probabilistic Databases with MarkoViews,Abhay Kumar Jha and Dan Suciu\n" +
    "160,The HaLoop approach to large-scale iterative data analysis,Yingyi Bu and Bill Howe and Magdalena Balazinska and Michael D. Ernst\n" +
    "161,Undefined behavior: what happened to my code?,Xi Wang and Haogang Chen and Alvin Cheung and Zhihao Jia and Nickolai Zeldovich and M. Frans Kaashoek\n" +
    "162,Optimizing Large-Scale Semi-Naive Datalog Evaluation in Hadoop,Marianne Shaw and Paraschos Koutris and Bill Howe and Dan Suciu\n" +
    "163,Tiresias: a demonstration of how-to queries,Alexandra Meliou and Yisong Song and Dan Suciu\n" +
    "164,The dichotomy of probabilistic inference for unions of conjunctive queries,Nilesh N. Dalvi and Dan Suciu\n" +
    "165,Designing good algorithms for MapReduce and beyond,Foto N. Afrati and Magdalena Balazinska and Anish Das Sarma and Bill Howe and Semih Salihoglu and Jeffrey D. Ullman\n" +
    "166,SkewTune in Action: Mitigating Skew in MapReduce Applications,YongChul Kwon and Magdalena Balazinska and Bill Howe and Jerome A. Rolia\n" +
    "167,Automatic Partitioning of Database Applications,Alvin Cheung and Owen Arden and Samuel Madden and Andrew C. Myers\n" +
    "168,How to Price Shared Optimizations in the Cloud,Prasang Upadhyaya and Magdalena Balazinska and Dan Suciu\n" +
    "169,PerfXplain: Debugging MapReduce Job Performance,Nodira Khoussainova and Magdalena Balazinska and Dan Suciu\n" +
    "170,Tractability in probabilistic databases,Dan Suciu\n" +
    "171,Proceedings of the 2011 EDBT/ICDT Workshop on Array Databases, Uppsala, Sweden, March 25, 2011,Peter Baumann and Bill Howe and Kjell Orsborn and Silvia Stefanova\n" +
    "172,Hybrid merge/overlap execution technique for parallel array processing,Emad Soroush and Magdalena Balazinska\n" +
    "173,Parallel evaluation of conjunctive queries,Paraschos Koutris and Dan Suciu\n" +
    "174,Bringing Provenance to Its Full Potential Using Causal Reasoning,Alexandra Meliou and Wolfgang Gatterbauer and Dan Suciu\n" +
    "175,Parallel visualization on large clusters using MapReduce,Huy T. Vo and Jonathan Bronson and Brian Summa and Joao Luiz Dihl Comba and Juliana Freire and Bill Howe and Valerio Pascucci and Claudio T. Silva\n" +
    "176,Automatically generating interesting events with LifeJoin,Alvin Cheung and Arvind Thiagarajan and Samuel Madden\n" +
    "177,Lineage for Markovian stream event queries,Julie Letchner and Magdalena Balazinska\n" +
    "178,ArrayStore: a storage manager for complex parallel array processing,Emad Soroush and Magdalena Balazinska and Daniel L. Wang\n" +
    "179,Partial replay of long-running applications,Alvin Cheung and Armando Solar-Lezama and Samuel Madden\n" +
    "180,Database-as-a-Service for Long-Tail Science,Bill Howe and Garrett Cole and Emad Souroush and Paraschos Koutris and Alicia Key and Nodira Khoussainova and Leilani Battle\n" +
    "181,vSPARQL: A view definition language for the semantic web,Marianne Shaw and Landon Fridman Detwiler and Natalya Fridman Noy and James F. Brinkley and Dan Suciu\n" +
    "182,Managing Structured Collections of Community Data,Wolfgang Gatterbauer and Dan Suciu\n" +
    "183,Default-all is dangerous!,Wolfgang Gatterbauer and Alexandra Meliou and Dan Suciu\n" +
    "184,Probabilistic Databases,Dan Suciu and Dan Olteanu and Christopher Re and Christoph Koch\n" +
    "185,Reverse Data Management,Alexandra Meliou and Wolfgang Gatterbauer and Dan Suciu\n" +
    "186,Towards Efficient and Precise Queries over Ten Million Asteroid Trajectory Models,Yusra AlSayyad and K. Simon Krughoff and Bill Howe and Andrew J. Connolly and Magdalena Balazinska and Lynne Jones\n" +
    "187,Data Markets in the Cloud: An Opportunity for the Database Community,Magdalena Balazinska and Bill Howe and Dan Suciu\n" +
    "188,Session-Based Browsing for More Effective Query Reuse,Nodira Khoussainova and YongChul Kwon and Wei-Ting Liao and Magdalena Balazinska and Wolfgang Gatterbauer and Dan Suciu\n" +
    "189,Bridging the gap between intensional and extensional query evaluation in probabilistic databases,Abhay Kumar Jha and Dan Olteanu and Dan Suciu\n" +
    "190,Definitions matter: reconciling differential and adversarial privacy: invited talk,Dan Suciu\n" +
    "191,Computing query probability with incidence algebras,Nilesh N. Dalvi and Karl Schnaitter and Dan Suciu\n" +
    "192,Skew-resistant parallel processing of feature-extracting scientific user-defined functions,YongChul Kwon and Magdalena Balazinska and Bill Howe and Jerome A. Rolia\n" +
    "193,Estimating the progress of MapReduce pipelines,Kristi Morton and Abram L. Friesen and Magdalena Balazinska and Dan Grossman\n" +
    "194,ParaTimer: a progress indicator for MapReduce DAGs,Kristi Morton and Magdalena Balazinska and Dan Grossman\n" +
    "195,Scalable Clustering Algorithm for N-Body Simulations in a Shared-Nothing Cluster,YongChul Kwon and Dylan Nunley and Jeffrey P. Gardner and Magdalena Balazinska and Bill Howe and Sarah Loebman\n" +
    "196,HaLoop: Efficient Iterative Data Processing on Large Clusters,Yingyi Bu and Bill Howe and Magdalena Balazinska and Michael D. Ernst\n" +
    "197,Approximation trade-offs in Markovian stream processing: An empirical study,Julie Letchner and Christopher Re and Magdalena Balazinska and Matthai Philipose\n" +
    "198,Boosting the Accuracy of Differentially Private Histograms Through Consistency,Michael Hay and Vibhor Rastogi and Gerome Miklau and Dan Suciu\n" +
    "199,Dissociation and Propagation for Efficient Query Evaluation over Probabilistic Databases,Wolfgang Gatterbauer and Abhay Kumar Jha and Dan Suciu\n" +
    "200,Data conflict resolution using trust mappings,Wolfgang Gatterbauer and Dan Suciu\n" +
    "201,Specification and Verification of Complex Location Events with Panoramic,Evan Welbourne and Magdalena Balazinska and Gaetano Borriello and James Fogarty\n" +
    "202,SnipSuggest: Context-Aware Autocompletion for SQL,Nodira Khoussainova and YongChul Kwon and Magdalena Balazinska and Dan Suciu\n";

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