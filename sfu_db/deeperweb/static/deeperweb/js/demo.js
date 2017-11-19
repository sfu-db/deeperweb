/*====================demo ajax======*/
$(document).ready(function(){
    /*choose api*/
    $("div#api ul li").click(function(){
        $('div#api ul li').removeClass();
        $(this).addClass("active");
        $("a#hidden_button").nextAll().remove();

        $("button#upload a").text("Upload csv");
        $("textarea[name='message']").show();
        $("table#table_input").hide();

        if($(this).parent().attr('id')=='dblp'){
            if($(this).text()=='Publ API'){
                var dblp_publ_schema = ['info.key','info.title','info.authors.author.*','@score','info.url','info.venue','info.volume','info.year','info.type','@id','url'];
                $.each(dblp_publ_schema,function(index,element){
                    $("div#hidden_schema").append("<a class='tag'>"+element+"</a>");
                    if (index<3){
                        $("div#hidden_schema a:last").css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
                        $("div#hidden_schema a:last").append("<span class='badge'>"+index+"</span>");
                    }
                });
                $("textarea[name='message']").html(dblp_publ_text);
            }else{
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Sorry, this api is not supported now.");
            }
        }else if($(this).parent().attr('id')=='yelp'){
            if($(this).text()=='Search API'){
                var yelp_search_schema = ['id', 'name', 'location.display_address.*', 'rating', 'review_count', 'transactions.*', 'url', 'price', 'distance', 'coordinates.latitude', 'coordinates.longitude', 'phone', 'image_url', 'categories.*.alias', 'categories.*.title', 'display_phone', 'is_closed', 'location.city', 'location.country', 'location.address2', 'location.address3', 'location.state', 'location.address1', 'location.zip_code'];
                $.each(yelp_search_schema,function(index,element){
                    $("div#hidden_schema").append("<a class='tag'>"+element+"</a>");
                    if (index<3){
                        $("div#hidden_schema a:last").css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
                        $("div#hidden_schema a:last").append("<span class='badge'>"+index+"</span>");
                    }
                });
                $("textarea[name='message']").html(yelp_search_text);
            }else{
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Sorry, this api is not supported now.");
            }
        }else{
            $(".alert-popup").addClass("open");
            $(".alert-popup p").html("Sorry, this api is not supported now.");
        }
        textarea_detection();
    });
    /*schema matching*/
    $("div#local_schema").delegate("a.tag","click",function(){
        if(typeof($(this).attr("style"))=="undefined"){
            if($("div#local_schema a[style]").length){
                $("div#local_schema a[style]:last").after($(this));
            }else{
                $("a#local_button").after($(this));
            }
            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
            $(this).append("<span class='badge'></span>");
        }else{
            $(this).removeAttr("style");
            $(this).children("span").remove();
            $("div#local_schema").append($(this));
        }
        var active_tags = $("div#local_schema a[style]");
        for(var i=0; i<active_tags.length; i++){
            active_tags.eq(i).find("span").text(i);
        };
    });
    $("div#hidden_schema").delegate("a.tag","click",function(){
        if(typeof($(this).attr("style"))=="undefined"){
            if($("div#hidden_schema a[style]").length){
                $("div#hidden_schema a[style]:last").after($(this));
            }else{
                $("a#hidden_button").after($(this));
            }
            $(this).css({'color':'#ffffff', 'background':'#237dc8', 'border-color':'#237dc8'});
            $(this).append("<span class='badge'></span>");
        }else{
            $(this).removeAttr("style");
            $(this).children("span").remove();
            $("div#hidden_schema").append($(this));
        }
        var active_tags = $("div#hidden_schema a[style]");
        for(var i=0; i<active_tags.length; i++){
            active_tags.eq(i).find("span").text(i);
        };
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
        textarea_detection();
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
    $("#msg_submit").click(function(){
        /*get the message of schema and api*/
        var local_schema = $('div#local_schema').children('a.tag');
        var local_match = new Array();
        $(local_schema).each(function(){
            if(typeof($(this).attr("style"))!="undefined"){
                local_match.push($(this).text().substring(0,$(this).text().length-$(this).children('span').text().length));
            }
        });
        var hidden_schema = $('div#hidden_schema').children('a.tag');
        var hidden_match = new Array();
        $(hidden_schema).each(function(){
            if(typeof($(this).attr("style"))!="undefined"){
                hidden_match.push($(this).text().substring(0,$(this).text().length-$(this).children('span').text().length));
            }
        });
        var api = $('div#api ul li.active');
        var api_msg = api.parent().attr('id')+' '+api.text();
        /*judge the correctness of schema and api*/
        if (local_match.length != hidden_match.length){
            alert("Please match the schema correctly.");
            return false;
        }
        if (api_msg=="dblp Publ API"){
            var judge_title = false;
            var active_hidden_schema = $("div#hidden_schema a[style]");
            $(active_hidden_schema).each(function(){
                if($(this).text().substring(0,$(this).text().length-$(this).children('span').text().length)=="info.title"){
                    judge_title = true;
                }
            });
            if (!judge_title){
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("info.title is necessary.");
                return false;
            }
        } else if(api_msg=="yelp Search API"){
            var judge_name = false;
            var judge_location = false;
            var active_hidden_schema = $("div#hidden_schema a[style]");
            $(active_hidden_schema).each(function(){
                if($(this).text().substring(0,$(this).text().length-$(this).children('span').text().length)=="name"){
                    judge_name = true;
                }
                if($(this).text().substring(0,$(this).text().length-$(this).children('span').text().length)=="location.display_address.*"){
                    judge_location = true;
                }
            });
            if (!(judge_name && judge_location)){
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("name or location.display_address.* is necessary.");
                return false;
            }
        }else {
            $(".alert-popup").addClass("open");
            $(".alert-popup p").html("Sorry, this api is not supported now.");
            return false;
        }
        /*pre-process the local record*/
        if($("textarea[name='message']").is(":visible")){
            var original_data = $("textarea[name='message']").val();
            if (original_data.length>5242880){
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Maximum file size is 5MB");
                return false;
            }
            if (original_data.split('\n').length>20000){
                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Maximum number of rows for file is 20000");
                return false;
            }
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

        $(".news-popup").removeClass("open");
        $("table#table_result").hide();
        $("div#topLoader").show();
        location.hash = "#topLoader";
        timing();

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
                $("div#join_schema").children().remove();
                $("div#join_schema").append(join_keys);

                $("table#table_result thead").children().remove();
                $("table#table_result thead").html(join_thead);
                $("table#table_result tbody").children().remove();
                $("table#table_result tbody").html(join_tbody);

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
                $("div#topLoader").hide();
                $("table#table_result").show();

                $(".alert-popup").addClass("open");
                $(".alert-popup p").html("DeepER enriches "+ (response['join_csv'].length - 1) +
                " records within 4 queries, while traditional methods need " + (response['join_csv'].length - 1) + " queries");
		    },
		    error : function() {
		        $(".alert-popup").addClass("open");
                $(".alert-popup p").html("Incorrect Format.");
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
				    $(".alert-popup").addClass("open");
                    $(".alert-popup p").html("Download Error.");
				}
            });
        }else{
            $(".alert-popup").addClass("open");
            $(".alert-popup p").html("Empty Table.");
        }
    });

    var $topLoader = $("#topLoader").percentageLoader({width: 356, height: 356, controllable : true, progress : 0.0,
        onProgressUpdate : function(val) {$topLoader.setValue(Math.round(val * 100.0));}});
    var topLoaderRunning = false;
    function timing() {
        if (topLoaderRunning) {
            return;
        }
        topLoaderRunning = true;
        $topLoader.setProgress(0);
        $topLoader.setValue('0ms');
        var ms = 0;
        var totalMs = 20000;

        var animateFunc = function() {
            ms += 25;
            $topLoader.setProgress(ms / totalMs);
            $topLoader.setValue(ms.toString() + 'ms');
            if (ms < totalMs) {
                setTimeout(animateFunc, 25);
            } else {
                topLoaderRunning = false;
            }
        }
        setTimeout(animateFunc, 25);
    }
});
/*====================demo ajax end======*/
function textarea_detection(){
    var str= $("textarea[name='message']").val();
    var header = str.split("\n")[0];
    var schema = header.split(",");
    var local_keys = ""
    for(var i=0;i<schema.length;i++){
        local_keys+="<a class='tag'>"+schema[i]+"</a>";
    }
    $("a#local_button").nextAll().remove();
    $("div#local_schema").append(local_keys);
}

var dblp_publ_text = "ID,title,author\n"+
                "1,First-Order Predicate Logic,\n"+
                "2,Cumulative Learning,Pietro Michelucci and Daniel Oblinger\n"+
                "3,GreenSim: A Network Simulator for Comprehensively Validating and Evaluating New Machine Learning Techniques for Network Structural Inference,Christopher Fogelberg and Vasile Palade\n"+
                "4,Induction,James Cussens\n"+
                "5,A Comparison of three machine learning techniques for encrypted network traffic analysis,Daniel J. Arndt and A. Nur Zincir-Heywood\n"+
                "6,Particle Swarm Optimization,James Kennedy\n"+
                "7,Use of Machine Learning Classification Techniques to Detect Atypical Behavior in Medical Applications,Terrence Ziemniak\n"+
                "8,Predicting Postgraduate Students' Performance Using Machine Learning Techniques,Maria Koutina and Katia Lida Kermanidis\n"+
                "9,Radial Basis Function Networks,Martin D. Buhmann\n"+
                "10,Generative and Discriminative Learning,Bin Liu and Geoffrey I. Webb\n"+
                "11,Biomedical Informatics,C. David Page Jr. and Sriraam Natarajan\n"+
                "12,Simple Recurrent Network,Risto Miikkulainen\n"+
                "13,Semi-Naive Bayesian Learning,Fei Zheng and Geoffrey I. Webb\n"+
                "14,Statistical Relational Learning,Luc De Raedt and Kristian Kersting\n"+
                "15,Markov Decision Processes,William T. B. Uther\n"+
                "16,Certainty Equivalence Principle,\n"+
                "17,The GEO VIEW design A relational data base approach to geographical data handling,Thomas C. Waugh and R. G. Healey\n"+
                "18,Latent Factor Models and Matrix Factorizations,\n"+
                "19,L1-Distance,\n"+
                "20,Labeled Data,\n"+
                "21,Learning Bias,\n"+
                "22,Document Classification,Dunja Mladenic and Janez Brank and Marko Grobelnik\n"+
                "23,Learning By Demonstration,\n"+
                "24,Is More Specific Than,\n"+
                "25,Is More General Than,\n"+
                "26,Iterative Classification,\n"+
                "27,Inverse Entailment,\n"+
                "28,Inverse Resolution,\n"+
                "29,Inverse Optimal Control,\n"+
                "30,Kernels,\n"+
                "31,Kernel Density Estimation,\n"+
                "32,Junk Email Filtering,\n"+
                "33,Kernel Matrix,\n"+
                "34,Directed Graphs,\n"+
                "35,Dimensionality Reduction on Text via Feature Selection,\n"+
                "36,Deductive Learning,\n"+
                "37,Decision Trees For Regression,\n"+
                "38,Digraphs,\n"+
                "39,Classifier Systems,Pier Luca Lanzi\n"+
                "40,Classifier Systems,Pier Luca Lanzi\n"+
                "41,Data Set,\n"+
                "42,Data Mining On Text,\n"+
                "43,Decision Stump,\n"+
                "44,Decision Rule,\n"+
                "45,Decision Epoch,\n"+
                "46,Covering Algorithm,\n"+
                "47,Cost-to-Go Function Approximation,\n"+
                "48,Missing Attribute Values,Ivan Bruha\n"+
                "49,Cross-Validation,\n"+
                "50,Cross-Language Question Answering,\n"+
                "51,Cross-Language Document Categorization,\n"+
                "52,Constraint-Based Mining,Siegfried Nijssen\n"+
                "53,Instance,\n"+
                "54,Using machine learning techniques to enhance the performance of an automatic backup and recovery system,Dan Pelleg and Eran Raichstein and Amir Ronen\n"+
                "55,Connections Between Inductive Inference and Machine Learning,John Case and Sanjay Jain\n"+
                "56,Posterior Probability,Geoffrey I. Webb\n"+
                "57,Deduplication,\n"+
                "58,Data Integration: The Relational Logic Approach,Michael R. Genesereth\n"+
                "59,Minimum Description Length Principle,Jorma Rissanen\n"+
                "60,Reservoir Computing,Risto Miikkulainen\n"+
                "61,Optimal Learning,\n"+
                "62,Bayesian Reinforcement Learning,Pascal Poupart\n"+
                "63,Nogood Learning,\n"+
                "64,Cost-Sensitive Learning,Charles X. Ling and Victor S. Sheng\n"+
                "65,Sequence Data,\n"+
                "66,Sequential Data,\n"+
                "67,Intelligent Data Engineering and Automated Learning - {IDEAL} 2000, Data Mining, Financial Engineering, and Intelligent Agents, Second International Conference, Shatin, {N.T.} Hong Kong, China, December 13-15, 2000, Proceedings,\n"+
                "68,Functional classification of ornamental stone using machine learning techniques,M. F. Lopez and Jose M. Martinez and Jose M. Matias and Javier Taboada and Jose A. Vilan\n"+
                "69,Graph Kernels,S. V. N. Vishwanathan and Nicol N. Schraudolph and Risi Kondor and Karsten M. Borgwardt\n"+
                "70,Object-Oriented Database Mining: Use of Object Oriented Concepts for Improving Data Classification Technique,Kitsana Waiyamai and Chidchanok Songsiri and Thanawin Rakthanmanon\n"+
                "71,High Classification Rates for Continuous Cow Activity Recognition Using Low-Cost {GPS} Positioning Sensors and Standard Machine Learning Techniques,Torben Godsk and Mikkel Baun Kjaergaard\n"+
                "72,Nearest Neighbor,Eamonn J. Keogh\n"+
                "73,Evolutionary Feature Selection and Construction,Krzysztof Krawiec\n"+
                "74,Deductive and Object-Oriented Databases, Proceedings of the First International Conference on Deductive and Object-Oriented Databases (DOOD'89), Kyoto Research Park, Kyoto, Japan, 4-6 December, 1989,\n"+
                "75,Discovering Data Structures Using Meta-learning, Visualization and Constructive Neural Networks,Tomasz Maszczyk and Marek Grochowski and Wlodzislaw Duch\n"+
                "76,Multi-Instance Learning,Soumya Ray and Stephen Scott and Hendrik Blockeel\n"+
                "77,Credit rating by hybrid machine learning techniques,Chih-Fong Tsai and Ming{-}Lun Chen\n"+
                "78,Stochastic Finite Learning,Thomas Zeugmann\n"+
                "79,Kernel Shaping,\n"+
                "80,Phase Transitions in Machine Learning,Lorenza Saitta and Michele Sebag\n"+
                "81,Locally Weighted Regression for Control,Jo{-}Anne Ting and Sethu Vijayakumar and Stefan Schaal\n"+
                "82,Error Rate,Kai Ming Ting\n"+
                "83,Mobile Data Management, 4th International Conference, {MDM} 2003, Melbourne, Australia, January 21-24, 2003, Proceedings,\n"+
                "84,Evolutionary Fuzzy Systems,Carlos Kavka\n"+
                "85,Regression Trees,Luis Torgo\n"+
                "86,Fuzzy Sets,\n"+
                "87,Fuzzy Systems,\n"+
                "88,Generality And Logic,\n"+
                "89,Generative Learning,\n"+
                "90,Genetic Clustering,\n"+
                "91,False Negative,\n"+
                "92,False Positive,\n"+
                "93,Finite Mixture Model,\n"+
                "94,First-Order Regression Tree,\n"+
                "95,EFSC,\n"+
                "96,Foreword for the special issue of selected papers from the 1st {ECML/PKDD} Workshop on Privacy and Security issues in Data Mining and Machine Learning,Aris Gkoulalas{-}Divanis and Yucel Saygin and Vassilios S. Verykios\n"+
                "97,Database and {XML} Technologies, First International {XML} Database Symposium, XSym 2003, Berlin, Germany, September 8, 2003, Proceedings,\n"+
                "98,ECOC,\n"+
                "99,Database and {XML} Technologies, Second International {XML} Database Symposium, XSym 2004, Toronto, Canada, August 29-30, 2004, Proceedings,\n"+
                "100,Using Machine Learning Techniques and Genomic/Proteomic Information from Known Databases for {PPI} Prediction,Jose M. Urquiza and Ignacio Rojas and Hector Pomares and Luis Javier Herrera and J. P. Florido and Francisco M. Ortuno Guzman\n"+
                "101,Embodied Evolutionary Learning,\n"+
                "102,Elman Network,\n"+
                "103,Learning in Logic,\n"+
                "104,Entailment,\n"+
                "105,Intelligent Backtracking,\n"+
                "106,Minimum Message Length,Rohan A. Baxter\n"+
                "107,Instance Language,\n"+
                "108,Distance,\n"+
                "109,Large scale data mining using genetics-based machine learning,Jaume Bacardit and Xavier Llora\n"+
                "110,Interval Scale,\n"+
                "111,Precision,Kai Ming Ting\n"+
                "112,Precision and Recall,Kai Ming Ting\n"+
                "113,Sensitivity and Specificity,Kai Ming Ting\n"+
                "114,Improvement Curve,\n"+
                "115,Dynamic Systems,\n"+
                "116,EBL,\n"+
                "117,Immunological Computation,\n"+
                "118,Dynamic Decision Networks,\n"+
                "119,Cost,\n"+
                "120,Associative Reinforcement Learning,Alexander L. Strehl\n"+
                "121,Inductive Inference Rules,\n"+
                "122,Inductive Bias,\n"+
                "123,Inductive Inference,Sanjay Jain and Frank Stephan\n"+
                "124,Probabilistic Context-Free Grammars,Yasubumi Sakakibara\n"+
                "125,Multistrategy Ensemble Learning,\n"+
                "126,Multiple-Instance Learning,\n"+
                "127,Hopfield Network,Risto Miikkulainen\n"+
                "128,Maximum Entropy Models for Natural Language Processing,Adwait Ratnaparkhi\n"+
                "129,Artificial Societies,Jurgen Branke\n"+
                "130,Preference Learning,Johannes Furnkranz and Eyke Hullermeier\n"+
                "131,Speedup Learning For Planning,\n"+
                "132,Comparison of Classification Techniques used in Machine Learning as Applied on Vocational Guidance Data,Halil-Ibrahim Bulbul and Ozkan Unsal\n"+
                "133,Online Learning,Peter Auer\n"+
                "134,Learning Vector Quantization,\n"+
                "135,Identity Uncertainty,\n"+
                "136,Holdout Evaluation,\n"+
                "137,Holdout Data,\n"+
                "138,Hold-One-Out Error,\n"+
                "139,Heuristic Rewards,\n"+
                "140,Growth Function,\n"+
                "141,Grouping,\n"+
                "142,Grammar Learning,\n"+
                "143,Gram Matrix,\n"+
                "144,Gini Coefficient,\n"+
                "145,Gibbs Sampling,\n"+
                "146,Genetics-Based Machine Learning,\n"+
                "147,Genetic Neural Networks,\n"+
                "148,Genetic Grouping,\n"+
                "149,Genetic Feature Selection,\n"+
                "150,Lift,\n"+
                "151,Classification of Poincar{\'{e}} plots for temporal series of heart rate variability by using machine learning techniques,Andre Ricardo Gonccalves and Maria Angelica de Oliveira Camargo-Brunetto\n"+
                "152,Application Of Machine Learning Techniques For The Forecasting Of Fashion Trends,Paola Mello and Sergio Storari and Bernardo Valli\n"+
                "153,Comparative analysis of machine learning techniques for the prediction of logP,Edward W. Lowe and Mariusz Butkiewicz and Matthew Spellings and Albert Omlor and Jens Meiler\n"+
                "154,Machine Learning Techniques based on Random Projections,Yoan Miche and Benjamin Schrauwen and Amaury Lendasse\n"+
                "155,Blue-white veil and dark-red patch of pigment pattern recognition in dermoscopic images using machine-learning techniques,Jose Luis Garcia Arroyo and Begona Garcia Zapirain and Amaia Mendez Zorrilla\n"+
                "156,Bayesian Network,\n"+
                "157,Privacy in Statistical Databases: {CASC} Project International Workshop, {PSD} 2004, Barcelona, Spain, June 9-11, 2004. Proceedings,\n"+
                "158,Privacy-Related Aspects and Techniques,Stan Matwin\n"+
                "159,Privacy-Related Aspects and Techniques,Stan Matwin\n"+
                "160,Dynamic Programming,Martin L. Puterman and Jonathan Patrick\n"+
                "161,Artificial Immune Systems,Jon Timmis\n"+
                "162,Predictive Techniques in Software Engineering,Jelber Sayyad{-}Shirabad\n"+
                "163,Predictive Techniques in Software Engineering,Jelber Sayyad{-}Shirabad\n"+
                "164,Policy Gradient Methods,Jan Peters and J. Andrew Bagnell\n"+
                "165,Conditional Random Field,\n"+
                "166,Incremental Learning,Paul E. Utgoff\n"+
                "167,Initiated language learning machine with multi-media and speech-recognition techniques,Dong-Liang Lee and Chun-Liang Hsu and Sheng-Yuan Yang and Wei-Ying Chen\n"+
                "168,Inductive Transfer,Ricardo Vilalta and Christophe G. Giraud{-}Carrier and Pavel Brazdil and Carlos Soares\n"+
                "169,Comparison of Machine Learning Techniques for Bayesian Networks for User-Adaptive Systems,Frank Wittig\n"+
                "170,Probably Approximately Correct Learning,\n"+
                "171,Link Mining and Link Discovery,Lise Getoor\n"+
                "172,Deep Belief Networks,\n"+
                "173,Feature Construction in Text Mining,Janez Brank and Dunja Mladenic and Marko Grobelnik\n"+
                "174,Hypothesis Language,Hendrik Blockeel\n"+
                "175,Q-Learning,Peter Stone\n"+
                "176,Observation Language,Hendrik Blockeel\n"+
                "177,Hypothesis Space,Hendrik Blockeel\n"+
                "178,Inductive Database Approach to Graphmining,Stefan Kramer\n"+
                "179,Attribute Selection,\n"+
                "180,Model-Based Reinforcement Learning,Soumya Ray and Prasad Tadepalli\n"+
                "181,Discriminative Learning,\n"+
                "182,Inductive Process Modeling,Ljupco Todorovski\n"+
                "183,Hidden Markov Models,Antal van den Bosch\n"+
                "184,Learning Curves in Machine Learning,Claudia Perlich\n"+
                "185,Using Linguistic Information and Machine Learning Techniques to Identify Entities from Juridical Documents,Paulo Quaresma and Teresa Gonccalves\n"+
                "186,Search Engines: Applications of {ML},Eric Martin\n"+
                "187,Grammatical Inference,Lorenza Saitta and Michele Sebag\n"+
                "188,Generalized Expectation Criteria for Semi-Supervised Learning with Weakly Labeled Data,Gideon S. Mann and Andrew McCallum\n"+
                "189,Computational Complexity of Learning,Sanjay Jain and Frank Stephan\n"+
                "190,Programming by Demonstration,Pierre Flener and Ute Schmid\n"+
                "191,Feedforward Recurrent Network,\n"+
                "192,Partially Observable Markov Decision Processes,Pascal Poupart\n"+
                "193,Using Machine Learning Techniques for Modelling and Simulation of Metabolic Networks,Marenglen Biba and Fatos Xhafa and Floriana Esposito and Stefano Ferilli\n"+
                "194,Synthesis of Integrated Passive Components for High-Frequency {RF} ICs Based on Evolutionary Computation and Machine Learning Techniques,Bo Liu and Dixian Zhao and Patrick Reynaert and Georges G.E. Gielen\n"+
                "195,Reinforcement Learning,Peter Stone\n"+
                "196,Learning to detect incidents from noisily labeled data,Tomas Singliar and Milos Hauskrecht\n"+
                "197,Graphical Models,Julian John McAuley and Tiberio S. Caetano and Wray L. Buntine\n"+
                "198,Graphical Models,Julian John McAuley and Tiberio S. Caetano and Wray L. Buntine\n"+
                "199,Deep Belief Nets,Geoffrey E. Hinton\n"+
                "200,Overfitting,Geoffrey I. Webb\n"+
                "201,Prior Probability,Geoffrey I. Webb\n"+
                "202,Integrity in Databases - 6th International Workshop on Foundations of Models and Languages for Data and Objects, Schloss Dagstuhl, Germany, September 16-20, 1996, Proceedings,\n"+
                "203,Model Evaluation,Geoffrey I. Webb\n"+
                "204,Data Preparation,Geoffrey I. Webb\n"+
                "205,Lazy Learning,Geoffrey I. Webb\n"+
                "206,Discussion on 'Techniques for Massive-Data Machine Learning in Astronomy' by A. Gray,Nicholas M. Ball\n"+
                "207,Operation of an international data center: Canadian Scientific Numeric Database Service,Gordon H. Wood and John R. Rodgers and S. Roger Gough\n"+
                "208,Integrated Spatial Databases, Digital Inages and GIS, International Workshop {ISD} '99, Portland, ME, USA, June 14-16, 1999, Selected Papers,\n"+
                "209,Frequent Set,\n"+
                "210,Evolutionary Kernel Learning,Christian Igel\n"+
                "211,Inductive Programming,Pierre Flener and Ute Schmid\n"+
                "212,Computer-Aided Detection of Polyps in {CT} Colonography with Pixel-Based Machine Learning Techniques,Jianwu Xu and Kenji Suzuki\n"+
                "213,Graphs,Tommy R. Jensen\n"+
                "214,Frequent Pattern,Hannu Toivonen\n"+
                "215,Committee Machines,\n"+
                "216,Learning Control Rules,\n"+
                "217,Learning from Labeled and Unlabeled Data,\n"+
                "218,Learning from Labeled and Unlabeled Data,\n"+
                "219,Learning from Labeled and Unlabeled Data,\n"+
                "220,Learning By Imitation,\n"+
                "221,Learning Classifier Systems,\n"+
                "222,Learning Classifier Systems,\n"+
                "223,Learning Control,\n"+
                "224,Learning in Worlds with Objects,\n"+
                "225,Learning with Different Classification Costs,\n"+
                "226,Learning with Hidden Context,\n"+
                "227,Advances in Database Technology - {EDBT} 2004, 9th International Conference on Extending Database Technology, Heraklion, Crete, Greece, March 14-18, 2004, Proceedings,\n"+
                "228,Learning from Preferences,\n"+
                "229,Life-Long Learning,\n"+
                "230,Lifelong Learning,\n"+
                "231,Linear Regression Trees,\n"+
                "232,Learning Word Senses,\n"+
                "233,Leave-One-Out Cross-Validation,\n"+
                "234,Lessons-Learned Systems,\n"+
                "235,Linear Separability,\n"+
                "236,Link Analysis,\n"+
                "237,Link-Based Classification,\n"+
                "238,General-to-Specific Search,\n"+
                "239,Condensed Vector Machines: Learning Fast Machine for Large Data,D. D. Nguyen and K. Matsumoto and Y. Takishima and Kenji Hashimoto\n"+
                "240,Use of machine learning techniques to analyse the risk associated with mine sludge deposits,Maria Araujo and T. Rivas and Eduardo Giraldez and Javier Taboada\n"+
                "241,Learning Graphical Models,Kevin B. Korb\n"+
                "242,Learning Graphical Models,Kevin B. Korb\n"+
                "243,Clustering,\n"+
                "244,Generalization Performance,\n"+
                "245,Generalized Delta Rule,\n"+
                "246,Relational Learning,Jan Struyf and Hendrik Blockeel\n"+
                "247,Bayesian Methods,Wray L. Buntine\n"+
                "248,Decomposing the tensor kernel support vector machine for neuroscience data with structured labels,David R. Hardoon and John Shawe{-}Taylor\n"+
                "249,Genetic Attribute Construction,\n"+
                "250,Beam Search,Claude Sammut\n"+
                "251,Active Learning,David Cohn\n"+
                "252,Active Learning,David Cohn\n"+
                "253,Clonal Selection,\n"+
                "254,Apprenticeship Learning,\n"+
                "255,Squared Error,\n"+
                "256,Coevolutionary Learning,R. Paul Wiegand\n"+
                "257,Statistical Learning,\n"+
                "258,Association Rule,Hannu Toivonen\n"+
                "259,Basket Analysis,Hannu Toivonen\n"+
                "260,Frequent Itemset,Hannu Toivonen\n"+
                "261,Metaheuristic,Marco Dorigo and Mauro Birattari and Thomas Stutzle\n"+
                "262,A comparison of machine learning techniques for modeling human-robot interaction with children with autism,Elaine Short and David Feil-Seifer and Maja J. Mataric\n"+
                "263,Feature Selection in Text Mining,Dunja Mladenic\n"+
                "264,Local Feature Selection,\n"+
                "265,Liquid State Machine,\n"+
                "266,Logical Consequence,\n"+
                "267,Logic Program,\n"+
                "268,Locally Weighted Learning,\n"+
                "269,Logical Regression Tree,\n"+
                "270,Laplace Estimate,\n"+
                "271,Conjunctive Normal Form,Bernhard Pfahringer\n"+
                "272,Expectation Propagation,Tom Heskes\n"+
                "273,Language Bias,\n"+
                "274,Abstract data types and Modula-2 - a worked example of design using data abstraction,Richard J. Mitchell\n"+
                "275,Constructing knowledge from multivariate spatiotemporal data: integrating geographical visualization with knowledge discovery in database methods,Alan M. MacEachren and Monica Wachowicz and Robert M. Edsall and Daniel Haug and Raymon Masters\n"+
                "276,Label,\n"+
                "277,Group Detection,Hossam Sharara and Lise Getoor\n"+
                "278,Self-Organizing Maps,Samuel Kaski\n"+
                "279,Learning Bayesian Networks,\n"+
                "280,Filtering artificial texts with statistical machine learning techniques,Thomas Lavergne and Tanguy Urvoy and Franccois Yvon\n"+
                "281,Machine-learning techniques for building a diagnostic model for very mild dementia,Rong Chen and Edward Herskovits\n"+
                "282,Item,\n"+
                "283,Density-Based Clustering,Jorg Sander\n"+
                "284,Shape functional optimization with restrictions boosted with machine learning techniques,M. F. Lopez and J. Martinez and Jose M. Matias and Javier Taboada and Jose A. Vilan\n"+
                "285,Adaptive Real-Time Dynamic Programming,Andrew G. Barto\n"+
                "286,Kind,\n"+
                "287,Causality,Ricardo Bezerra de Andrade e Silva\n"+
                "288,Co-Training,\n"+
                "289,Applying Machine Learning Techniques to Improve User Acceptance on Ubiquitous Environment,Djallel Bouneffouf\n"+
                "290,Autonomous driving: {A} comparison of machine learning techniques by means of the prediction of lane change behavior,Urun Dogan and Johann Edelbrunner and Ioannis Iossifidis\n"+
                "291,Dimensionality Reduction,Michail Vlachos\n"+
                "292,Out-of-Sample Data,\n"+
                "293,Dependency Directed Backtracking,\n"+
                "294,Transductive Learning for Spatial Data Classification,Michelangelo Ceci and Annalisa Appice and Donato Malerba\n"+
                "295,Semantics of Data Types, International Symposium, Sophia-Antipolis, France, June 27-29, 1984, Proceedings,\n"+
                "296,Decision Threshold,\n"+
                "297,Clustering with Constraints,\n"+
                "298,Evolutionary Games,Moshe Sipper\n"+
                "299,Inverse Reinforcement Learning,Pieter Abbeel and Andrew Y. Ng\n"+
                "300,Cascor,\n"+
                "301,Link Prediction,Galileo Namata and Lise Getoor\n"+
                "302,Cannot-Link Constraint,\n"+
                "303,Ensemble Learning,Gavin Brown\n"+
                "304,Identification of Individualized Feature Combinations for Survival Prediction in Breast Cancer: {A} Comparison of Machine Learning Techniques,Leonardo Vanneschi and Antonella Farinaccio and Mario Giacobini and Giancarlo Mauri and Marco Antoniotti and Paolo Provero\n"+
                "305,Bottom Clause,\n"+
                "306,Apriori Algorithm,Hannu Toivonen\n"+
                "307,Query-Based Learning,Sanjay Jain and Frank Stephan\n"+
                "308,Smart data structures: an online machine learning approach to multicore data structures,Jonathan Eastep and David Wingate and Anant Agarwal\n"+
                "309,Online pattern recognition and machine learning techniques for computer-vision: Theory and applications,Bogdan Raducanu and Jordi Vitria and Ales Leonardis\n"+
                "310,City Block Distance,\n"+
                "311,Combining Machine Learning and Optimization Techniques to Determine 3-D Structures of Polypeptides,Marcio Dorn and Luciana S. Buriol and Luis C. Lamb\n"+
                "312,Discrete Attribute,\n"+
                "313,Category,\n"+
                "314,Advances in Database Technology - {EDBT} 2002, 8th International Conference on Extending Database Technology, Prague, Czech Republic, March 25-27, Proceedings,\n"+
                "315,Advances in Database Technology - {EDBT} 2000, 7th International Conference on Extending Database Technology, Konstanz, Germany, March 27-31, 2000, Proceedings,\n"+
                "316,Spectrum Evaluation on Multispectral Images by Machine Learning Techniques,Marcin Michalak and Adam Switonski\n"+
                "317,Average-Reward Reinforcement Learning,Prasad Tadepalli\n"+
                "318,Evolutionary Robotics,Phil Husbands\n"+
                "319,Curse of Dimensionality,Eamonn J. Keogh and Abdullah Mueen\n"+
                "320,Constraint Databases, Proceedings of the 1st International Symposium on Applications of Constraint Databases, CDB'04, Paris, June 12-13, 2004,\n"+
                "321,Advanced machine learning techniques for microarray spot quality classification,Loris Nanni and Alessandra Lumini and Sheryl Brahnam\n"+
                "322,Autonomous Helicopter Flight Using Reinforcement Learning,Adam Coates and Pieter Abbeel and Andrew Y. Ng\n"+
                "323,BP,\n"+
                "324,Breakeven Point,\n"+
                "325,Bounded Differences Inequality,\n"+
                "326,Bootstrap Sampling,\n"+
                "327,Binning,\n"+
                "328,Blog Mining,\n"+
                "329,Evolutionary Clustering,David Corne and Julia Handl and Joshua D. Knowles\n"+
                "330,Bilingual Lexicon Extraction,\n"+
                "331,Classification Algorithms,\n"+
                "332,Characteristic,\n"+
                "333,CC,\n"+
                "334,Causal Discovery,\n"+
                "335,Categorization,\n"+
                "336,Case-Based Learning,\n"+
                "337,Categorical Attribute,\n"+
                "338,Nonstandard Criteria in Evolutionary Learning,Michele Sebag\n"+
                "339,Evolutionary Computation in Economics,Serafin Martinez-Jaramillo and Biliana Alexandrova-Kabadjova and Alma Lilia Garcia-Almanza and Tonatiuh Pena Centeno\n"+
                "340,Exploring New Ways of Utilizing Automated Clustering and Machine Learning Techniques in Information Visualization,Johann Schrammel\n"+
                "341,A Comparative Study of Blog Comments Spam Filtering with Machine Learning Techniques,Christian Romero and Jose Mario Garcia Valdez and Arnulfo Alanis Garza\n"+
                "342,A Comparative Study of Blog Comments Spam Filtering with Machine Learning Techniques,Christian Romero and Jose Mario Garcia Valdez and Arnulfo Alanis Garza\n"+
                "343,Machine Learning Techniques for Passive Network Inventory,Jerome Franccois and Humberto J. Abdelnur and Radu State and Olivier Festor\n"+
                "344,Backpropagation,Paul W. Munro\n"+
                "345,Objects and Databases, International Symposium, Sophia Antipolis, France, June 13, 2000, Proceedings,\n"+
                "346,Neuroevolution,Risto Miikkulainen\n"+
                "347,Neuron,Risto Miikkulainen\n"+
                "348,Predicting football scores using machine learning techniques,Josip Hucaljuk and Alen Rakipovic\n"+
                "349,MultiBoosting,Geoffrey I. Webb\n"+
                "350,Interactive Image Segmentation Using Machine Learning Techniques,Yusuf Artan\n"+
                "351,Evolutionary Computation in Finance,Serafin Martinez-Jaramillo and Alma Lilia Garcia-Almanza and Biliana Alexandrova-Kabadjova and Tonatiuh Pena Centeno\n"+
                "352,Artificial Life,\n"+
                "353,Bayesian Nonparametric Models,Peter Orbanz and Yee Whye Teh\n"+
                "354,Applying Machine Learning Techniques for Knowledge-Based Credit Verification,David A. Ostrowski and George Schleis\n"+
                "355,Agent-Based Modeling and Simulation,\n"+
                "356,Agent,\n"+
                "357,Adaptive System,\n"+
                "358,Adaptive Control Processes,\n"+
                "359,Adaboost,\n"+
                "360,Actions,\n"+
                "361,ACO,\n"+
                "362,Accuracy,\n"+
                "363,Absolute Error Loss,\n"+
                "364,Equation Discovery,Ljupco Todorovski\n"+
                "365,Greedy Search Approach of Graph Mining,Lawrence B. Holder\n"+
                "366,Decision Lists and Decision Trees,Johannes Furnkranz\n"+
                "367,Detail,\n"+
                "368,Scaling Datalog for Machine Learning on Big Data,Yingyi Bu and Vinayak R. Borkar and Michael J. Carey and Joshua Rosen and Neoklis Polyzotis and Tyson Condie and Markus Weimer and Raghu Ramakrishnan\n"+
                "369,DBN,\n"+
                "370,Workshop on Managing Systems via Log Analysis and Machine Learning Techniques, SLAML'10, Vancouver, BC, Canada, October 3, 2010,\n"+
                "371,Linear Regression,Novi Quadrianto and Wray L. Buntine\n"+
                "372,Data Preprocessing,\n"+
                "373,Active Learning Theory,Sanjoy Dasgupta\n"+
                "374,Metalearning,Pavel Brazdil and Ricardo Vilalta and Christophe G. Giraud{-}Carrier and Carlos Soares\n"+
                "375,Clustering Aggregation,\n"+
                "376,Clustering with Advice,\n"+
                "377,Concept Drift,Claude Sammut and Michael Bonnell Harries\n"+
                "378,Cluster Ensembles,\n"+
                "379,Cluster Editing,\n"+
                "380,Cluster Optimization,\n"+
                "381,Click-Through Rate {(CTR)},\n"+
                "382,Closest Point,\n"+
                "383,Clause,\n"+
                "384,Clause,\n"+
                "385,Classification Tree,\n"+
                "386,Collection,\n"+
                "387,Collaborative Filtering,\n"+
                "388,Commercial Email Filtering,\n"+
                "389,Coevolutionary Computation,\n"+
                "390,Coevolution,\n"+
                "391,Clustering with Qualitative Information,\n"+
                "392,Overview of the workshop on managing large-scale systems via the analysis of system logs and the application of machine learning techniques,Peter Bodik\n"+
                "393,{ROC} Analysis,Peter A. Flach\n"+
                "394,Generalization Bounds,Mark D. Reid\n"+
                "395,Boltzmann Machines,Geoffrey E. Hinton\n"+
                "396,Exploiting Multilingual Grammars and Machine Learning Techniques to Build an Event Extraction System for Portuguese,Vanni Zavarella and Hristo Tanev and Jens P. Linge and Jakub Piskorski and Martin Atkinson and Ralf Steinberger\n"+
                "397,Employing Machine Learning Techniques for Data Enrichment: Increasing the Number of Samples for Effective Gene Expression Data Analysis,Utku Erdogdu and Mehmet Tan and Reda Alhajj and Faruk Polat and Douglas J. Demetrick and Jon G. Rokne\n"+
                "398,Speedup Learning,Alan Fern\n"+
                "399,Logic of Generality,Luc De Raedt\n"+
                "400,Advances in Database Technology - EDBT'88, Proceedings of the International Conference on Extending Database Technology, Venice, Italy, March 14-18, 1988,\n"+
                "401,Cost-Sensitive Classification,\n"+
                "402,Using Machine-Learning Techniques for Plant Communities Classification,Ahmad A. M. Al{-}Modayan and Mohammed Abdel Razek\n"+
                "403,An Investigation of Missing Data Methods for Classification Trees Applied to Binary Response Data,Yufeng Ding and Jeffrey S. Simonoff\n"+
                "404,Spatial Multi-Database Topological Continuity and Indexing: {A} Step Towards Seamless {GIS} Data Interoperability,Robert Laurini\n"+
                "405,Data Driven Design Optimization Methodology: {A} Dynamic Data Driven Application System,Doyle D. Knight\n"+
                "406,Inductive Logic Programming,Luc De Raedt\n"+
                "407,Predicting Breast Screening Attendance Using Machine Learning Techniques,Vikraman Baskaran and Aziz Guergachi and Rajeev K. Bali and Raouf N. Gorgui{-}Naguib\n"+
                "408,Machine Learning for Author Affiliation within Web Forums - Using Statistical Techniques on {NLP} Features for Online Group Identification,Jeffrey Ellen and Shibin Parameswaran\n"+
                "409,Cross-Language Information Retrieval,\n"+
                "410,Quest for efficient option pricing prediction model using machine learning techniques,B. V. Phani and Bala Chandra and Vijay Raghav\n"+
                "411,Formal Concept Analysis,Gemma C. Garriga\n"+
                "412,Data Sharing Model for Sequence Alignment to Reduce Database Retrieve,Min Jun Kim and Jai{-}Hoon Kim and Jin{-}Won Jung and Weontae Lee\n"+
                "413,Co-Reference Resolution,\n"+
                "414,Cascade-Correlation,Thomas R. Shultz and Scott E. Fahlman\n"+
                "415,Example-Based Programming,\n"+
                "416,Graph Kernels,Thomas Gartner and Tamas Horvath and Stefan Wrobel\n"+
                "417,Advances in Intelligent Data Analysis, Reasoning about Data, Second International Symposium, IDA-97, London, UK, August 4-6, 1997, Proceedings,\n"+
                "418,Machine Learning Techniques and Mammographic Risk Assessment,Neil MacParthalain and Reyer Zwiggelaar\n"+
                "419,Diagonal Replication on Grid for Efficient Access of Data in Distributed Database Systems,Mustafa Mat Deris and N. Bakar and M. Rabiei and H. M. Suzuri\n"+
                "420,Error Correcting Output Codes,\n"+
                "421,Estimation of Density Level Sets,\n"+
                "422,Protein model assessment via machine learning techniques,Anjum Reyaz-Ahmed and Robert W. Harrison and Yan-Qing Zhang\n"+
                "423,Evaluation,\n"+
                "424,Evaluation Set,\n"+
                "425,Clustering Ensembles,\n"+
                "426,Evolutionary Computation,\n"+
                "427,Privacy-Preserving Data Mining,\n"+
                "428,Memory-Based,\n"+
                "429,An Efficient Content Based Image Retrieval Framework Using Machine Learning Techniques,B. Celia and I. Felci Rajam\n"+
                "430,Learning from Complex Data,\n"+
                "431,Learning from Complex Data,\n"+
                "432,Machine Learning Techniques for Predicting Web Server Anomalies,Marin Marinov and Dimiter R. Avresky\n"+
                "433,A comparison of machine learning techniques for detection of drug target articles,Roxana Danger and Isabel Segura-Bedmar and Paloma Martinez Fernandez and Paolo Rosso\n"+
                "434,Manhattan Distance,Susan Craw\n"+
                "435,Learning from Nonpropositional Data,\n"+
                "436,Learning from Nonvectorial Data,\n"+
                "437,Learning from Nonvectorial Data,\n"+
                "438,Evolving Neural Networks,\n"+
                "439,Artificial Neural Networks,\n"+
                "440,Bias-Variance Trade-offs: Novel Applications,Dev G. Rajnarayan and David Wolpert\n"+
                "441,Markov Chain Monte Carlo,Claude Sammut\n"+
                "442,Density Estimation,Claude Sammut\n"+
                "443,Greedy Search,Claude Sammut\n"+
                "444,Genetic and Evolutionary Algorithms,Claude Sammut\n"+
                "445,Behavioral Cloning,Claude Sammut\n"+
                "446,Concept Learning,Claude Sammut\n"+
                "447,Leave-One-Out Error,\n"+
                "448,Analytical Learning,\n"+
                "449,Projective Clustering,Cecilia M. Procopiuc\n"+
                "450,AIS,\n"+
                "451,Agent-Based Simulation Models,\n"+
                "452,Agent-Based Computational Models,\n"+
                "453,Clustering of Nonnumerical Data,\n"+
                "454,Fuzzy machine learning and data mining,Eyke Hullermeier\n"+
                "455,Instance-Based Learning,Eamonn J. Keogh\n"+
                "456,Grammatical Tagging,\n"+
                "457,Automatic localization and annotation of facial features using machine learning techniques,Paul C. Conilione and Dianhui Wang\n"+
                "458,Evaluation Data,\n"+
                "459,Automatic Quality Inspection of Percussion Cap Mass Production by Means of 3D Machine Vision and Machine Learning Techniques,Alberto Tellaeche and Ramon Arana and Aitor Ibarguren and Jose Maria Martinez-Otzeta\n"+
                "460,Enhancing Content-Based Image Retrieval Using Machine Learning Techniques,Qinmin Vivian Hu and Zheng Ye and Jimmy Xiangji Huang\n"+
                "461,Big Data [Guest editorial],Francis J. Alexander and Adolfy Hoisie and Alexander S. Szalay\n"+
                "462,Collective Classification,Prithviraj Sen and Galileo Namata and Mustafa Bilgic and Lise Getoor\n"+
                "463,Instance-Based Reinforcement Learning,William D. Smart\n"+
                "464,Genetic Programming,Moshe Sipper\n"+
                "465,Improving User Stereotypes through Machine Learning Techniques,Teresa Maria Altomare Basile and Floriana Esposito and Stefano Ferilli\n"+
                "466,Linear Discriminant,Novi Quadrianto and Wray L. Buntine\n"+
                "467,Multi-stage classification of Gyrodactylus species using machine learning and feature selection techniques,Rozniza Ali and Amir Hussain and James E. Bron and Andrew P. Shinn\n"+
                "468,Multi-Relational Data Mining,Luc De Raedt\n"+
                "469,Belief State Markov Decision Processes,\n"+
                "470,Higher-Order Logic,John Lloyd\n"+
                "471,Class,Chris Drummond\n"+
                "472,Semi-Supervised Text Processing,Ion Muslea\n"+
                "473,Entity Resolution,Indrajit Bhattacharya and Lise Getoor\n"+
                "474,Machine Learning Techniques for Prostate Ultrasound Image Diagnosis,Aboul Ella Hassanien and Hameed Al-Qaheri and Vaclav Snasel and James F. Peters\n"+
                "475,Evaluating imaging biomarkers for neurodegeneration in pre-symptomatic Huntington's disease using machine learning techniques,Angela Rizk-Jackson and Diederick Stoffers and Sarah Sheldon and Joshua M. Kuperman and Anders M. Dale and Jody Goldstein and Jody Corey-Bloom and Russell A. Poldrack and Adam R. Aron\n"+
                "476,On the Predictability of Software Efforts using Machine Learning Techniques,Wen Zhang and Ye Yang and Qing Wang\n"+
                "477,Rules in Database Systems, Second International Workshop, {RIDS} '95, Glyfada, Athens, Greece, September 25 - 27, 1995, Proceedings,\n"+
                "478,Model Trees,Luis Torgo\n"+
                "479,Clause Learning,\n"+
                "480,Clause Learning,\n"+
                "481,Comparison of Machine Learning Techniques using the {WEKA} Environment for Prostate Cancer Therapy Plan,Nikolaos Mallios and Elpiniki I. Papageorgiou and Michael Samarinas\n"+
                "482,Reinforcement Learning in Structured Domains,\n"+
                "483,Record Linkage,\n"+
                "484,Rank Correlation,\n"+
                "485,Bayesian Model Averaging,\n"+
                "486,Clustering from Data Streams,Joao Gama\n"+
                "487,Bayes Adaptive Markov Decision Processes,\n"+
                "488,Baum-Welch Algorithm,\n"+
                "489,Semi-Supervised Learning,Xiaojin Zhu\n"+
                "490,Bias-Variance-Covariance Decomposition,\n"+
                "491,Case-Based Reasoning,Susan Craw\n"+
                "492,Complexity of Inductive Inference,Sanjay Jain and Frank Stephan\n"+
                "493,Bias Variance Decomposition,\n"+
                "494,Average-Cost Optimization,\n"+
                "495,Classification,Chris Drummond\n"+
                "496,Latent Class Model,\n"+
                "497,AUC,\n"+
                "498,Data-Mining Based Skin-Color Modeling Using the {ECL} Skin-Color Images Database,Mohamed Hammami and Dzmitry V. Tsishkou and Liming Chen\n"+
                "499,Gaussian Process Reinforcement Learning,Yaakov Engel\n"+
                "500,Learning from Structured Data,Tamas Horvath and Stefan Wrobel\n"+
                "501,Learning from Structured Data,Tamas Horvath and Stefan Wrobel\n"+
                "502,Passive Learning,\n"+
                "503,{PAC-MDP} Learning,\n"+
                "504,Identifying Relevant Data for a Biological Database: Handcrafted Rules versus Machine Learning,Aditya Kumar Sehgal and Sanmay Das and Keith Noto and Milton H. Saier Jr. and Charles Elkan\n"+
                "505,Basic Lemma,\n"+
                "506,Partitional Clustering,Xin Jin and Jiawei Han\n"+
                "507,Relational Reinforcement Learning,Kurt Driessens\n"+
                "508,Rules in Database Systems, Third International Workshop, {RIDS} '97, Skovde, Sweden, June 26-28, 1997, Proceedings,\n"+
                "509,Evolutionary Grouping,\n"+
                "510,Evolutionary Feature Synthesis,\n"+
                "511,Example,\n"+
                "512,Bake-Off,\n"+
                "513,Experience Curve,\n"+
                "514,Explanation,\n"+
                "515,Experience-Based Reasoning,\n"+
                "516,Explanation-Based Generalization for Planning,\n"+
                "517,Backprop,\n"+
                "518,Average-Payoff Reinforcement Learning,\n"+
                "519,Databases in Telecommunications II, {VLDB} 2001 International Workshop, DBTel 2001 Rome, Italy, September 10, 2001, Proceedings,\n"+
                "520,Quality Threshold Clustering,Xin Jin and Jiawei Han\n"+
                "521,Correlation-Based Learning,\n"+
                "522,Continual Learning,\n"+
                "523,Continuous Attribute,\n"+
                "524,Contrast Set Mining,\n"+
                "525,Content-Based Filtering,\n"+
                "526,Content-Based Recommending,\n"+
                "527,Context-Sensitive Learning,\n"+
                "528,Consensus Clustering,\n"+
                "529,Content Match,\n"+
                "530,Computational Discovery of Quantitative Laws,\n"+
                "531,Confirmation Theory,\n"+
                "532,Competitive Coevolution,\n"+
                "533,Complex Adaptive System,\n"+
                "534,Community Detection,\n"+
                "535,Comparable Corpus,\n"+
                "536,Candidate-Elimination Algorithm,\n"+
                "537,Database Systems of the 90s, International Symposium, Muggelsee, Berlin, Germany, November 5-7, 1990, Proceedings,\n"+
                "538,Rule Learning,Johannes Furnkranz\n"+
                "539,Ant Colony Optimization,Marco Dorigo and Mauro Birattari\n"+
                "540,Regression,Novi Quadrianto and Wray L. Buntine\n"+
                "541,Advances in Object-Oriented Database Systems, 2nd International Workshop on Object-Oriented Database Systems, Bad Munster am Stein-Ebernburg, FRG, September 27-30, 1988, Proceedings,\n"+
                "542,{PAC} Learning,Thomas Zeugmann\n"+
                "543,Machine Learning and Game Playing,Johannes Furnkranz\n"+
                "544,Constrained Clustering,Kiri L. Wagstaff\n"+
                "545,Machine Learning Techniques for Understanding Context and Process,Marko Grobelnik and Dunja Mladenic and Gregor Leban and Tadej Stajner\n"+
                "546,The Combination of Clinical, Dose-Related and Imaging Features Helps Predict Radiation-Induced Normal-Tissue Toxicity in Lung-cancer Patients - An in-silico Trial Using Machine Learning Techniques,Georgi I. Nalbantov and Andre Dekker and Dirk De Ruysscher and Philippe Lambin and Evgueni N. Smirnov\n"+
                "547,Negative Correlation Learning,\n"+
                "548,Attribute,Chris Drummond\n"+
                "549,Mobile Data Management, Second International Conference, {MDM} 2001, Hong Kong, China, January 8-10, 2001, Proceedings,\n"+
                "550,Cost Function,\n"+
                "551,Mixture Model,Rohan A. Baxter\n"+
                "552,Decision List,Johannes Furnkranz\n"+
                "553,Bias Specification Language,Hendrik Blockeel\n"+
                "554,Cooperative Coevolution,\n"+
                "555,Contextual Advertising,\n"+
                "556,Instance Space,\n"+
                "557,Information Retrieval,\n"+
                "558,Inductive Synthesis,\n"+
                "559,Inequalities,\n"+
                "560,Intent Recognition,\n"+
                "561,Internal Model Control,\n"+
                "562,Implication,\n"+
                "563,Immunocomputing,\n"+
                "564,Immune Network,\n"+
                "565,Immune-Inspired Computing,\n"+
                "566,Immune Computing,\n"+
                "567,Inductive Learning,\n"+
                "568,Inductive Program Synthesis,\n"+
                "569,Inductive Inference,\n"+
                "570,Induction as Inverted Deduction,\n"+
                "571,In-Sample Evaluation,\n"+
                "572,Indirect Reinforcement Learning,\n"+
                "573,Connection Strength,\n"+
                "574,Competitive Learning,\n"+
                "575,Compositional Coevolution,\n"+
                "576,Correlation Clustering,Anthony Wirth\n"+
                "577,Feature Subset Selection,\n"+
                "578,Medicine: Applications of Machine Learning,Katharina Morik\n"+
                "579,First-Order Logic,Peter A. Flach\n"+
                "580,First-Order Predicate Calculus,\n";

var yelp_search_text= "business_id,name,full_address\n"+
                "580,First-Order Predicate Calculus,\n";