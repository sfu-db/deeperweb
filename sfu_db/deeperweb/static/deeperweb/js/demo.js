$(document).ready(function () {
    switch_button_init();
    api_choose();
    location_choose();
    schema_matching();
    upload_csv();
    popup_news_init();
    smart_crawl();
    init_table();
    re_enrich();
    download_csv();
    record_replace();
    show_queries();
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
                    hidden_schema.append("<a class='orange-tag'>" + element + "</a>");
                    if (index < 3) {
                        hidden_schema.find("a:last").css({
                            'color': '#ffffff',
                            'background': '#f0ad4e',
                            'border-color': '#f0ad4e'
                        });
                        hidden_schema.find("a:last").append("<span class='badge'>" + index + "</span>");
                    }
                });
                if ($('.bootstrap-switch#example input').bootstrapSwitch('state')) {
                    $("div#text_input textarea").val(dblp_publ_text);
                }
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Info!");
                $(".alert-popup p:last").html("Sorry, this api is not supported now.");
            }
        } else if ($(this).parent().is($("ul#aminer"))) {
            if ($(this).text() === 'Publ API') {
                var aminer_search_schema = ['id', 'title', 'authors.*.name', 'issn', 'num_citation', 'urls.*', 'venue.name', 'venue.id', 'year'];
                $.each(aminer_search_schema, function (index, element) {
                    hidden_schema.append("<a class='orange-tag'>" + element + "</a>");
                    if (index < 3) {
                        hidden_schema.find("a:last").css({
                            'color': '#ffffff',
                            'background': '#f0ad4e',
                            'border-color': '#f0ad4e'
                        });
                        hidden_schema.find("a:last").append("<span class='badge'>" + index + "</span>");
                    }
                });
                if ($('.bootstrap-switch#example input').bootstrapSwitch('state')) {
                    $("div#text_input textarea").val(dblp_publ_text);
                }
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Info!");
                $(".alert-popup p:last").html("Sorry, this api is not supported now.");
            }
        } else if ($(this).parent().is($("ul#yelp"))) {
            if ($(this).text() === 'Search API') {
                var yelp_search_schema = ['name', 'location.display_address.*', 'id', 'url', 'coordinates.latitude', 'coordinates.longitude', 'phone', 'categories.*.alias', 'categories.*.title', 'display_phone', 'location.city', 'location.country', 'location.address1', 'location.address2', 'location.address3', 'location.state', 'location.zip_code'];
                $.each(yelp_search_schema, function (index, element) {
                    hidden_schema.append("<a class='orange-tag'>" + element + "</a>");
                    if (index < 2) {
                        hidden_schema.find("a:last").css({
                            'color': '#ffffff',
                            'background': '#f0ad4e',
                            'border-color': '#f0ad4e'
                        });
                        hidden_schema.find("a:last").append("<span class='badge'>" + index + "</span>");
                    }
                });
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Info!");
                $(".alert-popup p:last").html("Sorry, this api is not supported now.");
            }
        } else if ($(this).parent().is($("ul#google"))) {
            if ($(this).text() === 'Place API') {
                var google_place_schema = ['name', 'formatted_address', 'place_id', 'formatted_phone_number', 'geometry.location.lat', 'geometry.location.lng', 'vicinity', 'website'];
                $.each(google_place_schema, function (index, element) {
                    hidden_schema.append("<a class='orange-tag'>" + element + "</a>");
                    if (index < 2) {
                        hidden_schema.find("a:last").css({
                            'color': '#ffffff',
                            'background': '#f0ad4e',
                            'border-color': '#f0ad4e'
                        });
                        hidden_schema.find("a:last").append("<span class='badge'>" + index + "</span>");
                    }
                });
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Info!");
                $(".alert-popup p:last").html("Sorry, this api is not supported now.");
            }
        } else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p:first").html("Info!");
            $(".alert-popup p:last").html("Sorry, this api is not supported now.");
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

/*choose location*/
function location_choose() {
    $("div#api select").change(function () {
        if ($('.bootstrap-switch#example input').bootstrapSwitch('state')) {
            if ($(this).children('option:selected').val() === "AZ") {
                $("div#text_input textarea").val(yelp_search_text_AZ);
            } else if ($(this).children('option:selected').val() === "Toronto") {
                $("div#text_input textarea").val(yelp_search_text_Toronto);
            }
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
            $(this).css({'color': '#ffffff', 'background': '#337ab7', 'border-color': '#337ab7'});
            $(this).append("<span class='badge'></span>");
        }
        var active_tags = $("div#local_schema a[style]");
        for (var i = 0; i < active_tags.length; i++) {
            active_tags.eq(i).find("span").text(i);
        }
    });

    /*hidden schema*/
    $("div#hidden_schema").delegate("a.orange-tag", "click", function () {
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
            $(this).css({'color': '#ffffff', 'background': '#f0ad4e', 'border-color': '#f0ad4e'});
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
            $(this).css({'color': '#ffffff', 'background': '#337ab7', 'border-color': '#337ab7'});
            $('table thead tr').find('th:eq(' + $(this).index() + ')').show();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').show();
        }
    });
    $("div#join_schema").delegate("a.orange-tag", "click", function () {
        if ($(this).attr("style")) {
            $(this).removeAttr("style");
            $('table thead tr').find('th:eq(' + $(this).index() + ')').hide();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').hide();
        } else {
            $(this).css({'color': '#ffffff', 'background': '#f0ad4e', 'border-color': '#f0ad4e'});
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
            $('.bootstrap-switch#format input').bootstrapSwitch('state', true);
            $("div#text_input").hide();
            $("div#table_input table thead").html(local_thead);
            $("div#table_input table tbody").html(local_tbody);
            $("div#table_input").show();
            $("button#upload").attr("disabled", false);
            $("button#upload a").text("Upload csv");
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
        var hidden_schema = $('div#hidden_schema').children('a.orange-tag');
        var hidden_match = [];
        $(hidden_schema).each(function () {
            if ($(this).attr("style")) {
                hidden_match.push($(this).text().substring(0, $(this).text().length - $(this).children('span').text().length));
            }
        });
        var api = $('div#api ul li.active');
        var api_msg = [];
        api_msg.push(api.parent().attr('id') + ' ' + api.text());
        /*judge the correctness of schema and api*/
        if (local_match.length !== hidden_match.length) {
            $(".alert-popup").addClass("open");
            $(".alert-popup p:first").html("Warning!");
            $(".alert-popup p:last").html("Please match the schema correctly.");
            return false;
        }
        if (api_msg[0].indexOf("dblp Publ API") !== -1) {
            if ($.inArray("info.title", hidden_match) === -1) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Warning!");
                $(".alert-popup p:last").html("info.title is necessary.");
                return false;
            }
        } else if (api_msg[0].indexOf("aminer Publ API") !== -1) {
            if ($.inArray("title", hidden_match) === -1) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Warning!");
                $(".alert-popup p:last").html("info.title is necessary.");
                return false;
            }
        } else if (api_msg[0].indexOf("yelp Search API") !== -1) {
            if ($.inArray("name", hidden_match) === -1 || $.inArray("location.display_address.*", hidden_match) === -1) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Warning!");
                $(".alert-popup p:last").html("name and location.display_address.* is necessary.");
                return false;
            }
            if (api.parent().next().get(0).selectedIndex !== 0) {
                api_msg.push(api.parent().next().find('option:selected').val());
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Warning!");
                $(".alert-popup p:last").html("state is necessary.");
                return false;
            }
        } else if (api_msg[0].indexOf("google Place API") !== -1) {
            if ($.inArray("name", hidden_match) === -1 || $.inArray("formatted_address", hidden_match) === -1) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Warning!");
                $(".alert-popup p:last").html("name and formatted_address is necessary.");
                return false;
            }
            if (api.parent().next().get(0).selectedIndex !== 0) {
                api_msg.push(api.parent().next().find('option:selected').val());
            } else {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Warning!");
                $(".alert-popup p:last").html("state is necessary.");
                return false;
            }
        } else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p:first").html("Info!");
            $(".alert-popup p:last").html("Sorry, this api is not supported now.");
            return false;
        }
        /*pre-process the local record*/
        if ($("div#text_input").is(":visible")) {
            var original_data = $("div#text_input textarea").val();
            if (original_data.length > 5242880) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Error!");
                $(".alert-popup p:last").html("Maximum file size is 5MB");
                return false;
            }
            if (original_data.split('\n').length > 20000) {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Error!");
                $(".alert-popup p:last").html("Maximum number of rows for file is 20000");
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
                var join_keys = "<a class='tag' style='display: none'></a>";
                var join_thead = "<tr><th></th>";
                $.each(response['local_header'], function (index, element) {
                    join_thead += "<th>" + element + "</th>";
                    join_keys += "<a class='tag'>" + element + "</a>";
                });
                $.each(response['hidden_header'], function (index, element) {
                    join_thead += "<th style=\"background-color:#f0ad4e\">" + element + "</th>";
                    join_keys += "<a class='orange-tag'>" + element + "</a>";
                });
                join_thead += "</tr>";

                var join_tbody = "";
                var temp_local;
                var temp_row;
                $.each(response['record'], function (index, element) {
                    temp_local = "";
                    for (var i = 0; i < element[0].length; i++) {
                        temp_local += "<td>" + element[0][i] + "</td>";
                    }

                    temp_row = temp_local;
                    for (var j = 0; j < element[1].length; j++) {
                        temp_row += "<td>" + element[1][j] + "</td>";
                    }

                    if (element.length > 2) {
                        temp_row = "<tr><td style='cursor: pointer;'><div class='table-expandable-arrow'></div></td>" + temp_row + "</tr>";
                        for (var m = 2; m < element.length; m++) {
                            temp_row += "<tr style='display: none'><td style='cursor: pointer;'><span class=\"glyphicon glyphicon-retweet\"></span></td>" + temp_local;
                            for (var n = 0; n < element[m].length; n++) {
                                temp_row += "<td>" + element[m][n] + "</td>";
                            }
                            temp_row += "</tr>";
                        }
                    } else {
                        temp_row = "<tr><td><div></div></td>" + temp_row + "</tr>";
                    }
                    join_tbody += temp_row;
                });
                var join_schema = $("div#join_schema");
                join_schema.children().remove();
                join_schema.append(join_keys);

                $("table#table_result thead").html(join_thead);
                $("table#table_result tbody").html(join_tbody);

                $('table#table_result thead tr th').hide();
                $('table#table_result tbody tr td').hide();

                $(local_match).each(function (index, element) {
                    $(join_schema.children('a.tag')).each(function () {
                        if ($(this).text() === element) {
                            $(this).css({'color': '#ffffff', 'background': '#337ab7', 'border-color': '#337ab7'});
                            $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').show();
                            $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').show();
                        }
                    });
                });
                $(hidden_match).each(function (index, element) {
                    $(join_schema.children('a.orange-tag')).each(function () {
                        if ($(this).text() === element) {
                            $(this).css({'color': '#ffffff', 'background': '#f0ad4e', 'border-color': '#f0ad4e'});
                            $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').show();
                            $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').show();
                        }
                    });
                });

                $('table#table_result thead tr th:first').show();
                $('table#table_result tbody tr').find('td:first').show();
                $("div#topLoader").hide();
                $("table#table_result").show();

                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("SmartCrawl   <a>Queries</a>: 4   Cover: " + response['record'].length);
                $(".alert-popup p:last").html("NaiveCrawl   <a>Queries</a>: 4   Cover: " + response['naive']);

                query_tbody = "";
                for (var i = 0; i < response['smart_queries'].length; i++) {
                    query_tbody += "<tr><td>"+response['smart_queries'][i]+"</td><td>"+response['naive_queries'][i]+"</td></tr>";
                }
                $(".query-popup table tbody").html(query_tbody);
            },
            error: function () {
                $(".alert-popup").addClass("open");
                $(".alert-popup p:first").html("Error!");
                $(".alert-popup p:last").html("Incorrect Format.");
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
        while (temp.find("td:first span").length) {
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
        $(join_schema.children('a')).each(function () {
            if (!$(this).attr("style")) {
                result_head.find('th:eq(' + $(this).index() + ')').remove();
                result_body.find('td:eq(' + $(this).index() + ')').remove();
                $(this).remove();
            }
        });
        result_head.find("th:first").remove();
        join_schema.children().remove();
        $(result_body).each(function () {
            if ($(this).find("td:first span").length) {
                $(this).remove();
            } else {
                $(this).find("td:first").remove();
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
                    for (var i = 1; i < table_header.length; i++) {
                        header.push(table_header.eq(i).text());
                    }
                    original_data[index] = header;
                } else {
                    var row = [];
                    var table_row = $(element).children('td');
                    for (var i = 1; i < table_row.length; i++) {
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
                    $(".alert-popup p:first").html("Error!");
                    $(".alert-popup p:last").html("Failed to Download.");
                }
            });
        } else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p:first").html("Warning!");
            $(".alert-popup p:last").html("Empty Table.");
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
        var totalMs = 6000;

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
        while (current_row.find("td:first span").length) {
            current_row = current_row.prev('tr');
        }
        alter_row.find("td:first").html("<div class='table-expandable-arrow'></div>");
        current_row.find("td:first").html("<span class=\"glyphicon glyphicon-retweet\"></span>");
        current_row.before(alter_row);
        current_row.addClass('bg-sand');
        alter_row.removeClass('bg-sand');
        alter_row.find(".table-expandable-arrow").toggleClass("up");
    });
}

function show_queries() {
    $(".alert-popup p").delegate("a", "click", function () {
        $(".query-popup").addClass("open");
    });
}

var dblp_publ_text = "ID,title,author\n" +
    "0,Active learning in keyword search-based data integration,Zhepeng Yan and Nan Zheng and Zachary G. Ives and Partha Pratim Talukdar and Cong Yu\n" +
    "1,Orthogonal Security with Cipherbase,Arvind Arasu and Spyros Blanas and Ken Eguro and Raghav Kaushik and Donald Kossmann and Ravishankar Ramamurthy and Ramarathnam Venkatesan\n" +
    "2,Transactional Middleware Reconsidered,Philip A. Bernstein\n" +
    "3,Corleone: hands-off crowdsourcing for entity matching,Chaitanya Gokhale and Sanjib Das and AnHai Doan and Jeffrey F. Naughton and Narasimhan Rampalli and Jude W. Shavlik and Xiaojin Zhu\n" +
    "4,Speeding Up Set Intersections in Graph Algorithms using SIMD Instructions,Shuo Han and Lei Zou and Jeffrey Xu Yu\n" +
    "5,Graph Indexing for Shortest-Path Finding over Dynamic Sub-Graphs,Mohamed S. Hassan and Walid G. Aref and Ahmed M. Aly\n" +
    "6,Latch-free Synchronization in Database Systems: Silver Bullet or Fool's Gold?,Jose M. Faleiro and Daniel J. Abadi\n" +
    "7,Looking at Everything in Context,Zachary G. Ives and Zhepeng Yan and Nan Zheng and Brian Litt and Joost B. Wagenaar\n" +
    "8,Spreadsheet Property Detection With Rule-assisted Active Learning,Zhe Chen and Sasha Dadiomov and Richard Wesley and Gang Xiao and Daniel Cory and Michael J. Cafarella and Jock Mackinlay\n" +
    "9,Human-in-the-Loop Challenges for Entity Matching: A Midterm Report,AnHai Doan and Adel Ardalan and Jeffrey R. Ballard and Sanjib Das and Yash Govind and Pradap Konda and Han Li and Sidharth Mudgal and Erik Paulson and Paul Suganthan G. C. and Haojun Zhang\n" +
    "10,Efficient parsing-based search over structured data,Aditya G. Parameswaran and Raghav Kaushik and Arvind Arasu\n" +
    "11,Network Synthesis for Database Processing Units,Andrea Lottarini and Stephen A. Edwards and Kenneth A. Ross and Martha A. Kim\n" +
    "12,Deadlock-free joins in DB-mesh, an asynchronous systolic array accelerator},Bingyi Cao and Kenneth A. Ross and Stephen A. Edwards and Martha A. Kim\n" +
    "13,Efficient Lightweight Compression Alongside Fast Scans,Orestis Polychroniou and Kenneth A. Ross\n" +
    "14,SimMeme: Semantic-Based Meme Search,Maya Ekron and Tova Milo and Brit Youngmann\n" +
    "15,Parallelizing Maximal Clique Enumeration Over Graph Data,Qun Chen and Chao Fang and Zhuo Wang and Bo Suo and Zhanhuai Li and Zachary G. Ives\n" +
    "16,Temporal group linkage and evolution analysis for census data,Victor Christen and Anika Gross and Jeffrey Fisher and Qing Wang and Peter Christen and Erhard Rahm\n" +
    "17,PStorM: Profile Storage and Matching for Feedback-Based Tuning of MapReduce Jobs,Mostafa Ead and Herodotos Herodotou and Ashraf Aboulnaga and Shivnath Babu\n" +
    "18,Extending In-Memory Relational Database Engines with Native Graph Support,Mohamed S. Hassan and Tatiana Kuznetsova and Hyun Chai Jeong and Walid G. Aref and Mohammad Sadoghi\n" +
    "19,Recent Advances in Recommender Systems: Matrices, Bandits, and Blenders,Georgia Koutrika\n" +
    "20,GnosisMiner: Reading Order Recommendations over Document Collections,Georgia Koutrika and Alkis Simitsis and Yannis E. Ioannidis\n" +
    "21,Interactive Rule Refinement for Fraud Detection,Tova Milo and Slava Novgorodov and Wang-Chiew Tan\n" +
    "22,Towards Interactive Debugging of Rule-based Entity Matching,Fatemah Panahi and Wentao Wu and AnHai Doan and Jeffrey F. Naughton\n" +
    "23,Modeling and Exploiting Goal and Action Associations for Recommendations,Dimitra Papadimitriou and Yannis Velegrakis and Georgia Koutrika\n" +
    "24,Interactive Visualization of Large Similarity Graphs and Entity Resolution Clusters,M. Ali Rostami and Alieh Saeedi and Eric Peukert and Erhard Rahm\n" +
    "25,Challenges and innovations in building a product knowledge graph: extended abstract,Xin Luna Dong\n" +
    "26,Cypher-based Graph Pattern Matching in Gradoop,Martin Junghanns and Max Kiessling and Alex Averbuch and Andre Petermann and Erhard Rahm\n" +
    "27,Demonstration of Kite: A Scalable System for Microblogs Data Management,Amr Magdy and Mohamed F. Mokbel\n" +
    "28,Input selection for fast feature engineering,Michael R. Anderson and Michael J. Cafarella\n" +
    "29,Transaction processing on confidential data using cipherbase,Arvind Arasu and Ken Eguro and Manas Joglekar and Raghav Kaushik and Donald Kossmann and Ravi Ramamurthy\n" +
    "30,Querying encrypted data,Arvind Arasu and Ken Eguro and Raghav Kaushik and Ravi Ramamurthy\n" +
    "31,DANCE: Data Cleaning with Constraints and Experts,Ahmad Assadi and Tova Milo and Slava Novgorodov\n" +
    "32,Efficient Exploration of Telco Big Data with Compression and Decaying,Constantinos Costa and Georgios Chatzimilioudis and Demetrios Zeinalipour-Yazti and Mohamed F. Mokbel\n" +
    "33,SPATE: Compacting and Exploring Telco Big Data,Constantinos Costa and Georgios Chatzimilioudis and Demetrios Zeinalipour-Yazti and Mohamed F. Mokbel\n" +
    "34,Data Science Education: We're Missing the Boat, Again,Bill Howe and Michael J. Franklin and Laura M. Haas and Tim Kraska and Jeffrey D. Ullman\n" +
    "35,High variety cloud databases,Shrainik Jain and Dominik Moritz and Bill Howe\n" +
    "36,Scaling up copy detection,Xian Li and Xin Luna Dong and Kenneth B. Lyons and Weiyi Meng and Divesh Srivastava\n" +
    "37,Execution and optimization of continuous windowed aggregation queries,Harold Lim and Shivnath Babu\n" +
    "38,Database System Support for Personalized Recommendation Applications,Mohamed Sarwat and Raha Moraffah and Mohamed F. Mokbel and James L. Avery\n" +
    "39,HAWK: Hardware support for unstructured log processing,Prateek Tandon and Faissal M. Sleiman and Michael J. Cafarella and Thomas F. Wenisch\n" +
    "40,In-Memory Distributed Matrix Computation Processing and Optimization,Yongyang Yu and MingJie Tang and Walid G. Aref and Qutaibah M. Malluhi and Mostafa M. Abbas and Mourad Ouzzani\n" +
    "41,Spell: Streaming Parsing of System Event Logs,Min Du and Feifei Li\n" +
    "42,Holistic Entity Clustering for Linked Data,Markus Nentwig and Anika Gross and Erhard Rahm\n" +
    "43,Graph Mining for Complex Data Analytics,Andre Petermann and Martin Junghanns and Stephan Kemper and Kevin Gomez and Niklas Teichmann and Erhard Rahm\n" +
    "44,Mining Summaries for Knowledge Graph Search,Qi Song and Yinghui Wu and Xin Luna Dong\n" +
    "45,Scalable Privacy-Preserving Linking of Multiple Databases Using Counting Bloom Filters,Dinusha Vatsalan and Peter Christen and Erhard Rahm\n" +
    "46,Top-k Querying of Unknown Values under Order Constraints,Antoine Amarilli and Yael Amsterdamer and Tova Milo and Pierre Senellart\n" +
    "47,Oblivious Query Processing,Arvind Arasu and Raghav Kaushik\n" +
    "48,Expressive Power of Entity-Linking Frameworks,Douglas Burdick and Ronald Fagin and Phokion G. Kolaitis and Lucian Popa and Wang Chiew Tan\n" +
    "49,The Smart Crowd - Learning from the Ones Who Know (Invited Talk),Tova Milo\n" +
    "50,m-tables: Representing Missing Data,Bruhathi Sundarmurthy and Paraschos Koutris and Willis Lang and Jeffrey F. Naughton and Val Tannen\n" +
    "51,Differentially Private Learning of Undirected Graphical Models Using Collective Graphical Models,Garrett Bernstein and Ryan McKenna and Tao Sun and Daniel Sheldon and Michael Hay and Gerome Miklau\n" +
    "52,Massively-Parallel Lossless Data Decompression,Evangelia A. Sitaridi and Rene Muller and Tim Kaldewey and Guy M. Lohman and Kenneth A. Ross\n" +
    "53,TimeMachine: Timeline Generation for Knowledge-Base Entities,Tim Althoff and Xin Luna Dong and Kevin Murphy and Safa Alai and Van Dang and Wei Zhang\n" +
    "54,A Clustering-Based Framework to Control Block Sizes for Entity Resolution,Jeffrey Fisher and Peter Christen and Qing Wang and Erhard Rahm\n" +
    "55,Scalable Pattern Matching over Compressed Graphs via Dedensification,Antonio Maccioni and Daniel J. Abadi\n" +
    "56,Compass: Spatio Temporal Sentiment Analysis of {US} Election What Twitter Says!,Debjyoti Paul and Feifei Li and Murali Krishna Teja and Xin Yu and Richie Frost\n" +
    "57,DQBarge: Improving Data-Quality Tradeoffs in Large-Scale Internet Services,Michael Chow and Kaushik Veeraraghavan and Michael J. Cafarella and Jason Flinn\n" +
    "58,Fast and Concurrent RDF Queries with RDMA-Based Distributed Graph Exploration,Jiaxin Shi and Youyang Yao and Rong Chen and Haibo Chen and Feifei Li\n" +
    "59,StreamQRE: modular specification and efficient evaluation of quantitative queries over streaming data,Konstantinos Mamouras and Mukund Raghothaman and Rajeev Alur and Zachary G. Ives and Sanjeev Khanna\n" +
    "60,High-Level Why-Not Explanations using Ontologies,Balder ten Cate and Cristina Civili and Evgeny Sherkhonov and Wang-Chiew Tan\n" +
    "61,Active Learning of GAV Schema Mappings,Balder ten Cate and Phokion G. Kolaitis and Kun Qian and Wang-Chiew Tan\n" +
    "62,Data Citation: A Computational Challenge,Susan B. Davidson and Peter Buneman and Daniel Deutch and Tova Milo and Gianmaria Silvello\n" +
    "63,Data Integration: After the Teenage Years,Behzad Golshan and Alon Y. Halevy and George A. Mihaila and Wang-Chiew Tan\n" +
    "64,A Reuse-Based Annotation Approach for Medical Documents,Victor Christen and Anika Gross and Erhard Rahm\n" +
    "65,A Course on Programming and Problem Solving,Swapneel Sheth and Christian Murphy and Kenneth A. Ross and Dennis E. Shasha\n" +
    "66,Bolt-on Differential Privacy for Scalable Stochastic Gradient Descent-based Analytics,Xi Wu and Fengan Li and Arun Kumar and Kamalika Chaudhuri and Somesh Jha and Jeffrey F. Naughton\n" +
    "67,Wander Join: Online Aggregation via Random Walks,Feifei Li and Bin Wu and Ke Yi and Zhuoyue Zhao\n" +
    "68,Secure database-as-a-service with Cipherbase,Arvind Arasu and Spyros Blanas and Ken Eguro and Manas Joglekar and Raghav Kaushik and Donald Kossmann and Ravishankar Ramamurthy and Prasang Upadhyaya and Ramarathnam Venkatesan\n" +
    "69,Concerto: A High Concurrency Key-Value Store with Integrity,Arvind Arasu and Ken Eguro and Raghav Kaushik and Donald Kossmann and Pingfan Meng and Vineet Pandey and Ravi Ramamurthy\n" +
    "70,Querying encrypted data,Arvind Arasu and Ken Eguro and Raghav Kaushik and Ravishankar Ramamurthy\n" +
    "71,Data generation using declarative constraints,Arvind Arasu and Raghav Kaushik and Jian Li\n" +
    "72,Query-Oriented Data Cleaning with Oracles,Moria Bergman and Tova Milo and Slava Novgorodov and Wang Chiew Tan\n" +
    "73,Rethinking eventual consistency,Philip A. Bernstein and Sudipto Das\n" +
    "74,Optimizing Optimistic Concurrency Control for Tree-Structured, Log-Structured Databases,Philip A. Bernstein and Sudipto Das and Bailu Ding and Markus Pilman\n" +
    "75,Incremental mapping compilation in an object-to-relational mapping system,Philip A. Bernstein and Marie Jacob and Jorge Perez and Guillem Rull and James F. Terwilliger\n" +
    "76,Privacy Preserving Subgraph Matching on Large Graphs in Cloud,Zhao Chang and Lei Zou and Feifei Li\n" +
    "77,Scout: A GPU-Aware System for Interactive Spatio-temporal Data Visualization,Harshada Chavan and Mohamed F. Mokbel\n" +
    "78,Modeling entity evolution for temporal record matching,Yueh-Hsuan Chiang and AnHai Doan and Jeffrey F. Naughton\n" +
    "79,Why Big Data Industrial Systems Need Rules and What We Can Do About It,Paul Suganthan G. C. and Chong Sun and Krishna Gayatri K. and Haojun Zhang and Frank Yang and Narasimhan Rampalli and Shishir Prasad and Esteban Arcaute and Ganesh Krishnan and Rohit Deep and Vijay Raghavendra and AnHai Doan\n" +
    "80,Falcon: Scaling Up Hands-Off Crowdsourced Entity Matching to Build Cloud Services,Sanjib Das and Paul Suganthan G. C. and AnHai Doan and Jeffrey F. Naughton and Ganesh Krishnan and Rohit Deep and Esteban Arcaute and Vijay Raghavendra and Youngchoon Park\n" +
    "81,Automatic Generation of Normalized Relational Schemas from Nested Key-Value Data,Michael DiScala and Daniel J. Abadi\n" +
    "82,Human-in-the-Loop Data Analysis: A Personal Perspective,AnHai Doan\n" +
    "83,SIMD-accelerated regular expression matching,Evangelia A. Sitaridi and Orestis Polychroniou and Kenneth A. Ross\n" +
    "84,Data Integration and Machine Learning: A Natural Synergy,Xin Luna Dong and Theodoros Rekatsinas\n" +
    "85,Knowledge Curation and Knowledge Fusion: Challenges, Models and Applications,Xin Luna Dong and Divesh Srivastava\n" +
    "86,Top-k Sorting Under Partial Order Information,Eyal Dushkin and Tova Milo\n" +
    "87,IoT-Detective: Analyzing IoT Data Under Differential Privacy,Sameera Ghayyur and Yan Chen and Roberto Yus and Ashwin Machanavajjhala and Michael Hay and Gerome Miklau and Sharad Mehrotra\n" +
    "88,Indexing in an Actor-Oriented Database,Philip A. Bernstein and Mohammad Dashti and Tim Kiefer and David Maier\n" +
    "89,A Model for Fine-Grained Data Citation,Susan B. Davidson and Daniel Deutch and Tova Milo and Gianmaria Silvello\n" +
    "90,What is Our Agenda for Data Science?,AnHai Doan\n" +
    "91,GRFusion: Graphs as First-Class Citizens in Main-Memory Relational Database Systems,Mohamed S. Hassan and Tatiana Kuznetsova and Hyun Chai Jeong and Walid G. Aref and Mohammad Sadoghi\n" +
    "92,Principled Evaluation of Differentially Private Algorithms using DPBench,Michael Hay and Ashwin Machanavajjhala and Gerome Miklau and Yan Chen and Dan Zhang\n" +
    "93,Exploring Privacy-Accuracy Tradeoffs using DPComp,Michael Hay and Ashwin Machanavajjhala and Gerome Miklau and Yan Chen and Dan Zhang and George Bissias\n" +
    "94,LaraDB: A Minimalist Kernel for Linear and Relational Algebra Computation,Dylan Hutchison and Bill Howe and Dan Suciu\n" +
    "95,SQLShare: Results from a Multi-Year SQL-as-a-Service Experiment,Shrainik Jain and Dominik Moritz and Daniel Halperin and Bill Howe and Ed Lazowska\n" +
    "96,Foofah: Transforming Data By Example,Zhongjun Jin and Michael R. Anderson and Michael J. Cafarella and H. V. Jagadish\n" +
    "97,Foofah: A Programming-By-Example System for Synthesizing Data Transformation Programs,Zhongjun Jin and Michael R. Anderson and Michael J. Cafarella and H. V. Jagadish\n" +
    "98,Beaver: Towards a Declarative Schema Mapping,Zhongjun Jin and Christopher Baik and Michael J. Cafarella and H. V. Jagadish\n" +
    "99,Analyzing extended property graphs with Apache Flink,Martin Junghanns and Andre Petermann and Niklas Teichmann and Kevin Gomez and Erhard Rahm\n" +
    "100,iQCAR: A Demonstration of an Inter-Query Contention Analyzer for Cluster Computing Frameworks,Prajakta Kalmegh and Harrison Lundberg and Frederick Xu and Shivnath Babu and Sudeepa Roy\n" +
    "101,DIAS: Differentially Private Interactive Algorithm Selection using Pythia,Ios Kotsogiannis and Michael Hay and Ashwin Machanavajjhala and Gerome Miklau and Margaret Orr\n" +
    "102,Pythia: Data Dependent Differentially Private Algorithm Selection,Ios Kotsogiannis and Ashwin Machanavajjhala and Michael Hay and Gerome Miklau\n" +
    "103,Modern Recommender Systems: from Computing Matrices to Thinking with Neurons,Georgia Koutrika\n" +
    "104,To Join or Not to Join?: Thinking Twice about Joins before Feature Selection,Arun Kumar and Jeffrey F. Naughton and Jignesh M. Patel and Xiaojin Zhu\n" +
    "105,ROBUS: Fair Cache Allocation for Data-parallel Workloads,Mayuresh Kunjir and Brandon Fain and Kamesh Munagala and Shivnath Babu\n" +
    "106,Operator and Query Progress Estimation in Microsoft SQL Server Live Query Statistics,Kukjin Lee and Arnd Christian Konig and Vivek R. Narasayya and Bolin Ding and Surajit Chaudhuri and Brent Ellwein and Alexey Eksarevskiy and Manbeen Kohli and Jacob Wyant and Praneeta Prakash and Rimma V. Nehme and Jiexing Li and Jeffrey F. Naughton\n" +
    "107,Linking Temporal Records for Profiling Entities,Furong Li and Mong-Li Lee and Wynne Hsu and Wang-Chiew Tan\n" +
    "108,Execution and optimization of continuous queries with cyclops,Harold Lim and Shivnath Babu\n" +
    "109,CourseNavigator: interactive learning path exploration,Zhan Li and Olga Papaemmanouil and Georgia Koutrika\n" +
    "110,Skyline Community Search in Multi-valued Networks,Rong-Hua Li and Lu Qin and Fanghua Ye and Jeffrey Xu Yu and Xiaokui Xiao and Nong Xiao and Zibin Zheng\n" +
    "111,Enabling Incremental Query Re-Optimization,Mengmeng Liu and Zachary G. Ives and Boon Thau Loo\n" +
    "112,Wander Join: Online Aggregation for Joins,Feifei Li and Bin Wu and Ke Yi and Zhuoyue Zhao\n" +
    "113,SPARTI: Scalable RDF Data Management Using Query-Centric Semantic Partitioning,Amgad Madkour and Walid G. Aref and Ahmed M. Aly\n" +
    "114,TrueWeb: A Proposal for Scalable Semantically-Guided Data Management and Truth Finding in Heterogeneous Web Sources,Amgad Madkour and Walid G. Aref and Sunil Prabhakar and Mohamed H. Ali and Siarhei Bykau\n" +
    "115,Query Processing Techniques for Big Spatial-Keyword Data,Ahmed R. Mahmood and Walid G. Aref\n" +
    "116,Deep Reinforcement-Learning Framework for Exploratory Data Analysis,Tova Milo and Amit Somech\n" +
    "117,Deep Learning for Entity Matching: A Design Space Exploration,Sidharth Mudgal and Han Li and Theodoros Rekatsinas and AnHai Doan and Youngchoon Park and Ganesh Krishnan and Rohit Deep and Esteban Arcaute and Vijay Raghavendra\n" +
    "118,Database Learning: Toward a Database that Becomes Smarter Every Time,Yongjoo Park and Ahmad Shahab Tajik and Michael J. Cafarella and Barzan Mozafari\n" +
    "119,Persistent Bloom Filter: Membership Testing for the Entire History,Yanqing Peng and Jinwei Guo and Feifei Li and Weining Qian and Aoying Zhou\n" +
    "120,Rethinking SIMD Vectorization for In-Memory Databases,Orestis Polychroniou and Arun Raghavan and Kenneth A. Ross\n" +
    "121,SourceSight: Enabling Effective Source Selection,Theodoros Rekatsinas and Amol Deshpande and Xin Luna Dong and Lise Getoor and Divesh Srivastava\n" +
    "122,Low-Overhead Asynchronous Checkpointing in Main-Memory Database Systems,Kun Ren and Thaddeus Diamond and Daniel J. Abadi and Alexander Thomson\n" +
    "123,Design Principles for Scaling Multi-core OLTP Under High Contention,Kun Ren and Jose M. Faleiro and Daniel J. Abadi\n" +
    "124,Query containment in entity SQL,Guillem Rull and Philip A. Bernstein and Ivo Garcia dos Santos and Yannis Katsis and Sergey Melnik and Ernest Teniente\n" +
    "125,A Demonstration of Sya: A Spatial Probabilistic Knowledge Base Construction System,Ibrahim Sabek and Mashaal Musleh and Mohamed F. Mokbel\n" +
    "126,Graph Analytics Through Fine-Grained Parallelism,Zechao Shang and Feifei Li and Jeffrey Xu Yu and Zhiwei Zhang and Hong Cheng\n" +
    "127,RushMon: Real-time Isolation Anomalies Monitoring,Zechao Shang and Jeffrey Xu Yu and Aaron J. Elmore\n" +
    "128,Special Session: A Technical Research Agenda in Data Ethics and Responsible Data Management,Julia Stoyanovich and Bill Howe and H. V. Jagadish\n" +
    "129,Exploiting Data Partitioning To Provide Approximate Results,Bruhathi Sundarmurthy and Paraschos Koutris and Jeffrey F. Naughton\n" +
    "130,Data X-Ray: A Diagnostic Tool for Data Errors,Xiaolan Wang and Xin Luna Dong and Alexandra Meliou\n" +
    "131,Matrix Sketching Over Sliding Windows,Zhewei Wei and Xuancheng Liu and Feifei Li and Shuo Shang and Xiaoyong Du and Ji-Rong Wen\n" +
    "132,Sampling-Based Query Re-Optimization,Wentao Wu and Jeffrey F. Naughton and Harneet Singh\n" +
    "133,Simba: Efficient In-Memory Spatial Analytics,Dong Xie and Feifei Li and Bin Yao and Gefei Li and Liang Zhou and Minyi Guo\n" +
    "134,A Nutritional Label for Rankings,Ke Yang and Julia Stoyanovich and Abolfazl Asudeh and Bill Howe and H. V. Jagadish and Gerome Miklau\n" +
    "135,Extracting Databases from Dark Data with DeepDive,Ce Zhang and Jaeho Shin and Christopher Re and Michael J. Cafarella and Feng Niu\n" +
    "136,EKTELO: A Framework for Defining Differentially-Private Computations,Dan Zhang and Ryan McKenna and Ios Kotsogiannis and Michael Hay and Ashwin Machanavajjhala and Gerome Miklau\n" +
    "137,Random Sampling over Joins Revisited,Zhuoyue Zhao and Robert Christensen and Feifei Li and Xiao Hu and Ke Yi\n" +
    "138,Deep Mapping of the Visual Literature,Bill Howe and Po-Shen Lee and Maxim Grechkin and Sean T. Yang and Jevin D. West\n" +
    "139,VizioMetrix: A Platform for Analyzing the Visual Information in Big Scholarly Data,Po-Shen Lee and Jevin D. West and Bill Howe\n" +
    "140,Concept Expansion Using Web Tables,Chi Wang and Kaushik Chakrabarti and Yeye He and Kris Ganjam and Zhimin Chen and Philip A. Bernstein\n" +
    "141,Parallelizing maximal clique and k-plex enumeration over graph data,Zhuo Wang and Qun Chen and Boyi Hou and Bo Suo and Zhanhuai Li and Wei Pan and Zachary G. Ives\n" +
    "142,The Q100 Database Processing Unit,Lisa Wu and Andrea Lottarini and Timothy K. Paine and Martha A. Kim and Kenneth A. Ross\n" +
    "143,Tutorial: SQL-on-Hadoop Systems,Daniel Abadi and Shivnath Babu and Fatma Ozcan and Ippokratis Pandis\n" +
    "144,A Demonstration of ST-Hadoop: A MapReduce Framework for Big Spatio-temporal Data,Louai Alarabi and Mohamed F. Mokbel\n" +
    "145,A Declarative Query Processing System for Nowcasting,Dolan Antenucci and Michael R. Anderson and Michael J. Cafarella\n" +
    "146,DataSynth: Generating Synthetic Data using Declarative Constraints,Arvind Arasu and Raghav Kaushik and Jian Li\n" +
    "147,Front Matter,Shivnath Babu\n" +
    "148,QOCO: A Query Oriented Data Cleaning System with Oracles,Moria Bergman and Tova Milo and Slava Novgorodov and Wang-Chiew Tan\n" +
    "149,Generic Schema Matching, Ten Years Later,Philip A. Bernstein and Jayant Madhavan and Erhard Rahm\n" +
    "150,Oblivious RAM: A Dissection and Experimental Evaluation,Zhao Chang and Dong Xie and Feifei Li\n" +
    "151,Towards Linear Algebra over Normalized Data,Lingjiao Chen and Arun Kumar and Jeffrey F. Naughton and Jignesh M. Patel\n" +
    "152,Annotating Database Schemas to Help Enterprise Search,Eli Cortez and Philip A. Bernstein and Yeye He and Lev Novik\n" +
    "153,A Time Machine for Information: Looking Back to Look Forward,Xin Luna Dong and Wang-Chiew Tan\n" +
    "154,The Era of Big Spatial Data,Ahmed Eldawy and Mohamed F. Mokbel\n" +
    "155,Rethinking serializable multiversion concurrency control,Jose M. Faleiro and Daniel J. Abadi\n" +
    "156,High Performance Transactions via Early Write Visibility,Jose M. Faleiro and Daniel Abadi and Joseph M. Hellerstein\n" +
    "157,LEOPARD: Lightweight Edge-Oriented Partitioning and Replication for Dynamic Graphs,Jiewen Huang and Daniel Abadi\n" +
    "158,Cumulon: Matrix-Based Data Analytics in the Cloud with Spot Instances,Botong Huang and Nicholas W. D. Jarrett and Shivnath Babu and Sayan Mukherjee and Jun Yang\n" +
    "159,A Demonstration of Stella: A Crowdsourcing-Based Geotagging Framework,Christopher Jonathan and Mohamed F. Mokbel\n" +
    "160,Magellan: Toward Building Entity Matching Management Systems,Pradap Konda and Sanjib Das and Paul Suganthan G. C. and AnHai Doan and Adel Ardalan and Jeffrey R. Ballard and Han Li and Fatemah Panahi and Haojun Zhang and Jeffrey F. Naughton and Shishir Prasad and Ganesh Krishnan and Rohit Deep and Vijay Raghavendra\n" +
    "161,Magellan: Toward Building Entity Matching Management Systems over Data Science Stacks,Pradap Konda and Sanjib Das and Paul Suganthan G. C. and AnHai Doan and Adel Ardalan and Jeffrey R. Ballard and Han Li and Fatemah Panahi and Haojun Zhang and Jeffrey F. Naughton and Shishir Prasad and Ganesh Krishnan and Rohit Deep and Vijay Raghavendra\n" +
    "162,Thoth in Action: Memory Management in Modern Data Analytics,Mayuresh Kunjir and Shivnath Babu\n" +
    "163,Thoth: Towards Managing a Multi-System Cluster,Mayuresh Kunjir and Prajakta Kalmegh and Shivnath Babu\n" +
    "164,Knowledge Verification for LongTail Verticals,Furong Li and Xin Luna Dong and Anno Langen and Yang Li\n" +
    "165,7 Secrets That My Mother Didn't Tell Me,Tova Milo\n" +
    "166,Rudolf: Interactive Rule Refinement System for Fraud Detection,Tova Milo and Slava Novgorodov and Wang-Chiew Tan\n" +
    "167,Location Data Management: A Tale of Two Systems and the Next Destination!,Mohamed F. Mokbel and Chi-Yin Chow and Walid G. Aref\n" +
    "168,Graph-based Data Integration and Business Intelligence with BIIIG,Andre Petermann and Martin Junghanns and Robert Muller and Erhard Rahm\n" +
    "169,Tempo: Robust and Self-Tuning Resource Management in Multi-tenant Parallel Databases,Zilong Tan and Shivnath Babu\n" +
    "170,LocationSpark: A Distributed In-Memory Data Management System for Big Spatial Data,MingJie Tang and Yongyang Yu and Qutaibah M. Malluhi and Mourad Ouzzani and Walid G. Aref\n" +
    "171,Lifting the Haze off the Cloud: A Consumer-Centric Market for Database Computation in the Cloud,Yue Wang and Alexandra Meliou and Gerome Miklau\n" +
    "172,RC-Index: Diversifying Answers to Range Queries,Yue Wang and Alexandra Meliou and Gerome Miklau\n" +
    "173,Distributed Trajectory Similarity Search,Dong Xie and Feifei Li and Jeff M. Phillips\n" +
    "174,Actively Soliciting Feedback for Query Answers in Keyword Search-Based Data Integration,Zhepeng Yan and Nan Zheng and Zachary G. Ives and Partha Pratim Talukdar and Cong Yu\n" +
    "175,Wander Join and XDB: Online Aggregation via Random Walks,Feifei Li and Bin Wu and Ke Yi and Zhuoyue Zhao\n" +
    "176,PeGaSus: Data-Adaptive Differentially Private Stream Processing,Yan Chen and Ashwin Machanavajjhala and Michael Hay and Gerome Miklau\n" +
    "177,Accelerating reachability query processing based on DAG reduction,Junfeng Zhou and Jeffrey Xu Yu and Na Li and Hao Wei and Ziyang Chen and Xian Tang\n" +
    "178,Preface to the special issue on big data search and mining,Kai Zheng and Feifei Li and Kyuseok Shim\n" +
    "179,Report on the Second International Workshop on Exploratory Search in Databases and the Web (ExploreDB 2015),Georgia Koutrika and Laks V. S. Lakshmanan and Mirek Riedewald and Mohamed A. Sharaf and Kostas Stefanidis\n" +
    "180,Reachability querying: an independent permutation labeling approach,Hao Wei and Jeffrey Xu Yu and Can Lu and Ruoming Jin\n" +
    "181,Report on the Third International Workshop on Exploratory Search in Databases and the Web (ExploreDB 2016),Senjuti Basu Roy and Kostas Stefanidis and Georgia Koutrika and Laks V. S. Lakshmanan and Mirek Riedewald\n" +
    "182,Data Quality: The Role of Empiricism,Shazia Wasim Sadiq and Tamraparni Dasu and Xin Luna Dong and Juliana Freire and Ihab F. Ilyas and Sebastian Link and Miller J. Miller and Felix Naumann and Xiaofang Zhou and Divesh Srivastava\n" +
    "183,Scalable and Efficient Flow-Based Community Detection for Large-Scale Graph Analysis,Seung-Hee Bae and Daniel Halperin and Jevin D. West and Martin Rosvall and Bill Howe\n" +
    "184,Venus: Scalable Real-Time Spatial Queries on Microblogs with Adaptive Load Shedding,Amr Magdy and Mohamed F. Mokbel and Sameh Elnikety and Suman Nath and Yuxiong He\n" +
    "185,Mapping XML to a Wide Sparse Table,Liang Jeff Chen and Philip A. Bernstein and Peter Carlin and Dimitrije Filipovic and Michael Rys and Nikita Shamgunov and James F. Terwilliger and Milos Todic and Sasa Tomasevic and Dragan Tomic\n" +
    "186,Answering Natural Language Questions by Subgraph Matching over Knowledge Graphs,Sen Hu and Lei Zou and Jeffrey Xu Yu and Haixun Wang and Dongyan Zhao\n" +
    "187,To Meet or Not to Meet: Finding the Shortest Paths in Road Networks,Weihuang Huang and Yikai Zhang and Zechao Shang and Jeffrey Xu Yu\n" +
    "188,Exploring Triangle-Free Dense Structures,Can Lu and Jeffrey Xu Yu and Hao Wei\n" +
    "189,Finding Related Forum Posts through Content Similarity over Intention-Based Segmentation,Dimitra Papadimitriou and Georgia Koutrika and Yannis Velegrakis and John Mylopoulos\n" +
    "190,UniWalk: Unidirectional Random Walk Based Scalable SimRank Computation over Large Graph,Junshuai Song and Xiongcai Luo and Jun Gao and Chang Zhou and Hu Wei and Jeffrey Xu Yu\n" +
    "191,Similarity Group-by Operators for Multi-Dimensional Relational Data,MingJie Tang and Ruby Y. Tahboub and Walid G. Aref and Mikhail J. Atallah and Qutaibah M. Malluhi and Mourad Ouzzani and Yasin N. Silva\n" +
    "192,String Similarity Search: A Hash-Based Approach,Hao Wei and Jeffrey Xu Yu and Can Lu\n" +
    "193,Approximation Algorithms for Schema-Mapping Discovery from Data Examples,Balder ten Cate and Phokion G. Kolaitis and Kun Qian and Wang-Chiew Tan\n" +
    "194,The Goal Behind the Action: Toward Goal-Aware Systems and Applications,Dimitra Papadimitriou and Georgia Koutrika and John Mylopoulos and Yannis Velegrakis\n" +
    "195,A Study of Web Print: What People Print in the Digital Era,Georgia Koutrika and Qian Lin\n" +
    "196,Resource bricolage and resource selection for parallel database systems,Jiexing Li and Jeffrey F. Naughton and Rimma V. Nehme\n" +
    "197,Exact and approximate flexible aggregate similarity search,Feifei Li and Ke Yi and Yufei Tao and Bin Yao and Yang Li and Dong Xie and Min Wang\n" +
    "198,VLL: a lock manager redesign for main memory database systems,Kun Ren and Alexander Thomson and Daniel J. Abadi\n" +
    "199,Exploiting SSDs in operational multiversion databases,Mohammad Sadoghi and Kenneth A. Ross and Mustafa Canim and Bishwaranjan Bhattacharjee\n" +
    "200,GPU-accelerated string matching for database applications,Evangelia A. Sitaridi and Kenneth A. Ross\n";

var yelp_search_text_AZ = "name,full_address\n" +
    "Grand Canyon University,3300 W Camelback Rd Phoenix, AZ 85017\n" +
    "Princess Pro Nail,13216 N 7th St Phoenix, AZ 85022\n" +
    "LaBella Pizzeria and Restaurant,6505 N 7th St Phoenix, AZ 85014\n" +
    "Pizzeria Bianco,4743 N 20th St Phoenix, AZ 85016\n" +
    "Mindy Nails,18413 N Cave Creek Rd Phoenix, AZ 85032\n" +
    "Automatic Transmission Experts,4422 N 7th Ave Phoenix, AZ 85013\n" +
    "US Egg,2957 W Bell Rd Phoenix, AZ 85053\n" +
    "D & W Auto Service,3039 E Thomas Rd Phoenix, AZ 85008\n" +
    "Polished Nail Spa,10243 N Scottsdale Rd Ste 1 Scottsdale, AZ 85253\n" +
    "Sun Valley Stereo,2809 E Thomas Rd Phoenix, AZ 85016\n" +
    "Starbucks,3110 N Central Ave Ste 185 Phoenix, AZ 85012\n" +
    "Network Alignment & Brakes,12639 N Cave Creek Rd Phoenix, AZ 85022\n" +
    "Johnston's Automotive,3445 N 24th St Phoenix, AZ 85016\n" +
    "Wild Tuna Sushi and Spirits,805 E Thunderbird Rd Phoenix, AZ 85022\n" +
    "602 Auto Sports,331 N 16th St Phoenix, AZ 85006\n" +
    "Steak 44,5101 N 44th St Phoenix, AZ 85018\n" +
    "China Village,2710 E Indian School Rd Phoenix, AZ 85016\n" +
    "World Class Car Wash,3232 E McDowell Rd Phoenix, AZ 85008\n" +
    "Base Pizzeria,3115 E Lincoln Dr Phoenix, AZ 85016\n" +
    "Chic Nails,4290 E Indian School Rd Phoenix, AZ 85018\n" +
    "Los Compadres Mexican Food,4414 N 7th Ave Phoenix, AZ 85013\n" +
    "Nails Trend,515 N 35th Ave Ste 127 Phoenix, AZ 85009\n" +
    "Casa Filipina Bakeshop & Restaurant,3531 W Thunderbird Rd Phoenix, AZ 85053\n" +
    "Sole Serenity,7024 E Osborn Rd Ste C-5 Scottsdale, AZ 85251\n" +
    "Tryst Cafe,21050 N Tatum Blvd Phoenix, AZ 85050\n" +
    "Superior Nails,2620 83rd Ave Ste 106 Phoenix, AZ 85043\n" +
    "Mrs White's Golden Rule Cafe,808 E Jefferson St Phoenix, AZ 85034\n" +
    "Zookz Sandwiches,100 E Camelback Rd Phoenix, AZ 85012\n" +
    "Starbucks,125 N 2nd St Phoenix, AZ 85004\n" +
    "3D Nails and Spa,9620 N Metro Pkwy W Ste 25 Phoenix, AZ 85051\n" +
    "Mad Hatter Mufflers & Brakes,525 E Dunlap Ave Phoenix, AZ 85020\n" +
    "Tammy's La Nails,731 E Union Hills Dr Phoenix, AZ 85024\n" +
    "Jack's Auto Alignment & Brakes,2902 E Thomas Rd Phoenix, AZ 85016\n" +
    "WY Market,1819 W Buckeye Rd Phoenix, AZ 85007\n" +
    "Exclusive Nails,8808 N Central Ave Ste 258 Phoenix, AZ 85020\n" +
    "Kona 13 Coffee & Tea,1845 E University Dr Tempe, AZ 85281\n" +
    "Welcome Chicken + Donuts,1535 E Buckeye Rd Phoenix, AZ 85034\n" +
    "Dunkin' Donuts,4130 E Thomas Rd Phoenix, AZ 85018\n" +
    "Pizza People Pub,1326 N Central Ave Phoenix, AZ 85004\n" +
    "US Nails,5243 W Indian School Rd Phoenix, AZ 85031\n" +
    "Above and Beyond Nails,4707 E Bell Rd Ste 2 Phoenix, AZ 85032\n" +
    "Donut Parlor,1245 W Elliot Rd Ste 103 Tempe, AZ 85284\n" +
    "Munich Motors,4809 N 7th Ave Phoenix, AZ 85013\n" +
    "Phoenix Public Market,14 E Pierce St Phoenix, AZ 85004\n" +
    "Xtreme Bean Coffee,1707 E Southern Ave Tempe, AZ 85282\n" +
    "Sweet Sunshine Nails,6990 E Shea Blvd Scottsdale, AZ 85254\n" +
    "RBG Bar & Grill,427 N 44th St Phoenix, AZ 85008\n" +
    "Smooth Brew Coffee,1447 E Mcdowell Rd Phoenix, AZ 85006\n" +
    "Capitol Collision,5154 N 27th Ave Phoenix, AZ 85017\n" +
    "The Auto Shop,901 N Central Ave Phoenix, AZ 85004\n" +
    "Ranch House Grille,5618 E Thomas Rd Phoenix, AZ 85018\n" +
    "Kream Coffee,5102 N Central Ave Phoenix, AZ 85012\n" +
    "Elevens' Paint & Fiber,4131 E University Dr Phoenix, AZ 85034\n" +
    "Fajitas A Sizzlin Celebration,9841 N Black Canyon Hwy Phoenix, AZ 85021\n" +
    "Community Tire Pros & Auto Repair,123 E Durango St Phoenix, AZ 85004\n" +
    "Pappadeaux Seafood Kitchen,11051 N Black Canyon Hwy Phoenix, AZ 85029\n" +
    "Rusconi's American Kitchen,10637 N Tatum Blvd Phoenix, AZ 85028\n" +
    "Mine Nails,7827 N 19th Ave Phoenix, AZ 85021\n" +
    "Tag The Auto Guy,1401 E Camelback Rd Phoenix, AZ 85014\n" +
    "La Pinata,5521 N 7th Ave Phoenix, AZ 85013\n" +
    "Johnnie's Chicago Style Pizza,15443 N Cave Creek Rd Phoenix, AZ 85034\n" +
    "Mel's Diner,1747 Grand Ave Phoenix, AZ 85007\n" +
    "Independent Automotive Services,3800 N 7th St Phoenix, AZ 85014\n" +
    "Saba's Mediterranean Kitchen,4747 E Bell Rd Phoenix, AZ 85032\n" +
    "Ingo's Tasty Food,4502 N 40th St Phoenix, AZ 85018\n" +
    "Cartel Coffee Lab,7124 E 5th Ave Scottsdale, AZ 85251\n" +
    "Spinato's Pizzeria,4848 E Chandler Blvd Phoenix, AZ 85044\n" +
    "Los Reyes De La Torta,9230 N 7th St Phoenix, AZ 85020\n" +
    "We Buy Cars For Cash,2942 N 24th St Ste 114 Phoenix, AZ 85016\n" +
    "Vovomeena,1515 N 7th Ave Ste 170 Phoenix, AZ 85003\n" +
    "Kt's Nails & Spa,7607 E Mcdowell Rd Ste 104 Scottsdale, AZ 85257\n";

var yelp_search_text_Toronto = "name,full_address\n" +
    "Tropical Thai Cuisine,993 Kingston Road Toronto ON M4E 1T3\n" +
    "Thai On Yonge,370 Yonge Street Toronto ON M5B 1S5\n" +
    "Thai Chef Cuisine,233 Roncesvalles Avenue Toronto ON M6R 2L6\n" +
    "Thai Express,150 King W Toronto ON M5X 2A2\n" +
    "Thai Lime,1551 Dupont Street Toronto ON M6P 3S6\n" +
    "Thai Room,243 Carlton Street Toronto ON M5A 2L2\n" +
    "Hungary Thai Bar & Eatery Restaurant,196 Augusta Avenue Toronto ON M5T 2L6\n" +
    "Thai Everest,1656 Victoria Park Avenue Toronto ON M1R 1P2\n" +
    "Thai Express,21 St Clair Ave E Toronto ON M4T 1L8\n" +
    "The Thai Grill,961 Eglinton Ave W Toronto ON M6C 2C4\n" +
    "Flip Toss & Thai Kitchen,141 Harbord St Toronto ON M5S 1H1\n" +
    "QQ Thai Ice Cream,3278 Midland Avenue Unit D117 Toronto ON M1V\n" +
    "California Thai,200 Wellington Street W Toronto ON M5V 3G2\n" +
    "Thai Fantasy,578 Yonge Street Toronto ON M4Y 1Z3\n" +
    "King Thai Massage Health Care Centre,15 Saint Clair Avenue W 2nd Floor Toronto ON M4V\n" +
    "Ruby Thai,1 First Canadian Place Mezzanine Level Toronto ON M5X 1C1\n" +
    "Thai One On,2070 Avenue Road Toronto ON M5M 4A4\n" +
    "Metta Thai Massage,65 Bellwoods Ave Unit 3 Toronto ON M6J 3N4\n" +
    "Little Coxwell Vietnamese & Thai Cuisine,986 Coxwell Avenue Toronto ON M4C 3G5\n" +
    "Simply Thai Cuisine,2253 Bloor St W Toronto ON M6S 1N8\n" +
    "Thai Basil,467 Bloor Street W Toronto ON M5S 1X9\n" +
    "Golden Pineapple Viet Thai Cuisine,254 Spadina Avenue Toronto ON M5T\n" +
    "Basil Thai Kitchen,2326 Danforth Ave Toronto ON M4C 1K7\n" +
    "Pattaya Thai Kitchen,2326 Queen Street E Toronto ON M4E 1G9\n" +
    "Mong-Kut Thai,471 Danforth Ave Toronto ON M4K 1P1\n" +
    "Pho 88 Viet Thai Cuisine,Milliken Wellss Shopping Plaza 250 Alton Tower Circle Suite C6 Toronto ON M1R\n" +
    "Just Thai,534 Church Street Toronto ON M4Y 2E1\n" +
    "Thai One On,791 King Street W Toronto ON M5V 1N4\n" +
    "Kub Khao Thai Eatery,3561 Sheppard E Toronto ON M1T 3K7\n" +
    "Sukho Thai,52 Wellington Street E Toronto ON M5E 1C9\n" +
    "Lee's Thai Spring Roll,1512 Queen Street W Toronto ON M6R 1A4\n" +
    "Thai Express,32 Weston Road Toronto ON M6N 5H4\n" +
    "Thai Take-out & Catering,2480 Eglinton Ave E Toronto ON M1K 2R4\n" +
    "Subway,195 College Street Toronto ON M5T 1P9\n" +
    "Subway,607 Yonge Street Toronto ON M4Y 1Z5\n" +
    "Subway,717 Bay Street Toronto ON M5G 2J9\n" +
    "Subway,331 Carlaw Avenue Unit 103 Toronto ON M4M 2S1\n" +
    "Subway,34 Church Street Toronto ON M5E 1T3\n" +
    "Subway,259 King Street E Toronto ON M5A 1K2\n" +
    "Subway,717 College Street Toronto ON M6G 1C2\n" +
    "Subway,121 King Street W Suite 132B Toronto ON M5H 3T9\n" +
    "McDonald's,630 Keele Street Toronto ON M6N 3E2\n" +
    "McDonald's,1787 Bayview Avenue Toronto ON M4G 3C4\n" +
    "McDonald's,2116 Kipling Ave Toronto ON M9W 4K4\n" +
    "McDonald's,1571 Sandhurst Circle Toronto ON M1V 1V2\n" +
    "McDonald's,552 Yonge Street Toronto ON M4Y 1Y8\n" +
    "McDonald's,470 Yonge Street Toronto ON M4Y 1X5\n" +
    "McDonald's,2781 Dufferin Street Toronto ON M6B 3R9\n" +
    "McDonald's,1000 Gerrard Street E Toronto ON M4M 3G6\n" +
    "Tim Hortons,2696-2708 Keele Street Toronto ON M3M 3G5\n" +
    "Tim Horton's,1733 Eglinton Avenue E Toronto ON M4A 1J8\n" +
    "Tim Hortons,455 Spadina Avenue Toronto ON M5S 1A1\n" +
    "Tim Horton's,33 Yonge Street Toronto ON M5E 1G4\n" +
    "Tim Hortons,743 Av Pape Toronto ON M4K 3T1\n" +
    "Tim Horton's,7331 Kingston Road Toronto ON M1B 5S3\n" +
    "Tim Hortons,200 Front Street W Toronto ON M5V 3K2\n" +
    "Tim Hortons,Royal Bank Plaza 200 Bay Street Toronto ON M5J\n" +
    "Tim Hortons,481 University Avenue Toronto ON M5G 2E9\n" +
    "Tim Hortons,1195 Danforth Avenue Toronto ON M4J 1M7\n" +
    "Tim Hortons,4198 Sheppard Avenue E Toronto ON M1S 1T3\n" +
    "Tim Horton's,335 Parliament Toronto ON M5A 2Z3\n" +
    "Tim Hortons,73 Front St E Toronto ON M5E 1B8\n" +
    "Tim Hortons,399 Bathurst Street Toronto ON M5T 2S8\n" +
    "Tim Hortons,750 Dundas St W Toronto ON M6J 3S3\n" +
    "Tim Hortons,3300 Bloor Street W Toronto ON M8X 1E9\n" +
    "Tim Hortons,380 Weston Road Toronto ON M6N 5H1\n" +
    "Tim Hortons,12 Queens Quay W Toronto ON M5J 2V7\n" +
    "Tim Horton's,18 King St E Toronto ON M5C 1C4\n" +
    "Tim Horton's,745 College St Toronto ON M6G 1C5\n";