<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title></title>
<link
	href="app/lib/ext-5.1.0/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css"
	rel="stylesheet" />
<!--Gantt styles-->
<link href="app/lib/gantt-3.0.6/resources/css/sch-all.css"
	rel="stylesheet" />
<link href="app/lib/gantt-3.0.6/resources/css/sch-gantt-all.css"
	rel="stylesheet" />
<link href="app/src/resources/css/style.css" rel="stylesheet" />
<link href="app/src/resources/css/gantt-schduler.css" rel="stylesheet" />
<link href="app/src/resources/css/timeline-themes.css" rel="stylesheet" />
<link href="app/src/resources/css/timeline.css" rel="stylesheet" />
<link
	href="app/src/resources/fonts/font-awesome-4.4.0/css/font-awesome.min.css"
	rel="stylesheet" />
<!-- Application styles -->
<!--<link href="resources/app.css" rel="stylesheet" type="text/css" />-->

<!--[if lt IE 9]>
    <link href="resources/css/theme-ie8.css" rel="stylesheet" type="text/css" />
    <![endif]-->
<!--Ext lib -->
<style>
.top-nav-icon-sm {
	font-size: 18px;
}

.top-nav-icon-md {
	font-size: 22px;
}

.top-nav-icon-lg {
	font-size: 25px;
}

.tsk-b{
	font-weight:bold;
}

.tsk-i{
	font-style:italic;
}

.tsk-u{
	text-decoration: underline;
}

.tsk-strk{
	text-decoration: line-through;
}
</style>
<script src="app/lib/ext-5.1.0/ext-all.js" type="text/javascript"></script>

<!-- todo: temporary, for creating / opening existing project from query string -->
<script type="text/javascript">
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex
				.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(
				/\+/g, " "));
	}

	var param = getParameterByName('projectid');
	if (param && param != '' && !isNaN(param)) {
		ProjectId = parseInt(param);
	} else {
		ProjectId = 1;
	}
</script>
<!--Gantt components-->
<script src="app/lib/gantt-3.0.6/gnt-all.js"></script>
<script src="app/lib/gantt-3.0.6/sch-all.js"></script>
<script src="app/src/app.js"></script>
</head>
<body>

</body>
</html>
