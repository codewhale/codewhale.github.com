function nextHdlr()
{
	if (tbHdlr.chars.length - (tbHdlr.idx + 10) > 0)
		tbHdlr.idx += 10;

	console.log(tbHdlr.idx + '/' + tbHdlr.chars.length);

	for(i=0;i<10;i++)
	{
		var chr = tbHdlr.chars[tbHdlr.idx+i]
		if (chr)
		{
			$('#cj' + i)[0].innerHTML = chr;
		}
		else
			$('#cj' + i)[0].innerHTML = "";
	}
	var d = document.getElementById('cjseq');
	d.focus();
}

function prevHdlr()
{
	console.log('idx: ' + tbHdlr.idx);
	if ((tbHdlr.idx - 10) >= 0)
		tbHdlr.idx -= 10;

	for(i=0;i<10;i++)
	{
		var chr = tbHdlr.chars[tbHdlr.idx+i]
		if (chr)
		{
			$('#cj' + i)[0].innerHTML = chr;
		}
		else
			$('#cj' + i)[0].innerHTML = "";
	}
	var d = document.getElementById('cjseq');
	d.focus();
}

function tbHdlr(e)
{
	var typedChar = String.fromCharCode(e.keyCode)
	console.log('k:' + e.keyCode)

	if ( typedChar >= '0' && typedChar <= '9' )
	{
		var d = document.getElementById('typing');
		var selChar = tbHdlr.chars[typedChar - '0']
		if (selChar)
			d.value += selChar
		var d = document.getElementById('cjseq');
		d.value = ''
	}
	else if ( typedChar == ' ')
	{
		//FIXME if you r typing super fast, the tbHdlr.chars may not be ready yet
		var d = document.getElementById('typing');
		var selChar = tbHdlr.chars[0]
		if (selChar)
			d.value += selChar

		var d = document.getElementById('cjseq');
		d.value = ''
	}
	else if ( e.keyCode == 189)	// '-' for clear all textarea
	{
		var d = document.getElementById('typing');
		d.value = ''

		var d = document.getElementById('cjseq');
		d.value = ''
	}
	else
	{
		//TODO only a-z handling

		var d = document.getElementById('cjseq');

		if (d.value.indexOf('.') != -1)
		{
			wildcard = d.value.replace('.', '[a-z]*');
			console.log('regex: ' + wildcard);

			var re = new RegExp(',(' + wildcard + ') ([ \u0080-\uFFFF]+)', "gi")
		}
		else
		{
			//TODO separate the regex search and result into separate function for ease of reuse
			var re = new RegExp(',(' + d.value + '[a-z]*) ([ \u0080-\uFFFF]+)', "g")
		}


		console.log('re: ' + re.source);
		//multiple match, ignore case

		var hits = new Array();
		while( hit = re.exec(Code) )
		{
			var code = hit[1]
			var cjchars = hit[2].split(' ')
			hits.push([code, cjchars])
		}
		console.log(hits.length)
		console.log(hits[0])

		tbHdlr.chars = new Array();
		for(i=0;i<hits.length;i++)
		{
			cjchars = hits[i][1]
			for(j=0;j<cjchars.length;j++)
				tbHdlr.chars.push(cjchars[j])
		} console.log(tbHdlr.chars.length)

		tbHdlr.idx = 0;
		
		for(i=0;i<10;i++)
		{
			if (i < tbHdlr.chars.length)
			{
				$('#cj' + i)[0].innerHTML = tbHdlr.chars[i] + '<sub>' + i + '</sub>';
			}
			else
				$('#cj' + i)[0].innerHTML = "";
		}
	}
}

function onload()
{
	var d = document.getElementById('cjseq');
	d.focus();

	$('#next').click(nextHdlr);
	$('#prev').click(prevHdlr);

	$('#typing').click(
		function(){
			document.getElementById('typing').select();
			execCommand("Copy")
		}
	);
	for(i=0;i<10;i++)
	{
		$('#cj' + i).click(function() {
			$(this).effect("highlight", {}, 1000);
			var d = $(this)[0]
			console.log(d.innerHTML);

			//FIXME if you r typing super fast, the tbHdlr.chars may not be ready yet
			var d = document.getElementById('typing');
			var selChar = $(this)[0].innerHTML;
			if (selChar)
				d.value += selChar

			var d = document.getElementById('cjseq');
			d.value = ''

			//refocus textfield after click
			var d = document.getElementById('cjseq');
			d.focus();
		});

	}
}

