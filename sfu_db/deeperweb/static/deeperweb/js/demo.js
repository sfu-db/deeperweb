/*====================demo ajax======*/
$(document).ready(function(){
    /*schema matching*/
    $("div#local_schema").delegate("a.tag","click",function(){
        if(typeof($(this).attr("style"))=="undefined"){
            if($("div#local_schema a[style]").length){
                $("div#local_schema a[style]:last").after($(this));
            }else{
                $("a#local_button").after($(this));
            }
            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
        }else{
            $(this).removeAttr("style");
            $("div#local_schema").append($(this));
        }
    });
    $("div#hidden_schema").delegate("a.tag","click",function(){
        if(typeof($(this).attr("style"))=="undefined"){
            if($("div#hidden_schema a[style]").length){
                $("div#hidden_schema a[style]:last").after($(this));
            }else{
                $("a#hidden_button").after($(this));
            }
            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
        }else{
            $(this).removeAttr("style");
            $("div#hidden_schema").append($(this));
        }
    });
    /*schema operation*/
    $("div#join_schema").delegate("a.tag","click",function(){
        if(typeof($(this).attr("style"))=="undefined"){
            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
            $('table thead tr').find('th:eq(' + $(this).index() + ')').show();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').show();
        }else{
            $(this).removeAttr("style");
            $('table thead tr').find('th:eq(' + $(this).index() + ')').hide();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').hide();
        }
    });
    /*extract schema from csv*/
    $("textarea[name='message']").bind('input propertychange',function(){
        var str=$(this).val();
        var header = str.split("\n")[0];
        var schema = header.split(",");
        var local_keys = ""
        for(var i=0;i<schema.length;i++){
            local_keys+="<a class='tag'>"+schema[i]+"</a>";
            }
        $("a#local_button").nextAll().remove();
        $("div#local_schema").append(local_keys);
    });
    /*choose api*/
    $("div#api ul li").click(function(){
        $('div#api ul li').removeClass();
        $("a#hidden_button").nextAll().remove();
        $(this).addClass("active");
        if($(this).parent().attr('id')=='dblp'){
            if($(this).text()=='Publ API'){
                $('a#hidden_button').after(
                     "<a class='tag' style='background: rgb(35, 125, 200); border-color: rgb(35, 125, 200); color: rgb(255, 255, 255);'>info.key</a>"
                    +"<a class='tag' style='background: rgb(35, 125, 200); border-color: rgb(35, 125, 200); color: rgb(255, 255, 255);'>info.title</a>"
                    +"<a class='tag' style='background: rgb(35, 125, 200); border-color: rgb(35, 125, 200); color: rgb(255, 255, 255);'>info.authors.author.*</a>"
                    +"<a class='tag'>@score</a>"+"<a class='tag'>info.url</a>"
                    +"<a class='tag'>info.venue</a>"+"<a class='tag'>info.volume</a>"
                    +"<a class='tag'>info.year</a>"
                    +"<a class='tag'>info.type</a>"+"<a class='tag'>@id</a>"
                    +"<a class='tag'>url</a>");
                }else{
                    alert("Sorry, this api is not supported now.");
                }
        }else{
            alert("Sorry, this api is not supported now.");
        }
    });
    /*simulate click*/
    $("button#upload").click(function(){
        if($("button#upload a").text()=="Upload csv"){
            $('#fileupload').click();
        }else{
            $("button#upload a").text("Upload csv");
            $("a#local_button").nextAll().remove();
            $("textarea[name='message']").show();
            $("table#table_input").hide();
        }
    });
    /*upload csv*/
    $('#fileupload').fileupload({
        url:"/uploadCSV/",
        type : "POST",
        autoUpload:false,
        add:function (e, data) {
            var name_list = data.files[0].name.split('.');
            if(name_list[name_list.length-1]=='csv'){
                if(data.files[0].size>=5*1024*1024){
                    alert("Maximum file size is 5MB");
                    data = undefined;
                }else{
                    $("button#upload").attr("disabled", true);
                    $("button#upload a").text("Wait");
                    data.submit();
                    data = undefined;
                }
            }else{
                alert("Only csv are allowed.");
                data = undefined;
            }
        },
        always:function (e, data) {
            var local_thead="";
	        var local_tbody=""
	        var local_keys = ""
	        $.each(data.result['csv_input'],function(index,element){
			    if(index==0){
			        local_thead+="<tr>";
				    for (var i = 0; i < element.length; i++){
				        local_thead+="<th>"+element[i]+"</th>";
						local_keys+="<a class='tag'>"+element[i]+"</a>";
					};
					local_thead+="</tr>";
			    }else{
			        local_tbody+="<tr>";
					for (var i = 0; i < element.length; i++){
					    local_tbody+="<td>"+element[i]+"</td>";
					};
					local_tbody+="</tr>";
				}
            });
            $("a#local_button").nextAll().remove();
            $("div#local_schema").append(local_keys);
            $("textarea[name='message']").hide();
            $("table#table_input thead").children().remove();
            $("table#table_input thead").html(local_thead);
            $("table#table_input tbody").children().remove();
            $("table#table_input tbody").html(local_tbody);
            $("table#table_input").show();
            $("button#upload").attr("disabled", false);
            $("button#upload a").text("Cancel");
        },
    });
    /*call smartcrawl*/
    $("button#try").click(function(){
        $("h1#processing").show()
        $("table#table_result").hide();
        if($("textarea[name='message']").is(":visible")){
            var original_data = $("textarea[name='message']").val();
        }else{
            var table_input = $('table#table_input').find('tr');
            var original_data = new Array();
            $(table_input).each(function(index,element){
                if(index==0){
                    var header = new Array();
                    var table_header = $(element).children('th');
                    for (var i = 0; i < table_header.length; i++){
                        header.push(table_header.eq(i).text());
                    }
                    original_data[index] = header;
                }else{
                    var row = new Array();
                    var table_row = $(element).children('td');
                    for (var i = 0; i < table_row.length; i++){
                        row.push(table_row.eq(i).text());
                    }
                    original_data[index] = row;
                }
            });
            original_data = JSON.stringify(original_data)
        }
        var local_schema = $('div#local_schema').children('a.tag');
        var local_match = new Array();
        $(local_schema).each(function(){
            if(typeof($(this).attr("style"))!="undefined"){
                local_match.push($(this).text());
            }
        });
        var hidden_schema = $('div#hidden_schema').children('a.tag');
        var hidden_match = new Array();
        $(hidden_schema).each(function(){
            if(typeof($(this).attr("style"))!="undefined"){
                hidden_match.push($(this).text());
            }
        });
        var api = $('div#api ul li.active')
        var api_msg = api.parent().attr('id')+' '+api.text();
        $.ajax({
            url : "/smartcrawl/",
	        type : "POST",
	        dataType : "json",
	        data : { 'original_data': original_data, 'local_match' : local_match, 'hidden_match' : hidden_match, 'api_msg' : api_msg},
	        success : function(response) {
	            var join_thead="";
	            var join_tbody=""
	            var join_keys = ""
	            $.each(response['join_csv'],function(index,element){
				    if(index==0){
				        join_thead+="<tr>";
				        for (var i = 0; i < element.length; i++){
				            join_thead+="<th>"+element[i]+"</th>";
						    join_keys+="<a class='tag'>"+element[i]+"</a>";
					    };
					    join_thead+="</tr>";
			        }else{
			            join_tbody+="<tr>";
					    for (var i = 0; i < element.length; i++){
					        join_tbody+="<td>"+element[i]+"</td>";
					    };
					    join_tbody+="</tr>";
				    }
                });
                $("h1#processing").hide();
                $("div#join_schema").children().remove();
                $("div#join_schema").append(join_keys);
                $("table#table_result thead").children().remove();
                $("table#table_result thead").html(join_thead);
                $("table#table_result tbody").children().remove();
                $("table#table_result tbody").html(join_tbody);
                $("table#table_result").show();

                $('table#table_result thead tr th').hide();
                $('table#table_result tbody tr td').hide();
                var join_schema = $('div#join_schema').children('a.tag');
                $(hidden_match).each(function(index,element){
                    $(join_schema).each(function(){
                        if($(this).text()==element){
                            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
                            $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').show();
                            $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').show();
                        }
                    });
                });
                $(local_match).each(function(index,element){
                    $(join_schema).each(function(){
                        if($(this).text()==element){
                            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
                            $('table#table_result thead tr').find('th:eq(' + $(this).index() + ')').show();
                            $('table#table_result tbody tr').find('td:eq(' + $(this).index() + ')').show();
                        }
                    });
                });
		    },
		    error : function() {
		        alert("Incorrect Format.");
		    }
        });
    });
    /*export csv from html table*/
    $("button#download").click(function(){
        if($('table#table_result tbody tr').length>0){
            var table_result = $('table#table_result').find('tr');
            var original_data = new Array();
            $(table_result).each(function(index,element){
                if(index==0){
                    var header = new Array();
                    var table_header = $(element).children('th');
                    for (var i = 0; i < table_header.length; i++){
                        header.push(table_header.eq(i).text());
                    }
                    original_data[index] = header;
                }else{
                    var row = new Array();
                    var table_row = $(element).children('td');
                    for (var i = 0; i < table_row.length; i++){
                        row.push(table_row.eq(i).text());
                    }
                    original_data[index] = row;
                }
            });
            $.ajax({
                url : "/importTable/",
				type : "POST",
				dataType : "json",
				data : {'original_data' : JSON.stringify(original_data), },
				success : function(response) {
                    window.location.href = "/exportCSV/"
				},
				error : function() {
				    alert("Download Error.");
				}
            });
        }else{
            alert("Empty Table.");
        }
    });
});
/*====================demo ajax end======*/