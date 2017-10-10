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
            $('table thead tr').find('th:eq(' + $(this).index() + ')').hide();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').hide();
        }else{
            $(this).removeAttr("style");
            $('table thead tr').find('th:eq(' + $(this).index() + ')').show();
            $('table tbody tr').find('td:eq(' + $(this).index() + ')').show();
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
    /*call smartcrawl*/
    $("button#try").click(function(){
        $("h1#processing").show()
        $("table#table_result").hide();
        var original_data = $("textarea[name='message']").val();
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
                $("table#table_result thead").children().remove();
                $("table#table_result thead").html(join_thead);
                $("table#table_result tbody").children().remove();
                $("table#table_result tbody").html(join_tbody);
                $("h1#processing").hide();
                $("table#table_result").show();
                $("div#join_schema").append(join_keys);
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